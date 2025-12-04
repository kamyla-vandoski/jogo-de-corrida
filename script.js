const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

// Configurações da Pista
const PISTA_LARGURA = 300;
const PLAYER_LARGURA = 40;
const POSICOES_FAIXA = [20, 130, 240]; // 3 posições (esquerda, centro, direita)
let jogadorFaixa = 1; // Começa na faixa do meio (índice 1)

let gameSpeed = 3; 
let score = 0;
let gameOver = false;

// --- 1. Movimento Lateral do Jogador ---

// Define a posição inicial do jogador
player.style.left = POSICOES_FAIXA[jogadorFaixa] + 'px';

function movePlayer(direcao) {
    if (gameOver) return;
    
    // Calcula o novo índice da faixa
    let novaFaixa = jogadorFaixa + direcao;

    // Garante que o jogador permaneça dentro dos limites
    if (novaFaixa >= 0 && novaFaixa < POSICOES_FAIXA.length) {
        jogadorFaixa = novaFaixa;
        // Aplica a nova posição via CSS
        player.style.left = POSICOES_FAIXA[jogadorFaixa] + 'px';
    }
}

// Escuta as teclas A e D ou Setas Esquerda/Direita
document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'ArrowLeft') {
        movePlayer(-1); // Move para a esquerda
    } else if (event.key === 'd' || event.key === 'ArrowRight') {
        movePlayer(1); // Move para a direita
    }
});

// --- 2. Criação e Movimento de Obstáculos ---

function createObstacle() {
    if (gameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    
    // Escolhe aleatoriamente uma das 3 faixas para o obstáculo
    const faixaObstaculoIndex = Math.floor(Math.random() * POSICOES_FAIXA.length);
    const obstacleLeft = POSICOES_FAIXA[faixaObstaculoIndex] - 10; // Ajuste fino
    obstacle.style.left = obstacleLeft + 'px';
    
    // Armazena a faixa para fácil checagem de colisão
    obstacle.dataset.faixa = faixaObstaculoIndex; 
    
    gameContainer.appendChild(obstacle);
    let obstacleTop = -50; // Posição inicial (acima)

    // Move o obstáculo para baixo
    let moveInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(moveInterval);
            return;
        }

        obstacleTop += gameSpeed;
        obstacle.style.top = obstacleTop + 'px';

        // 1. Colisão
        // Checa se o obstáculo está na mesma faixa E se está na altura do jogador
        if (obstacle.dataset.faixa == jogadorFaixa) {
            if (obstacleTop > 530 && obstacleTop < 580) { // Altura de colisão
                clearInterval(moveInterval);
                endGame();
            }
        }

        // 2. Obstáculo saiu da tela (ponto!)
        if (obstacleTop > 600) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreDisplay.textContent = `Pontos: ${score}`;
            gameSpeed += 0.05; // Aumenta a velocidade sutilmente
        }

    }, 20);
}

// Inicia a criação de obstáculos a cada 1.2 segundos
let obstacleInterval = setInterval(createObstacle, 1200);

// --- 3. Fim de Jogo ---

function endGame() {
    gameOver = true;
    clearInterval(obstacleInterval);
    // Para todos os intervalos de movimento de obstáculos existentes
    document.querySelectorAll('.obstacle').forEach(obs => obs.remove()); 
    
    alert(`Fim de Jogo! Você desviou de ${score} obstáculos.`);
    location.reload(); 
}