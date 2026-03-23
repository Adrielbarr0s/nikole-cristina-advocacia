import { Component, AfterViewInit, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  mobileOpen: boolean = false;
  isScrolled: boolean = false;

  // Variável que controla o banner de cookies
  showCookieBanner: boolean = true;

  // ====== NOVA VARIÁVEL: Controla o Pop-up de Termos ======
  showTermosModal: boolean = false;

  constructor(private el: ElementRef) { }

  // Verifica se o usuário já aceitou os cookies antes
  ngOnInit() {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted === 'true') {
      this.showCookieBanner = false;
    }
  }

  // Esconde o banner e salva a preferência
  aceitarCookies() {
    this.showCookieBanner = false;
    localStorage.setItem('cookiesAccepted', 'true');
  }

  // ====== NOVAS FUNÇÕES: Abrir e Fechar os Termos ======
  abrirTermos(event: Event) {
    event.preventDefault(); // Impede que o link jogue a tela para o topo
    this.showTermosModal = true;
    document.body.style.overflow = 'hidden'; // Trava a barra de rolagem do fundo
  }

  fecharTermos() {
    this.showTermosModal = false;
    document.body.style.overflow = 'auto'; // Libera a rolagem do site novamente
  }

  // 1. Navbar Inteligente: Detecta o scroll para mudar o visual da barra
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngAfterViewInit() {
    // 2. Animações de Scroll (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, {
      threshold: 0.15
    });

    const hiddenElements = this.el.nativeElement.querySelectorAll('.reveal');
    hiddenElements.forEach((el: any) => observer.observe(el));
  }

  // 3. Scroll Suave para links internos (Melhor UX)
  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    this.mobileOpen = false; // Fecha o menu mobile se estiver aberto

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // 4. WhatsApp Inteligente com Saudação por Horário
  getWhatsAppLink(): string {
    const numero = '5561998056868';
    const horaAtual = new Date().getHours();
    let saudacao = 'Olá';

    if (horaAtual >= 5 && horaAtual < 12) {
      saudacao = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
      saudacao = 'Boa tarde';
    } else {
      saudacao = 'Boa noite';
    }

    const mensagem = `${saudacao}, Dra. Nikole Cristina! Estava no seu site e gostaria de tirar uma dúvida.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  }

  // 5. Envio do Formulário de Contato
  enviarMensagem(form: any) {
    if (form.valid) {
      // Extrai os dados que o cliente digitou no site
      const { nome, email, telefone, mensagem } = form.value;
      const numero = '5561998056868'; // O número da Dra. Nikole

      // Monta o texto bonitinho em negrito para chegar no WhatsApp dela
      const texto = `Olá, Dra. Nikole!%0A%0A*Nova solicitação de contato via site:*%0A%0A*Nome:* ${nome}%0A*E-mail:* ${email}%0A*WhatsApp:* ${telefone}%0A*Problema:* ${mensagem}`;

      // Abre o WhatsApp com a mensagem pronta
      window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');

      // Limpa os campos do formulário após o envio para dar um aspecto profissional
      form.reset();
    } else {
      // Se o cliente esquecer de preencher algo
      alert('Por favor, preencha todos os campos para continuar.');
    }
  }

  // Adicione esta função dentro da classe AppComponent
  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // Remove tudo que não é número

    if (valor.length > 11) valor = valor.substring(0, 11); // Limita a 11 dígitos

    // Aplica a máscara (00) 00000-0000
    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }

    event.target.value = valor;
  }
}