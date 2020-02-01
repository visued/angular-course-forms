import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: 'Sued',
    email: 'sued@gmail.com'
  }

  constructor() { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form);
    console.log(this.usuario);
  }

}
