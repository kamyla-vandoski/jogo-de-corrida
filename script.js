const player = document.getElementById('player');
const obstacle = document.getElementById('obstacle');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
let score = 0;
let isJumping = false;
let gameRunning = true;

// --- 1. Pulo do Jogador ---
function jump() {
    if (isJumping || !gameRunning) return;
    
    isJumping = true;
    player.classList.add('jump');

    setTimeout(() => {
        player.classList.remove('jump');
        isJumping = false;
    }, 600); // Deve corresponder à duração da animação no CSS
}

// O jogo começa com um clique ou toque na área do jogo
document.addEventListener('click', jump);
document.addEventListener('touchstart', jump); // Para dispositivos móveis
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});


// --- 2. Movimento do Obstáculo ---
function moveObstacle() {
    let obstaclePosition = 600; // Começa fora da tela

    const moveInterval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(moveInterval);
            return;
        }

        obstaclePosition -= 5; // Velocidade do obstáculo

        if (obstaclePosition < -20) {
            // Obstáculo saiu da tela, resetar
            obstaclePosition = 600;
            obstacle.style.height = (Math.random() * 20 + 20) + 'px'; // Altura aleatória
            score++;
            scoreDisplay.textContent = `Pontos: ${score}`;
        }

        obstacle.style.right = obstaclePosition + 'px';

        // --- 3. Checagem de Colisão ---
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        // Se o jogador estiver na mesma área horizontal do obstáculo
        const overlapX = playerRect.right > obstacleRect.left && playerRect.left < obstacleRect.right;
        
        // E o jogador não estiver pulando alto o suficiente (área vertical)
        const overlapY = playerRect.bottom > obstacleRect.top;

        if (overlapX && overlapY) {
            gameOver();
            clearInterval(moveInterval);
        }

    }, 20); // Atualiza a cada 20ms
}

// --- 4. Fim do Jogo ---
function gameOver() {
    gameRunning = false;
    // Estilo de "game over"
    game.style.borderBottomColor = 'red';
    player.style.backgroundColor = 'red';
    
    // Mensagem de Game Over
    const gameOverMessage = document.createElement('div');
    gameOverMessage.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-size: 2em;';
    gameOverMessage.textContent = `GAME OVER! Pontuação Final: ${score}`;
    game.appendChild(gameOverMessage);
}

// Inicia o jogo
moveObstacle();