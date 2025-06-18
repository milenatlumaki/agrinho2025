let pinheiros = []; // Array para armazenar todos os objetos Pinheiro plantados
let pontuacao = 0; // Contador de pinheiros plantados
let tempoLimite = 30; // Tempo em segundos para o jogo
let tempoInicial; // Armazena o momento em que o jogo começou (em milissegundos)
let metaPinheiros = 100; // A meta de pinheiros a serem plantados para a vitória

let estadoJogo = 'inicio'; // Estados do jogo: 'inicio', 'jogando', 'ganhou', 'perdeu'

function setup() {
  createCanvas(900, 600); // Cria a tela do jogo com 900 pixels de largura e 600 de altura
  // Não chamamos iniciarJogo() aqui, para exibir a tela de início primeiro
}

function draw() {
  // O background é redesenhado a cada frame para "limpar" a tela
  background(135, 206, 235); // Cor do céu (azul claro)

  // Desenha o "chão" verde escuro
  fill(50, 80, 50); // Verde escuro, adequado para florestas de pinheiros
  rect(0, height * 0.8, width, height * 0.2); // Retângulo para o chão (20% da altura do canvas)

  // Lógica principal baseada no estado do jogo
  if (estadoJogo === 'inicio') {
    telaInicio(); // Mostra a tela de início
  } else if (estadoJogo === 'jogando') {
    // Desenha todos os pinheiros que foram plantados
    for (let i = 0; i < pinheiros.length; i++) {
      pinheiros[i].mostrar();
    }

    // Exibe a pontuação e a meta
    fill(0); // Cor do texto preta
    textSize(24);
    textAlign(LEFT, TOP); // Alinha o texto no canto superior esquerdo
    text(`Pinheiros Plantados: ${pontuacao}/${metaPinheiros}`, 10, 10);

    // Calcula e exibe o tempo restante
    let tempoAtual = millis(); // Tempo atual em milissegundos desde o início do sketch
    let tempoDecorrido = (tempoAtual - tempoInicial) / 1000; // Converte para segundos
    let tempoRestante = tempoLimite - tempoDecorrido;

    fill(0);
    text(`Tempo: ${nf(tempoRestante, 0, 1)}s`, 10, 40); // nf formata o número com 1 casa decimal

    // Verifica as condições para mudar o estado do jogo (vitória ou derrota)
    if (tempoRestante <= 0) { // Se o tempo acabou
      if (pontuacao >= metaPinheiros) {
        estadoJogo = 'ganhou'; // Vitória se a meta foi atingida
      } else {
        estadoJogo = 'perdeu'; // Derrota se a meta não foi atingida
      }
    } else if (pontuacao >= metaPinheiros) {
      estadoJogo = 'ganhou'; // Vitória instantânea se a meta for atingida antes do tempo
    }
  } else if (estadoJogo === 'ganhou') {
    telaFimDeJogo("VITÓRIA!", `Você plantou ${pontuacao} pinheiros a tempo!`, "Parabéns! O bosque gigante está completo!");
  } else if (estadoJogo === 'perdeu') {
    telaFimDeJogo("FIM DE JOGO!", `Você plantou ${pontuacao} pinheiros. Não atingiu a meta de ${metaPinheiros}.`, "Tente novamente para completar o desafio.");
  }
}

function mousePressed() {
  if (estadoJogo === 'inicio') {
    iniciarJogo(); // Inicia o jogo ao clicar na tela de início
  } else if (estadoJogo === 'jogando') {
    // Permite plantar apenas na área do "chão"
    if (mouseY > height * 0.75) {
      let novoPinheiro = new Pinheiro(mouseX, mouseY); // Cria um novo objeto Pinheiro
      pinheiros.push(novoPinheiro); // Adiciona o pinheiro ao array
      pontuacao++; // Incrementa a pontuação
    }
  } else { // Se o estado for 'ganhou' ou 'perdeu'
    iniciarJogo(); // Reinicia o jogo ao clicar na tela de fim de jogo
  }
}

