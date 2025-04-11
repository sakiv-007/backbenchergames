// Word Search Game Script

// Game variables
let grid = [];
let words = [];
let foundWords = [];
let selectedCells = [];
let difficulty = 'medium';
let timer;
let seconds = 0;
let score = 0;
let hintsUsed = 0;
let gameActive = false;
let selectionMode = 'drag'; // 'drag' or 'click'

// Word lists by difficulty
const wordLists = {
    easy: [
        'CAT', 'DOG', 'SUN', 'RUN', 'FUN', 'HAT', 'MAP', 'BUG', 'CAR', 'BOX',
        'PEN', 'CUP', 'BAG', 'BED', 'TOY', 'KEY', 'JAR', 'LOG', 'FAN', 'MUG','MAP', 'PAD', 'PIN', 'TAP', 'CAP', 'BOX', 'CAN', 'BAT', 'HAT', 'RUG',
'MOP', 'POT', 'PAN', 'LID', 'JUG', 'TUB', 'BUN', 'TOY', 'BED', 'MAT',
'NET', 'LOG', 'PEG', 'BAR', 'TIP', 'GUN', 'BIB', 'JAM', 'LAP', 'INK',
'ZIP', 'TAB', 'TAG', 'JAW', 'GAP', 'KEY', 'NIB', 'PEN', 'BAG', 'CUP',
'MUG', 'FAN', 'CAB', 'RAG', 'JAR', 'SIP', 'LID', 'DEN', 'BOX', 'RIM'
    ],
    medium: [
        'APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EARTH', 'FLAME', 'GRAPE', 'HOUSE', 'JUICE', 'KITE',
        'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PIANO', 'QUEEN', 'RIVER', 'SNAKE', 'TABLE', 'WATER','BERRY', 'BREAD', 'CLOUD', 'CANDY', 'DRINK', 'DREAM', 'FLOOR', 'FRUIT', 'FIELD', 'GHOST',
'GLASS', 'GRASS', 'HONEY', 'HORSE', 'IGLOO', 'JELLY', 'KNIFE', 'LIVER', 'LEAFY', 'LIGHT',
'MANGO', 'MIRROR', 'MOUNT', 'NURSE', 'NOVEL', 'OLIVE', 'PAINT', 'PLANT', 'QUILL', 'ROBIN',
'SHEEP', 'SHINE', 'SHELL', 'SMILE', 'SPOON', 'SUGAR', 'TEETH', 'TIRED', 'TIGER', 'TRAIN',
'URBAN', 'VIOLET', 'VOICE', 'VINES', 'WAVES', 'WHEAT', 'WINDY', 'YACHT', 'YEAST', 'ZEBRA'
    ],
    hard: [
        'AMAZING', 'BICYCLE', 'CRYSTAL', 'DOLPHIN', 'ELEGANT', 'FANTASY', 'GRAVITY', 'HARMONY', 'JOURNEY', 'KINGDOM',
        'MYSTERY', 'NETWORK', 'OLYMPIC', 'PYRAMID', 'QUANTUM', 'RAINBOW', 'SYMPHONY', 'TORNADO', 'UNIVERSE', 'VOLCANO','ACCOUNT', 'BALANCE', 'CAPTURE', 'DESERTS', 'EXPLORE', 'FUSIONS', 'GALAXIE', 'GLITTER', 'HORIZON', 'IMAGINE',
'INSIGHT', 'JACKPOT', 'JUSTICE', 'KINDRED', 'LANTERN', 'LEGENDS', 'MISSION', 'MIRACLE', 'NATURES', 'NEBULAS',
'ORCHARD', 'PASSION', 'PHANTOM', 'PICTURE', 'QUAKING', 'RESCUEE', 'ROCKETS', 'SERENITY', 'SHADOWS', 'STELLAR',
'TRICKLE', 'TRAVELS', 'TWILIGHT', 'UNIFIED', 'VIRTUAL', 'VIOLETS', 'WANDERS', 'WILDLIFE', 'WONDERY', 'ZENITHS',
'ABYSSAL', 'BLOSSOM', 'CANYONS', 'DEEPSEA', 'ECLIPSE', 'FUSIONS', 'GLOWING', 'HEAVENS', 'ISLANDS', 'JUNGLES'
    ],
    devs: [
        'ALGORITHM', 'BLOCKCHAIN', 'COMPILER', 'DEBUGGING', 'ENCRYPTION', 'FRAMEWORK', 'GITIGNORE', 'HYPERTEXT', 'ITERATION', 'JAVASCRIPT',
        'KUBERNETES', 'LOCALHOST', 'MIDDLEWARE', 'NAMESPACE', 'OVERLOADING', 'PROTOTYPE', 'RECURSION', 'SERVERLESS', 'TYPESCRIPT', 'VIRTUALIZATION', 'VIKASKUMAR', 'BACKEND', 'BOOTSTRAP', 'CALLSTACK', 'CLOUDWARE', 'CONTAINER', 'DATABASE', 'DEPLOYMENT', 'DEVTOOLS', 'ENDPOINT',
        'FIREWALL', 'FRONTEND', 'FUNCTIONS', 'GARBAGE', 'HANDSHAKE', 'INSTANCE', 'INTERFACE', 'JAVABEANS', 'KEYLOGGER', 'LOADBAL',
        'MICROSERV', 'MULTITHRD', 'NODEJS', 'OBJECTIVE', 'OPERATING', 'PIPELINE', 'PLUGINS', 'QUERYING', 'REACTDOM', 'REACTHOOK',
        'REFACTOR', 'RENDERING', 'REPOSITORY', 'SCALABLE', 'SCRIPTING', 'SOCKETIO', 'STACKOVER', 'STRUCTURE', 'SYNCHRONY', 'THREADING',
        'UIKIT', 'USESTATE', 'VARIABLES', 'VSCODE', 'WEBSOCKET', 'WORKFLOW', 'WRAPPERS', 'XAMARIN', 'YARNLOCK', 'ZUSTAND'
    ]
};

