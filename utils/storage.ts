import * as SecureStore from 'expo-secure-store';
import { Recipe } from '@/types/recipe';
import { Platform } from 'react-native';

// For web platform, use localStorage as SecureStore is not available
const webStorage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    localStorage.setItem(key, value);
    return Promise.resolve();
  },
  deleteItem: (key: string): Promise<void> => {
    localStorage.removeItem(key);
    return Promise.resolve();
  },
};

// Use the appropriate storage based on platform
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

// Keys for storage
const RECIPES_KEY = 'snapdish_recipes';

// Save recipes to storage
export const saveRecipes = async (recipes: Recipe[]): Promise<void> => {
  try {
    await storage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
    throw error;
  }
};

// Get recipes from storage
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipesJSON = await storage.getItem(RECIPES_KEY);
    if (!recipesJSON) return [];
    return JSON.parse(recipesJSON);
  } catch (error) {
    console.error('Error getting recipes:', error);
    return [];
  }
};

// Add a recipe to storage
export const addRecipe = async (recipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    recipes.push(recipe);
    await saveRecipes(recipes);
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Update a recipe in storage
export const updateRecipe = async (updatedRecipe: Recipe): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const index = recipes.findIndex((r) => r.id === updatedRecipe.id);
    if (index !== -1) {
      recipes[index] = updatedRecipe;
      await saveRecipes(recipes);
    }
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

// Delete a recipe from storage
export const deleteRecipe = async (recipeId: string): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const updatedRecipes = recipes.filter((r) => r.id !== recipeId);
    await saveRecipes(updatedRecipes);
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

// Toggle favorite status of a recipe
export const toggleFavorite = async (recipeId: string): Promise<void> => {
  try {
    const recipes = await getRecipes();
    const index = recipes.findIndex((r) => r.id === recipeId);
    if (index !== -1) {
      recipes[index].favorite = !recipes[index].favorite;
      await saveRecipes(recipes);
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};