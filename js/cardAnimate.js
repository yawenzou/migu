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
	var cardStr = window.localStorage.getItem("cardStr") ? window.localStorage.getItem("cardStr") : '';
	let cardArr;
	if(cardStr) {
		cardArr = String(cardStr).split(",");
	}
	else {
		cardArr = [];
	}
	if(cardArr.length < 5) {
		cardArr.push(cardNum);
		cardStr = cardArr.join(",");
		window.localStorage.setItem("cardNum", 0);
		window.localStorage.setItem("cardStr", cardStr);

		var listText = '<img src="./img/card'+cardNum+'.png" alt="精灵卡片" class="card-img show-card" />';
		$(".right-card").append(listText);

		closeMedia();
		$("#qrVideo").hide();
		$("#sao").show();
		$("#saoBtn").show();
		$("#scanningLine").css({opacity:0});
		clearInterval(timer3);

		if(cardArr.length === 5) {
			 $("#successPop").show();
		}
		else {
			$("#way").show();
		}
	}
	else {
		 $("#successPop").show();
	}
}