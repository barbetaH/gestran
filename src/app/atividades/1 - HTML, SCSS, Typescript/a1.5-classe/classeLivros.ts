// Classe Publicacao.
class Publicacao {    
    protected titulo: string;
    protected autor: string;
    protected anoPublicacao: number;
        
    constructor($titulo: string, $autor: string, $anoPublicacao: number) {
        this.titulo = $titulo;
        this.autor = $autor;
        this.anoPublicacao = $anoPublicacao;
    }
        
    descricao(): string {
        return `Título: ${this.titulo}, Autor: ${this.autor}, Ano de Publicação: ${this.anoPublicacao}`;
    }
}
  
// Classe Livro.
class Livro extends Publicacao {
    private ISBN: string;
    
    constructor($titulo: string, $autor: string, $anoPublicacao: number, $ISBN: string) {
        super($titulo, $autor, $anoPublicacao); 
        this.ISBN = $ISBN;
    }
    
    descricao(): string {
        return `${super.descricao()}, ISBN: ${this.ISBN}`;
    }
}
  
// Classe Periodico.
class Periodico extends Publicacao {    
    private ISSN: string;
    
    constructor($titulo: string, $autor: string, $anoPublicacao: number, $ISSN: string) {
        super($titulo, $autor, $anoPublicacao);
        this.ISSN = $ISSN;
    }
    
    descricao(): string {
        return `${super.descricao()}, ISSN: ${this.ISSN}`;
    }
}