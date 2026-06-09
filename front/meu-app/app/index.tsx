import { Redirect } from 'expo-router';

// Rota raiz — redireciona sempre para o login
// O AuthGate no _layout.tsx cuida do redirecionamento após autenticação
export default function Index() {
  return <Redirect href="/login" />;
}
