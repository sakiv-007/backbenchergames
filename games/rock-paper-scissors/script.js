// Rock Paper Scissors Game Script

// Game variables
let playerScore = 0;
let computerScore = 0;
let roundNumber = 1;
let gameActive = true;
let gameHistory = [];
let difficulty = 'medium';
let targetScore = 5; // First to reach this score wins
let playerChoice = null;
let computerChoice = null;

// DOM elements
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const roundNumberElement = document.getElementById('round-number');
const roundResultElement = document.getElementById('round-result');
const difficultySelector = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game-btn');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const computerChoiceDisplay = document.getElementById('computer-choice-display');
const historyBody = document.getElementById('history-body');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const closeMessageBtn = document.getElementById('close-message-btn');
const choices = document.querySelectorAll('.choice');

// Choice icons mapping
const choiceIcons = {
    rock: '<i class="fas fa-hand-rock"></i>',
    paper: '<i class="fas fa-hand-paper"></i>',
    scissors: '<i class="fas fa-hand-scissors"></i>',
    question: '<i class="fas fa-question"></i>'
};

// Initialize the game
function initGame() {
    // Reset game state
    playerScore = 0;
    computerScore = 0;
    roundNumber = 1;
    gameActive = true;
    gameHistory = [];
    playerChoice = null;
    computerChoice = null;
    
    // Update UI
    updateScores();
    updateRoundInfo();
    resetChoiceDisplays();
    clearHistory();
    
    // Get difficulty
    difficulty = difficultySelector.value;
    
    // Hide game message if visible
    gameMessage.classList.remove('show');
}

// Update scores display
function updateScores() {
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}

// Update round information
function updateRoundInfo() {
    roundNumberElement.textContent = `Round ${roundNumber}`;
}

// Reset choice displays
function resetChoiceDisplays() {
    playerChoiceDisplay.innerHTML = choiceIcons.question;
    computerChoiceDisplay.innerHTML = choiceIcons.question;
    playerChoiceDisplay.className = 'choice-display';
    computerChoiceDisplay.className = 'choice-display';
    
    // Remove selected class from all choices
    choices.forEach(choice => {
        choice.classList.remove('selected');
    });
}

// Clear history table
function clearHistory() {
    historyBody.innerHTML = '';
}

// Handle player choice
function handlePlayerChoice(choice) {
    if (!gameActive) return;
    
    playerChoice = choice;
    
    // Update UI to show player's choice
    playerChoiceDisplay.innerHTML = choiceIcons[choice];
    
    // Highlight selected choice
    choices.forEach(choiceElement => {
        if (choiceElement.dataset.choice === choice) {
            choiceElement.classList.add('selected');
        } else {
            choiceElement.classList.remove('selected');
        }
    });
    
    // Get computer's choice after a short delay
    setTimeout(() => {
        makeComputerChoice();
        determineWinner();
        updateHistory();
        checkGameEnd();
        
        // Prepare for next round if game is still active
        if (gameActive) {
            setTimeout(() => {
                roundNumber++;
                updateRoundInfo();
                resetChoiceDisplays();
                playerChoice = null;
                computerChoice = null;
            }, 1500);
        }
    }, 1000);
}

// Make computer choice based on difficulty
function makeComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    
    switch (difficulty) {
        case 'easy':
            // In easy mode, computer makes random choices with a slight bias towards losing
            const randomValue = Math.random();
            if (randomValue < 0.6) {
                // 60% chance to choose the losing option
                if (playerChoice === 'rock') computerChoice = 'scissors';
                else if (playerChoice === 'paper') computerChoice = 'rock';
                else computerChoice = 'paper';
            } else {
                // 40% chance for a random choice
                computerChoice = choices[Math.floor(Math.random() * 3)];
            }
            break;
            
        case 'medium':
            // In medium mode, computer makes completely random choices
            computerChoice = choices[Math.floor(Math.random() * 3)];
            break;
            
        case 'hard':
            // In hard mode, computer has a higher chance to make the winning choice
            const hardRandomValue = Math.random();
            if (hardRandomValue < 0.6) {
                // 60% chance to choose the winning option
                if (playerChoice === 'rock') computerChoice = 'paper';
                else if (playerChoice === 'paper') computerChoice = 'scissors';
                else computerChoice = 'rock';
            } else {
                // 40% chance for a random choice
                computerChoice = choices[Math.floor(Math.random() * 3)];
            }
            break;
            
        default:
            computerChoice = choices[Math.floor(Math.random() * 3)];
    }
    
    // Update UI to show computer's choice
    computerChoiceDisplay.innerHTML = choiceIcons[computerChoice];
}

