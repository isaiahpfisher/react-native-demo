import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { View } from 'react-native';

export default function CounterScreen() {
  const [count, setCount] = React.useState(0);

  return (
    <View className="flex-1 items-center justify-center gap-8 p-4">
      <View className="flex items-center">
        <Text className="text-2xl font-bold">Salutations, World.</Text>
        <Text className="text-sm">Below is the obligatory counter demo.</Text>
      </View>
      <Separator />
      <Text className="text-4xl font-bold">{count}</Text>
      <View className="flex-row gap-4">
        <Button onPress={() => setCount((c) => c - 1)}>
          <Text>-</Text>
        </Button>
        <Button onPress={() => setCount(0)}>
          <Text>Reset</Text>
        </Button>
        <Button onPress={() => setCount((c) => c + 1)}>
          <Text>+</Text>
        </Button>
      </View>
    </View>
  );
}
