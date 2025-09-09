let mistakes = 0;
let paused = false;
let timerInterval;
let secondsElapsed = 0;
function startTimer() {
    clearInterval(timerInterval);
    secondsElapsed = 0;
    timerInterval = setInterval(() => {
        if (!paused) {
            secondsElapsed++;
            let minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
            let seconds = String(secondsElapsed % 60).padStart(2, '0');
            document.getElementById("timer").textContent = `⏳ ${minutes}:${seconds}`;
        }
    }, 1000);
}
// Generate Sudoku + Number Pad
function generateEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
}
function generateFullBoard() {
    let board = generateEmptyBoard();
    for (let i = 0; i < 9; i++) {
        let num = Math.floor(Math.random() * 9) + 1;
        while (!isSafe(board, i, 0, num)) {
            num = Math.floor(Math.random() * 9) + 1;
        }
        board[i][0] = num;
    }
    solveSudoku(board);
    return board;
}
function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function removeCells(board, holes = 45) {
    let puzzle = JSON.parse(JSON.stringify(board));
    let removed = 0;
    while (removed < holes) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            removed++;
        }
    }
    return puzzle;
}
function generateSudoku() {
    mistakes = 0;
    document.getElementById("mistakes").textContent = "❌ Mistakes: 0/3";
    let boardDiv = document.getElementById("sudoku-board");
    boardDiv.innerHTML = "";
    closeModal("pauseModal");
    closeModal("gameOverModal");
    document.getElementById("result").textContent = "";

    solution = generateFullBoard();
    let puzzle = removeCells(solution, 45);

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("input");
            cell.type = "number";
            cell.min = 1;
            cell.max = 9;
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            if ((c + 1) % 3 === 0 && c !== 8) {
                cell.classList.add("thick-right");
            }
            if ((r + 1) % 3 === 0 && r !== 8) {
                cell.classList.add("thick-bottom");
            }
            if (puzzle[r][c] !== 0) {
                cell.value = puzzle[r][c];
                cell.disabled = true;
            } else {
                cell.addEventListener("input", () => {
                    if (paused) return;
                    let val = parseInt(cell.value);
                    if (isNaN(val)) {
                        cell.value = "";
                        cell.classList.remove("red");
                        cell.style.background = "white"; // reset to normal
                        return;
                    }
                    if (isNaN(val) || val < 1 || val > 9) {
                        cell.value = "";
                        return;
                    }
                    if (val === solution[r][c]) {
                        cell.disabled = true;
                        cell.classList.remove("red");
                        cell.style.background = "#d4edda"; // Green
                        checkWin();
                    } else {
                        cell.classList.add("red");
                        mistakes++;
                        document.getElementById("mistakes").textContent = `❌ Mistakes: ${mistakes}/3`;
                        if (mistakes >= 3) {
                            openModal("gameOverModal");
                        }
                    }
                });
            }
            boardDiv.appendChild(cell);
        }
    }

    startTimer();
}
function checkWin() {
    let inputs = document.querySelectorAll("#sudoku-board input");
    for (let input of inputs) {
        if (!input.disabled) {
            return; // Not yet completed
        }
    }
    launchConfetti();
    openModal("winModal");
}
function launchConfetti() {
    const duration = 2 * 1000; // 2 seconds
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}
// Pause toggle
function togglePause() {
    paused = !paused;
    if (paused) {
        openModal("pauseModal");
    } else {
        closeModal("pauseModal");
    }
}

// Modal functions
function openModal(id) {
    document.getElementById(id).style.display = "block";
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

generateSudoku();
