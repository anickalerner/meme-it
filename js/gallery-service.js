'use strict';

var IMAGE_PATH = 'images/gallery-500/';
var gImages = [];
var gKeywords = ['happy', 'funny', 'cat', 'dog', 'baby'];
var gKeywordsMap = {};

function createImages() {
    for (let i = 1; i <= 18; i++) {
        var keyword = getRandomKeyWord();
        gImages.push({
            id: i,
            url: getImageUrl(i)
 //           keywords: [keyword]
        })
    }
    gImages[0].keywords = ['man', 'usa', 'trump'];
    gImages[1].keywords = ['dog', 'puppy', 'happy'];
    gImages[2].keywords = ['baby', 'puppy', 'dog', 'happy'];
    gImages[3].keywords = ['cat', 'happy'];
    gImages[4].keywords = ['baby', 'boy', 'funny'];
    gImages[5].keywords = ['man', 'funny'];
    gImages[6].keywords = ['baby', 'funny'];
    gImages[7].keywords = ['man', 'funny'];
    gImages[8].keywords = ['baby', 'boy', 'funny'];
    gImages[9].keywords = ['man', 'usa', 'obama'];
    gImages[10].keywords = ['man', 'boxing'];
    gImages[11].keywords = ['man', 'funny'];
    gImages[12].keywords = ['man', 'glam'];
    gImages[13].keywords = ['man', 'matrix'];
    gImages[14].keywords = ['man', 'lord of the rings'];
    gImages[15].keywords = ['man', 'funny'];
    gImages[16].keywords = ['man', 'russia', 'putin'];
    gImages[17].keywords = ['cartoon', 'funny'];
    mapKeyWords();
}

function getImageUrl(id){
    return `${IMAGE_PATH}${id}.jpg`;
}

function getRandomKeyWord() {
    return gKeywords[getRandomIntInclusive(0, gKeywords.length - 1)];
}

function mapKeyWords() {
    gImages.map(image => {
        image.keywords.map(keyword => {
            if (gKeywordsMap[keyword]) {
                gKeywordsMap[keyword]++;
                return;
            }
            else {
                gKeywordsMap[keyword] = 1;
            }    
        })
    });
    orderMap();
}

function getImageByElementId(id){
    return gImages[+id - 1];
}

function orderMap(){
    var orderedMap = [];
    for (const key in gKeywordsMap) {
        orderedMap.push([key, gKeywordsMap[key]]);
    }
    orderedMap.sort(function(a, b) {
        return b[1] - a[1];
    });
    renderKeywordsMap(orderedMap);
}