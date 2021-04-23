import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivacionPageRoutingModule } from './activacion-routing.module';

import { ActivacionPage } from './activacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivacionPageRoutingModule,    
    ReactiveFormsModule
  ],
  declarations: [ActivacionPage]
})
export class ActivacionPageModule {}
