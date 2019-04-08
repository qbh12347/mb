class TSelectControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"120";
		this.height = posion.height||"26";
		this.pan =  posion.select||"select";
		this.options =  posion.options||null;
		this.disabled = posion.disabled||null;
		this.isSearch = posion.isSearch||null;
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
		_self.id = _self.id || "#TSelect_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TSelect_' + win.num + ' data-name="TSelect" id="' + divId + '"><select class="tselect"></select></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TSelect"><select class="tselect" style="width:100%;height:100%"></select></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setOptions(_self.options);
		_self.setDisabled(_self.disabled);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.options = "options";
		plcparam.properties.isSearch = "isSearch";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";
		plcparam.eventList.change = "change";
		plcparam.properties.disabled = "disabled";
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
	setOptions(val, name, code, dom) {
		let _self = this;
		if(!val){
			return false;
		}
		//如果dom存在，则是表格中的下拉框
		let seldom;
		if(dom != "" && dom != undefined) {
			$(dom).children().remove();
			seldom = dom;
		} else {
			seldom = $(_self.id).find(_self.pan);
		}
		$(seldom).children().remove();
		if(val != undefined && val != "") {
			//判断val的格式，如果有","则是普通数组，如[1,2,3].否则是[{....}，{.....}]结构(根据数据输出option会用到)
			var tf = typeof val;
			if(tf == "string") {
				if(val.indexOf(";")==-1){
					let list = val.split(",");
					for(let i = 0; i < list.length; i++) {
						$(seldom).append('<option>' + list[i] + '</option>');
					}
				}else{
					let item = val.split(";");
					for (let j=0;j<item.length;j++) {
						let opt = item[j].split(",");
						$(seldom).append('<option value='+opt[0]+'>' + opt[1] + '</option>');
					}
				}
				
				
			} else {
				let ndata = mode.resultParse(val);
				ndata = ndata.newVal;
				for(var i = 0; i < ndata.length; i++) {
					$(seldom).append('<option value="' + ndata[i][code] + '">' + ndata[i][name] + '</option>');
				}
			}

		};
		_self.setIsSearch(_self.isSearch);
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
	setIsSearch(val){
		let _self = this;
		if(val=="true"){
			$(_self.id+' select').comboSelect();
			$(_self.id+' select').hide();
		}else{
			$(_self.id+' select').show();
		}
	}
	getIsSearch(){
		let _self = this;
		return _self.isSearch;
	}
	getDisabled() {
		let _self = this;
		return _self.disabled;
	}
	getOptions() {
		let _self = this;
//		let op = mode.session(_self.name);
		return _self.options;
	}
	setData() {
		let _self = this;
	}
}

