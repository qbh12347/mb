class TMenuTreeControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"200";
		this.height = posion.height||"auto";
		this.treeData = posion.treeData||[{text: "Parent 1",nodes: [{text: "Child 1",nodes: [{text: "Grandchild 1"}, {text: "Grandchild 2"}]}, {text: "Child 2"}]}, {text: "Parent 2"}];
		this.levels = posion.levels||1;
		this.expandIcon = posion.expandIcon||"glyphicon glyphicon-chevron-right";
		this.collapseIcon = posion.collapseIcon||"glyphicon glyphicon-chevron-down";
		this.enableLinks = posion.enableLinks||"enableLinks";
		this.checkedIcon = posion.checkedIcon||"checkedIcon";
		this.emptyIcon = posion.emptyIcon||null;
		this.highResult = posion.highResult||null;
		this.highSelected = posion.highSelected||null;
		this.onhoverColor = posion.onhoverColor||null;
		this.nodeIcon = posion.nodeIcon||null;
		this.selectedIcon = posion.selectedIcon||null;
		this.seltedBgColor = posion.seltedBgColor||null;
		this.showBorder = posion.showBorder||true;
		this.showCheckbox = posion.showCheckbox||null;
		this.showIcon = posion.showIcon||null;
		this.showTags = posion.showTags||null;
		
		
		
		
		
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
		_self.id = _self.id || "#TMenuTree_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TMenuTree_' + win.num + ' data-name="TMenuTree"  id="' + divId + '" class="tmenutree"></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TMenuTree"  class="tmenutree"></div>'
