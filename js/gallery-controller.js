'use strict';

function initGallery(){
    createImages();
    var elGallery = document.querySelector('.gallery');
    elGallery.innerHTML = gImages.reduce((acc, image) => {
        return acc+= `<img id="img-${image.id}" src="${image.url}" alt="Gallery image ${image.keywords[0]}" onclick="imageSelected(this)" data-id="${image.id}" />`
    }, '');
    updateView();
}

function imageSelected(elImg){
    var elImageId = elImg.dataset.id;
    setCurrentMeme(getImageByElementId(elImageId));
    updateView(false);
    renderMeme();
}