import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useAuth, API_URL } from '@/context/auth-context';
import { AppHeader } from '@/components/app-header';

const BLUE = '#1A3A7A';

interface ParkingStatus {
  current_vehicles: number;
  max_vehicles: number;
  available_spots: number;
  is_full: boolean;
}

interface VehicleCounts {
  carros: number;
  motos: number;
  maxCarros: number;
  maxMotos: number;
}

export default function HomeScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [status, setStatus] = useState<ParkingStatus | null>(null);
  const [counts, setCounts] = useState<VehicleCounts>({ carros: 0, motos: 0, maxCarros: 30, maxMotos: 20 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Busca status geral
      const [statusRes, currentRes, configRes] = await Promise.all([
        fetch(`${API_URL}/api/status/`, { headers }),
        fetch(`${API_URL}/api/current/`, { headers }),
        fetch(`${API_URL}/api/config/`, { headers }),
      ]);

      if (statusRes.ok) {
        const s = await statusRes.json();
        setStatus(s);
      }

      if (currentRes.ok && configRes.ok) {
        const currentData = await currentRes.json();
        const configData = await configRes.json();

        // Conta carros e motos separadamente
        const vehicles: any[] = currentData.vehicles ?? [];
        const carros = vehicles.filter((v) => v.vehicle_type === 'car').length;
        const motos = vehicles.filter((v) => v.vehicle_type === 'moto').length;

        // Pega config (max total — divide proporcionalmente se não houver separado)
        const config = Array.isArray(configData) ? configData[0] : configData;
        const maxTotal = config?.max_vehicles ?? 50;
        const maxCarros = Math.round(maxTotal * 0.6);
        const maxMotos = maxTotal - maxCarros;

        setCounts({ carros, motos, maxCarros, maxMotos });
      }
    } catch (e) {
      // Silencia erros de rede na tela home
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />
      <AppHeader />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={BLUE} />}
      >
        {/* Indicador de ocupação */}
        <View style={styles.cardSecondary}>
          {loading ? (
            <ActivityIndicator color={BLUE} />
          ) : (
            <View style={styles.occupancyRow}>
              {/* Carros */}
              <View style={styles.occupancyItem}>
                <MaterialCommunityIcons name="car" size={32} color={BLUE} />
                <Text style={styles.occupancyText}>
                  <Text style={styles.occupancyCount}>{counts.carros}</Text>
                  <Text style={styles.occupancyMax}>/{counts.maxCarros}</Text>
                </Text>
              </View>

              <View style={styles.divider} />

              {/* Motos */}
              <View style={styles.occupancyItem}>
                <MaterialCommunityIcons name="motorbike" size={32} color={BLUE} />
                <Text style={styles.occupancyText}>
                  <Text style={styles.occupancyCount}>{counts.motos}</Text>
                  <Text style={styles.occupancyMax}>/{counts.maxMotos}</Text>
                </Text>
              </View>

              {/* Status lotado */}
              {status?.is_full && (
                <View style={styles.fullBadge}>
                  <Text style={styles.fullBadgeText}>LOTADO</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Registrar Entrada */}
        <TouchableOpacity style={styles.cardSecondary} onPress={() => router.push('/(tabs)/entrada')} activeOpacity={0.85}>
          <MaterialCommunityIcons name="car-arrow-right" size={24} color="#555" style={styles.cardIcon} />
          <Text style={styles.cardSecondaryText}>Registrar Entrada</Text>
        </TouchableOpacity>

        {/* Registrar Saída */}
        <TouchableOpacity style={styles.cardSecondary} onPress={() => router.push('/(tabs)/saida')} activeOpacity={0.85}>
          <MaterialCommunityIcons name="car-arrow-left" size={24} color="#555" style={styles.cardIcon} />
          <Text style={styles.cardSecondaryText}>Registrar Saída</Text>
        </TouchableOpacity>

        {/* Histórico */}
        <TouchableOpacity style={styles.cardSecondary} onPress={() => router.push('/(tabs)/historico')} activeOpacity={0.85}>
          <MaterialIcons name="history" size={24} color="#555" style={styles.cardIcon} />
          <Text style={styles.cardSecondaryText}>Histórico</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  /* Content */
  content: {
    padding: 20,
    gap: 14,
  },

  /* Card cinza — ações secundárias */
  cardSecondary: {
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  cardSecondaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  cardIcon: {
    marginRight: 4,
  },

  /* Ocupação */
  occupancyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  occupancyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  occupancyText: {
    fontSize: 18,
  },
  occupancyCount: {
    fontWeight: '700',
    color: BLUE,
    fontSize: 20,
  },
  occupancyMax: {
    color: '#666',
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: '#ccc',
  },
  fullBadge: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#e53935',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fullBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
