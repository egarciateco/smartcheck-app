import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('@SmartCheck:user', JSON.stringify(user));
  } catch (error) {
    console.error('Error guardando usuario:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem('@SmartCheck:user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('@SmartCheck:user');
  } catch (error) {
    console.error('Error eliminando usuario:', error);
  }
};