// Classe Pinheiro: Define como cada pinheiro é desenhado e suas propriedades
class Pinheiro {
  constructor(x, y) {
    this.x = x; // Posição X do pinheiro
    this.y = y; // Posição Y do pinheiro (base do tronco)
    this.alturaTronco = random(40, 70); // Altura aleatória do tronco
    this.larguraTronco = random(8, 18); // Largura aleatória do tronco
    this.alturaCopaBase = random(50, 90); // Altura da parte inferior da copa
    this.alturaCopaTopo = random(20, 40); // Altura da parte superior da copa
    this.larguraCopaBase = random(50, 100); // Largura da base da copa
    // Cor aleatória para a copa (tons de verde escuro para simular pinheiros)
    this.corCopa = color(random(0, 80), random(120, 200), random(0, 80));
  }

  mostrar() {
    noStroke(); // Não desenha contorno

    // Desenha o tronco (retângulo marrom)
    fill(100, 60, 30); // Cor marrom
    rect(this.x - this.larguraTronco / 2, this.y - this.alturaTronco, this.larguraTronco, this.alturaTronco);

    // Desenha a copa do pinheiro usando três triângulos sobrepostos
    fill(this.corCopa);

    // Triângulo inferior da copa
    triangle(
      this.x - this.larguraCopaBase / 2, this.y - this.alturaTronco,
      this.x + this.larguraCopaBase / 2, this.y - this.alturaTronco,
      this.x, this.y - this.alturaTronco - this.alturaCopaBase
    );

    // Triângulo médio da copa (um pouco menor e mais acima)
    let larguraCopaMedia = this.larguraCopaBase * 0.8;
    let alturaCopaMedia = this.alturaCopaBase * 0.8;
    triangle(
      this.x - larguraCopaMedia / 2, this.y - this.alturaTronco - this.alturaCopaBase * 0.6,
      this.x + larguraCopaMedia / 2, this.y - this.alturaTronco - this.alturaCopaBase * 0.6,
      this.x, this.y - this.alturaTronco - this.alturaCopaBase - alturaCopaMedia * 0.8
    );

    // Triângulo superior da copa (o mais fino e no topo, formando a ponta)
    let larguraCopaTopo = this.larguraCopaBase * 0.6;
    let alturaCopaTopo = this.alturaCopaBase * 0.6;
    triangle(
      this.x - larguraCopaTopo / 2, this.y - this.alturaTronco - this.alturaCopaBase * 1.1,
      this.x + larguraCopaTopo / 2, this.y - this.alturaTronco - this.alturaCopaBase * 1.1,
      this.x, this.y - this.alturaTronco - this.alturaCopaBase - alturaCopaTopo * 1.2 - this.alturaCopaTopo
    );
  }
}

// Função para iniciar ou reiniciar o jogo
function iniciarJogo() {
  pinheiros = []; // Limpa todos os pinheiros plantados
  pontuacao = 0; // Zera a pontuação
  tempoInicial = millis(); // Reseta o cronômetro
  estadoJogo = 'jogando'; // Define o estado do jogo para "jogando"
}

// Função para exibir a tela de início do jogo
function telaInicio() {
  background(200, 220, 255); // Fundo azul claro para a tela de início
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("O Desafio Final do Bosque de Pinheiros", width / 2, height / 2 - 80);
  textSize(24);
  text(`Plante ${metaPinheiros} pinheiros em ${tempoLimite} segundos!`, width / 2, height / 2 - 20);
  textSize(18);
  text("Clique para começar", width / 2, height / 2 + 50);
}

// Função para exibir as telas de fim de jogo (vitória ou derrota)
function telaFimDeJogo(titulo, mensagem1, mensagem2) {
  background(220, 240, 255); // Fundo suave para a tela final
  fill(0); // Cor preta para o texto
  textSize(48);
  textAlign(CENTER, CENTER);
  text(titulo, width / 2, height / 2 - 80);
  textSize(28);
  text(mensagem1, width / 2, height / 2 - 20);
  textSize(20);
  text(mensagem2, width / 2, height / 2 + 30);
  textSize(20);
  text("Clique para jogar novamente!", width / 2, height / 2 + 80);
}