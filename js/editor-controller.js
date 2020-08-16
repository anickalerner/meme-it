'use strict';
var gCanvas;
var gCtx;
var gLineYInitPositions;
var gCanvasFocus = false;
var gIsDragging = false;

const FONTS = ['Impact', 'Arial', 'Comic Sans M', 'Helvetica', 'Times New Roman', 'Times',
    'Courier New', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Trebuchet MS', 'Arial Black'];
const EDITOR_PADDING = 20;
const LINE_X = EDITOR_PADDING + 5;
const OUTLINE_PADDING = 10;
const MAX_CANVAS_WIDTH = 500;

function initEditor() {
    gCanvas = document.getElementById("editor");
    gCanvas.addEventListener('mousedown', onCanvasMouseDown);
    gCanvas.addEventListener('mousemove', onCanvasMove);
    gCanvas.addEventListener('mouseup', onCanvasMouseUp);
    window.addEventListener('mouseup', onMouseUp);
    gCtx = gCanvas.getContext("2d");
    gLineYInitPositions = [EDITOR_PADDING * 2, gCanvas.height - EDITOR_PADDING, gCanvas.height / 2, gCanvas.height * 0.25, gCanvas.height * 0.75];
    initFontsSelect();
    initStickers();
}

function updateCanvasSize(elImg) {
    var imageRatio = elImg.height / elImg.width;
    gCanvas.width = Math.min(elImg.width, MAX_CANVAS_WIDTH);
    gCanvas.height = gCanvas.width * imageRatio;
    gMeme.size.width = gCanvas.width;
    gMeme.size.height = gCanvas.height;
}

function initFontsSelect() {
    var elSelect = document.querySelector('.fonts-select');
    var options = FONTS.reduce((acc, font) => {
        return acc += `<option style="font-family: ${font}">${font}</option>`;
    }, '');
    elSelect.innerHTML = options;
}

function renderMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = document.getElementById('img-' + gMeme.selectedImgId);
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    drawLines(gMeme);
    drawStickers(gMeme);
}

function drawLines(meme){
    meme.lines.forEach((line, ind) => {
        var x = getLineX(line);
        var y = getLineY(line, ind);
        if (gCanvasFocus && meme.selectedLineIdx > -1) drawLineOutline(line, ind);
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.outline;
        gCtx.lineWidth = 2;
        gCtx.fillText(line.txt, x, y);
        gCtx.strokeText(line.txt, x, y);
    });
}

function getOutlinePosStart(line) {
    return { x: EDITOR_PADDING, y: line.y - getTextHeight() - OUTLINE_PADDING / 2 };
}

function getOutlineSize() {
    return { width: gCanvas.width - EDITOR_PADDING * 2, height: getTextHeight() + OUTLINE_PADDING * 2 };
}

function drawLineOutline(line, lineId) {
    gCtx.beginPath();
    var start = getOutlinePosStart(line);
    var size = getOutlineSize();

    gCtx.rect(start.x, start.y, size.width, size.height);

    if (lineId === gMeme.selectedLineIdx) {
        gCtx.strokeStyle = gMeme.activeOutlineColor;
        gCtx.fillStyle = 'rgba(255, 255, 255, 50%)';
        gCtx.fill();
    }
    else {
        gCtx.strokeStyle = gMeme.outlineColor;
    }
    gCtx.stroke();
}

function getCursorPosition(event) {
    return { x: event.offsetX, y: event.offsetY };
}

function onCanvasMouseDown(event) {
    gMeme.selectedStickerIdx = -1;
    gMeme.selectedLineIdx = -1;
    var clickPosition = getCursorPosition(event);
    checkLineClicked(clickPosition);
    !gCanvasFocus && checkStickerClicked(clickPosition);
    renderMeme();
}

function drawRect(pos) {
    gCtx.strokeStyle = 'red';
    gCtx.rect(pos.x - 5, pos.y - 5, 10, 10);
    gCtx.stroke();
}

function checkLineClicked(clickPosition) {
    var foundLineInd = gMeme.lines.findIndex(line => {
        var start = getOutlinePosStart(line);
        var size = getOutlineSize();
        var t = checkPositionInBounderies(clickPosition, start, size);
        return t;
    });
    if (foundLineInd !== -1) {
        gMeme.selectedLineIdx = foundLineInd;
        updateControls(getSelectedLine());
        gCanvasFocus = true;
        gIsDragging = true;
    }
    else {
        gCanvasFocus = false;
    }
}

function updateControls(line){
    document.querySelector('#meme-line').value = line.txt;
    document.getElementById('stroke-color-input').value = line.outline;
    document.getElementById('fill-color-input').value = line.color;
    setIconColor('.letter-s', line.outline);
    setIconColor('.fa-palette', line.color);
    setIconColor('.fa-paint-brush', line.color);
    var ind = Array.from(document.querySelector('.fonts-select').options).findIndex(option=>{
        return option.value === line.font;
    });
    document.querySelector('.fonts-select').options[ind].selected = true;
}

