'use strict';
const LOCALSTORAGE_PREFIX = 'MEME-IT';

function init() {
    initGallery();
    initEditor();
    updateView('gallery');
    renderSavedMemes();
}

function updateView(view = 'gallery') {
    switch (view) {
        case 'gallery':
            showContainer('.gallery-container');
            hideContainer('.editor-container');
            hideContainer('.mymemes-container');
            checkShowEditorButton();
            break;
        case 'editor':
            showContainer('.editor-container', 'flex');
            hideContainer('.gallery-container');
            hideContainer('.mymemes-container');
            showNavBtn('.gallery-btn');
            resetLineField();
            break;
        case 'mymemes':
            showContainer('.mymemes-container');
            hideContainer('.gallery-container');
            hideContainer('.editor-container');
            checkShowEditorButton();
            showNavBtn('.gallery-btn');
            break;
        default:
            break;
    }
}

function checkShowEditorButton() {
    if (gMeme && gMeme.selectedImgId >= 0){
        showNavBtn('.editor-btn');
    }    
}

function showNavBtn(btn){
    var classes = document.querySelector(btn).parentElement.classList;
    classes.remove('hide');
    classes.add('show');
}

function showContainer(container, display = 'block'){
    document.querySelector(container).style.display = display;
}

function hideContainer(container){
    document.querySelector(container).style.display = 'none';
}

