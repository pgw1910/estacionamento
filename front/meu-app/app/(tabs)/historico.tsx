import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth, API_URL } from '@/context/auth-context';
import { AppHeader } from '@/components/app-header';

const BLUE = '#1A3A7A';

interface HistoryRecord {
  id: number;
  vehicle_plate: string;
  owner_name: string;
  vehicle_type: 'car' | 'moto';
  entry_time: string;
  exit_time: string | null;
  status: 'in' | 'out';
}

interface GroupedSection {
  title: string;
  data: HistoryRecord[];
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatTime(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

function groupByDay(records: HistoryRecord[]): GroupedSection[] {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const map = new Map<string, HistoryRecord[]>();
  for (const r of records) {
    const key = dayKey(r.entry_time);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }

  const sections: GroupedSection[] = [];
  map.forEach((data, key) => {
    let title = key;
    if (key === today) title = 'Hoje';
    else if (key === yesterday) title = 'Ontem';
    else {
      const d = new Date(key);
      title = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
    sections.push({ title, data });
  });

  return sections;
}

export default function HistoricoScreen() {
  const { token } = useAuth();
  const [allRecords, setAllRecords] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchHistory(query = '') {
    try {
      const params = query ? `?search=${encodeURIComponent(query)}` : '';
      const res = await fetch(`${API_URL}/api/history/${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllRecords(data.records ?? []);
      }
    } catch {
      // silencia erro de rede
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchHistory(search);
    }, [token])
  );

  function onRefresh() {
    setRefreshing(true);
    fetchHistory(search);
  }

  function handleSearch() {
    setLoading(true);
    fetchHistory(search.trim());
  }

  // Agrupa por dia
  const sections = groupByDay(allRecords);

  // Monta lista flat com headers de seção
  type ListItem =
    | { type: 'header'; title: string; key: string }
    | { type: 'record'; record: HistoryRecord; key: string };

  const flatData: ListItem[] = [];
  for (const section of sections) {
    flatData.push({ type: 'header', title: section.title, key: `h_${section.title}` });
    for (const r of section.data) {
      flatData.push({ type: 'record', record: r, key: `r_${r.id}` });
    }
  }

  function renderItem({ item }: { item: ListItem }) {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }

    const { record } = item;
    const isMoto = record.vehicle_type === 'moto';

    return (
      <View style={styles.card}>
        {/* Coluna esquerda: nome + data */}
        <View style={styles.colLeft}>
          <Text style={styles.ownerName}>
            {record.owner_name || '—'}
          </Text>
          <Text style={styles.dateText}>{formatDate(record.entry_time)}</Text>
        </View>

        <View style={styles.divider} />

        {/* Placa */}
        <Text style={styles.plate}>{record.vehicle_plate}</Text>

        {/* Horários */}
        <View style={styles.timesCol}>
          <Text style={styles.timeLabel}>Horário de Chegada</Text>
          <Text style={styles.timeValue}>{formatTime(record.entry_time)}</Text>
          <Text style={styles.timeLabel}>Horário de Saída</Text>
          <Text style={styles.timeValue}>{formatTime(record.exit_time)}</Text>
        </View>

        {/* Ícone tipo */}
        <MaterialCommunityIcons
          name={isMoto ? 'motorbike' : 'car'}
          size={26}
          color={BLUE}
          style={styles.typeIcon}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />
      <AppHeader />
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Histórico</Text>
      </View>

      {/* Barra de pesquisa */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o nome ou placa"
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Ionicons name="search" size={20} color={BLUE} />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={BLUE} size="large" />
        </View>
      ) : flatData.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="history" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },

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

  /* Search */
  searchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 15,
    color: '#222',
  },
  searchBtn: {
    padding: 4,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: { color: '#aaa', fontSize: 16 },

  list: {
    padding: 16,
    gap: 10,
  },

  /* Seção */
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },

  /* Card */
  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  colLeft: {
    width: 80,
    alignItems: 'flex-start',
    flexShrink: 1,
    marginRight: 4,
  },
  ownerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#bbb',
    marginHorizontal: 10,
  },

  plate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 1,
    width: 72,
  },

  timesCol: {
    flex: 1,
    paddingLeft: 8,
  },
  timeLabel: {
    fontSize: 10,
    color: '#888',
  },
  timeValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },

  typeIcon: {
    marginLeft: 6,
  },
});
