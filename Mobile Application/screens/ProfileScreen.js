import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  List,
  Divider,
  Avatar,
  Text,
  Switch,
  Surface,
  IconButton,
  Badge,
  Chip,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../services/AuthContext';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { user, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalAnalyses: 0,
    recentAnalyses: 0,
    avgConfidence: 0,
    memberSince: null,
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // In a real app, this would fetch from API
      setUserStats({
        totalAnalyses: 47,
        recentAnalyses: 12,
        avgConfidence: 87,
        memberSince: user?.created_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
              Toast.show({
                type: 'success',
                text1: 'Logged Out',
                text2: 'You have been successfully logged out',
              });
              navigation.replace('Login');
            } catch (error) {
              console.error('Logout error:', error);
              Toast.show({
                type: 'error',
                text1: 'Logout Failed',
                text2: error.message || 'Could not logout',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'Profile editing will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleViewAnalysisHistory = () => {
    Alert.alert(
      'Analysis History',
      'Analysis history will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. We collect and use your data responsibly to provide better meat quality analysis services.',
      [{ text: 'OK' }]
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      'Terms of Service',
      'By using this app, you agree to our terms of service. Please use the meat quality analysis results as guidance only.',
      [{ text: 'OK' }]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Support',
      'For support, please email: support@meatqualityapp.com\n\nWe typically respond within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'We value your feedback! Please share your thoughts about the app.',
      [{ text: 'OK' }]
    );
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMembershipDuration = () => {
    if (!userStats.memberSince) return 'New member';
    const now = new Date();
    const memberSince = new Date(userStats.memberSince);
    const diffTime = Math.abs(now - memberSince);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryLight + '10']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            iconColor={colors.primary}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <View style={styles.headerContent}>
            <Title style={styles.headerTitle}>Profile</Title>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
        </View>

        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <View style={styles.profileHeader}>
              <Avatar.Text
                size={80}
                label={getInitials(user?.full_name || user?.email)}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.profileInfo}>
                <Title style={styles.profileName}>
                  {user?.full_name || 'User'}
                </Title>
                <Paragraph style={styles.profileEmail}>
                  {user?.email || 'No email'}
                </Paragraph>
                <View style={styles.membershipBadge}>
                  <Chip
                    mode="flat"
                    style={styles.membershipChip}
                    textStyle={styles.membershipText}
                    icon="account-star"
                  >
                    Member for {getMembershipDuration()}
                  </Chip>
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.statsTitle}>Your Statistics</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.totalAnalyses}</Text>
                <Text style={styles.statLabel}>Total Analyses</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.recentAnalyses}</Text>
                <Text style={styles.statLabel}>This Month</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.avgConfidence}%</Text>
                <Text style={styles.statLabel}>Avg Confidence</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.quickActionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.quickActionsContainer}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Upload')}
                style={styles.quickActionButton}
                contentStyle={styles.quickActionContent}
                icon="camera"
              >
                New Analysis
              </Button>
              <Button
                mode="outlined"
                onPress={handleViewAnalysisHistory}
                style={styles.quickActionButton}
                contentStyle={styles.quickActionContent}
                icon="history"
              >
                History
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Account Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Account</Title>
            <List.Item
              title="Edit Profile"
              description="Update your personal information"
              left={props => <List.Icon {...props} icon="account-edit" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleEditProfile}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Change Password"
              description="Update your account password"
              left={props => <List.Icon {...props} icon="lock" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleChangePassword}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Analysis History"
              description="View past analysis results"
              left={props => <List.Icon {...props} icon="history" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleViewAnalysisHistory}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Preferences</Title>
            <List.Item
              title="Push Notifications"
              description="Receive analysis updates"
              left={props => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Dark Mode"
              description="Enable dark theme"
              left={props => <List.Icon {...props} icon="theme-light-dark" />}
              right={() => (
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Auto Analysis"
              description="Automatically analyze when image is selected"
              left={props => <List.Icon {...props} icon="auto-fix" />}
              right={() => (
                <Switch
                  value={autoAnalysis}
                  onValueChange={setAutoAnalysis}
                  color={colors.primary}
                />
              )}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* Support & Legal */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Support & Legal</Title>
            <List.Item
              title="Help & Support"
              description="Get help with using the app"
              left={props => <List.Icon {...props} icon="help-circle" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleSupport}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Send Feedback"
              description="Share your thoughts about the app"
              left={props => <List.Icon {...props} icon="message-text" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleFeedback}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Privacy Policy"
              description="How we protect your data"
              left={props => <List.Icon {...props} icon="shield-account" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handlePrivacyPolicy}
              style={styles.listItem}
            />
            <Divider />
            <List.Item
              title="Terms of Service"
              description="App usage terms and conditions"
              left={props => <List.Icon {...props} icon="file-document" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={handleTermsOfService}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Title style={styles.infoTitle}>App Information</Title>
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>Version 1.0.0</Text>
              <Text style={styles.infoText}>Built with ❤️ using React Native</Text>
              <Text style={styles.infoText}>Powered by OpenAI GPT-4 Vision</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
          style={styles.logoutButton}
          contentStyle={styles.logoutContent}
          labelStyle={styles.logoutLabel}
          icon="logout"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </Button>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primaryLight + '20',
  },
  headerContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  profileContent: {
    padding: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: colors.primary,
    marginRight: theme.spacing.md,
  },
  avatarLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.xs,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  membershipBadge: {
    alignSelf: 'flex-start',
  },
  membershipChip: {
    backgroundColor: colors.primaryLight + '20',
  },
  membershipText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statsCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  quickActionsCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  quickActionContent: {
    paddingVertical: theme.spacing.sm,
  },
  sectionCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.sm,
  },
  listItem: {
    paddingVertical: theme.spacing.sm,
  },
  infoCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.sm,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  logoutButton: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.error,
  },
  logoutContent: {
    paddingVertical: theme.spacing.sm,
  },
  logoutLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 