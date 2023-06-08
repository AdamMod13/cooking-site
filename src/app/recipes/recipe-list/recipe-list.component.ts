import { Component, OnDestroy, OnInit } from '@angular/core';

import { Recipe } from '../recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  initialRecipes: Recipe[];
  filteredRecipes: Recipe[] = [];
  recipeFilter: string = '';
  ingredientFilter: string = '';
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.subscription = this.store
      .select('recipes')
      .pipe(map((recipesState) => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.initialRecipes = recipes;
        this.filteredRecipes = recipes;
        this.recipeFilter = '';
        this.ingredientFilter = '';
      });
  }

  filterItems(event: any) {
    const keyCode = event.keyCode || event.which;
    if (keyCode === 8) {
      this.filteredRecipes = this.initialRecipes;
    }
    const recipeFilterText = this.recipeFilter.toLowerCase().trim();
    const ingredientFilterText = this.ingredientFilter.toLowerCase().trim();
    if (
      (recipeFilterText === '' && ingredientFilterText === '') ||
      this.filteredRecipes.length === 0
    ) {
      this.filteredRecipes = this.initialRecipes;
    }
    this.filteredRecipes = this.filteredRecipes.filter((recipe) => {
      const recipeNameMatch = recipe.recipeName
        .toLowerCase()
        .includes(recipeFilterText);

      const ingredientNameMatch = recipe.recipeIngredients.some((ingredient) =>
        ingredient.name.toLowerCase().includes(ingredientFilterText)
      );

      return recipeNameMatch && ingredientNameMatch;
    });
  }

  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
