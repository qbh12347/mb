class TLabelControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"45";
		this.height = posion.height||"26";
		this.pan = posion.pan||"label";
		this.text = posion.text||"label";
		this.imgName = posion.imgName||null;
	}
	init() {
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
		_self.id = _self.id || "#TLabel_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TLabel_' + win.num + ' data-name="TLabel" id="' + divId + '" class="tlabel"><i></i><label></label></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TLabel" class="tlabel"><i></i><label></label></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setImgName(_self.imgName);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.imgName = "imgName";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.mouseup = "mouseup";
		plcparam.eventList.mouseover = "mouseover";
		plcparam.eventList.mouseout = "mouseout";
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
	setImgName(val) {
		let _self = this;
		if(_self.pan) {
			$(_self.id).find("i").removeClass().addClass(_self.imgName);
		}
	}

	getImgName() {
		let _self = this;
		return $(_self.id).find("i").className;
	}
	setData() {
		let _self = this;
	}

}