// Grid sizes by difficulty
const gridSizes = {
    easy: 8,
    medium: 12,
    hard: 15,
    devs: 18
};

// DOM elements
const wordGridElement = document.getElementById('word-grid');
const wordListElement = document.getElementById('word-list');
const timeElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const difficultySelector = document.getElementById('difficulty');
const newGameBtn = document.getElementById('new-game-btn');
const hintBtn = document.getElementById('hint-btn');
const endGameBtn = document.getElementById('end-game-btn');
const gameMessage = document.getElementById('game-message');
const messageTitle = document.getElementById('message-title');
const messageText = document.getElementById('message-text');
const finalTimeElement = document.getElementById('final-time');
const finalScoreElement = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');
const selectionModeToggle = document.createElement('button');
selectionModeToggle.id = 'selection-mode-toggle';
selectionModeToggle.className = 'btn';
selectionModeToggle.innerHTML = '<i class="fas fa-hand-pointer"></i> Click Mode';
selectionModeToggle.title = 'Toggle between drag and click selection modes';

// Add selection mode toggle button to game controls
document.querySelector('.game-controls').appendChild(selectionModeToggle);

// Add event listener for selection mode toggle
selectionModeToggle.addEventListener('click', toggleSelectionMode);

// Function to toggle selection mode
function toggleSelectionMode() {
    selectionMode = selectionMode === 'drag' ? 'click' : 'drag';
    updateSelectionModeButton();
    clearSelection();
}

// Update selection mode button text and icon
function updateSelectionModeButton() {
    if (selectionMode === 'drag') {
        selectionModeToggle.innerHTML = '<i class="fas fa-hand-pointer"></i> Click Mode';
    } else {
        selectionModeToggle.innerHTML = '<i class="fas fa-arrows-alt"></i> Drag Mode';
    }
}

// Initialize the game
function initGame() {
    // Reset game state
    grid = [];
    words = [];
    foundWords = [];
    selectedCells = [];
    seconds = 0;
    score = 0;
    hintsUsed = 0;
    gameActive = true;
    
    // Update UI
    updateScore();
    updateTimer();
    updateSelectionModeButton();
    
    // Get difficulty
    difficulty = difficultySelector.value;
    
    // Generate grid and words
    const gridSize = gridSizes[difficulty];
    generateGrid(gridSize);
    
    // Start timer
    if (timer) clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    // Hide game message if visible
    gameMessage.classList.remove('show');
}

