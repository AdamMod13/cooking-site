import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipesService } from '../recipes.service';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';
import * as fromApp from '../../store/app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  selectedRecipeId: number;
  selectedRecipe: Recipe;

  constructor(
    private recipesService: RecipesService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.selectedRecipeId = +params['id'];
      this.selectedRecipe = this.recipesService.getRecipe(
        this.selectedRecipeId
      );
    });
  }

  addIngredientsToShoppingList() {
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.selectedRecipe.ingredients)
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDeleteRecipe() {
    this.recipesService.deleteRecipe(this.selectedRecipeId);
    this.router.navigate(['/recipes']);
  }
}
