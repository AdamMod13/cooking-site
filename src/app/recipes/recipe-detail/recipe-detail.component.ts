import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';
import { map, switchMap } from 'rxjs';
import * as RecipesActions from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipeId: number;
  selectedRecipe: Recipe;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params) => {
          return +params['id'];
        }),
        switchMap((id) => {
          this.selectedRecipeId = id;
          return this.store.select('recipes');
        }),
        map((recipesState) => {
          return recipesState.recipes.find((recipe) => {
            return recipe.id === this.selectedRecipeId;
          });
        })
      )
      .subscribe((recipe) => {
        this.selectedRecipe = recipe;
      });
  }

  addIngredientsToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(
        this.selectedRecipe.recipeIngredients
      )
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.store.dispatch(
      new RecipesActions.DeleteRecipes(this.selectedRecipeId)
    );
    this.router.navigate(['/recipes']);
  }
}
