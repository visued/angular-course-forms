import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IEstadosBr } from '../models/iestados-br.model';
import { ICidadesBr } from '../models/icidades-br.models';
import { map } from 'rxjs/operators';

@Injectable()
export class DropdownService {
  constructor(private http: HttpClient) {}

  getEstadosBr() {
    return this.http.get<IEstadosBr[]>('assets/dados/estadosbr.json');
  }

  getCidadesBr(idEstado: number) {
    return this.http.get<ICidadesBr[]>('assets/dados/cidadesbr.json')
    .pipe(
      map((cidades: ICidadesBr[]) => cidades.filter(c => c.estado == idEstado))
    );
  }

  getCargos() {
    return [
      {nome: 'Dev', nivel: 'Junior', desc: 'Dev Jr'},
      {nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'},
      {nome: 'Dev', nivel: 'Senior', desc: 'Dev Sr'},
    ]
  }

  getTecnologias() {
    return [
      {nome: 'java', desc: 'Java'},
      {nome: 'python', desc: 'Python'},
      {nome: 'javascript', desc: 'Javascript'},
      {nome: 'php', desc: 'PHP'},
      {nome: 'csharp', desc: 'C#'},
    ]
  }

  getNewsLetter() {
    return [
      {nome: 's', desc: 'Sim'},
      {nome: 'n', desc: 'Não'}

    ]
  }
}
