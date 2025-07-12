import 'package:flutter/material.dart';
import 'dart:io';
import '../models/recipe.dart';
import '../services/storage_service.dart';
import '../services/openai_service.dart';
import '../utils/theme.dart';
import 'recipe_detail_screen.dart';

class RecipeResultScreen extends StatefulWidget {
  final String imageUri;
  final GeneratedRecipe recipe;

  const RecipeResultScreen({
    super.key,
    required this.imageUri,
    required this.recipe,
  });

  @override
  State<RecipeResultScreen> createState() => _RecipeResultScreenState();
}

class _RecipeResultScreenState extends State<RecipeResultScreen> {
  bool _isSaving = false;
  bool _saved = false;

  Future<void> _saveRecipe() async {
    setState(() {
      _isSaving = true;
    });

    try {
      final recipe = widget.recipe.toRecipe(widget.imageUri);
      await StorageService.addRecipe(recipe);
      
      setState(() {
        _saved = true;
      });

      // Navigate to recipe detail after a short delay
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => RecipeDetailScreen(recipeId: recipe.id),
          ),
        );
      }
    } catch (error) {
      print('Error saving recipe: $error');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save recipe. Please try again.')),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSaving = false;
        });
      }
    }
  }

  void _discardRecipe() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Discard Recipe'),
        content: const Text('Are you sure you want to discard this recipe?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Close dialog
              Navigator.pop(context); // Go back to camera
            },
            style: TextButton.styleFrom(foregroundColor: AppTheme.primaryTomato),
            child: const Text('Discard'),
          ),
        ],
      ),
    );
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
              if (_saved)
                Container(
                  margin: const EdgeInsets.only(right: AppTheme.spacingMd),
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.spacingMd,
                    vertical: AppTheme.spacingSm,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.primaryBasil,
                    borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check, color: Colors.white, size: 16),
                      SizedBox(width: 4),
                      Text(
                        'Saved',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                )
              else
                TextButton.icon(
                  onPressed: _isSaving ? null : _saveRecipe,
                  icon: _isSaving
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : const Icon(Icons.save, color: Colors.white, size: 18),
                  label: const Text(
                    'Save',
                    style: TextStyle(color: Colors.white),
                  ),
                ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.file(
                    File(widget.imageUri),
                    fit: BoxFit.cover,
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
                          widget.recipe.title,
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: AppTheme.spacingSm),
                        Row(
                          children: [
                            if (widget.recipe.difficulty != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: AppTheme.spacingSm,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: _getDifficultyColor(widget.recipe.difficulty),
                                  borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                                ),
                                child: Text(
                                  widget.recipe.difficulty!.toUpperCase(),
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
                              OpenAIService.formatTime(widget.recipe.prepTime + widget.recipe.cookTime),
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
                              '${widget.recipe.servings} ${widget.recipe.servings == 1 ? 'serving' : 'servings'}',
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
          
          // AI Generated badge
          SliverToBoxAdapter(
            child: Container(
              margin: const EdgeInsets.all(AppTheme.spacingMd),
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.spacingMd,
                vertical: AppTheme.spacingSm,
              ),
              decoration: BoxDecoration(
                color: AppTheme.backgroundCard,
                borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.auto_awesome, color: AppTheme.primaryMustard, size: 16),
                  SizedBox(width: 4),
                  Text(
                    'AI Generated Recipe',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: AppTheme.textPrimary,
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
                    children: widget.recipe.ingredients.map((ingredient) {
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
                    children: widget.recipe.instructions.asMap().entries.map((entry) {
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
                        child: _buildTimeCard('Prep Time', widget.recipe.prepTime),
                      ),
                      const SizedBox(width: AppTheme.spacingMd),
                      Expanded(
                        child: _buildTimeCard('Cook Time', widget.recipe.cookTime),
                      ),
                      const SizedBox(width: AppTheme.spacingMd),
                      Expanded(
                        child: _buildTimeCard(
                          'Total Time',
                          widget.recipe.prepTime + widget.recipe.cookTime,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: AppTheme.spacingXl),
                
                // Action buttons
                if (!_saved) ...[
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _discardRecipe,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppTheme.primaryTomato,
                            side: const BorderSide(color: AppTheme.primaryTomato),
                            padding: const EdgeInsets.symmetric(vertical: AppTheme.spacingMd),
                          ),
                          icon: const Icon(Icons.delete_outline),
                          label: const Text('Discard'),
                        ),
                      ),
                      const SizedBox(width: AppTheme.spacingMd),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _isSaving ? null : _saveRecipe,
                          style: AppTheme.primaryButtonStyle,
                          icon: _isSaving
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(
                                    color: Colors.white,
                                    strokeWidth: 2,
                                  ),
                                )
                              : const Icon(Icons.save),
                          label: const Text('Save Recipe'),
                        ),
                      ),
                    ],
                  ),
                ],
                
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