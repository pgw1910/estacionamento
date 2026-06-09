import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';

const BLUE = '#1A3A7A';

interface AppHeaderProps {
  title?: string;
}

export function AppHeader({ title }: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {/* Avatar + nome */}
      <TouchableOpacity
        style={styles.left}
        onPress={() => router.push('/(tabs)/perfil')}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={20} color={BLUE} />
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {user?.full_name || user?.username || 'Operador'}
        </Text>
      </TouchableOpacity>

      {title ? <Text style={styles.title}>{title}</Text> : <View style={styles.spacer} />}

      {/* Logout */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.7}>
        <MaterialIcons name="logout" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A3A7A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    flexShrink: 1,
  },
  title: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  spacer: { flex: 1 },
  logoutBtn: { padding: 4 },
});
