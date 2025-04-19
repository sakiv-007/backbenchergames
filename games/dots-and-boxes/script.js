// Dots and Boxes Game Script

// Game variables
let gridSize = 5; // Default grid size (5x5 dots creates 4x4 boxes)
let player1Score = 0;
let player2Score = 0;
let currentPlayer = 1; // 1 for Player 1, 2 for Player 2
let gameActive = true;
let boxesCompleted = 0;
let totalBoxes = 0;

// Game board dimensions
let dotSpacing = 60; // Default space between dots
let dotRadius = 6; // Default radius of dots
let lineThickness = 4; // Thickness of lines

// Arrays to track game state
let horizontalLines = []; // Tracks horizontal lines: [row][col]
let verticalLines = []; // Tracks vertical lines: [row][col]
let boxes = []; // Tracks boxes: [row][col]

// DOM elements
const gameBoard = document.getElementById('game-board');
const player1ScoreElement = document.getElementById('player1-score');
const player2ScoreElement = document.getElementById('player2-score');
const player1ScoreDisplay = document.getElementById('player1-score-display');
const player2ScoreDisplay = document.getElementById('player2-score-display');
const currentPlayerElement = document.getElementById('current-player');
const gameStatusElement = document.getElementById('game-status');
const gridSizeSelector = document.getElementById('grid-size');
const newGameBtn = document.getElementById('new-game-btn');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const closeMessageBtn = document.getElementById('close-message-btn');

// Initialize the game
// Game mode and AI variables
let gameMode = 'ai'; // Changed default to 'ai'
let ai;
let isAITurn = false;

// Add this after your existing initialization code
function initGame() {
    // Reset game state
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    gameActive = true;
    boxesCompleted = 0;
    
    // Get grid size from selector
    gridSize = parseInt(gridSizeSelector.value);
    totalBoxes = (gridSize - 1) * (gridSize - 1);
    
    // Adjust dot spacing, radius, and line thickness based on grid size
    if (gridSize <= 5) {
        dotSpacing = 80; // Default for small grids
        dotRadius = 6;
        lineThickness = 8;
    } else if (gridSize <= 7) {
        dotSpacing = 60; // Medium grids
        dotRadius = 5;
        lineThickness = 3;
    } else {
        dotSpacing = 45; // Large grids (9x9)
        dotRadius = 3;
        lineThickness = 2;
    }
    
    // Initialize arrays
    horizontalLines = Array(gridSize).fill().map(() => Array(gridSize - 1).fill(false));
    verticalLines = Array(gridSize - 1).fill().map(() => Array(gridSize).fill(false));
    boxes = Array(gridSize - 1).fill().map(() => Array(gridSize - 1).fill(0));
    
    // Update UI
    updateScores();
    updateCurrentPlayer();
    gameStatusElement.textContent = '';
    
    // Clear game board
    gameBoard.innerHTML = '';
    
    // Set game board size
    const boardSize = (gridSize - 1) * dotSpacing + dotRadius * 2;
    gameBoard.style.width = `${boardSize}px`;
    gameBoard.style.height = `${boardSize}px`;
    
    // Ensure the game board is properly centered and fills the container
    gameBoard.style.transform = 'translate(-50%, -50%)';
    gameBoard.style.left = '50%';
    gameBoard.style.top = '50%';
    
    // Create the game board
    createGameBoard();
    
    // Hide game message if visible
    gameMessage.classList.remove('show');
    
    // Initialize AI if in AI mode
    if (gameMode === 'ai') {
        ai = new DotsAndBoxesAI(gameBoard, gridSize);
    }
    
    // Reset AI turn flag
    isAITurn = false;
    
    // Update player labels based on game mode
    updatePlayerLabels();
}

// Create the game board with dots, lines, and boxes
function createGameBoard() {
    // Create dots
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            createDot(row, col);
        }
    }
    
    // Create horizontal lines
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
            createLine('horizontal', row, col);
        }
    }
    
    // Create vertical lines
    for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize; col++) {
            createLine('vertical', row, col);
        }
    }
    
    // Create boxes
    for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
            createBox(row, col);
        }
    }
}

