import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { TemplateFormComponent } from './template-form.component';
import { ShareModule } from '../share/share.module';




@NgModule({
  declarations: [
    TemplateFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ShareModule
  ]
})
export class TemplateFormModule { }
