'use strict';

function saveMeme() {
    var memes = getStoredMemes();

    var foundId = memes.findIndex(meme => (meme === gMeme.id));
    if (foundId === -1) {
        memes.push(gMeme.id);
        saveToStorage(getMemesArraySaveName(), memes);
    }
    saveToStorage(getMemeSaveName(gMeme.id), gMeme);
    renderSavedMemes();            
}

function getMemeSaveName(id){
    return LOCALSTORAGE_PREFIX + '-' + id;
}

function getMemesArraySaveName(){
    return LOCALSTORAGE_PREFIX + '-stored-memes';
}

function getStoredMemes() {
    var memes = [];
    if (window.localStorage.getItem(getMemesArraySaveName())){
        memes = loadFromStorage(getMemesArraySaveName());
    }
    return memes;
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}