import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';

interface ParkingStatus {
  current_vehicles: number;
  max_vehicles: number | null;
  available_spots: number | null;
  is_full: boolean;
}

interface VehicleCounts {
  cars: number;
  motos: number;
}

export default function HomeScreen() {
  const [status, setStatus] = useState<ParkingStatus | null>(null);
  const [counts, setCounts] = useState<VehicleCounts>({ cars: 0, motos: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, currentRes] = await Promise.all([
        fetch(ENDPOINTS.status),
        fetch(ENDPOINTS.current),
      ]);
      const statusData: ParkingStatus = await statusRes.json();
      const currentData = await currentRes.json();

      setStatus(statusData);

      const vehicles: any[] = currentData.vehicles ?? [];
      const cars = vehicles.filter((v) => v.vehicle_type === 'car').length;
      const motos = vehicles.filter((v) => v.vehicle_type === 'moto').length;
      setCounts({ cars, motos });
    } catch {
      // network not available in sandbox; keep empty state
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Counters row */}
            <View style={styles.countersRow}>
              <View style={styles.counterCard}>
                <Ionicons name="car" size={28} color={COLORS.primary} />
                <Text style={styles.counterNumber}>{counts.cars}</Text>
                <Text style={styles.counterLabel}>Carros</Text>
              </View>
              <View style={[styles.counterCard, styles.counterCardSep]}>
                <Text style={styles.slashDivider}>/</Text>
              </View>
              <View style={styles.counterCard}>
                <Ionicons name="bicycle" size={28} color={COLORS.primary} />
                <Text style={styles.counterNumber}>{counts.motos}</Text>
                <Text style={styles.counterLabel}>Motos</Text>
              </View>
            </View>

            {status && (
              <View style={styles.statusCard}>
                <Text style={styles.statusTitle}>Status do Estacionamento</Text>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Veículos dentro:</Text>
                  <Text style={styles.statusValue}>{status.current_vehicles}</Text>
                </View>
                {status.max_vehicles !== null && (
                  <>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Capacidade máxima:</Text>
                      <Text style={styles.statusValue}>{status.max_vehicles}</Text>
                    </View>
                    <View style={styles.statusRow}>
                      <Text style={styles.statusLabel}>Vagas disponíveis:</Text>
                      <Text style={[styles.statusValue, { color: status.is_full ? COLORS.danger : COLORS.success }]}>
                        {status.available_spots}
                      </Text>
                    </View>
                  </>
                )}
                {status.is_full && (
                  <View style={styles.fullBadge}>
                    <Text style={styles.fullBadgeText}>ESTACIONAMENTO LOTADO</Text>
                  </View>
                )}
              </View>
            )}

            {/* Action buttons */}
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/(tabs)/entry')}
              activeOpacity={0.85}
            >
              <Ionicons name="enter-outline" size={22} color={COLORS.white} />
              <Text style={styles.actionBtnText}>Registrar Entrada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={() => router.push('/(tabs)/current')}
              activeOpacity={0.85}
            >
              <Ionicons name="exit-outline" size={22} color={COLORS.primary} />
              <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Registrar Saída</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnGhost]}
              onPress={() => router.push('/(tabs)/history')}
              activeOpacity={0.85}
            >
              <Ionicons name="time-outline" size={22} color={COLORS.primary} />
              <Text style={[styles.actionBtnText, { color: COLORS.primary }]}>Histórico</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 14 },
  countersRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  counterCard: { alignItems: 'center', gap: 4 },
  counterCardSep: { opacity: 0.3 },
  slashDivider: { fontSize: 32, color: COLORS.textLight, fontWeight: '200' },
  counterNumber: { fontSize: FONTS.xxl, fontWeight: '800', color: COLORS.primary },
  counterLabel: { fontSize: FONTS.sm, color: COLORS.textSecondary },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statusTitle: { fontSize: FONTS.base, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusLabel: { fontSize: FONTS.base, color: COLORS.textSecondary },
  statusValue: { fontSize: FONTS.base, fontWeight: '600', color: COLORS.text },
  fullBadge: {
    marginTop: 8,
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.sm,
    padding: 8,
    alignItems: 'center',
  },
  fullBadgeText: { color: COLORS.white, fontWeight: '700', fontSize: FONTS.sm },
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionBtnOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  actionBtnGhost: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
});
