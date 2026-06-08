import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegistrarEntradaScreen({ navigation }) {
  const [tipo, setTipo] = useState('Moto');

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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Registrar Entrada</Text>

        {/* Placa + Nome */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Placa"
            defaultValue="W54DE"
            placeholderTextColor="#a0aec0"
          />
          <View style={styles.inputTag}>
            <Text style={styles.inputTagText}>Tales</Text>
          </View>
        </View>

        {/* Tipo de veículo */}
        <Text style={styles.sectionLabel}>Selecione o tipo de veículo</Text>
        <View style={styles.typeBtns}>
          {['Moto', 'Carro'].map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.typeBtn, tipo === t && styles.typeBtnSelected]}
              onPress={() => setTipo(t)}
            >
              <Text style={[styles.typeBtnText, tipo === t && styles.typeBtnTextSelected]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Data */}
        <Text style={styles.sectionLabel}>Data de Chegada</Text>
        <View style={styles.dateField}>
          <Text style={styles.dateText}>20/05/2026</Text>
        </View>

        {/* Horário */}
        <Text style={styles.sectionLabel}>Horário de Chegada</Text>
        <View style={styles.dateField}>
          <Text style={styles.dateText}>19:45</Text>
        </View>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.confirmBtnText}>Confirmar</Text>
        </TouchableOpacity>
      </ScrollView>

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
  content: { flex: 1, padding: 16 },
  pageTitle: { fontSize: 16, fontWeight: '700', color: '#2d3748', marginBottom: 16 },
  inputRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  input: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 15, color: '#2d3748',
  },
  inputTag: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13,
    minWidth: 70, alignItems: 'center', justifyContent: 'center',
  },
  inputTagText: { fontSize: 15, fontWeight: '600', color: '#2d3748' },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: '#718096',
    textTransform: 'uppercase', letterSpacing: 0.5,
    marginBottom: 8, marginTop: 14,
  },
  typeBtns: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  typeBtn: {
    borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10,
    paddingHorizontal: 24, paddingVertical: 10,
    backgroundColor: '#fff',
  },
  typeBtnSelected: { backgroundColor: '#1a3a6b', borderColor: '#1a3a6b' },
  typeBtnText: { fontSize: 14, fontWeight: '600', color: '#2d3748' },
  typeBtnTextSelected: { color: '#fff' },
  dateField: {
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, marginBottom: 10,
  },
  dateText: { fontSize: 15, fontWeight: '600', color: '#2d3748' },
  confirmBtn: {
    backgroundColor: '#1a3a6b', borderRadius: 10,
    paddingVertical: 16, alignItems: 'center', marginTop: 20, marginBottom: 24,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  bottomNav: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#e2e8f0',
    height: 64, alignItems: 'center', justifyContent: 'space-around',
  },
  navBtn: { padding: 10 },
});
