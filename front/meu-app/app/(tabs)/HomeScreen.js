import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a3a6b" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={18} color="#fff" />
          </View>
          <Text style={styles.headerName}>José</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('RegistrarEntrada')}
        >
          <Text style={styles.actionBtnText}>Registrar Entrada</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('RegistrarSaida')}
        >
          <Text style={styles.actionBtnText}>Registrar Saída</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons name="car-outline" size={28} color="#1a3a6b" />
            <Text style={styles.statCount}>04/30</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bicycle-outline" size={28} color="#1a3a6b" />
            <Text style={styles.statCount}>02/10</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('Historico')}
        >
          <Text style={styles.actionBtnText}>Historico</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="home" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('RegistrarSaida')}
        >
          <Ionicons name="car-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('Historico')}
        >
          <Ionicons name="calendar-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => navigation.navigate('Perfil')}
        >
          <Ionicons name="menu-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    backgroundColor: '#1a3a6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  actionBtn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  actionBtnText: { fontSize: 15, fontWeight: '600', color: '#2d3748' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  statCount: { fontSize: 15, fontWeight: '700', color: '#2d3748' },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navBtn: { padding: 10 },
});
