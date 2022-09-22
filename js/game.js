'use strict';

const MINE = '💣';
const FLAG = '🚩';
const SMILEY = ['😊', '🤓', '😩'];
const HINT = '💡';
const LIFE = '❤️';

var gBoard;
var gGame;
var gStartTime;
var gGameInterval;
var gLevel = { SIZE: 4, MINES: 2 };
var gLife;
var gHints;
var myHintTimeOut;

function onInitGame() {
  stopTimer();
  gBoard = buildBoard();
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    gLife: 3,
  };
  gHints = 3;
  document.querySelector('.timer').innerText = '00:00';
  document.querySelector('.smiley').innerText = SMILEY[0];
  document.querySelector('.lives').innerText = LIFE.repeat(gGame.gLife);
  document.querySelector('.hints').innerText = HINT.repeat(gHints);
  console.log(gBoard);
  renderBoard(gBoard);
}

function setMines(cellI, cellJ, board) {
  //set mines
  for (var i = 0; i < gLevel.MINES; i++) {
    var randI = getRandomInt(0, gLevel.SIZE);
    var randJ = getRandomInt(0, gLevel.SIZE);
    if (randI === cellI && randJ === cellJ) {
      break;
    } else {
      board[randI][randJ].isMine = true;
      //udate DOM
      var className = `cell-${cellI}-${cellJ}`;
      var elCell = document.querySelector(`.${className}`);
      elCell.classList.add('mine');
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
        continue;
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
      var elpasedTime = Date.now() - startTime;
      document.querySelector('.timer').innerText = (elpasedTime / 1000).toFixed(
        2
      );
      gGame.secsPassed = (elpasedTime / 1000).toFixed(0);
    }, 100);
  }
  var cell = gBoard[cellI][cellJ];
  if (!cell.isMine) {
    if (cell.minesAroundCount !== 0) {
      renderCell(cellI, cellJ);
    } else {
      expandShown(gBoard, cellI, cellJ);
    }
    //update DOM
    cell.isShown = true;
    gGame.shownCount++;
    document.querySelector('.smiley').innerText = SMILEY[0];

    checkGameOver();
    console.log('check game over');
  }
  if (cell.isMine && gGame.gLife > 0) {
    //update model:
    cell.isShown = true;
    gGame.shownCount++;
    gGame.gLife--;
    checkGameOver();
    // //update DOM
    elCell.classList.remove('closed');
    elCell.innerText = MINE;
    elCell.classList.add('open');
    document.querySelector('.lives').innerText = LIFE.repeat(gGame.gLife);
    document.querySelector('.smiley').innerText = SMILEY[2];
    checkGameOver();
  }
}

function expandShown(board, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
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
  elCell.classList.remove('closed');
  elCell.classList.add('open');
}

function onNewGame(size, mines) {
  gLevel = { SIZE: size, MINES: mines };
  onInitGame();
}

function stopTimer() {
  clearInterval(gGameInterval);
}

function gameOver() {
  //reveal all mines
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j].isMine) {
        var cell = gBoard[i][j];
        //update model:
        cell.isShown = true;
        gGame.shownCount++;
        //update DOM
        var elMine = document.querySelector(`.cell-${i}-${j}`);
        elMine.classList.remove('closed');
        elMine.innerText = MINE;
        elMine.classList.add('open');
      }
    }
  }
  //update model:
  !gGame.isOn;
  stopTimer();
  //update DOM:
  document.querySelector('.modal h2').innerText = 'Game Over!';
  document.querySelector('.modal').style.display = 'block';
  document.querySelector('.smiley').innerText = SMILEY[2];
  var elCells = document.querySelectorAll('.cell');
  for (var i = 0; i < elCells.length; i++) {
    elCells[i].removeAttribute('onclick');
  }
  console.log('game over');
}

function checkGameOver() {
  var elMarkedCells = document.querySelectorAll('.marked');
  if (
    elMarkedCells === gLevel.MINES &&
    gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
  ) {
    document.querySelector('.smiley').innerText = SMILEY[1];
    document.querySelector('.modal h2').innerText = 'Victory!';
    document.querySelector('.modal').style.display = 'block';
  }
  if (!gGame.gLife) gameOver();
  if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gGame.markedCount)
    gameOver();
}

function onCellMarked(elCell, cellI, cellJ) {
  var cell = gBoard[(cellI, cellJ)];
  if (cell.isMarked) {
    //model:
    cell.isMarked = false;
    gGame.markedCount--;
    //DOM:
    elCell.innerText = '';
    elCell.classList.remove('marked');
    console.log(elCell, 'elCell');
  } else {
    cell.isMarked = true;
    gGame.markedCount++;
    //update DOM:
    elCell.innerText = FLAG;
    elCell.classList.add('marked');
    console.log(elCell, 'elCell');
  }
}

// function onShowHint() {
//   if (gHints) {
//     console.log('onShowHint');
//     myHintTimeOut = setTimeout(revealedNegs(cellI, cellJ, gBoard), 1000);
//     console.log('CELLI', cellI, CellJ);
//     clearTimeout(myHintTimeOut);
//     gHints--;
//     document.querySelector('.hints').innerText = HINT.repeat(gHints);
//   }
// }

// function revealedNegs(cellI, cellJ, board) {
//   var elCell = document.querySelector(`.cell-${cellI}-${cellJ}`);
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= board.length) continue;
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue;
//       elCell.classList.remove('closed');
//       elCell.classList.add('open');
//       if (board[i][j].isMine) {
//         elCell.innerText = MINE;
//       } else if (board[i][j].minesAroundCount) {
//         elCell.innerText = board[i][j].minesAroundCount;
//       }
//     }
//   }
// }
