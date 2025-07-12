import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User,
  BellRing,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
  Share2,
  Heart,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  // Render a settings section
  const SettingsSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Animated.View 
      style={styles.section}
      entering={FadeIn.duration(400).delay(200)}
    >
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </Animated.View>
  );

  // Render a settings item with icon
  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingsItemIcon}>{icon}</View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement || <ChevronRight size={20} color={Colors.text.secondary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={GlobalStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={GlobalStyles.heading1}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile section */}
        <SettingsSection title="Profile">
          <SettingsItem
            icon={<User size={24} color={Colors.primary.tomato} />}
            title="Account"
            subtitle="Manage your profile details"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* App Settings section */}
        <SettingsSection title="App Settings">
          <SettingsItem
            icon={<Camera size={24} color={Colors.primary.basil} />}
            title="Camera"
            subtitle="Configure camera settings"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<BellRing size={24} color={Colors.primary.mustard} />}
            title="Notifications"
            subtitle="Manage notifications"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: Colors.ui.border, true: Colors.primary.tomato }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notifications ? Colors.text.light : Colors.background.card}
                ios_backgroundColor={Colors.ui.border}
              />
            }
          />
          <SettingsItem
            icon={<Moon size={24} color={Colors.text.secondary} />}
            title="Dark Mode"
            subtitle="Toggle app theme"
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: Colors.ui.border, true: Colors.primary.tomato }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : darkMode ? Colors.text.light : Colors.background.card}
                ios_backgroundColor={Colors.ui.border}
              />
            }
          />
        </SettingsSection>

        {/* Recipes & Data */}
        <SettingsSection title="Recipes & Data">
          <SettingsItem
            icon={<Heart size={24} color={Colors.primary.tomato} />}
            title="Favorites"
            subtitle="Manage favorite recipes"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Share2 size={24} color={Colors.primary.basil} />}
            title="Sharing"
            subtitle="Configure sharing options"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Help & About */}
        <SettingsSection title="Help & About">
          <SettingsItem
            icon={<HelpCircle size={24} color={Colors.primary.mustard} />}
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => {}}
          />
          <SettingsItem
            icon={<Info size={24} color={Colors.primary.basil} />}
            title="About SnapDish"
            subtitle="Version 1.0.0"
            onPress={() => {}}
          />
        </SettingsSection>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton}>
          <LogOut size={20} color={Colors.text.light} style={{ marginRight: Theme.spacing.sm }} />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>SnapDish v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Theme.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ui.divider,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.background.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.primary,
  },
  settingsItemSubtitle: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.tomato,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  signOutButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.light,
  },
  versionText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Theme.spacing.xxl,
  },
});