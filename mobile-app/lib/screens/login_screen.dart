import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../core/theme.dart';
import '../core/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isRegister = false;
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();
  final _nameCtrl = TextEditingController();
  final _orgCtrl = TextEditingController();

  bool _showPassword = false;
  bool _showConfirmPassword = false;
  bool _loading = false;
  String? _error;

  String _formatNameFromEmail(String email) {
    if (email.isEmpty) return 'Biomedical Researcher';
    final prefix = email.split('@')[0];
    return prefix
        .replaceAll(RegExp(r'[._-]'), ' ')
        .split(' ')
        .map((w) => w.isNotEmpty ? '${w[0].toUpperCase()}${w.substring(1)}' : '')
        .join(' ');
  }

  void _handleAuth() async {
    setState(() => _error = null);

    if (_emailCtrl.text.trim().isEmpty) {
      setState(() => _error = 'Please enter your email address');
      return;
    }

    if (_isRegister && _passwordCtrl.text != _confirmPasswordCtrl.text) {
      setState(() => _error = 'Passwords do not match!');
      return;
    }

    if (_passwordCtrl.text.length < 6) {
      setState(() => _error = 'Password must be at least 6 characters.');
      return;
    }

    setState(() => _loading = true);

    try {
      final api = ApiService();
      if (_isRegister) {
        await api.register(
          _nameCtrl.text.isNotEmpty ? _nameCtrl.text : _formatNameFromEmail(_emailCtrl.text),
          _emailCtrl.text.trim(),
          _passwordCtrl.text,
          _orgCtrl.text.isNotEmpty ? _orgCtrl.text : 'Biomedical Research Institute',
        );
      } else {
        await api.login(_emailCtrl.text.trim(), _passwordCtrl.text);
      }

      final prefs = await SharedPreferences.getInstance();
      final displayName = _isRegister
          ? (_nameCtrl.text.isNotEmpty ? _nameCtrl.text : _formatNameFromEmail(_emailCtrl.text))
          : _formatNameFromEmail(_emailCtrl.text);

      await prefs.setString('userName', displayName);
      await prefs.setString('userEmail', _emailCtrl.text.trim());
      await prefs.setString('userOrg', _orgCtrl.text.isNotEmpty ? _orgCtrl.text : 'Biomedical Research Institute');
      await prefs.setBool('isLoggedIn', true);

      if (mounted) {
        setState(() => _loading = false);
        context.go('/');
      }
    } catch (e) {
      if (mounted) {
        String errorMsg = e.toString();
        if (errorMsg.contains('404') || errorMsg.contains('not found')) {
          errorMsg = 'Account not registered! Please click "Register Account" below to register.';
        } else if (errorMsg.contains('401') || errorMsg.contains('Incorrect password')) {
          errorMsg = 'Incorrect password! Please check your credentials and try again.';
        } else if (errorMsg.contains('400') || errorMsg.contains('already registered')) {
          errorMsg = 'Email already registered! Please click "Sign In" to log in.';
        }
        setState(() {
          _loading = false;
          _error = errorMsg.replaceAll('Exception: ', '');
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.surfaceDark,
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 440),
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Header Logo
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [AppTheme.primary, AppTheme.accentCyan]),
                      borderRadius: BorderRadius.circular(18),
                      boxShadow: [
                        BoxShadow(color: AppTheme.primary.withValues(alpha: 0.3), blurRadius: 16, offset: const Offset(0, 4)),
                      ],
                    ),
                    child: const Icon(Icons.science_rounded, color: Colors.black, size: 32),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Biomaterial AI',
                    style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.w900, letterSpacing: -0.5),
                  ),
                  const SizedBox(height: 2),
                  const Text(
                    'Enterprise Mobile Composite Predictor',
                    style: TextStyle(color: AppTheme.primary, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 28),

                  // Form Container Card
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      color: AppTheme.cardDark,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withValues(alpha: 0.4), blurRadius: 20, offset: const Offset(0, 8)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _isRegister ? 'Register Researcher Account' : 'Researcher Sign In',
                          style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          _isRegister ? 'Create an authorized laboratory profile' : 'Enter credentials to access AI predictions',
                          style: const TextStyle(color: Colors.white54, fontSize: 11),
                        ),
                        const SizedBox(height: 20),

                        if (_error != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.red.withValues(alpha: 0.3)),
                            ),
                            child: Text(_error!, style: const TextStyle(color: Colors.redAccent, fontSize: 12)),
                          ),
                          const SizedBox(height: 14),
                        ],

                        if (_isRegister) ...[
                          _buildInputField('Full Name', Icons.person, _nameCtrl, hint: 'Srikanth Vadakuppa'),
                          const SizedBox(height: 14),
                          _buildInputField('Organization', Icons.business, _orgCtrl, hint: 'Biomedical Institute'),
                          const SizedBox(height: 14),
                        ],

                        _buildInputField('Email Address', Icons.email, _emailCtrl, hint: 'srikanthvadakuppa@gmail.com'),
                        const SizedBox(height: 14),

                        // Password Field with Eye Contact Toggle
                        _buildPasswordField('Password', _passwordCtrl, _showPassword, () {
                          setState(() => _showPassword = !_showPassword);
                        }),
                        const SizedBox(height: 14),

                        // Confirm Password Field with Eye Contact Toggle
                        if (_isRegister) ...[
                          _buildPasswordField('Confirm Password', _confirmPasswordCtrl, _showConfirmPassword, () {
                            setState(() => _showConfirmPassword = !_showConfirmPassword);
                          }),
                          const SizedBox(height: 14),
                        ],

                        const SizedBox(height: 10),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primary,
                            foregroundColor: Colors.black,
                            minimumSize: const Size.fromHeight(50),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            elevation: 4,
                          ),
                          onPressed: _loading ? null : _handleAuth,
                          child: _loading
                              ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.black, strokeWidth: 2))
                              : Text(_isRegister ? 'Register Account' : 'Sign In to Mobile Portal', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                        ),

                        const SizedBox(height: 14),
                        Center(
                          child: TextButton(
                            onPressed: () => setState(() {
                              _isRegister = !_isRegister;
                              _error = null;
                            }),
                            child: Text(
                              _isRegister ? 'Already registered? Sign In' : 'Don\'t have an account? Register Account',
                              style: const TextStyle(color: AppTheme.primary, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField(String label, IconData icon, TextEditingController controller, {String? hint}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: Colors.white38, size: 18),
            hintText: hint,
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.04),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }

  Widget _buildPasswordField(String label, TextEditingController controller, bool showPassword, VoidCallback onToggle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        TextField(
          controller: controller,
          obscureText: !showPassword,
          style: const TextStyle(color: Colors.white, fontSize: 13),
          decoration: InputDecoration(
            prefixIcon: const Icon(Icons.key, color: Colors.white38, size: 18),
            suffixIcon: IconButton(
              icon: Icon(showPassword ? Icons.visibility_off : Icons.visibility, color: Colors.white38, size: 18),
              onPressed: onToggle,
            ),
            hintText: '••••••••',
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.04),
            contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          ),
        ),
      ],
    );
  }
}
