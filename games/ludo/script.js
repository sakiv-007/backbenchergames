// Ludo Game JavaScript

// Game Constants
const PLAYERS = {
    RED: { id: 'red', name: 'Player 1 (Red)', startPosition: 0 },
    GREEN: { id: 'green', name: 'Player 2 (Green)', startPosition: 13 },
    YELLOW: { id: 'yellow', name: 'Player 3 (Yellow)', startPosition: 26 },
    BLUE: { id: 'blue', name: 'Player 4 (Blue)', startPosition: 39 }
};

const BOARD_SIZE = 15; // 15x15 grid
const TOKENS_PER_PLAYER = 4;
const SAFE_POSITIONS = [8, 21, 34, 47, 1, 14, 27, 40]; // Star positions
const HOME_POSITIONS = {
    red: [51, 52, 53, 54, 55, 56],
    green: [12, 11, 10, 9, 8, 7],
    yellow: [25, 24, 23, 22, 21, 20],
    blue: [38, 37, 36, 35, 34, 33]
};

// Game State
let gameState = {
    currentPlayer: PLAYERS.RED.id,
    players: [
        { id: PLAYERS.RED.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
        { id: PLAYERS.GREEN.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
        { id: PLAYERS.YELLOW.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
        { id: PLAYERS.BLUE.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 }
    ],
    diceValue: 1,
    diceRolled: false,
    gameStarted: false,
    gameOver: false,
    winner: null,
    extraTurn: false
};

// DOM Elements
const gameBoard = document.getElementById('game-board');
const diceElement = document.getElementById('dice');
const diceFace = document.getElementById('dice-face');
const rollDiceBtn = document.getElementById('roll-dice-btn');
const newGameBtn = document.getElementById('new-game-btn');
const rulesBtn = document.getElementById('rules-btn');
const rulesModal = document.getElementById('rules-modal');
const gameOverModal = document.getElementById('game-over-modal');
const winnerMessage = document.getElementById('winner-message');
const playAgainBtn = document.getElementById('play-again-btn');
const currentPlayerIndicator = document.getElementById('current-player-indicator');
const closeModalBtn = document.querySelector('.close-modal');

// Initialize the game
function initGame() {
    createBoard();
    setupEventListeners();
    updatePlayerIndicator();
    gameState.gameStarted = true;
}

// Create the game board
function createBoard() {
    // Clear the board
    gameBoard.innerHTML = '';
    
    // Create the grid cells
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // Add cell to the board
            gameBoard.appendChild(cell);
        }
    }
    
    // Create home bases
    createHomeBase('red', 0, 0);
    createHomeBase('green', 0, 9);
    createHomeBase('yellow', 9, 9);
    createHomeBase('blue', 9, 0);
    
    // Create paths
    createPaths();
    
    // Create finish area
    createFinishArea();
    
    // Initialize tokens
    initializeTokens();
}

// Create home base for a player
function createHomeBase(color, startRow, startCol) {
    const homeBase = document.createElement('div');
    homeBase.classList.add('home-base', color);
    homeBase.style.top = `${startRow * (100 / BOARD_SIZE)}%`;
    homeBase.style.left = `${startCol * (100 / BOARD_SIZE)}%`;
    
    // Create token positions in home base
    const positions = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 }
    ];
    
    positions.forEach((pos, index) => {
        const homeCircle = document.createElement('div');
        homeCircle.classList.add('home-circle');
        homeCircle.dataset.position = `home-${color}-${index}`;
        homeBase.appendChild(homeCircle);
    });
    
    gameBoard.appendChild(homeBase);
}

