var wayAll = {
    1: [13, 1, 2, 3, 15],
    2: [13, 4, 5, 6, 15],
    3: [13, 7, 8, 9, 15],
    4: [13, 10, 11, 12, 15]
};
$(function() {

   // $(".way").hide();
    //startDraw3d();
    $("#model3d").hide();

    event();
    setWay();
    setDOmSize();
    showCard();

    loadAnimate();
	
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
    var currentWay = window.localStorage.getItem("currentWay") ? window.localStorage.getItem("currentWay") : wayAll[index].join(","); 
    var wayIndex = window.localStorage.getItem("wayIndex") ? window.localStorage.getItem("wayIndex") : index; 
    //alert("11111");
    console.log("wayIndex:" +wayIndex)
    window.localStorage.setItem("currentWay", currentWay);
    window.localStorage.setItem("wayIndex", wayIndex);
    $("#wayImg").attr("src", "./img/way"+wayIndex + ".jpg");
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

function distinguishImg(event) {
//function distinguishImg(imgData) {
    let fileValue = event.target.files[0];
    var formData = new FormData();
    formData.append("file", fileValue);
    $.ajax({
        url: 'http://47.98.157.16/api/recognition',
        type: 'POST',
        data: formData,
        dataType:"text",  
        processData : false,   
        contentType : false,  
        success:function(data) {
            var rs = JSON.parse(data);
            if(rs.code === 200) {
                var cardStr = window.localStorage.getItem("cardStr") ? parseInt(window.localStorage.getItem("cardStr")) : '';
                var currentWay = window.localStorage.getItem("currentWay") ? window.localStorage.getItem("currentWay") : wayAll[1].join(",");
                var currentWayArr = currentWay.split(",");
                var id = rs.content.split("pic")[1];
                let index = currentWayArr.indexOf(id)+1;
                //let index = 3;
                console.log("id:" + id);
                console.log("currentWay:" + currentWay);
                console.log("index:" + index);
                if(index >0) {
                    if(!cardStr || String(cardStr).indexOf(index) <0) {
                        $("#sao").hide();
                        clearInterval(timer1);
                        $("#model3d").show();
                        window.localStorage.setItem("cardNum", index);
                        startDraw3d(index);

                    }
                    else {
                        alert("该类型精灵已经收集过哦，您可以去其他展位手机精灵");
                        saoReset();
                    }
                }
                else {
                    alert("这不是你的展位，你走的路线不对哦！");
                    saoReset();
                }
            }
            else {
                curNum = 0;
            }
        },
        error: function(err) {
            curNum = 0;
            console.log(err);
        }      
    })
}


function saoReset() {
    closeMedia();
    clearInterval(timer1);
    clearInterval(timer3);
    $("#qrVideo").hide();
    $("#sao").show();
    $("#saoBtn").show();
    $("#scanningLine").css({opacity:0});
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
        $("#timer").attr("src", "./img/2.png?v=2");
    }, 1000)
    setTimeout(function() {
        $("#timer").attr("src", "./img/1.png?v=2");
    }, 2000)
    setTimeout(function() {
        $("#timer").hide();
    }, 3000)
}
