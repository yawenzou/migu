$(function() {

    //$(".way").hide();
    //startDraw3d();
    $("#model3d").hide();

    event();
    setDOmSize();
    showCard();
    setWay();

    
    	
});

function event() {
    let flag = true;
    $("#saoBtn").click(function() {
        startScanning();
    });

    $("#wayClose").click(function() {
        $("#way").hide();
    })

    $("#ruleClose").click(function() {
        $("#rule").hide();
        if(flag) {
            $("#way").show();
            flag = false;
        }
    })

    $("#openBtn").click(function() {
        $("#way").show();
    })

    $("#openRuleBtn").click(function() {
        $("#rule").show();
    })

    $("#successPop").click(function() {
        window.location.href = "success.html";
    })
}

function setWay() {
    var index = parseInt(Math.random()*4+1, 10);
    $("#wayImg").attr("src", "./img/way"+index + ".jpg");
}

function setDOmSize() {
    $("#qrCanvas").height(window.innerHeight-300);
    $("#qrVideo").height(window.innerHeight-300);
}

function startScanning() {
    var cardStr = window.localStorage.getItem("cardStr") ? window.localStorage.getItem("cardStr") : '';
    if(cardStr.split(",").length < 5) {
        openMedia();
    }
    else {
        $("#successPop").show();
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
                var cardStr = window.localStorage.getItem("cardStr") ? parseInt(window.localStorage.getItem("cardStr")) : '';
                //let index = parseInt(data.content.split("pic")[1],10);
                let index = 1;
                //if(!cardStr || String(cardStr).indexOf(index) <0) {
                    $("#sao").hide();
                    clearInterval(timer1);
                    $("#model3d").show();
                    window.localStorage.setItem("cardNum", index);
                    startDraw3d(index);

               // }
               // else {
                    /*alert("该类型精灵已经收集过哦，您可以去其他展位手机精灵");
                    closeMedia();
                    clearInterval(timer1);
                    clearInterval(timer3);
                    $("#qrVideo").hide();
                    $("#sao").show();
                    $("#saoBtn").show();
                    $("#scanningLine").css({opacity:0});*/
               // }
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
    var cardStr = window.localStorage.getItem("cardStr") ? window.localStorage.getItem("cardStr") : '';

    if(cardStr) {
        var listText = '';
        var cardArr = cardStr.split(',');
        for (var i = 0; i < cardArr.length; i++) {
            listText += '<img src="./img/card'+cardArr[i]+'.png" alt="精灵卡片" class="card-img show-card" />';
        }
        $(".right-card").html(listText);
        if(cardArr.length === 5) {
            $("#susccessPop").show();
        }
    }
}

function showTime() {
    $("#timer").show()
    setTimeout(function() {
        $("#timer").attr("src", "./img/2.png");
    }, 1000)
    setTimeout(function() {
        $("#timer").attr("src", "./img/1.png");
    }, 2000)
    setTimeout(function() {
        $("#timer").hide();
    }, 3000)
}
