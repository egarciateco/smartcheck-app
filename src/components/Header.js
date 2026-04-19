// src/components/Header.js
import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Header = ({ navigation, onShare }) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Image 
          source={require('../../assets/smartcheck-text.png')} 
          style={styles.logoText}
          resizeMode="contain"
        />
      </View>
      
      <TouchableOpacity onPress={onShare} style={styles.shareButton}>
        <Icon name="whatsapp" size={28} color="#25D366" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#001f3f',
    padding: 15,
    paddingTop: 50,
    elevation: 5,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoText: {
    width: 120,
    height: 30,
    marginLeft: 10,
  },
  shareButton: {
    padding: 5,
  },
});

export default Header;
