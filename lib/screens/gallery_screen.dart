import 'package:flutter/material.dart';
import '../models/recipe.dart';
import '../services/storage_service.dart';
import '../services/openai_service.dart';
import '../utils/theme.dart';
import 'recipe_detail_screen.dart';
import 'dart:io';

class GalleryScreen extends StatefulWidget {
  const GalleryScreen({super.key});

  @override
  State<GalleryScreen> createState() => _GalleryScreenState();
}

class _GalleryScreenState extends State<GalleryScreen> {
  List<Recipe> _recipes = [];
  bool _loading = true;
  String _filter = 'all'; // 'all' or 'favorites'

  @override
  void initState() {
    super.initState();
    _loadRecipes();
  }

  Future<void> _loadRecipes() async {
    try {
      final recipes = await StorageService.getRecipes();
      setState(() {
        _recipes = recipes;
        _loading = false;
      });
    } catch (error) {
      print('Error loading recipes: $error');
      setState(() {
        _loading = false;
      });
    }
  }

  List<Recipe> get _filteredRecipes {
    final filtered = _recipes.where((recipe) {
      if (_filter == 'favorites') {
        return recipe.favorite;
      }
      return true;
    }).toList();
    
    // Sort by date (newest first)
    filtered.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return filtered;
  }

  void _navigateToRecipe(Recipe recipe) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RecipeDetailScreen(recipeId: recipe.id),
      ),
    ).then((_) => _loadRecipes()); // Refresh when returning
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundMain,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recipe Gallery',
                    style: AppTheme.heading1,
                  ),
                  const SizedBox(height: AppTheme.spacingMd),
                  
                  // Filter buttons
                  Row(
                    children: [
                      _buildFilterButton('All', 'all'),
                      const SizedBox(width: AppTheme.spacingSm),
                      _buildFilterButton('Favorites', 'favorites'),
                    ],
                  ),
                ],
              ),
            ),
            
            // Search bar (placeholder)
            Container(
              margin: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.spacingMd,
                vertical: AppTheme.spacingSm,
              ),
              decoration: AppTheme.cardDecoration,
              child: const Row(
                children: [
                  Icon(Icons.search, color: AppTheme.textSecondary),
                  SizedBox(width: AppTheme.spacingSm),
                  Expanded(
                    child: Text(
                      'Search recipes',
                      style: TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 16,
                      ),
                    ),
                  ),
                  Icon(Icons.filter_list, color: AppTheme.textSecondary),
                ],
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingMd),
            
            // Recipe grid
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryTomato,
                      ),
                    )
                  : _filteredRecipes.isEmpty
                      ? _buildEmptyState()
                      : GridView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            crossAxisSpacing: AppTheme.spacingSm,
                            mainAxisSpacing: AppTheme.spacingSm,
                            childAspectRatio: 0.8,
                          ),
                          itemCount: _filteredRecipes.length,
                          itemBuilder: (context, index) {
                            final recipe = _filteredRecipes[index];
                            return _buildRecipeCard(recipe);
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterButton(String label, String value) {
    final isActive = _filter == value;
    return GestureDetector(
      onTap: () => setState(() => _filter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppTheme.spacingMd,
          vertical: AppTheme.spacingSm,
        ),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.primaryTomato : AppTheme.backgroundCard,
          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isActive ? Colors.white : AppTheme.textPrimary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildRecipeCard(Recipe recipe) {
    return GestureDetector(
      onTap: () => _navigateToRecipe(recipe),
      child: Container(
        decoration: AppTheme.cardDecoration,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recipe image
            Expanded(
              child: ClipRRect(
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppTheme.radiusMd),
                ),
                child: Image.file(
                  File(recipe.image),
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: Colors.grey[300],
                      child: const Icon(
                        Icons.image_not_supported,
                        color: Colors.grey,
                      ),
                    );
                  },
                ),
              ),
            ),
            
            // Recipe info
            Padding(
              padding: const EdgeInsets.all(AppTheme.spacingSm),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppTheme.spacingXs),
                  Row(
                    children: [
                      const Icon(
                        Icons.access_time,
                        size: 12,
                        color: AppTheme.textSecondary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        OpenAIService.formatTime(recipe.prepTime + recipe.cookTime),
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.photo_library_outlined,
              size: 60,
              color: AppTheme.textSecondary,
            ),
            const SizedBox(height: AppTheme.spacingMd),
            const Text(
              'No Recipes Found',
              style: AppTheme.heading2,
            ),
            const SizedBox(height: AppTheme.spacingSm),
            Text(
              _filter == 'favorites'
                  ? 'No favorite recipes yet'
                  : 'Capture food photos or upload from gallery to generate recipes',
              style: AppTheme.bodyText.copyWith(color: AppTheme.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}