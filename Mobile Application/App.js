import React from 'react';
import { StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-url-polyfill/auto';
import 'react-native-gesture-handler';

// Import screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import UploadScreen from './screens/UploadScreen';
import ResultsScreen from './screens/ResultsScreen';
import ProfileScreen from './screens/ProfileScreen';

// Import services
import { AuthProvider, useAuth } from './services/AuthContext';

// Import constants
import { colors } from './constants/colors';
import { theme } from './constants/theme';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ 
          title: 'Welcome to Meat Quality App',
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ 
          title: 'Create Account',
          headerShown: false 
        }} 
      />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Upload" 
        component={UploadScreen} 
        options={({ navigation }) => ({ 
          title: 'Meat Quality Analysis',
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle" size={24} color={colors.white} />
            </TouchableOpacity>
          ),
        })} 
      />
      <Stack.Screen 
        name="Results" 
        component={ResultsScreen} 
        options={{ 
          title: 'Analysis Results' 
        }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile' 
        }} 
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    // You can show a loading screen here
    return null;
  }
  
  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppNavigator />
      <Toast />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