function onCanvasMouseUp(event) {
    gIsDragging = false;
    gCurrentSticker = null;
    console.log('canvas mouse up');
    renderMeme();
}

function onMouseUp(event) {
    console.log('window mouse up');
    onCanvasMove(event);
}

function onCanvasMove(event) {
    if (!gIsDragging) return;
    var pos = getCursorPosition(event);

    if (gMeme.selectedLineIdx > -1) {
        var line = getSelectedLine();
        //var start = getOutlinePosStart(line);
        if (pos.y < gCanvas.height && pos.y >= 0) {
            line.y = pos.y;
            renderMeme();
        }
    }
    if (gMeme.selectedStickerIdx > -1) {
        var sticker = gMeme.stickers[gMeme.selectedStickerIdx];
        if (pos.x >= 0 && pos.x + sticker.size < gCanvas.width && pos.y >= 0 && pos.y + sticker.size < gCanvas.height) {
            sticker.x = pos.x;
            sticker.y = pos.y;
            renderMeme();
        }
    }
}

function getLineX(line) {
    if (!line.x) {
        line.x = LINE_X;
    }
    return line.x;
}

function getLineY(line, ind) {
    if (!line.y) {
        if (ind < gLineYInitPositions.length) {
            line.y = gLineYInitPositions[ind];
        }
        else {
            line.y = 40;
        }
    }
    else {
        if (line.y < EDITOR_PADDING + getTextHeight()) {
            line.y = EDITOR_PADDING + getTextHeight();
        }
        else if (line.y > gCanvas.height - EDITOR_PADDING) {
            line.y = gCanvas.height - EDITOR_PADDING;
        }
    }

    return line.y;
}

function onLineInput(event) {
    if (gMeme.selectedLineIdx < 0) createLine();
    getSelectedLine().txt = event.target.value;
    gCanvasFocus = true;
    renderMeme();
}

function onMoveLine(val) {
    gCanvasFocus = true;
    var line = getSelectedLine();
    line.y += val;
    renderMeme();
}

function getTextHeight() {
    //You can get a very close approximation of the vertical height by checking the length of a capital M
    //gCtx.font = font;
    return gCtx.measureText('W').width + (gCtx.measureText('W').width - gCtx.measureText('M').width);
}

function getTextWidth() {
    var txt = getSelectedLine().txt;
    var w = gCtx.measureText(txt).width;
    return w;
}

function resetLineField() {
    document.querySelector('#meme-line').value = '';
    document.querySelector('#meme-line').focus();
}

function onAddLine() {
    gMeme.selectedLineIdx = -1;
    resetLineField();
}

function onLineDelete() {
    deleteSelectedLine();
    onAddLine();
    renderMeme();
}

function onFontSelect(elSelect) {
    gCanvasFocus = true;
    getSelectedLine().font = elSelect.options[elSelect.selectedIndex].value;
    renderMeme();
}

function onFontChange(val) {
    gCanvasFocus = true;
    getSelectedLine().size += val;
    renderMeme();
}

function onAlignLine(align) {
    gCanvasFocus = true;
    var line = getSelectedLine();
    switch (align) {
        case 'left':
            line.x = EDITOR_PADDING;
            break;
        case 'center':
            line.x = gCanvas.width / 2 - getTextWidth() / 2;
            break;
        case 'right':
            line.x = gCanvas.width - getTextWidth() - EDITOR_PADDING;
            break;
    }
    renderMeme();
}

function onStrokeClicked() {
    document.querySelector('#stroke-color-input').click();
}

function onStrokeColorChange(event) {
    var stroke = event.target.value;
    setIconColor('.letter-s', stroke);
    if (getSelectedLine()) getSelectedLine().outline = stroke;
    renderMeme();
}

function onFillClicked() {
    document.querySelector('#fill-color-input').click();
}

function onFillColorChange(event) {
    var fillColor = event.target.value;
    setIconColor('.fa-palette', fillColor);
    setIconColor('.fa-paint-brush', fillColor);
    if (getSelectedLine()) getSelectedLine().color = fillColor;
    renderMeme();
}

function setIconColor(icon, color){
    if (color === 'white' || color === '#ffffff' || color === 'rgb(255, 255, 255)') color = 'black';
    document.querySelector(icon).style.color = color;
}

function onDownloadMeme(elLink) {
    gCanvasFocus = false;
    renderMeme();
    elLink.href = gCanvas.toDataURL('image/gif');
}

function onShareClicked() {
    document.querySelector('.share-container .dropdown-menu').classList.toggle('show');
}

window.onclick = function (event) {
    if (!(event.target.matches('.share-btn') || event.target.matches('.upload-link'))) {
        var dropdown = document.querySelector(".share-container .dropdown-menu");
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

function onSaveMeme() {
    saveMeme();
}