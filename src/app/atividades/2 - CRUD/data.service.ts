import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  private novoUsuario = new Subject<any>();
  usuarioAdicionado = this.novoUsuario.asObservable();

  private editUsuario = new Subject<any>();
  updateUsuario = this.editUsuario.asObservable();

  constructor() { }
  
  cadastrarUsuario(usuario: any) {
    console.log("Ativando Service cadastrarUsuario");    
    this.novoUsuario.next(usuario);   
  }  

  atualizarUsuario(usuario: any) {
    console.log("Ativando Service atualizarUsuario");
    this.editUsuario.next(usuario);
  }
}
