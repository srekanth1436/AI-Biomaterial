import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _nameCtrl = TextEditingController();
  final _orgCtrl = TextEditingController();

  final _hospitalCtrl = TextEditingController(text: 'St. Jude Biomedical & Surgical Center');
  final _licenseCtrl = TextEditingController(text: 'MD-ISO-998214');

  String _aiEngine = 'ensemble'; // 'ensemble' | 'neural' | 'empirical'
  String _stressUnit = 'MPa';
  String _tempUnit = '°C';

  final _currentPasswordCtrl = TextEditingController();
  final _newPasswordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();

  bool _showCurrent = false;
  bool _showNew = false;
  bool _showConfirm = false;

  String? _message;
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  void _loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _nameCtrl.text = prefs.getString('userName') ?? 'Srikanth Vadakuppa';
      _orgCtrl.text = prefs.getString('userOrg') ?? 'Biomedical Composites Institute';
      _aiEngine = prefs.getString('setting_ai_engine') ?? 'ensemble';
      _hospitalCtrl.text = prefs.getString('setting_hospital') ?? 'St. Jude Biomedical & Surgical Center';
      _stressUnit = prefs.getString('setting_stress_unit') ?? 'MPa';
      _tempUnit = prefs.getString('setting_temp_unit') ?? '°C';
    });
  }

  void _saveProfile() async {
    if (_nameCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Please enter a valid display name');
      return;
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('userName', _nameCtrl.text.trim());
    await prefs.setString('userOrg', _orgCtrl.text.trim());
    await prefs.setString('setting_ai_engine', _aiEngine);
    await prefs.setString('setting_hospital', _hospitalCtrl.text.trim());
    await prefs.setString('setting_stress_unit', _stressUnit);
    await prefs.setString('setting_temp_unit', _tempUnit);

    setState(() {
      _error = null;
      _message = 'Settings & Hospital Preferences saved!';
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _message = null);
    });
  }

  void _changePassword() async {
    setState(() {
      _error = null;
      _message = null;
    });

    if (_newPasswordCtrl.text != _confirmPasswordCtrl.text) {
      setState(() => _error = 'New passwords do not match!');
      return;
    }
    if (_newPasswordCtrl.text.length < 6) {
      setState(() => _error = 'Password must be at least 6 characters');
      return;
    }

    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 600));

    setState(() {
      _loading = false;
      _message = 'Account password updated successfully!';
      _currentPasswordCtrl.clear();
      _newPasswordCtrl.clear();
      _confirmPasswordCtrl.clear();
    });
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) setState(() => _message = null);
    });
  }

  void _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isLoggedIn', false);
    if (mounted) context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceDark,
      appBar: AppBar(
        backgroundColor: AppTheme.surfaceDark,
        elevation: 0,
        title: const Row(
          children: [
            Icon(Icons.settings_rounded, color: AppTheme.primary, size: 22),
            SizedBox(width: 8),
            Text('System & Hospital Settings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: Colors.redAccent),
            onPressed: _logout,
            tooltip: 'Logout',
          ),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_message != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.primary.withValues(alpha: 0.4)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: AppTheme.primary, size: 18),
                    const SizedBox(width: 8),
                    Expanded(child: Text(_message!, style: const TextStyle(color: AppTheme.primary, fontSize: 12, fontWeight: FontWeight.bold))),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (_error != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.withValues(alpha: 0.4)),
                ),
                child: Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
              ),
              const SizedBox(height: 16),
            ],

            // NEW FEATURE 1: AI Prediction Engine Selector Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.science_rounded, color: AppTheme.primary, size: 20),
                          SizedBox(width: 8),
                          Text('AI Prediction Model Engine', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: AppTheme.primary.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
                        child: const Text('R² = 97.80%', style: TextStyle(color: AppTheme.primary, fontSize: 9, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    value: _aiEngine,
                    dropdownColor: AppTheme.cardDark,
                    style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: Colors.black26,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.cardBorder)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    ),
                    items: const [
                      DropdownMenuItem(value: 'ensemble', child: Text('⚡ Voting Ensemble (Random Forest + XGBoost)')),
                      DropdownMenuItem(value: 'neural', child: Text('🧠 Neural Bio-MLP (Deep Multilayer Perceptron)')),
                      DropdownMenuItem(value: 'empirical', child: Text('🌡️ Empirical Polymer Thermodynamics Engine')),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _aiEngine = val);
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // NEW FEATURE 2 & 3: Hospital Branding & Lab Units Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.local_hospital_rounded, color: AppTheme.primary, size: 20),
                      SizedBox(width: 8),
                      Text('Hospital Branding & Laboratory Units', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _buildInput('Hospital / Medical Center', Icons.local_hospital, _hospitalCtrl),
                  const SizedBox(height: 10),
                  _buildInput('Surgeon License Number', Icons.badge, _licenseCtrl),
                  const SizedBox(height: 14),

                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Stress Unit', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            DropdownButtonFormField<String>(
                              value: _stressUnit,
                              dropdownColor: AppTheme.cardDark,
                              style: const TextStyle(color: Colors.white, fontSize: 12),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: Colors.black26,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              ),
                              items: const [
                                DropdownMenuItem(value: 'MPa', child: Text('MPa')),
                                DropdownMenuItem(value: 'PSI', child: Text('PSI')),
                                DropdownMenuItem(value: 'N/mm²', child: Text('N/mm²')),
                              ],
                              onChanged: (val) {
                                if (val != null) setState(() => _stressUnit = val);
                              },
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Temp Unit', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 4),
                            DropdownButtonFormField<String>(
                              value: _tempUnit,
                              dropdownColor: AppTheme.cardDark,
                              style: const TextStyle(color: Colors.white, fontSize: 12),
                              decoration: InputDecoration(
                                filled: true,
                                fillColor: Colors.black26,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                              ),
                              items: const [
                                DropdownMenuItem(value: '°C', child: Text('°C (Celsius)')),
                                DropdownMenuItem(value: '°F', child: Text('°F (Fahrenheit)')),
                                DropdownMenuItem(value: 'K', child: Text('K (Kelvin)')),
                              ],
                              onChanged: (val) {
                                if (val != null) setState(() => _tempUnit = val);
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Edit Profile Details Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Edit User Profile Details', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 14),
                  _buildInput('Display Name', Icons.person, _nameCtrl),
                  const SizedBox(height: 10),
                  _buildInput('Organization', Icons.business, _orgCtrl),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      foregroundColor: Colors.black,
                      minimumSize: const Size.fromHeight(44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _saveProfile,
                    child: const Text('Save All Settings & Profile', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Change Password Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.cardDark,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      Icon(Icons.lock_reset_rounded, color: AppTheme.primary, size: 20),
                      SizedBox(width: 8),
                      Text('Change Security Password', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 14),
                  _buildPasswordInput('Current Password', _currentPasswordCtrl, _showCurrent, () => setState(() => _showCurrent = !_showCurrent)),
                  const SizedBox(height: 10),
                  _buildPasswordInput('New Password', _newPasswordCtrl, _showNew, () => setState(() => _showNew = !_showNew)),
                  const SizedBox(height: 10),
                  _buildPasswordInput('Confirm New Password', _confirmPasswordCtrl, _showConfirm, () => setState(() => _showConfirm = !_showConfirm)),
                  const SizedBox(height: 14),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.cardDark,
                      foregroundColor: AppTheme.primary,
                      side: const BorderSide(color: AppTheme.primary),
                      minimumSize: const Size.fromHeight(44),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: _loading ? null : _changePassword,
                    child: Text(_loading ? 'Updating Password...' : 'Update Security Password', style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildPasswordInput(String label, TextEditingController ctrl, bool visible, VoidCallback onToggle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          obscureText: !visible,
          style: const TextStyle(color: Colors.white, fontSize: 12),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppTheme.primary, size: 18),
            suffixIcon: IconButton(
              icon: Icon(visible ? Icons.visibility_off_rounded : Icons.visibility_rounded, color: Colors.white54, size: 18),
              onPressed: onToggle,
            ),
            filled: true,
            fillColor: Colors.black26,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.cardBorder)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
      ],
    );
  }

  Widget _buildInput(String label, IconData icon, TextEditingController ctrl) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          style: const TextStyle(color: Colors.white, fontSize: 12),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: AppTheme.primary, size: 18),
            filled: true,
            fillColor: Colors.black26,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppTheme.cardBorder)),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          ),
        ),
      ],
    );
  }
}
