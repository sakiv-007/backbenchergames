/**
 * Dots and Boxes AI Implementation
 * This AI uses minimax algorithm with alpha-beta pruning and strategic heuristics
 * to make optimal moves in the Dots and Boxes game.
 */

class DotsAndBoxesAI {
    constructor(gameBoard, gridSize) {
        this.gameBoard = gameBoard;
        this.gridSize = gridSize;
        this.maxDepth = 3; // Adjust based on grid size for performance
    }

    /**
     * Makes the best move for the AI
     * @param {Array} availableLines - Array of available lines
     * @param {Array} boxes - Current state of boxes
     * @returns {Object} The selected line
     */
    makeMove(availableLines, boxes) {
        if (availableLines.length === 0) return null;
        
        // If there's only one move left, just take it
        if (availableLines.length === 1) return availableLines[0];
        
        // Adjust max depth based on remaining moves for performance
        if (availableLines.length < 10) {
            this.maxDepth = 5;
        } else if (availableLines.length < 20) {
            this.maxDepth = 3;
        } else {
            this.maxDepth = 2;
        }

        // Look for boxes that can be completed immediately
        const immediateCompletionMove = this.findBoxCompletionMove(availableLines, boxes);
        if (immediateCompletionMove) {
            return immediateCompletionMove;
        }

        // Look for safe moves (that don't set up the opponent)
        const safeMoves = this.findSafeMoves(availableLines, boxes);
        if (safeMoves.length > 0) {
            // Choose a random safe move
            return safeMoves[Math.floor(Math.random() * safeMoves.length)];
        }

        // If no safe moves, use minimax to find the best move
        let bestScore = -Infinity;
        let bestMove = null;

        for (const line of availableLines) {
            // Create a copy of the game state
            const newAvailableLines = availableLines.filter(l => 
                l.row !== line.row || l.col !== line.col || l.orientation !== line.orientation);
            
            // Check if this move completes a box
            const boxesCompleted = this.simulateMove(line, boxes);
            
            // If boxes are completed, AI gets another turn
            let score;
            if (boxesCompleted > 0) {
                // Recursive call for chain moves
                const nextMove = this.makeMove(newAvailableLines, this.updateBoxes(boxes, line));
                score = boxesCompleted + (nextMove ? this.evaluateMove(nextMove, newAvailableLines, boxes) : 0);
            } else {
                // Evaluate opponent's best response
                score = -this.minimax(newAvailableLines, this.updateBoxes(boxes, line), 0, -Infinity, Infinity, false);
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = line;
            }
        }

        return bestMove || availableLines[Math.floor(Math.random() * availableLines.length)];
    }

    /**
     * Minimax algorithm with alpha-beta pruning
     */
    minimax(availableLines, boxes, depth, alpha, beta, isMaximizing) {
        // Terminal conditions
        if (depth >= this.maxDepth || availableLines.length === 0) {
            return this.evaluateBoard(boxes);
        }

        if (isMaximizing) {
            let maxScore = -Infinity;
            for (const line of availableLines) {
                const newAvailableLines = availableLines.filter(l => 
                    l.row !== line.row || l.col !== line.col || l.orientation !== line.orientation);
                
                const boxesCompleted = this.simulateMove(line, boxes);
                let score;
                
                if (boxesCompleted > 0) {
                    // If boxes completed, same player gets another turn
                    score = boxesCompleted + this.minimax(newAvailableLines, this.updateBoxes(boxes, line), depth, alpha, beta, true);
                } else {
                    score = this.minimax(newAvailableLines, this.updateBoxes(boxes, line), depth + 1, alpha, beta, false);
                }
                
                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            for (const line of availableLines) {
                const newAvailableLines = availableLines.filter(l => 
                    l.row !== line.row || l.col !== line.col || l.orientation !== line.orientation);
                
                const boxesCompleted = this.simulateMove(line, boxes);
                let score;
                
                if (boxesCompleted > 0) {
                    // If boxes completed, same player gets another turn
                    score = -boxesCompleted + this.minimax(newAvailableLines, this.updateBoxes(boxes, line), depth, alpha, beta, false);
                } else {
                    score = this.minimax(newAvailableLines, this.updateBoxes(boxes, line), depth + 1, alpha, beta, true);
                }
                
                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);
                if (beta <= alpha) break; // Alpha-beta pruning
            }
            return minScore;
        }
    }

