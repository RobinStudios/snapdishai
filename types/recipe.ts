export interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  createdAt: number; // timestamp
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  favorite?: boolean;
}

export interface GeneratedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface RecipeState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
}