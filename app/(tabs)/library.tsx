import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image as ImageIcon, Search, Filter, Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Theme, GlobalStyles } from '@/constants/Theme';
import { getRecipes } from '@/utils/storage';
import { Recipe } from '@/types/recipe';
import { useRouter } from 'expo-router';
import { formatTime } from '@/services/openaiService';
import Animated, { FadeIn } from 'react-native-reanimated';

// Calculate item width for grid based on screen width
const { width } = Dimensions.get('window');
const numColumns = 2;
const itemPadding = Theme.spacing.xs;
const itemWidth = (width - (Theme.spacing.md * 2) - (itemPadding * 2 * numColumns)) / numColumns;

export default function GalleryScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

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

  // Filter recipes based on search query and filter
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorite = filter === 'all' || (filter === 'favorites' && recipe.favorite);
    return matchesSearch && matchesFavorite;
  });

  // Sort recipes by date (newest first)
  const sortedRecipes = [...filteredRecipes].sort((a, b) => b.createdAt - a.createdAt);

  // Navigate to recipe detail
  const navigateToRecipe = (recipe: Recipe) => {
    router.push({
      pathname: '/recipe/[id]',
      params: { id: recipe.id }
    });
  };

  // Render recipe item
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity 
      style={styles.recipeItem}
      onPress={() => navigateToRecipe(item)}
      activeOpacity={0.8}
    >
      <Animated.View entering={FadeIn.duration(500).delay(100)}>
        <Image 
          source={{ uri: item.image }}
          style={styles.recipeImage}
        />
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.recipeMetaRow}>
            <Clock size={12} color={Colors.text.secondary} style={styles.metaIcon} />
            <Text style={styles.recipeMetaText}>
              {formatTime(item.prepTime + item.cookTime)}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );

  // Empty state when no recipes found
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <ImageIcon size={60} color={Colors.text.secondary} />
      <Text style={styles.emptyTitle}>No Recipes Found</Text>
      <Text style={styles.emptyText}>
        Capture food photos or upload from gallery to generate recipes
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={GlobalStyles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={GlobalStyles.heading1}>Recipe Gallery</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'favorites' && styles.filterButtonActive
            ]}
            onPress={() => setFilter('favorites')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'favorites' && styles.filterButtonTextActive
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.text.secondary} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>Search recipes</Text>
        <Filter size={20} color={Colors.text.secondary} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.tomato} />
        </View>
      ) : (
        <FlatList
          data={sortedRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.recipeList}
          columnWrapperStyle={styles.row}
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
    paddingVertical: Theme.spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    marginTop: Theme.spacing.sm,
  },
  filterButton: {
    paddingVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.full,
    marginRight: Theme.spacing.sm,
    backgroundColor: Colors.background.card,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary.tomato,
  },
  filterButtonText: {
    fontFamily: Theme.typography.fontFamily.medium,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.primary,
  },
  filterButtonTextActive: {
    color: Colors.text.light,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.card,
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeList: {
    padding: Theme.spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  recipeItem: {
    width: itemWidth,
    marginBottom: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Colors.background.card,
    overflow: 'hidden',
    ...Theme.shadows.sm,
  },
  recipeImage: {
    width: '100%',
    height: itemWidth,
    resizeMode: 'cover',
  },
  recipeInfo: {
    padding: Theme.spacing.sm,
  },
  recipeTitle: {
    fontFamily: Theme.typography.fontFamily.semiBold,
    fontSize: Theme.typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Theme.spacing.xs,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    marginRight: 4,
  },
  recipeMetaText: {
    fontFamily: Theme.typography.fontFamily.regular,
    fontSize: Theme.typography.fontSize.xs,
    color: Colors.text.secondary,
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