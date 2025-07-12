import 'package:flutter/material.dart';
import '../utils/theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = false;
  bool _notifications = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundMain,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            const Padding(
              padding: EdgeInsets.all(AppTheme.spacingMd),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Settings',
                  style: AppTheme.heading1,
                ),
              ),
            ),
            
            // Settings content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
                children: [
                  // Profile section
                  _buildSection(
                    'Profile',
                    [
                      _buildSettingsItem(
                        icon: Icons.person,
                        iconColor: AppTheme.primaryTomato,
                        title: 'Account',
                        subtitle: 'Manage your profile details',
                        onTap: () {},
                      ),
                    ],
                  ),
                  
                  // App Settings section
                  _buildSection(
                    'App Settings',
                    [
                      _buildSettingsItem(
                        icon: Icons.camera_alt,
                        iconColor: AppTheme.primaryBasil,
                        title: 'Camera',
                        subtitle: 'Configure camera settings',
                        onTap: () {},
                      ),
                      _buildSettingsItem(
                        icon: Icons.notifications,
                        iconColor: AppTheme.primaryMustard,
                        title: 'Notifications',
                        subtitle: 'Manage notifications',
                        trailing: Switch(
                          value: _notifications,
                          onChanged: (value) => setState(() => _notifications = value),
                          activeColor: AppTheme.primaryTomato,
                        ),
                      ),
                      _buildSettingsItem(
                        icon: Icons.dark_mode,
                        iconColor: AppTheme.textSecondary,
                        title: 'Dark Mode',
                        subtitle: 'Toggle app theme',
                        trailing: Switch(
                          value: _darkMode,
                          onChanged: (value) => setState(() => _darkMode = value),
                          activeColor: AppTheme.primaryTomato,
                        ),
                      ),
                    ],
                  ),
                  
                  // Recipes & Data section
                  _buildSection(
                    'Recipes & Data',
                    [
                      _buildSettingsItem(
                        icon: Icons.favorite,
                        iconColor: AppTheme.primaryTomato,
                        title: 'Favorites',
                        subtitle: 'Manage favorite recipes',
                        onTap: () {},
                      ),
                      _buildSettingsItem(
                        icon: Icons.share,
                        iconColor: AppTheme.primaryBasil,
                        title: 'Sharing',
                        subtitle: 'Configure sharing options',
                        onTap: () {},
                      ),
                    ],
                  ),
                  
                  // Help & About section
                  _buildSection(
                    'Help & About',
                    [
                      _buildSettingsItem(
                        icon: Icons.help,
                        iconColor: AppTheme.primaryMustard,
                        title: 'Help Center',
                        subtitle: 'Get help and support',
                        onTap: () {},
                      ),
                      _buildSettingsItem(
                        icon: Icons.info,
                        iconColor: AppTheme.primaryBasil,
                        title: 'About SnapDish',
                        subtitle: 'Version 1.0.0',
                        onTap: () {},
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: AppTheme.spacingLg),
                  
                  // Sign Out button
                  ElevatedButton.icon(
                    onPressed: () {},
                    style: AppTheme.primaryButtonStyle,
                    icon: const Icon(Icons.logout),
                    label: const Text('Sign Out'),
                  ),
                  
                  const SizedBox(height: AppTheme.spacingMd),
                  
                  // Version info
                  const Center(
                    child: Text(
                      'SnapDish v1.0.0',
                      style: TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: AppTheme.spacingXl),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> items) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(
            left: AppTheme.spacingSm,
            bottom: AppTheme.spacingSm,
            top: AppTheme.spacingLg,
          ),
          child: Text(
            title.toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppTheme.textSecondary,
              letterSpacing: 1,
            ),
          ),
        ),
        Container(
          decoration: AppTheme.cardDecoration,
          child: Column(
            children: items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              return Column(
                children: [
                  item,
                  if (index < items.length - 1)
                    const Divider(
                      height: 1,
                      color: Color(0xFFF3F4F6),
                      indent: 56,
                    ),
                ],
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSettingsItem({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: AppTheme.backgroundMain,
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        ),
        child: Icon(
          icon,
          color: iconColor,
          size: 24,
        ),
      ),
      title: Text(
        title,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
          color: AppTheme.textPrimary,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(
          fontSize: 14,
          color: AppTheme.textSecondary,
        ),
      ),
      trailing: trailing ?? const Icon(
        Icons.chevron_right,
        color: AppTheme.textSecondary,
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingMd,
        vertical: AppTheme.spacingSm,
      ),
    );
  }
}