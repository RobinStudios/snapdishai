import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import {
  Clock,
  Users,
  Heart,
  Trash2,
  ChevronLeft,
  Share2,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import { getRecipes, deleteRecipe, toggleFavorite } from '@/utils/storage';
import { Recipe } from '@/types/recipe';
import { formatTime } from '@/services/openaiService';
import * as Sharing from 'expo-sharing';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  // Heart animation
  const heartScale = useSharedValue(1);
  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) return;
      try {
        const recipes = await getRecipes();
        const foundRecipe = recipes.find(r => r.id === id);
        if (foundRecipe) {
          setRecipe(foundRecipe);
        }
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleToggleFavorite = async () => {
    if (!recipe) return;
    
    // Trigger haptic feedback
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animate heart
    heartScale.value = withSpring(1.3, { damping: 2 }, () => {
      heartScale.value = withSpring(1);
    });
    
    try {
      await toggleFavorite(recipe.id);
      setRecipe(prev => prev ? { ...prev, favorite: !prev.favorite } : null);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;
    
    // Confirm deletion
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteRecipe(recipe.id);
              router.back();
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', 'Failed to delete recipe');
            }
          },
        },
      ]
    );
  };

  const handleShareRecipe = async () => {
    if (!recipe) return;
    
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(recipe.image, {
          dialogTitle: `${recipe.title} Recipe`,
          mimeType: 'image/jpeg',
        });
      } else {
        console.log('Sharing is not available on this platform');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  if (!recipe && !loading) {
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
        {recipe && (
          <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
        )}
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
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShareRecipe}
            >
              <Share2 color={Colors.text.light} size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleToggleFavorite}
            >
              <Animated.View style={animatedHeartStyle}>
                <Heart 
                  size={20} 
                  color={Colors.text.light}
                  fill={recipe?.favorite ? Colors.primary.tomato : 'none'}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
        
        {/* Recipe Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.recipeTitle}>{recipe?.title}</Text>
          
          {/* Recipe Meta Info */}
          <View style={styles.metaContainer}>
            {recipe?.difficulty && (
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
                {recipe && formatTime(recipe.prepTime + recipe.cookTime)}
              </Text>
            </View>
            
            <View style={styles.metaInfo}>
              <Users size={14} color={Colors.text.light} style={styles.metaIcon} />
              <Text style={styles.metaText}>
                {recipe?.servings} {recipe?.servings === 1 ? 'serving' : 'servings'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Recipe Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {/* Ingredients Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeIn.duration(400).delay(200)}
        >
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe?.ingredients.map((ingredient, index) => (
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
          {recipe?.instructions.map((instruction, index) => (
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
              <Text style={styles.timeValue}>{formatTime(recipe?.prepTime || 0)}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Cook Time</Text>
              <Text style={styles.timeValue}>{formatTime(recipe?.cookTime || 0)}</Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>Total Time</Text>
              <Text style={styles.timeValue}>
                {recipe && formatTime(recipe.prepTime + recipe.cookTime)}
              </Text>
            </View>
          </View>
        </Animated.View>
        
        {/* Delete Button */}
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteRecipe}
        >
          <Trash2 size={20} color={Colors.ui.error} style={{ marginRight: Theme.spacing.sm }} />
          <Text style={styles.deleteText}>Delete Recipe</Text>
        </TouchableOpacity>
        
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Theme.spacing.sm,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Theme.spacing.lg,
    marginHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Colors.ui.error,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  deleteText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.ui.error,
  },
});