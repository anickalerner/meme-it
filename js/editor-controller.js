'use strict';
var gCanvas;
var gCtx;
var gLineYInitPositions;
var gCanvasFocus = false;
const FONTS = ['Impact', 'Arial', 'Comic Sans M', 'Helvetica', 'Times New Roman', 'Times',
'Courier New', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Trebuchet MS', 'Arial Black'];
const EDITOR_PADDING = 20;
const LINE_X = EDITOR_PADDING + 5;

function initEditor() {
    gCanvas = document.getElementById("editor");
    gCanvas.addEventListener('click', canvasClicked, false);
    gCtx = gCanvas.getContext("2d");
    gLineYInitPositions = [EDITOR_PADDING * 2, gCanvas.height - EDITOR_PADDING, gCanvas.height / 2, gCanvas.height * 0.25, gCanvas.height * 0.75];
    initFontsSelect();
}

function onCanvasUnfocus(){

}
function initFontsSelect(){
    var elSelect = document.querySelector('.fonts-select');
    var options = FONTS.reduce((acc, font) => {
        return acc+= `<option style="font-family: ${font}">${font}</option>`;
    }, '');
    elSelect.innerHTML = options;
}

function renderMeme() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    var img = document.getElementById('img-' + gMeme.selectedImgId);
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    gMeme.lines.forEach((line, ind) => {
        var x = getLineX(line);
        var y = getLineY(line, ind);
        gCanvasFocus && drawLineOutline(line, ind);
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillStyle = line.color;
        gCtx.strokeStyle = line.outline;
        gCtx.lineWidth = 2;
        gCtx.fillText(line.txt, x, y);
        gCtx.strokeText(line.txt, x, y);
    });
}

function drawLineOutline(line, lineId){
    gCtx.beginPath();
    var textEndY = line.y - getTextHeight();
    var verticalPadding = 10;
    var start = {x: EDITOR_PADDING, y: line.y + verticalPadding+1};
    var end = {x: gCanvas.width - EDITOR_PADDING, y: textEndY - verticalPadding / 2};
    
    // console.log('text starts:', line.x, ' x ', line.y);
    // console.log('text ends:', textEndY);
    
    gCtx.moveTo(start.x, start.y);
    gCtx.lineTo(start.x, end.y);
    gCtx.lineTo(end.x, end.y);
    gCtx.lineTo(end.x, start.y);
    gCtx.lineTo(start.x, start.y);
    
    if(lineId === gMeme.selectedLineIdx){
        gCtx.strokeStyle =  gMeme.activeOutlineColor;
        gCtx.fillStyle = 'rgba(255, 255, 255, 50%)';
        gCtx.fill();
    }
    else{
        gCtx.strokeStyle = gMeme.outlineColor;
    }
    gCtx.stroke();
}
function getCursorPosition(event) {
    // const rect = gCanvas.getBoundingClientRect();
    // const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;    
    // return { x, y };
    return { x: event.offsetX, y: event.offsetY };
}
function canvasClicked(event) {
    gCanvasFocus = false;
    var clickPosition = getCursorPosition(event);
    //console.log('clickPosition: ' + clickPosition.x + ', ' + clickPosition.y);
    var foundLine = gMeme.lines.find(line => {
        var textEndX = line.x + gCtx.measureText(line.txt).width;
        var textEndY = line.y - getTextHeight();
        // console.log(clickPosition.x, '>', line.x, ',', clickPosition.y, '<', line.y, ',',
        //     clickPosition.x, '<', textEndX, ',', clickPosition.y, '>', textEndY);
        (clickPosition.x > line.x && clickPosition.y < line.y
            && clickPosition.x < textEndX && clickPosition.y > textEndY)
    });

    console.log(foundLine);
    renderMeme();
}

function getLineX(line) {
    if (!line.x) {
        line.x = LINE_X;
    }
    return line.x;
}

function getLineY(line, ind) {
    if (!line.y){
        if (ind < gLineYInitPositions.length) {
            line.y = gLineYInitPositions[ind];
        }
        else {
            line.y = 40;
        }
    }
    else{
        if (line.y < EDITOR_PADDING + getTextHeight()){
            line.y = EDITOR_PADDING + getTextHeight();
        }
        else if (line.y > gCanvas.height - EDITOR_PADDING){
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
    line.y+=val;
    renderMeme();
}

function onSwitchLines(){
    gCanvasFocus = true;
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx === gMeme.lines.length -1) ? 0 : gMeme.selectedLineIdx+1;
    document.querySelector('#meme-line').value = getSelectedLine().txt;
    renderMeme();
}

function getTextHeight() {
    //You can get a very close approximation of the vertical height by checking the length of a capital M
    //gCtx.font = font;
    return gCtx.measureText('W').width + (gCtx.measureText('W').width - gCtx.measureText('M').width);
}

function getTextWidth(){
    var txt = getSelectedLine().txt;
    var w = gCtx.measureText(txt).width;
    return w;
}

function onAddLine(){
    gMeme.selectedLineIdx = -1;
    document.querySelector('#meme-line').value = '';
    document.querySelector('#meme-line').focus();
}

function onLineDelete(){
    deleteSelectedLine();
    onAddLine();
    renderMeme();
}

function onFontSelect(elSelect){
    gCanvasFocus = true;
    getSelectedLine().font = elSelect.options[elSelect.selectedIndex].value;
    renderMeme();
}

function onFontChange(val){
    gCanvasFocus = true;
    getSelectedLine().size+=val;
    renderMeme();
}

function onAlignLine(align){
    gCanvasFocus = true;
    var line = getSelectedLine();
    switch (align){
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

function onStrokeClicked(){
    document.querySelector('#stroke-color-input').click();
}

function onStrokeColorChange(event){
    var strokeColor = event.target.value;
    document.querySelector('.letter-s').style.color = strokeColor;
    if (getSelectedLine()) getSelectedLine().outline = strokeColor;
    renderMeme();
}

function onFillClicked(){
    document.querySelector('#fill-color-input').click();
}

function onFillColorChange(event){
    var fillColor = event.target.value;
    document.querySelector('.fa-palette').style.color = fillColor;
    document.querySelector('.fa-paint-brush').style.color = fillColor;
    if (getSelectedLine()) getSelectedLine().color = fillColor;
    renderMeme();
}

function downloadMeme(elLink) {
    gCanvasFocus = false;
    renderMeme();
    elLink.href = gCanvas.toDataURL('image/jpeg');
}
