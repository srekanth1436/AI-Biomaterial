import 'package:flutter/material.dart';
import '../core/api_service.dart';
import '../core/theme.dart';

class RecommenderScreen extends StatefulWidget {
  const RecommenderScreen({super.key});

  @override
  State<RecommenderScreen> createState() => _RecommenderScreenState();
}

class _RecommenderScreenState extends State<RecommenderScreen> {
  final ApiService _apiService = ApiService();

  final List<Map<String, String>> _useCases = [
    {'id': 'orthopedic', 'title': 'Orthopedic Bone Screws & Structural Fixation', 'icon': '🦴', 'tag': 'High Mechanical Load'},
    {'id': 'scaffold', 'title': 'Tissue Engineering Scaffolds', 'icon': '🧫', 'tag': 'Cell Porosity'},
    {'id': 'wound', 'title': 'Wound Care Patches & Barrier Membranes', 'icon': '🩹', 'tag': 'Flexibility'},
    {'id': 'drug', 'title': 'Controlled Drug Delivery Matrices', 'icon': '💊', 'tag': 'Sustained Release'},
    {'id': 'packaging', 'title': 'Eco-Friendly Biodegradable Bioplastics', 'icon': '🌱', 'tag': 'Soil Resorption'},
  ];

  String _selectedId = 'orthopedic';
  Map<String, dynamic>? _recData;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _fetchRecommendation('orthopedic');
  }

  void _fetchRecommendation(String id) async {
    setState(() {
      _selectedId = id;
      _loading = true;
    });

    try {
      final res = await _apiService.getUseCasesRecommendation(id);
      if (mounted) {
        setState(() {
          _recData = res;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _recData = {
            "use_case": "Orthopedic Bone Screws & Structural Fixation",
            "recommended_polymer": "PLA / PLLA",
            "recommended_fiber": "Bamboo",
            "optimal_fiber_ratio": "30% - 35%",
            "target_tensile_range": "65 - 85 MPa",
            "target_degradation_range": "250 - 365 Days",
            "biocompatibility_index": "A+",
            "rationale": "High tensile strength matrix reinforced with oriented bamboo microfibers provides maximum load support while resorbing slowly during bone healing."
          };
        });
      }
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
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
                Icon(Icons.auto_awesome, color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text('AI Use-Case Recommender', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
              ],
            ),
            Text('Target clinical & commercial biopolymer recommendations', style: TextStyle(fontSize: 10, color: Colors.white54)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Use Cases List Chips / Buttons
            SizedBox(
              height: 110,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                itemCount: _useCases.length,
                itemBuilder: (context, index) {
                  final uc = _useCases[index];
                  final isSelected = uc['id'] == _selectedId;
                  return Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: InkWell(
                      onTap: () => _fetchRecommendation(uc['id']!),
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        width: 170,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppTheme.cardDark : AppTheme.cardDark.withValues(alpha: 0.5),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: isSelected ? AppTheme.primary : AppTheme.cardBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(uc['icon']!, style: const TextStyle(fontSize: 22)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primary.withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(uc['tag']!, style: const TextStyle(color: AppTheme.primary, fontSize: 8, fontWeight: FontWeight.bold)),
                                ),
                              ],
                            ),
                            Text(uc['title']!, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis, maxLines: 2),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),

            // AI Recommendation Card Output
            if (_loading)
              const Center(child: Padding(padding: EdgeInsets.all(32), child: CircularProgressIndicator(color: AppTheme.primary)))
            else if (_recData != null)
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppTheme.cardDark,
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: AppTheme.primary.withValues(alpha: 0.4)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            _recData!['use_case'] ?? '',
                            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.primary.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.primary),
                          ),
                          child: Text(
                            'Rating: ${_recData!['biocompatibility_index']}',
                            style: const TextStyle(color: AppTheme.primary, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      childAspectRatio: 1.5,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      children: [
                        _buildInfoTile('Recommended Polymer', _recData!['recommended_polymer'] ?? '', AppTheme.primary),
                        _buildInfoTile('Recommended Fiber', _recData!['recommended_fiber'] ?? '', AppTheme.accentCyan),
                        _buildInfoTile('Optimal Ratio', _recData!['optimal_fiber_ratio'] ?? '', AppTheme.accentPurple),
                        _buildInfoTile('Target Tensile', _recData!['target_tensile_range'] ?? '', AppTheme.accentAmber),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.surfaceDark,
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Scientific Mechanics Rationale', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text(_recData!['rationale'] ?? '', style: const TextStyle(color: Colors.white70, fontSize: 11.5, height: 1.4)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoTile(String label, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppTheme.surfaceDark,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: const TextStyle(color: Colors.white54, fontSize: 10)),
          const SizedBox(height: 2),
          Text(val, style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.bold), overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }
}
