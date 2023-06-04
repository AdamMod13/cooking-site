import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap } from 'rxjs';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>('http://localhost:8080/api/recipe');
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            recipeIngredients: recipe.recipeIngredients
              ? recipe.recipeIngredients
              : [],
          };
        });
      }),
      map((recipes) => {
        console.log(recipes);
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipe$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.ADD_RECIPES),
        switchMap((recipeData: RecipesActions.AddRecipes) => {
          return this.http.post(
            'http://localhost:8080/api/recipe/addRecipe',
            recipeData.payload
          );
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
