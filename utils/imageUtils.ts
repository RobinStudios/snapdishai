import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

// Request camera permissions
export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

// Request media library permissions
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

// Resize image to optimize for API usage
export const resizeImage = async (
  uri: string,
  width: number = 800,
  quality: number = 0.7
): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width } }],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    return uri; // Return original if there's an error
  }
};

// Convert image URI to base64 for API use
export const imageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (Platform.OS === 'web') {
      // For web
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Remove data URL prefix (e.g., data:image/jpeg;base64,)
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('FileReader result is not a string'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // For native platforms
      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            // Remove data URL prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error('FileReader result is not a string'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Pick image from library
export const pickImageFromLibrary = async (): Promise<string | null> => {
  try {
    const permission = await requestMediaLibraryPermission();
    if (!permission) {
      console.log('Permission to access media library was denied');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.error('Error picking image from library:', error);
    return null;
  }
};

// Generate a unique ID for image names
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};