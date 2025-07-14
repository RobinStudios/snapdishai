import 'package:flutter/material.dart';
import '../utils/theme.dart';
import '../models/recipe.dart';
import '../services/storage_service.dart';
import 'recipe_detail_screen.dart';
import 'dart:io';

class ExploreScreen extends StatefulWidget {
  const ExploreScreen({super.key});

  @override
  State<ExploreScreen> createState() => _ExploreScreenState();
}

class _ExploreScreenState extends State<ExploreScreen> {
  final ScrollController _scrollController = ScrollController();
  List<Recipe> _featuredRecipes = [];
  List<CuisineCategory> _categories = [];
  List<ReviewItem> _reviews = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadExploreData();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadExploreData() async {
    try {
      // Load user's recipes
      final userRecipes = await StorageService.getRecipes();
      
      // Mock featured recipes and categories for demo
      final mockFeatured = _generateMockFeaturedRecipes();
      final mockCategories = _generateMockCategories();
      final mockReviews = _generateMockReviews();
      
      setState(() {
        _featuredRecipes = [...userRecipes, ...mockFeatured];
        _categories = mockCategories;
        _reviews = mockReviews;
        _loading = false;
      });
    } catch (error) {
      print('Error loading explore data: $error');
      setState(() {
        _loading = false;
      });
    }
  }

  List<Recipe> _generateMockFeaturedRecipes() {
    return [
      Recipe(
        id: 'featured_1',
        title: 'Truffle Pasta Perfection',
        image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
        ingredients: ['Pasta', 'Truffle oil', 'Parmesan'],
        instructions: ['Cook pasta', 'Add truffle oil', 'Serve with cheese'],
        prepTime: 15,
        cookTime: 20,
        servings: 2,
        createdAt: DateTime.now().millisecondsSinceEpoch,
        difficulty: 'medium',
        favorite: false,
      ),
      Recipe(
        id: 'featured_2',
        title: 'Mediterranean Bowl',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        ingredients: ['Quinoa', 'Olives', 'Feta', 'Tomatoes'],
        instructions: ['Cook quinoa', 'Mix ingredients', 'Serve fresh'],
        prepTime: 10,
        cookTime: 15,
        servings: 1,
        createdAt: DateTime.now().millisecondsSinceEpoch,
        difficulty: 'easy',
        favorite: true,
      ),
      Recipe(
        id: 'featured_3',
        title: 'Artisan Pizza Margherita',
        image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        ingredients: ['Pizza dough', 'Tomato sauce', 'Mozzarella', 'Basil'],
        instructions: ['Roll dough', 'Add toppings', 'Bake until golden'],
        prepTime: 30,
        cookTime: 12,
        servings: 4,
        createdAt: DateTime.now().millisecondsSinceEpoch,
        difficulty: 'hard',
        favorite: false,
      ),
    ];
  }

  List<CuisineCategory> _generateMockCategories() {
    return [
      CuisineCategory(
        id: 'italian',
        name: 'Italian',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        recipeCount: 24,
        color: const Color(0xFF4CAF50),
      ),
      CuisineCategory(
        id: 'asian',
        name: 'Asian',
        image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg',
        recipeCount: 18,
        color: const Color(0xFFFF9800),
      ),
      CuisineCategory(
        id: 'mexican',
        name: 'Mexican',
        image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
        recipeCount: 15,
        color: const Color(0xFFE91E63),
      ),
      CuisineCategory(
        id: 'mediterranean',
        name: 'Mediterranean',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        recipeCount: 12,
        color: const Color(0xFF2196F3),
      ),
      CuisineCategory(
        id: 'indian',
        name: 'Indian',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
        recipeCount: 21,
        color: const Color(0xFF9C27B0),
      ),
    ];
  }

