import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { FormularioComponent } from './formulario/formulario.component';
import { FormControl } from '@angular/forms';
import { DataService } from './data.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {      

  constructor(
    private dialog: MatDialog,
    private dataService: DataService    
  ) {}  

  // Subject que receberá o termo da pesquisa.
  termoPesquisa = new Subject<string>();

  filtro = new FormControl()    
   
  // Configuração tabela de usuarios.
  displayedColumns: string[] = ['actions', 'nome', 'email', 'senha', 'cep', 'logradouro', 'id'];
  usuarios = [{ nome: "Teste1", email: "teste@email1.com", senha: "1234", cep: "80250104", logradouro: "Rua teste", id: 1 }]    
  
  // Popular tabela.
  dataSource = new MatTableDataSource<any>(this.usuarios);

  ngOnInit(): void {     

    // Filtro - Pesquisa.
    this.termoPesquisa.pipe(
      // Aguardar 300ms após o usuário ter parado de digitar.
      debounceTime(300), 
      // Executa a pesquisa apenas se os termos da mesma mudarem.
      distinctUntilChanged(), 
      // Para para letras minúsculas o valor da pesquisa.
      map(term => term.toLowerCase())).subscribe(term => {
      // Realiza o refinamento do grid.  
      this.dataSource.filter = term;
    });

    // Add novo usuário.
    this.novoUsuario();

    // Atualizar usuário.
    this.atualizarUsuario();
  }

  filtrar(event: any) {
    // Termo da pesquisa.
    const pesquisa = this.filtro.value;
    // Envio do termo da pesquisa para o Subject.
    this.termoPesquisa.next(pesquisa);

    console.log("filtrando...") // Não remover essa linha
  } 

  // Cadastrar, efetivamente, novo usuário.
  novoUsuario(){
    this.dataService.usuarioAdicionado.subscribe(objeto => {          
      // Atribuir id ao novo usuario.
      const id = this.usuarios.length + 1;
      objeto['id'] = id;      
      // Atualizar array de usuarios.
      this.usuarios.push(objeto); 
      // Refresh table. 
      this.dataSource = new MatTableDataSource<any>(this.usuarios);          
    });
  }

  // Atualizar Usuário.
  atualizarUsuario() {
    this.dataService.updateUsuario.subscribe(objeto => {     
      // Procurar no array <usuarios> pelo o usuário que será atualizado. 
      const index = this.usuarios.findIndex(usuario => usuario.id === objeto.id);
      // Caso usuário encontrado. 
      if (index !== -1) {
        // Atualizar efetivamente o usuário. 
        this.usuarios[index] = objeto;
        // Refresh table. 
        this.dataSource = new MatTableDataSource<any>(this.usuarios);   
      }            
    })
  }

  adicionar() {
    this.dialog.open(FormularioComponent)
  }

  editar(pessoa: Pessoa) {        
    // Popular modal com os dados do usuario selecionado.        
    this.dialog.open(FormularioComponent, {
      data: pessoa,
    });
  }

  remover(pessoa: Pessoa) {         
    if (!confirm(`Deseja remover a pessoa ${pessoa.nome}`)) 
    return
    // Procurar e remover usuário.
    const refreshArray = this.usuarios.filter(usuario => usuario.id !== pessoa.id)        
    // Criado novo array sem o usuario deletado e atribuído esse array ao array antigo.
    this.usuarios = refreshArray;
    // Atualizar grid com os usuários restantes.
    this.dataSource = new MatTableDataSource<any>(this.usuarios);      
    alert("removido com sucesso!")    
  }
}

class Pessoa {
  constructor(
    public nome: string,    
    public id: number,    
  ) { }
}
