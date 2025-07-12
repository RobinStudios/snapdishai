import { GeneratedRecipe } from '@/types/recipe';
import { imageToBase64 } from '@/utils/imageUtils';

// This would typically be an environment variable
// For demo purposes, we'll simulate API calls without actual API keys
const MOCK_API_DELAY = 2000; // Simulate API response delay for demo

// Mock the OpenAI Vision API request for demo purposes
// In a real app, you would call the actual OpenAI API with your API key
export const analyzeImageWithOpenAI = async (
  imageUri: string
): Promise<GeneratedRecipe> => {
  try {
    console.log('Analyzing image with OpenAI Vision API (simulated)');
    
    // In a real implementation, you would:
    // 1. Convert the image to base64
    // const base64Image = await imageToBase64(imageUri);
    
    // 2. Send the image to OpenAI's Vision API
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${YOUR_OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: 'gpt-4-vision-preview',
    //     messages: [
    //       {
    //         role: 'user',
    //         content: [
    //           { type: 'text', text: 'Create a detailed recipe for this dish, including title, ingredients with quantities, preparation steps, cooking time, prep time, and serving size.' },
    //           { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
    //         ]
    //       }
    //     ],
    //     max_tokens: 1000
    //   })
    // });
    // const data = await response.json();
    // Parse the response to extract the recipe information
    
    // For demo purposes, we'll simulate a delay and return mock data
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    // Mock response data based on the image timestamp to make it somewhat unique
    const timestamp = new Date().getTime();
    const mockRecipes = [
      {
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
        difficulty: "easy" as const
      },
      {
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
        difficulty: "medium" as const
      },
      {
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
        difficulty: "easy" as const
      }
    ];
    
    // Select a mock recipe based on the timestamp
    const mockIndex = timestamp % mockRecipes.length;
    return mockRecipes[mockIndex];
    
  } catch (error) {
    console.error('Error analyzing image with OpenAI:', error);
    throw new Error('Failed to analyze the image. Please try again.');
  }
};

// Format time duration in minutes to a human-readable format
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
};