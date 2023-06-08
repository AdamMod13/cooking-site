import { Recipe } from '../recipe.model';
import * as RecipesActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(
  state = initialState,
  action: RecipesActions.RecipesActions
) {
  switch (action.type) {
    case RecipesActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case RecipesActions.ADD_RECIPES:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case RecipesActions.UPDATE_RECIPES:
      const updatedRecipe = {
        ...state.recipes[action.payload.id],
        ...action.payload,
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.id] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes,
      };
    case RecipesActions.DELETE_RECIPES:
      return {
        ...state,
        recipes: state.recipes.filter((recipe) => {
          return recipe.id !== action.payload;
        }),
      };
    default:
      return state;
  }
}
