import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const AdminScreen = () => {
  const [comercios, setComercios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cadenaFiltro, setCadenaFiltro] = useState('');

  useEffect(() => {
    cargarComercios();
  }, []);

  const cargarComercios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/comercios`);
      const data = await response.json();
      setComercios(data.comercios);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los comercios');
    }
  };

  const exportarExcel = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/comercios/export?formato=csv`);
      const blob = await response.blob();
      
      // Guardar archivo temporal
      const filePath = FileSystem.documentDirectory + 'comercios.csv';
      const reader = new FileReader();
      reader.onload = async () => {
        await FileSystem.writeAsStringAsync(filePath, reader.result, {
          encoding: FileSystem.EncodingType.UTF8
        });
        
        // Compartir archivo
        await Sharing.shareAsync(filePath);
      };
      reader.readAsText(blob);
      
      Alert.alert('Éxito', 'Archivo exportado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar el archivo');
    }
  };

  const renderComercio = ({ item }) => (
    <View style={styles.comercioCard}>
      <Text style={styles.nombre}>{item.nombre}</Text>
      <Text style={styles.cadena}>{item.cadena}</Text>
      <Text style={styles.direccion}>{item.direccion}</Text>
      <Text style={styles.ubicacion}>{item.localidad}, {item.provincia}</Text>
      <TouchableOpacity 
        style={styles.editButton}
        onPress={() => editarComercio(item)}
      >
        <Text style={styles.editButtonText}>Editar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administración de Comercios</Text>
      
      <View style={styles.filtros}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre..."
          value={filtro}
          onChangeText={setFiltro}
        />
        <TextInput
          style={styles.input}
          placeholder="Filtrar por cadena..."
          value={cadenaFiltro}
          onChangeText={setCadenaFiltro}
        />
      </View>
      
      <TouchableOpacity style={styles.exportButton} onPress={exportarExcel}>
        <Text style={styles.exportButtonText}>📊 Exportar a Excel (CSV)</Text>
      </TouchableOpacity>
      
      <FlatList
        data={comercios}
        renderItem={renderComercio}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filtros: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  exportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  comercioCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cadena: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  direccion: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  ubicacion: {
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminScreen;