// Create paths on the board
function createPaths() {
    // Common path (white cells)
    const pathCells = [
        // Bottom row (left to right)
        { row: 14, col: 6 }, { row: 14, col: 7 }, { row: 14, col: 8 },
        // Right column (bottom to top)
        { row: 13, col: 8 }, { row: 12, col: 8 }, { row: 11, col: 8 }, { row: 10, col: 8 }, { row: 9, col: 8 },
        { row: 8, col: 8 }, { row: 7, col: 8 }, { row: 6, col: 8 },
        // Top row (right to left)
        { row: 6, col: 9 }, { row: 6, col: 10 }, { row: 6, col: 11 }, { row: 6, col: 12 }, { row: 6, col: 13 },
        { row: 6, col: 14 },
        // Top row (right to left)
        { row: 7, col: 14 }, { row: 8, col: 14 },
        // Right column (top to bottom)
        { row: 8, col: 13 }, { row: 8, col: 12 }, { row: 8, col: 11 }, { row: 8, col: 10 }, { row: 8, col: 9 },
        { row: 8, col: 8 }, { row: 8, col: 7 }, { row: 8, col: 6 },
        // Bottom row (right to left)
        { row: 9, col: 6 }, { row: 10, col: 6 }, { row: 11, col: 6 }, { row: 12, col: 6 }, { row: 13, col: 6 },
        { row: 14, col: 6 },
        // Left column (bottom to top)
        { row: 14, col: 5 }, { row: 14, col: 4 }, { row: 14, col: 3 }, { row: 14, col: 2 }, { row: 14, col: 1 },
        { row: 14, col: 0 },
        // Left column (bottom to top)
        { row: 13, col: 0 }, { row: 12, col: 0 },
        // Bottom row (left to right)
        { row: 12, col: 1 }, { row: 12, col: 2 }, { row: 12, col: 3 }, { row: 12, col: 4 }, { row: 12, col: 5 },
        { row: 12, col: 6 }, { row: 12, col: 7 }, { row: 12, col: 8 },
        // Top row (left to right)
        { row: 11, col: 8 }, { row: 10, col: 8 }, { row: 9, col: 8 }, { row: 8, col: 8 }, { row: 7, col: 8 },
        { row: 6, col: 8 },
        // Top row (left to right)
        { row: 6, col: 7 }, { row: 6, col: 6 }, { row: 6, col: 5 }, { row: 6, col: 4 }, { row: 6, col: 3 },
        { row: 6, col: 2 }, { row: 6, col: 1 }, { row: 6, col: 0 },
        // Left column (top to bottom)
        { row: 7, col: 0 }, { row: 8, col: 0 },
        // Top row (left to right)
        { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 }, { row: 8, col: 4 }, { row: 8, col: 5 },
        { row: 8, col: 6 }
    ];
    
    // Mark path cells
    pathCells.forEach((cell, index) => {
        const cellElement = getCellAt(cell.row, cell.col);
        if (cellElement) {
            cellElement.classList.add('path');
            cellElement.dataset.pathIndex = index;
            
            // Mark safe cells (stars)
            if (SAFE_POSITIONS.includes(index)) {
                cellElement.classList.add('safe');
            }
        }
    });
    
    // Colored home paths
    const homePaths = {
        red: [{ row: 7, col: 1 }, { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 }],
        green: [{ row: 1, col: 7 }, { row: 2, col: 7 }, { row: 3, col: 7 }, { row: 4, col: 7 }, { row: 5, col: 7 }, { row: 6, col: 7 }],
        yellow: [{ row: 7, col: 13 }, { row: 7, col: 12 }, { row: 7, col: 11 }, { row: 7, col: 10 }, { row: 7, col: 9 }, { row: 7, col: 8 }],
        blue: [{ row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 }, { row: 10, col: 7 }, { row: 9, col: 7 }, { row: 8, col: 7 }]
    };
    
    // Mark home path cells
    for (const [color, path] of Object.entries(homePaths)) {
        path.forEach((cell, index) => {
            const cellElement = getCellAt(cell.row, cell.col);
            if (cellElement) {
                cellElement.classList.add(`${color}-path`);
                cellElement.dataset.homePathIndex = index;
                cellElement.dataset.homeColor = color;
            }
        });
    }
}

// Create the finish area in the center
function createFinishArea() {
    const finishArea = document.createElement('div');
    finishArea.classList.add('finish-area');
    
    // Create colored sections
    const colors = ['red', 'green', 'yellow', 'blue'];
    colors.forEach(color => {
        const section = document.createElement('div');
        section.classList.add(`${color}-section`);
        finishArea.appendChild(section);
    });
    
    gameBoard.appendChild(finishArea);
}

