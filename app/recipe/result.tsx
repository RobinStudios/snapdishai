import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  Clock,
  Users,
  ChevronLeft,
  Save,
  Trash2,
  Check,
  Star,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import { addRecipe } from '@/utils/storage';
import { GeneratedRecipe, Recipe } from '@/types/recipe';
import { formatTime } from '@/services/openaiService';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function RecipeResultScreen() {
  const { imageUri, recipe: recipeParam } = useLocalSearchParams<{ imageUri: string; recipe: string }>();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Parse the recipe from URL parameters
  const recipe: GeneratedRecipe = recipeParam ? JSON.parse(decodeURIComponent(recipeParam)) : null;
  const decodedImageUri = imageUri ? decodeURIComponent(imageUri) : null;
  
  const handleGoBack = () => {
    router.back();
  };

  const handleSaveRecipe = async () => {
    if (!recipe || !decodedImageUri) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    setIsSaving(true);
    try {
      // Create a new Recipe object
      const newRecipe: Recipe = {
        id: `recipe_${Date.now()}`,
        title: recipe.title,
        image: decodedImageUri,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        createdAt: Date.now(),
        difficulty: recipe.difficulty || 'medium',
        favorite: false,
      };
      
      // Save the recipe to storage
      await addRecipe(newRecipe);
      setSaved(true);
      
      // Navigate to the recipe detail view
      setTimeout(() => {
        router.push({
          pathname: '/recipe/[id]',
          params: { id: newRecipe.id }
        });
      }, 1000);
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardRecipe = () => {
    Alert.alert(
      'Discard Recipe',
      'Are you sure you want to discard this recipe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  };

  if (!recipe || !decodedImageUri) {
    return (
      <View style={[GlobalStyles.container, GlobalStyles.centerContent]}>
        <Text style={GlobalStyles.heading2}>Recipe not found</Text>
        <TouchableOpacity
          style={[GlobalStyles.buttonPrimary, { marginTop: Theme.spacing.lg }]}
          onPress={handleGoBack}
        >
          <Text style={GlobalStyles.buttonPrimaryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: decodedImageUri }} style={styles.recipeImage} />
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.imageFadeTop}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.imageFadeBottom}
        />
        
        {/* Header Actions */}
        <SafeAreaView style={styles.headerActions} edges={['top']}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <ChevronLeft color={Colors.text.light} size={24} />
          </TouchableOpacity>
          
          <View style={styles.headerRightActions}>
            {saved ? (
              <View style={styles.savedBadge}>
                <Check size={16} color={Colors.text.light} style={{ marginRight: 4 }} />
                <Text style={styles.savedText}>Saved</Text>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveRecipe}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={Colors.text.light} />
                ) : (
                  <>
                    <Save size={18} color={Colors.text.light} style={{ marginRight: 4 }} />
                    <Text style={styles.saveButtonText}>Save Recipe</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
        
        {/* Recipe Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          
          {/* Recipe Meta Info */}
          <View style={styles.metaContainer}>
            {recipe.difficulty && (
              <View 
                style={[
                  styles.difficultyBadge,
                  recipe.difficulty === 'easy' && { backgroundColor: Colors.status.easy },
                  recipe.difficulty === 'medium' && { backgroundColor: Colors.status.medium },
                  recipe.difficulty === 'hard' && { backgroundColor: Colors.status.hard },
                ]}
              >
                <Text style={styles.difficultyText}>
                  {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
                </Text>
              </View>
            )}
            
            <View style={styles.metaInfo}>
              <Clock size={14} color={Colors.text.light} style={styles.metaIcon} />
              <Text style={styles.metaText}>
                {formatTime(recipe.prepTime + recipe.cookTime)}
              </Text>
            </View>
            
            <View style={styles.metaInfo}>
              <Users size={14} color={Colors.text.light} style={styles.metaIcon} />
              <Text style={styles.metaText}>
                {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* AI Generated Badge */}
      <Animated.View 
        style={styles.aiBadge}
        entering={FadeIn.duration(500)}
      >
        <Star size={16} color={Colors.primary.mustard} fill={Colors.primary.mustard} style={{ marginRight: 4 }} />
        <Text style={styles.aiBadgeText}>AI Generated Recipe</Text>
      </Animated.View>
      
      {/* Recipe Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Ingredients Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeIn.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={`ingredient-${index}`} style={styles.bulletItem}>
              <View style={styles.bullet} />
              <Text style={styles.bulletText}>{ingredient}</Text>
            </View>
          ))}
        </Animated.View>
        
        {/* Instructions Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeIn.duration(400).delay(300)}
        >
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={`instruction-${index}`} style={styles.numberItem}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <View style={styles.instructionContent}>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
        
        {/* Time Details */}
        <Animated.View 
          style={styles.section}
          entering={FadeIn.duration(400).delay(400)}
        >
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Prep Time</Text>
              <Text style={styles.timeValue}>{formatTime(recipe.prepTime)}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Cook Time</Text>
              <Text style={styles.timeValue}>{formatTime(recipe.cookTime)}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Total Time</Text>
              <Text style={styles.timeValue}>
                {formatTime(recipe.prepTime + recipe.cookTime)}
              </Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!saved && (
            <TouchableOpacity 
              style={styles.discardButton}
              onPress={handleDiscardRecipe}
            >
              <Trash2 size={20} color={Colors.ui.error} style={{ marginRight: Theme.spacing.sm }} />
              <Text style={styles.discardText}>Discard</Text>
            </TouchableOpacity>
          )}
          
          {!saved && (
            <TouchableOpacity 
              style={styles.saveBigButton}
              onPress={handleSaveRecipe}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={Colors.text.light} />
              ) : (
                <>
                  <Save size={20} color={Colors.text.light} style={{ marginRight: Theme.spacing.sm }} />
                  <Text style={styles.saveBigText}>Save Recipe</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
        
        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageFadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageFadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  headerActions: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightActions: {
    flexDirection: 'row',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary.tomato,
  },
  saveButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.light,
  },
  savedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.primary.basil,
  },
  savedText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.light,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Theme.spacing.md,
  },
  recipeTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.xxl,
    color: Colors.text.light,
    marginBottom: Theme.spacing.sm,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  difficultyBadge: {
    backgroundColor: Colors.primary.basil,
    paddingVertical: 2,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
    marginRight: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  difficultyText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.light,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
    marginBottom: Theme.spacing.xs,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.light,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: -15,
    marginLeft: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    backgroundColor: Colors.background.card,
    ...Theme.shadows.sm,
    zIndex: 1,
  },
  aiBadgeText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.primary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.background.main,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: Theme.spacing.md,
  },
  section: {
    padding: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.bold,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.md,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary.tomato,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.md * Theme.typography.lineHeight.normal,
  },
  numberItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
    alignItems: 'flex-start',
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.tomato,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  numberText: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.light,
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.primary,
    lineHeight: Theme.typography.fontSize.md * Theme.typography.lineHeight.normal,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  timeItem: {
    minWidth: '30%',
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  timeLabel: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Theme.spacing.xs,
  },
  timeValue: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.text.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  discardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Colors.background.card,
    borderWidth: 1,
    borderColor: Colors.ui.error,
    borderRadius: Theme.borderRadius.md,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  discardText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.ui.error,
  },
  saveBigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    backgroundColor: Colors.primary.tomato,
    borderRadius: Theme.borderRadius.md,
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  saveBigText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.light,
  },
});