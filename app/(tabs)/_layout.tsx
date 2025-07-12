import { Tabs } from 'expo-router';
import { Camera, Image, BookOpen, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const blurProps = Platform.OS === 'ios' ? {
    // iOS uses blur effect for tab bar
    tabBarBackground: () => (
      <BlurView
        tint="dark"
        intensity={80}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    ),
  } : {};

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.tomato,
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins-Medium',
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : Colors.background.card,
          borderTopColor: Colors.ui.border,
          borderTopWidth: Platform.OS === 'ios' ? 0 : 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        headerShown: false,
        ...blurProps,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Capture',
          tabBarIcon: ({ color, size }) => (
            <Camera color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color, size }) => (
            <Image color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}