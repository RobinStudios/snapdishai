class Recipe {
  final String id;
  final String title;
  final String image;
  final List<String> ingredients;
  final List<String> instructions;
  final int prepTime; // in minutes
  final int cookTime; // in minutes
  final int servings;
  final int createdAt; // timestamp
  final String? difficulty;
  final List<String>? tags;
  final bool favorite;

  Recipe({
    required this.id,
    required this.title,
    required this.image,
    required this.ingredients,
    required this.instructions,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    required this.createdAt,
    this.difficulty,
    this.tags,
    this.favorite = false,
  });

  Recipe copyWith({
    String? id,
    String? title,
    String? image,
    List<String>? ingredients,
    List<String>? instructions,
    int? prepTime,
    int? cookTime,
    int? servings,
    int? createdAt,
    String? difficulty,
    List<String>? tags,
    bool? favorite,
  }) {
    return Recipe(
      id: id ?? this.id,
      title: title ?? this.title,
      image: image ?? this.image,
      ingredients: ingredients ?? this.ingredients,
      instructions: instructions ?? this.instructions,
      prepTime: prepTime ?? this.prepTime,
      cookTime: cookTime ?? this.cookTime,
      servings: servings ?? this.servings,
      createdAt: createdAt ?? this.createdAt,
      difficulty: difficulty ?? this.difficulty,
      tags: tags ?? this.tags,
      favorite: favorite ?? this.favorite,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'image': image,
      'ingredients': ingredients,
      'instructions': instructions,
      'prepTime': prepTime,
      'cookTime': cookTime,
      'servings': servings,
      'createdAt': createdAt,
      'difficulty': difficulty,
      'tags': tags,
      'favorite': favorite,
    };
  }

  factory Recipe.fromJson(Map<String, dynamic> json) {
    return Recipe(
      id: json['id'],
      title: json['title'],
      image: json['image'],
      ingredients: List<String>.from(json['ingredients']),
      instructions: List<String>.from(json['instructions']),
      prepTime: json['prepTime'],
      cookTime: json['cookTime'],
      servings: json['servings'],
      createdAt: json['createdAt'],
      difficulty: json['difficulty'],
      tags: json['tags'] != null ? List<String>.from(json['tags']) : null,
      favorite: json['favorite'] ?? false,
    );
  }
}

class GeneratedRecipe {
  final String title;
  final List<String> ingredients;
  final List<String> instructions;
  final int prepTime;
  final int cookTime;
  final int servings;
  final String? difficulty;

  GeneratedRecipe({
    required this.title,
    required this.ingredients,
    required this.instructions,
    required this.prepTime,
    required this.cookTime,
    required this.servings,
    this.difficulty,
  });

  Recipe toRecipe(String imageUri) {
    return Recipe(
      id: 'recipe_${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      image: imageUri,
      ingredients: ingredients,
      instructions: instructions,
      prepTime: prepTime,
      cookTime: cookTime,
      servings: servings,
      createdAt: DateTime.now().millisecondsSinceEpoch,
      difficulty: difficulty ?? 'medium',
      favorite: false,
    );
  }
}