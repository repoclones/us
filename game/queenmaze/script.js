import { gsap } from 'gsap';

// Game state
const state = {
    board: null,
    boardSize: 12, // Default board size
    selectedPiece: null,
    validMoves: [],
    gameOver: false,
    lastMove: { from: null, to: null },
    playerPosition: null,
    enemyPosition: null,
    moveCount: 0,
    randomPieces: true,
    biggerBoard: false,
    mazeDensity: 40, // Default maze density percentage
    pieceCount: 6    // Default random piece count
};

// Initialize the game
function initGame() {
    // Get options
    state.randomPieces = document.getElementById('random-pieces').checked;
    state.biggerBoard = document.getElementById('bigger-board').checked;
    state.boardSize = state.biggerBoard ? 12 : 8;
    state.mazeDensity = parseInt(document.getElementById('maze-density').value);
    state.pieceCount = parseInt(document.getElementById('piece-count').value);
    
    // Update board size in CSS
    const boardElement = document.getElementById('board');
    if (state.biggerBoard) {
        boardElement.classList.add('bigger-board');
    } else {
        boardElement.classList.remove('bigger-board');
    }
    
    // Update grid
    boardElement.style.gridTemplateColumns = `repeat(${state.boardSize}, 1fr)`;
    boardElement.style.gridTemplateRows = `repeat(${state.boardSize}, 1fr)`;
    
    // Create empty board
    state.board = Array(state.boardSize).fill().map(() => Array(state.boardSize).fill(null));
    
    // Generate maze with walls
    generateMaze();
    
    // Place player and enemy queens in valid positions
    placeQueens();
    
    // Add random pieces if option is selected
    if (state.randomPieces) {
        addRandomPieces();
    }
    
    // Reset game state
    state.selectedPiece = null;
    state.validMoves = [];
    state.gameOver = false;
    state.lastMove = { from: null, to: null };
    state.moveCount = 0;
    
    // Render the board
    renderBoard();
    updateGameInfo();
}

// Generate a maze with walls
function generateMaze() {
    // Clear the board first
    for (let row = 0; row < state.boardSize; row++) {
        for (let col = 0; col < state.boardSize; col++) {
            state.board[row][col] = null;
        }
    }
    
    // Add walls randomly based on mazeDensity
    const wallCount = Math.floor(state.boardSize * state.boardSize * (state.mazeDensity / 100));
    let wallsPlaced = 0;
    
    while (wallsPlaced < wallCount) {
        const row = Math.floor(Math.random() * state.boardSize);
        const col = Math.floor(Math.random() * state.boardSize);
        
        // Don't place walls in corners to ensure queens have room to move
        if ((row < 2 && col < 2) || 
            (row < 2 && col > state.boardSize - 3) || 
            (row > state.boardSize - 3 && col < 2) || 
            (row > state.boardSize - 3 && col > state.boardSize - 3)) {
            continue;
        }
        
        if (state.board[row][col] === null) {
            state.board[row][col] = { type: 'wall' };
            wallsPlaced++;
        }
    }
    
    // Ensure the maze is traversable using a simple flood fill
    ensureTraversableMaze();
}

// Make sure the maze can be traversed
function ensureTraversableMaze() {
    const visited = Array(state.boardSize).fill().map(() => Array(state.boardSize).fill(false));
    
    // Pick the first available empty starting point (deterministic)
    let startRow = -1, startCol = -1;
    outer: for (let r = 0; r < state.boardSize; r++) for (let c = 0; c < state.boardSize; c++) {
        if (state.board[r][c] === null) { startRow = r; startCol = c; break outer; }
    }
    if (startRow === -1) return;
    
    // Flood fill from the starting point
    const queue = [{row: startRow, col: startCol}];
    visited[startRow][startCol] = true;
    
    while (queue.length > 0) {
        const {row, col} = queue.shift();
        
        // Check all four directions
        const directions = [
            {row: -1, col: 0}, // up
            {row: 1, col: 0},  // down
            {row: 0, col: -1}, // left
            {row: 0, col: 1}   // right
        ];
        
        for (const dir of directions) {
            const newRow = row + dir.row;
            const newCol = col + dir.col;
            
            if (isValidPosition(newRow, newCol) && 
                !visited[newRow][newCol] && 
                (state.board[newRow][newCol] === null)) {
                visited[newRow][newCol] = true;
                queue.push({row: newRow, col: newCol});
            }
        }
    }
    
    // Count unvisited non-wall cells
    let unreachableCells = 0;
    for (let row = 0; row < state.boardSize; row++) {
        for (let col = 0; col < state.boardSize; col++) {
            if (!visited[row][col] && state.board[row][col] === null) {
                unreachableCells++;
                // Remove walls around unreachable cells to make them accessible
                if (row > 0 && state.board[row-1][col] && state.board[row-1][col].type === 'wall') {
                    state.board[row-1][col] = null;
                } else if (col > 0 && state.board[row][col-1] && state.board[row][col-1].type === 'wall') {
                    state.board[row][col-1] = null;
                }
            }
        }
    }
    
    // If there are still unreachable cells, connect regions iteratively (avoid recursion)
    if (unreachableCells > 0) {
        connectMaze(visited);
    }
}

