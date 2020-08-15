'use strict';

// on submit call to this function
function onUploadMeme(event) {
    event.preventDefault();
    document.getElementById('canvasData').value = gCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {        
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.upload-link').remove();
        var shareLink = document.createElement('a');
        shareLink.classList.add('dropdown-item', 'share-facebook');
        shareLink.href = `https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`;
        shareLink.title = 'Share on Facebook';
        shareLink.target = '_blank';
        shareLink.onclick = `window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;`;
        shareLink.innerHTML = '<i class="fab fa-facebook-square"></i>Share on Facebook';
        document.querySelector('.dropdown-menu').append(shareLink);
    }

    doUploadCanvas(document.querySelector('form'), onSuccess);
}

function doUploadCanvas(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (res) {
        return res.text()
    })
    .then(onSuccess)
    .catch(function (err) {
        console.error(err)
    })
}


