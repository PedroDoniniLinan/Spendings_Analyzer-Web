var imgElem = document.querySelector('img');
var imageForm = document.getElementById('image');

if(!localStorage.getItem('image')) {
    populateStorage();
} else {
    setStyles();
}
  

function populateStorage() {
    localStorage.setItem('image', document.getElementById('image').value);
  
    setStyles();
}

function setStyles() {
    var currentImage = localStorage.getItem('image');
  
    document.getElementById('image').value = currentImage;
  
    imgElem.setAttribute('src', currentImage);
}

imageForm.onchange = populateStorage;