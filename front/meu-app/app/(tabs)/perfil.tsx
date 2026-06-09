import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { AppHeader } from '@/components/app-header';

const BLUE = '#1A3A7A';

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldBox}>
        <Text style={styles.fieldValue}>{value || '—'}</Text>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />
      <AppHeader />
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Avatar grande */}
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={52} color={BLUE} />
        </View>

        {user ? (
          <>
            <InfoField label="Nome" value={user.full_name} />
            <InfoField label="Telefone" value={user.telefone} />
            <InfoField label="Matrícula" value={user.matricula} />
          </>
        ) : (
          <ActivityIndicator color={BLUE} style={{ marginTop: 32 }} />
        )}

        {/* Botão logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  subHeader: {
    backgroundColor: BLUE,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  subHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 16,
  },

  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e8eaf0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  fieldWrapper: {
    width: '100%',
    gap: 4,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
    marginLeft: 2,
  },
  fieldBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  fieldValue: {
    fontSize: 16,
    color: '#222',
  },

  logoutBtn: {
    marginTop: 16,
    width: '70%',
    borderWidth: 1.5,
    borderColor: '#e53935',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
});
