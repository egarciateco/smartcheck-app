import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { login, register } from '../services/api';
import { saveUser } from '../utils/storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [nombre, setNombre] = useState('');

  const handleAuth = async () => {
    try {
      if (isRegister) {
        const response = await register(email, password, nombre);
        if (response.success) {
          await saveUser({ id: response.usuario_id, email, nombre });
          navigation.replace('Home');
        }
      } else {
        const response = await login(email, password);
        if (response.success) {
          await saveUser(response.usuario);
          navigation.replace('Home');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const continuarComoAnonimo = async () => {
    try {
      const response = await register(
        `anonimo_${Date.now()}@smartcheck.com`,
        'anonimo123',
        'Usuario Anónimo',
        null,
        true
      );
      
      if (response.success) {
        await saveUser({ id: response.usuario_id, email: email, nombre: 'Usuario Anónimo', es_anonimo: true });
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>SmartCheck</Text>
      <Text style={styles.subtitle}>Comparador de Precios</Text>

      {isRegister && (
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isRegister ? 'Registrarse' : 'Iniciar Sesión'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.link}>
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.anonButton} onPress={continuarComoAnonimo}>
        <Text style={styles.anonButtonText}>Continuar como Anónimo (5 consultas gratis)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#001f3f',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#001f3f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  anonButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  anonButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LoginScreen;
