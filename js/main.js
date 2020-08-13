'use strict';
var gGalleryMode = true;
function init() {
    initGallery();
    initEditor();
}

function updateView(galleryView = true) {
    gGalleryMode = galleryView;
    if (gGalleryMode) {
        document.querySelector('.gallery-container').style.display = 'block';
        document.querySelector('.editor-container').style.display = 'none';

        document.querySelector('.gallery-btn').style.display = 'none';
        var showEditor = (gMeme.selectedImgId >= 0) ? 'inline-block' : 'none'
        document.querySelector('.editor-btn').style.display = showEditor;
    }
    else {
        //Editor mode
        document.querySelector('.gallery-container').style.display = 'none';
        document.querySelector('.editor-container').style.display = 'flex';

        document.querySelector('.editor-btn').style.display = 'none';
        document.querySelector('.gallery-btn').style.display = 'inline-block';
    }
}


