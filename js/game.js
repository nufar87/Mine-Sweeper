'use strict';
//The model :

const MINE = '💣';
const FLAG = '🚩';
var gBoard;
var gGame;
var gStartTime;
var gGameInterval;
var gLevel = { SIZE: 4, MINES: 2 };
var gLife;

function onInitGame() {
  stopTimer();
  gBoard = buildBoard();
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
  };
  console.log(gBoard);
  renderBoard(gBoard);
}

// function setMinesNegsCount(board) {
//   for (var i = 0; i < board.length; i++) {
//     for (var j = 0; j < board[0].length; j++) {
//       var countNegs = countNegs(i, j, board);
//       board[i][j].minesAroundCount = countNegs;
//     }
//   }
// }

function setMines(cellI, cellJ, board) {
  //set mines
  for (var i = 0; i < gLevel.MINES; i++) {
    var randI = getRandomInt(0, gLevel.SIZE);
    var randJ = getRandomInt(0, gLevel.SIZE);
    if (randI === cellI && randJ === cellJ) {
      break;
    } else {
      board[randI][randJ].isMine = true;
    }
  }
}

function countNegs(cellI, cellJ, board) {
  var minesAroundCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) minesAroundCount++;
    }
  }
  return minesAroundCount;
}

function minesAroundCounter(board) {
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (board[i][j].isMine) {
        break;
      } else {
        board[i][j].minesAroundCount = countNegs(i, j, board);
      }
    }
  }
}

function onCellClicked(elCell, cellI, cellJ) {
  if (!gGame.isOn) {
    gGame.isOn = true;
    setMines(cellI, cellJ, gBoard);
    minesAroundCounter(gBoard);
    var startTime = Date.now();
    gGameInterval = setInterval(function () {
      var elapsedTime = Date.now() - startTime;
      document.querySelector('.timer').innerText = (elapsedTime / 1000).toFixed(
        3
      );
    }, 100);
  }
  var cell = gBoard[cellI][cellJ];
  if (!cell.isMine) {
    if (cell.minesAroundCount !== 0) {
      renderCell(cellI, cellJ);
    } else {
    }
    expandShown(gBoard, cellI, cellJ);
    checkGameOver();
    console.log('check game over');
  }
  if (cell.isMine) {
    //update model:
    cell.isShown = true;
    gGame.isShown++;
    //update DOM
    var elMine = document.querySelectorAll(`.cell-${cellI}-${cellJ}`);
    elMine.innerText = MINE;
    elMine.classList.add('.color');

    gGame.isShown++;

    gameOver();
    console.log('game over');
  }
}

function expandShown(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) continue;
      if (!board[i][j].isShown) {
        renderCell(i, j);
        if (board[i][j].minesAroundCount === 0) {
          expandShown(board, cellI, cellJ);
        }
      }
    }
  }
}

function renderCell(cellI, cellJ) {
  var className = `cell-${cellI}-${cellJ}`;
  var elCell = document.querySelector(`.${className}`);
  var cell = gBoard[cellI][cellJ];
  if (cell.minesAroundCount > 0) elCell.innerText = cell.minesAroundCount;
  //update model:
  cell.isShown = true;
  gGame.shownCount++;
  //update DOM:
  elCell.classList.add('.color');
}

function newGame(size, mines) {
  gLevel = { SIZE: size, MINES: mines };
  onInitGame();
}

function stopTimer() {
  clearInterval(gGameInterval);
}

function gameOver() {
  !gGame.isOn;
  stopTimer();
}

function checkGameOver() {}

//not in use
function renderBoardWithMinesNegs(board) {
  // console.table(board);
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      var className = currCell.isMine ? 'mine' : '';
      var mine = currCell.isMine ? MINE : currCell.minesAroundCount;

      strHTML += `<td class="cell ${className}" 
            data-i="${i}" data-j="${j}"
            onclick="onCellClicked(this,${i},${j})">${mine}
            </td>`;
    }
    strHTML += `</tr>\n`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
function startTimer() {
  var gStartTime = Date.now();
  gGameInterval = setInterval(updateTimer, 100);
}
function updateTimer() {
  var diff = Date.now() - gStartTime;
  var inSeconds = (diff / 1000).toFixed(3);
  document.querySelector('.timer').innerText = inSeconds;
}
