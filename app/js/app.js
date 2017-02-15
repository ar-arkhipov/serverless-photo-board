document.addEventListener('DOMContentLoaded', init, false);

function init() {
    var topbar = Topbar();
    var board, boardData, existingBoard;

    firebase.auth().onAuthStateChanged(function(user) {
        topbar.refreshUser(user);
        if (user) {
            existingBoard = JSON.parse(localStorage.getItem('board'));
            boardData = existingBoard || {id:1, cards:[]};
            board = new Board(boardData);
            board.create().drawAllCards().setListeners();
        } else {
            _clearBoard();
        }
    });

    function _clearBoard() {
        board && board.destroy();
        board = null;
    }
}