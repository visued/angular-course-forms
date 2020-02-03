import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DataFormComponent } from './data-form.component';
import { ShareModule } from '../share/share.module';



@NgModule({
  declarations: [
    DataFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ShareModule,
    HttpClientModule

  ]
})
export class DataFormModule { }
