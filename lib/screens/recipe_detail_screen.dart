import 'package:flutter/material.dart';
import 'dart:io';
import '../models/recipe.dart';
import '../services/storage_service.dart';
import '../services/openai_service.dart';
import '../utils/theme.dart';
import 'package:share_plus/share_plus.dart';

class RecipeDetailScreen extends StatefulWidget {
  final String recipeId;

  const RecipeDetailScreen({
    super.key,
    required this.recipeId,
  });

  @override
  State<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends State<RecipeDetailScreen> {
  Recipe? _recipe;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadRecipe();
  }

  Future<void> _loadRecipe() async {
    try {
      final recipes = await StorageService.getRecipes();
      final recipe = recipes.where((r) => r.id == widget.recipeId).firstOrNull;
      setState(() {
        _recipe = recipe;
        _loading = false;
      });
    } catch (error) {
      print('Error loading recipe: $error');
      setState(() {
        _loading = false;
      });
    }
  }

  Future<void> _toggleFavorite() async {
    if (_recipe == null) return;
    
    try {
      await StorageService.toggleFavorite(_recipe!.id);
      setState(() {
        _recipe = _recipe!.copyWith(favorite: !_recipe!.favorite);
      });
    } catch (error) {
      print('Error toggling favorite: $error');
    }
  }

  Future<void> _shareRecipe() async {
    if (_recipe == null) return;
    
    try {
      await Share.shareXFiles([XFile(_recipe!.image)], text: '${_recipe!.title} Recipe');
    } catch (error) {
      print('Error sharing recipe: $error');
    }
  }

  Future<void> _deleteRecipe() async {
    if (_recipe == null) return;
    
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Recipe'),
        content: const Text('Are you sure you want to delete this recipe?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: AppTheme.primaryTomato),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
    
    if (confirmed == true) {
      try {
        await StorageService.deleteRecipe(_recipe!.id);
        if (mounted) {
          Navigator.pop(context);
        }
      } catch (error) {
        print('Error deleting recipe: $error');
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to delete recipe')),
          );
        }
      }
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
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppTheme.backgroundMain,
        body: Center(
          child: CircularProgressIndicator(
            color: AppTheme.primaryTomato,
          ),
        ),
      );
    }

    if (_recipe == null) {
      return Scaffold(
        backgroundColor: AppTheme.backgroundMain,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Recipe not found',
                style: AppTheme.heading2,
              ),
              const SizedBox(height: AppTheme.spacingLg),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                style: AppTheme.primaryButtonStyle,
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundMain,
      body: CustomScrollView(
        slivers: [
          // App bar with image
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            backgroundColor: AppTheme.primaryTomato,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            actions: [
              IconButton(
                onPressed: _shareRecipe,
                icon: const Icon(Icons.share, color: Colors.white),
              ),
              IconButton(
                onPressed: _toggleFavorite,
                icon: Icon(
                  _recipe!.favorite ? Icons.favorite : Icons.favorite_border,
                  color: Colors.white,
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.file(
                    File(_recipe!.image),
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.grey[300],
                        child: const Icon(
                          Icons.image_not_supported,
                          color: Colors.grey,
                          size: 60,
                        ),
                      );
                    },
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.black.withOpacity(0.7),
                          Colors.transparent,
                          Colors.black.withOpacity(0.8),
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: AppTheme.spacingMd,
                    left: AppTheme.spacingMd,
                    right: AppTheme.spacingMd,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _recipe!.title,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingSm),
                        Row(
                          children: [
                            if (_recipe!.difficulty != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: AppTheme.spacingSm,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: _getDifficultyColor(_recipe!.difficulty),
                                  borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                                ),
                                child: Text(
                                  _recipe!.difficulty!.toUpperCase(),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 10,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            const SizedBox(width: AppTheme.spacingMd),
                            const Icon(Icons.access_time, color: Colors.white, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              OpenAIService.formatTime(_recipe!.prepTime + _recipe!.cookTime),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: AppTheme.spacingMd),
                            const Icon(Icons.people, color: Colors.white, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '${_recipe!.servings} ${_recipe!.servings == 1 ? 'serving' : 'servings'}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
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
          ),
          
          // Recipe content
          SliverPadding(
            padding: const EdgeInsets.all(AppTheme.spacingMd),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Ingredients section
                _buildSection(
                  'Ingredients',
                  Column(
                    children: _recipe!.ingredients.map((ingredient) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppTheme.spacingSm),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 8,
                              height: 8,
                              margin: const EdgeInsets.only(top: 6, right: AppTheme.spacingSm),
                              decoration: const BoxDecoration(
                                color: AppTheme.primaryTomato,
                                shape: BoxShape.circle,
                              ),
                            ),
                            Expanded(
                              child: Text(
                                ingredient,
                                style: AppTheme.bodyText,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                const SizedBox(height: AppTheme.spacingLg),
                
                // Instructions section
                _buildSection(
                  'Instructions',
                  Column(
                    children: _recipe!.instructions.asMap().entries.map((entry) {
                      final index = entry.key;
                      final instruction = entry.value;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: AppTheme.spacingMd),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 28,
                              height: 28,
                              margin: const EdgeInsets.only(right: AppTheme.spacingSm),
                              decoration: const BoxDecoration(
                                color: AppTheme.primaryTomato,
                                shape: BoxShape.circle,
                              ),
                              child: Center(
                                child: Text(
                                  '${index + 1}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: Text(
                                instruction,
                                style: AppTheme.bodyText,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
                
                const SizedBox(height: AppTheme.spacingLg),
                
                // Time details section
                _buildSection(
                  'Time',
                  Row(
                    children: [
                      Expanded(
                        child: _buildTimeCard('Prep Time', _recipe!.prepTime),
                      ),
                      const SizedBox(width: AppTheme.spacingMd),
                      Expanded(
                        child: _buildTimeCard('Cook Time', _recipe!.cookTime),
                      ),
                      const SizedBox(width: AppTheme.spacingMd),
                      Expanded(
                        child: _buildTimeCard(
                          'Total Time',
                          _recipe!.prepTime + _recipe!.cookTime,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: AppTheme.spacingXl),
                
                // Delete button
                OutlinedButton.icon(
                  onPressed: _deleteRecipe,
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.primaryTomato,
                    side: const BorderSide(color: AppTheme.primaryTomato),
                    padding: const EdgeInsets.symmetric(vertical: AppTheme.spacingMd),
                  ),
                  icon: const Icon(Icons.delete_outline),
                  label: const Text('Delete Recipe'),
                ),
                
                const SizedBox(height: AppTheme.spacingXl),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(String title, Widget content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: AppTheme.heading2,
        ),
        const SizedBox(height: AppTheme.spacingMd),
        content,
      ],
    );
  }

  Widget _buildTimeCard(String label, int minutes) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: AppTheme.cardDecoration,
      child: Column(
        children: [
          Text(
            label,
            style: AppTheme.bodyTextSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingXs),
          Text(
            OpenAIService.formatTime(minutes),
            style: AppTheme.heading3,
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}