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
      strHTML += `<td class="cell closed cell-${i}-${j}" 
              onclick="onCellClicked(this,${i},${j})" onclick="onRevealedNegs(this,${i},${j})" oncontextmenu="javascript:onCellMarked(this,${i},${j});return false;">
              </td>`;
    }
    strHTML += `</tr>\n`;
  }
  var elBoard = document.querySelector('.board');
  elBoard.innerHTML = strHTML;
}
