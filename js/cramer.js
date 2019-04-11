var canvas1 = document.getElementById('qrCanvas');
var context1 = canvas1.getContext('2d');
var mediaStreamTrack;

// 一堆兼容代码
window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL);
if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
        var getUserMedia = navigator.webkitGetUserMedia || 
                           navigator.mozGetUserMedia || 
                           navigator.msGetUserMedia;
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}    

// 回调
function successFunc(stream) {
    mediaStreamTrack = stream;
    video = document.getElementById('qrVideo');
    if ("srcObject" in video) {
        video.srcObject = stream
    } else {
        video.src = window.URL && window.URL.createObjectURL(stream) || stream
    }
    video.onloadedmetadata = function(e) {
	    video.play();
	    drawMedia();
        successStartScanning();
	};
}
function errorFunc(err) {
    alert(err.name);
}

// 正式启动摄像头
function openMedia(){
	//摄像头调用配置
	var mediaOpts = {
	    audio: false,
	    video: true,
	    video: { facingMode: "environment"} 
	    // video: { width: 1280, height: 720 }
	    // video: { facingMode: { exact: "environment" } }// 或者 "user"
	}

    navigator.mediaDevices.getUserMedia(mediaOpts).then(successFunc).catch(errorFunc);
}

//关闭摄像头
function closeMedia(){
    mediaStreamTrack.getVideoTracks().forEach(function (track) {
        track.stop();
        curNum = 0;
        context1.clearRect(0, 0,context1.width, context1.height);//清除画布
    });
}

//截取视频
var upNum = 1;
var curNum = 0;
var timer3;
function drawMedia(){
    canvas1.setAttribute("width", video.videoWidth);
    canvas1.setAttribute("height", video.videoHeight);
    
    //timer3 = setInterval(function(){
	timer3 = setInterval(function(){
        context1.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        curNum++;
        if(curNum === upNum) {
            //alert(curNum)
            let imgData = canvas1.toDataURL('image/png');
            //console.log(imgData)
            /*if(isIos) {
                $("#qrCanvas").attr("src", imgData);
            }*/
            let file = dataURItoBlob(imgData);
            imgData = imgData.replace("data:image/png;base64,", "")
            distinguishImg(imgData)
        }
    }, 40);
}

function dataURItoBlob(base64Data) {
    var byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1]);
    else
    byteString = unescape(base64Data.split(',')[1]);
    var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}


