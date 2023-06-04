import { Ingredient } from '../shared/ingredient.model';
import { User } from '../auth/user.model';

export class Recipe {
  public id: number;
  public recipeName: string;
  public description: string;
  public imagePath: string;
  public author: User;
  public recipeIngredients: Ingredient[];

  constructor(
    id: number,
    recipeName: string,
    desc: string,
    imagePath: string,
    author: User,
    recipeIngredients: Ingredient[]
  ) {
    this.id = id;
    this.recipeName = recipeName;
    this.description = desc;
    this.imagePath = imagePath;
    this.author = author;
    this.recipeIngredients = recipeIngredients;
  }
}
