import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({providedIn: 'root'})
export class ShoppingListService {
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  constructor() { }

  ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  addIngredient(newIngredient: Ingredient) {
    console.log(newIngredient)
    this.ingredients.push(newIngredient)
    this.ingredientsChanged.emit(this.ingredients.slice())
  }

  addIngredients(newIngredients: Ingredient[]) {
    this.ingredients.push(...newIngredients);
    this.ingredientsChanged.emit(this.ingredients.slice())
  }
}