// Initialize player tokens
function initializeTokens() {
    // Reset game state tokens
    gameState.players.forEach(player => {
        player.tokens = [];
        player.tokensHome = TOKENS_PER_PLAYER;
        player.tokensFinished = 0;
        
        // Create tokens for each player
        for (let i = 0; i < TOKENS_PER_PLAYER; i++) {
            const token = {
                id: `${player.id}-token-${i}`,
                position: `home-${player.id}-${i}`,
                isHome: true,
                isFinished: false,
                pathPosition: -1,
                homePathPosition: -1
            };
            
            player.tokens.push(token);
            
            // Create token element
            createTokenElement(token);
        }
    });
}

// Create a token DOM element
function createTokenElement(token) {
    const tokenElement = document.createElement('div');
    tokenElement.id = token.id;
    tokenElement.classList.add('token', token.id.split('-')[0]);
    tokenElement.dataset.tokenId = token.id;
    
    // Position the token
    positionToken(token);
    
    // Add click event
    tokenElement.addEventListener('click', () => handleTokenClick(token));
    
    gameBoard.appendChild(tokenElement);
}

// Position a token on the board
function positionToken(token) {
    const tokenElement = document.getElementById(token.id);
    if (!tokenElement) return;
    
    let targetElement;
    
    if (token.isHome) {
        // Position in home base
        targetElement = document.querySelector(`[data-position="${token.position}"]`);
    } else if (token.isFinished) {
        // Hide finished tokens (they're in the center)
        tokenElement.style.display = 'none';
        return;
    } else if (token.homePathPosition >= 0) {
        // Position on home path
        const color = token.id.split('-')[0];
        targetElement = document.querySelector(`.${color}-path[data-home-path-index="${token.homePathPosition}"]`);
    } else {
        // Position on main path
        targetElement = document.querySelector(`.path[data-path-index="${token.pathPosition}"]`);
    }
    
    if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const boardRect = gameBoard.getBoundingClientRect();
        
        // Calculate position relative to the board
        const left = (rect.left - boardRect.left + rect.width / 2 - tokenElement.offsetWidth / 2) / boardRect.width * 100;
        const top = (rect.top - boardRect.top + rect.height / 2 - tokenElement.offsetHeight / 2) / boardRect.height * 100;
        
        tokenElement.style.left = `${left}%`;
        tokenElement.style.top = `${top}%`;
    }
}

// Get a cell element at specific row and column
function getCellAt(row, col) {
    return document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
}

// Set up event listeners
function setupEventListeners() {
    rollDiceBtn.addEventListener('click', rollDice);
    newGameBtn.addEventListener('click', resetGame);
    rulesBtn.addEventListener('click', showRules);
    closeModalBtn.addEventListener('click', hideRules);
    playAgainBtn.addEventListener('click', resetGame);
}

// Roll the dice
function rollDice() {
    if (gameState.gameOver) return;
    
    // Disable button during roll
    rollDiceBtn.disabled = true;
    
    // Add rolling animation
    diceElement.classList.add('rolling');
    
    // Generate random dice value (1-6)
    setTimeout(() => {
        gameState.diceValue = Math.floor(Math.random() * 6) + 1;
        gameState.diceRolled = true;
        
        // Update dice face
        updateDiceFace();
        
        // Remove rolling animation
        diceElement.classList.remove('rolling');
        
        // Check if player can move
        checkPlayerCanMove();
        
        // Re-enable button
        rollDiceBtn.disabled = false;
    }, 800);
}

// Update the dice face based on current value
function updateDiceFace() {
    // Clear previous dots
    diceFace.innerHTML = '';
    diceFace.setAttribute('data-value', gameState.diceValue);
    
    // Add dots based on dice value
    for (let i = 0; i < gameState.diceValue; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        diceFace.appendChild(dot);
    }
}

