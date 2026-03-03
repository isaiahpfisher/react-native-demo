import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { CheckIcon, PlusIcon, TrashIcon } from 'lucide-react-native';
import * as React from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export default function TodoScreen() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [input, setInput] = React.useState('');
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const nextId = React.useRef(1);

  React.useEffect(() => {
    fetchTodos().then((todos) => {
      const loaded = todos ?? [];
      setTodos(loaded);
      if (loaded.length > 0) {
        // @ts-expect-error
        nextId.current = Math.max(...loaded.map((t) => t.id)) + 1;
      }
      setHasLoaded(true);
    });
  }, []);

  const addTodo = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const todo = { id: nextId.current++, text: trimmed, done: false };

    try {
      await AsyncStorage.setItem('todos', JSON.stringify([...todos, todo]));
      setTodos((prev) => [...prev, todo]);
      setInput('');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      return todos != null ? JSON.parse(todos) : null;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      await AsyncStorage.setItem(
        'todos',
        JSON.stringify(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
      );
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    } catch (error) {
      console.error(error);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos.filter((t) => t.id !== id)));
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const pending = todos.filter((t) => !t.done).length;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={150}>
      {!hasLoaded ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="flex-1 p-4">
          {todos.length > 0 && (
            <>
              <View className="items-center pb-4">
                <Text className="text-sm text-muted-foreground">
                  {`${pending} of ${todos.length} remaining`}
                </Text>
              </View>

              <Separator className="mb-4" />
            </>
          )}

          <FlatList
            data={todos}
            keyExtractor={(item) => String(item.id)}
            contentContainerClassName={cn(
              'gap-2',
              todos.length === 0 && 'flex-1 items-center justify-center'
            )}
            renderItem={({ item }) => (
              <View className="flex-row items-center gap-3 rounded-lg border border-border bg-card p-3">
                <Pressable
                  onPress={() => toggleTodo(item.id)}
                  className={cn(
                    'size-6 items-center justify-center rounded-full border',
                    item.done
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground bg-transparent'
                  )}>
                  {item.done && <Icon as={CheckIcon} className="size-4 text-primary-foreground" />}
                </Pressable>

                <Text
                  className={cn(
                    'flex-1 text-base',
                    item.done ? 'text-muted-foreground line-through' : ''
                  )}>
                  {item.text}
                </Text>

                <Button variant="ghost" size="icon" onPress={() => removeTodo(item.id)}>
                  <Icon as={TrashIcon} className="size-4 text-destructive" />
                </Button>
              </View>
            )}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center gap-2 py-16">
                <Text className="text-2xl font-bold">No todos yet...</Text>
                <Text className="text-base text-muted-foreground">Do you even have a life?</Text>
              </View>
            }
          />

          <View className="flex-row gap-2">
            <Input
              className="flex-1"
              placeholder="Add a new todo..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={addTodo}
              returnKeyType="done"
            />
            <Button onPress={addTodo} size="icon">
              <Icon as={PlusIcon} className="size-5 text-primary-foreground" />
            </Button>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
