import 'package:flutter/material.dart';
import '../models/recipe.dart';
import '../services/storage_service.dart';
import '../services/openai_service.dart';
import '../utils/theme.dart';
import 'recipe_detail_screen.dart';
import 'dart:io';
import 'package:share_plus/share_plus.dart';

class RecipesScreen extends StatefulWidget {
  const RecipesScreen({super.key});

  @override
  State<RecipesScreen> createState() => _RecipesScreenState();
}

class _RecipesScreenState extends State<RecipesScreen> {
  List<Recipe> _recipes = [];
  bool _loading = true;
  String _difficultyFilter = 'all'; // 'all', 'easy', 'medium', 'hard'

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
      if (_difficultyFilter != 'all') {
        return recipe.difficulty == _difficultyFilter;
      }
      return true;
    }).toList();
    
    // Sort by favorites first, then by date
    filtered.sort((a, b) {
      if (a.favorite && !b.favorite) return -1;
      if (!a.favorite && b.favorite) return 1;
      return b.createdAt.compareTo(a.createdAt);
    });
    
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

  Future<void> _toggleFavorite(String recipeId) async {
    try {
      await StorageService.toggleFavorite(recipeId);
      _loadRecipes(); // Refresh the list
    } catch (error) {
      print('Error toggling favorite: $error');
    }
  }

  Future<void> _shareRecipe(Recipe recipe) async {
    try {
      await Share.shareXFiles([XFile(recipe.image)], text: '${recipe.title} Recipe');
    } catch (error) {
      print('Error sharing recipe: $error');
    }
  }

  Color _getDifficultyColor(String? difficulty) {
    switch (difficulty) {
      case 'easy':
        return AppTheme.statusEasy;
      case 'medium':
        return AppTheme.statusMedium;
      case 'hard':
        return AppTheme.statusHard;
      default:
        return AppTheme.statusMedium;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundMain,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            const Padding(
              padding: EdgeInsets.all(AppTheme.spacingMd),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'My Recipes',
                  style: AppTheme.heading1,
                ),
              ),
            ),
            
            // Filter section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
              child: Column(
                children: [
                  // Search bar (placeholder)
                  Container(
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
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: AppTheme.spacingMd),
                  
                  // Difficulty filter buttons
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterButton('All', 'all'),
                        const SizedBox(width: AppTheme.spacingSm),
                        _buildFilterButton('Easy', 'easy', AppTheme.statusEasy),
                        const SizedBox(width: AppTheme.spacingSm),
                        _buildFilterButton('Medium', 'medium', AppTheme.statusMedium),
                        const SizedBox(width: AppTheme.spacingSm),
                        _buildFilterButton('Hard', 'hard', AppTheme.statusHard),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingMd),
            
            // Recipe list
            Expanded(
              child: _loading
                  ? const Center(
                      child: CircularProgressIndicator(
                        color: AppTheme.primaryTomato,
                      ),
                    )
                  : _filteredRecipes.isEmpty
                      ? _buildEmptyState()
                      : ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
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

  Widget _buildFilterButton(String label, String value, [Color? borderColor]) {
    final isActive = _difficultyFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _difficultyFilter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppTheme.spacingMd,
          vertical: AppTheme.spacingSm,
        ),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.primaryTomato : AppTheme.backgroundCard,
          borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          border: borderColor != null && !isActive
              ? Border.all(color: borderColor)
              : null,
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
    return Container(
      margin: const EdgeInsets.only(bottom: AppTheme.spacingMd),
      decoration: AppTheme.cardDecoration,
      child: InkWell(
        onTap: () => _navigateToRecipe(recipe),
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Recipe image with difficulty badge
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusMd),
                  ),
                  child: Image.file(
                    File(recipe.image),
                    width: double.infinity,
                    height: 180,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        width: double.infinity,
                        height: 180,
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.image_not_supported,
                          color: Colors.grey,
                          size: 40,
                        ),
                      );
                    },
                  ),
                ),
                
                // Difficulty badge
                if (recipe.difficulty != null)
                  Positioned(
                    top: AppTheme.spacingSm,
                    right: AppTheme.spacingSm,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppTheme.spacingSm,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: _getDifficultyColor(recipe.difficulty),
                        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                      ),
                      child: Text(
                        recipe.difficulty!.toUpperCase(),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            
            // Recipe content
            Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    recipe.title,
                    style: AppTheme.heading3,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppTheme.spacingSm),
                  
                  // Meta info and actions
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Time info
                      Row(
                        children: [
                          const Icon(
                            Icons.access_time,
                            size: 14,
                            color: AppTheme.textSecondary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            OpenAIService.formatTime(recipe.prepTime + recipe.cookTime),
                            style: AppTheme.bodyTextSmall,
                          ),
                        ],
                      ),
                      
                      // Action buttons
                      Row(
                        children: [
                          IconButton(
                            onPressed: () => _shareRecipe(recipe),
                            icon: const Icon(
                              Icons.share,
                              size: 18,
                              color: AppTheme.textSecondary,
                            ),
                            padding: const EdgeInsets.all(AppTheme.spacingSm),
                            constraints: const BoxConstraints(),
                          ),
                          IconButton(
                            onPressed: () => _toggleFavorite(recipe.id),
                            icon: Icon(
                              recipe.favorite ? Icons.favorite : Icons.favorite_border,
                              size: 18,
                              color: recipe.favorite ? AppTheme.primaryTomato : AppTheme.textSecondary,
                            ),
                            padding: const EdgeInsets.all(AppTheme.spacingSm),
                            constraints: const BoxConstraints(),
                          ),
                        ],
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
              Icons.book_outlined,
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
              'Capture food photos to generate and save recipes',
              style: AppTheme.bodyText.copyWith(color: AppTheme.textSecondary),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}