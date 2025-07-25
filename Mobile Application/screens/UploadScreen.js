import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Text,
  FAB,
  Portal,
  Modal,
  List,
  IconButton,
  ProgressBar,
  Surface,
  Chip,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../services/AuthContext';
import { colors } from '../constants/colors';
import { theme } from '../constants/theme';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const UploadScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [imageMetadata, setImageMetadata] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request camera permissions
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraPermission.status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permissions to take photos of meat for analysis.',
          [{ text: 'OK' }]
        );
      }

      // Request media library permissions
      const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (mediaPermission.status !== 'granted') {
        Alert.alert(
          'Media Library Permission Required',
          'Please enable media library permissions to select photos for analysis.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const handleImagePicker = async (useCamera = false) => {
    try {
      setModalVisible(false);
      setLoading(true);

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false,
        exif: true,
      };

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const imageInfo = await FileSystem.getInfoAsync(imageUri);
        
        // Store image metadata
        setImageMetadata({
          uri: imageUri,
          size: imageInfo.size,
          width: result.assets[0].width,
          height: result.assets[0].height,
          type: result.assets[0].type,
        });
        
        setSelectedImage(imageUri);
        
        Toast.show({
          type: 'success',
          text1: 'Image Selected',
          text2: 'Ready for analysis',
        });
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select image',
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select an image first',
      });
      return;
    }

    setAnalyzing(true);
    setUploadProgress(0);
    setAnalysisStep('Preparing image...');

    try {
      // Validate image size
      if (imageMetadata && imageMetadata.size > 10 * 1024 * 1024) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Image too large. Please select a smaller image.',
        });
        return;
      }

      // Convert image to blob for upload
      setAnalysisStep('Uploading image...');
      const imageBlob = await fetch(selectedImage).then(r => r.blob());
      
      // Create form data
      const formData = new FormData();
      formData.append('file', imageBlob, 'meat-image.jpg');
      formData.append('user_id', user?.id || 'anonymous');

      // Start progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 200);

      setAnalysisStep('Analyzing meat quality...');

      // Upload and analyze
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisStep('Analysis complete!');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Analysis failed');
      }

      // Success - navigate to results
      Toast.show({
        type: 'success',
        text1: 'Analysis Complete!',
        text2: 'Redirecting to results...',
      });

      setTimeout(() => {
        navigation.navigate('Results', { 
          analysisData: data.analysis,
          resultId: data.result_id,
          imageUri: selectedImage,
          imageMetadata: imageMetadata
        });
      }, 1000);

    } catch (error) {
      console.error('Analysis error:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Analysis Failed',
        text2: error.message || 'Please try again',
      });
    } finally {
      setAnalyzing(false);
      setUploadProgress(0);
      setAnalysisStep('');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImageMetadata(null);
    Toast.show({
      type: 'info',
      text1: 'Image Cleared',
      text2: 'Ready for new analysis',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primaryLight + '20']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="account-circle"
            size={50}
            iconColor={colors.primary}
            style={styles.profileIcon}
            onPress={() => navigation.navigate('Profile')}
          />
          <View style={styles.headerContent}>
            <Title style={styles.title}>
              Welcome, {user?.full_name || user?.email?.split('@')[0] || 'User'}!
            </Title>
            <Paragraph style={styles.subtitle}>
              Upload an image to analyze meat quality
            </Paragraph>
          </View>
        </View>

        {/* Image Display */}
        {selectedImage ? (
          <Card style={styles.imageCard}>
            <Card.Content>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              {imageMetadata && (
                <View style={styles.imageMetadataContainer}>
                  <Surface style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Size:</Text>
                    <Text style={styles.metadataValue}>{formatFileSize(imageMetadata.size)}</Text>
                  </Surface>
                  <Surface style={styles.metadataItem}>
                    <Text style={styles.metadataLabel}>Dimensions:</Text>
                    <Text style={styles.metadataValue}>{imageMetadata.width}x{imageMetadata.height}</Text>
                  </Surface>
                </View>
              )}
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.uploadCard}>
            <Card.Content style={styles.uploadContent}>
              <IconButton
                icon="cloud-upload"
                size={80}
                iconColor={colors.primary}
                style={styles.uploadIcon}
              />
              <Title style={styles.uploadTitle}>Upload Meat Image</Title>
              <Paragraph style={styles.uploadSubtitle}>
                Take a photo or select from gallery to analyze meat quality
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Analysis Progress */}
        {analyzing && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Title style={styles.progressTitle}>Analyzing...</Title>
              <Paragraph style={styles.progressText}>{analysisStep}</Paragraph>
              <ProgressBar 
                progress={uploadProgress / 100} 
                color={colors.primary}
                style={styles.progressBar}
              />
              <Text style={styles.progressPercentage}>{uploadProgress}%</Text>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {selectedImage ? (
            <>
              <Button
                mode="contained"
                onPress={analyzeImage}
                loading={analyzing}
                disabled={analyzing}
                style={styles.analyzeButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="microscope"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Quality'}
              </Button>
              <Button
                mode="outlined"
                onPress={clearImage}
                disabled={analyzing}
                style={styles.clearButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.outlineButtonLabel}
                icon="refresh"
              >
                Clear Image
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={() => setModalVisible(true)}
              loading={loading}
              disabled={loading}
              style={styles.selectButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="camera"
            >
              {loading ? 'Loading...' : 'Select Image'}
            </Button>
          )}
        </View>

        {/* Usage Tips */}
        <Card style={styles.tipsCard}>
          <Card.Content>
            <Title style={styles.tipsTitle}>📋 Tips for Better Results</Title>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>Ensure good lighting when taking photos</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>📷</Text>
                <Text style={styles.tipText}>Keep the camera stable and focused</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🎯</Text>
                <Text style={styles.tipText}>Fill the frame with the meat sample</Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>🚫</Text>
                <Text style={styles.tipText}>Avoid shadows and reflections</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Image Picker Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Title style={styles.modalTitle}>Select Image Source</Title>
          <List.Item
            title="Camera"
            description="Take a new photo"
            left={props => <List.Icon {...props} icon="camera" />}
            onPress={() => handleImagePicker(true)}
            style={styles.modalItem}
          />
          <List.Item
            title="Gallery"
            description="Choose from gallery"
            left={props => <List.Icon {...props} icon="image" />}
            onPress={() => handleImagePicker(false)}
            style={styles.modalItem}
          />
          <Button
            mode="outlined"
            onPress={() => setModalVisible(false)}
            style={styles.modalCancelButton}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
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
    marginBottom: theme.spacing.xl,
  },
  profileIcon: {
    backgroundColor: colors.primaryLight + '20',
  },
  headerContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  imageCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  selectedImage: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  imageMetadataContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metadataItem: {
    flex: 1,
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: colors.primaryLight + '10',
  },
  metadataLabel: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  metadataValue: {
    fontSize: 14,
    color: colors.text,
  },
  uploadCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  uploadIcon: {
    backgroundColor: colors.primaryLight + '20',
    marginBottom: theme.spacing.md,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.sm,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  progressCard: {
    marginBottom: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.xs,
  },
  progressText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.sm,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: theme.spacing.lg,
  },
  analyzeButton: {
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  clearButton: {
    borderRadius: theme.borderRadius.md,
    borderColor: colors.primary,
  },
  selectButton: {
    borderRadius: theme.borderRadius.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlineButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  tipsCard: {
    borderRadius: theme.borderRadius.lg,
    elevation: theme.elevations.level2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.md,
  },
  tipsList: {
    marginTop: theme.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  modalItem: {
    marginBottom: theme.spacing.sm,
  },
  modalCancelButton: {
    marginTop: theme.spacing.md,
    borderColor: colors.primary,
  },
});

export default UploadScreen; 