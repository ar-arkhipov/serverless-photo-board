function imageService(card) {
    return {
        getFileData: getFileData
    };

    function getFileData() {
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
        var reader = new FileReader();
        reader.onload = function(ev) {
            var fileData = ev.target.result;
            card.addImage(fileData);
            reader = null;
        };
        reader.readAsDataURL(file);
    }

}