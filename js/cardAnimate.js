function cardAnimate() {
	var imgText = '<img src="./img/card1.png" class="move-card"  />';
	$("body").append(imgText);
	$("#model3d").hide();
	$("#model3d div").remove();
	setTimeout(function() {
		$(".move-card").remove();
		addCard();
	}, 5000)
}

function addCard() {
	var cardNum = window.localStorage.getItem("cardNum") ? parseInt(window.localStorage.getItem("cardNum")) : 0;
	if(cardNum < 5) {
		cardNum++;
		window.localStorage.setItem("cardNum", cardNum);

		var listText = '<img src="./img/card'+cardNum+'.png" alt="精灵卡片" class="card-img show-card" />';
		$(".right-card").append(listText);

		closeMedia();
		$("#qrCanvas").hide();
		$("#sao").show();
		$("#saoBtn").show();
		$("#scanningLine").css({opacity:0});
		$("#way").show();
    	$("#openBtn").show();
		clearInterval(timer3);

		if(cardNum === 5) {
			alert("您的卡片收集齐拉！, 去领奖吧")
		}
	}
	else {
		alert('您的卡片收集齐拉！');
	}
}