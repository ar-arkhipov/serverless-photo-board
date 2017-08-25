function Topbar() {
    var topbar = document.querySelector('nav');
    var loginBtn = document.querySelector('.btn-login');
    var logOutBtn = document.querySelector('.btn-logout');
    var avatar = document.querySelector('.avatar');
    var username = document.querySelector('.username');

    var provider = new firebase.auth.GoogleAuthProvider();

    loginBtn.onclick = function() {
        firebase.auth().signInWithPopup(provider);
    };

    logOutBtn.onclick = function() {
        firebase.auth().signOut();
    };

    return {
        refreshUser: refreshUser
    };

    function refreshUser(user) {
        topbar.className = user ? 'logged-in' : 'logged-out';
        avatar.src = user ? user.providerData[0].photoURL : '';
        username.innerHTML = user ? user.providerData[0].displayName : '';
    }
}