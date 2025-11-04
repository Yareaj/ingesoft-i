// Proyecto/Frontend/ghost-running-app/src/screens/TestScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

// --- AJUSTA ESTA IP SEGÚN TU ENTORNO (10.0.2.2 es para Emulador Android) ---
const API_BASE_URL = 'http://172.20.10.2:3000'; 

interface UserData {
  id: number;
  username: string;
  email: string;
}

const TestScreen = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Llama al endpoint de prueba que creamos en el Backend
      const response = await axios.get(`${API_BASE_URL}/api/hello-user`);
      
      if (response.data && response.data.data) {
        setUserData(response.data.data);
      } else {
         setError('Respuesta inesperada del servidor');
      }

    } catch (err: any) {
      console.error('Error fetching data:', err);
      // Esto ayuda a diagnosticar si el error es de red (no encuentra la IP)
      setError(`Fallo la conexión o el backend: ${err.message}`); 
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Cargando datos del Backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✅ RNF 1: Conexión Frontend/Backend Exitosa</Text>
      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : userData ? (
        <View style={styles.card}>
          <Text style={styles.label}>Usuario de prueba (Obtenido de PostgreSQL):</Text>
          <Text style={styles.value}>ID: {userData.id}</Text>
          <Text style={styles.value}>Username: {userData.username}</Text>
          <Text style={styles.value}>Email: {userData.email}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudo cargar la información del usuario.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#007bff' },
  card: { backgroundColor: '#ffffff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 5, width: '90%' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#333' },
  value: { fontSize: 16, marginBottom: 5, color: '#555' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
});

export default TestScreen;