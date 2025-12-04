const gameBoard = document.querySelector('.memory-game');

// Emojis de animais (4 pares para um grid 4x4, total de 8 cartas)
// Vamos aumentar para 8 pares (16 cartas) para o grid 4x4
const animalEmojis = [
    '🐘', '🦒', '🐒', '🦁', 
    '🦊', '🐼', '🐸', '🦉'
];

// Duplica a lista para criar os pares (total de 16 elementos)
let cardsArray = [...animalEmojis, ...animalEmojis];

// Variáveis de estado do jogo
let hasFlippedCard = false;
let lockBoard = false; // Bloqueia cliques durante a checagem
let firstCard, secondCard;
let matchesFound = 0; // Contador de pares encontrados

// --- FUNÇÃO DE EMBARALHAR (Fisher-Yates) ---
function shuffleCards() {
    // Embaralha o array
    cardsArray.sort(() => Math.random() - 0.5);
    
    // Zera o tabuleiro
    gameBoard.innerHTML = '';
    matchesFound = 0;
}

// --- FUNÇÃO PARA CRIAR O TABULEIRO ---
function createBoard() {
    shuffleCards(); // Garante que a lista está embaralhada
    
    cardsArray.forEach(animal => {
        // Cria o elemento da carta
        const card = document.createElement('div');
        card.classList.add('memory-card');
        
        // Define o valor do animal (para comparação)
        card.dataset.animal = animal; 

        // Adiciona a estrutura HTML da frente e verso
        card.innerHTML = `
            <div class="face card-back">${animal}</div>
            <div class="face card-front">?</div>
        `;
        
        // Adiciona o evento de clique e insere no tabuleiro
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// --- FUNÇÃO DE VIRAR CARTA ---
function flipCard() {
    if (lockBoard) return; // Se o tabuleiro estiver bloqueado, ignora
    if (this === firstCard) return; // Impede que o jogador clique duas vezes na mesma carta
    
    // Vira a carta
    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    
    checkForMatch();
}

// --- FUNÇÃO DE CHECAGEM DE PARES ---
function checkForMatch() {
    let isMatch = firstCard.dataset.animal === secondCard.dataset.animal;
    
    if (isMatch) {
        // Par encontrado!
        disableCards();
    } else {
        // Erro, desvira as cartas após um tempo
        unflipCards();
    }
}

// --- FUNÇÃO PARA DESABILITAR CARTAS (Acerto) ---
function disableCards() {
    matchesFound++;
    
    // Adiciona a classe 'match' (mantém virada e desabilita clique)
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    // Remove os event listeners para que as cartas não possam ser clicadas novamente
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
    
    // Verifica se o jogo acabou
    if (matchesFound === animalEmojis.length) {
        setTimeout(() => {
            alert(`Parabéns! Você encontrou todos os ${matchesFound} pares!`);
            // Reinicia o jogo
            createBoard();
        }, 500);
    }
}

// --- FUNÇÃO PARA DESVIRAR CARTAS (Erro) ---
function unflipCards() {
    lockBoard = true; // Bloqueia cliques
    
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        
        resetBoard();
    }, 1000); // Vira de volta após 1 segundo
}

// --- FUNÇÃO PARA RESETAR O ESTADO ---
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// -------------------------------------
// INICIA O JOGO AO CARREGAR A PÁGINA
// -------------------------------------
createBoard();