    /**
     * Finds moves that complete a box
     */
    findBoxCompletionMove(availableLines, boxes) {
        for (const line of availableLines) {
            if (this.simulateMove(line, boxes) > 0) {
                return line;
            }
        }
        return null;
    }

    /**
     * Finds moves that don't set up the opponent to complete a box
     */
    findSafeMoves(availableLines, boxes) {
        return availableLines.filter(line => {
            // Check if this move would create a box with 3 sides
            const newBoxes = this.updateBoxes(boxes, line);
            for (const box of newBoxes) {
                if (box.sides === 3) {
                    return false; // This move would set up the opponent
                }
            }
            return true;
        });
    }

    /**
     * Simulates a move and returns the number of boxes completed
     */
    simulateMove(line, boxes) {
        let boxesCompleted = 0;
        const { row, col, orientation } = line;
        
        // Check if horizontal line
        if (orientation === 'horizontal') {
            // Check box above
            if (row > 0) {
                const boxAbove = boxes.find(b => b.row === row - 1 && b.col === col);
                if (boxAbove && boxAbove.sides === 3) {
                    boxesCompleted++;
                }
            }
            // Check box below
            if (row < this.gridSize) {
                const boxBelow = boxes.find(b => b.row === row && b.col === col);
                if (boxBelow && boxBelow.sides === 3) {
                    boxesCompleted++;
                }
            }
        } 
        // Check if vertical line
        else if (orientation === 'vertical') {
            // Check box to the left
            if (col > 0) {
                const boxLeft = boxes.find(b => b.row === row && b.col === col - 1);
                if (boxLeft && boxLeft.sides === 3) {
                    boxesCompleted++;
                }
            }
            // Check box to the right
            if (col < this.gridSize) {
                const boxRight = boxes.find(b => b.row === row && b.col === col);
                if (boxRight && boxRight.sides === 3) {
                    boxesCompleted++;
                }
            }
        }
        
        return boxesCompleted;
    }

    /**
     * Updates the boxes state after a move
     */
    updateBoxes(boxes, line) {
        const newBoxes = JSON.parse(JSON.stringify(boxes)); // Deep copy
        const { row, col, orientation } = line;
        
        if (orientation === 'horizontal') {
            // Update box above
            if (row > 0) {
                const boxIndex = newBoxes.findIndex(b => b.row === row - 1 && b.col === col);
                if (boxIndex !== -1) {
                    newBoxes[boxIndex].sides++;
                }
            }
            // Update box below
            if (row < this.gridSize) {
                const boxIndex = newBoxes.findIndex(b => b.row === row && b.col === col);
                if (boxIndex !== -1) {
                    newBoxes[boxIndex].sides++;
                }
            }
        } else if (orientation === 'vertical') {
            // Update box to the left
            if (col > 0) {
                const boxIndex = newBoxes.findIndex(b => b.row === row && b.col === col - 1);
                if (boxIndex !== -1) {
                    newBoxes[boxIndex].sides++;
                }
            }
            // Update box to the right
            if (col < this.gridSize) {
                const boxIndex = newBoxes.findIndex(b => b.row === row && b.col === col);
                if (boxIndex !== -1) {
                    newBoxes[boxIndex].sides++;
                }
            }
        }
        
        return newBoxes;
    }

    /**
     * Evaluates the current board state
     */
    evaluateBoard(boxes) {
        // Count boxes with different number of sides
        let score = 0;
        for (const box of boxes) {
            if (box.sides === 4) {
                score += 1; // Completed box
            } else if (box.sides === 3) {
                score -= 2; // Box that can be completed next move (bad)
            } else if (box.sides === 2) {
                score -= 0.5; // Box that's half completed
            }
        }
        return score;
    }

    /**
     * Evaluates a specific move
     */
    evaluateMove(move, availableLines, boxes) {
        const boxesCompleted = this.simulateMove(move, boxes);
        if (boxesCompleted > 0) {
            return boxesCompleted * 2; // Prioritize completing boxes
        }
        
        // Check if this move would create a box with 3 sides for the opponent
        const newBoxes = this.updateBoxes(boxes, move);
        for (const box of newBoxes) {
            if (box.sides === 3) {
                return -1; // This move would set up the opponent
            }
        }
        
        return 0; // Neutral move
    }
}

// Export the AI class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DotsAndBoxesAI;
}