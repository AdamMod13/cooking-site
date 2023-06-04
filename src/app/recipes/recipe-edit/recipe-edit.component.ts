import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from '../store/recipe.actions';
import { map, Subscription } from 'rxjs';
import { User } from '../../auth/user.model';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  currentUser: User;

  private storeSub: Subscription;
  private authSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.authSub = this.store.select('auth').subscribe((authState) => {
      this.currentUser = authState.user;
    });

    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });

    this.store.dispatch(new RecipesActions.FetchRecipeIngredients(this.id));
  }

  onAddIgredient() {
    (<FormArray>this.recipeForm.get('recipeIngredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        quantity: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('recipeIngredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    if (this.editMode) {
      this.store.dispatch(
        new RecipesActions.UpdateRecipes({
          index: this.id,
          recipe: this.recipeForm.value,
        })
      );
    } else {
      const recipe: Recipe = {
        ...this.recipeForm.value,
        author: this.currentUser,
      };
      this.store.dispatch(new RecipesActions.AddRecipes(recipe));
    }

    this.onCancel();
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map((recipesState) => {
            return recipesState.recipes.find((recipe) => {
              return recipe.id === this.id;
            });
          })
        )
        .subscribe((recipe) => {
          console.log(recipe);
          recipeName = recipe.recipeName;
          recipeDescription = recipe.description;
          recipeImagePath = recipe.imagePath;
          if (recipe['recipeIngredients']) {
            for (let ingredient of recipe.recipeIngredients) {
              (<FormArray>recipeIngredients).push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  quantity: new FormControl(ingredient.quantity, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      recipeName: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      recipeIngredients: recipeIngredients,
    });
  }
}
