import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';

interface HistoryRecord {
  id: number;
  vehicle_plate: string;
  vehicle_owner: string;
  vehicle_type: string;
  entry_time: string;
  exit_time: string | null;
  status: string;
}

interface GroupedRecords {
  title: string;
  data: HistoryRecord[];
}

function formatTime(iso: string | null) {
  if (!iso) return '--:--';
  try {
    return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch { return '--:--'; }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch { return '--/--'; }
}

function groupByDate(records: HistoryRecord[]): GroupedRecords[] {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const groups: Record<string, HistoryRecord[]> = {};

  records.forEach((r) => {
    const dateStr = r.entry_time.slice(0, 10);
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(r);
  });

  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, data]) => {
      let title = date;
      if (date === fmt(today)) title = 'Hoje';
      else if (date === fmt(yesterday)) title = 'Ontem';
      else {
        const [y, m, d] = date.split('-');
        title = `${d}/${m}/${y}`;
      }
      return { title, data };
    });
}

export default function HistoryScreen() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('');

  const fetchHistory = useCallback(async (q = '') => {
    try {
      const params = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`${ENDPOINTS.history}${params}`);
      const data = await res.json();
      setRecords(data.records ?? []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleSearch = (text: string) => {
    setSearch(text);
    fetchHistory(text);
  };

  const grouped = groupByDate(records);

  // Flatten for FlatList with section headers
  const flatData: Array<{ type: 'header'; title: string } | { type: 'item'; record: HistoryRecord }> = [];
  grouped.forEach((g) => {
    flatData.push({ type: 'header', title: g.title });
    g.data.forEach((r) => flatData.push({ type: 'item', record: r }));
  });

  const renderItem = ({ item }: { item: typeof flatData[number] }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }
    const r = item.record;
    return (
      <View style={styles.card}>
        <View style={styles.cardLeft}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {r.vehicle_owner ? r.vehicle_owner.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.ownerName}>{r.vehicle_owner || 'Sem nome'}</Text>
            <Text style={styles.dateText}>{formatDate(r.entry_time)} · {r.vehicle_plate}</Text>
          </View>
        </View>

        <View style={styles.timesArea}>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Chegada</Text>
            <Text style={styles.timeValue}>{formatTime(r.entry_time)}</Text>
          </View>
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Saída</Text>
            <Text style={styles.timeValue}>{formatTime(r.exit_time)}</Text>
          </View>
        </View>

        <Ionicons
          name={r.vehicle_type === 'moto' ? 'bicycle' : 'car'}
          size={18}
          color={COLORS.textLight}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader />

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={COLORS.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou placa..."
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={flatData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `h-${item.title}` : `r-${item.record.id}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchHistory(search); }}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="time-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Nenhum registro encontrado</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24, gap: 8 },
  sectionHeader: {
    fontSize: FONTS.sm,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.base },
  ownerName: { fontSize: FONTS.base, fontWeight: '600', color: COLORS.text },
  dateText: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 1 },
  timesArea: { gap: 2, alignItems: 'flex-end' },
  timeRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  timeLabel: { fontSize: FONTS.sm - 1, color: COLORS.textLight },
  timeValue: { fontSize: FONTS.sm, fontWeight: '600', color: COLORS.text, minWidth: 38, textAlign: 'right' },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: FONTS.base, color: COLORS.textSecondary },
});