// Create a dot at the specified position
function createDot(row, col) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    // Position the dot
    const x = col * dotSpacing;
    const y = row * dotSpacing;
    
    dot.style.left = `${x - dotRadius}px`;
    dot.style.top = `${y - dotRadius}px`;
    
    gameBoard.appendChild(dot);
}

// Create a line at the specified position
function createLine(orientation, row, col) {
    const line = document.createElement('div');
    line.className = `line ${orientation}`;
    
    // Set line position and dimensions
    if (orientation === 'horizontal') {
        const x = col * dotSpacing;
        const y = row * dotSpacing;
        
        line.style.left = `${x + dotRadius}px`;
        line.style.top = `${y - lineThickness / 2}px`;
        line.style.width = `${dotSpacing - dotRadius * 2}px`;
        
        // Store line data for click handling
        line.dataset.row = row;
        line.dataset.col = col;
        line.dataset.orientation = orientation;
    } else { // vertical
        const x = col * dotSpacing;
        const y = row * dotSpacing;
        
        line.style.left = `${x - lineThickness / 2}px`;
        line.style.top = `${y + dotRadius}px`;
        line.style.height = `${dotSpacing - dotRadius * 2}px`;
        
        // Store line data for click handling
        line.dataset.row = row;
        line.dataset.col = col;
        line.dataset.orientation = orientation;
    }
    
    // Add click event listener
    line.addEventListener('click', handleLineClick);
    
    gameBoard.appendChild(line);
}

// Create a box at the specified position
function createBox(row, col) {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `box-${row}-${col}`;
    
    // Store row and col data for AI processing
    box.dataset.row = row;
    box.dataset.col = col;
    
    // Position the box
    const x = col * dotSpacing + dotRadius;
    const y = row * dotSpacing + dotRadius;
    
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.width = `${dotSpacing - dotRadius * 2}px`;
    box.style.height = `${dotSpacing - dotRadius * 2}px`;
    
    gameBoard.appendChild(box);
}

// Handle line click event
function handleLineClick(event) {
    if (!gameActive) return;
    
    const line = event.target;
    const row = parseInt(line.dataset.row);
    const col = parseInt(line.dataset.col);
    const orientation = line.dataset.orientation;
    
    // Check if line is already active
    if (orientation === 'horizontal' && horizontalLines[row][col]) return;
    if (orientation === 'vertical' && verticalLines[row][col]) return;
    
    // If it's AI's turn, don't allow player clicks
    if (isAITurn) return;
    
    // Mark line as active
    if (orientation === 'horizontal') {
        horizontalLines[row][col] = true;
    } else {
        verticalLines[row][col] = true;
    }
    
    // Update line appearance
    line.classList.add('active');
    line.classList.add(`player${currentPlayer}`);
    
    // Check if any boxes are completed
    let boxCompleted = checkBoxCompletion();
    
    // If no box was completed, switch players
    if (!boxCompleted) {
        switchPlayer();
    } else {
        // If player completed a box and it's their turn again, update the display
        updateCurrentPlayer();
        
        // If in AI mode and player completed a box, check if game is over before AI's turn
        if (gameMode === 'ai' && currentPlayer === 1 && boxesCompleted === totalBoxes) {
            endGame();
            return;
        }
    }
    
    // Check if game is over
    if (boxesCompleted === totalBoxes) {
        endGame();
    }
}

