import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PerfilScreen({ navigation }) {
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Avatar grande */}
        <View style={styles.bigAvatar}>
          <Ionicons name="person" size={44} color="#a0aec0" />
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Nome</Text>
          <Text style={styles.fieldValue}>José Carvalho</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Text style={styles.fieldValue}>Josebrabo@gmail.com</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Telefone</Text>
          <Text style={styles.fieldValue}>(24) 98855-8590</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('RegistrarSaida')}>
          <Ionicons name="car-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Historico')}>
          <Ionicons name="calendar-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="menu" size={24} color="#1a3a6b" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f0f2f5' },
  header: {
    backgroundColor: '#1a3a6b', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  bigAvatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginTop: 20, marginBottom: 28,
  },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, color: '#718096', fontWeight: '600', marginBottom: 4 },
  fieldValue: {
    fontSize: 15, fontWeight: '600', color: '#2d3748',
    borderBottomWidth: 1.5, borderBottomColor: '#e2e8f0', paddingBottom: 10,
  },
  logoutBtn: {
    alignSelf: 'center', marginTop: 32,
    borderWidth: 1.5, borderColor: '#e53e3e', borderRadius: 20,
    paddingHorizontal: 48, paddingVertical: 12,
    backgroundColor: '#fff',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#e53e3e' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    height: 64, alignItems: 'center', justifyContent: 'space-around',
  },
  navBtn: { padding: 10 },
});
