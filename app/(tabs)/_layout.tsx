import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Tabs } from 'expo-router';
import {
  CheckCircleIcon,
  CopyPlusIcon,
  HomeIcon,
  InfoIcon,
  MoonStarIcon,
  SunIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerRight: () => <ThemeToggle />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Counter',
          tabBarIcon: ({ color, size }) => <CopyPlusIcon color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'Todos',
          tabBarIcon: ({ color, size }) => <CheckCircleIcon color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
