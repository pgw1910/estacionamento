import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color={COLORS.white} />
        </View>
        <Text style={styles.headerName}>{user?.nome?.split(' ')[0] ?? 'Usuário'}</Text>
      </View>

      {/* Info card */}
      <View style={styles.card}>
        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{user?.nome ?? '--'}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Email</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{user?.email ?? '--'}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Telefone</Text>
          <View style={styles.fieldBox}>
            <Text style={styles.fieldValue}>{user?.telefone ?? '--'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerName: {
    color: COLORS.white,
    fontSize: FONTS.xl,
    fontWeight: '700',
  },
  card: {
    margin: 16,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  fieldRow: { gap: 4 },
  fieldLabel: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  fieldBox: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  fieldValue: {
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  logoutBtn: {
    marginHorizontal: 16,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.danger,
    fontSize: FONTS.md,
    fontWeight: '700',
  },
});