// Check if current player can move any token
function checkPlayerCanMove() {
    const currentPlayerObj = gameState.players.find(p => p.id === gameState.currentPlayer);
    let canMove = false;
    
    // Reset all token selections
    document.querySelectorAll('.token').forEach(token => {
        token.classList.remove('selectable');
    });
    
    // Check each token if it can move
    currentPlayerObj.tokens.forEach(token => {
        if (canMoveToken(token)) {
            canMove = true;
            const tokenElement = document.getElementById(token.id);
            if (tokenElement) {
                tokenElement.classList.add('selectable');
            }
        }
    });
    
    // If no token can move, move to next player
    if (!canMove) {
        setTimeout(() => {
            nextPlayer();
        }, 1000);
    }
}

// Check if a specific token can move
function canMoveToken(token) {
    // If token is home, need a 6 to move out
    if (token.isHome) {
        return gameState.diceValue === 6;
    }
    
    // If token is on main path
    if (token.pathPosition >= 0 && token.homePathPosition === -1) {
        const playerStartPos = getPlayerStartPosition(token.id.split('-')[0]);
        const targetPosition = (token.pathPosition + gameState.diceValue) % 52;
        
        // Check if token can enter home path
        if (canEnterHomePath(token, targetPosition)) {
            return true;
        }
        
        // Check if token can move on main path
        return true;
    }
    
    // If token is on home path
    if (token.homePathPosition >= 0) {
        // Check if token can move further on home path or finish
        return token.homePathPosition + gameState.diceValue <= 5;
    }
    
    return false;
}

// Check if token can enter home path
function canEnterHomePath(token, targetPosition) {
    const color = token.id.split('-')[0];
    const playerStartPos = getPlayerStartPosition(color);
    
    // Calculate the position before home path
    let positionBeforeHomePath;
    switch (color) {
        case 'red': positionBeforeHomePath = 50; break;
        case 'green': positionBeforeHomePath = 11; break;
        case 'yellow': positionBeforeHomePath = 24; break;
        case 'blue': positionBeforeHomePath = 37; break;
    }
    
    // Check if token is at position before home path and dice value allows entering
    if (token.pathPosition === positionBeforeHomePath) {
        return gameState.diceValue <= 6; // Can enter home path if dice <= 6
    }
    
    return false;
}

// Get player's start position on the board
function getPlayerStartPosition(playerId) {
    switch (playerId) {
        case 'red': return PLAYERS.RED.startPosition;
        case 'green': return PLAYERS.GREEN.startPosition;
        case 'yellow': return PLAYERS.YELLOW.startPosition;
        case 'blue': return PLAYERS.BLUE.startPosition;
        default: return 0;
    }
}

// Handle token click
function handleTokenClick(token) {
    // Check if it's this player's turn and dice has been rolled
    if (token.id.split('-')[0] !== gameState.currentPlayer || !gameState.diceRolled) {
        return;
    }
    
    // Check if token is selectable (can move)
    const tokenElement = document.getElementById(token.id);
    if (!tokenElement.classList.contains('selectable')) {
        return;
    }
    
    // Move the token
    moveToken(token);
    
    // Reset dice rolled flag
    gameState.diceRolled = false;
    
    // Remove selectable class from all tokens
    document.querySelectorAll('.token').forEach(t => {
        t.classList.remove('selectable');
    });
}

// Move a token based on dice value
function moveToken(token) {
    const currentPlayer = gameState.players.find(p => p.id === gameState.currentPlayer);
    
    // If token is in home and dice is 6, move to start position
    if (token.isHome && gameState.diceValue === 6) {
        token.isHome = false;
        token.pathPosition = getPlayerStartPosition(token.id.split('-')[0]);
        currentPlayer.tokensHome--;
        
        // Check if there's an opponent token to capture
        captureOpponentTokens(token.pathPosition);
        
        // Position the token
        positionToken(token);
        
        // Player gets another turn for rolling a 6
        gameState.extraTurn = true;
        nextPlayer();
        return;
    }
    
    // If token is on main path
    if (token.pathPosition >= 0 && token.homePathPosition === -1) {
        const color = token.id.split('-')[0];
        
        // Check if token can enter home path
        if (canEnterHomePath(token, token.pathPosition + gameState.diceValue)) {
            // Enter home path
            token.homePathPosition = gameState.diceValue - 1;
            token.pathPosition = -1;
        } else {
            // Move on main path
            token.pathPosition = (token.pathPosition + gameState.diceValue) % 52;
            
            // Check if there's an opponent token to capture
            if (captureOpponentTokens(token.pathPosition)) {
                // Player gets another turn for capturing
                gameState.extraTurn = true;
            }
        }
    }
    // If token is on home path
    else if (token.homePathPosition >= 0) {
        // Move further on home path
        token.homePathPosition += gameState.diceValue;
        
        // Check if token has reached the end
        if (token.homePathPosition === 5) {
            token.isFinished = true;
            token.homePathPosition = -1;
            currentPlayer.tokensFinished++;
            
            // Check if player has won
            if (currentPlayer.tokensFinished === TOKENS_PER_PLAYER) {
                gameState.gameOver = true;
                gameState.winner = currentPlayer.id;
                showGameOver();
                return;
            }
        }
    }
    
    // Position the token
    positionToken(token);
    
    // Move to next player unless player gets an extra turn
    if (gameState.extraTurn) {
        gameState.extraTurn = false;
    } else {
        nextPlayer();
    }
}

