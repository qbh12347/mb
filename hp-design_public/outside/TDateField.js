
class TDateFieldControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"180";
		this.height = posion.height||"32";
		this.pan = posion.pan||"input";		
		this.disabled = posion.disabled||null;		
		this.dateType = posion.dateType||"date";
		this.range = posion.range||false;
		this.format = posion.format||"yyyy-MM-dd";
		this.min = posion.min||"1900-1-1";
		this.max = posion.max||"2099-12-31";
		this.lang = posion.lang||"cn";
		this.theme = posion.theme||"default";
		
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
		_self.id = _self.id || "#TDateField_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TDateField_' + win.num + ' data-name="TDateField" id="' + divId + '"><input style="width:100%;height:100%" class="date tdatefield" type="text"></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TDateField"><input style="width:100%;height:100%" class="date tdatefield" type="text"></div>'
//		_self.format = "Y/m/d";
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
//		_self.dateType(_self.dateType);
//		_self.range(_self.range);
//		_self.format(_self.format);
//		_self.min(_self.min);
//		_self.max(_self.max);
//		_self.lang(_self.lang);
//		_self.theme(_self.theme);
//		_self.setFormat(_self.format);
		_self.setDate();

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.disabled = "disabled";
		plcparam.properties.dateType = "dateType";
		plcparam.properties.range = "range";
		plcparam.properties.format = "format";
		plcparam.properties.min = "min";
		plcparam.properties.max = "max";
		plcparam.properties.lang = "lang";
		plcparam.properties.theme = "theme";
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

	setDisabled(val) {
		let _self = this;
		if(!val){
			return false;
		}else{
			if(val=="true"){
				val = true;
			}else{
				val=false;
			}
		}
		if(_self.pan) {
			$(_self.id).find(_self.pan).prop("disabled", val);
		} else {
			$(_self.id).prop("disabled", val);
		}
	}
	setDateType(val){
		let _self = this;
//		_self.setDate();
	}
	setRange(val){
		let _self = this;
//		_self.setDate();
	}
	setFormat(val){
		let _self = this;
//		_self.setDate();
	}
	setMin(val){
		let _self = this;
//		_self.setDate();
	}
	setMax(val){
		let _self = this;
//		_self.setDate();
	}
	setLang(val){
		let _self = this;
//		_self.setDate();
	}
	setTheme(val){
		let _self = this;
//		_self.setDate();
	}
	setDate(){
		let _self = this;
		$(_self.id + ' input').off("click");
		$(_self.id + ' input').off("mousedown");
		win.laydate.render({
		    elem: _self.id+" input",
		    type: _self.dateType,
		    range: _self.range,
		    format:_self.format,
		    min: _self.min,
			max: _self.max,
		    lang: _self.lang,
		    theme:_self.theme,  
			done: function(value, date, endDate){
				_self.text = value;
			}
		});
	}
	getDisabled() {
		let _self = this;
		return _self.disabled;
	}
	
	getDateType() {
		let _self = this;
		return _self.dateType;
	}
	getRange() {
		let _self = this;
		return _self.range;
	}

	getFormat() {
		let _self = this;
		return _self.format;
	}
	getMin() {
		let _self = this;
		return _self.min;
	}
	getMax() {
		let _self = this;
		return _self.max;
	}
	getLang() {
		let _self = this;
		return _self.lang;
	}
	getTheme() {
		let _self = this;
		return _self.theme;
	}
	setCustom() {
		let _self = this;
	}

}