// Proyecto/Frontend/ghost-running-app/App.tsx

import React from 'react';
// Importa el componente de prueba
import TestScreen from './src/screens/TestScreen'; 

import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';

export default function App() {
  //Entra al navegador de autenticacion
  return (
  <NavigationContainer>
    <AuthNavigator/>
  </NavigationContainer>  
  );
}
