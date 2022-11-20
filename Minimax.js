/**
 * Default values of the game
 */
let size = 3;
let maxdepth = 4;

/**
 * Scores used for score the minmax options
 */
let scores = {
    X: 10,
    O: -10,
    tie: 0
};

/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns the maximum of a,b
 */
function max(a, b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @returns the minimum of a,b
 */
function min(a, b) {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}

/**
 * Select the best move, first step, score the best move using the minmax alrotithm, 
 * get the min or max score and the move that gets this score. Afther that, update the 
 * postion i, j selected by the AI
 */
function bestMove() {
    // Starts with a worst score and find the max
    let bestScore = -Infinity;
    let move = { i: 0, j: 0 }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == '') {
                // Test for all the avaiable positions, make a new board, and redo the movement
                board[i][j] = ai;
                // Get the score of the move, starts with deepth = 0 and stops when deepth is bigger the maximum
                let score = minimax(board, 0, false);
                board[i][j] = '';

                // Find the best score and the move to do
                if (score > bestScore) {
                    bestScore = score;
                    move.i = i;
                    move.j = j;
                }
            }
        }
    }
    // Do the best move
    board[move.i][move.j] = ai;
    currentPlayer = human;
}


/**
 * 
 * @param {*} board An square matrix of strings
 * @param {*} depth The maximum deepth search of the algorithm, the algorithm does not use pruning alpha-beta
 * @param {*} isMaximizing This variable control if player is `min` or `max`
 * @returns The score of a movement of the board given as parameter
 */
function minimax(board, depth, isMaximizing) {
    // If have winner return the winner score, this is saved on the variable `scores`
    let result = getWinner();
    if (result !== null) {
        return scores[result];
    }

    // Continuous recursively searching while deepth is no more than maxdepth
    if (depth < maxdepth) {
        // MAX score
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    if (board[i][j] == '') {
                        board[i][j] = ai;
                        let score = minimax(board, depth + 1, false);
                        board[i][j] = '';
                        bestScore = max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            // MIN Score
            let bestScore = Infinity;
            for (let i = 0; i < size; i++) {
                for (let j = 0; j < size; j++) {
                    // Is the spot available?
                    if (board[i][j] == '') {
                        board[i][j] = human;
                        let score = minimax(board, depth + 1, true);
                        board[i][j] = '';
                        bestScore = min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    } else {
        // If no find an optimus move, any move is optimus
        return 1;
    }
}