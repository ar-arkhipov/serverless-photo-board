function imageService(card) {
    return {
        prepareAndUpload: prepareAndUpload
    };

    function prepareAndUpload() {
        var fileSelector = document.createElement('input');
        fileSelector.setAttribute('type', 'file');
        fileSelector.onchange = function(ev) {
            var files = ev.target.files;
            _handleFiles(files);
            fileSelector = null;
        };
        fileSelector.click();
    }

    function _handleFiles(files) {
        var file = files[0];
        var isImage = file && file.type && file.type.substring(0, 5) == 'image';
        if (!isImage) {
            return alert('Please use image!')
        }
        _upload(file);
    }

    function _upload(file) {
        var fileName = Date.now().toString();
        card.toggleSpinner(true);
        card.parentBoard.stgRef.child(fileName).put(file).then(function(snapshot) {
            var imageData = {
                url: snapshot.metadata.downloadURLs[0],
                name: snapshot.metadata.name
            };
            card.addImage(imageData);
            card.toggleSpinner(false);
        });
    }

}