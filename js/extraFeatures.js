'use strict';

//if 'Hints' is clicked and hints>0, onShowHint() will change isRevealedNegsOn to TRUE
function onShowHint() {
  if (gGame.isOn && gHints > 0) {
    isRevealedNegsOn = true;
    console.log(isRevealedNegsOn, 'isRevealedNegsOn');
  } else {
    return;
  }
}

// if (isRevealedNegsOn) -> onRevealedNegs() will work onCellClicked() and will show HINT
function onRevealedNegs(elCell, cellI, cellJ) {
  var elCells = [];
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= gBoard[i].length) continue;
      var className = `cell-${i}-${j}`;
      var elCell = document.querySelector(`.${className}`);
      var cell = gBoard[i][j];
      if (cell.isShown) continue;
      elCell.classList.remove('closed');
      elCell.classList.add('open');
      if (gBoard[i][j].isMine) elCell.innerText = MINE;
      if (gBoard[i][j].minesAroundCount)
        elCell.innerText = gBoard[i][j].minesAroundCount;
      elCells.push(elCell);
    }
  }

  setTimeout(function () {
    for (var i = 0; i < elCells.length; i++) {
      var elCell = elCells[i];
      elCell.classList.remove('open');
      elCell.classList.add('closed');
      if (elCell.classList.contains('marked')) {
        elCell.innerText = FLAG;
      } else {
        elCell.innerText = '';
      }
    }
  }, 1000);
  gHints--;
  document.querySelector('.hints').innerText = HINT.repeat(gHints);
  isRevealedNegsOn = false;
}

// boolean for manually set mines mode
function onManuallyMode() {
  if (!gGame.isOn) {
    gManuallyMode = true;
  }
}

function setMinesManually(elCell, cellI, cellJ, board) {
  board[cellI][cellJ].isMine = true;
  //udate DOM
  elCell.classList.add('mine');
  elCell.classList.add('closed');
  return;
}
// boolean for 7BOOM set mines mode
function on7Boom(gBoard) {
  onSmileyNewGame(gBoard.length);
  gGame.isOn = true;
  g7Boom = true;
  console.log(g7Boom, 'g7Boom');
}

function setMines7Boom(gBoard) {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      var className = `cell-${i}-${j}`;
      var elCell = document.querySelector(`.${className}`);
      var index = +elCell.dataset.index;
      if (index % 7 === 0 && index !== 0) {
        //update model
        gBoard[i][j].isMine = true;
        //udate DOM
        elCell.classList.add('mine');
        elCell.classList.add('closed');
      }
    }
  }
}

function onSafeClick(elBtn) {
  if (gSafeClickCount === 0) return;
  elBtn.disabled = true;
  var isReleventCellFound = false;
  var cell;
  while (!isReleventCellFound) {
    var randI = getRandomInt(0, gBoard.length);
    var randJ = getRandomInt(0, gBoard[0].length);
    cell = gBoard[randI][randJ];
    if (!cell.isShown && !cell.isMine) isReleventCellFound = true;
  }
  var className = `cell-${randI}-${randJ}`;
  document.querySelector(`.${className}`).classList.add('safe');
  setTimeout(function () {
    document.querySelector(`.${className}`).classList.remove('safe');
    elBtn.disabled = false;
  }, 1500);
  gSafeClickCount--;
  document.querySelector('.safe-click span').innerText = gSafeClickCount;
}
