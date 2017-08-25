function Userlist() {

    var userListEl = document.querySelector('.user-list');
    var navigateFn;

    return {
        create: create,
        destroy: destroy,
        onNavigate: onNavigate
    };

    function create(data) {
        Object.keys(data).forEach(function(key) {
            userListEl.appendChild(_generateUserItem(key, data[key]));
        });
    }

    function destroy() {
        while (userListEl.lastChild) {
            userListEl.removeChild(userListEl.lastChild);
        }
    }

    function onNavigate(fn) {
        if (navigateFn) return;
        navigateFn = fn;
    }

    function _generateUserItem(id, userObj) {
        var li = document.createElement('li');
        li.className = 'user-item';
        var img = document.createElement('img');
        img.src = userObj.photoURL;
        li.appendChild(img);
        var span = document.createElement('span');
        span.innerHTML = userObj.displayName;
        li.appendChild(span);

        li.addEventListener('click', function() {
            navigateFn && navigateFn(id);
        });

        return li;
    }
}
