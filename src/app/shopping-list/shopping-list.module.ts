import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { SharedModule } from '../shared/shared.module';
import { ShoppingListResolverService } from './shopping-list.resolver';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ShoppingListComponent,
        resolve: [ShoppingListResolverService],
      },
    ]),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [],
  providers: [],
})
export class ShoppingListModule {}
