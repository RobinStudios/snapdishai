import 'dart:convert';
import 'dart:typed_data';
import '../models/recipe.dart';

class OpenAIService {
  // Mock API delay for demo purposes
  static const int mockApiDelay = 2000;

  // Mock the OpenAI Vision API request for demo purposes
  static Future<GeneratedRecipe> analyzeImageWithOpenAI(String imageUri) async {
    try {
      print('Analyzing image with OpenAI Vision API (simulated)');
      
      // Simulate API delay
      await Future.delayed(const Duration(milliseconds: mockApiDelay));
      
      // Mock response data based on timestamp to make it somewhat unique
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final mockRecipes = [
        GeneratedRecipe(
          title: "Grilled Salmon with Asparagus",
          ingredients: [
            "2 salmon fillets (6 oz each)",
            "1 bunch asparagus, trimmed",
            "2 tablespoons olive oil",
            "1 lemon, sliced",
            "2 cloves garlic, minced",
            "1 teaspoon fresh dill, chopped",
            "Salt and pepper to taste"
          ],
          instructions: [
            "Preheat oven to 400°F (200°C).",
            "Place salmon fillets on a baking sheet lined with parchment paper.",
            "Arrange asparagus around the salmon.",
            "Drizzle olive oil over salmon and asparagus.",
            "Season with salt, pepper, and minced garlic.",
            "Top salmon with lemon slices and dill.",
            "Bake for 12-15 minutes until salmon is cooked through.",
            "Serve immediately with lemon wedges."
          ],
          prepTime: 10,
          cookTime: 15,
          servings: 2,
          difficulty: "easy",
        ),
        GeneratedRecipe(
          title: "Chocolate Chip Cookies",
          ingredients: [
            "2 1/4 cups all-purpose flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "1 cup unsalted butter, softened",
            "3/4 cup granulated sugar",
            "3/4 cup packed brown sugar",
            "2 large eggs",
            "2 teaspoons vanilla extract",
            "2 cups semi-sweet chocolate chips"
          ],
          instructions: [
            "Preheat oven to 375°F (190°C).",
            "In a small bowl, whisk together flour, baking soda, and salt.",
            "In a large bowl, beat butter, granulated sugar, and brown sugar until creamy.",
            "Add eggs one at a time, beating well after each addition.",
            "Stir in vanilla extract.",
            "Gradually beat in flour mixture.",
            "Stir in chocolate chips.",
            "Drop by rounded tablespoon onto ungreased baking sheets.",
            "Bake for 9-11 minutes until golden brown.",
            "Let cool on baking sheets for 2 minutes, then transfer to wire racks."
          ],
          prepTime: 15,
          cookTime: 11,
          servings: 24,
          difficulty: "medium",
        ),
        GeneratedRecipe(
          title: "Vegetable Stir Fry",
          ingredients: [
            "2 tablespoons vegetable oil",
            "1 onion, sliced",
            "2 cloves garlic, minced",
            "1 red bell pepper, sliced",
            "1 yellow bell pepper, sliced",
            "1 cup broccoli florets",
            "1 cup snap peas",
            "1 carrot, julienned",
            "2 tablespoons soy sauce",
            "1 tablespoon honey",
            "1 teaspoon ginger, grated",
            "1/4 teaspoon red pepper flakes",
            "2 tablespoons water",
            "1 tablespoon cornstarch"
          ],
          instructions: [
            "Heat oil in a large wok or skillet over high heat.",
            "Add onion and garlic, stir-fry for 1 minute.",
            "Add bell peppers, broccoli, snap peas, and carrots.",
            "Stir-fry for 4-5 minutes until vegetables are tender-crisp.",
            "In a small bowl, whisk together soy sauce, honey, ginger, red pepper flakes.",
            "In another small bowl, mix water and cornstarch.",
            "Pour sauce over vegetables and stir well.",
            "Add cornstarch mixture and cook until sauce thickens, about 1 minute.",
            "Serve hot over rice or noodles."
          ],
          prepTime: 15,
          cookTime: 10,
          servings: 4,
          difficulty: "easy",
        ),
      ];
      
      // Select a mock recipe based on the timestamp
      final mockIndex = timestamp % mockRecipes.length;
      return mockRecipes[mockIndex];
      
    } catch (error) {
      throw Exception('Failed to analyze the image. Please try again.');
    }
  }

  // Format time duration in minutes to a human-readable format
  static String formatTime(int minutes) {
    if (minutes < 60) {
      return '$minutes min';
    }
    
    final hours = minutes ~/ 60;
    final remainingMinutes = minutes % 60;
    
    if (remainingMinutes == 0) {
      return '$hours hr';
    }
    
    return '$hours hr $remainingMinutes min';
  }
}