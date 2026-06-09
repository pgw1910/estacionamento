import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth, API_URL } from '@/context/auth-context';
import { AppHeader } from '@/components/app-header';

const BLUE = '#1A3A7A';

type VehicleType = 'car' | 'moto';

function nowFormatted() {
  const now = new Date();
  const date = now.toLocaleDateString('pt-BR');
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return { date, time };
}

export default function EntradaScreen() {
  const { token } = useAuth();

  const [scanning, setScanning] = useState(false);
  const [plate, setPlate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [recordId, setRecordId] = useState<number | null>(null);

  const imageUriRef = useRef<string>('');

  function resetState() {
    setPlate('');
    setOwnerName('');
    setVehicleType('car');
    setArrivalDate('');
    setArrivalTime('');
    setConfirmed(false);
    setRecordId(null);
    imageUriRef.current = '';
  }

  async function handleScanImage() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (gallery.status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à câmera ou galeria.');
        return;
      }
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: true,
      aspect: [16, 9],
    }).catch(() =>
      ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 })
    );

    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    imageUriRef.current = uri;
    resetState();
    await sendImageToAPI(uri);
  }

  async function handlePickFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de acesso à galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;
    const uri = result.assets[0].uri;
    imageUriRef.current = uri;
    resetState();
    await sendImageToAPI(uri);
  }

  async function sendImageToAPI(uri: string) {
    setScanning(true);
    try {
      const { date, time } = nowFormatted();

      const formData = new FormData();
      formData.append('image', { uri, name: 'plate.jpg', type: 'image/jpeg' } as any);

      const response = await fetch(`${API_URL}/api/entry/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.status === 409) {
        Alert.alert('Veículo já está no pátio', `A placa ${data.plate ?? ''} já tem entrada registrada.`);
        return;
      }

      if (response.status === 404) {
        const detected = data?.plate ?? '???';
        Alert.alert(
          'Veículo não cadastrado',
          `A placa "${detected}" não está cadastrada no sistema.\nApenas veículos cadastrados podem entrar.`
        );
        return;
      }

      if (!response.ok) {
        Alert.alert('Erro', data?.error ?? 'Não foi possível reconhecer a placa.');
        return;
      }

      setPlate(data.plate);
      setOwnerName(data.owner_name || '—');
      setVehicleType(data.vehicle_type === 'moto' ? 'moto' : 'car');
      setArrivalDate(date);
      setArrivalTime(time);
      setRecordId(data.record_id);
      setConfirmed(true);
    } catch {
      Alert.alert('Erro de rede', 'Não foi possível conectar ao servidor.');
    } finally {
      setScanning(false);
    }
  }

  function handleConfirm() {
    Alert.alert(
      'Entrada confirmada',
      `Placa: ${plate}\nProprietário: ${ownerName}\nTipo: ${vehicleType === 'car' ? 'Carro' : 'Moto'}\nEntrada: ${arrivalDate} às ${arrivalTime}`,
      [{ text: 'OK', onPress: resetState }]
    );
  }

  async function handleCancel() {
    if (!recordId) {
      resetState();
      return;
    }

    Alert.alert(
      'Cancelar registro',
      `Deseja cancelar a entrada de ${plate}? O registro será removido.`,
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Registra saída imediata para desfazer a entrada
              await fetch(`${API_URL}/api/exit/${recordId}/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
              });
            } catch {
              // Silencia — mesmo com erro de rede reseta a tela
            } finally {
              resetState();
            }
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BLUE} barStyle="light-content" />
      <AppHeader />
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Registrar Entrada</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Botões de captura */}
        <View style={styles.captureRow}>
          <TouchableOpacity style={styles.captureBtn} onPress={handleScanImage} disabled={scanning}>
            <MaterialCommunityIcons name="camera" size={28} color={BLUE} />
            <Text style={styles.captureBtnText}>Câmera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureBtn} onPress={handlePickFromGallery} disabled={scanning}>
            <MaterialIcons name="photo-library" size={28} color={BLUE} />
            <Text style={styles.captureBtnText}>Galeria</Text>
          </TouchableOpacity>
        </View>

        {scanning && (
          <View style={styles.scanningBox}>
            <ActivityIndicator color={BLUE} size="large" />
            <Text style={styles.scanningText}>Reconhecendo placa...</Text>
          </View>
        )}

        {confirmed && (
          <>
            {/* Card: ícone tipo | placa | dono */}
            <View style={styles.resultCard}>
              <MaterialCommunityIcons
                name={vehicleType === 'moto' ? 'motorbike' : 'car'}
                size={32}
                color={BLUE}
              />
              <View style={styles.resultInfo}>
                <Text style={styles.plateText}>{plate}</Text>
                <Text style={styles.ownerText}>{ownerName}</Text>
              </View>
            </View>

            {/* Data de chegada */}
            <Text style={styles.sectionLabel}>Data de Chegada</Text>
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={20} color={BLUE} />
              <Text style={styles.infoCardText}>{arrivalDate}</Text>
            </View>

            {/* Horário de chegada */}
            <Text style={styles.sectionLabel}>Horário de Chegada</Text>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={20} color={BLUE} />
              <Text style={styles.infoCardText}>{arrivalTime}</Text>
            </View>

            {/* Botões confirmar / cancelar */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
                activeOpacity={0.85}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleConfirm}
                activeOpacity={0.85}
              >
                <Text style={styles.confirmBtnText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {!scanning && !confirmed && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="car-search" size={72} color="#ccc" />
            <Text style={styles.emptyText}>Tire uma foto da placa{'\n'}ou selecione da galeria</Text>
          </View>
        )}
      </ScrollView>
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
  subHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },

  content: { padding: 20, gap: 14 },

  captureRow: { flexDirection: 'row', gap: 12 },
  captureBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BLUE,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
    elevation: 2,
  },
  captureBtnText: { color: BLUE, fontWeight: '600', fontSize: 14 },

  scanningBox: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  scanningText: { color: '#555', fontSize: 15 },

  resultCard: {
    backgroundColor: '#EBEBEB',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resultInfo: { flex: 1 },
  plateText: { fontSize: 20, fontWeight: '700', color: '#222', letterSpacing: 2 },
  ownerText: { fontSize: 15, color: '#555', marginTop: 2 },

  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: -6 },

  infoCard: {
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoCardText: { fontSize: 16, color: '#222', fontWeight: '500' },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e53935',
    backgroundColor: '#fff',
  },
  cancelBtnText: {
    color: '#e53935',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },

  emptyState: { alignItems: 'center', paddingTop: 48, gap: 16 },
  emptyText: { color: '#aaa', fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
