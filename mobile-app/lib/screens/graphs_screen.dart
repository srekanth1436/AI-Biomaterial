import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../core/theme.dart';
import '../core/api_service.dart';

class GraphsScreen extends StatefulWidget {
  const GraphsScreen({super.key});

  @override
  State<GraphsScreen> createState() => _GraphsScreenState();
}

class _GraphsScreenState extends State<GraphsScreen> {
  Map<String, dynamic>? _latestPred;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _fetchLatestPrediction();
  }

  void _fetchLatestPrediction() async {
    try {
      final api = ApiService();
      final preds = await api.getPredictionHistory();
      if (preds.isNotEmpty) {
        setState(() {
          _latestPred = preds.last;
          _loading = false;
        });
      } else {
        setState(() => _loading = false);
      }
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Default formulation parameters if initial database empty
    final polymer = _latestPred?['polymer_type'] ?? 'PLA';
    final fiber = _latestPred?['natural_fiber'] ?? 'Bamboo';
    final fiberPct = (_latestPred?['fiber_percentage'] ?? 30.0).toDouble();
    final mw = (_latestPred?['molecular_weight'] ?? 150000.0).toDouble();
    final moisture = (_latestPred?['moisture_content'] ?? 8.0).toDouble();

    final mech = _latestPred?['mechanical'] ?? {};
    final deg = _latestPred?['degradation'] ?? {};

    final tensile = (mech['tensile_strength'] ?? 59.54).toDouble();
    final flexural = (mech['flexural_strength'] ?? 83.81).toDouble();
    final modulus = (mech['elastic_modulus'] ?? 5.79).toDouble();
    final impact = (mech['impact_strength'] ?? 9.29).toDouble();

    final degTime = (deg['degradation_time'] ?? 314.3).toDouble();
    final weightLoss = (deg['weight_loss'] ?? 66.9).toDouble();
    final waterAbs = (deg['water_absorption'] ?? 12.0).toDouble();

    final strengthNames = [
      'Tensile Strength (MPa)',
      'Flexural Strength (MPa)',
      'Elastic Modulus (x10 GPa)',
      'Impact Strength (x4 kJ/m²)'
    ];

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
                Icon(Icons.show_chart_rounded, color: AppTheme.primary, size: 20),
                SizedBox(width: 8),
                Text('Property Visualizations', style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900)),
              ],
            ),
            Text('Dynamic mechanical responses, degradation curves & sensitivity', style: TextStyle(fontSize: 10, color: Colors.white54)),
          ],
        ),
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Active Formulation Banner Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppTheme.primary.withValues(alpha: 0.4)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('ACTIVE FORMULATION SEQUENCE', style: TextStyle(color: AppTheme.primary, fontSize: 9, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text('$polymer + $fiber (${fiberPct.toInt()}% Fiber)', style: const TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900)),
                        Text('Mol Wt: ${mw.toInt()} g/mol • Moisture: ${moisture.toInt()}%', style: const TextStyle(color: Colors.white54, fontSize: 10)),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh_rounded, color: AppTheme.primary, size: 20),
                    onPressed: _fetchLatestPrediction,
                    tooltip: 'Refresh Active Prediction',
                  ),
                ],
              ),
            ),
            const SizedBox(height: 18),

            // Chart 1: Strength Comparison (Bar Chart)
            _buildChartCard(
              title: '1. Strength Comparison',
              subtitle: 'Tensile, Flexural, Elastic Modulus & Impact Strength',
              icon: Icons.bar_chart_rounded,
              color: const Color(0xFF3B82F6),
              chart: Column(
                children: [
                  SizedBox(
                    height: 190,
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: (flexural * 1.15).clamp(80.0, 220.0),
                        barTouchData: BarTouchData(
                          enabled: true,
                          touchTooltipData: BarTouchTooltipData(
                            tooltipBgColor: const Color(0xFF0F172A),
                            tooltipPadding: const EdgeInsets.all(8),
                            getTooltipItem: (group, groupIndex, rod, rodIndex) {
                              return BarTooltipItem(
                                '${strengthNames[group.x]}\n',
                                const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 11),
                                children: [
                                  TextSpan(text: 'value : ${rod.toY.toStringAsFixed(1)}', style: const TextStyle(color: Colors.white60, fontSize: 10)),
                                ],
                              );
                            },
                          ),
                        ),
                        barGroups: [
                          BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: tensile, color: const Color(0xFF3B82F6), width: 22, borderRadius: BorderRadius.circular(6))]),
                          BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: flexural, color: const Color(0xFF06B6D4), width: 22, borderRadius: BorderRadius.circular(6))]),
                          BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: modulus * 10, color: const Color(0xFF8B5CF6), width: 22, borderRadius: BorderRadius.circular(6))]),
                          BarChartGroupData(x: 3, barRods: [BarChartRodData(toY: impact * 4, color: const Color(0xFF10B981), width: 22, borderRadius: BorderRadius.circular(6))]),
                        ],
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 26,
                              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: const TextStyle(color: Colors.white38, fontSize: 9)),
                            ),
                          ),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 32,
                              getTitlesWidget: (val, meta) {
                                switch (val.toInt()) {
                                  case 0: return const Text('Tensile\n(MPa)', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  case 1: return const Text('Flexural\n(MPa)', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  case 2: return const Text('Modulus\n(x10 GPa)', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  case 3: return const Text('Impact\n(x4 kJ/m²)', textAlign: TextAlign.center, style: TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  default: return const Text('');
                                }
                              },
                            ),
                          ),
                        ),
                        gridData: FlGridData(show: true, drawVerticalLine: false, getDrawingHorizontalLine: (v) => FlLine(color: Colors.white10, strokeWidth: 1)),
                        borderData: FlBorderData(show: false),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 10,
                    children: [
                      _buildDotLegend('Tensile (MPa)', const Color(0xFF3B82F6)),
                      _buildDotLegend('Flexural (MPa)', const Color(0xFF06B6D4)),
                      _buildDotLegend('Modulus (x10 GPa)', const Color(0xFF8B5CF6)),
                      _buildDotLegend('Impact (x4)', const Color(0xFF10B981)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Chart 2: Degradation & Mass Loss Curve (Line Chart)
            _buildChartCard(
              title: '2. Degradation & Mass Loss Curve',
              subtitle: 'Simulated Resorption Progress (Day 0 to Day ${degTime.toInt()})',
              icon: Icons.trending_up_rounded,
              color: const Color(0xFF10B981),
              chart: Column(
                children: [
                  SizedBox(
                    height: 190,
                    child: LineChart(
                      LineChartData(
                        lineTouchData: LineTouchData(
                          enabled: true,
                          touchTooltipData: LineTouchTooltipData(
                            tooltipBgColor: const Color(0xFF0F172A),
                            tooltipPadding: const EdgeInsets.all(8),
                            getTooltipItems: (touchedSpots) {
                              return touchedSpots.map((spot) {
                                final isWeightLoss = spot.barIndex == 0;
                                final name = isWeightLoss ? 'Weight Loss (%)' : 'Water Absorption (%)';
                                final color = isWeightLoss ? const Color(0xFF10B981) : const Color(0xFF06B6D4);
                                return LineTooltipItem(
                                  '$name : ${spot.y.toStringAsFixed(1)}',
                                  TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10),
                                );
                              }).toList();
                            },
                          ),
                        ),
                        gridData: FlGridData(show: true, drawVerticalLine: false, getDrawingHorizontalLine: (v) => FlLine(color: Colors.white10, strokeWidth: 1)),
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 26,
                              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: const TextStyle(color: Colors.white38, fontSize: 9)),
                            ),
                          ),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              interval: 1,
                              getTitlesWidget: (val, meta) {
                                final step = degTime / 4;
                                switch (val.toInt()) {
                                  case 0: return const Text('Day 0', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 1: return Text('Day ${step.toInt()}', style: const TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 2: return Text('Day ${(step * 2).toInt()}', style: const TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 3: return Text('Day ${(step * 3).toInt()}', style: const TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 4: return Text('Day ${degTime.toInt()}', style: const TextStyle(color: Colors.white54, fontSize: 8.5));
                                  default: return const Text('');
                                }
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          LineChartBarData(
                            isCurved: true,
                            color: const Color(0xFF10B981),
                            barWidth: 3,
                            dotData: const FlDotData(show: true),
                            belowBarData: BarAreaData(show: true, color: const Color(0xFF10B981).withValues(alpha: 0.15)),
                            spots: [
                              const FlSpot(0, 0),
                              FlSpot(1, weightLoss * 0.2),
                              FlSpot(2, weightLoss * 0.5),
                              FlSpot(3, weightLoss * 0.8),
                              FlSpot(4, weightLoss),
                            ],
                          ),
                          LineChartBarData(
                            isCurved: true,
                            color: const Color(0xFF06B6D4),
                            barWidth: 2,
                            dotData: const FlDotData(show: true),
                            spots: [
                              const FlSpot(0, 0),
                              FlSpot(1, waterAbs * 0.35),
                              FlSpot(2, waterAbs * 0.65),
                              FlSpot(3, waterAbs * 0.85),
                              FlSpot(4, waterAbs),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildLineLegend('Water Absorption (%)', const Color(0xFF06B6D4)),
                      const SizedBox(width: 12),
                      _buildLineLegend('Weight Loss (%)', const Color(0xFF10B981)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Chart 3: Fiber Reinforcement Sensitivity Analysis
            _buildChartCard(
              title: '3. Fiber Load Sensitivity Analysis',
              subtitle: 'Tensile Strength Response relative to Fiber Ratio (0% - 60%)',
              icon: Icons.tune_rounded,
              color: const Color(0xFF8B5CF6),
              chart: Column(
                children: [
                  SizedBox(
                    height: 190,
                    child: LineChart(
                      LineChartData(
                        lineTouchData: LineTouchData(
                          enabled: true,
                          touchTooltipData: LineTouchTooltipData(
                            tooltipBgColor: const Color(0xFF0F172A),
                            tooltipPadding: const EdgeInsets.all(8),
                            getTooltipItems: (touchedSpots) {
                              return touchedSpots.map((spot) {
                                final isTensile = spot.barIndex == 0;
                                final name = isTensile ? 'Tensile Strength (MPa)' : 'Elastic Modulus (x10 GPa)';
                                final color = isTensile ? const Color(0xFF3B82F6) : const Color(0xFF8B5CF6);
                                return LineTooltipItem(
                                  '$name : ${spot.y.toStringAsFixed(1)}',
                                  TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 10),
                                );
                              }).toList();
                            },
                          ),
                        ),
                        gridData: FlGridData(show: true, drawVerticalLine: false, getDrawingHorizontalLine: (v) => FlLine(color: Colors.white10, strokeWidth: 1)),
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 26,
                              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: const TextStyle(color: Colors.white38, fontSize: 9)),
                            ),
                          ),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              interval: 1,
                              getTitlesWidget: (val, meta) {
                                switch (val.toInt()) {
                                  case 0: return const Text('10%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 1: return const Text('20%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 2: return Text('${fiberPct.toInt()}% (Current)', style: const TextStyle(color: AppTheme.primary, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  case 3: return const Text('40%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 4: return const Text('50%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  default: return const Text('');
                                }
                              },
                            ),
                          ),
                        ),
                        borderData: FlBorderData(show: false),
                        lineBarsData: [
                          LineChartBarData(
                            isCurved: true,
                            color: const Color(0xFF3B82F6),
                            barWidth: 3,
                            dotData: const FlDotData(show: true),
                            spots: [
                              FlSpot(0, tensile * 0.55),
                              FlSpot(1, tensile * 0.78),
                              FlSpot(2, tensile),
                              FlSpot(3, tensile * 1.12),
                              FlSpot(4, tensile * 1.05),
                            ],
                          ),
                          LineChartBarData(
                            isCurved: true,
                            color: const Color(0xFF8B5CF6),
                            barWidth: 2,
                            dotData: const FlDotData(show: true),
                            spots: [
                              FlSpot(0, modulus * 6.0),
                              FlSpot(1, modulus * 8.0),
                              FlSpot(2, modulus * 10.0),
                              FlSpot(3, modulus * 11.5),
                              FlSpot(4, modulus * 12.0),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildLineLegend('Elastic Modulus (x10 GPa)', const Color(0xFF8B5CF6)),
                      const SizedBox(width: 12),
                      _buildLineLegend('Tensile Strength (MPa)', const Color(0xFF3B82F6)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Chart 4: Moisture Content vs Degradation
            _buildChartCard(
              title: '4. Moisture Content vs Degradation',
              subtitle: 'Environmental moisture response on resorption speed',
              icon: Icons.water_drop_rounded,
              color: const Color(0xFFF59E0B),
              chart: Column(
                children: [
                  SizedBox(
                    height: 190,
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: (degTime * 1.1).clamp(100.0, 600.0),
                        barTouchData: BarTouchData(
                          enabled: true,
                          touchTooltipData: BarTouchTooltipData(
                            tooltipBgColor: const Color(0xFF0F172A),
                            tooltipPadding: const EdgeInsets.all(8),
                            getTooltipItem: (group, groupIndex, rod, rodIndex) {
                              final label = rodIndex == 0 ? 'Degradation Time (Days)' : 'Weight Loss (%)';
                              final valStr = rodIndex == 0 ? rod.toY.toInt().toString() : rod.toY.toStringAsFixed(1);
                              return BarTooltipItem(
                                '$label\n',
                                TextStyle(color: rodIndex == 0 ? const Color(0xFFF59E0B) : Colors.redAccent, fontWeight: FontWeight.bold, fontSize: 11),
                                children: [
                                  TextSpan(text: 'value : $valStr', style: const TextStyle(color: Colors.white70, fontSize: 10)),
                                ],
                              );
                            },
                          ),
                        ),
                        barGroups: [
                          BarChartGroupData(x: 0, barRods: [
                            BarChartRodData(toY: degTime * 1.25, color: const Color(0xFFF59E0B), width: 14, borderRadius: BorderRadius.circular(4)),
                            BarChartRodData(toY: weightLoss * 0.6, color: Colors.redAccent, width: 14, borderRadius: BorderRadius.circular(4)),
                          ]),
                          BarChartGroupData(x: 1, barRods: [
                            BarChartRodData(toY: degTime * 1.1, color: const Color(0xFFF59E0B), width: 14, borderRadius: BorderRadius.circular(4)),
                            BarChartRodData(toY: weightLoss * 0.8, color: Colors.redAccent, width: 14, borderRadius: BorderRadius.circular(4)),
                          ]),
                          BarChartGroupData(x: 2, barRods: [
                            BarChartRodData(toY: degTime, color: const Color(0xFFF59E0B), width: 14, borderRadius: BorderRadius.circular(4)),
                            BarChartRodData(toY: weightLoss, color: Colors.redAccent, width: 14, borderRadius: BorderRadius.circular(4)),
                          ]),
                          BarChartGroupData(x: 3, barRods: [
                            BarChartRodData(toY: degTime * 0.82, color: const Color(0xFFF59E0B), width: 14, borderRadius: BorderRadius.circular(4)),
                            BarChartRodData(toY: weightLoss * 1.25, color: Colors.redAccent, width: 14, borderRadius: BorderRadius.circular(4)),
                          ]),
                          BarChartGroupData(x: 4, barRods: [
                            BarChartRodData(toY: degTime * 0.68, color: const Color(0xFFF59E0B), width: 14, borderRadius: BorderRadius.circular(4)),
                            BarChartRodData(toY: weightLoss * 1.5, color: Colors.redAccent, width: 14, borderRadius: BorderRadius.circular(4)),
                          ]),
                        ],
                        titlesData: FlTitlesData(
                          leftTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              reservedSize: 26,
                              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: const TextStyle(color: Colors.white38, fontSize: 9)),
                            ),
                          ),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              interval: 1,
                              getTitlesWidget: (val, meta) {
                                switch (val.toInt()) {
                                  case 0: return const Text('2%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 1: return const Text('5%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 2: return Text('${moisture.toInt()}% (Input)', style: const TextStyle(color: AppTheme.primary, fontSize: 8.5, fontWeight: FontWeight.bold));
                                  case 3: return const Text('12%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  case 4: return const Text('15%', style: TextStyle(color: Colors.white54, fontSize: 8.5));
                                  default: return const Text('');
                                }
                              },
                            ),
                          ),
                        ),
                        gridData: FlGridData(show: true, drawVerticalLine: false, getDrawingHorizontalLine: (v) => FlLine(color: Colors.white10, strokeWidth: 1)),
                        borderData: FlBorderData(show: false),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      _buildDotLegend('Degradation Time (Days)', const Color(0xFFF59E0B)),
                      const SizedBox(width: 12),
                      _buildDotLegend('Weight Loss (%)', Colors.redAccent),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildDotLegend(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 8, height: 8, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildLineLegend(String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 12, height: 2.5, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
        const SizedBox(width: 4),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 8.5, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildChartCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Widget chart,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.cardDark,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      subtitle,
                      style: const TextStyle(color: Colors.white54, fontSize: 9.5),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          chart,
        ],
      ),
    );
  }
}