function connectMaze(visited){
    const dirs=[{row:-1,col:0},{row:1,col:0},{row:0,col:-1},{row:0,col:1}]; let attempts=0;
    const recompute=()=>{visited=Array(state.boardSize).fill().map(()=>Array(state.boardSize).fill(false));
        let q=[],found=false; for(let r=0;r<state.boardSize&&!found;r++)for(let c=0;c<state.boardSize&&!found;c++)if(state.board[r][c]===null){visited[r][c]=true;q.push({row:r,col:c});found=true;}
        while(q.length){const {row,col}=q.shift(); for(const d of dirs){const nr=row+d.row,nc=col+d.col;
            if(isValidPosition(nr,nc)&&!visited[nr][nc]&&state.board[nr][nc]===null){visited[nr][nc]=true;q.push({row:nr,col:nc});}}}
    };
    recompute();
    while(true){
        let allConnected=true;
        for(let r=0;r<state.boardSize;r++){for(let c=0;c<state.boardSize;c++){if(state.board[r][c]===null&&!visited[r][c]){
            allConnected=false; let bridged=false;
            for(const d of dirs){const wr=r+d.row,wc=c+d.col,vr=wr+d.row,vc=wc+d.col;
                if(isValidPosition(wr,wc)&&state.board[wr][wc]?.type==='wall'&&isValidPosition(vr,vc)&&state.board[vr][vc]===null&&visited[vr][vc]){state.board[wr][wc]=null; bridged=true; break;}}
            if(!bridged){for(const d of dirs){const wr=r+d.row,wc=c+d.col; if(isValidPosition(wr,wc)&&state.board[wr][wc]?.type==='wall'){state.board[wr][wc]=null; break;}}}
            recompute(); attempts++; if(attempts>state.boardSize*state.boardSize) return; r=state.boardSize; break;
        }}}
        if(allConnected) return;
    }
}

// Place player and enemy queens
function placeQueens() {
    // Find valid positions for queens (not on walls and not in check of each other)
    let validPositions = [];
    for (let row = 0; row < state.boardSize; row++) {
        for (let col = 0; col < state.boardSize; col++) {
            if (state.board[row][col] === null) {
                validPositions.push({row, col});
            }
        }
    }
    
    if (validPositions.length < 2) {
        // Not enough valid positions, regenerate maze
        generateMaze();
        placeQueens();
        return;
    }
    
    // Place player queen (white)
    const playerIndex = Math.floor(Math.random() * validPositions.length);
    const playerPos = validPositions[playerIndex];
    state.board[playerPos.row][playerPos.col] = { type: 'queen', color: 'white' };
    state.playerPosition = { row: playerPos.row, col: playerPos.col };
    
    // Remove player position and positions in check
    validPositions.splice(playerIndex, 1);
    validPositions = validPositions.filter(pos => {
        return !canQueenAttack(playerPos.row, playerPos.col, pos.row, pos.col);
    });
    
    if (validPositions.length === 0) {
        // No valid position for enemy, regenerate maze
        generateMaze();
        placeQueens();
        return;
    }
    
    // Place enemy queen (black)
    const enemyIndex = Math.floor(Math.random() * validPositions.length);
    const enemyPos = validPositions[enemyIndex];
    state.board[enemyPos.row][enemyPos.col] = { type: 'queen', color: 'black' };
    state.enemyPosition = { row: enemyPos.row, col: enemyPos.col };
}

// Check if a queen at (row1, col1) can attack a position at (row2, col2)
function canQueenAttack(row1, col1, row2, col2) {
    // Check if they're in the same row, column, or diagonal
    if (row1 === row2 || col1 === col2 || Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
        // Check if there are walls in between
        const rowStep = row2 > row1 ? 1 : (row2 < row1 ? -1 : 0);
        const colStep = col2 > col1 ? 1 : (col2 < col1 ? -1 : 0);
        
        let currentRow = row1 + rowStep;
        let currentCol = col1 + colStep;
        
        while (currentRow !== row2 || currentCol !== col2) {
            if (!isValidPosition(currentRow, currentCol)) {
                return false;
            }
            if (state.board[currentRow] && state.board[currentRow][currentCol] && state.board[currentRow][currentCol].type === 'wall') {
                return false; // Wall blocking the path
            }
            currentRow += rowStep;
            currentCol += colStep;
        }
        
        return true; // Can attack
    }
    
    return false; // Cannot attack
}

// Add random chess pieces to the board
function addRandomPieces() {
    const pieceTypes = ['rook', 'knight', 'bishop', 'pawn'];
    const colors = ['white', 'black'];
    const empties = [];
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            if (state.board[r][c] === null) empties.push({ row: r, col: c });
        }
    }
    // Fisher–Yates shuffle
    for (let i = empties.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [empties[i], empties[j]] = [empties[j], empties[i]];
    }
    const numPieces = Math.min(state.pieceCount, empties.length);
    for (let i = 0; i < numPieces; i++) {
        const { row, col } = empties[i];
        const pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        state.board[row][col] = { type: pieceType, color };
    }
}

