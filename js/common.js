'use strict';
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getDateString(){
    return new Date().toJSON().replace(/-/gi,'');
  }