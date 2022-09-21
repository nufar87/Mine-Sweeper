'use strict';

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      const cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      board[i][j] = cell;
    }
  }
  return board;
}

function renderBoard(board) {
  // console.table(board);
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>\n`;
    for (var j = 0; j < board.length; j++) {
      var currCell = board[i][j];
      strHTML += `<td class="cell cell-${i}-${j}" 
              onclick="onCellClicked(this,${i},${j})">
              </td>`;
    }
    strHTML += `</tr>\n`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
