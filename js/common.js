'use strict';
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDateString() {
  return new Date().toJSON().replace(/-/gi, '');
}

function checkPositionInBounderies(pos, start, size){
  var t = (pos.x > start.x && pos.x < (pos.x + size.width) && pos.y > start.y && pos.y < (start.y + size.height));
  return t;
}