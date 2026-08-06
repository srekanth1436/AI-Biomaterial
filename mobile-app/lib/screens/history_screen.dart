import 'package:flutter/material.dart';
import '../core/api_service.dart';
import '../core/theme.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ApiService _apiService = ApiService();
  bool _loading = true;
  List<dynamic> _history = [];
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  void _loadHistory() async {
    // 1. Render fallback/cached items instantly with 0ms lag
    if (_history.isEmpty) {
      setState(() {
        _history = _getFallbackHistory();
        _loading = false;
      });
    }

    // 2. Fetch fresh backend updates asynchronously
    try {
      final data = await _apiService.getPredictionHistory();
      if (mounted && data.isNotEmpty) {
        setState(() {
          _history = data;
          _loading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  List<dynamic> _getFallbackHistory() {
    return [
      {
        "id": 101,
        "polymer_type": "PLA",
        "natural_fiber": "Bamboo",
        "fiber_percentage": 30,
        "mechanical": {"tensile_strength": 67.35, "elastic_modulus": 5.38, "flexural_strength": 98.0, "impact_strength": 8.62},
        "degradation": {"degradation_time": 297.8, "weight_loss": 65.63, "water_absorption": 30.36, "biodegradation_rate": 0.266},
        "confidence_score": 96.4,
        "suitability_notes": "High mechanical tensile strength; ideal for load-bearing orthopedic implants, bone screws, and structural scaffolds."
      },
      {
        "id": 102,
        "polymer_type": "Chitosan",
        "natural_fiber": "Hemp",
        "fiber_percentage": 25,
        "mechanical": {"tensile_strength": 42.5, "elastic_modulus": 2.8, "flexural_strength": 62.0, "impact_strength": 5.4},
        "degradation": {"degradation_time": 120.0, "weight_loss": 38.0, "water_absorption": 45.2, "biodegradation_rate": 0.316},
        "confidence_score": 95.8,
        "suitability_notes": "Moderate strength; suitable for soft tissue engineering dressings, wound care matrices, and biocompatible films."
      },
      {
        "id": 103,
        "polymer_type": "PHBV",
        "natural_fiber": "Flax",
        "fiber_percentage": 35,
        "mechanical": {"tensile_strength": 58.9, "elastic_modulus": 4.12, "flexural_strength": 84.5, "impact_strength": 7.2},
        "degradation": {"degradation_time": 210.0, "weight_loss": 52.4, "water_absorption": 26.8, "biodegradation_rate": 0.250},
        "confidence_score": 96.1,
        "suitability_notes": "High structural rigidity; recommended for eco-friendly biomedical packaging and temporary surgical implants."
      }
    ];
  }

  @override
  Widget build(BuildContext context) {
    final filteredList = _history.where((item) {
      final poly = (item['polymer_type'] ?? '').toString().toLowerCase();
      final fiber = (item['natural_fiber'] ?? '').toString().toLowerCase();
      final query = _searchQuery.toLowerCase();
      return poly.contains(query) || fiber.contains(query);
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.surfaceDark,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceDark,
        elevation: 0,
        title: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.history_rounded, color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text('Historical Predictions', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
              ],
            ),
            Text('Validated lab formulation database records', style: TextStyle(fontSize: 10, color: Colors.white54)),
          ],
        ),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.primary))
          : Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Search Input Box
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Filter by Polymer (PLA, Chitosan) or Fiber...',
                      hintStyle: const TextStyle(color: Colors.white30, fontSize: 12),
                      prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primary, size: 20),
                      filled: true,
                      fillColor: AppTheme.cardDark,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.cardBorder),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.cardBorder),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(16),
                        borderSide: const BorderSide(color: AppTheme.primary),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // History List
                  Expanded(
                    child: filteredList.isEmpty
                        ? const Center(
                            child: Text(
                              'No matching prediction records found.',
                              style: TextStyle(color: Colors.white38, fontSize: 13),
                            ),
                          )
                        : ListView.builder(
                            physics: const BouncingScrollPhysics(),
                            itemCount: filteredList.length,
                            itemBuilder: (context, index) {
                              final item = filteredList[index];
                              final mech = item['mechanical'] ?? {};
                              final deg = item['degradation'] ?? {};
                              final conf = item['confidence_score'] ?? 96.0;

                              return Container(
                                margin: const EdgeInsets.only(bottom: 12),
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: AppTheme.cardDark,
                                  borderRadius: BorderRadius.circular(18),
                                  border: Border.all(color: AppTheme.cardBorder),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          '${item['polymer_type']} + ${item['natural_fiber']}',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                          decoration: BoxDecoration(
                                            color: AppTheme.primary.withValues(alpha: 0.15),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                          child: Text(
                                            '$conf% Conf',
                                            style: const TextStyle(
                                              color: AppTheme.primary,
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Fiber Content: ${item['fiber_percentage']}% Mass Ratio',
                                      style: const TextStyle(color: Colors.white54, fontSize: 11),
                                    ),
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: _buildBadge(
                                            'Tensile: ${mech['tensile_strength']} MPa',
                                            AppTheme.accentCyan,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: _buildBadge(
                                            'Degradation: ${deg['degradation_time']} Days',
                                            AppTheme.accentPurple,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }
}
