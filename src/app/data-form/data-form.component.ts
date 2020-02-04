import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-data-form",
  templateUrl: "./data-form.component.html",
  styleUrls: ["./data-form.component.css"]
})
export class DataFormComponent implements OnInit {
  formulario: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    // });
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      })
    });
  }

  onSubmit() {
    this.http
      .post("//httpbin.org/post", JSON.stringify(this.formulario.value))
      .subscribe(
        res => {
          console.log(res);
          //this.formulario.reset();
        },
        (error: any) => {
          console.log("Error: " + error);
        }
      );
  }

  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo).valid && this.formulario.get(campo).touched
    );
  }

  aplicaCssErro(campo: string) {
    return {
      "is-invalid": this.verificaValidTouched(campo)
    };
  }

  verificaEmailValido() {
    let campoEmail = this.formulario.get("email");
    if (campoEmail.errors) {
      return campoEmail.errors["email"];
    }
  }

  consultaCEP() {
    let cep = this.formulario.get("endereco.cep").value;
    // Nova variável CEP somento com digitos númericos.
    cep = cep.replace(/\D/g, "");
    if (cep != "") {
      // Expressão regular para validar CEP.
      const validacep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if (validacep.test(cep)) {
        this.resetaDadosForm();
        this.http.get(`//viacep.com.br/ws/${cep}/json`).subscribe(dados => {
          this.populaDadosForm(dados);
        });
      }
    }
  }

  populaDadosForm(dados) {
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

    this.formulario.patchValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }

  resetaDadosForm() {
    this.formulario.patchValue({
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
