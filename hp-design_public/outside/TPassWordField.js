class TPassWordFieldControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"180";
		this.height = posion.height||"32";
		this.pan = posion.pan||"input";
		this.format = posion.format||"Y/m/d";
		this.disabled = posion.disabled||null;
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
		_self.id = _self.id || "#TPassWordField_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TPassWordField_' + win.num + ' data-name="TPassWordField" id="' + divId + '"><input style="width:100%;height:100%" type="password" class="tpasswordfield"></div>')
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
		_self.x = _self.getX();
		_self.y=_self.getY(); 
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
//		_self.pan = _self.rolecss;
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TPassWordField"><input style="width:100%;height:100%" type="password" class="tpasswordfield"></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setDisabled(_self.disabled);
		_self.setFormat(_self.format);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.disabled = "disabled";
		plcparam.properties.format = "format";
		plcparam.eventList.click = "click";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.mouseup = "mouseup";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";
		plcparam.eventList.focus = "focus";

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
	setDisabled(val) {
		let _self = this;
		let tf;
		let type;
		let tbcol;
		if(val == undefined) {
			return false
		}
		if(val.indexOf(";") == -1) {
			tf = val;
		} else {
			let nvl = val.split(";");
			tf = nvl[0];
			type = nvl[1];
			tbcol = nvl[2];

		}
		let pop;
		if(tf == "true") {
			pop = true;
		} else {
			pop = false;
		}
		$(_self.id).find("input").prop("readonly", pop);
	}

	getDisabled() {
		let _self = this;
	
		return _self.disabled;
	}

	setFormat() {
		let _self = this;
	}

	getFormat() {
		let _self = this;
	
		return _self.format;
	}
	setCustom() {
		let _self = this;
	}

}