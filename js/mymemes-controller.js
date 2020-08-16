'use strict';

const PREVIEW_PADDING = 3;

function renderSavedMemes() {
    document.querySelector('.mymemes-container .gallery').innerHTML = '';
    var memes = getStoredMemes();
    if (!memes || memes.length === 0) return;

    memes.forEach(memeId => {
        var elCanvas = document.createElement('canvas');
        elCanvas.setAttribute('id', memeId);
        var meme = loadFromStorage(getMemeSaveName(memeId));
        elCanvas.width = 200;
        elCanvas.height = 200 * meme.size.height / meme.size.width;
        document.querySelector('.mymemes-container .gallery').append(elCanvas);
        renderMemePreview(elCanvas, meme);
        elCanvas.addEventListener('click', function(){
            gMeme = meme;
            updateView('editor');
            updateCanvasSize(meme.size);
            renderMeme();        
        });
    });
    showNavBtn('.mymemes-btn');
}

function renderMemePreview(canvas, meme) {
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.onload = function () {
        canvas.height = canvas.width * this.height / this.width;
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
        meme.lines.forEach((line, ind) => {
            var x = line.x;
            var y = line.y;              
            context.font = `${line.size / 2}px ${line.font}`;
            context.fillStyle = line.color;
            context.strokeStyle = line.outline;
            context.lineWidth = 2;
            context.fillText(line.txt, x, y);
            context.strokeText(line.txt, x, y);
        });
        // meme.stickers && meme.stickers.forEach((sticker, id) => {
        //     //Sticker's x and y are its top left corner
        //     var img = new Image();
        //     img.onload = function(){
        //         var stickerX = 
        //         gCtx.drawImage(img, sticker.x * canvas.width / 500, sticker.y * canvas.height / 500, sticker.size * canvas.width / 500, sticker.size * canvas.width / 500);
        //     }
        //     img.src = sticker.img;
        //     if (gCanvasFocus && meme.selectedStickerIdx === id) drawStickerOutline(sticker);
        // });
    }
    img.src = getImageUrl(meme.selectedImgId);
}
