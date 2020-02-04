import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IEstadosBr } from '../models/iestados-br.model';

@Injectable()
export class DropdownService {
  constructor(private http: HttpClient) {}

  getEstadosBr() {
    return this.http.get<IEstadosBr[]>('assets/dados/estadosbr.json');
  }
}
