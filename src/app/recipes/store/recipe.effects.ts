import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import { switchMap, tap } from 'rxjs';
import { Recipe } from '../recipe.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
        }),
        tap(() => {
          this.router.navigate(['/recipes']);
        })
      ),
    { dispatch: false }
  );

  deleteRecipe$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.DELETE_RECIPES),
        switchMap((recipeData: RecipesActions.DeleteRecipes) => {
          return this.http.delete(
            `http://localhost:8080/api/recipe/delete/${recipeData.payload}`
          );
        })
      ),
    { dispatch: false }
  );

  updateRecipe$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.UPDATE_RECIPES),
        switchMap((recipeData: RecipesActions.UpdateRecipes) => {
          return this.http.post(
            `http://localhost:8080/api/recipe/updateRecipe/${recipeData.payload.id}`,
            recipeData.payload
          );
        }),
        tap((recipe) => {
          this.router.navigate(['/recipes']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
