import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  IconButton,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../services/AuthContext';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid email address',
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful!',
        });
        
        // Navigate to main app
        navigation.replace('Upload');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'An error occurred during login',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact support to reset your password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={colors.primaryGradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <IconButton
              icon="food-steak"
              size={80}
              iconColor={colors.white}
              style={styles.logo}
            />
            <Title style={styles.title}>Meat Quality App</Title>
            <Paragraph style={styles.subtitle}>
              AI-powered meat quality analysis
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Welcome Back</Title>
              <Paragraph style={styles.cardSubtitle}>
                Sign in to continue
              </Paragraph>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                left={<TextInput.Icon icon="email" />}
                theme={theme}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password"
                textContentType="password"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={theme}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Button
                mode="text"
                onPress={handleForgotPassword}
                style={styles.forgotButton}
                labelStyle={styles.forgotButtonLabel}
              >
                Forgot Password?
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('Signup')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    backgroundColor: colors.primaryDark,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level3,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  loginButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotButton: {
    marginTop: theme.spacing.xs,
  },
  forgotButtonLabel: {
    fontSize: 14,
    color: colors.primary,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  footerText: {
    fontSize: 14,
    color: colors.white,
  },
  signupLink: {
    color: colors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen; 