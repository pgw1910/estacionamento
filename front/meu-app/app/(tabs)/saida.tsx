import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth, API_URL } from '@/context/auth-context';
import { AppHeader } from '@/components/app-header';

const BLUE = '#1A3A7A';

interface ParkingRecord {
  id: number;
  vehicle_plate: string;
  owner_name: string;
  vehicle_type: 'car' | 'moto';
  entry_time: string;
}

export default function SaidaScreen() {
  const { token } = useAuth();
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exiting, setExiting] = useState<number | null>(null);

  async function fetchCurrent() {
    try {
      const res = await fetch(`${API_URL}/api/current/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRecords(data.vehicles ?? []);
      }
    } catch {
      // silencia erro de rede
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Recarrega sempre que a aba ganha foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCurrent();
    }, [token])
  );

  function onRefresh() {
    setRefreshing(true);
    fetchCurrent();
  }

  async function handleExit(record: ParkingRecord) {
    Alert.alert(
      'Confirmar saída',
      `Registrar saída de ${record.owner_name} (${record.vehicle_plate})?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            setExiting(record.id);
            try {
              const res = await fetch(`${API_URL}/api/exit/${record.id}/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
              });

              if (res.ok) {
                setRecords((prev) => prev.filter((r) => r.id !== record.id));
                Alert.alert('Saída registrada', `${record.owner_name} saiu às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.`);
              } else {
                const data = await res.json().catch(() => ({}));
                Alert.alert('Erro', data?.error ?? 'Não foi possível registrar a saída.');
              }
            } catch {
              Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor.');
            } finally {
              setExiting(null);
            }
          },
        },
      ]
    );
  }

  function renderItem({ item }: { item: ParkingRecord }) {
    const isMoto = item.vehicle_type === 'moto';
    const isExiting = exiting === item.id;

    return (
      <View style={styles.card}>
        {/* Nome */}
        <Text style={styles.ownerName}>
          {item.owner_name || '—'}
        </Text>

        <View style={styles.divider} />

        {/* Ícone tipo */}
        <MaterialCommunityIcons
          name={isMoto ? 'motorbike' : 'car'}
          size={28}
          color={BLUE}
          style={styles.typeIcon}
        />

        {/* Placa */}
        <Text style={styles.plate}>{item.vehicle_plate}</Text>

        {/* Botão saída */}
        <TouchableOpacity
          style={styles.exitBtn}
          onPress={() => handleExit(item)}
          disabled={isExiting}
          activeOpacity={0.7}
        >
          {isExiting ? (
            <ActivityIndicator color={BLUE} size="small" />
          ) : (
            <Ionicons name="exit-outline" size={26} color={BLUE} />
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />
      <AppHeader />
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Registrar Saída</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={BLUE} size="large" />
        </View>
      ) : records.length === 0 ? (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="car-off" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum veículo no pátio</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          keyExtractor={(item) => String(item.id)}
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

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 16,
  },

  list: {
    padding: 16,
    gap: 12,
  },

  card: {
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  ownerName: {
    width: 80,
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: 4,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#bbb',
    marginHorizontal: 12,
  },

  typeIcon: {
    marginRight: 10,
  },

  plate: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 1,
  },

  exitBtn: {
    padding: 6,
  },
});
