import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONTS } from '@/constants/theme';

interface AppHeaderProps {
  onLogout?: () => void;
}

export default function AppHeader({ onLogout }: AppHeaderProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={18} color={COLORS.white} />
        </View>
        <Text style={styles.name}>{user?.nome?.split(' ')[0] ?? 'Usuário'}</Text>
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Ionicons name="exit-outline" size={22} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: COLORS.white,
    fontSize: FONTS.md,
    fontWeight: '600',
  },
  logoutBtn: {
    padding: 4,
  },
});
