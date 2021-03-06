import { Component, OnInit,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConsultaCepService } from '../share/service/consulta-cep.service';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null
  }

  constructor(private http: HttpClient,
              private consultaCepService: ConsultaCepService) { }

  ngOnInit() {
  }

  onSubmit(form) {
    this.http.post('//httpbin.org/post', JSON.stringify(form.value))
    .subscribe((res) => {
      console.log(res);
    });
  }

  verificaValidTouched(campo) {
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo) {
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo),
    }
  }

  consultaCEP(cep, form){
    // Nova variável CEP somento com digitos númericos.
    cep = cep.replace(/\D/g, '');
    if(cep != '') {
      // Expressão regular para validar CEP.
      const validacep = /^[0-9]{8}$/

      if (cep != null && cep !== '') {
        this.consultaCepService.consultaCEP(cep)
        .subscribe(dados => {
          this.populaDadosForm(dados, form);
        });
      }
    }
  }

  populaDadosForm(dados, formulario){
    // formulario.setValue({
    //     nome: formulario.value.nome,
    //     email: formulario.value.email,
    //     endereco: {
    //       cep: dados.cep,
    //       numero: '',
    //       complemento: dados.complemento,
    //       rua: dados.logradouro,
    //       bairro: dados.bairro,
    //       cidade: dados.localidade,
    //       estado: dados.uf
    //     }
    // });

    formulario.form.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
  }

  resetaDadosForm(formulario) {
    formulario.form.patchValue({
      endereco: {
        cep: null,
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });

  }


}
