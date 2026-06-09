import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert, Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';
import { ENDPOINTS } from '@/constants/api';

type VehicleType = 'moto' | 'car';

export default function EntryScreen() {
  const [ownerName, setOwnerName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [arrivalDate, setArrivalDate] = useState(
    new Date().toLocaleDateString('pt-BR')
  );
  const [arrivalTime, setArrivalTime] = useState(
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleConfirm = async () => {
    if (!image) {
      Alert.alert('Atenção', 'Tire uma foto da placa do veículo.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'plate.jpg',
      } as any);
      formData.append('owner_name', ownerName);
      formData.append('vehicle_type', vehicleType);

      const response = await fetch(ENDPOINTS.entry, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Entrada Registrada!',
          `Placa: ${data.plate}\nProprietário: ${data.owner_name || 'N/A'}`,
          [{ text: 'OK', onPress: () => { setImage(null); setOwnerName(''); } }]
        );
      } else {
        Alert.alert('Erro', data.error ?? 'Não foi possível registrar a entrada.');
      }
    } catch {
      Alert.alert('Erro de conexão', 'Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Registrar Entrada</Text>

        {/* Owner name */}
        <Text style={styles.label}>Nome do Proprietário</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do proprietário"
          placeholderTextColor={COLORS.textLight}
          value={ownerName}
          onChangeText={setOwnerName}
        />

        {/* Vehicle type */}
        <Text style={styles.label}>Selecione o tipo de veículo</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, vehicleType === 'moto' && styles.toggleActive]}
            onPress={() => setVehicleType('moto')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="bicycle"
              size={20}
              color={vehicleType === 'moto' ? COLORS.white : COLORS.primary}
            />
            <Text style={[styles.toggleText, vehicleType === 'moto' && styles.toggleTextActive]}>
              Moto
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, vehicleType === 'car' && styles.toggleActive]}
            onPress={() => setVehicleType('car')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="car"
              size={20}
              color={vehicleType === 'car' ? COLORS.white : COLORS.primary}
            />
            <Text style={[styles.toggleText, vehicleType === 'car' && styles.toggleTextActive]}>
              Carro
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date / Time (read-only, auto from device) */}
        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.label}>Data de Chegada</Text>
            <View style={styles.readonlyField}>
              <Text style={styles.readonlyText}>{arrivalDate}</Text>
            </View>
          </View>
          <View style={styles.halfField}>
            <Text style={styles.label}>Horário de Chegada</Text>
            <View style={styles.readonlyField}>
              <Text style={styles.readonlyText}>{arrivalTime}</Text>
            </View>
          </View>
        </View>

        {/* Photo area */}
        <Text style={styles.label}>Foto da Placa</Text>
        {image ? (
          <View style={styles.photoPreview}>
            <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
            <Text style={styles.photoText}>Foto capturada com sucesso</Text>
            <TouchableOpacity onPress={() => setImage(null)}>
              <Text style={styles.retakeText}>Tirar nova foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoButtons}>
            <TouchableOpacity style={styles.photoBtn} onPress={pickImage} activeOpacity={0.8}>
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text style={styles.photoBtnText}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={pickFromGallery} activeOpacity={0.8}>
              <Ionicons name="image-outline" size={20} color={COLORS.primary} />
              <Text style={styles.photoBtnText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirm */}
        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.7 }]}
          onPress={handleConfirm}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.confirmBtnText}>Confirmar</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, gap: 12 },
  screenTitle: {
    fontSize: FONTS.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  label: {
    fontSize: FONTS.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONTS.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: { flex: 1 },
  readonlyField: {
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  readonlyText: {
    fontSize: FONTS.base,
    color: COLORS.text,
  },
  photoPreview: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photoText: { fontSize: FONTS.base, color: COLORS.text, fontWeight: '500' },
  retakeText: { fontSize: FONTS.sm, color: COLORS.accent, fontWeight: '600' },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  photoBtnText: { fontSize: FONTS.base, color: COLORS.primary, fontWeight: '600' },
  confirmBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  confirmBtnText: { color: COLORS.white, fontSize: FONTS.md, fontWeight: '700' },
});
