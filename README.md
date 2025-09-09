# sudoku-solver
A Sudoku Solver implemented using backtracking and recursion. The program efficiently fills in the missing numbers in a 9x9 Sudoku grid while following all Sudoku rules.

Basic Sudoku Rules
1. Each row contains the numbers 1–9 exactly once.
2. Each column contains the numbers 1–9 exactly once.
3. Each 3×3 subgrid contains the numbers 1–9 exactly once.
4. A number cannot be repeated within the same row, column, or 3×3 subgrid.
5. The puzzle always starts with some numbers already filled in, and there is typically only one unique solution.

Features
1. Solves any valid Sudoku puzzle.
2. Uses backtracking algorithm for efficiency.
3. Supports customizable input grids.

Can be extended for visualization (GUI or CLI-based).

Tech Stack
Language: C++ / Python / Java (update based on your code)
Algorithm: Backtracking

Example Input
0 0 3 0 2 0 6 0 0
9 0 0 3 0 5 0 0 1
0 0 1 8 0 6 4 0 0
0 0 8 1 0 2 9 0 0
7 0 0 0 0 0 0 0 8
0 0 6 7 0 8 2 0 0
0 0 2 6 0 9 5 0 0
8 0 0 2 0 3 0 0 9
0 0 5 0 1 0 3 0 0

Example Output
4 8 3 9 2 1 6 5 7
9 6 7 3 4 5 8 2 1
2 5 1 8 7 6 4 9 3
5 4 8 1 3 2 9 7 6
7 2 9 5 6 4 1 3 8
1 3 6 7 9 8 2 4 5
3 7 2 6 8 9 5 1 4
8 1 4 2 5 3 7 6 9
6 9 5 4 1 7 3 8 2

How It Works
1. Find an empty cell.
2. Try placing digits 1–9.
3. Validate according to Sudoku rules.
4. If valid, move to the next cell.
5. If stuck, backtrack and try another number.

Future Enhancements
Add a graphical interface for puzzle visualization.

Generate random Sudoku puzzles.

Add difficulty level classification.