// Generate the word search grid
function generateGrid(size) {
    // Clear previous grid and word list
    wordGridElement.innerHTML = '';
    wordListElement.innerHTML = '';
    
    // Set grid size
    wordGridElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    wordGridElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    
    // Initialize empty grid
    grid = Array(size).fill().map(() => Array(size).fill(''));
    
    // Select random words based on difficulty
    const availableWords = [...wordLists[difficulty]];
    const numWords = difficulty === 'easy' ? 6 : 
                     (difficulty === 'medium' ? 8 : 
                     (difficulty === 'hard' ? 10 : 12)); // 12 words for devs challenge
    words = [];
    
    for (let i = 0; i < numWords; i++) {
        if (availableWords.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        words.push(availableWords[randomIndex]);
        availableWords.splice(randomIndex, 1);
    }
    
    // Place words in the grid
    placeWords(words, size);
    
    // Fill remaining cells with random letters
    fillEmptyCells();
    
    // Render the grid
    renderGrid();
    
    // Render the word list
    renderWordList();
}

// Place words in the grid
function placeWords(words, size) {
    // Sort words by length (longest first)
    words.sort((a, b) => b.length - a.length);
    
    // For DEV's Challenge, use non-linear word placement
    if (difficulty === 'devs') {
        placeNonLinearWords(words, size);
        return;
    }
    
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            
            // Random direction (0-7)
            // 0: right, 1: down-right, 2: down, 3: down-left, 4: left, 5: up-left, 6: up, 7: up-right
            const direction = Math.floor(Math.random() * 8);
            
            // Direction vectors
            const dx = [1, 1, 0, -1, -1, -1, 0, 1][direction];
            const dy = [0, 1, 1, 1, 0, -1, -1, -1][direction];
            
            // Random starting position
            const startX = Math.floor(Math.random() * size);
            const startY = Math.floor(Math.random() * size);
            
            // Check if word fits
            if (wordFits(word, startX, startY, dx, dy, size)) {
                // Place the word
                for (let i = 0; i < word.length; i++) {
                    const x = startX + i * dx;
                    const y = startY + i * dy;
                    grid[y][x] = word[i];
                }
                placed = true;
            }
        }
        
        // If word couldn't be placed after max attempts, remove it from the list
        if (!placed) {
            const index = words.indexOf(word);
            if (index !== -1) {
                words.splice(index, 1);
            }
        }
    }
}

// Place words in non-linear patterns for DEV's Challenge
function placeNonLinearWords(words, size) {
    // Store the path of each word for validation later
    window.wordPaths = {};
    
    for (const word of words) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 150; // More attempts for complex placement
        
        while (!placed && attempts < maxAttempts) {
            attempts++;
            
            // Random starting position
            const startX = Math.floor(Math.random() * size);
            const startY = Math.floor(Math.random() * size);
            
            // Try to place the word using a random path
            const path = generateRandomPath(word, startX, startY, size);
            
            if (path.length === word.length) {
                // Place the word along the path
                for (let i = 0; i < path.length; i++) {
                    const {x, y} = path[i];
                    grid[y][x] = word[i];
                }
                
                // Store the path for this word
                window.wordPaths[word] = path;
                placed = true;
            }
        }
        
        // If word couldn't be placed after max attempts, remove it from the list
        if (!placed) {
            const index = words.indexOf(word);
            if (index !== -1) {
                words.splice(index, 1);
            }
        }
    }
}

// Generate a random path for a word
function generateRandomPath(word, startX, startY, size) {
    const path = [{x: startX, y: startY}];
    const visited = new Set([`${startX},${startY}`]);
    
    // Direction vectors for all 8 directions
    const directions = [
        {dx: 1, dy: 0},   // right
        {dx: 1, dy: 1},   // down-right
        {dx: 0, dy: 1},   // down
        {dx: -1, dy: 1},  // down-left
        {dx: -1, dy: 0},  // left
        {dx: -1, dy: -1}, // up-left
        {dx: 0, dy: -1},  // up
        {dx: 1, dy: -1}   // up-right
    ];
    
    for (let i = 1; i < word.length; i++) {
        const lastPos = path[path.length - 1];
        const validMoves = [];
        
        // Shuffle directions for randomness
        const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
        
        for (const {dx, dy} of shuffledDirections) {
            const newX = lastPos.x + dx;
            const newY = lastPos.y + dy;
            const key = `${newX},${newY}`;
            
            // Check if position is valid and not visited
            if (newX >= 0 && newX < size && newY >= 0 && newY < size && 
                !visited.has(key) && 
                (grid[newY][newX] === '' || grid[newY][newX] === word[i])) {
                validMoves.push({x: newX, y: newY});
            }
        }
        
        if (validMoves.length === 0) {
            // No valid moves, path failed
            return [];
        }
        
        // Choose a random valid move
        const nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        path.push(nextMove);
        visited.add(`${nextMove.x},${nextMove.y}`);
    }
    
    return path;
}

// Check if a word fits in the grid at the given position and direction
function wordFits(word, startX, startY, dx, dy, size) {
    // Check if word goes out of bounds
    const endX = startX + (word.length - 1) * dx;
    const endY = startY + (word.length - 1) * dy;
    
    if (endX < 0 || endX >= size || endY < 0 || endY >= size) {
        return false;
    }
    
    // Check if word overlaps with existing letters
    for (let i = 0; i < word.length; i++) {
        const x = startX + i * dx;
        const y = startY + i * dy;
        
        // If cell is not empty, check if it's the same letter
        if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
            return false;
        }
    }
    
    return true;
}

// Fill empty cells with random letters
function fillEmptyCells() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '') {
                const randomIndex = Math.floor(Math.random() * letters.length);
                grid[y][x] = letters[randomIndex];
            }
        }
    }
}

