class TFormControl extends publicFn {
	constructor(posion) {
		super(posion);
//		this.posion = posion;
//		this.id = id;
//		this.name = name;
//		this.pan = pan;
		
		this.width = posion.width||"100%";
		this.height = posion.height||"100%";
		this.posType = posion.posType||"relative";
		this.viewHtml = posion.viewHtml||null;
		this.uitype = posion.uitype||null;;
    	this.uiName = posion.uiName||null;;
    	this.desc = posion.desc||null;;
    	this.subjectName = posion.pId||null;;
		this.version = posion.version||null;;
		this.baseForm = posion.baseForm||null;;
//		this.type=posion.type||null;;
		
		
		
	}
	init() {
		let _self = mode.comRelationship(this);		
		this.view();
		this.objJson();	
		this.updataView();
		this.updataViewRight();
		this.drag();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
//		this.bingMouseEvent();
		gol.addNode(this);
	}

	render() {
		this.view();
		this.updataView();
		this.updataViewRight();
		this.drag();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
//		this.bingMouseEvent();
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TForm_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TForm_' + win.num + ' data-name="TForm" id="' + divId + '" class="tform"></div>')
//		$(_self.id).addClass("la-drag");
		$(_self.id).css({
			"position": _self.posType,
			"width": _self.width,
			"height": _self.height,
			"left": _self.left,
			"top": _self.top
		});
		$(win.rootDom).find("div").removeClass("cked");
		$(_self.id).addClass("cked");
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TForm" class="tform"></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
		_self.plcUpView();

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.eventList.init = "init";
		plcparam.eventList.customFunction="customFunction";
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
//					mode.session(_self.name, _self.posion);
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

}