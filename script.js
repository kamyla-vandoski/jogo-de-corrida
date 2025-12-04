const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Configurações
const TILE_SIZE = 20; // Tamanho do bloco
const GRID_SIZE = canvas.width / TILE_SIZE; // 20 blocos

let monkey = { x: 10 * TILE_SIZE, y: 10 * TILE_SIZE }; // Macaco é um único bloco
let banana = {};
let dx = 0; // Direção em X (começa parado)
let dy = 0; // Direção em Y (começa parado)
let score = 0;
let gameLoop;
let isPaused = true;

// --- 1. FUNÇÕES DE INICIALIZAÇÃO ---

function initGame() {
    monkey = { x: 10 * TILE_SIZE, y: 10 * TILE_SIZE };
    dx = 0;
    dy = 0;
    score = 0;
    scoreDisplay.textContent = score;
    isPaused = false;
    
    generateBanana(); 
}

function generateBanana() {
    // Gera coordenadas aleatórias que se encaixam na grade
    banana = {
        x: Math.floor(Math.random() * GRID_SIZE) * TILE_SIZE,
        y: Math.floor(Math.random() * GRID_SIZE) * TILE_SIZE
    };
    // Não precisamos checar colisão com o corpo, pois o macaco é um bloco só
}

// --- 2. FUNÇÃO PRINCIPAL DE DESENHO E ATUALIZAÇÃO ---

function draw() {
    // Limpa a tela (fundo da floresta)
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a Banana (Comida)
    ctx.fillStyle = '#f1c40f'; // Amarelo vibrante
    ctx.fillRect(banana.x, banana.y, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#e67e22'; // Destaque marrom
    ctx.strokeRect(banana.x, banana.y, TILE_SIZE, TILE_SIZE);

    // Desenha o Macaco (Jogador)
    ctx.fillStyle = '#d35400'; // Marrom
    ctx.fillRect(monkey.x, monkey.y, TILE_SIZE, TILE_SIZE);
}

function update() {
    if (isPaused) return;

    // 1. Calcula a nova posição do macaco
    const nextX = monkey.x + dx;
    const nextY = monkey.y + dy;

    // 2. Colisão (Paredes)
    if (nextX < 0 || nextX >= canvas.width || nextY < 0 || nextY >= canvas.height) {
        endGame();
        return;
    }
    
    // Atualiza a posição do macaco
    monkey.x = nextX;
    monkey.y = nextY;

    // 3. Checa se comeu a banana
    if (monkey.x === banana.x && monkey.y === banana.y) {
        score++;
        scoreDisplay.textContent = score;
        generateBanana(); // Gera nova banana
    }
    
    draw();
}

// --- 3. CONTROLE DE TECLADO ---

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    // Apenas muda a direção se o macaco não estiver se movendo na direção oposta
    if (keyPressed === LEFT_KEY && dx !== TILE_SIZE) {
        dx = -TILE_SIZE;
        dy = 0;
    } else if (keyPressed === UP_KEY && dy !== TILE_SIZE) {
        dx = 0;
        dy = -TILE_SIZE;
    } else if (keyPressed === RIGHT_KEY && dx !== -TILE_SIZE) {
        dx = TILE_SIZE;
        dy = 0;
    } else if (keyPressed === DOWN_KEY && dy !== -TILE_SIZE) {
        dx = 0;
        dy = TILE_SIZE;
    }
}

// --- 4. CONTROLE DO JOGO ---

function startGame() {
    if (!isPaused) {
        clearInterval(gameLoop);
    }
    initGame();
    draw(); // Desenha o estado inicial
    // Velocidade de atualização (a cada 150 milissegundos)
    gameLoop = setInterval(update, 150); 
}

function endGame() {
    isPaused = true;
    clearInterval(gameLoop);
    alert(`Ops, bateu! Você coletou ${score} bananas. Clique em 'Começar!' para tentar novamente.`);
}

// Desenha a tela inicial
draw();