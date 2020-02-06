import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FormDebugComponent } from './form-debug/form-debug.component';
import { DropdownService } from './service/dropdown.service';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { CampoErroComponent } from './campo-erro/campo-erro.component';



@NgModule({
  declarations: [
    FormDebugComponent,
    ErrorMsgComponent,
    CampoErroComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  exports: [ FormDebugComponent, ErrorMsgComponent, CampoErroComponent ],
  providers: [ DropdownService ]
})
export class ShareModule { }
