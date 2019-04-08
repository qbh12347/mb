class TButtonControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width || "55";
		this.height = posion.height || "35";
		this.pan = posion.pan || "button";
		this.text = posion.text || "button";
		this.buttonClass = posion.buttonClass || "btn btn-default tbutton";
		this.posType = posion.posType || "absolute";
//		this.toolBar = posion.toolBar || null;
//		this.pressImgUrl = posion.pressImgUrl || null;
//		this.releaseImgUrl = posion.releaseImgUrl || null;
//		this.pressBgColor = posion.pressBgColor || null;
//		this.bgPosition = posion.bgPosition || null;
		
		this.bgImgUrl = posion.bgImgUrl|| null;
		this.bgSize = posion.bgSize|| "cover";
		this.bgRepeat = posion.bgRepeat|| "no-repeat";
		
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
		_self.id = _self.id || "#TButton_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div  name=TButton_' + win.num + ' data-name="TButton" id="' + divId + '"><button></button></div>');
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
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TButton"><button></button></div>'
		_self.x = _self.getX();
		_self.y = _self.getY();
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
		//新增初始化文本内容，因为有i18n语言切换。
		
	}
	updataView() {
		let _self = this;
		_self.plcUpView();
//		_self.setToolBar(_self.toolBar);
//		_self.setPressImgUrl(_self.pressImgUrl);
//		_self.setReleaseImgUrl(_self.releaseImgUrl);
//		_self.setPressBgColor(_self.pressBgColor);
//		_self.setBgPosition(_self.bgPosition);
		_self.setButtonClass(_self.buttonClass);
		_self.setBgImgUrl(_self.bgImgUrl);
		_self.setBgSize(_self.bgSize);
		_self.setBgRepeat(_self.bgRepeat);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
//		plcparam.properties.toolBar = "toolBar";
//		plcparam.properties.pressImgUrl = "pressImgUrl";
//		plcparam.properties.releaseImgUrl = "releaseImgUrl";
//		plcparam.properties.pressBgColor = "pressBgColor";
//		plcparam.properties.bgPosition = "bgPosition";
		plcparam.properties.buttonClass = "buttonClass";
		plcparam.properties.bgImgUrl = "bgImgUrl";
		plcparam.properties.bgSize = "bgSize";
		plcparam.properties.bgRepeat = "bgRepeat";
		
		
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
		win._self = _self;
//		win.name = _self.name;
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
//	setToolBar(val) {
//		let _self = this;
//		if(_self.pan) {
//			$(_self.id).find(_self.pan).css("toolBar", val);
//		} else {
//			$(_self.id).css("toolBar", val);
//		}
//	}
	setButtonClass(val){
		let _self = this;
		$(_self.id).find("button").addClass(_self.buttonClass);
	}
	getButtonClass(){
		let _self = this;
		return _self.buttonClass;
	}
	getToolBar() {
		let _self = this;
		return _self.toolBar
	}
	//customCode
	setToolBar(val) {
		let _self = this;
		if(!val) {
			return false;
		}
		let clibar = 0;
		$(_self.id).children().remove();
		val = val.split(";");
		//toolbar功能，用“；”分隔，其中格式为：name，classname，event。
		for(let i = 0; i < val.length; i++) {
			let tbr = val[i].split(",");
			if(tbr[0] || tbr[1]) {
				$(_self.id).append('<button style="width:auto" type="button" class="btn btn-default"><span></span></button>');
				if(tbr[0]) {
					$(_self.id).children().eq(clibar).find("span").text(tbr[0]);
				}
				if(tbr[1]) {
					$(_self.id).children().eq(clibar).find("span").addClass(tbr[1]);
				}
				if(tbr[2]) {
					$(_self.id).children().eq(clibar).on("click", function() {
						new Function(tbr[2])();
					});
				}
			}
			clibar++;

		}
	}

//	getToolBar() {
//		let _self = this;
//		return _self.toolBar;
//	}

//	setPressImgUrl(val) {
//		let _self = this;
//		if(_self.pan) {
//			$(_self.id).find(_self.pan).css("background", pressImgUrl);
//		} else {
//			$(_self.id).css("background", pressImgUrl);
//		}
//	}

//	getPressImgUrl() {
//		let _self = this;
//		return $(_self.id).css("background");
//	}

	setBgImgUrl(val){
		let _self = this;
			if(val != "" && val != undefined) {
			$(_self.id).find(_self.pan).css({
				"background-image": _self.bgImgUrl
			});
		}
	};
	setBgSize(val){
		let _self = this;
		$(_self.id).find(_self.pan).css({
				"background-size": _self.bgSize
			});
	};
	setBgRepeat(val){
		let _self = this;
		$(_self.id).find(_self.pan).css({
				"background-repeat": _self.bgRepeat
			});
	};

	getBgImgUrl(){
		let _self = this;
		return _self.bgImgUrl;
	}
	getBgSize(){
		let _self = this;
		return _self.bgSize;
	}
	getBgRepeat(){
		let _self = this;
		return _self.bgRepeat;
	}

	setCustom() {
		let _self = this;
	}

}