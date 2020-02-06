import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { map, tap } from 'rxjs/operators';

import { DropdownService } from "../share/service/dropdown.service";
import { IEstadosBr } from "../share/models/iestados-br.model";
import { ConsultaCepService } from "../share/service/consulta-cep.service";
import { Observable } from "rxjs/internal/Observable";
import { FormValidation } from '../share/form-validation';
import { VerificaEmailService } from '../share/service/verifica-email.service';

@Component({
  selector: "app-data-form",
  templateUrl: "./data-form.component.html",
  styleUrls: ["./data-form.component.css"]
})
export class DataFormComponent implements OnInit {
  formulario: FormGroup;
  //estados: IEstadosBr[];
  estados: Observable<IEstadosBr[]>;
  cargos: any[];
  tecnologias: any[];
  newsletters: any[];
  frameworks = ["Angular", "React", "Vue", "Ionic"];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropDownService: DropdownService,
    private consultaCepService: ConsultaCepService,
    private verificarEmailService: VerificaEmailService
  ) {}

  ngOnInit() {
    this.verificarEmailService.verificarEmail('email@email.com.br').subscribe();
    this.estados = this.dropDownService.getEstadosBr();
    this.cargos = this.dropDownService.getCargos();
    this.tecnologias = this.dropDownService.getTecnologias();
    this.newsletters = this.dropDownService.getNewsLetter();

    // this.dropDownService.getEstadosBr().subscribe((dados) => {
    //   console.log(dados);
    //   this.estados = dados;
    // })
    // this.formulario = new FormGroup({
    //   nome: new FormControl(null),
    //   email: new FormControl(null),
    // });

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(5)]],
      email: [null, [Validators.required, Validators.email], [this.validarEmail.bind(this)]],
      confirmarEmail: [null, [FormValidation.equalsTo('email')]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidation.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null],
      tecnologias: [null],
      newsletter: ["s"],
      termos: [null, Validators.pattern("true")],
      frameworks: this.buildFrameworks()
    });
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(values, FormValidation.requiredMinCheckBox(1));
    // return [
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    //   new FormControl(false),
    // ]Formulários reativos: Validação Customizada (FormArray Checkboxes)
  }



  onSubmit() {
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => (v ? this.frameworks[i] : null))
        .filter(v => v !== null)
    });

    if (this.formulario.valid) {
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
    } else {
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo).valid &&
      (this.formulario.get(campo).touched || this.formulario.get(campo).dirty)
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

    if (cep != null && cep !== "") {
      this.consultaCepService.consultaCEP(cep).subscribe(dados => {
        this.populaDadosForm(dados);
      });
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

  setarCargo() {
    const cargo = { nome: "Dev", nivel: "Pleno", desc: "Dev Pl" };
    this.formulario.get("cargo").setValue(cargo);
  }

  compararCargos(obj1, obj2) {
    return obj1 && obj2
      ? obj1.nome === obj2.nome && obj1.nivel === obj2.nivel
      : obj1 === obj2;
  }

  setarTecnologia() {
    this.formulario.get("tecnologias").setValue(["python", "csharp", "java"]);
  }

  validarEmail(formControl: FormControl) {
    return this.verificarEmailService.verificarEmail(formControl.value)
    .pipe(
      map(emailExiste => emailExiste ? { emailInvalido: true} : null)
    );
  }
}
