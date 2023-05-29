document.addEventListener('DOMContentLoaded', function() {
    const board = document.querySelector('.board');
    const size = 10; // Adjust the size as per your preference
    const mineCount = 10; // Adjust the number of mines as per your preference
    let minefield = [];
    let mines = [];
    let isGameOver = false;
    let isFirstClick = true;
    let startTime;
    let timerInterval;
    const gameOverMessage = document.getElementById('game-over-message');
  
    function createBoard() {
        // Create the minefield cells
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
            minefield.push(cell);
    
            // Handle cell click event
            cell.addEventListener('click', function() {
                if (isGameOver) return;
                if (isFirstClick) {
                    isFirstClick = false;
                    startGame();
                    placeMines(i);
                }
                revealCell(cell);
            });
        }
    }
  
    function startGame() {
        startTime = new Date().getTime();
        timerInterval = setInterval(updateTimer, 1000);
    }
  
    function updateTimer() {
        const currentTime = new Date().getTime();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const timerElement = document.querySelector('.timer');
        timerElement.textContent = `Time: ${elapsedTime} seconds`;
    }
  
    function placeMines(clickedIndex) {
        const mineIndexes = Array.from({ length: size * size }, (_, i) => i);
        // Remove the clicked index to prevent mine placement on the first clicked cell
        mineIndexes.splice(clickedIndex, 1);
        // Randomly place mines
        for (let i = 0; i < mineCount; i++) {
            const randomIndex = Math.floor(Math.random() * mineIndexes.length);
            const mineIndex = mineIndexes.splice(randomIndex, 1)[0];
            minefield[mineIndex].classList.add('mine');
            mines.push(minefield[mineIndex]);
        }
    }
  
    function revealCell(cell) {
        if (cell.classList.contains('revealed')) return;
    
        cell.classList.add('revealed');
    
        if (cell.classList.contains('mine')) {
            gameOver(false);
        } else {
            const mineCount = countAdjacentMines(cell);
            if (mineCount > 0) {
                cell.textContent = mineCount;
                // Set color based on mine count
                if (mineCount === 1) {
                cell.style.color = 'blue';
                } else if (mineCount === 2) {
                cell.style.color = 'green';
                } else if (mineCount === 3) {
                cell.style.color = 'red';
                }
            } else {
                const cellIndex = minefield.indexOf(cell);
                const row = Math.floor(cellIndex / size);
                const col = cellIndex % size;
                const adjacentCells = getAdjacentCells(row, col);
                adjacentCells.forEach(adjCell => revealCell(adjCell));
            }
        }
    
        checkWin();
    }
  
    function countAdjacentMines(cell) {
        let mineCount = 0;
        const cellIndex = minefield.indexOf(cell);
        const row = Math.floor(cellIndex / size);
        const col = cellIndex % size;
        const adjacentCells = getAdjacentCells(row, col);
  
        adjacentCells.forEach(adjCell => {
            if (adjCell.classList.contains('mine')) {
            mineCount++;
            }
        });
  
        return mineCount;
    }
  
    function getAdjacentCells(row, col) {
        const positions = [
            { row: row - 1, col: col - 1 },
            { row: row - 1, col },
            { row: row - 1, col: col + 1 },
            { row, col: col - 1 },
            { row, col: col + 1 },
            { row: row + 1, col: col - 1 },
            { row: row + 1, col },
            { row: row + 1, col: col + 1 }
        ];
    
        return positions
        .filter(pos => pos.row >= 0 && pos.row < size && pos.col >= 0 && pos.col < size)
        .map(pos => minefield[pos.row * size + pos.col]);
    }
  
    function gameOver(isWin) {
        isGameOver = true;
        mines.forEach(mine => {
            mine.classList.add('revealed');
            mine.innerHTML = '💣'; // Bomb emoji
        });
        clearInterval(timerInterval); // Stop the timer
        const message = isWin ? 'Congratulations! You won!' : 'Game over! You lost!';
        const gameOverMessage = document.getElementById('game-over-message');
        gameOverMessage.textContent = message;
        gameOverMessage.style.display = 'block'; // Show the game over message
    }
  
    function checkWin() {
        const revealedCount = Array.from(minefield).filter(cell => cell.classList.contains('revealed')).length;
        const totalCells = size * size;
        if (revealedCount === totalCells - mineCount) {
            gameOver(true);
        }
    }
  
    function resetGame() {
        board.innerHTML = ''; // Clear the board
        minefield = [];
        mines = [];
        isGameOver = false;
        isFirstClick = true;
        clearInterval(timerInterval); // Stop the timer
        const timerElement = document.querySelector('.timer');
        timerElement.textContent = 'Time: 0 seconds'; // Reset the timer display
        gameOverMessage.style.display = 'none'; // Hide the game over message
        createBoard();
    }
  
    const newGameBtn = document.getElementById('new-game-btn');
    newGameBtn.addEventListener('click', resetGame);
  
    createBoard();
  });