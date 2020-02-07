import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { map, tap, distinctUntilChanged, switchMap } from "rxjs/operators";

import { DropdownService } from "../share/service/dropdown.service";
import { IEstadosBr } from "../share/models/iestados-br.model";
import { ConsultaCepService } from "../share/service/consulta-cep.service";
import { Observable } from "rxjs/internal/Observable";
import { FormValidation } from "../share/form-validation";
import { VerificaEmailService } from "../share/service/verifica-email.service";
import { empty } from "rxjs/internal/observable/empty";
import { BaseFormComponent } from "../share/base-form/base-form.component";

@Component({
  selector: "app-data-form",
  templateUrl: "./data-form.component.html",
  styleUrls: ["./data-form.component.css"]
})
export class DataFormComponent extends BaseFormComponent implements OnInit {
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
  ) {
    super();
  }

  ngOnInit() {
    this.verificarEmailService.verificarEmail("email@email.com.br").subscribe();
    this.estados = this.dropDownService.getEstadosBr();
    this.cargos = this.dropDownService.getCargos();
    this.tecnologias = this.dropDownService.getTecnologias();
    this.newsletters = this.dropDownService.getNewsLetter();
    this.formulario = this.formBuilder.group({
      nome: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(5)]
      ],
      email: [
        null,
        [Validators.required, Validators.email],
        [this.validarEmail.bind(this)]
      ],
      confirmarEmail: [null, [FormValidation.equalsTo("email")]],
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

    this.formulario
      .get("endereco.cep")
      .statusChanges.pipe(
        distinctUntilChanged(),
        tap(value => console.log(`Status do CEP: ${value}`)),
        switchMap(status =>
          status === "VALID"
            ? this.consultaCepService.consultaCEP(
                this.formulario.get("endereco.cep").value
              )
            : empty()
        )
      )
      .subscribe(dados => (dados ? this.populaDadosForm(dados) : {}));
  }

  buildFrameworks() {
    const values = this.frameworks.map(v => new FormControl(false));
    return this.formBuilder.array(
      values,
      FormValidation.requiredMinCheckBox(1)
    );
  }

  submit() {
    let valueSubmit = Object.assign({}, this.formulario.value);

    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks
        .map((v, i) => (v ? this.frameworks[i] : null))
        .filter(v => v !== null)
    });
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

  consultaCEP() {
    let cep = this.formulario.get("endereco.cep").value;

    if (cep != null && cep !== "") {
      this.consultaCepService.consultaCEP(cep).subscribe(dados => {
        this.populaDadosForm(dados);
      });
    }
  }

  populaDadosForm(dados) {
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
    return this.verificarEmailService
      .verificarEmail(formControl.value)
      .pipe(map(emailExiste => (emailExiste ? { emailInvalido: true } : null)));
  }
}
