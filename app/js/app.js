document.addEventListener('DOMContentLoaded', init, false);

function init() {
    var existingBoard = JSON.parse(localStorage.getItem('board'));
    var boardData = existingBoard || {id:1, cards:[]};
    var board = new Board(boardData);
    board.create().drawAllCards().setListeners();
}