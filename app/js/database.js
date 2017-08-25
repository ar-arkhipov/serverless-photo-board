function FirebaseDB() {
    var db;
    var root;
    var usersRef;
    var boardsRef;

    return {
        setupRefs: setupRefs,
        checkUserExists: checkUserExists,
        getBoardRef: getBoardRef,
        getUsersRef: getUsersRef
    };

    function setupRefs() {
        db = firebase.database();
        root = db.ref();
        usersRef = root.child('users');
        boardsRef = root.child('boards');  // root/boards
    }

    function checkUserExists(user) {
        var ref = usersRef.child(user.uid);
        ref.update(user.providerData[0]);
    }

    function getBoardRef(id) {
        return boardsRef.child(id);
    }

    function getUsersRef() {
        return usersRef;
    }

}