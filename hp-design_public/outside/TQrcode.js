class TQrcodeControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width || "100%";
		this.height = posion.height || "100%";
		this.posType = posion.posType || "absolute";
	}
	init() {
		let _self = mode.comRelationship(this);
		this.view();
		this.objJson();
		this.updataView();
		this.updataViewRight();
		this.setCustom();
		this.drag();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();

		gol.addNode(this);
		this.pushAction();
	}
	render() {
		this.view();
		this.updataView();
		this.updataViewRight();
		this.drag();
		this.setCustom();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TQrcode_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TQrcode_' + win.num + ' data-name="TQrcode" class="wrap tqrcode" id="' + divId + '"><div class="scan reference"><div class="strainer"><span></span><span></span><span></span><span></span></div><video class="capture" src=""></video></div><canvas id="' + divId + '0" width="200" height="150" style="display: none;"></canvas></div>')
		$(_self.id).css({
			"position": _self.posType,
			"width": _self.width,
			"height": _self.height,
			"left": _self.left,
			"top": _self.top
		});
	}
	objJson() {
		let _self = this;
		_self.id = _self.id;
		_self.name = $(_self.id).attr("name");
//		win.name = _self.name;
		win._self = _self;
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TQrcode" class="wrap tqrcode"><div class="scan reference"><div class="strainer"><span></span><span></span><span></span><span></span></div><video class="capture" src=""></video></div><canvas id="' + divId + '0" width="200" height="150" style="display: none;" ></canvas></div>'
		_self.x = _self.getX();
		_self.y = _self.getY();
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
	}
	updataView() {
		let _self = this;
		_self.plcUpView();

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.mouseup = "mouseup";

		_self.creatHtml(plcparam);
	}
	updataViewRight(pamName) {
		let _self = this;
		win.dom = _self.id;
//		win.name = _self.name;
		win._self = _self;
		if(!pamName) {
			_self.addHtm();
		}
		let inpt = $(".c-right .r-top tbody").find("input");
		for(let i = 0; i < inpt.length; i++) {
			let name = inpt.eq(i).attr("data-type");
			let fnc = name.replace(/\s[a-z]/g, function($1) {
				return $1.toLocaleUpperCase()
			}).replace(/^[a-z]/, function($1) {
				return $1.toLocaleUpperCase()
			});
			if(pamName) {
				if(name == pamName) {
					eval("_self." + name + "=_self.get" + fnc + "();");
					if(name == checked || name == "visible") {
						eval("inpt.eq(i).val(_self.get" + fnc + "());");
					} else {
						eval("inpt.eq(i).val(_self.get" + fnc + "());");
					}
					break;
				}
			} else {
				if(name == "checked" || name == "visible") {
					eval("inpt.eq(i).attr('checked',_self.get" + fnc + "());");
				} else {
					eval("inpt.eq(i).val(_self.get" + fnc + "());");
				}
			}
		}
	}
	setCustom() {
		let _self = this;
	}
	//customCode 

}

let myqr = {}
myqr.offect;
myqr.buffer;
//let c = 0;
myqr.type = true;
myqr.oCapture;
myqr.nId;
myqr.sName;

myqr.wd1 = 200;
myqr.he1 = 200;
myqr.wd2 = 200;
myqr.he2 = 200;
myqr.xf = 80;
myqr.yf = 100;
//myqr.hName;
function invokingCarera(sid,codeType) {
	myqr.codeType = codeType;
	window.navigator.getUserMedia = navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	myqr.sName = $("#runTime div[name='"+sid+"']");
	myqr.nId = "#"+myqr.sName.attr("id");
	myqr.offect = myqr.sName.find(".strainer").offset();  
	
	myqr.sName.append("<div id='myaa'></div>");
	$("#myaa").css({"position":"absolute","left":myqr.offect.left,"top":myqr.offect.top,"width":"200px","height":"200px"})
	myqr.oCapture = document.querySelector(""+myqr.nId+" .capture");
//	if(myqr.codeType=="barCode"){
//		myqr.sName.find("canvas").width("400");	
//		
//		myqr.wd1 = 400;
//		myqr.he1 = 100;
//		myqr.wd2 = 400;
//		myqr.he2 = 100;
//		myqr.xf = 50;
//		myqr.yf = 150;
//	}
//	myqr.sName.show();
//	myqr.hName.hide();
	if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices.getUserMedia({
				'audio': false,
//							'video': {
//								'facingMode': "user"
//							}
				//调用前置摄像头，后置摄像头使用
				video: {
					facingMode: {
						exact: "environment"
					}
				}
			})
			.then(function(mediaStream) {

				getVideoStream(mediaStream)
			})
			.catch(function(error) {

				console.log(error)
			})
	} else if(navigator.getUserMedia) {
		navigator.getUserMedia({
			'video': true,
			'audio': false
		}, getVideoStream, getFail)
	} else {
		alert('不支持摄像头调用！')
	}
}
//调用成功
function getVideoStream(stream) {
	myqr.type = false;
	myqr.buffer = stream;
	if(myqr.oCapture.mozSrcObject !== undefined) {
		myqr.oCapture.mozSrcObject = myqr.buffer;
	} else {
		myqr.oCapture.src = window.URL && window.URL.createObjectURL(myqr.buffer);
//		console.log("aa" + myqr.oCapture.src);
	}
	myqr.oCapture.play();
	myscreenShot();
}

function closeCamera(imgMsg) {
	myqr.buffer && myqr.buffer.getTracks()[0].stop(); //关闭摄像头
	closeBack(imgMsg);
//	myqr.sName.hide();
//	myqr.hName.show();
}
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

//解析二维码
function load(name) {
	//分为条形码和二维码两种
	if(myqr.codeType=="barCode"){
		Quagga.decodeSingle({
		    decoder: {
		        readers: ["code_128_reader"] // List of active readers
		    },
		    locate: true, // try to locate the barcode in the image
		    src: name
		}, function(result){
			
		    if(result) {
		    	console.log(result)
//							alert(result)
		        if(result.codeResult) {
//					        	alert(result.codeResult)
		            alert(result.codeResult.code);
		        }else{
		        	setTimeout("myscreenShot()", "100");
		        }
		    }else{
		            setTimeout("myscreenShot()", "100");
		    } 
		});
	}else{
		//识别二维码并回调方法
		qrcode.decode(name);
		qrcode.callback = function(imgMsg) {
			console.log("已进入解析")
			if(imgMsg != null & imgMsg != "error decoding QR Code") {
//				console.log(imgMsg);
//				alert(imgMsg);
				closeCamera(imgMsg);
			} else {
				setTimeout("myscreenShot()", "100");
			}
	
		}
	}


}

function myscreenShot() {
	if(!myqr.type) {
		let canvas = myqr.sName.find("canvas");		
		canvas[0].getContext('2d').drawImage(myqr.oCapture, parseInt(myqr.offect.left)+myqr.xf, parseInt(myqr.offect.top)+myqr.yf, myqr.wd1, myqr.he1,0,0,myqr.wd2,myqr.he2);
		let imgData = canvas[0].toDataURL("image/png");
//							console.log(imgData);
		load(imgData);
	}

}