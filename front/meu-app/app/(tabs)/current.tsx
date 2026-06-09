import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';

interface VehicleRecord {
  id: number;
  vehicle_plate: string;
  vehicle_owner: string;
  vehicle_type: string;
  entry_time: string;
  status: string;
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
  } catch {
    return '--/--';
  }
}

export default function CurrentVehiclesScreen() {
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exiting, setExiting] = useState<number | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await fetch(ENDPOINTS.current);
      const data = await res.json();
      setVehicles(data.vehicles ?? []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const handleExit = (record: VehicleRecord) => {
    Alert.alert(
      'Registrar Saída',
      `Confirmar saída de ${record.vehicle_plate}${record.vehicle_owner ? ` (${record.vehicle_owner})` : ''}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setExiting(record.id);
            try {
              const res = await fetch(ENDPOINTS.exit(record.id), { method: 'POST' });
              const data = await res.json();
              if (res.ok) {
                Alert.alert('Saída Registrada', `Placa: ${data.plate}\nDuração: ${data.duration_minutes ?? 0} min`);
                fetchVehicles();
              } else {
                Alert.alert('Erro', data.error ?? 'Não foi possível registrar a saída.');
              }
            } catch {
              Alert.alert('Erro de conexão', 'Verifique o servidor.');
            } finally {
              setExiting(null);
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: VehicleRecord }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarText}>
            {item.vehicle_owner ? item.vehicle_owner.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View>
          <Text style={styles.ownerName}>{item.vehicle_owner || 'Sem nome'}</Text>
          <Text style={styles.plate}>{item.vehicle_plate}</Text>
        </View>
      </View>

      <View style={styles.cardCenter}>
        <Ionicons
          name={item.vehicle_type === 'moto' ? 'bicycle' : 'car'}
          size={20}
          color={COLORS.primary}
        />
      </View>

      <TouchableOpacity
        style={styles.exitBtn}
        onPress={() => handleExit(item)}
        disabled={exiting === item.id}
        activeOpacity={0.8}
      >
        {exiting === item.id
          ? <ActivityIndicator size="small" color={COLORS.white} />
          : <Ionicons name="exit-outline" size={18} color={COLORS.white} />
        }
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      {loading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchVehicles(); }} tintColor={COLORS.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="car-outline" size={48} color={COLORS.textLight} />
              <Text style={styles.emptyText}>Nenhum veículo no estacionamento</Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              Veículos Presentes ({vehicles.length})
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, gap: 10 },
  sectionTitle: {
    fontSize: FONTS.base,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.md },
  ownerName: { fontSize: FONTS.base, fontWeight: '600', color: COLORS.text },
  plate: { fontSize: FONTS.sm, color: COLORS.textSecondary, marginTop: 2 },
  cardCenter: { paddingHorizontal: 12 },
  exitBtn: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
    gap: 12,
  },
  emptyText: { fontSize: FONTS.base, color: COLORS.textSecondary },
});
