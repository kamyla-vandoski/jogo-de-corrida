const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');

let isJumping = false;
let gameSpeed = 5; // Velocidade inicial do movimento do obstáculo
let score = 0;
let gameOver = false;

// --- FUNÇÃO DE PULO DO JOGADOR ---
function jump() {
    if (isJumping) return;
    isJumping = true;

    // Sobe (Pulo)
    let upInterval = setInterval(() => {
        let playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
        if (playerBottom < 150) { // Altura máxima do pulo
            player.style.bottom = (playerBottom + 10) + 'px';
        } else {
            clearInterval(upInterval);

            // Desce (Gravidade)
            let downInterval = setInterval(() => {
                let playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue('bottom'));
                if (playerBottom > 0) { // Volta para o chão (bottom = 0)
                    player.style.bottom = (playerBottom - 10) + 'px';
                } else {
                    clearInterval(downInterval);
                    isJumping = false;
                }
            }, 20);
        }
    }, 20);
}

// Escuta a tecla SPACE para pular
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping && !gameOver) {
        jump();
    }
});

// --- FUNÇÃO PARA CRIAR E MOVER OBSTÁCULOS ---
function createObstacle() {
    if (gameOver) return;

    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.height = (Math.random() * 40 + 20) + 'px'; // Altura variável (20 a 60px)
    obstacle.style.bottom = '0px'; 
    gameContainer.appendChild(obstacle);

    let obstaclePosition = 600; // Posição inicial (fora da tela)

    // Move o obstáculo
    let moveInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(moveInterval);
            return;
        }

        obstaclePosition -= gameSpeed;
        obstacle.style.right = obstaclePosition + 'px';

        // 1. Colisão
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Checagem de colisão simples (se as caixas se sobrepõem)
        if (
            playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top
        ) {
            clearInterval(moveInterval);
            endGame();
        }

        // 2. Obstáculo saiu da tela
        if (obstaclePosition <= -20) {
            clearInterval(moveInterval);
            obstacle.remove();
            score++;
            scoreDisplay.textContent = `Pontos: ${score}`;
            gameSpeed += 0.1; // Aumenta a dificuldade
        }

    }, 20);
}

// Cria um novo obstáculo em um intervalo regular
let obstacleInterval = setInterval(createObstacle, 1500); // Cria um novo a cada 1.5s

// --- FUNÇÃO DE FIM DE JOGO ---
function endGame() {
    gameOver = true;
    clearInterval(obstacleInterval);
    document.removeEventListener('keydown', jump);
    alert(`Fim de Jogo! Sua pontuação foi: ${score}`);
    location.reload(); // Recarrega a página para reiniciar
}