class TDropdownControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.pan = posion.pan||"button";
		this.width = posion.width||"auto";
		this.height = posion.height||"auto";
		this.text = posion.text || "menu";
		this.menuList = posion.menuList||null;
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
		_self.id = _self.id || "#TDropdown_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div id="' + divId + '" name=TDropdown_' + win.num + ' data-name="TDropdown" class="dropdown"><button type="button" class="btn dropdown-toggle tdropdown" id="' + divId + '0"  data-toggle="dropdown"></button><ul class="dropdown-menu" aria-labelledby="' + divId + '0" ></ul></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TDropdown" class="dropdown"><button type="button" class="btn dropdown-toggle" id="' + divId + '0"  data-toggle="dropdown">菜单</button><ul class="dropdown-menu" aria-labelledby="' + divId + '0" ></ul></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
//		_self.setMenuTitle(_self.menuTitle);
		_self.setMenuList(_self.menuList);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
//		plcparam.properties.menuTitle = "menuTitle";
		plcparam.properties.menuList = "menuList";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		if(_self.menuList){
			let tite = _self.menuList.split(","); 
			tite.forEach(function(v,i){

			plcparam.eventList["menu"+i] = "menu"+i;
			
		});
		}
			
		
		
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

	setMenuList(val){
		let _self = this;
		if(val){
			$(_self.id).find("ul").html(" ");
		val = val.split(",");
		val.forEach(function(v,i){
//			$(".c-right .r-bottom tbody").append('<tr><td>menu'+i+'</td><td><button type="button" data-type="menu'+i+'" class="btn btn-primary">editCode</button></td></tr>');
			$(_self.id).find("ul").append('<li><a href="javascript:;">' + v + '</a></li>');
		});
		}
	}
	setAddMenuList(){
		let _self = this;
		if(val){
//			$(_self.id).find("ul").html(" ");
			val = val.split(",");
			val.forEach(function(v,i){
	//			$(".c-right .r-bottom tbody").append('<tr><td>menu'+i+'</td><td><button type="button" data-type="menu'+i+'" class="btn btn-primary">editCode</button></td></tr>');
				$(_self.id).find("ul").append('<li><a href="javascript:;">' + v + '</a></li>');
			});
		}
	}

	getMenuList() {
		let _self = this;
		return _self.menuList;
	}
	setCustom() {
	}

}