// Render the chess board
function renderBoard() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < state.boardSize; row++) {
        for (let col = 0; col < state.boardSize; col++) {
            const square = document.createElement('div');
            square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            
            // Add special highlights
            if (state.lastMove.from && state.lastMove.from.row === row && state.lastMove.from.col === col) {
                square.classList.add('last-move');
            }
            if (state.lastMove.to && state.lastMove.to.row === row && state.lastMove.to.col === col) {
                square.classList.add('last-move');
            }
            
            const cell = state.board[row][col];
            if (cell) {
                if (cell.type === 'wall') {
                    square.classList.add('wall');
                } else {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = `piece ${cell.color} ${cell.type}`;
                    
                    // Add click event for player's pieces
                    if (cell.color === 'white' && !state.gameOver) {
                        pieceElement.addEventListener('click', (e) => {
                            e.stopPropagation();
                            selectPiece(row, col);
                        });
                    }
                    
                    square.appendChild(pieceElement);
                }
            }
            
            // Add click event for square selection (moving)
            square.addEventListener('click', () => handleSquareClick(row, col));
            
            // Mark valid moves
            if (state.validMoves.some(move => move.row === row && move.col === col)) {
                square.classList.add('valid-move');
            }
            
            boardElement.appendChild(square);
        }
    }
}

// Handle piece selection
function selectPiece(row, col) {
    const piece = state.board[row][col];
    
    // Deselect if already selected
    if (state.selectedPiece && state.selectedPiece.row === row && state.selectedPiece.col === col) {
        state.selectedPiece = null;
        state.validMoves = [];
        renderBoard();
        return;
    }
    
    // Only select player's pieces
    if (piece && piece.color === 'white') {
        state.selectedPiece = { row, col, piece };
        state.validMoves = getValidMoves(row, col);
        renderBoard();
        
        // Highlight selected piece
        const squareElement = document.querySelector(`.square[data-row="${row}"][data-col="${col}"]`);
        if (squareElement) {
            squareElement.classList.add('selected');
        }
    }
}

// Handle square click (for moving pieces)
function handleSquareClick(row, col) {
    // If no piece is selected or game is over, do nothing
    if (!state.selectedPiece || state.gameOver) return;
    
    // Check if the clicked square is a valid move
    const isValidMove = state.validMoves.some(move => move.row === row && move.col === col);
    
    if (isValidMove) {
        movePiece(state.selectedPiece.row, state.selectedPiece.col, row, col);
    } else {
        // If clicking on another player piece, select that piece instead
        const piece = state.board[row][col];
        if (piece && piece.color === 'white') {
            selectPiece(row, col);
        } else {
            // Deselect if clicking on invalid square
            state.selectedPiece = null;
            state.validMoves = [];
            renderBoard();
        }
    }
}

// Move a piece
function movePiece(fromRow, fromCol, toRow, toCol) {
    const piece = state.board[fromRow][fromCol];
    if (!piece) return;
    
    // Save the last move
    state.lastMove = {
        from: { row: fromRow, col: fromCol },
        to: { row: toRow, col: toCol }
    };
    
    // Handle captures
    const targetPiece = state.board[toRow][toCol];
    
    // Animate the piece movement
    animatePieceMovement(fromRow, fromCol, toRow, toCol, () => {
        // Update the board state after animation
        state.board[toRow][toCol] = piece;
        state.board[fromRow][fromCol] = null;
        
        // Update player position
        if (piece.color === 'white' && piece.type === 'queen') {
            state.playerPosition = { row: toRow, col: toCol };
        }
        
        // Increment move counter
        state.moveCount++;
        
        // Check for win condition (capturing the black queen)
        if (targetPiece && targetPiece.color === 'black' && targetPiece.type === 'queen') {
            state.gameOver = true;
            document.getElementById('game-message').textContent = `You win! Black queen captured in ${state.moveCount} moves.`;
            renderBoard();
            updateGameInfo();
            return;
        }
        
        // Reset selection
        state.selectedPiece = null;
        state.validMoves = [];
        
        // Enemy turn (black queen's move)
        setTimeout(() => {
            if (!state.gameOver) {
                moveEnemyQueen();
            }
        }, 300);
        
        renderBoard();
        updateGameInfo();
    });
}

// Move the enemy queen (black)
function moveEnemyQueen() {
    if (!state.enemyPosition) return;
    
    // Advanced AI: Consider all black pieces and make the best strategic move
    const bestMove = findBestStrategicMove();
    
    if (bestMove) {
        const { fromRow, fromCol, toRow, toCol, piece } = bestMove;
        
        // Animate the piece movement
        animatePieceMovement(fromRow, fromCol, toRow, toCol, () => {
            // Check if capturing the white queen
            const targetPiece = state.board[toRow][toCol];
            if (targetPiece && targetPiece.color === 'white' && targetPiece.type === 'queen') {
                state.gameOver = true;
                document.getElementById('game-message').textContent = "Game Over! The black queen captured your queen.";
            }
            
            // Update the board
            state.board[toRow][toCol] = state.board[fromRow][fromCol];
            state.board[fromRow][fromCol] = null;
            
            // Update enemy position if it was the queen that moved
            if (piece.type === 'queen') {
                state.enemyPosition = { row: toRow, col: toCol };
            }
            
            // Update the last move
            state.lastMove = {
                from: { row: fromRow, col: fromCol },
                to: { row: toRow, col: toCol }
            };
            
            renderBoard();
            updateGameInfo();
        });
    }
}

