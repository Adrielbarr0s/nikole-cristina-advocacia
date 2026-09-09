import {
  Component,
  AfterViewInit,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, NgForm } from '@angular/forms';

export interface AreaAtuacao {
  titulo: string;
  subtitulo: string;
  descricao: string;
  servicos: string[];
  conclusao?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  mobileOpen = false;
  isScrolled = false;

  // Banner de consentimento / privacidade
  showCookieBanner = true;

  // Modais
  showTermosModal = false;
  showAreaModal = false;
  areaSelecionada: AreaAtuacao | null = null;

  // Estado do formulário de contato
  formEnviado = false;
  formErro = '';
  whatsappLinkTemporario = '';

  private observer?: IntersectionObserver;
  private readonly whatsappNumero = '5561998056868';

  // Conteúdo estruturado e tipado de cada área jurídica
  detalhesAreas: Record<string, AreaAtuacao> = {
    civil: {
      titulo: 'Direito Civil',
      subtitulo: 'Proteção patrimonial e resolução estratégica de conflitos',
      descricao:
        'O Direito Civil é a base das relações em sociedade. Nossa atuação visa proteger seu patrimônio, sua imagem e a segurança dos seus contratos.',
      servicos: [
        'Elaboração, análise e revisão criteriosa de contratos.',
        'Ações de indenização por danos morais e materiais.',
        'Cobranças judiciais e extrajudiciais eficazes.',
        'Resolução de litígios de vizinhança, posse e propriedade.'
      ],
      conclusao:
        'Buscamos sempre a resolução mais rápida e vantajosa, priorizando acordos favoráveis que evitam desgaste e custos processuais desnecessários.'
    },
    familia: {
      titulo: 'Direito de Família',
      subtitulo: 'Sensibilidade, discrição e segurança jurídica',
      descricao:
        'Sabemos que questões familiares envolvem laços afetivos e exigem conhecimento técnico apurado aliado à sensibilidade e máxima discrição.',
      servicos: [
        'Divórcio consensual e litigioso (judicial e extrajudicial em cartório).',
        'Pensão alimentícia: fixação, revisão, exoneração e execução de débitos.',
        'Guarda de menores, tutela e regulamentação de convivência e visitas.',
        'Inventários, partilha de bens, testamentos e planejamento sucessório.'
      ],
      conclusao:
        'Priorizamos a proteção dos direitos dos envolvidos, o bem-estar dos filhos e a estabilidade emocional e financeira da família.'
    },
    trabalho: {
      titulo: 'Direito do Trabalho',
      subtitulo: 'Defesa incisiva dos direitos nas relações de emprego',
      descricao:
        'Atuamos de forma estratégica na defesa dos direitos trabalhistas, garantindo que a legislação seja rigorosamente cumprida.',
      servicos: [
        'Reconhecimento de vínculo empregatício sem registro em carteira.',
        'Cobrança de horas extras, adicionais (insalubridade/periculosidade) e verbas rescisórias.',
        'Ações indenizatórias por assédio moral e doenças ocupacionais.',
        'Reversão de demissão arbitrária por justa causa.'
      ],
      conclusao:
        'Atuação técnica e combativa com análise detalhada de documentos e provas para assegurar ao trabalhador o que lhe pertence por direito.'
    },
    previdenciario: {
      titulo: 'Direito Previdenciário',
      subtitulo: 'Planejamento e conquista de benefícios junto ao INSS',
      descricao:
        'Garantir seu futuro e a concessão correta dos seus benefícios é prioridade. Lidamos com toda a complexidade técnica e burocrática do INSS para você não se preocupar.',
      servicos: [
        'Planejamento Previdenciário completo (saiba a data ideal e como obter o melhor valor).',
        'Aposentadorias por idade, tempo de contribuição e especial (atividades insalubres/periculosas).',
        'Benefícios por incapacidade: auxílio por incapacidade temporária (auxílio-doença) e aposentadoria por invalidez.',
        'Benefício de Prestação Continuada (BPC/LOAS) para idosos e pessoas com deficiência.'
      ],
      conclusao:
        'Análise aprofundada de tempo de contribuição e contestação técnica ágil de negativas e cortes indevidos do INSS.'
    }
  };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        if (cookiesAccepted === 'true') {
          this.showCookieBanner = false;
        }
      } catch {
        // Fallback em caso de cookies desabilitados no navegador
      }
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
            }
          });
        },
        { threshold: 0.05 }
      );

      const hiddenElements = this.el.nativeElement.querySelectorAll('.reveal');
      hiddenElements.forEach((element: Element) => this.observer?.observe(element));
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  aceitarCookies() {
    this.showCookieBanner = false;
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('cookiesAccepted', 'true');
      } catch {
        // Silencioso se storage indisponível
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscapePressed() {
    if (this.showTermosModal) {
      this.fecharTermos();
    }
    if (this.showAreaModal) {
      this.fecharModalArea();
    }
    if (this.mobileOpen) {
      this.mobileOpen = false;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }

  abrirTermos(event?: Event) {
    if (event) event.preventDefault();
    this.showTermosModal = true;
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  fecharTermos() {
    this.showTermosModal = false;
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  abrirModalArea(areaKey: string) {
    this.areaSelecionada = this.detalhesAreas[areaKey] ?? null;
    this.showAreaModal = true;
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    }
  }

  fecharModalArea() {
    this.showAreaModal = false;
    setTimeout(() => {
      this.areaSelecionada = null;
    }, 300);
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  scrollTo(sectionId: string, event: Event) {
    event.preventDefault();
    this.mobileOpen = false;

    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }

  getWhatsAppLink(): string {
    const horaAtual = new Date().getHours();
    let saudacao = 'Olá';

    if (horaAtual >= 5 && horaAtual < 12) {
      saudacao = 'Bom dia';
    } else if (horaAtual >= 12 && horaAtual < 18) {
      saudacao = 'Boa tarde';
    } else {
      saudacao = 'Boa noite';
    }

    const mensagem = `${saudacao}, Dra. Nikole Cristina! Estava no seu site e gostaria de agendar uma consulta jurídica.`;
    return `https://wa.me/${this.whatsappNumero}?text=${encodeURIComponent(mensagem)}`;
  }

  enviarMensagem(form: NgForm) {
    if (!form.valid) {
      this.formErro = 'Por favor, preencha todos os campos obrigatórios corretamente.';
      return;
    }

    this.formErro = '';
    const { nome, email, telefone, mensagem } = form.value;

    const textoFormatado =
      `Olá, Dra. Nikole!\n\n` +
      `*Nova solicitação de contato via site:*\n\n` +
      `*Nome:* ${nome?.trim()}\n` +
      `*E-mail:* ${email?.trim()}\n` +
      `*WhatsApp:* ${telefone?.trim()}\n` +
      `*Problema:* ${mensagem?.trim()}`;

    const url = `https://wa.me/${this.whatsappNumero}?text=${encodeURIComponent(textoFormatado)}`;
    this.whatsappLinkTemporario = url;
    this.formEnviado = true;

    if (isPlatformBrowser(this.platformId)) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }

    form.resetForm();
  }

  formatarTelefone(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (valor.length > 5) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (valor.length > 0) {
      valor = valor.replace(/^(\d*)/, '($1');
    }

    input.value = valor;
  }
}