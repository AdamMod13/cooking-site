import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.action';
import { Actions, ofType } from '@ngrx/effects';
import { Recipe } from '../recipes/recipe.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListResolverService implements Resolve<Recipe[]> {
  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => {
        return recipesState.recipes;
      }),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new ShoppingListActions.FetchShoppingList());
          return this.actions$.pipe(
            ofType(ShoppingListActions.SET_SHOPPING_LIST),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
    this.store.dispatch(new ShoppingListActions.FetchShoppingList());
    return this.actions$.pipe(
      ofType(ShoppingListActions.SET_SHOPPING_LIST),
      take(1)
    );
  }
}