// Check if any boxes are completed after a line is drawn
function checkBoxCompletion() {
    let boxCompleted = false;
    
    // Check all boxes
    for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
            // Skip already completed boxes
            if (boxes[row][col] !== 0) continue;
            
            // Check if box is completed (all 4 sides drawn)
            const topLine = horizontalLines[row][col];
            const rightLine = verticalLines[row][col + 1];
            const bottomLine = horizontalLines[row + 1][col];
            const leftLine = verticalLines[row][col];
            
            if (topLine && rightLine && bottomLine && leftLine) {
                // Box is completed
                boxes[row][col] = currentPlayer;
                boxCompleted = true;
                boxesCompleted++;
                
                // Update box appearance
                const box = document.getElementById(`box-${row}-${col}`);
                box.classList.add(`player${currentPlayer}`);
                box.classList.add('completed');
                
                // Add player's initial to the box - modified for AI mode
                if (gameMode === 'ai' && currentPlayer === 2) {
                    box.textContent = 'AI';
                } else {
                    box.textContent = currentPlayer === 1 ? 'P1' : 'P2';
                }
                
                // Update score
                if (currentPlayer === 1) {
                    player1Score++;
                } else {
                    player2Score++;
                }
                
                updateScores();
            }
        }
    }
    
    return boxCompleted;
}

// Switch to the other player
function switchPlayer() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateCurrentPlayer();
    
    // If in AI mode and it's player 2's turn (AI), trigger AI move
    if (gameMode === 'ai' && currentPlayer === 2) {
        isAITurn = true;
        setTimeout(makeAIMove, 500); // Give a small delay before AI makes its move
    }
}

// Update current player display
function updateCurrentPlayer() {
    if (gameMode === 'ai' && currentPlayer === 2) {
        currentPlayerElement.textContent = `AI's Turn`;
    } else {
        currentPlayerElement.textContent = `Player ${currentPlayer}'s Turn`;
    }
    currentPlayerElement.className = `player${currentPlayer}-turn`;
}

// Update scores display
function updateScores() {
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
    player1ScoreDisplay.textContent = player1Score;
    player2ScoreDisplay.textContent = player2Score;
}

// End the game and show results
function endGame() {
    gameActive = false;
    isAITurn = false;
    
    // Determine winner
    let winner;
    if (player1Score > player2Score) {
        winner = 'Player 1';
        messageTitle.textContent = 'Player 1 Wins!';
    } else if (player2Score > player1Score) {
        if (gameMode === 'ai') {
            winner = 'AI';
            messageTitle.textContent = 'AI Wins!';
        } else {
            winner = 'Player 2';
            messageTitle.textContent = 'Player 2 Wins!';
        }
    } else {
        winner = 'Draw';
        messageTitle.textContent = 'It\'s a Draw!';
    }
    
    // Update game status
    if (winner === 'Draw') {
        gameStatusElement.textContent = 'Game Over - It\'s a Draw!';
        messageText.textContent = 'The game ended in a draw!';
    } else {
        gameStatusElement.textContent = `Game Over - ${winner} Wins!`;
        messageText.textContent = `${winner} has won the game!`;
    }
    
    // Show final score
    finalScoreElement.textContent = `${player1Score} - ${player2Score}`;
    
    // Show game message
    gameMessage.classList.add('show');
}

// Event Listeners
newGameBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);
closeMessageBtn.addEventListener('click', () => {
    gameMessage.classList.remove('show');
});

gridSizeSelector.addEventListener('change', initGame);
// Add this with your other event listeners
document.getElementById('game-mode').addEventListener('change', function() {
    gameMode = this.value;
    initGame(); // Reset the game when mode changes
    
    // Update player labels based on game mode
    updatePlayerLabels();
});

// Function to update player labels based on game mode
function updatePlayerLabels() {
    const player2Label = document.querySelector('.player2 h3');
    const player2Initial = document.querySelector('.player2 .player-initial');
    const player2ScoreHeader = document.querySelector('.score-container .player-score:last-child span:first-child');
    
    if (gameMode === 'ai') {
        player2Label.textContent = 'AI';
        player2Initial.textContent = 'AI';
        player2ScoreHeader.textContent = 'AI';
    } else {
        player2Label.textContent = 'Player 2';
        player2Initial.textContent = 'P2';
        player2ScoreHeader.textContent = 'Player 2';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const gameModeSelector = document.getElementById('game-mode');
    gameModeSelector.value = 'ai'; // Set selector to AI mode
    updatePlayerLabels(); // Update the labels for AI mode
    initGame();
});