// Get piece value for evaluation
function getPieceValue(pieceType) {
    switch (pieceType) {
        case 'queen': return 9;
        case 'rook': return 5;
        case 'bishop': return 3;
        case 'knight': return 3;
        case 'pawn': return 1;
        case 'king': return 100; // Very high value but not used in this game
        default: return 0;
    }
}

// Advanced AI: Find the best strategic move considering all black pieces
function findBestStrategicMove() {
    const allBlackMoves = getAllBlackPieceMoves();
    
    if (allBlackMoves.length === 0) return null;
    
    // Score each move based on multiple strategic factors
    const scoredMoves = allBlackMoves.map(move => {
        const score = evaluateMove(move);
        return { ...move, score };
    });
    
    // Sort by score (highest first)
    scoredMoves.sort((a, b) => b.score - a.score);
    
    // Filter out obviously bad moves (negative scores above a threshold)
    const viableMoves = scoredMoves.filter(move => move.score > -5000);
    
    if (viableMoves.length === 0) {
        // If all moves are bad, pick the least bad one
        return scoredMoves[0];
    }
    
    // Add some randomness to prevent predictable play, but bias toward better moves
    const topMoves = viableMoves.slice(0, Math.min(3, viableMoves.length));
    const weights = [0.6, 0.3, 0.1]; // Heavily favor the best move
    
    let randomValue = Math.random();
    for (let i = 0; i < topMoves.length; i++) {
        if (randomValue < weights[i] || i === topMoves.length - 1) {
            return topMoves[i];
        }
        randomValue -= weights[i];
    }
    
    return topMoves[0];
}

// Get all possible moves for all black pieces
function getAllBlackPieceMoves() {
    const allMoves = [];
    
    for (let row = 0; row < state.boardSize; row++) {
        for (let col = 0; col < state.boardSize; col++) {
            const piece = state.board[row][col];
            if (piece && piece.color === 'black') {
                const moves = getValidMoves(row, col);
                
                moves.forEach(move => {
                    allMoves.push({
                        fromRow: row,
                        fromCol: col,
                        toRow: move.row,
                        toCol: move.col,
                        piece: piece
                    });
                });
            }
        }
    }
    
    return allMoves;
}

// Advanced move evaluation function
function evaluateMove(move) {
    const { fromRow, fromCol, toRow, toCol, piece } = move;
    let score = 0;
    
    // 1. IMMEDIATE CAPTURE PRIORITIES
    const targetPiece = state.board[toRow][toCol];
    if (targetPiece && targetPiece.color === 'white') {
        if (targetPiece.type === 'queen') {
            return 10000; // Winning move - capture white queen
        } else {
            score += getPieceValue(targetPiece.type) * 10; // Capture other white pieces
        }
    }
    
    // 2. CRITICAL SAFETY CHECK - Avoid being captured (highest priority for queen)
    if (piece.type === 'queen') {
        const safetyScore = evaluateQueenSafety(toRow, toCol);
        if (safetyScore < -500) {
            return -10000; // Avoid suicidal moves
        }
        score += safetyScore * 2; // Double weight for queen safety
    }
    
    // 3. GENERAL PIECE SAFETY
    const generalSafety = evaluatePieceSafety(toRow, toCol, piece);
    score += generalSafety;
    
    // 4. ATTACKING THE WHITE QUEEN
    if (state.playerPosition) {
        // Create temporary board state to test the move
        const tempBoard = JSON.parse(JSON.stringify(state.board));
        tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
        tempBoard[fromRow][fromCol] = null;
        
        if (canPieceAttackPosition(toRow, toCol, piece, state.playerPosition.row, state.playerPosition.col, tempBoard)) {
            score += 500; // High priority for checking the white queen
        }
        
        // Reward moves that get closer to the white queen (but not too close if unsafe)
        const currentDistance = Math.abs(fromRow - state.playerPosition.row) + Math.abs(fromCol - state.playerPosition.col);
        const newDistance = Math.abs(toRow - state.playerPosition.row) + Math.abs(toCol - state.playerPosition.col);
        if (newDistance < currentDistance && generalSafety > -100) {
            score += (currentDistance - newDistance) * 15;
        }
    }
    
    // 5. TACTICAL POSITIONING
    // Control center squares (more valuable for pieces)
    const centerDistance = Math.abs(toRow - state.boardSize/2) + Math.abs(toCol - state.boardSize/2);
    score += (state.boardSize - centerDistance) * 2;
    
    // 6. PIECE COORDINATION
    // Reward moves that support other black pieces
    const supportValue = calculateSupportValue(toRow, toCol, piece);
    score += supportValue * 15;
    
    // 7. ESCAPE ROUTES (especially important for queen)
    if (piece.type === 'queen') {
        const escapeRoutes = calculateEscapeRoutes(toRow, toCol);
        score += escapeRoutes * 20;
    }
    
    // 8. PIECE-SPECIFIC STRATEGIC VALUES
    score += getPiecePositionalValue(piece.type, toRow, toCol);
    
    // 9. FORK OPPORTUNITIES
    const forkValue = calculateForkPotential(toRow, toCol, piece);
    score += forkValue * 100;
    
    // 10. PIN AND SKEWER OPPORTUNITIES
    const pinValue = calculatePinValue(toRow, toCol, piece);
    score += pinValue * 80;
    
    // 11. MOBILITY (number of squares the piece can move to from new position)
    const mobilityValue = calculateMobility(toRow, toCol, piece);
    score += mobilityValue * 3;
    
    // 12. LOOKAHEAD - Check if this move leads to immediate counter-attacks
    const lookaheadPenalty = evaluateLookahead(fromRow, fromCol, toRow, toCol, piece);
    score -= lookaheadPenalty;
    
    return score;
}

