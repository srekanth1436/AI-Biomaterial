import 'package:flutter/material.dart';
import '../core/api_service.dart';
import '../core/theme.dart';

class CompareScreen extends StatefulWidget {
  const CompareScreen({super.key});

  @override
  State<CompareScreen> createState() => _CompareScreenState();
}

class _CompareScreenState extends State<CompareScreen> {
  final ApiService _apiService = ApiService();

  String _polyA = 'PLA';
  String _fiberA = 'Bamboo';
  double _ratioA = 30.0;

  String _polyB = 'Chitosan';
  String _fiberB = 'Hemp';
  double _ratioB = 25.0;

  bool _loading = false;
  Map<String, dynamic>? _comparisonResult;

  void _runComparison() async {
    setState(() => _loading = true);

    final payloadA = {
      "polymer_type": _polyA,
      "natural_fiber": _fiberA,
      "fiber_percentage": _ratioA,
      "molecular_weight": 150000.0,
      "moisture_content": 8.0,
      "ph": 7.4,
      "temperature": 37.0,
      "density": 1.25,
    };

    final payloadB = {
      "polymer_type": _polyB,
      "natural_fiber": _fiberB,
      "fiber_percentage": _ratioB,
      "molecular_weight": 120000.0,
      "moisture_content": 6.5,
      "ph": 6.8,
      "temperature": 37.0,
      "density": 1.30,
    };

    try {
      final res = await _apiService.compareFormulations(payloadA, payloadB);
      if (mounted) {
        setState(() {
          _comparisonResult = res;
        });
      }
    } catch (e) {
      if (mounted) {
        // Local calculation fallback
        final tA = 20.0 + (150000 / 10000) + (_ratioA * 0.8) - 9.6;
        final tB = 20.0 + (120000 / 10000) + (_ratioB * 0.8) - 7.8;
        final dA = 365.0 - (_ratioA * 1.8) - 36.0;
        final dB = 365.0 - (_ratioB * 1.8) - 29.25;

        setState(() {
          _comparisonResult = {
            "formulation_a": {
              "polymer_type": _polyA,
              "natural_fiber": _fiberA,
              "fiber_percentage": _ratioA,
              "mechanical": {"tensile_strength": double.parse(tA.toStringAsFixed(2))},
              "degradation": {"degradation_time": double.parse(dA.toStringAsFixed(1))}
            },
            "formulation_b": {
              "polymer_type": _polyB,
              "natural_fiber": _fiberB,
              "fiber_percentage": _ratioB,
              "mechanical": {"tensile_strength": double.parse(tB.toStringAsFixed(2))},
              "degradation": {"degradation_time": double.parse(dB.toStringAsFixed(1))}
            },
            "comparison": {
              "tensile_delta_mpa": double.parse((tB - tA).toStringAsFixed(2)),
              "tensile_delta_pct": double.parse((((tB - tA) / tA) * 100).toStringAsFixed(1)),
              "stronger_formulation": tB > tA ? "B" : "A",
            }
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
                Icon(Icons.compare_arrows_rounded, color: AppTheme.primary, size: 22),
                SizedBox(width: 8),
                Text('Side-by-Side Comparer', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
              ],
            ),
            Text('Benchmark strength & degradation deltas between matrices', style: TextStyle(fontSize: 10, color: Colors.white54)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Formulation A Card
            _buildSelectionCard(
              title: 'Formulation Matrix A',
              color: AppTheme.primary,
              selectedPolymer: _polyA,
              selectedFiber: _fiberA,
              ratio: _ratioA,
              onPolymerChanged: (val) => setState(() => _polyA = val!),
              onFiberChanged: (val) => setState(() => _fiberA = val!),
              onRatioChanged: (val) => setState(() => _ratioA = val),
            ),
            const SizedBox(height: 16),

            // Formulation B Card
            _buildSelectionCard(
              title: 'Formulation Matrix B',
              color: AppTheme.accentCyan,
              selectedPolymer: _polyB,
              selectedFiber: _fiberB,
              ratio: _ratioB,
              onPolymerChanged: (val) => setState(() => _polyB = val!),
              onFiberChanged: (val) => setState(() => _fiberB = val!),
              onRatioChanged: (val) => setState(() => _ratioB = val),
            ),
            const SizedBox(height: 20),

            // Run Comparison Button
            InkWell(
              onTap: _loading ? null : _runComparison,
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  gradient: AppTheme.emeraldCyanGradient,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: AppTheme.primary.withValues(alpha: 0.35), blurRadius: 16, offset: const Offset(0, 4)),
                  ],
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_loading)
                      const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2.5))
                    else ...[
                      const Icon(Icons.bolt_rounded, color: Colors.black, size: 22),
                      const SizedBox(width: 8),
                      const Text('Run Benchmark Comparison', style: TextStyle(color: Colors.black, fontSize: 15, fontWeight: FontWeight.w900)),
                    ],
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Outcome Delta Card
            if (_comparisonResult != null) _buildComparisonOutput(),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectionCard({
    required String title,
    required Color color,
    required String selectedPolymer,
    required String selectedFiber,
    required double ratio,
    required ValueChanged<String?> onPolymerChanged,
    required ValueChanged<String?> onFiberChanged,
    required ValueChanged<double> onRatioChanged,
  }) {
    final polymers = ['PLA', 'Chitosan', 'PHBV', 'PCL', 'Starch'];
    final fibers = ['Bamboo', 'Hemp', 'Flax', 'Jute', 'Sisal'];

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: TextStyle(color: color, fontSize: 15, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  initialValue: selectedPolymer,
                  dropdownColor: AppTheme.cardDark,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Polymer',
                    labelStyle: const TextStyle(color: Colors.white54, fontSize: 11),
                    filled: true,
                    fillColor: AppTheme.surfaceDark,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  items: polymers.map((p) => DropdownMenuItem(value: p, child: Text(p))).toList(),
                  onChanged: onPolymerChanged,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: DropdownButtonFormField<String>(
                  initialValue: selectedFiber,
                  dropdownColor: AppTheme.cardDark,
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  decoration: InputDecoration(
                    labelText: 'Fiber',
                    labelStyle: const TextStyle(color: Colors.white54, fontSize: 11),
                    filled: true,
                    fillColor: AppTheme.surfaceDark,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  items: fibers.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
                  onChanged: onFiberChanged,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Fiber Load Ratio', style: TextStyle(color: Colors.white54, fontSize: 11)),
              Text('${ratio.toInt()}%', style: TextStyle(color: color, fontSize: 14, fontWeight: FontWeight.bold)),
            ],
          ),
          Slider(
            value: ratio,
            min: 5,
            max: 60,
            divisions: 55,
            activeColor: color,
            inactiveColor: Colors.white10,
            onChanged: onRatioChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildComparisonOutput() {
    final formA = _comparisonResult!['formulation_a'] ?? {};
    final formB = _comparisonResult!['formulation_b'] ?? {};
    final comp = _comparisonResult!['comparison'] ?? {};

    final mechA = formA['mechanical'] ?? {};
    final mechB = formB['mechanical'] ?? {};
    final degA = formA['degradation'] ?? {};
    final degB = formB['degradation'] ?? {};

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.primary.withValues(alpha: 0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Benchmark Delta Outcome', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    children: [
                      Text('Matrix A (${formA['polymer_type']})', style: const TextStyle(color: AppTheme.primary, fontSize: 11, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${mechA['tensile_strength']} MPa', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                      Text('${degA['degradation_time']} Days', style: const TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.accentCyan.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppTheme.accentCyan.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    children: [
                      Text('Matrix B (${formB['polymer_type']})', style: const TextStyle(color: AppTheme.accentCyan, fontSize: 11, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text('${mechB['tensile_strength']} MPa', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                      Text('${degB['degradation_time']} Days', style: const TextStyle(color: Colors.white54, fontSize: 10)),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.surfaceDark,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Tensile Strength Difference:', style: TextStyle(color: Colors.white70, fontSize: 12)),
                Text(
                  '${comp['tensile_delta_mpa']} MPa (${comp['tensile_delta_pct']}%)',
                  style: const TextStyle(color: AppTheme.primary, fontSize: 13, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
