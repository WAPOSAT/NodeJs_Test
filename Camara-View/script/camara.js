navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia
URL = window.URL || window.mozURL || window.webkitURL

var App = {};

App.camara = function (){
    var canvas = window.preview;
    var video = window.stream;
    var btn =  window.tomarFoto;
    
    navigator.getUserMedia({video: 1}, function (stream){
        video.src = URL.createObjectURL(stream);
        btn.addEventListener('click', function(){
            canvas.getContext('2d').drawImage(video, 0, 0, 300, 230)
        })
    })
}

App.camara();