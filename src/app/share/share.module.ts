import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FormDebugComponent } from './form-debug/form-debug.component';
import { DropdownService } from './service/dropdown.service';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { CampoErroComponent } from './campo-erro/campo-erro.component';
import { InputFieldComponent } from './input-field/input-field.component';



@NgModule({
  declarations: [
    FormDebugComponent,
    ErrorMsgComponent,
    CampoErroComponent,
    InputFieldComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [ FormDebugComponent, ErrorMsgComponent, CampoErroComponent, InputFieldComponent ],
  providers: [ DropdownService ]
})
export class ShareModule { }
