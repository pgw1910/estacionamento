import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function HistItem({ nome, data, placa, chegada, saida, tipo }) {
  return (
    <View style={styles.histItem}>
      <View style={styles.histLeft}>
        <Text style={styles.histName}>{nome}</Text>
        <Text style={styles.histDate}>{data}</Text>
        <Text style={styles.histPlate}>{placa}</Text>
      </View>
      <View style={styles.histTimes}>
        <Text style={styles.histTimeLabel}>Horário de Chegada</Text>
        <Text style={styles.histTimeVal}>{chegada}</Text>
        <Text style={styles.histTimeLabel}>Horário de Saída</Text>
        <Text style={styles.histTimeVal}>{saida}</Text>
      </View>
      <Ionicons
        name={tipo === 'moto' ? 'bicycle-outline' : 'car-outline'}
        size={26} color="#1a3a6b"
      />
    </View>
  );
}

export default function HistoricoScreen({ navigation }) {
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o nome"
            placeholderTextColor="#a0aec0"
          />
          <Ionicons name="search-outline" size={18} color="#a0aec0" style={styles.searchIcon} />
        </View>

        <Text style={styles.dayLabel}>Hoje</Text>
        <HistItem nome="Tales"   data="20/05" placa="W54DE"  chegada="08:10" saida="12:00" tipo="moto" />
        <HistItem nome="Ana"     data="20/05" placa="AS546D" chegada="08:10" saida="12:00" tipo="moto" />
        <HistItem nome="Pirelli" data="20/05" placa="FG54H"  chegada="08:10" saida="12:00" tipo="carro" />
        <HistItem nome="Micheli" data="20/05" placa="W54DE"  chegada="08:10" saida="12:00" tipo="moto" />

        <Text style={[styles.dayLabel, { marginTop: 12 }]}>Ontem</Text>
        <HistItem nome="Tales"   data="19/05" placa="D45AS"  chegada="08:13" saida="12:10" tipo="carro" />
        <HistItem nome="Micheli" data="19/05" placa="W54DE"  chegada="08:10" saida="12:10" tipo="moto" />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => navigation.navigate('RegistrarSaida')}>
          <Ionicons name="car-outline" size={24} color="#a0aec0" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn}>
          <Ionicons name="calendar" size={24} color="#1a3a6b" />
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
  searchBox: { position: 'relative', marginBottom: 14 },
  searchInput: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    paddingRight: 40, fontSize: 14, color: '#2d3748',
  },
  searchIcon: { position: 'absolute', right: 12, top: 12 },
  dayLabel: { fontSize: 15, fontWeight: '700', color: '#2d3748', marginBottom: 10 },
  histItem: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  histLeft: { minWidth: 50 },
  histName: { fontSize: 14, fontWeight: '700', color: '#2d3748' },
  histDate: { fontSize: 11, color: '#718096' },
  histPlate: { fontSize: 13, fontWeight: '600', color: '#4a5568' },
  histTimes: { flex: 1 },
  histTimeLabel: { fontSize: 12, color: '#718096' },
  histTimeVal: { fontSize: 12, fontWeight: '600', color: '#2d3748' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    height: 64, alignItems: 'center', justifyContent: 'space-around',
  },
  navBtn: { padding: 10 },
});