// Capture opponent tokens at a position
function captureOpponentTokens(position) {
    let captured = false;
    
    // Skip if position is a safe zone
    if (SAFE_POSITIONS.includes(position)) {
        return false;
    }
    
    // Check all players' tokens
    gameState.players.forEach(player => {
        // Skip current player's tokens
        if (player.id === gameState.currentPlayer) return;
        
        // Check each token
        player.tokens.forEach(token => {
            // If token is at the same position and not in home or finished
            if (token.pathPosition === position && !token.isHome && !token.isFinished) {
                // Send token back to home
                token.isHome = true;
                token.pathPosition = -1;
                token.homePathPosition = -1;
                token.position = `home-${player.id}-${player.tokensHome}`;
                player.tokensHome++;
                
                // Position the token
                positionToken(token);
                
                captured = true;
            }
        });
    });
    
    return captured;
}

// Move to next player
function nextPlayer() {
    // If game is over, don't change player
    if (gameState.gameOver) return;
    
    // If player gets an extra turn (rolled 6 or captured), don't change player
    if (gameState.diceValue === 6 || gameState.extraTurn) {
        gameState.extraTurn = false;
        return;
    }
    
    // Find current player index
    const currentPlayerIndex = gameState.players.findIndex(p => p.id === gameState.currentPlayer);
    
    // Move to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
    gameState.currentPlayer = gameState.players[nextPlayerIndex].id;
    
    // Update player indicator
    updatePlayerIndicator();
}

// Update the current player indicator
function updatePlayerIndicator() {
    // Update indicator color
    currentPlayerIndicator.style.backgroundColor = `var(--${gameState.currentPlayer})`;
    
    // Update active player in stats
    document.querySelectorAll('.player').forEach(player => {
        player.classList.remove('active');
    });
    
    document.querySelector(`.player.${gameState.currentPlayer}`).classList.add('active');
}

// Show rules modal
function showRules() {
    rulesModal.style.display = 'flex';
}

// Hide rules modal
function hideRules() {
    rulesModal.style.display = 'none';
}

// Show game over modal
function showGameOver() {
    const winnerName = gameState.players.find(p => p.id === gameState.winner).id;
    winnerMessage.textContent = `${winnerName.charAt(0).toUpperCase() + winnerName.slice(1)} player wins!`;
    gameOverModal.style.display = 'flex';
}

// Reset the game
function resetGame() {
    // Reset game state
    gameState = {
        currentPlayer: PLAYERS.RED.id,
        players: [
            { id: PLAYERS.RED.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
            { id: PLAYERS.GREEN.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
            { id: PLAYERS.YELLOW.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 },
            { id: PLAYERS.BLUE.id, tokens: [], tokensHome: TOKENS_PER_PLAYER, tokensFinished: 0 }
        ],
        diceValue: 1,
        diceRolled: false,
        gameStarted: false,
        gameOver: false,
        winner: null,
        extraTurn: false
    };
    
    // Hide modals
    rulesModal.style.display = 'none';
    gameOverModal.style.display = 'none';
    
    // Reinitialize the game
    initGame();
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);