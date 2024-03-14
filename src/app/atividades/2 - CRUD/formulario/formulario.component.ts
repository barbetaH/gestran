import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from '../data.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})

export class FormularioComponent implements OnInit {  
  
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,    
    private dataService: DataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }  

  form = new FormGroup({
    nome:  new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.minLength(6), Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    cep:   new FormControl('', [Validators.required, Validators.minLength(8)]),
    logradouro: new FormControl({value: '', disabled: true}),
    id: new FormControl({value: '', disabled: true}),
  })

  ngOnInit(): void {             
    // Dados para atualização do usuário.       
    if (this.data) {
      this.atualizarUsuario();      
    }
  }  

  // Buscar por CEP informado.
  buscarCep(event: any): void {    
    const cep = this.form.controls.cep.value;    
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        // Uma vez o CEP válido, popular input logradouro.
        this.form.controls['logradouro'].setValue(data.logradouro);        
      },
      error: (error) => {
        // Cep Inválido.
        alert("CEP Inválido");
      }
    });
  } 

  // Receber dados do usuário para atualização.
  atualizarUsuario(){
    this.form.controls['nome'].setValue(this.data.nome);       
    this.form.controls['email'].setValue(this.data.email);       
    this.form.controls['senha'].setValue(this.data.senha);       
    this.form.controls['cep'].setValue(this.data.cep);       
    this.form.controls['logradouro'].setValue(this.data.logradouro);  
    this.form.controls['id'].setValue(this.data.id)    
  }

  // Validar Form.
  salvarForm(){            
    if (!this.form.valid) {       
      // Form preenchido errôneamente.  
      alert("Verifique os campos preenchidos.");  
    } else { 
      // Form preenchido corretamente. 
      // Caso o objeto resposável pela a edição do usuário esteja populada ou não.             
      if (this.data != null) { 
        // Editar Usuário.                   
        this.dataService.atualizarUsuario(this.form.getRawValue())
      } else {
        // Novo Usuário.                   
        this.dataService.cadastrarUsuario(this.form.getRawValue());      
      }      
      this.dialog.closeAll(); 
    }
  }
}