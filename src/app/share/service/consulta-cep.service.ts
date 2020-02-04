import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { IEstadosBr } from '../models/iestados-br.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string) {
    // Nova variável CEP somento com digitos númericos.
    cep = cep.replace(/\D/g, "");

    if (cep !== '') {
      // Expressão regular para validar CEP.
      const validacep = /^[0-9]{8}$/;

      // Valida o formato do CEP.
      if (validacep.test(cep)) {
        return this.http.get<IEstadosBr>(`//viacep.com.br/ws/${cep}/json`);
      }
    }

    return of({});
  }

}