// Render the grid
function renderGrid() {
    wordGridElement.innerHTML = '';
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.textContent = grid[y][x];
            cell.dataset.x = x;
            cell.dataset.y = y;
            
            // Add mouse event listeners
            cell.addEventListener('mousedown', startSelection);
            cell.addEventListener('mouseover', updateSelection);
            cell.addEventListener('click', handleCellClick);
            
            // Add touch event listeners for mobile devices
            cell.addEventListener('touchstart', handleTouchStart, { passive: false });
            cell.addEventListener('touchmove', handleTouchMove, { passive: false });
            
            wordGridElement.appendChild(cell);
        }
    }
    
    // Add mouseup and touchend events to the document
    document.addEventListener('mouseup', endSelection);
    document.addEventListener('touchend', endTouchSelection);
    document.addEventListener('touchcancel', endTouchSelection);
}

// Render the word list
function renderWordList() {
    wordListElement.innerHTML = '';
    
    for (const word of words) {
        const li = document.createElement('li');
        li.textContent = word;
        li.dataset.word = word;
        wordListElement.appendChild(li);
    }
}

// Start word selection
function startSelection(e) {
    if (!gameActive || selectionMode === 'click') return;
    
    // Clear previous selection
    clearSelection();
    
    // Add first cell to selection
    const cell = e.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    
    selectedCells.push({ x, y, element: cell });
    cell.classList.add('selected');
}

// Update word selection
function updateSelection(e) {
    if (!gameActive || selectedCells.length === 0 || selectionMode === 'click') return;
    
    const cell = e.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    
    // Check if cell is already in selection
    const isSelected = selectedCells.some(c => c.x === x && c.y === y);
    if (isSelected) return;
    
    // For DEV's Challenge, allow non-linear selection
    if (difficulty === 'devs') {
        // Check if the cell is adjacent to the last selected cell
        const lastCell = selectedCells[selectedCells.length - 1];
        const dx = Math.abs(x - lastCell.x);
        const dy = Math.abs(y - lastCell.y);
        
        // Cell must be adjacent (including diagonals)
        if (dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
            selectedCells.push({ x, y, element: cell });
            cell.classList.add('selected');
        }
        return;
    }
    
    // For other difficulties, maintain the original straight-line selection
    // Check if cell is in a valid direction from the first cell
    const firstCell = selectedCells[0];
    const dx = x - firstCell.x;
    const dy = y - firstCell.y;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return;
    
    // Clear previous selection except the first cell
    while (selectedCells.length > 1) {
        const cell = selectedCells.pop();
        cell.element.classList.remove('selected');
    }
    
    // Calculate all cells in the line between first cell and current cell
    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 1; i <= steps; i++) {
        const newX = firstCell.x + i * stepX;
        const newY = firstCell.y + i * stepY;
        const newCell = document.querySelector(`.grid-cell[data-x="${newX}"][data-y="${newY}"]`);
        
        if (newCell) {
            selectedCells.push({ x: newX, y: newY, element: newCell });
            newCell.classList.add('selected');
        }
    }
}

// Handle touch start event for mobile devices
function handleTouchStart(e) {
    if (!gameActive) return;
    
    // Prevent default to avoid scrolling
    e.preventDefault();
    
    // If in click mode, handle as a click
    if (selectionMode === 'click') {
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('grid-cell')) {
            handleCellClick({ target: element });
        }
        return;
    }
    
    // Clear previous selection
    clearSelection();
    
    // Get touch coordinates
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('grid-cell')) {
        const x = parseInt(element.dataset.x);
        const y = parseInt(element.dataset.y);
        
        selectedCells.push({ x, y, element: element });
        element.classList.add('selected');
    }
}

// Handle touch move event for mobile devices
function handleTouchMove(e) {
    if (!gameActive || selectedCells.length === 0 || selectionMode === 'click') return;
    
    // Prevent default to avoid scrolling
    e.preventDefault();
    
    // Get touch coordinates
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (!element || !element.classList.contains('grid-cell')) return;
    
    const x = parseInt(element.dataset.x);
    const y = parseInt(element.dataset.y);
    
    // Check if cell is already in selection
    const isSelected = selectedCells.some(c => c.x === x && c.y === y);
    if (isSelected) return;
    
    // For DEV's Challenge, allow non-linear selection
    if (difficulty === 'devs') {
        // Check if the cell is adjacent to the last selected cell
        const lastCell = selectedCells[selectedCells.length - 1];
        const dx = Math.abs(x - lastCell.x);
        const dy = Math.abs(y - lastCell.y);
        
        // Cell must be adjacent (including diagonals)
        if (dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0)) {
            selectedCells.push({ x, y, element: element });
            element.classList.add('selected');
        }
        return;
    }
    
    // For other difficulties, maintain the original straight-line selection
    // Check if cell is in a valid direction from the first cell
    const firstCell = selectedCells[0];
    const dx = x - firstCell.x;
    const dy = y - firstCell.y;
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (dx !== 0 && dy !== 0 && Math.abs(dx) !== Math.abs(dy)) return;
    
    // Clear previous selection except the first cell
    while (selectedCells.length > 1) {
        const cell = selectedCells.pop();
        cell.element.classList.remove('selected');
    }
    
    // Calculate all cells in the line between first cell and current cell
    const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
    const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 1; i <= steps; i++) {
        const newX = firstCell.x + i * stepX;
        const newY = firstCell.y + i * stepY;
        const newCell = document.querySelector(`.grid-cell[data-x="${newX}"][data-y="${newY}"]`);
        
        if (newCell) {
            selectedCells.push({ x: newX, y: newY, element: newCell });
            newCell.classList.add('selected');
        }
    }
}