// Determine the winner of the round
function determineWinner() {
    let result;
    
    if (playerChoice === computerChoice) {
        // Draw
        result = 'draw';
        roundResultElement.textContent = 'Draw!';
        roundResultElement.className = 'draw';
        playerChoiceDisplay.classList.add('draw-animation');
        computerChoiceDisplay.classList.add('draw-animation');
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        // Player wins
        result = 'win';
        playerScore++;
        roundResultElement.textContent = 'You Win!';
        roundResultElement.className = 'win';
        playerChoiceDisplay.classList.add('win-animation');
        computerChoiceDisplay.classList.add('lose-animation');
    } else {
        // Computer wins
        result = 'lose';
        computerScore++;
        roundResultElement.textContent = 'Computer Wins!';
        roundResultElement.className = 'lose';
        playerChoiceDisplay.classList.add('lose-animation');
        computerChoiceDisplay.classList.add('win-animation');
    }
    
    // Update scores
    updateScores();
    
    // Add to game history
    gameHistory.push({
        round: roundNumber,
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        result: result
    });
}

// Update game history table
function updateHistory() {
    const latestRound = gameHistory[gameHistory.length - 1];
    
    const row = document.createElement('tr');
    
    // Round number
    const roundCell = document.createElement('td');
    roundCell.textContent = latestRound.round;
    row.appendChild(roundCell);
    
    // Player choice
    const playerChoiceCell = document.createElement('td');
    playerChoiceCell.innerHTML = choiceIcons[latestRound.playerChoice];
    row.appendChild(playerChoiceCell);
    
    // Computer choice
    const computerChoiceCell = document.createElement('td');
    computerChoiceCell.innerHTML = choiceIcons[latestRound.computerChoice];
    row.appendChild(computerChoiceCell);
    
    // Result
    const resultCell = document.createElement('td');
    if (latestRound.result === 'win') {
        resultCell.textContent = 'Win';
        resultCell.className = 'win';
    } else if (latestRound.result === 'lose') {
        resultCell.textContent = 'Loss';
        resultCell.className = 'lose';
    } else {
        resultCell.textContent = 'Draw';
        resultCell.className = 'draw';
    }
    row.appendChild(resultCell);
    
    // Add row to table
    historyBody.appendChild(row);
    
    // Scroll to bottom of history container
    const historyContainer = document.querySelector('.history-container');
    historyContainer.scrollTop = historyContainer.scrollHeight;
}

// Check if the game has ended
function checkGameEnd() {
    if (playerScore >= targetScore || computerScore >= targetScore) {
        gameActive = false;
        
        // Show game over message
        if (playerScore > computerScore) {
            messageTitle.textContent = 'Congratulations!';
            messageText.textContent = 'You won the game!';
        } else {
            messageTitle.textContent = 'Game Over';
            messageText.textContent = 'Computer won the game!';
        }
        
        finalScoreElement.textContent = `${playerScore} - ${computerScore}`;
        gameMessage.classList.add('show');
    }
}

// Event Listeners

// Choice selection
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        if (gameActive && !playerChoice) {
            handlePlayerChoice(choice.dataset.choice);
        }
    });
});

// New Game button
newGameBtn.addEventListener('click', initGame);

// Difficulty selector
difficultySelector.addEventListener('change', () => {
    difficulty = difficultySelector.value;
});

// Play Again button
playAgainBtn.addEventListener('click', () => {
    gameMessage.classList.remove('show');
    initGame();
});

// Close Message button
closeMessageBtn.addEventListener('click', () => {
    gameMessage.classList.remove('show');
});

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initGame);