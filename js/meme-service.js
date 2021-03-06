'use strict';
var gMeme = {};

function createNewMeme() {
    gMeme = {
        id: '',
        selectedImgId: -1,
        selectedLineIdx: -1,
        lines: [],
        selectedStickerIdx: -1,
        stickers: [],
        outlineColor: 'rgba(128, 122, 117, 50%)',
        activeOutlineColor: 'rgba(255, 255, 255, 90%)',
        size: {width: 500, height: 500}
    };
}

function setCurrentMeme(image) {
    createNewMeme();    
    gMeme.selectedImgId = image.id;
}

function createLine(txt) {
    // First time line creation    
    if (gMeme.lines.length === 0) {
        gMeme.id = `img-${gMeme.selectedImgId}-${getDateString()}`;
        gMeme.lines.push({
            txt: '',
            size: 48,
            align: 'left',
            color: 'white',
            outline: 'black',
            font: 'Impact',
            x: null,
            y: null
        });
    }
    else {
        var lastLine = gMeme.lines[gMeme.lines.length - 1];
        var newLine = {}
        newLine = Object.assign(newLine, lastLine);
        newLine.txt = txt;
        newLine.x = null;
        newLine.y = null;
        gMeme.lines.push(newLine);
    }
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function getSelectedLine() {
    if (gMeme.selectedLineIdx < 0) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1;
    }
    return gMeme.lines[gMeme.selectedLineIdx];
}

function deleteSelectedLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
}