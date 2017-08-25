document.addEventListener('DOMContentLoaded', init, false);

function init() {
    var topbar = Topbar();
    var userlist = Userlist();
    var fbDB = FirebaseDB();
    var fbStg = FirebaseStg();
    var currentUser;
    var currentBoardId;
    var board;

    firebase.auth().onAuthStateChanged(function(user) {
        currentUser = user;
        topbar.refreshUser(user);
        if (user) {
            fbDB.setupRefs();
            fbDB.checkUserExists(user);
            fbStg.setupRefs();
            setupUserlist();
            navigate(user.uid);
        } else {
            userlist.destroy();
            _clearBoard();
        }
    });

    function navigate(id) {
        if (id == currentBoardId) return;
        _clearBoard();
        var boardRef = fbDB.getBoardRef(id);
        var imagesStgRef = fbStg.getImagesRef(id);
        var isOwner = id == currentUser.uid;
        boardRef.once('value').then(function(snapshot) {
            var data = snapshot.val();
            currentBoardId = id;
            board = new Board(data, isOwner, boardRef, imagesStgRef);
            board.create().drawAllCards().setListeners();
        });
    }

    function setupUserlist() {
        userlist.onNavigate(navigate);
        fbDB.getUsersRef().once('value').then(function(snapshot) {
            var data = snapshot.val();
            userlist.create(data);
        });
    }

    function _clearBoard() {
        board && board.destroy();
        board = null;
    }

}
