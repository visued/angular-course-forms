import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient) { }

  ngOnInit() {
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    // });
    this.formulario = this.formBuilder.group({
      nome: [null],
      email: [null]
    });
  }

  onSubmit() {
    this.http.post('//oooohttpbin.org/post', JSON.stringify(this.formulario.value))
    .subscribe((res) => {
      console.log(res);
      this.formulario.reset();
    }, (error: any) => {
      console.log('Error: '+ error);
    });
  }

  resetar() {
    this.formulario.reset();
  }

}