  List<ReviewItem> _generateMockReviews() {
    return [
      ReviewItem(
        id: 'review_1',
        userName: 'Sarah Chen',
        userAvatar: 'SC',
        rating: 5,
        comment: 'This truffle pasta recipe is absolutely divine! The flavors are perfectly balanced.',
        recipeTitle: 'Truffle Pasta Perfection',
        recipeImage: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
        timestamp: DateTime.now().subtract(const Duration(hours: 2)),
      ),
      ReviewItem(
        id: 'review_2',
        userName: 'Mike Rodriguez',
        userAvatar: 'MR',
        rating: 4,
        comment: 'Great Mediterranean bowl! Fresh ingredients and easy to make. Will definitely try again.',
        recipeTitle: 'Mediterranean Bowl',
        recipeImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        timestamp: DateTime.now().subtract(const Duration(hours: 5)),
      ),
      ReviewItem(
        id: 'review_3',
        userName: 'Emma Thompson',
        userAvatar: 'ET',
        rating: 5,
        comment: 'Pizza turned out amazing! The crust was perfect and the toppings were so fresh.',
        recipeTitle: 'Artisan Pizza Margherita',
        recipeImage: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg',
        timestamp: DateTime.now().subtract(const Duration(hours: 8)),
      ),
      ReviewItem(
        id: 'review_4',
        userName: 'David Kim',
        userAvatar: 'DK',
        rating: 4,
        comment: 'Love the simplicity of this recipe. Perfect for a quick weeknight dinner!',
        recipeTitle: 'Mediterranean Bowl',
        recipeImage: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        timestamp: DateTime.now().subtract(const Duration(days: 1)),
      ),
    ];
  }