// AI move function with improved implementation
function makeAIMove() {
    if (!gameActive || !isAITurn) return;
    
    // Update UI to show AI is thinking
    const aiThinkingIndicator = document.createElement('div');
    aiThinkingIndicator.className = 'ai-thinking-indicator';
    aiThinkingIndicator.innerHTML = '<i class="fas fa-cog fa-spin"></i> AI is thinking...';
    currentPlayerElement.appendChild(aiThinkingIndicator); // Changed from gameBoard to currentPlayerElement
    
    // Get current game state
    const availableLines = getAvailableLines();
    const boxesState = getBoxesState();
    
    // Reduced delay for AI thinking
    setTimeout(() => {
        // Get AI's move
        const aiMove = ai.makeMove(availableLines, boxesState);
        
        if (aiMove) {
            // Find the line element that corresponds to the AI's move
            const lineElement = document.querySelector(
                `.line[data-row="${aiMove.row}"][data-col="${aiMove.col}"][data-orientation="${aiMove.orientation}"]`
            );
            
            if (lineElement) {
                // Visual feedback for AI move
                lineElement.classList.add('ai-selecting');
                
                setTimeout(() => {
                    // Remove the thinking indicator
                    if (aiThinkingIndicator.parentNode) {
                        aiThinkingIndicator.parentNode.removeChild(aiThinkingIndicator);
                    }
                    
                    lineElement.classList.remove('ai-selecting');
                    
                    // Mark line as active
                    if (aiMove.orientation === 'horizontal') {
                        horizontalLines[aiMove.row][aiMove.col] = true;
                    } else {
                        verticalLines[aiMove.row][aiMove.col] = true;
                    }
                    
                    // Update line appearance
                    lineElement.classList.add('active');
                    lineElement.classList.add(`player${currentPlayer}`);
                    
                    // Check if any boxes are completed
                    let boxCompleted = checkBoxCompletion();
                    
                    // Reset AI turn flag before switching players
                    isAITurn = false;
                    
                    // If no box was completed, switch players
                    if (!boxCompleted) {
                        switchPlayer();
                    } else {
                        // If AI completed a box, it gets another turn
                        currentPlayer = 2;
                        isAITurn = true;
                        updateCurrentPlayer();
                        setTimeout(makeAIMove, 800);
                    }
                    
                    // Check if game is over
                    if (boxesCompleted === totalBoxes) {
                        endGame();
                    }
                }, 500);
            }
        } else {
            // If no move was found, remove the thinking indicator
            if (aiThinkingIndicator.parentNode) {
                aiThinkingIndicator.parentNode.removeChild(aiThinkingIndicator);
            }
            isAITurn = false;
        }
    }, 200); // Reduced from 1000
}

// Helper function to get available lines
function getAvailableLines() {
    const availableLines = [];
    const lines = document.querySelectorAll('.line:not(.active)');
    
    lines.forEach(line => {
        availableLines.push({
            row: parseInt(line.dataset.row),
            col: parseInt(line.dataset.col),
            orientation: line.dataset.orientation
        });
    });
    
    return availableLines;
}

// Helper function to get current boxes state
function getBoxesState() {
    const boxesState = [];
    
    // Loop through all boxes in the game state array
    for (let row = 0; row < gridSize - 1; row++) {
        for (let col = 0; col < gridSize - 1; col++) {
            let sides = 0;
            
            // Count active lines around this box
            if (horizontalLines[row][col]) sides++; // Top
            if (horizontalLines[row+1][col]) sides++; // Bottom
            if (verticalLines[row][col]) sides++; // Left
            if (verticalLines[row][col+1]) sides++; // Right
            
            boxesState.push({ row, col, sides });
        }
    }
    
    return boxesState;
}