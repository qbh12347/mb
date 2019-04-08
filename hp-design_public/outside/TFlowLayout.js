class TFlowLayoutControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"300";
		this.height = posion.height||"300";
		this.display = posion.display||"flex";
		this.flexDirection = posion.flexDirection||null;
		this.flexWrap = posion.flexWrap||null;
		this.justifyContent = posion.justifyContent||null;
		this.alignItems = posion.alignItems||null;
		this.alignContent = posion.alignContent||null;
		this.overflow = posion.overflow||null;
//		this.posion = posion;
//		this.id = id;
//		this.name = name;
//		this.pan = pan;
	}
	init() {
//		this.initPosition();
		let _self = mode.comRelationship(this);
		this.view();
		this.objJson();
		this.updataView();
		this.updataViewRight();
		this.setData();
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
		this.setData();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
//		this.bingMouseEvent();
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TFlowLayout_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div id="' + divId + '" name=TFlowLayout_' + win.num + ' data-name="TFlowLayout" class="tflowlayout" ></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TFlowLayout" class="tflowlayout"></div>'
		_self.display = "flex";
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.setDisplay(_self.display);
		_self.plcUpView();
		
		_self.setFlexDirection(_self.flexDirection);
		_self.setFlexWrap(_self.flexWrap);
		_self.setJustifyContent(_self.justifyContent);
		_self.setAlignItems(_self.alignItems);
		_self.setAlignContent(_self.alignContent);
		_self.setOverflow(_self.overflow);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.display = "display";
		plcparam.properties.flexDirection = "flexDirection";
		plcparam.properties.flexWrap = "flexWrap";
		plcparam.properties.justifyContent = "justifyContent";
		plcparam.properties.alignItems = "alignItems";
		plcparam.properties.alignContent = "alignContent";
		plcparam.properties.overflow = "overflow";		
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";

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
					mode.session(_self.name, _self.posion);
					if(name == "checked" || name == "visible") {
						eval("inpt.eq(i).attr('checked',_self.get" + fnc + "());");
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
	setFlexDirection(val) {
		let _self = this;
		$(_self.id).css("flex-direction", val);
	}

	setFlexWrap(val) {
		let _self = this;
		$(_self.id).css("flex-wrap", val);
	}

	setJustifyContent(val) {
		let _self = this;
		$(_self.id).css("justify-content", val);
	}

	setAlignItems(val) {
		let _self = this;
		$(_self.id).css("align-items", val);
	}

	setAlignContent(val) {
		let _self = this;
		$(_self.id).css("align-content", val);
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

	getFlexDirection() {
		let _self = this;
		return $(_self.id).css("flex-direction");
	}

	getFlexWrap() {
		let _self = this;
		return $(_self.id).css("flex-wrap");
	}

	getJustifyContent() {
		let _self = this;
		return $(_self.id).css("justify-content");
	}

	getAlignItems() {
		let _self = this;
		return $(_self.id).css("align-items");
	}

	getAlignContent() {
		let _self = this;
		return $(_self.id).css("align-content");
	}
	setDisplay(val) {
		let _self = this;
		if(_self.pan) {
			$(_self.id).find(_self.pan).css("display", val);
		} else {
			$(_self.id).css("display", val);
		}
	}
	getDisplay() {
		let _self = this;
		return $(_self.id).css("display");
	}
	
	getOverflow(){
		let _self = this;
		return _self.overflow;
	}
	setData(val) {
		let _self = this;
		if(val){
			$(_self.id).children().remove();
			if(val[0].type=="adc"){
				for (let i=0;i<val.length;i++) {
					let htm = '<p>'+val[i]+'</p>';
					$(_self.id).append(htm);
				}
			}else{
				for (let i=0;i<val.length;i++) {
					let htm = '<p>'+val[i]+'</p>';
					$(_self.id).append(htm);
				}
			}
			
		}
	}

}