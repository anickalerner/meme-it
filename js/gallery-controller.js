'use strict';
var gSearchTerm = '';

function initGallery(){
    createImages();
    showImages(gImages);
}

function showImages(images){
    var elGallery = document.querySelector('.gallery-container .gallery');
    elGallery.innerHTML = images.reduce((acc, image) => {
        return acc+= `<img id="img-${image.id}" src="${image.url}" alt="Gallery image ${image.keywords[0]}" onclick="imageSelected(this)" data-id="${image.id}" class="rounded-corners" data-keywords="${image.keywords}"/>`
    }, '');    
}

function imageSelected(elImg){
    var elImageId = elImg.dataset.id;
    setCurrentMeme(getImageByElementId(elImageId));
    updateView('editor');
    updateCanvasSize(elImg);
    renderMeme();
}

function onSearchStart(event){
    var code = event.keyCode;
    if ((code >= 65 && code <=90) || (code >=97 && code <= 122)){ // a letter is entered
        gSearchTerm += String.fromCharCode(code);
    }
    if (code === 8){ // Backspace is pressed
        gSearchTerm = gSearchTerm.substr(0, gSearchTerm.length-1);
    }
    gSearchTerm = gSearchTerm.toLowerCase();
    
    filterImages(gSearchTerm);
}

function filterImages(term){
    if (term.length > 0){
        var elClear = document.querySelector('.clear-icon');
        elClear.style.display = 'block';
        elClear.addEventListener('click', function(){
            gSearchTerm = '';
            searchByKeyWord(gSearchTerm);
        })
    }
    var filtered = gImages.filter(image => {
        return image.keywords.find(keyword => {
            return keyword.includes(term);
        })
    });
    showImages(filtered);
}

function renderSearchTermsMap(orderedMap){
    var firstFont = orderedMap[0][1];
    var biggestFont = Math.min(firstFont, 40);
    var ratio = biggestFont / firstFont;
    var elWords = orderedMap.slice(0, 5).reduce((acc, word) => {
        return acc+= `<span class="keyword" style="font-size: ${Math.max(+word[1] * ratio, 12)}px" onclick="countSearchTerm('${word[0]}')">${word[0]}</span>&nbsp;`;
    }, '');
    document.querySelector('.keywords-map').innerHTML = elWords;
}

function countSearchTerm(term){
    searchByKeyWord(term);
    increaseSearchTermCount(term);
}

function searchByKeyWord(term){
    gSearchTerm = term;
    document.querySelector('.search-by-keywords').value = term;
    filterImages(term);
}