// End touch selection for mobile devices
function endTouchSelection(e) {
    if (selectionMode === 'drag') {
        validateSelection();
    } else if (selectionMode === 'click' && selectedCells.length >= 2) {
        // Also validate in click mode if we have enough cells selected
        checkForValidWord();
    }
}

// End word selection
function endSelection() {
    if (selectionMode === 'drag') {
        validateSelection();
    } else if (selectionMode === 'click' && selectedCells.length >= 2) {
        // Also validate in click mode if we have enough cells selected
        checkForValidWord();
    }
}

// Handle cell click for click selection mode
function handleCellClick(e) {
    if (!gameActive || selectionMode !== 'click') return;
    
    const cell = e.target;
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    
    // Check if cell is already in selection
    const existingIndex = selectedCells.findIndex(c => c.x === x && c.y === y);
    
    if (existingIndex !== -1) {
        // If clicking the last cell added, remove it
        if (existingIndex === selectedCells.length - 1) {
            const removedCell = selectedCells.pop();
            removedCell.element.classList.remove('selected');
            updateSelectionNumbers();
            
            // Check if remaining selection forms a valid word
            if (selectedCells.length >= 2) {
                checkForValidWord();
            } else {
                clearSelection();
            }
        } 
        // If clicking any other selected cell, clear all cells after it
        else {
            for (let i = selectedCells.length - 1; i > existingIndex; i--) {
                const removedCell = selectedCells.pop();
                removedCell.element.classList.remove('selected');
            }
            updateSelectionNumbers();
            
            // Check if remaining selection forms a valid word
            if (selectedCells.length >= 2) {
                checkForValidWord();
            } else {
                clearSelection();
            }
        }
    } else {
        // Add cell to selection if it's valid
        if (difficulty === 'devs') {
            // For DEV's Challenge, cell must be adjacent to the last selected cell
            if (selectedCells.length === 0 || isAdjacent(x, y, selectedCells[selectedCells.length - 1])) {
                selectedCells.push({ x, y, element: cell });
                cell.classList.add('selected');
                updateSelectionNumbers();
                
                // Get current selected letters
                const currentWord = selectedCells.map(c => grid[c.y][c.x]).join('');
                
                // Check if current selection matches any word exactly
                const exactMatch = words.find(word => 
                    (word === currentWord || word === currentWord.split('').reverse().join('')) &&
                    !foundWords.includes(word)
                );
                
                if (exactMatch) {
                    checkForValidWord();
                }
            }
        } else {
            // For other difficulties, first cell can be anywhere
            if (selectedCells.length === 0) {
                selectedCells.push({ x, y, element: cell });
                cell.classList.add('selected');
                updateSelectionNumbers();
            } 
            // Subsequent cells must form a straight line from the first cell
            else if (selectedCells.length === 1 || isInLine(x, y, selectedCells[0], selectedCells[selectedCells.length - 1])) {
                selectedCells.push({ x, y, element: cell });
                cell.classList.add('selected');
                updateSelectionNumbers();
                
                // Get current selected letters
                const currentWord = selectedCells.map(c => grid[c.y][c.x]).join('');
                
                // Check if current selection matches any word exactly
                const exactMatch = words.find(word => 
                    (word === currentWord || word === currentWord.split('').reverse().join('')) &&
                    !foundWords.includes(word)
                );
                
                if (exactMatch) {
                    checkForValidWord();
                }
            }
        }
    }
}

// Check if a cell is adjacent to another cell
function isAdjacent(x, y, cell) {
    const dx = Math.abs(x - cell.x);
    const dy = Math.abs(y - cell.y);
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
}

