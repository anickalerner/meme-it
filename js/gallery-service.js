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
            url: `${IMAGE_PATH}${i}.jpg`,
            keywords: [keyword]
        })
    }
    mapKeyWords();
}

function getRandomKeyWord() {
    return gKeywords[getRandomIntInclusive(0, gKeywords.length - 1)];
}

function mapKeyWords() {
    gKeywords.map(keyword => {
        if (gKeywordsMap[keyword]) {
            gKeywordsMap[keyword]++;
            return;
        }
        else {
            gKeywordsMap[keyword] = 1;
        }
    });
}

function getImageByElementId(id){
    return gImages[+id - 1];
}