//		_self.treeData = [{
//			text: "Parent 1",
//			nodes: [{
//				text: "Child 1",
//				nodes: [{
//					text: "Grandchild 1"
//				}, {
//					text: "Grandchild 2"
//				}]
//			}, {
//				text: "Child 2"
//			}]
//		}, {
//			text: "Parent 2"
//		}];
//		_self.levels = 1;
//		_self.expandIcon = "glyphicon glyphicon-chevron-right";
//		_self.collapseIcon = "glyphicon glyphicon-chevron-down";
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setTreeData(_self.treeData);
		_self.setLevels(_self.levels);
		_self.setExpandIcon(_self.expandIcon);
		_self.setCollapseIcon(_self.collapseIcon);
		_self.setEnableLinks(_self.enableLinks);
		_self.setCheckedIcon(_self.checkedIcon);
		_self.setEmptyIcon(_self.emptyIcon);
		_self.setHighResult(_self.highResult);
		_self.setHighSelected(_self.highSelected);
		_self.setOnhoverColor(_self.onhoverColor);
		_self.setNodeIcon(_self.nodeIcon);
		_self.setSelectedIcon(_self.selectedIcon);
		_self.setSeltedBgColor(_self.seltedBgColor);
		_self.setShowBorder(_self.showBorder);
		_self.setShowCheckbox(_self.showCheckbox);
		_self.setShowIcon(_self.showIcon);
		_self.setShowTags(_self.showTags);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.treeData = "treeData";
		plcparam.properties.levels = "levels";
		plcparam.properties.expandIcon = "expandIcon";
		plcparam.properties.collapseIcon = "collapseIcon";
		plcparam.properties.enableLinks = "enableLinks";
		plcparam.properties.checkedIcon = "checkedIcon";
		plcparam.properties.emptyIcon = "emptyIcon";
		plcparam.properties.highResult = "highResult";
		plcparam.properties.highSelected = "highSelected";
		plcparam.properties.onhoverColor = "onhoverColor";
		plcparam.properties.nodeIcon = "nodeIcon";
		plcparam.properties.selectedIcon = "selectedIcon";
		plcparam.properties.seltedBgColor = "seltedBgColor";
		plcparam.properties.showBorder = "showBorder";
		plcparam.properties.showCheckbox = "showCheckbox";
		plcparam.properties.showIcon = "showIcon";
		plcparam.properties.showTags = "showTags";
		plcparam.eventList.nodeClick = "nodeClick";
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
					eval("inpt.eq(i).val(_self.get" + fnc + "());");
				} else {
					eval("inpt.eq(i).val(_self.get" + fnc + "());");
				}
			}
		}
	}
	setCustom() {
		let _self = this;
		$(_self.id).treeview({
			data: _self.treeData,
			levels: _self.levels,
			expandIcon: _self.expandIcon,
			collapseIcon: _self.collapseIcon,
			enableLinks: _self.enableLinks,
			checkedIcon: _self.checkedIcon,
			emptyIcon: _self.emptyIcon,
			highlightSearchResults: _self.highResult,
			highlightSelected: _self.highSelected,
			onhoverColor: _self.onhoverColor,
			nodeIcon: _self.nodeIcon,
			selectedIcon: _self.selectedIcon,
			seltedBgColor: _self.seltedBgColor,
			showBorder: _self.showBorder,
			showCheckbox: _self.showCheckbox,
			showIcon: _self.showIcon,
			showTags: _self.showTags,
			onNodeSelected:function(event, data) {
				if(data.nodes){
					nodeClick(event, data);
				}
			   
			}
		});
		//外层div选中事件必须放到tree初始化完成之后,否则会因为事件冒泡原因导致错误.(每次调用初始化之后都需要这样)
		this.bingBorder();
	}

	setTreeData(val) {
		let _self = this;
		win.dom = _self.id;
//		_self.treeData = val;
//		mode.session(_self.name, _self.posion);
		if(typeof val == "string") {
			
			let result = mode.resultParse(val);
			result = result.newVal;
			let treeArry = [];
			for (let i=0;i<result.length;i++) {
				let ndata = result[i].value;
				treeArry.push(ndata);				
			}
//			console.log(treeArry);
			_self.treeData = treeArry;
		
		}else if($.isArray(val)){
			_self.treeData = val ;
		}
		
		_self.setCustom();
	}
	
	getTreeData() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.treeData;
	}

	setLevels(val) {
		let _self = this;
		_self.levels = val;
//		mode.session(_self.name, _self.posion);

	}

	getLevels() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.levels;
	}

	setExpandIcon(val) {
		let _self = this;
		_self.expandIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getExpandIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.expandIcon;
	}

	setCollapseIcon(val) {
		let _self = this;
		_self.collapseIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getCollapseIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.collapseIcon;
	}

	setEnableLinks(val) {
		let _self = this;
		_self.enableLinks = val;
//		mode.session(_self.name, _self.posion);
	}

	getEnableLinks() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.enableLinks;
	}

	setCheckedIcon(val) {
		let _self = this;
		_self.checkedIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getCheckedIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.checkedIcon;
	}

	setEmptyIcon(val) {
		let _self = this;
		_self.emptyIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getEmptyIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.emptyIcon;
	}

	setHighResult(val) {
		let _self = this;
		_self.highResult = val;
//		mode.session(_self.name, _self.posion);
	}

	getHighResult() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.highResult;
	}

	setHighSelected(val) {
		let _self = this;
		_self.highSelected = val;
//		mode.session(_self.name, _self.posion);
	}

	getHighSelected() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.highSelected;
	}

	setOnhoverColor(val) {
		let _self = this;
		_self.onhoverColor = val;
//		mode.session(_self.name, _self.posion);
	}

	getOnhoverColor() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.onhoverColor;
	}

	setNodeIcon(val) {
		let _self = this;
		_self.nodeIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getNodeIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.nodeIcon;
	}

	setSelectedIcon(val) {
		let _self = this;
		_self.selectedIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getSelectedIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.selectedIcon;
	}

	setSeltedBgColor(val) {
		let _self = this;
		_self.seltedBgColor = val;
//		mode.session(_self.name, _self.posion);
	}

	getSeltedBgColor() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.seltedBgColor;
	}

	setShowBorder(val) {
		let _self = this;
		_self.showBorder = val;
//		mode.session(_self.name, _self.posion);
	}

	getShowBorder() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.showBorder;
	}

	setShowCheckbox(val) {
		let _self = this;
		_self.showCheckbox = val;
//		mode.session(_self.name, _self.posion);
	}

	getShowCheckbox() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.showCheckbox;
	}

	setShowIcon(val) {
		let _self = this;
		_self.showIcon = val;
//		mode.session(_self.name, _self.posion);
	}

	getShowIcon() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.showIcon;
	}

	setShowTags(val) {
		let _self = this;
		_self.showTags = val;
//		mode.session(_self.name, _self.posion);
	}

	getShowTags() {
		let _self = this;
//		let ren = mode.session(_self.name);
		return _self.showTags;
	}

}