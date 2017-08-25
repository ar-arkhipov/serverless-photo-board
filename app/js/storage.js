function FirebaseStg() {
    var stg;
    var root;
    var imagesRef;

    return {
        setupRefs: setupRefs,
        getImagesRef: getImagesRef
    };

    function setupRefs() {
        stg = firebase.storage();
        root = stg.ref();
        imagesRef = root.child('images');   // root/images
    }

    function getImagesRef(uid) {
        return imagesRef.child(uid);  // root/images/uid
    }
}