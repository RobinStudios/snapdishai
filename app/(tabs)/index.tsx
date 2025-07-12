import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image, Upload, X, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { pickImageFromLibrary, resizeImage } from '@/utils/imageUtils';
import { analyzeImageWithOpenAI } from '@/services/openaiService';
import { GeneratedRecipe } from '@/types/recipe';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);

  // Handle permission checks
  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={[GlobalStyles.container, GlobalStyles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary.tomato} />
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={[GlobalStyles.container, GlobalStyles.centerContent]}>
        <Text style={GlobalStyles.heading2}>Camera Access Required</Text>
        <Text style={[GlobalStyles.bodyText, styles.permissionText]}>
          SnapDish needs access to your camera to analyze food and generate recipes.
        </Text>
        <TouchableOpacity
          style={[GlobalStyles.buttonPrimary, styles.permissionButton]}
          onPress={requestPermission}
        >
          <Text style={GlobalStyles.buttonPrimaryText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Toggle camera direction
  const toggleCameraFacing = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Capture image from camera
  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        const photo = await cameraRef.current.takePictureAsync();
        const optimizedUri = await resizeImage(photo.uri);
        setCapturedImage(optimizedUri);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      } finally {
        setIsCapturing(false);
      }
    }
  };

  // Pick image from library
  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      const imageUri = await pickImageFromLibrary();
      if (imageUri) {
        const optimizedUri = await resizeImage(imageUri);
        setCapturedImage(optimizedUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Cancel and go back to camera
  const cancelCapture = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCapturedImage(null);
  };

  // Analyze the captured image and navigate to result
  const analyzeImage = async () => {
    if (!capturedImage) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsAnalyzing(true);
    try {
      const recipe = await analyzeImageWithOpenAI(capturedImage);
      navigateToResult(capturedImage, recipe);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Navigate to the recipe result page
  const navigateToResult = (imageUri: string, recipe: GeneratedRecipe) => {
    router.push({
      pathname: '/recipe/result',
      params: {
        imageUri: encodeURIComponent(imageUri),
        recipe: JSON.stringify(recipe)
      }
    });
  };

  return (
    <View style={GlobalStyles.cameraContainer}>
      {capturedImage ? (
        <Animated.View 
          style={styles.previewContainer} 
          entering={FadeIn.duration(300)} 
          exiting={FadeOut.duration(300)}
        >
          <Animated.Image 
            source={{ uri: capturedImage }} 
            style={styles.previewImage} 
            entering={FadeIn.duration(500)}
          />
          
          <View style={styles.previewOverlay}>
            <View style={styles.previewHeader}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={cancelCapture}
                disabled={isAnalyzing}
              >
                <X color={Colors.text.light} size={24} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewFooter}>
              <TouchableOpacity 
                style={[GlobalStyles.buttonPrimary, styles.analyzeButton]}
                onPress={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator color={Colors.text.light} />
                ) : (
                  <>
                    <Zap color={Colors.text.light} size={20} style={styles.analyzeIcon} />
                    <Text style={GlobalStyles.buttonPrimaryText}>Generate Recipe</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onError={(error) => console.error('Camera error:', error)}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.cameraHeader}>
              {/* Top controls */}
            </View>
            
            <View style={styles.cameraFooter}>
              <TouchableOpacity 
                style={styles.galleryButton} 
                onPress={handlePickImage}
              >
                <Image color={Colors.text.light} size={24} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={takePicture}
                disabled={isCapturing}
              >
                <View style={styles.captureButtonInner}>
                  {isCapturing && <ActivityIndicator color={Colors.primary.tomato} />}
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.flipButton} 
                onPress={toggleCameraFacing}
              >
                <Upload color={Colors.text.light} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : Theme.spacing.md,
  },
  cameraFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Theme.spacing.xxl,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.camera.trigger,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.camera.trigger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 50 : Theme.spacing.md,
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFooter: {
    padding: Theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Theme.spacing.lg,
    alignItems: 'center',
  },
  analyzeButton: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical: Theme.spacing.md,
  },
  analyzeIcon: {
    marginRight: Theme.spacing.xs,
  },
  permissionText: {
    textAlign: 'center',
    marginVertical: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  permissionButton: {
    marginTop: Theme.spacing.lg,
  },
});