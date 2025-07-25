import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Supabase configuration
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'http://localhost:8000';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

// Initialize Supabase client
const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create Auth Context
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  isAuthenticated: false,
});

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        if (supabase) {
          // Get current session from Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting session:', error);
          } else {
            setSession(session);
            setUser(session?.user || null);
          }
        } else {
          // Fallback: check local storage for token
          const token = await AsyncStorage.getItem('auth_token');
          const userData = await AsyncStorage.getItem('user_data');
          
          if (token && userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes if using Supabase
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session);
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        }
      );

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const signIn = async (email, password) => {
    try {
      if (supabase) {
        // Use Supabase auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      } else {
        // Fallback: Use backend API
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        // Store token and user data
        await AsyncStorage.setItem('auth_token', data.access_token);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        
        return { success: true, data };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      if (supabase) {
        // Use Supabase auth
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          throw error;
        }

        return { success: true, data };
      } else {
        // Fallback: Use backend API
        const response = await fetch('http://localhost:8000/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            password, 
            full_name: fullName 
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Signup failed');
        }

        // Store token and user data
        await AsyncStorage.setItem('auth_token', data.access_token);
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
        
        setUser(data.user);
        
        return { success: true, data };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (supabase) {
        // Use Supabase auth
        const { error } = await supabase.auth.signOut();
        if (error) {
          throw error;
        }
      } else {
        // Fallback: Clear local storage
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_data');
        setUser(null);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export supabase client for direct use
export { supabase }; 