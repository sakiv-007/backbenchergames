function getBestAIMove(boardState) {
    const safeMoves = getSafeMoves(boardState);
    const chainData = analyzeChains(boardState);
    const isEndgame = safeMoves.length <= 2;
  
    if (isEndgame) {
      // Step 1: Controlled sacrifice
      if (chainData.chains.length > 0) {
        // Choose a chain to open strategically
        const strategicMove = findStrategicSacrificeMove(boardState, chainData);
        if (strategicMove) return strategicMove;
      }
  
      // Give a free box to opponent to gain future advantage
      const freeBoxMove = findLeastDamageBoxGiveaway(boardState);
      if (freeBoxMove) return freeBoxMove;
    }
  
    if (chainData.hasForcedChainMove) {
      // Step 2: AI is forced to take a chain
      const controlledChainMove = takeChainLeavingTwoBoxes(boardState, chainData);
      if (controlledChainMove) return controlledChainMove;
    }
  
    // Step 3: Play safe move if available
    if (safeMoves.length > 0) {
      return pickBestSafeMove(safeMoves, boardState);
    }
  
    // Step 4: No safe moves left — pick the least bad option
    return pickLeastRiskyMove(boardState);
  }
  
  // ---------------- Helper Functions ----------------
  
  function getSafeMoves(boardState) {
    // Returns a list of moves that do not result in completing a box
    return boardState.moves.filter(move => !wouldCompleteBox(move, boardState));
  }
  
  function analyzeChains(boardState) {
    // Analyze the board to detect current chains and threat zones
    // Returns info about existing chains, open-ended boxes, etc.
    return {
      chains: findChains(boardState),
      hasForcedChainMove: detectForcedChainMove(boardState),
    };
  }
  
  function findStrategicSacrificeMove(boardState, chainData) {
    // Return a move that gives away a box but leads to AI taking a bigger chain
    return chainData.chains
      .sort((a, b) => b.length - a.length) // prioritize longer chains
      .map(chain => findEntryPointToChain(chain, boardState))
      .find(move => move !== null);
  }
  
  function findLeastDamageBoxGiveaway(boardState) {
    // Give away one box in a way that doesn’t let the player chain
    return boardState.moves.find(move => wouldCompleteOnlyOneBox(move, boardState));
  }
  
  function takeChainLeavingTwoBoxes(boardState, chainData) {
    // Take a chain but leave 2 boxes at the end
    const chain = chainData.chains.find(c => c.length > 2);
    if (!chain) return null;
  
    const movesToTake = chain.slice(0, chain.length - 2);
    return {
      type: 'chained-move',
      moves: movesToTake
    };
  }
  
  function pickBestSafeMove(safeMoves, boardState) {
    // Use heuristic or minimax here if needed
    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }
  
  function pickLeastRiskyMove(boardState) {
    // No good options — pick one that minimizes opponent chain potential
    return boardState.moves.find(move => !opensLongChain(move, boardState));
  }
  
  // ---------------- Game Logic Utilities (stubs) ----------------
  
  function wouldCompleteBox(move, boardState) {
    // Check if making this move would complete a box
    return false; // implement with your own logic
  }
  
  function wouldCompleteOnlyOneBox(move, boardState) {
    // Check if move completes only one box (ideal for sacrifice)
    return true; // implement your logic here
  }
  
  function detectForcedChainMove(boardState) {
    // Detect if AI has no choice but to take a chain
    return false; // implement
  }
  
  function findChains(boardState) {
    // Analyze and return all current open chains
    return []; // implement
  }
  
  function findEntryPointToChain(chain, boardState) {
    // Return the best move to give the opponent a free box then force them into a long chain
    return chain[0] || null;
  }
  
  function opensLongChain(move, boardState) {
    // Simulate and analyze if this move leads to a long chain for the opponent
    return false; // implement
  }
  