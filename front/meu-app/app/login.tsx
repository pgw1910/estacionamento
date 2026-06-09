import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';

const BLUE = '#1A3A7A';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Preencha o usuário e a senha.');
      return;
    }

    setLoading(true);
    try {
      await signIn(username.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Erro ao entrar', err.message ?? 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      {/* Área azul do topo (status bar + header) */}
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Image
              source={require('@/assets/images/ugb-logo.png.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.logoTitle}>UGB</Text>
            <Text style={styles.logoSubtitle}>FERP</Text>
          </View>
        </View>
      </View>

      {/* Card branco — ocupa todo o restante incluindo home indicator */}
      <KeyboardAvoidingView
        style={styles.cardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.card, { paddingBottom: insets.bottom + 24 }]}>
          <Text style={styles.cardTitle}>Faça login na sua conta</Text>

          <TextInput
            style={styles.input}
            placeholder="Login"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff', // branco no fundo para cobrir o home indicator
  },

  /* ── Cabeçalho azul ── */
  header: {
    flex: 0.3,
    backgroundColor: BLUE,
    paddingBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 64,
    height: 64,
  },
  logoTitle: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 2,
    lineHeight: 38,
  },
  logoSubtitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: 4,
    lineHeight: 26,
  },

  /* ── Card branco ── */
  cardWrapper: {
    flex: 0.7,
    backgroundColor: '#fff',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -24,
    paddingHorizontal: 28,
    paddingTop: 36,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 28,
    textAlign: 'center',
  },

  /* ── Inputs ── */
  input: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#222',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },

  /* ── Botão ── */
  loginButton: {
    width: '100%',
    height: 52,
    backgroundColor: BLUE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