// Check if a cell is in line with the first and last cells
function isInLine(x, y, firstCell, lastCell) {
    // Calculate direction from first cell to last cell
    const dirX = lastCell.x - firstCell.x;
    const dirY = lastCell.y - firstCell.y;
    
    // If first and last cell are the same, any direction is valid
    if (dirX === 0 && dirY === 0) return true;
    
    // Check if new point is in the same direction
    const newDirX = x - firstCell.x;
    const newDirY = y - firstCell.y;
    
    // For straight lines (horizontal, vertical, diagonal)
    if (dirX === 0) return newDirX === 0; // Vertical line
    if (dirY === 0) return newDirY === 0; // Horizontal line
    
    // For diagonal lines
    return Math.abs(newDirX / dirX - newDirY / dirY) < 0.001; // Allow small floating point errors
}

// Validate the current selection
function validateSelection(clearIfInvalid = true) {
    if (!gameActive || selectedCells.length === 0) return;
    
    // Get the letters from selected cells to form a word
    const selectedWord = selectedCells.map(cell => {
        return grid[cell.y][cell.x];
    }).join('');
    
    // For DEV's Challenge, check if the letters match any word in any order
    if (difficulty === 'devs') {
        validateNonLinearSelection();
        return;
    }
    
    // Check if the selected letters form a word in our word list
    // Compare the actual string of letters, not the specific cells
    const wordIndex = words.findIndex(word => 
        (word === selectedWord || word === selectedWord.split('').reverse().join('')) &&
        !foundWords.includes(word)
    );
    
    if (wordIndex !== -1) {
        // Word found!
        foundWords.push(words[wordIndex]);
        
        // Mark cells as found
        selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.add('found');
        });
        
        // Mark word as found in the list
        const wordElement = document.querySelector(`li[data-word="${words[wordIndex]}"]`);
        if (wordElement) {
            wordElement.classList.add('found');
        }
        
        // Update score
        updateScore(words[wordIndex]);
        
        // Reset selection
        selectedCells = [];
        
        // Check if all words are found
        if (foundWords.length === words.length) {
            endGame(true);
        }
    } else if (clearIfInvalid) {
        // Word not found, clear selection
        clearSelection();
    }
}

// Validate non-linear word selection for DEV's Challenge
function validateNonLinearSelection() {
    if (selectedCells.length === 0) return false;
    
    // Get the letters from selected cells - we focus on the actual letters, not the specific cells
    const selectedLetters = selectedCells.map(cell => grid[cell.y][cell.x]);
    
    // Check each word that hasn't been found yet
    for (const word of words) {
        if (foundWords.includes(word)) continue;
        
        // Check if the selected letters match the word (regardless of order)
        // This validates based on the letters themselves, not the specific cells they came from
        if (selectedLetters.length === word.length) {
            // Create a copy of the word's letters to mark off as we find matches
            const wordLetters = word.split('');
            const matchedIndices = [];
            
            // Try to match each selected letter to a letter in the word
            // This ensures we're comparing the actual letters, not the cell positions
            for (let i = 0; i < selectedLetters.length; i++) {
                const letterIndex = wordLetters.indexOf(selectedLetters[i]);
                if (letterIndex !== -1) {
                    // Found a match, remove this letter from wordLetters so we don't match it again
                    wordLetters.splice(letterIndex, 1);
                    matchedIndices.push(i);
                }
            }
            
            // If all letters matched, we found the word
            if (wordLetters.length === 0) {
                // Word found!
                foundWords.push(word);
                
                // Mark cells as found
                selectedCells.forEach(cell => {
                    cell.element.classList.remove('selected');
                    cell.element.classList.add('found');
                });
                
                // Mark word as found in the list
                const wordElement = document.querySelector(`li[data-word="${word}"]`);
                if (wordElement) {
                    wordElement.classList.add('found');
                }
                
                // Update score
                updateScore(word);
                
                // Reset selection array to allow new selections
                selectedCells = [];
                
                // Check if all words are found
                if (foundWords.length === words.length) {
                    endGame(true);
                }
                
                return true; // Return true to indicate a match was found
            }
        }
    }
    
    // Don't clear selection if no word was found
    // This allows users to continue selecting cells for longer words
    return false; // Return false to indicate no match was found
}

// Clear cell selection
function clearSelection() {
    selectedCells.forEach(cell => {
        cell.element.classList.remove('selected');
        // Remove any selection number indicators
        const indicator = cell.element.querySelector('.selection-number');
        if (indicator) {
            cell.element.removeChild(indicator);
        }
    });
    selectedCells = [];
}

