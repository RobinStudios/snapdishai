import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/recipe.dart';

class StorageService {
  static const String _recipesKey = 'snapdish_recipes';

  // Save recipes to storage
  static Future<void> saveRecipes(List<Recipe> recipes) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final recipesJson = recipes.map((recipe) => recipe.toJson()).toList();
      await prefs.setString(_recipesKey, jsonEncode(recipesJson));
    } catch (error) {
      throw Exception('Error saving recipes: $error');
    }
  }

  // Get recipes from storage
  static Future<List<Recipe>> getRecipes() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final recipesJson = prefs.getString(_recipesKey);
      if (recipesJson == null) return [];
      
      final List<dynamic> recipesList = jsonDecode(recipesJson);
      return recipesList.map((json) => Recipe.fromJson(json)).toList();
    } catch (error) {
      return [];
    }
  }

  // Add a recipe to storage
  static Future<void> addRecipe(Recipe recipe) async {
    try {
      final recipes = await getRecipes();
      recipes.add(recipe);
      await saveRecipes(recipes);
    } catch (error) {
      throw Exception('Error adding recipe: $error');
    }
  }

  // Update a recipe in storage
  static Future<void> updateRecipe(Recipe updatedRecipe) async {
    try {
      final recipes = await getRecipes();
      final index = recipes.indexWhere((r) => r.id == updatedRecipe.id);
      if (index != -1) {
        recipes[index] = updatedRecipe;
        await saveRecipes(recipes);
      }
    } catch (error) {
      throw Exception('Error updating recipe: $error');
    }
  }

  // Delete a recipe from storage
  static Future<void> deleteRecipe(String recipeId) async {
    try {
      final recipes = await getRecipes();
      recipes.removeWhere((r) => r.id == recipeId);
      await saveRecipes(recipes);
    } catch (error) {
      throw Exception('Error deleting recipe: $error');
    }
  }

  // Toggle favorite status of a recipe
  static Future<void> toggleFavorite(String recipeId) async {
    try {
      final recipes = await getRecipes();
      final index = recipes.indexWhere((r) => r.id == recipeId);
      if (index != -1) {
        recipes[index] = recipes[index].copyWith(favorite: !recipes[index].favorite);
        await saveRecipes(recipes);
      }
    } catch (error) {
      throw Exception('Error toggling favorite: $error');
    }
  }
}