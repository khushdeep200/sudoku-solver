



let solution = generateEmptyBoard();

function generateEmptyBoard() {
    return Array.from({ length: 9 }, () => Array(9).fill(0));
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

/* -------------------- Helpers for color classes & highlights -------------------- */

function removeNumberClasses(cell) {
    for (let i = 1; i <= 9; i++) cell.classList.remove('num' + i);
}

function clearHighlights() {
    document.querySelectorAll('#sudoku-board input').forEach(c => {
        c.classList.remove('highlight', 'selected');
    });
}

function highlightPeers(row, col) {
    clearHighlights();
    const inputs = document.querySelectorAll('#sudoku-board input');
    inputs.forEach(cell => {
        const r = parseInt(cell.dataset.row, 10);
        const c = parseInt(cell.dataset.col, 10);
        if (r === row || c === col ||
            (Math.floor(r / 3) === Math.floor(row / 3) && Math.floor(c / 3) === Math.floor(col / 3))) {
            cell.classList.add('highlight');
        }
    });
    // mark the selected cell more visibly
    const selected = document.querySelector(`#sudoku-board input[data-row="${row}"][data-col="${col}"]`);
    if (selected) selected.classList.add('selected');
}

/* -------------------- Create grid, attach listeners -------------------- */

function takeSudoku() {
    let boardDiv = document.getElementById("sudoku-board");
    boardDiv.innerHTML = "";
    solution = generateEmptyBoard();

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let cell = document.createElement("input");
            cell.type = "number";
            cell.min = 1;
            cell.max = 9;
            cell.inputMode = "numeric";
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            if ((c + 1) % 3 === 0 && c !== 8) cell.classList.add("thick-right");
            if ((r + 1) % 3 === 0 && r !== 8) cell.classList.add("thick-bottom");

            // input listener: validate and color number
            cell.addEventListener("input", () => {
                let val = parseInt(cell.value, 10);
                // clear existing classes first
                removeNumberClasses(cell);
                cell.classList.remove('red');
                solution[r][c] = 0;

                if (isNaN(val)) {
                    // empty cell
                    solution[r][c] = 0;
                    return;
                }

                if (val < 1 || val > 9) {
                    // out of range -> don't accept
                    cell.value = "";
                    solution[r][c] = 0;
                    return;
                }

                // temporarily leave solution[r][c] as 0 while checking constraints
                if (!isSafe(solution, r, c, val)) {
                    // invalid entry according to current board
                    cell.classList.add('red');
                    // still show the attempted number colored so user can see
                    cell.classList.add('num' + val);
                    solution[r][c] = 0;
                } else {
                    cell.classList.add('num' + val);
                    solution[r][c] = val;
                }
            });

            // focus/blur listeners for highlights
            cell.addEventListener("focus", () => highlightPeers(r, c));
            cell.addEventListener("blur", () => {
                // small delay so clicking another cell's focus doesn't clear before it highlights
                setTimeout(() => {
                    if (!document.activeElement || document.activeElement.tagName !== 'INPUT') {
                        clearHighlights();
                    }
                }, 50);
            });

            boardDiv.appendChild(cell);
        }
    }
}

/* -------------------- Solve and apply visual styles -------------------- */

function nowsolveSudoku() {
    let inputs = document.querySelectorAll("#sudoku-board input");
    if (solveSudoku(solution)) {
        inputs.forEach(cell => {
            const r = parseInt(cell.dataset.row, 10);
            const c = parseInt(cell.dataset.col, 10);
            const val = solution[r][c];
            removeNumberClasses(cell);
            cell.value = val;
            cell.classList.remove('red');
            cell.classList.add('num' + val);
            cell.classList.add('solved'); // mark as solver-filled
        });
    } else {
        alert("❌ No solution exists for this Sudoku!");
    }
}

/* initialize */
takeSudoku();
