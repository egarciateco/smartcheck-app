import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import ComparisonScreen from './src/screens/ComparisonScreen';
import SubscriptionScreen from './src/screens/SubscriptionScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductList" component={ProductListScreen} />
        <Stack.Screen name="Comparison" component={ComparisonScreen} />
        <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