// Evaluate queen safety at a specific position
function evaluateQueenSafety(row, col) {
    let safetyScore = 0;
    
    // Check all white pieces to see if they can attack this position
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const piece = state.board[r][c];
            if (piece && piece.color === 'white') {
                if (canPieceAttackPosition(r, c, piece, row, col, state.board)) {
                    const attackerValue = getPieceValue(piece.type);
                    // Heavy penalty if attacked by less valuable pieces
                    safetyScore -= attackerValue < 9 ? 800 : 200;
                }
            }
        }
    }
    
    // Bonus for positions that are defended by own pieces
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const piece = state.board[r][c];
            if (piece && piece.color === 'black' && !(r === row && c === col)) {
                if (canPieceAttackPosition(r, c, piece, row, col, state.board)) {
                    safetyScore += 100; // Defended square bonus
                }
            }
        }
    }
    
    return safetyScore;
}

// Evaluate general piece safety
function evaluatePieceSafety(row, col, piece) {
    let safetyScore = 0;
    const pieceValue = getPieceValue(piece.type);
    
    // Check threats from white pieces
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const whitePiece = state.board[r][c];
            if (whitePiece && whitePiece.color === 'white') {
                if (canPieceAttackPosition(r, c, whitePiece, row, col, state.board)) {
                    const attackerValue = getPieceValue(whitePiece.type);
                    // Penalty based on value exchange
                    safetyScore -= Math.max(50, pieceValue - attackerValue + 50);
                }
            }
        }
    }
    
    // Check defense from black pieces
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const blackPiece = state.board[r][c];
            if (blackPiece && blackPiece.color === 'black' && !(r === row && c === col)) {
                if (canPieceAttackPosition(r, c, blackPiece, row, col, state.board)) {
                    safetyScore += 30; // Defended position bonus
                }
            }
        }
    }
    
    return safetyScore;
}

// Calculate number of escape routes from a position
function calculateEscapeRoutes(row, col) {
    let escapeRoutes = 0;
    
    // Check all adjacent squares for the queen
    const directions = [
        { row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: -1, col: -1 }, { row: -1, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 1 }
    ];
    
    directions.forEach(dir => {
        const newRow = row + dir.row;
        const newCol = col + dir.col;
        
        if (isValidPosition(newRow, newCol)) {
            const targetSquare = state.board[newRow][newCol];
            
            // Check if this square is safe to move to
            if (!targetSquare || (targetSquare.color === 'white' && targetSquare.type !== 'wall')) {
                let isSafe = true;
                
                // Check if white pieces can attack this escape square
                for (let r = 0; r < state.boardSize && isSafe; r++) {
                    for (let c = 0; c < state.boardSize && isSafe; c++) {
                        const whitePiece = state.board[r][c];
                        if (whitePiece && whitePiece.color === 'white') {
                            if (canPieceAttackPosition(r, c, whitePiece, newRow, newCol, state.board)) {
                                isSafe = false;
                            }
                        }
                    }
                }
                
                if (isSafe) {
                    escapeRoutes++;
                }
            }
        }
    });
    
    return escapeRoutes;
}

// Calculate support value for piece coordination
function calculateSupportValue(row, col, piece) {
    let supportValue = 0;
    
    // Check how many black pieces this position supports
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const blackPiece = state.board[r][c];
            if (blackPiece && blackPiece.color === 'black' && !(r === row && c === col)) {
                // Check if we can defend this piece from the new position
                if (canPieceAttackPosition(row, col, piece, r, c, state.board)) {
                    supportValue += getPieceValue(blackPiece.type);
                }
            }
        }
    }
    
    return supportValue;
}

// Get piece positional value based on piece type and position
function getPiecePositionalValue(pieceType, row, col) {
    let value = 0;
    
    switch (pieceType) {
        case 'queen':
            // Queens prefer center positions but not too close to edges
            const centerDistance = Math.abs(row - state.boardSize/2) + Math.abs(col - state.boardSize/2);
            value += (state.boardSize - centerDistance) * 5;
            break;
        case 'knight':
            // Knights are better in the center
            const knightCenterBonus = Math.max(0, 4 - Math.abs(row - state.boardSize/2) - Math.abs(col - state.boardSize/2));
            value += knightCenterBonus * 10;
            break;
        case 'bishop':
            // Bishops prefer long diagonals
            const diagonalLength = Math.min(row + col, state.boardSize - 1 - row + col, row + state.boardSize - 1 - col, state.boardSize - 1 - row + state.boardSize - 1 - col);
            value += diagonalLength * 3;
            break;
        case 'rook':
            // Rooks prefer open files and ranks
            value += 5; // Base positional value
            break;
        case 'pawn':
            // Pawns advance toward promotion
            const advancementBonus = pieceType === 'pawn' ? (state.boardSize - row - 1) * 2 : 0;
            value += advancementBonus;
            break;
    }
    
    return value;
}

