let board;

let ai = 'X';
let human = 'O';
let humanStart = false;
let currentPlayer = humanStart ? human : ai;
let results = document.getElementById("results");

/**
 * 
 * @param {*} size 
 * @returns Return a new matrix of empty strings
 */
function Board(size) {
    let board = [];
    for (let i = 0; i < size; i++) {
        board[i] = [];
        for (let j = 0; j < size; j++) {
            board[i][j] = '';
        }
    }
    return board;
}

/**
 * 
 * @param {*} containerID 
 * @param {*} size 
 * Render the board in a div with id = containerID, use the global variable size
 * for build it.
 */
function initBoard(containerID, size) {
    const container = document.getElementById(containerID);
    container.innerHTML = "";

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let id = i * size + j;
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.id = id;
            cell.onclick = play;
            container.appendChild(cell);
        }
    }

    container.style.gridTemplateColumns = `repeat(${size},1fr)`;
    container.style.gridTemplateRows = `repeat(${size},1fr)`;
}

/**
 * 
 * @param {*} e 
 * Get the clicked cell, gets the id and the cords of the cell, if current player are the human
 * you can choose the position, else the machine will select using minimax
 */
function play(e) {
    let id = e.target.id;
    let i = parseInt(id / size, 10);
    let j = parseInt(id - i * size, 10);

    if (board[i][j] == '') {
        board[i][j] = human;
        e.target.innerText = human;
        currentPlayer = ai;
        bestMove();
        draw()
    }
}

/**
 * 
 * @param {*} player 
 * @returns true if find lines of the character player, works with any character of player
 */
function isWinner(player) {
    // Horizontal Lines, Vertical Lines, and Diagonals
    let vscores = Array.apply(null, Array(size)).map(Number.prototype.valueOf, 0);
    let hscores = Array.apply(null, Array(size)).map(Number.prototype.valueOf, 0);
    let dscores = [0, 0]

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] == player) {
                vscores[j]++;
                hscores[i]++;

                if (i == j) {
                    dscores[0]++;
                }
                if (i == board.lenght - 1 - j) {
                    dscores[1]++;
                }
            }
        }
    }

    let vwon = vscores.find(x => x == size)
    let hwon = hscores.find(x => x == size)
    let dwon = dscores.find(x => x == size)

    if (vwon || hwon || dwon) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @returns The id of the winner, "X" if machine won, "O" if human won, 0 if tie and null
 * if nobody wons and no tie.
 */
function getWinner() {
    let winner = null;
    let opened = size * size;

    if (isWinner(ai)) winner = ai;
    if (isWinner(human)) winner = human;

    // Verifica si hay empates
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] != '') {
                opened--;
            }
        }
    }

    if (opened == 0 && winner == null) {
        winner = "tie";
    }

    return winner;
}

/**
 * Render the board using the string matrix saved in `board` global variable
 */
function draw() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = document.getElementById(i * size + j)
            cell.innerText = board[i][j]
        }
    }

    let winner = getWinner();

    if (winner !== null) {
        if (winner == human) {
            results.innerText = "El jugador humano ha ganado";
            results.className = "";
            results.classList.add("green");
        };
        if (winner == ai) {
            results.innerText = "Has sido vencido";
            results.className = "";
            results.classList.add("red");
        }
        if (winner == "tie") {
            results.innerText = "Ocurrió un empate";
            results.className = "";
            results.classList.add("blue");
        }
    }
}

/**
 * 
 * @param {*} n is the size of the board, 2,3,4,... n
 * @param {*} d is the deepth of the minmax search, if you select n>3 i recomend d < 5
 * @param {*} hs if 1, the human can play first, else the machine will select first
 * 
 */
function setup(n, d, hs) {
    board = Board(n);
    size = n;
    maxdepth = d;
    humanStart = hs;
    currentPlayer = humanStart ? human : ai;
    results.innerHTML = "";
    results.className = "";

    initBoard("container", n);

    if (currentPlayer == ai) {
        draw()
        bestMove()
    }
    draw()
}

const button = document.getElementById("config");

/**
 * 
 * @param {*} e 
 * When you click the config button, it will restart the game
 */
button.onclick = (e) => {
    let size = document.getElementById("size").value;
    let depth = document.getElementById("depth").value;
    let hs = document.getElementById("hs").value == 1 ? true : false;
    setup(size, depth, hs);
}

// Default values
setup(size, 5, false)