// Check if current selection forms a valid word
function checkForValidWord() {
    if (selectedCells.length < 2) return false; // Need at least 2 letters to start checking
    
    // Get the selected word by extracting letters from the selected cells
    const selectedWord = selectedCells.map(cell => {
        return grid[cell.y][cell.x];
    }).join('');
    
    // For DEV's Challenge, check if the letters match any word in any order
    if (difficulty === 'devs') {
        // Check if the selection matches any word
        const wordMatch = validateNonLinearSelection();
        if (wordMatch) {
            // Word found - handled in validateNonLinearSelection
            return true;
        }
        // Don't clear selection if no match - allow user to continue selecting
        return false;
    }
    
    // For other difficulties, check if the selected letters form a word
    // Compare the actual string of letters, not the specific cells
    // Check if the selected word matches any word in the list (forward or backward)
    const wordIndex = words.findIndex(word => 
        (word === selectedWord || word === selectedWord.split('').reverse().join('')) && 
        !foundWords.includes(word)
    );
    
    // If we found a match, validate the selection immediately
    if (wordIndex !== -1) {
        // Word found!
        foundWords.push(words[wordIndex]);
        
        // Mark cells as found
        selectedCells.forEach(cell => {
            cell.element.classList.remove('selected');
            cell.element.classList.add('found');
        });
        
        // Mark word as found in the list
        const wordElement = document.querySelector(`li[data-word="${words[wordIndex]}"]`);
        if (wordElement) {
            wordElement.classList.add('found');
        }
        
        // Update score
        updateScore(words[wordIndex]);
        
        // Reset selection
        selectedCells = [];
        
        // Check if all words are found
        if (foundWords.length === words.length) {
            endGame(true);
        }
        
        // Return true to indicate a word was found
        return true;
    }
    
    // In click mode, check if we have a complete word length (even if not matching)
    if (selectionMode === 'click') {
        // Check if we have a complete word length but no match
        const matchingLengthWord = words.find(word => 
            word.length === selectedWord.length && !foundWords.includes(word)
        );
        
        if (matchingLengthWord) {
            // Briefly highlight cells in red to indicate invalid word
            selectedCells.forEach(cell => {
                cell.element.classList.add('invalid');
                setTimeout(() => {
                    cell.element.classList.remove('invalid');
                }, 300);
            });
        }
    }
    
    // Don't clear selection if no match is found
    // This allows users to select words longer than the current selection
    
    // Return false to indicate no word was found
    return false;
}

// Update selection numbers for click mode
function updateSelectionNumbers() {
    // First remove all existing selection numbers
    document.querySelectorAll('.selection-number').forEach(el => el.remove());
    
    // Then add new ones based on current selection
    selectedCells.forEach((cell, index) => {
        const numberIndicator = document.createElement('span');
        numberIndicator.className = 'selection-number';
        numberIndicator.textContent = index + 1;
        cell.element.appendChild(numberIndicator);
    });
}

// Update the score
function updateScore(foundWord = null) {
    if (foundWord) {
        // Base points for finding a word
        let points = 10;
        
        // Bonus points based on word length
        points += foundWord.length * 5;
        
        // Bonus points based on difficulty
        if (difficulty === 'medium') points *= 1.5;
        if (difficulty === 'hard') points *= 2;
        if (difficulty === 'devs') points *= 3; // Higher bonus for DEV's Challenge
        
        // Penalty for using hints
        if (hintsUsed > 0) {
            points *= (1 - (hintsUsed * 0.1));
        }
        
        // Add to score
        score += Math.floor(points);
    }
    
    // Update score display
    scoreElement.textContent = score;
}

// Update the timer
function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Provide a hint
function giveHint() {
    if (!gameActive || foundWords.length === words.length) return;
    
    // Increase hint counter
    hintsUsed++;
    
    // Find a word that hasn't been found yet
    const remainingWords = words.filter(word => !foundWords.includes(word));
    if (remainingWords.length === 0) return;
    
    // Select a random word to hint
    const wordToHint = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    
    // Find the word in the grid
    const wordCells = findWordInGrid(wordToHint);
    
    if (wordCells.length > 0) {
        // For DEV's Challenge, highlight more letters to help with non-linear patterns
        if (difficulty === 'devs') {
            // Highlight the first 2-3 letters (depending on word length)
            const numToHighlight = Math.min(Math.ceil(wordToHint.length / 3), 3);
            
            for (let i = 0; i < numToHighlight; i++) {
                const cell = wordCells[i];
                const cellElement = document.querySelector(`.grid-cell[data-x="${cell.x}"][data-y="${cell.y}"]`);
                
                if (cellElement) {
                    cellElement.classList.add('hint-highlight');
                    setTimeout(() => {
                        cellElement.classList.remove('hint-highlight');
                    }, 3000);
                }
            }
        } else {
            // For other difficulties, just highlight the first letter
            const firstCell = wordCells[0];
            const cellElement = document.querySelector(`.grid-cell[data-x="${firstCell.x}"][data-y="${firstCell.y}"]`);
            
            if (cellElement) {
                cellElement.classList.add('hint-highlight');
                setTimeout(() => {
                    cellElement.classList.remove('hint-highlight');
                }, 3000);
            }
        }
    }
}