// Calculate fork potential (attacking two or more enemy pieces)
function calculateForkPotential(row, col, piece) {
    let forkValue = 0;
    let attackedPieces = [];
    
    // Get all positions this piece can attack from the new position
    const tempBoard = JSON.parse(JSON.stringify(state.board));
    const moves = getPieceMoves(row, col, piece, tempBoard);
    
    // Check each possible attack
    moves.forEach(move => {
        const targetPiece = state.board[move.row][move.col];
        if (targetPiece && targetPiece.color === 'white') {
            attackedPieces.push(targetPiece);
        }
    });
    
    // If attacking 2 or more pieces, it's a fork
    if (attackedPieces.length >= 2) {
        forkValue = attackedPieces.reduce((sum, p) => sum + getPieceValue(p.type), 0);
    }
    
    return forkValue;
}

// Calculate pin and skewer opportunities
function calculatePinValue(row, col, piece) {
    let pinValue = 0;
    
    // Only long-range pieces can create pins
    if (piece.type !== 'queen' && piece.type !== 'rook' && piece.type !== 'bishop') {
        return 0;
    }
    
    // Check all directions this piece can move
    const directions = piece.type === 'rook' ? 
        [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }] :
        piece.type === 'bishop' ?
        [{ row: -1, col: -1 }, { row: -1, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 1 }] :
        [{ row: -1, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 },
         { row: -1, col: -1 }, { row: -1, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 1 }];
    
    directions.forEach(dir => {
        const piecesInLine = [];
        let currentRow = row + dir.row;
        let currentCol = col + dir.col;
        
        // Collect all pieces in this direction
        while (isValidPosition(currentRow, currentCol)) {
            const targetPiece = state.board[currentRow][currentCol];
            if (targetPiece) {
                if (targetPiece.type === 'wall') break;
                piecesInLine.push({ piece: targetPiece, row: currentRow, col: currentCol });
                if (piecesInLine.length >= 2) break; // Only need first two pieces for pin
            }
            currentRow += dir.row;
            currentCol += dir.col;
        }
        
        // Check for pin: first piece is white, second piece is valuable white piece
        if (piecesInLine.length >= 2) {
            const firstPiece = piecesInLine[0].piece;
            const secondPiece = piecesInLine[1].piece;
            
            if (firstPiece.color === 'white' && secondPiece.color === 'white' && 
                getPieceValue(secondPiece.type) > getPieceValue(firstPiece.type)) {
                pinValue += getPieceValue(secondPiece.type) * 0.5; // Pin value
            }
        }
    });
    
    return pinValue;
}

// Calculate mobility (number of squares piece can move to)
function calculateMobility(row, col, piece) {
    const tempBoard = JSON.parse(JSON.stringify(state.board));
    tempBoard[row][col] = piece;
    
    const moves = getPieceMoves(row, col, piece, tempBoard);
    return moves.length;
}

// Evaluate lookahead to prevent tactical blunders
function evaluateLookahead(fromRow, fromCol, toRow, toCol, piece) {
    let penalty = 0;
    
    // Create temporary board after this move
    const tempBoard = JSON.parse(JSON.stringify(state.board));
    tempBoard[toRow][toCol] = tempBoard[fromRow][fromCol];
    tempBoard[fromRow][fromCol] = null;
    
    // Check all possible white responses
    for (let r = 0; r < state.boardSize; r++) {
        for (let c = 0; c < state.boardSize; c++) {
            const whitePiece = tempBoard[r][c];
            if (whitePiece && whitePiece.color === 'white') {
                const whiteMoves = getPieceMoves(r, c, whitePiece, tempBoard);
                
                whiteMoves.forEach(whiteMove => {
                    const targetPiece = tempBoard[whiteMove.row][whiteMove.col];
                    
                    // If white can capture a black piece after our move
                    if (targetPiece && targetPiece.color === 'black') {
                        const capturedValue = getPieceValue(targetPiece.type);
                        const attackerValue = getPieceValue(whitePiece.type);
                        
                        // Higher penalty if it's our piece that just moved
                        if (whiteMove.row === toRow && whiteMove.col === toCol) {
                            penalty += capturedValue * 10; // Heavy penalty for hanging our piece
                        } else {
                            penalty += Math.max(0, capturedValue - attackerValue) * 5;
                        }
                    }
                });
            }
        }
    }
    
    return penalty;
}

// Get piece moves for any piece type with a given board state
function getPieceMoves(row, col, piece, board) {
    const originalBoard = state.board;
    state.board = board; // Temporarily use the test board
    
    let moves = [];
    switch (piece.type) {
        case 'queen':
            moves = getQueenMoves(row, col, piece.color);
            break;
        case 'rook':
            moves = getRookMoves(row, col, piece.color);
            break;
        case 'bishop':
            moves = getBishopMoves(row, col, piece.color);
            break;
        case 'knight':
            moves = getKnightMoves(row, col, piece.color);
            break;
        case 'pawn':
            moves = getPawnMoves(row, col, piece.color);
            break;
    }
    
    state.board = originalBoard; // Restore original board
    return moves;
}

