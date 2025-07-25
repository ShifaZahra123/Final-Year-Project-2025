import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  Paragraph,
  IconButton,
  Checkbox,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../services/AuthContext';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import Toast from 'react-native-toast-message';

const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async () => {
    // Basic validation
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    // Name validation
    if (fullName.length < 2) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid full name',
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

    // Password validation
    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 8 characters long',
      });
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must contain uppercase, lowercase, and number',
      });
      return;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      });
      return;
    }

    // Terms acceptance validation
    if (!acceptedTerms) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please accept the terms and conditions',
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await signUp(email, password, fullName);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Account created successfully!',
        });
        
        // Navigate to main app
        navigation.replace('Upload');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.message || 'An error occurred during signup',
      });
    } finally {
      setLoading(false);
    }
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
            <Title style={styles.title}>Create Account</Title>
            <Paragraph style={styles.subtitle}>
              Join us to start analyzing meat quality
            </Paragraph>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.cardTitle}>Get Started</Title>
              <Paragraph style={styles.cardSubtitle}>
                Create your account to continue
              </Paragraph>

              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                mode="outlined"
                style={styles.input}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                left={<TextInput.Icon icon="account" />}
                theme={theme}
              />

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
                autoComplete="password-new"
                textContentType="newPassword"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                theme={theme}
              />

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                textContentType="newPassword"
                left={<TextInput.Icon icon="lock-check" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                theme={theme}
              />

              <View style={styles.checkboxContainer}>
                <Checkbox
                  status={acceptedTerms ? 'checked' : 'unchecked'}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                  color={colors.primary}
                />
                <Text style={styles.checkboxText}>
                  I accept the{' '}
                  <Text style={styles.linkText}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>

              <Button
                mode="contained"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
                style={styles.signupButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkboxText: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 14,
    color: colors.textLight,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  signupButton: {
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  footerText: {
    fontSize: 14,
    color: colors.white,
  },
  loginLink: {
    color: colors.white,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default SignupScreen; 