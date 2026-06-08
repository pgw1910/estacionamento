import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const veiculos = [
  { id: '1', nome: 'Tales',   placa: 'W54DE',  tipo: 'moto' },
  { id: '2', nome: 'Ana',     placa: 'AS546D', tipo: 'moto' },
  { id: '3', nome: 'Pirelli', placa: 'FG54H',  tipo: 'carro' },
  { id: '4', nome: 'Micheli', placa: 'TS547G', tipo: 'moto' },
  { id: '5', nome: 'Jax',     placa: 'H7GF5',  tipo: 'carro' },
];

function VehicleIcon({ tipo }) {
  return (
    <Ionicons
      name={tipo === 'moto' ? 'bicycle-outline' : 'car-outline'}
      size={26}
      color="#1a3a6b"
    />
  );
}

export default function RegistrarSaidaScreen({ navigation }) {
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
        <TouchableOpacity>
          <Ionicons name="search-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={veiculos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listName}>{item.nome}</Text>
            <VehicleIcon tipo={item.tipo} />
            <Text style={styles.listPlate}>{item.placa}</Text>
            <TouchableOpacity style={styles.exitBtn}>
              <Ionicons name="log-out-outline" size={22} color="#1a3a6b" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="car" size={24} color="#1a3a6b" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Historico')}>
          <Ionicons name="calendar-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Perfil')}>
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
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerName: { color: '#fff', fontSize: 14, fontWeight: '600' },
  content: { padding: 16 },
  listItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  listName: { fontSize: 14, fontWeight: '700', color: '#2d3748', minWidth: 55 },
  listPlate: { fontSize: 14, fontWeight: '600', color: '#4a5568', flex: 1 },
  exitBtn: { padding: 4 },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    height: 64, alignItems: 'center', justifyContent: 'space-around',
  },
  navBtn: { padding: 10 },
});
