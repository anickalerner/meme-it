'use strict';
var gCurrentSticker;
const STICKER_START_SIZE = 120;

function initStickers() {
    var stickers = document.querySelectorAll('.sticker');
    stickers.forEach(elSticker => {
        elSticker.addEventListener('dragstart', handleDragStart, false)
        elSticker.addEventListener('dragend', handleDragEnd, false);
    });

    gCanvas.addEventListener('dragenter', handleDragEnter, false);
    gCanvas.addEventListener('dragover', handleDragOver, false);
    gCanvas.addEventListener('dragleave', handleDragLeave, false);
    gCanvas.addEventListener('drop', handleDrop, false);
}

function drawStickers(meme) {
    meme.stickers && meme.stickers.forEach((sticker, id) => {
        //Sticker's x and y are its top left corner
        var img = new Image();
        img.onload = function(){
            gCtx.drawImage(img, sticker.x, sticker.y, sticker.size, sticker.size);
        }
        img.src = sticker.img;
        if (gCanvasFocus && meme.selectedStickerIdx === id) drawStickerOutline(sticker);
    });
}

function drawStickerOutline(sticker) {
    gCtx.beginPath();
    gCtx.rect(sticker.x - 2, sticker.y - 2, sticker.size + 4, sticker.size + 4);
    gCtx.strokeStyle = gMeme.activeOutlineColor;
    gCtx.stroke();
}

function handleDragStart(e) {
    gCurrentSticker = this;
}

function handleDragEnd(e) {
    gCurrentSticker = null;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'copy';
    return false;
}
function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    e = e || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    }
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    gMeme.stickers.push({ img: gCurrentSticker.src, x: event.offsetX - STICKER_START_SIZE/2, y: event.offsetY - STICKER_START_SIZE/2, size: STICKER_START_SIZE });
    renderMeme();
    return false;
}

function checkStickerClicked(clickPosition) {
    drawRect(clickPosition);
    console.log(clickPosition);
    var foundSticker = gMeme.stickers.findIndex(sticker => {
        var start = { x: sticker.x, y: sticker.y };
        var size = { width: sticker.size, height: sticker.size };
        return checkPositionInBounderies(clickPosition, start, size);
    });
    if (foundSticker !== -1) {
        gMeme.selectedStickerIdx = foundSticker;
        gCanvasFocus = true;
        gIsDragging = true;
    }
    else {
        gCanvasFocus = false;
    }
}

