class TPanelControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"300";
		this.height = posion.height||"300";
		this.bgImgUrl=posion.bgImgUrl||null;
		this.bgRepeat=posion.bgRepeat||"no-repeat";
		this.bgSize=posion.bgSize||"cover";
		this.bgPosition=posion.bgPosition||null;
		this.overflow = posion.overflow||null;
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
//		this.bingMouseEvent();
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
//		this.bingMouseEvent();
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TPanel_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TPanel_' + win.num + ' data-name="TPanel" id="' + divId + '" class="tpanel"></div>')
//		$(_self.id).addClass("la-drag");
		$(_self.id).css({
			"position": _self.posType,
			"width": _self.width,
			"height": _self.height,
			"left": _self.left,
			"top": _self.top
		});
//		$(win.rootDom).find("div").removeClass("cked");
//		$(_self.id).addClass("cked");
	}
	objJson() {
		let _self = this;
		_self.id = _self.id;
		_self.name = $(_self.id).attr("name");
//		win.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.x = _self.getX();
		_self.y=_self.getY(); 
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TPanel" class="tpanel"></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setBgImgUrl(_self.bgImgUrl);
		_self.setBgRepeat(_self.bgRepeat);
		_self.setBgSize(_self.bgSize);
		_self.setBgPosition(_self.bgPosition);
		_self.setOverflow(_self.overflow);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.bgImgUrl = "bgImgUrl";
		plcparam.properties.bgRepeat = "bgRepeat";
		plcparam.properties.bgSize = "bgSize";
		plcparam.properties.bgPosition = "bgPosition";
		plcparam.properties.overflow = "overflow";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";

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
					mode.session(_self.name, _self.posion);
					if(name == "checked" || name == "visible") {
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
	setBgImgUrl(val) {
		let _self = this; 
		if(val != "" && val != undefined) {
			if(val.indexOf("}") != -1){
				if(rglo.temData){
					let dy = val.match(/{(\S*)}/)[1];
					let urlimg = "url("+win.baseUrl+"img/" + rglo.temData[dy] + ".png)";
					$("div[name='"+rglo.temData.pname+"'] div[name='"+_self.name+"']").css({
						"background-image": urlimg
					});
				}
				
			}else{
				$(_self.id).css({
					"background-image": _self.bgImgUrl
				});
			}
			
		}
		
	}

	setBgRepeat(val) {
		let _self = this;
		$(_self.id).css("background-repeat", val);
	}
	setOverflow(val){
		let _self = this;
		if(val){
			val = val.split(",");
			if(val.length>1){
				if(val[0]=="y"){
					$(_self.id).css("overflow-y", val[1]);
				}else if(val[0]=="x"){
					$(_self.id).css("overflow-x", val[1]);
				}	
			}else{
				$(_self.id).css("overflow", val[0]);
			}
		}
		
	}
	setBgSize(val) {
		let _self = this;
		$(_self.id).css("background-size", val);
	}

	setBgPosition(val) {
		let _self = this;
		$(_self.id).css("background-position", val);
	}

	getBgImgUrl() {
		let _self = this;
		return $(_self.id).css("background-image");

	}

	getBgRepeat(val) {
		let _self = this;
		return $(_self.id).css("background-repeat");
	}

	getBgSize(val) {
		let _self = this;
		return $(_self.id).css("background-size");
	}

	getBgPosition(val) {
		let _self = this;
		return $(_self.id).css("background-position");
	}
	getOverflow(){
		let _self = this;
		return _self.overflow;
	}
	setCustom() {
		let _self = this;
	}

}