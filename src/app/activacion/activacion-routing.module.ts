import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivacionPage } from './activacion.page';

const routes: Routes = [
  {
    path: '',
    component: ActivacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivacionPageRoutingModule {}
