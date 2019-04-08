class TPopoverControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"100%";
		this.height = posion.height||"100%";
		this.posType = posion.posType||"relative";
		this.title = posion.title||false;
		this.area = posion.area||"500px,500px";
		this.offset = posion.offset||"auto";
		this.closeBtn = posion.closeBtn||"1";
		this.shade = posion.shade||"0.3";
		this.anim = posion.anim||"0";
		this.maxmin = posion.maxmin||"false";
		this.fixed = posion.fixed||"true";
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
		_self.id = _self.id || "#TPopover_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div id="' + divId + '" name=TPopover_' + win.num + ' data-name="TPopover" class="tpopover"></div>')
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
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TPopover" class="tpopover"></div>'
//		_self.title = false;
//		_self.area = "500px,500px";
//		_self.offset = "auto";
//		_self.closeBtn = "1";
//		_self.shade = "0.3";
//		_self.anim = "0";
//		_self.maxmin = "false";
//		_self.fixed = "true";
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setTitle(_self.title);
		_self.setSkin(_self.skin);
		_self.setArea(_self.area);
		_self.setOffset(_self.offset);
		_self.setCloseBtn(_self.closeBtn);
		_self.setShade(_self.shade);
		_self.setAnim(_self.anim);
		_self.setMaxmin(_self.maxmin);
		_self.setFixed(_self.fixed);
		_self.setMaxWidth(_self.maxWidth);
		_self.setMaxHeight(_self.maxHeight);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.title = "title";
		plcparam.properties.skin = "skin";
		plcparam.properties.area = "area";
		plcparam.properties.offset = "offset";
		plcparam.properties.closeBtn = "closeBtn";
		plcparam.properties.shade = "shade";
		plcparam.properties.anim = "anim";
		plcparam.properties.maxmin = "maxmin";
		plcparam.properties.fixed = "fixed";
		plcparam.properties.maxWidth = "maxWidth";
		plcparam.properties.maxHeight = "maxHeight";

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
	setTitle(val) {
		let _self = this;
		_self.title = val;
//		mode.session(_self.name, _self.posion);
	}

	getTitle() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.title;
	}

	setSkin(val) {
		let _self = this;
		_self.skin = val;
//		mode.session(_self.name, _self.posion);
	}

	getSkin() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.skin;
	}

	setArea(val) {
		let _self = this;
		_self.area = val;
//		mode.session(_self.name, _self.posion);
	}

	getArea() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.area;
	}

	setOffset(val) {
		let _self = this;
		_self.offset = val;
//		mode.session(_self.name, _self.posion);
	}

	getOffset() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.offset;
	}

	setCloseBtn(val) {
		let _self = this;
		_self.closeBtn = val;
//		mode.session(_self.name, _self.posion);
	}

	getCloseBtn() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.closeBtn;
	}

	setShade(val) {
		let _self = this;
		_self.shade = val;
//		mode.session(_self.name, _self.posion);
	}

	getShade() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.shade;
	}

	setAnim(val) {
		let _self = this;
		_self.anim = val;
//		mode.session(_self.name, _self.posion);
	}

	getAnim() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.anim;
	}

	setMaxmin(val) {
		let _self = this;
		_self.maxmin = val;
//		mode.session(_self.name, _self.posion);
	}

	getMaxmin() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.maxmin;
	}

	setFixed(val) {
		let _self = this;
		_self.fixed = val;
//		mode.session(_self.name, _self.posion);
	}

	getFixed() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.fixed;
	}

	setMaxWidth(val) {
		let _self = this;
		_self.maxWidth = val;
//		mode.session(_self.name, _self.posion);
	}

	getMaxWidth() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.maxWidth;
	}

	setMaxHeight(val) {
		let _self = this;
		_self.maxHeight = val;
//		mode.session(_self.name, _self.posion);
	}

	getMaxHeight() {
		let _self = this;
//		let ppo = mode.session(_self.name);
		return _self.maxHeight;
	}
	setCustom() {
		let _self = this;
	}

}