import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ShoppingListActions from './shopping-list.action';
import { switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { Recipe } from '../../recipes/recipe.model';

@Injectable()
export class ShoppingListEffects {
  fetchShoppingList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShoppingListActions.FETCH_SHOPPING_LIST),
      switchMap(() => {
        return this.http.get<Ingredient[]>(
          'http://localhost:8080/api/shopping-list'
        );
      }),
      map((ingredients) => {
        return new ShoppingListActions.SetShoppingList(ingredients);
      })
    )
  );

  storeItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingListActions.ADD_INGREDIENT),
        switchMap((shoppingListData: ShoppingListActions.AddIngredient) => {
          return this.http.post(
            'http://localhost:8080/api/shopping-list/addItem',
            shoppingListData.payload
          );
        })
      ),
    { dispatch: false }
  );

  storeItems$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingListActions.ADD_INGREDIENTS),
        switchMap((shoppingListData: ShoppingListActions.AddIngredients) => {
          return this.http.post(
            'http://localhost:8080/api/shopping-list/addItems',
            shoppingListData.payload
          );
        })
      ),
    { dispatch: false }
  );

  deleteItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingListActions.DELETE_INGREDIENT),
        switchMap((shoppingListData: ShoppingListActions.DeleteIngredient) => {
          return this.http.delete(
            `http://localhost:8080/api/shopping-list/delete/${shoppingListData.payload}`
          );
        })
      ),
    { dispatch: false }
  );

  updateItem$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ShoppingListActions.UPDATE_INGREDIENT),
        switchMap((recipeData: ShoppingListActions.UpdateIngredient) => {
          console.log(recipeData.payload);
          return this.http.post<Recipe[]>(
            `http://localhost:8080/api/shopping-list/updateItem/${recipeData.payload.id}`,
            recipeData.payload
          );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