  void _navigateToRecipe(Recipe recipe) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => RecipeDetailScreen(recipeId: recipe.id),
      ),
    );
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

    return Scaffold(
      backgroundColor: AppTheme.backgroundMain,
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // App Bar
          SliverAppBar(
            expandedHeight: 120,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.backgroundMain,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              title: const Text(
                'Explore',
                style: TextStyle(
                  color: AppTheme.textPrimary,
                  fontWeight: FontWeight.bold,
                ),
              ),
              titlePadding: const EdgeInsets.only(left: 20, bottom: 16),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.backgroundMain,
                      Color(0xFFF5F3F0),
                    ],
                  ),
                ),
              ),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.search, color: AppTheme.textPrimary),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: AppTheme.textPrimary),
                onPressed: () {},
              ),
            ],
          ),

          // Categories Section
          SliverToBoxAdapter(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.all(AppTheme.spacingMd),
                  child: Text(
                    'Explore Cuisines',
                    style: AppTheme.heading2,
                  ),
                ),
                SizedBox(
                  height: 120,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      return _buildCategoryCard(category);
                    },
                  ),
                ),
              ],
            ),
          ),

          // Featured Recipes Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Featured Recipes',
                    style: AppTheme.heading2,
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text(
                      'See All',
                      style: TextStyle(color: AppTheme.primaryTomato),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Featured Recipes Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: AppTheme.spacingMd,
                mainAxisSpacing: AppTheme.spacingMd,
                childAspectRatio: 0.75,
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  if (index >= _featuredRecipes.length) return null;
                  final recipe = _featuredRecipes[index];
                  return _buildFeaturedRecipeCard(recipe);
                },
                childCount: _featuredRecipes.length > 4 ? 4 : _featuredRecipes.length,
              ),
            ),
          ),

          // Reviews Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Recent Reviews',
                    style: AppTheme.heading2,
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text(
                      'See All',
                      style: TextStyle(color: AppTheme.primaryTomato),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Reviews List
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                if (index >= _reviews.length) return null;
                final review = _reviews[index];
                return _buildReviewCard(review);
              },
              childCount: _reviews.length,
            ),
          ),

          // Bottom spacing
          const SliverToBoxAdapter(
            child: SizedBox(height: AppTheme.spacingXl),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryCard(CuisineCategory category) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: AppTheme.spacingMd),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppTheme.radiusLg),
              image: DecorationImage(
                image: NetworkImage(category.image),
                fit: BoxFit.cover,
              ),
              boxShadow: [
                BoxShadow(
                  color: category.color.withOpacity(0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    category.color.withOpacity(0.7),
                  ],
                ),
              ),
              child: Center(
                child: Text(
                  '${category.recipeCount}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: AppTheme.spacingSm),
          Text(
            category.name,
            style: AppTheme.bodyTextSmall.copyWith(
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedRecipeCard(Recipe recipe) {
    return GestureDetector(
      onTap: () => _navigateToRecipe(recipe),
      child: Container(
        decoration: AppTheme.cardDecoration,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 3,
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppTheme.radiusMd),
                  ),
                  image: DecorationImage(
                    image: recipe.image.startsWith('http')
                        ? NetworkImage(recipe.image)
                        : FileImage(File(recipe.image)) as ImageProvider,
                    fit: BoxFit.cover,
                  ),
                ),
                child: Stack(
                  children: [
                    if (recipe.favorite)
                      const Positioned(
                        top: AppTheme.spacingSm,
                        right: AppTheme.spacingSm,
                        child: Icon(
                          Icons.favorite,
                          color: AppTheme.primaryTomato,
                          size: 20,
                        ),
                      ),
                    if (recipe.difficulty != null)
                      Positioned(
                        top: AppTheme.spacingSm,
                        left: AppTheme.spacingSm,
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
                              fontSize: 8,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
            Expanded(
              flex: 2,
              child: Padding(
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
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const Spacer(),
                    Row(
                      children: [
                        const Icon(
                          Icons.access_time,
                          size: 12,
                          color: AppTheme.textSecondary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${recipe.prepTime + recipe.cookTime} min',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                        const Spacer(),
                        Row(
                          children: List.generate(5, (index) {
                            return Icon(
                              Icons.star,
                              size: 12,
                              color: index < 4 ? Colors.amber : Colors.grey[300],
                            );
                          }),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewCard(ReviewItem review) {
    return Container(
      margin: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingMd,
        vertical: AppTheme.spacingSm,
      ),
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: AppTheme.cardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: AppTheme.primaryTomato,
                child: Text(
                  review.userAvatar,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
              const SizedBox(width: AppTheme.spacingSm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.userName,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    Row(
                      children: [
                        Row(
                          children: List.generate(5, (index) {
                            return Icon(
                              Icons.star,
                              size: 14,
                              color: index < review.rating ? Colors.amber : Colors.grey[300],
                            );
                          }),
                        ),
                        const SizedBox(width: AppTheme.spacingSm),
                        Text(
                          _formatTimestamp(review.timestamp),
                          style: AppTheme.bodyTextSmall,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppTheme.spacingSm),
          Text(
            review.comment,
            style: AppTheme.bodyText,
          ),
          const SizedBox(height: AppTheme.spacingSm),
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                child: Image.network(
                  review.recipeImage,
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(width: AppTheme.spacingSm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      review.recipeTitle,
                      style: const TextStyle(
                        fontWeight: FontWeight.w500,
                        fontSize: 14,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Tap to view recipe',
                      style: TextStyle(
                        color: AppTheme.primaryTomato,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
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

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}

// Data models for explore page
class CuisineCategory {
  final String id;
  final String name;
  final String image;
  final int recipeCount;
  final Color color;

  CuisineCategory({
    required this.id,
    required this.name,
    required this.image,
    required this.recipeCount,
    required this.color,
  });
}

class ReviewItem {
  final String id;
  final String userName;
  final String userAvatar;
  final int rating;
  final String comment;
  final String recipeTitle;
  final String recipeImage;
  final DateTime timestamp;

  ReviewItem({
    required this.id,
    required this.userName,
    required this.userAvatar,
    required this.rating,
    required this.comment,
    required this.recipeTitle,
    required this.recipeImage,
    required this.timestamp,
  });
}