// Find a word in the grid
function findWordInGrid(word) {
    const size = grid.length;
    const cells = [];
    
    // For DEV's Challenge, use stored word paths
    if (difficulty === 'devs' && window.wordPaths && window.wordPaths[word]) {
        return window.wordPaths[word];
    }
    
    // Check all possible directions and starting positions
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Skip if the first letter doesn't match
            if (grid[y][x] !== word[0]) continue;
            
            // Check all 8 directions
            for (let dir = 0; dir < 8; dir++) {
                const dx = [1, 1, 0, -1, -1, -1, 0, 1][dir];
                const dy = [0, 1, 1, 1, 0, -1, -1, -1][dir];
                
                let found = true;
                const wordCells = [];
                
                // Check if word fits in this direction
                for (let i = 0; i < word.length; i++) {
                    const newX = x + i * dx;
                    const newY = y + i * dy;
                    
                    // Check bounds
                    if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
                        found = false;
                        break;
                    }
                    
                    // Check letter
                    if (grid[newY][newX] !== word[i]) {
                        found = false;
                        break;
                    }
                    
                    wordCells.push({ x: newX, y: newY });
                }
                
                if (found) {
                    return wordCells;
                }
            }
        }
    }
    
    return [];
}

// End the game
function endGame(won = false) {
    gameActive = false;
    clearInterval(timer);
    
    // Show game message
    if (won) {
        messageTitle.textContent = 'Congratulations!';
        messageText.textContent = 'You found all the words!';
    } else {
        messageTitle.textContent = 'Game Over';
        messageText.textContent = 'Better luck next time!';
    }
    
    finalTimeElement.textContent = timeElement.textContent;
    finalScoreElement.textContent = score;
    gameMessage.classList.add('show');
}

// Event listeners
difficultySelector.addEventListener('change', () => {
    difficulty = difficultySelector.value;
});

newGameBtn.addEventListener('click', initGame);
hintBtn.addEventListener('click', giveHint);
endGameBtn.addEventListener('click', endGameEarly);
playAgainBtn.addEventListener('click', initGame);

// Close message button event listener
const closeMessageBtn = document.getElementById('close-message-btn');
closeMessageBtn.addEventListener('click', () => {
    gameMessage.classList.remove('show');
});

// Initialize the game when the page loads
window.addEventListener('load', initGame);

// Prevent context menu on right-click
wordGridElement.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent default touch behavior on the word grid to avoid scrolling issues on mobile
wordGridElement.addEventListener('touchstart', (e) => {
    e.preventDefault();
}, { passive: false });

wordGridElement.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

wordGridElement.addEventListener('touchend', (e) => {
    e.preventDefault();
}, { passive: false });


// Distinct colors for highlighting different words
const wordColors = [
    '#FF5252', // Red
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#FFC107', // Amber
    '#9C27B0', // Purple
    '#00BCD4', // Cyan
    '#FF9800', // Orange
    '#E91E63', // Pink
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#795548', // Brown
    '#607D8B', // Blue Grey
    '#CDDC39', // Lime
    '#F44336', // Deep Red
    '#8BC34A', // Light Green
    '#673AB7', // Deep Purple
    '#FFEB3B', // Yellow
    '#03A9F4', // Light Blue
    '#FF4081', // Pink Accent
    '#64FFDA'  // Teal Accent
];

// Function to end game early and highlight all remaining words
function endGameEarly() {
    if (!gameActive) return;
    
    // Find all remaining words and highlight them
    const remainingWords = words.filter(word => !foundWords.includes(word));
    
    // Highlight each remaining word with a different color
    remainingWords.forEach((word, index) => {
        const wordCells = findWordInGrid(word);
        const wordColor = wordColors[index % wordColors.length];
        
        if (wordCells.length > 0) {
            // Mark cells as found with a unique color
            wordCells.forEach(cell => {
                const cellElement = document.querySelector(`.grid-cell[data-x="${cell.x}"][data-y="${cell.y}"]`);
                if (cellElement) {
                    cellElement.classList.add('auto-found');
                    cellElement.style.backgroundColor = wordColor;
                    cellElement.style.color = '#ffffff';
                }
            });
            
            // Mark word as found in the list with the same color
            const wordElement = document.querySelector(`li[data-word="${word}"]`);
            if (wordElement) {
                wordElement.classList.add('auto-found');
                wordElement.style.backgroundColor = wordColor;
                wordElement.style.color = '#ffffff';
                wordElement.style.padding = '2px 8px';
                wordElement.style.borderRadius = '4px';
            }
        }
    });
    
    // End the game
    gameActive = false;
    clearInterval(timer);
    
    // Show game message
    messageTitle.textContent = 'Game Ended';
    messageText.textContent = 'You ended the game early. All remaining words have been highlighted in different colors.';
    finalTimeElement.textContent = timeElement.textContent;
    finalScoreElement.textContent = score;
    gameMessage.classList.add('show');
}