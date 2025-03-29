import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-acomodacao-list',
  imports: [ButtonModule],
  templateUrl: './acomodacao-list.component.html',
  standalone: true,
})
export class AcomodacaoListComponent {
  // Exemplo de dados de acomodações
  acomodacoes = [
    {
      id: 1,
      nome: 'Hotel Maravilha',
      descricao: 'Localização central, Wi-Fi grátis, piscina.',
      preco: 200,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },
    {
      id: 2,
      nome: 'Pousada Tranquila',
      descricao: 'Vista para o mar, café da manhã incluso.',
      preco: 180,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },
    {
      id: 3,
      nome: 'Resort Relax',
      descricao: 'Pacotes exclusivos, spa e fitness.',
      preco: 500,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },
    {
      id: 1,
      nome: 'Hotel Maravilha',
      descricao: 'Localização central, Wi-Fi grátis, piscina.',
      preco: 200,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },
    {
      id: 2,
      nome: 'Pousada Tranquila',
      descricao: 'Vista para o mar, café da manhã incluso.',
      preco: 180,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },
    {
      id: 3,
      nome: 'Resort Relax',
      descricao: 'Pacotes exclusivos, spa e fitness.',
      preco: 500,
      imagemUrl: 'https://via.placeholder.com/500x300',
    },    
  ];

  reservar(acomodacao: any) {
    // Lógica para reservar a acomodação
    console.log(`Reserva solicitada para: ${acomodacao.nome}`);
  }
}
