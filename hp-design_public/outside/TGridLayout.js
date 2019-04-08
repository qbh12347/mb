class TGridLayoutControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"500";
		this.height = posion.height||"500";
		this.lg = posion.lg||"4,4,4";
		this.md = posion.md||"4,4,4";
		this.sm = posion.sm|| "4,4,4";
		this.xs = posion.xs||"4,4,4";
//		this.posion = posion;
//		this.id = id;
//		this.name = name;
//		this.pan = pan;
	}
	init() {
		let _self = mode.comRelationship(this);
		this.view();
		this.objJson();
		this.updataView();
		this.updataViewRight();
//		this.setData();
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
//		this.setData();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
//		this.bingMouseEvent();
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TGridLayout_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TGridLayout_' + win.num + ' data-name="TGridLayout" id="' + divId + '" class="tgridlayout"><div class="row"></div></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TGridLayout" class="tgridlayout"><div class="row"></div></div>'
//		_self.lg = "4,4,4";
//		_self.md = "4,4,4";
//		_self.sm = "4,4,4";
//		_self.xs = "4,4,4";
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setLg(_self.lg);
		_self.setMd(_self.md);
		_self.setSm(_self.sm);
		_self.setXs(_self.xs);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.lg = "lg";
		plcparam.properties.md = "md";
		plcparam.properties.sm = "sm";
		plcparam.properties.xs = "xs";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keypress = "keypress";

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
	setLg(val) {
		let _self = this;
		//循环输入的sm，md，lg，更新html.如果md有值
		if(val != "") {
//			let pos = mode.session(_self.name);
			let colmd = val.split(",");
			//判断sm
			let colsm;
			_self.sm == "" ? _self.sm = _self.sm : colsm = _self.sm.split(",");
			//判断lg
			let collg;
			_self.lg == "" ? _self.lg = _self.lg : collg = _self.lg.split(",");
			$(_self.id).children(".row").children().remove();
			for(let i = 0; i < colmd.length; i++) {
				//判断输入的是否为数字
				if(isNaN(parseInt(colmd[i]))) {
					layer.alert("输入不合法");
					$(this).val('');
					break;
				} else {
					$(_self.id).children(".row").append('<div style="height:100%;padding:0" id="' + _self.id.replace("#", "") + i + '" class="col-md-' + colmd[i] + '"></div>');
					_self.lg = val;
//					mode.session(_self.name, _self);
					//判断sm
					if(colsm[i]) {
						$("" + _self.id + i + "").addClass("col-sm-" + colsm[i] + "");
					}
					//判断lg
					if(collg[i]) {
						$("" + _self.id + i + "").addClass("col-lg-" + collg[i] + "");
					}
				}
			}

		}
	}

	setMd(val) {
		let _self = this;
		//循环输入的sm，md，lg，更新html.如果md有值
		if(val != "") {
//			let _self = mode.session(_self.name);
			let colsm = val.split(",");
			//判断sm
			let colmd;
			_self.colmd == "" ? _self.colmd = _self.colmd : colmd = _self.md.split(",");
			//判断lg
			let collg;
			_self.lg == "" ? _self.lg = _self.lg : collg = _self.lg.split(",");
			$(_self.id).children(".row").children().remove();
			for(let i = 0; i < colsm.length; i++) {
				//判断输入的是否为数字
				if(isNaN(parseInt(colsm[i]))) {
					layer.alert("输入不合法");
					$(this).val('');
					break;
				} else {

					$(_self.id).children(".row").append('<div style="height:100%;padding:0" id="' + _self.id.replace("#", "") + i + '" class="col-sm-' + colsm[i] + '"></div>');
					_self.md = val;
//					mode.session(_self.name, _self);
					//判断sm
					if(colmd[i]) {
						$("" + _self.id + i + "").addClass("col-md-" + colmd[i] + "");
					}
					//判断lg
					if(collg[i]) {
						$("" + _self.id + i + "").addClass("col-lg-" + collg[i] + "");
					}
				}
			}

		}
	}

	setSm(val) {
		let _self = this;
		//循环输入的sm，md，lg，更新html.如果md有值
		if(val != "") {
//			let _self = mode.session(_self.name);
			let collg = val.split(",");
			//判断sm
			let colsm;
			_self.sm == "" ? _self.sm = _self.sm : colsm = _self.sm.split(",");
			//判断lg
			let colmd;
			_self.md == "" ? _self.md = _self.md : colmd = _self.md.split(",");
			$(_self.id).children(".row").children().remove();
			for(let i = 0; i < collg.length; i++) {
				//判断输入的是否为数字
				if(isNaN(parseInt(collg[i]))) {
					layer.alert("输入不合法");
					$(this).val('');
					break;
				} else {
					$(_self.id).children(".row").append('<div style="height:100%;padding:0" id="' + _self.id.replace("#", "") + i + '"></div>');
					_self.sm = val;
//					mode.session(_self.name, _self);
					//判断sm
					if(colsm[i]) {
						$("" + _self.id + i + "").addClass("col-sm-" + colsm[i] + "");
					}
					//判断lg
					if(colmd[i]) {
						$("" + _self.id + i + "").addClass("col-md-" + collg[i] + "");
					}
				}
			}

		}
	}

	setXs(val) {
		if(!val){
			return false;
		}
		let _self = this;
		//循环输入的sm，md，lg，更新html.如果md有值
		if(val != "") {
//			let _self = mode.session(_self.name);
			let collg = val.split(",");
			//判断sm
			let colxs;
			_self.xs == "" ? _self.xs = _self.xs : colxs = _self.xs.split(",");
			//判断lg
			let colmd;
			_self.md == "" ? _self.md = _self.md : colmd = _self.md.split(",");
			$(_self.id).children(".row").children().remove();
			for(let i = 0; i < collg.length; i++) {
				//判断输入的是否为数字
				if(isNaN(parseInt(collg[i]))) {
					layer.alert("输入不合法");
					$(this).val('');
					break;
				} else {
					$(_self.id).children(".row").append('<div style="height:100%;padding:0" id="' + _self.id.replace("#", "") + i + '"></div>');
					_self.xs = val;
//					mode.session(_self.name, _self);
					//判断sm
					if(colxs[i]) {
						$("" + _self.id + i + "").addClass("col-xs-" + colxs[i] + "");
					}
					//判断lg
					if(colmd[i]) {
						$("" + _self.id + i + "").addClass("col-md-" + collg[i] + "");
					}
				}
			}

		}
	}


	getSm() {
		let _self = this;
//		let sm = mode.session(_self.name);
		return _self.sm;
	}
	getXs() {
		let _self = this;
//		let sm = mode.session(_self.name);
		return _self.xs;
	}
	getMd() {
		let _self = this;
//		let md = mode.session(_self.name);
		return _self.md;
	}

	getLg() {
		let _self = this;
//		let lg = mode.session(_self.name);
		return _self.lg;
	}

	setCustom() {
		let _self = this;
	}

}