// Check if a piece can attack a specific position
function canPieceAttackPosition(pieceRow, pieceCol, piece, targetRow, targetCol, board) {
    if (!piece || !board) return false;
    
    const originalBoard = state.board;
    state.board = board; // Temporarily use the test board
    
    let canAttack = false;
    
    try {
        switch (piece.type) {
            case 'queen':
                canAttack = canQueenAttack(pieceRow, pieceCol, targetRow, targetCol);
                break;
            case 'rook':
                canAttack = canRookAttack(pieceRow, pieceCol, targetRow, targetCol);
                break;
            case 'bishop':
                canAttack = canBishopAttack(pieceRow, pieceCol, targetRow, targetCol);
                break;
            case 'knight':
                canAttack = canKnightAttack(pieceRow, pieceCol, targetRow, targetCol);
                break;
            case 'pawn':
                canAttack = canPawnAttack(pieceRow, pieceCol, targetRow, targetCol, piece.color);
                break;
        }
    } catch (error) {
        console.warn('Error in canPieceAttackPosition:', error);
        canAttack = false;
    }
    
    state.board = originalBoard; // Restore original board
    return canAttack;
}

// Check if rook can attack a position
function canRookAttack(row1, col1, row2, col2) {
    if (row1 !== row2 && col1 !== col2) return false;
    
    const rowStep = row2 > row1 ? 1 : (row2 < row1 ? -1 : 0);
    const colStep = col2 > col1 ? 1 : (col2 < col1 ? -1 : 0);
    
    let currentRow = row1 + rowStep;
    let currentCol = col1 + colStep;
    
    while (currentRow !== row2 || currentCol !== col2) {
        if (!isValidPosition(currentRow, currentCol)) {
            return false;
        }
        if (state.board[currentRow] && state.board[currentRow][currentCol] && 
            state.board[currentRow][currentCol].type === 'wall') {
            return false;
        }
        if (state.board[currentRow] && state.board[currentRow][currentCol] && 
            state.board[currentRow][currentCol].type !== 'wall') {
            return false; // Piece blocking the path
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

// Check if bishop can attack a position
function canBishopAttack(row1, col1, row2, col2) {
    if (Math.abs(row1 - row2) !== Math.abs(col1 - col2)) return false;
    
    const rowStep = row2 > row1 ? 1 : -1;
    const colStep = col2 > col1 ? 1 : -1;
    
    let currentRow = row1 + rowStep;
    let currentCol = col1 + colStep;
    
    while (currentRow !== row2 || currentCol !== col2) {
        if (!isValidPosition(currentRow, currentCol)) {
            return false;
        }
        if (state.board[currentRow] && state.board[currentRow][currentCol] && 
            state.board[currentRow][currentCol].type === 'wall') {
            return false;
        }
        if (state.board[currentRow] && state.board[currentRow][currentCol] && 
            state.board[currentRow][currentCol].type !== 'wall') {
            return false; // Piece blocking the path
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return true;
}

// Check if knight can attack a position
function canKnightAttack(row1, col1, row2, col2) {
    const rowDiff = Math.abs(row1 - row2);
    const colDiff = Math.abs(col1 - col2);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

// Check if pawn can attack a position
function canPawnAttack(row1, col1, row2, col2, color) {
    const direction = color === 'white' ? -1 : 1; // White moves up, black moves down
    const rowDiff = row2 - row1;
    const colDiff = Math.abs(col2 - col1);
    
    return rowDiff === direction && colDiff === 1;
}

// Get valid moves for a piece
function getValidMoves(row, col) {
    const piece = state.board[row][col];
    if (!piece) return [];
    
    let moves = [];
    
    switch (piece.type) {
        case 'queen':
            moves = getQueenMoves(row, col, piece.color);
            break;
        case 'rook':
            moves = getRookMoves(row, col, piece.color);
            break;
        case 'bishop':
            moves = getBishopMoves(row, col, piece.color);
            break;
        case 'knight':
            moves = getKnightMoves(row, col, piece.color);
            break;
        case 'pawn':
            moves = getPawnMoves(row, col, piece.color);
            break;
    }
    
    return moves;
}

// Get queen moves
function getQueenMoves(row, col, color) {
    const moves = [];
    
    // Combine rook and bishop moves
    const rookMoves = getRookMoves(row, col, color);
    const bishopMoves = getBishopMoves(row, col, color);
    
    return [...rookMoves, ...bishopMoves];
}

// Get rook moves
function getRookMoves(row, col, color) {
    const moves = [];
    const directions = [
        { row: -1, col: 0 }, // up
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: 0, col: 1 }   // right
    ];
    
    for (const dir of directions) {
        let newRow = row + dir.row;
        let newCol = col + dir.col;
        
        while (isValidPosition(newRow, newCol)) {
            const targetPiece = state.board[newRow][newCol];
            
            if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
            } else if (targetPiece.type === 'wall') {
                break;
            } else if (targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
                break;
            } else {
                break;
            }
            
            newRow += dir.row;
            newCol += dir.col;
        }
    }
    
    return moves;
}

// Get bishop moves
function getBishopMoves(row, col, color) {
    const moves = [];
    const directions = [
        { row: -1, col: -1 }, // up-left
        { row: -1, col: 1 },  // up-right
        { row: 1, col: -1 },  // down-left
        { row: 1, col: 1 }    // down-right
    ];
    
    for (const dir of directions) {
        let newRow = row + dir.row;
        let newCol = col + dir.col;
        
        while (isValidPosition(newRow, newCol)) {
            const targetPiece = state.board[newRow][newCol];
            
            if (!targetPiece) {
                moves.push({ row: newRow, col: newCol });
            } else if (targetPiece.type === 'wall') {
                break;
            } else if (targetPiece.color !== color) {
                moves.push({ row: newRow, col: newCol });
                break;
            } else {
                break;
            }
            
            newRow += dir.row;
            newCol += dir.col;
        }
    }
    
    return moves;
}

// Get knight moves
function getKnightMoves(row, col, color) {
    const moves = [];
    const offsets = [
        { row: -2, col: -1 }, { row: -2, col: 1 },
        { row: -1, col: -2 }, { row: -1, col: 2 },
        { row: 1, col: -2 }, { row: 1, col: 2 },
        { row: 2, col: -1 }, { row: 2, col: 1 }
    ];
    
    for (const offset of offsets) {
        const newRow = row + offset.row;
        const newCol = col + offset.col;
        
        if (isValidPosition(newRow, newCol)) {
            const targetPiece = state.board[newRow][newCol];
            if (!targetPiece || (targetPiece.color !== color && targetPiece.type !== 'wall')) {
                moves.push({ row: newRow, col: newCol });
            }
        }
    }
    
    return moves;
}

// Get pawn moves
function getPawnMoves(row, col, color) {
    const moves = [];
    const direction = color === 'white' ? -1 : 1; // White moves up, black moves down
    
    // Forward move
    const forwardRow = row + direction;
    if (isValidPosition(forwardRow, col)) {
        const forwardPiece = state.board[forwardRow][col];
        if (!forwardPiece) {
            moves.push({ row: forwardRow, col: col });
            
            // Double move from starting position
            const startingRow = color === 'white' ? state.boardSize - 2 : 1;
            if (row === startingRow) {
                const doubleForwardRow = row + (direction * 2);
                if (isValidPosition(doubleForwardRow, col) && !state.board[doubleForwardRow][col]) {
                    moves.push({ row: doubleForwardRow, col: col });
                }
            }
        }
    }
    
    // Diagonal captures
    const captureOffsets = [
        { row: direction, col: -1 },
        { row: direction, col: 1 }
    ];
    
    for (const offset of captureOffsets) {
        const captureRow = row + offset.row;
        const captureCol = col + offset.col;
        
        if (isValidPosition(captureRow, captureCol)) {
            const targetPiece = state.board[captureRow][captureCol];
            if (targetPiece && targetPiece.color !== color && targetPiece.type !== 'wall') {
                moves.push({ row: captureRow, col: captureCol });
            }
        }
    }
    
    return moves;
}

// Check if a position is valid on the board
function isValidPosition(row, col) {
    return row >= 0 && row < state.boardSize && col >= 0 && col < state.boardSize;
}

// Update game information display
function updateGameInfo() {
    document.getElementById('move-counter').textContent = `Moves: ${state.moveCount}`;
}

// Animate piece movement using GSAP
function animatePieceMovement(fromRow, fromCol, toRow, toCol, callback) {
    const fromSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${fromCol}"]`);
    const toSquare = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
    const piece = fromSquare.querySelector('.piece');
    
    if (!piece || !toSquare) {
        if (callback) callback();
        return;
    }
    
    // Get the positions
    const fromRect = fromSquare.getBoundingClientRect();
    const toRect = toSquare.getBoundingClientRect();
    
    // Calculate the distance to move
    const deltaX = toRect.left - fromRect.left;
    const deltaY = toRect.top - fromRect.top;
    
    // Create a clone of the piece for animation
    const animatedPiece = piece.cloneNode(true);
    animatedPiece.style.position = 'fixed';
    animatedPiece.style.left = fromRect.left + 'px';
    animatedPiece.style.top = fromRect.top + 'px';
    animatedPiece.style.width = piece.offsetWidth + 'px';
    animatedPiece.style.height = piece.offsetHeight + 'px';
    animatedPiece.style.zIndex = '1000';
    animatedPiece.style.pointerEvents = 'none';
    
    document.body.appendChild(animatedPiece);
    
    // Hide the original piece during animation
    piece.style.opacity = '0';
    
    // Animate the cloned piece
    gsap.to(animatedPiece, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
            // Remove the animated piece
            document.body.removeChild(animatedPiece);
            
            // Show the original piece again
            piece.style.opacity = '1';
            
            // Call the callback to update game state
            if (callback) callback();
        }
    });
    
    // Add a subtle scale animation for visual feedback
    gsap.fromTo(animatedPiece, 
        { scale: 1 }, 
        { 
            scale: 1.1, 
            duration: 0.2, 
            yoyo: true, 
            repeat: 1,
            ease: "power1.inOut"
        }
    );
}

// Event listeners
document.getElementById('reset-btn').addEventListener('click', initGame);
document.getElementById('random-pieces').addEventListener('change', () => {
    state.randomPieces = document.getElementById('random-pieces').checked;
});
document.getElementById('bigger-board').addEventListener('change', () => {
    state.biggerBoard = document.getElementById('bigger-board').checked;
});

// Add new event listeners for sliders
document.getElementById('maze-density').addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('maze-density-value').textContent = value + '%';
    state.mazeDensity = parseInt(value);
});

document.getElementById('piece-count').addEventListener('input', (e) => {
    const value = e.target.value;
    document.getElementById('piece-count-value').textContent = value;
    state.pieceCount = parseInt(value);
});

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);