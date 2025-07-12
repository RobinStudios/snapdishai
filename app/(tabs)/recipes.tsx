import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Clock, Share2, Search } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import { getRecipes, toggleFavorite } from '@/utils/storage';
import { Recipe } from '@/types/recipe';
import { useRouter } from 'expo-router';
import { formatTime } from '@/services/openaiService';
import * as Sharing from 'expo-sharing';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function RecipesScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  // Load recipes from storage
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await getRecipes();
        setRecipes(storedRecipes);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Filter recipes based on search query and difficulty filter
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = 
      difficultyFilter === 'all' || 
      (recipe.difficulty && recipe.difficulty === difficultyFilter);
    return matchesSearch && matchesDifficulty;
  });

  // Sort recipes by favorites first, then by date
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (a.favorite && !b.favorite) return -1;
    if (!a.favorite && b.favorite) return 1;
    return b.createdAt - a.createdAt;
  });

  // Navigate to recipe detail
  const navigateToRecipe = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id }
    });
  };

  // Toggle favorite status
  const handleToggleFavorite = async (recipeId: string) => {
    try {
      await toggleFavorite(recipeId);
      setRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.id === recipeId 
            ? { ...recipe, favorite: !recipe.favorite } 
            : recipe
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Share recipe
  const handleShareRecipe = async (recipe: Recipe) => {
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

  // Render recipe card
  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    // Animation for heart press
    const heartScale = useSharedValue(1);
    
    const animatedHeartStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: heartScale.value }],
      };
    });
    
    const triggerHeartAnimation = () => {
      heartScale.value = withSpring(1.3, { damping: 2 }, () => {
        heartScale.value = withSpring(1);
      });
      handleToggleFavorite(item.id);
    };
    
    return (
      <Animated.View 
        style={styles.recipeCard}
        entering={FadeIn.duration(500).delay(100)}
      >
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => navigateToRecipe(item)}
        >
          <Image source={{ uri: item.image }} style={styles.recipeImage} />
          
          {/* Difficulty badge */}
          {item.difficulty && (
            <View 
              style={[
                styles.difficultyBadge,
                item.difficulty === 'easy' && { backgroundColor: Colors.status.easy },
                item.difficulty === 'medium' && { backgroundColor: Colors.status.medium },
                item.difficulty === 'hard' && { backgroundColor: Colors.status.hard },
              ]}
            >
              <Text style={styles.difficultyText}>
                {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
              </Text>
            </View>
          )}
          
          <View style={styles.recipeCardContent}>
            <Text style={styles.recipeTitle} numberOfLines={1}>{item.title}</Text>
            
            <View style={styles.recipeMetaRow}>
              <View style={styles.recipeMeta}>
                <Clock size={14} color={Colors.text.secondary} style={styles.metaIcon} />
                <Text style={styles.recipeMetaText}>
                  {formatTime(item.prepTime + item.cookTime)}
                </Text>
              </View>
              
              <View style={styles.recipeActions}>
                <TouchableOpacity 
                  onPress={() => handleShareRecipe(item)}
                  style={styles.actionButton}
                >
                  <Share2 size={18} color={Colors.text.secondary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={triggerHeartAnimation}
                  style={styles.actionButton}
                >
                  <Animated.View style={animatedHeartStyle}>
                    <Heart 
                      size={18} 
                      color={item.favorite ? Colors.primary.tomato : Colors.text.secondary}
                      fill={item.favorite ? Colors.primary.tomato : 'none'}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Empty state when no recipes found
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Recipes Found</Text>
      <Text style={styles.emptyText}>
        Capture food photos to generate and save recipes
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={GlobalStyles.heading1}>My Recipes</Text>
      </View>

      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search recipes</Text>
        </View>
        
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              difficultyFilter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setDifficultyFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              difficultyFilter === 'all' && styles.filterButtonTextActive
            ]}>All</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              difficultyFilter === 'easy' && styles.filterButtonActive,
              styles.easyButton
            ]}
            onPress={() => setDifficultyFilter('easy')}
          >
            <Text style={[
              styles.filterButtonText,
              difficultyFilter === 'easy' && styles.filterButtonTextActive
            ]}>Easy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              difficultyFilter === 'medium' && styles.filterButtonActive,
              styles.mediumButton
            ]}
            onPress={() => setDifficultyFilter('medium')}
          >
            <Text style={[
              styles.filterButtonText,
              difficultyFilter === 'medium' && styles.filterButtonTextActive
            ]}>Medium</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              difficultyFilter === 'hard' && styles.filterButtonActive,
              styles.hardButton
            ]}
            onPress={() => setDifficultyFilter('hard')}
          >
            <Text style={[
              styles.filterButtonText,
              difficultyFilter === 'hard' && styles.filterButtonTextActive
            ]}>Hard</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.tomato} />
        </View>
      ) : (
        <FlatList
          data={sortedRecipes}
          renderItem={renderRecipeCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.recipeList}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  filterSection: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  searchIcon: {
    marginRight: Theme.spacing.sm,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.secondary,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
    backgroundColor: Colors.background.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary.tomato,
  },
  easyButton: {
    borderWidth: 1,
    borderColor: Colors.status.easy,
  },
  mediumButton: {
    borderWidth: 1,
    borderColor: Colors.status.medium,
  },
  hardButton: {
    borderWidth: 1,
    borderColor: Colors.status.hard,
  },
  filterButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.primary,
  },
  filterButtonTextActive: {
    color: Colors.text.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
    padding: Theme.spacing.md,
    paddingTop: 0,
  },
  recipeCard: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.background.card,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  recipeImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  difficultyBadge: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Colors.primary.basil,
    paddingVertical: Theme.spacing.xs / 2,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.full,
  },
  difficultyText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.light,
  },
  recipeCardContent: {
    padding: Theme.spacing.md,
  },
  recipeTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.sm,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: Theme.spacing.xs,
  },
  recipeMetaText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  recipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: Theme.spacing.md,
    padding: Theme.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
    marginTop: 100,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.lg,
    color: Colors.text.primary,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptyText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});