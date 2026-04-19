// src/screens/HomeScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import Header from '../components/Header';
import Share from 'react-native-share';

const HomeScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const supermercados = [
    { id: '1', nombre: 'Carrefour', direccion: 'Av. Corrientes 1234', logo: 'carrefour' },
    { id: '2', nombre: 'Coto', direccion: 'Av. Rivadavia 5678', logo: 'coto' },
    { id: '3', nombre: 'Jumbo', direccion: 'Av. Santa Fe 9012', logo: 'jumbo' },
    { id: '4', nombre: 'Vea', direccion: 'Av. Cabildo 3456', logo: 'vea' },
    { id: '5', nombre: 'Disco', direccion: 'Av. Libertador 7890', logo: 'disco' },
    { id: '6', nombre: 'Día', direccion: 'Av. San Martín 2345', logo: 'dia' },
  ];

  const handleShare = async () => {
    const shareOptions = {
      title: 'SmartCheck Supermercados',
      message: '¡Compará precios de supermercados con SmartCheck! Descargá la app: https://smartcheck.com.ar',
      url: 'https://smartcheck.com.ar',
      social: Share.Social.WHATSAPP,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error compartiendo:', error);
    }
  };

  const renderSupermercado = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation.navigate('Productos', { supermercado: item })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.supermercadoNombre}>{item.nombre}</Text>
        <Text style={styles.supermercadoDireccion}>{item.direccion}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header onShare={handleShare} />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar supermercado..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      <FlatList
        data={supermercados.filter(s => 
          s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        renderItem={renderSupermercado}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    elevation: 2,
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  supermercadoNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001f3f',
  },
  supermercadoDireccion: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  arrow: {
    fontSize: 24,
    color: '#001f3f',
  },
});

export default HomeScreen;
