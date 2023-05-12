import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({providedIn: 'root'})
export class RecipesService {
  constructor() { }

  private recipes: Recipe[] = [
    new Recipe(0, 'Tasty Schnitzel', 'This is simply a test1', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', [
      new Ingredient('Meat', 1),
      new Ingredient('French Fries', 28)
    ]),
    new Recipe(1, 'Big Fat burger', 'This is simply a test2', 'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', [
      new Ingredient('Buns', 2),
      new Ingredient('Meat', 1)
    ])
  ];

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }
}
