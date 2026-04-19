// src/screens/ProductListScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import Share from 'react-native-share';

const ProductListScreen = ({ route, navigation }) => {
  const { supermercado } = route.params;
  const [selectedProducts, setSelectedProducts] = useState([]);

  const productos = [
    { id: '1', nombre: 'Leche', precio: 1200, categoria: 'Lácteos' },
    { id: '2', nombre: 'Pan', precio: 800, categoria: 'Panadería' },
    { id: '3', nombre: 'Huevos', precio: 1500, categoria: 'Lácteos' },
    { id: '4', nombre: 'Arroz', precio: 1100, categoria: 'Almacén' },
    { id: '5', nombre: 'Fideos', precio: 900, categoria: 'Almacén' },
    { id: '6', nombre: 'Aceite', precio: 2200, categoria: 'Almacén' },
    { id: '7', nombre: 'Azúcar', precio: 950, categoria: 'Almacén' },
    { id: '8', nombre: 'Yerba', precio: 1900, categoria: 'Almacén' },
  ];

  const handleShare = async () => {
    const productList = selectedProducts.map(p => 
      `${p.nombre}: $${p.precio}`
    ).join('\n');

    const shareOptions = {
      title: `Precios en ${supermercado.nombre}`,
      message: `🛒 *${supermercado.nombre}*\n📍 ${supermercado.direccion}\n\n${productList}\n\nCompará con SmartCheck!`,
      url: 'https://smartcheck.com.ar',
      social: Share.Social.WHATSAPP,
    };

    try {
      await Share.open(shareOptions);
    } catch (error) {
      console.log('Error compartiendo:', error);
    }
  };

  const toggleProduct = (product) => {
    if (selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const renderProduct = ({ item }) => {
    const isSelected = selectedProducts.find(p => p.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.productCard, isSelected && styles.selected]}
        onPress={() => toggleProduct(item)}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.nombre}</Text>
          <Text style={styles.productCategory}>{item.categoria}</Text>
        </View>
        <Text style={styles.productPrice}>${item.precio}</Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header onShare={handleShare} />
      
      <View style={styles.supermercadoHeader}>
        <Text style={styles.supermercadoTitle}>{supermercado.nombre}</Text>
        <Text style={styles.supermercadoAddress}>{supermercado.direccion}</Text>
      </View>

      {selectedProducts.length > 0 && (
        <View style={styles.selectedCount}>
          <Text style={styles.selectedText}>
            {selectedProducts.length} productos seleccionados
          </Text>
        </View>
      )}

      <FlatList
        data={productos}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {selectedProducts.length > 0 && (
        <TouchableOpacity style={styles.compareButton} onPress={handleShare}>
          <Text style={styles.compareButtonText}>
            Compartir {selectedProducts.length} productos por WhatsApp
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  supermercadoHeader: {
    backgroundColor: '#001f3f',
    padding: 20,
  },
  supermercadoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  supermercadoAddress: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  selectedCount: {
    backgroundColor: '#25D366',
    padding: 10,
    alignItems: 'center',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    padding: 15,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  selected: {
    backgroundColor: '#e8f5e9',
    borderLeftWidth: 4,
    borderLeftColor: '#25D366',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001f3f',
  },
  checkmark: {
    fontSize: 20,
    color: '#25D366',
    marginLeft: 10,
  },
  compareButton: {
    backgroundColor: '#25D366',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  compareButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductListScreen;
