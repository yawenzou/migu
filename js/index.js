$(function() {
    //startDraw3d();
    setDOmSize();
    showCard();

    $("#qrVideo").hide();
    $("#model3d").hide();
    $("#way").hide();
    $("#openBtn").hide();

    $("#scanningLine").css({opacity:0});
    $("#saoBtn").click(function() {
        startScanning();
    });

    $("#wayClose").click(function() {
        $("#way").hide();
    })
    $("#openBtn").click(function() {
        $("#way").show();
    })
    	
});

function setDOmSize() {
    $("#qrCanvas").height(window.innerHeight-300);
    $("#qrVideo").height(window.innerHeight-300);
}

function startScanning() {
    var cardNum = window.localStorage.getItem("cardNum") ? window.localStorage.getItem("cardNum") : 0;
    if(cardNum < 5) {
        openMedia();
    }
    else {
        window.location.href = "success.html";
    }
}

function successStartScanning() {
    $("#saoBtn").hide();
    $("#qrVideo").show();
    $("#scanningLine").css({opacity:1});
    animateScanning();
}

var timer1;
function animateScanning() {
    $("#scanningLine").animate({opacity:1, top: "96%"},600)
    timer1 = setInterval(function() {
        $("#scanningLine").animate({top: "4px"},800,function() {
            $("#scanningLine").animate({top: "96%"},800);            
        })
    }, 700)
}

function distinguishImg(imgData) {
    var formData = new FormData();
    formData.append("file", imgData);
    $.ajax({
        url: 'http://47.98.157.16/api/recognition',
        type: 'POST',
        data: formData,
        dataType:"text",  
        processData : false,   
        contentType : false,  
        success:function(data) {
            var rs = JSON.parse(data);
            //if(rs.code === 200) {
                $("#sao").hide();
                clearInterval(timer1);
                startDraw3d();
                $("#model3d").show();
            //}
            //else {
            //    curNum = 0;
            //}
        },
        error: function(err) {
            curNum = 0;
            console.log(err);
        }      
    })
}

function showCard() {
    var cardNum = window.localStorage.getItem("cardNum") ? window.localStorage.getItem("cardNum") : 0;

    var listText = '';
    for (var i = 0; i < cardNum; i++) {
        j = i+1;
        listText += '<img src="./img/card'+j+'.png" alt="精灵卡片" class="card-img show-card" />';
    }
    $(".right-card").html(listText);
    if(cardNum === 5) {
        window.location.href = "success.html";
    }
}
