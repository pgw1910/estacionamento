import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen           from './screens/HomeScreen';
import RegistrarEntradaScreen from './screens/RegistrarEntradaScreen';
import RegistrarSaidaScreen from './screens/RegistrarSaidaScreen';
import HistoricoScreen      from './screens/HistoricoScreen';
import HistoricoGeralScreen from './screens/HistoricoGeralScreen';
import PerfilScreen         from './screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home"             component={HomeScreen} />
        <Stack.Screen name="RegistrarEntrada" component={RegistrarEntradaScreen} />
        <Stack.Screen name="RegistrarSaida"   component={RegistrarSaidaScreen} />
        <Stack.Screen name="Historico"        component={HistoricoScreen} />
        <Stack.Screen name="HistoricoGeral"   component={HistoricoGeralScreen} />
        <Stack.Screen name="Perfil"           component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
