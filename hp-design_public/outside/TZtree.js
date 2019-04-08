class TZtreeControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"150";
		this.height = posion.height||"auto";
		this.addParentNode = posion.addParentNode||null;
		this.addLeafNode = posion.addLeafNode||null;
		this.setting = posion.setting||null;
		this.delNode = posion.delNode||null;
		this.data = posion.data||null;
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
		_self.id = _self.id || "#TZtree_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TZtree_' + win.num + ' data-name="TZtree" id="' + divId + '" class="tztree"><div><ul id="' + divId + '0" class="ztree"></ul></div></div>')
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TZtree" class="tztree"><div><ul id="' + divId + '0" class="ztree"></ul></div></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
//		_self.setAddParentNode(obj.addParentNode);
//		_self.setAddLeafNode(obj.addLeafNode);
		_self.setSetting(_self.setting);
		_self.setDelNode(_self.delNode);
		_self.setData(_self.data);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.addParentNode = "addParentNode";
		plcparam.properties.addLeafNode = "addLeafNode";
		plcparam.properties.setting = "setting";
		plcparam.properties.delNode = "delNode";
		plcparam.properties.data = "data";

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
	setAddParentNode(val) {
		let _self = this;
		if(!val){
			return false;
		}
		_self.newCount = 0;
		if(val) {
			let treedemo = _self.id.replace("#", "") + "0";
			let zTree = $.fn.zTree.getZTreeObj(treedemo);
			let nodes = zTree.getSelectedNodes();
			let treeNode = nodes[0];
			for(let i = 0; i < val; i++) {
				zTree.addNodes(treeNode, {
					id: (100 + _self.newCount),
					pId: treeNode.id,
					isParent: true,
					name: "new node" + (_self.newCount++)
				});
			}
			_self.myData();
		}

	}

	setAddLeafNode(val) {
		let _self = this;
		if(!val){
			return false;
		}
		_self.newCount = 0;
		if(val) {
			let treedemo = _self.id.replace("#", "") + "0";
			let zTree = $.fn.zTree.getZTreeObj(treedemo);
			let nodes = zTree.getSelectedNodes();
			let treeNode = nodes[0];
			if(!treeNode) {
				layer.alert("叶子节点被锁定，无法增加子节点");
			}
			for(let i = 0; i < val; i++) {
				zTree.addNodes(treeNode, {id: (100 + _self.newCount), pId: treeNode.id, isParent: false, name: "new leaf" + (_self.newCount++),right:true,open:false});
//				treeNode = zTree.addNodes(null, {
//					id: (100 + _self.newCount),
//					pId: 0,
//					isParent: false,
//					name: "new node" + (_self.newCount++)
//				});
			}
			_self.myData();
		}
	}


	//获取当前tree数据。
	myData(){
		let _self = this;
		let treedemo = _self.id.replace("#", "") + "0";
		let zTree = $.fn.zTree.getZTreeObj(treedemo);
		let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });	
		_self.data = nodes;
		let bszTree = $.fn.zTree.getZTreeObj("baseTree");
		let bsnode =  bszTree.getNodeByParam("id",_self.id);
		bsnode.data = _self.data;
	}
	getAddParentNode() {
		let _self = this;
	}

	getAddLeafNode() {
		let _self = this;
	}

	setSetting(val) {
		let _self = this;
//		let obj = mode.session(_self.name);
		if(_self.data == undefined || _self.data == []) {
			_self.data = [{
				id: "0",
				parentComponent: "root",
				name: "test",
				type: "test",
				open: true,
				isParent: true
			}];
		}
		
		var setting = {
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "parentComponent",
					rootPId: ""
				}
			},
			callback: {
//				onClick: customClick,
//				onRightClick:customRightClick
			}

		};
		$.fn.zTree.init($("" + _self.id + "0" + ""), setting, _self.data);
	}

	rightcli() {
		let _self = this;

	}

	setDelNode(val) {
		let _self = this;
		if(!val){
			return false;
		}
		if(val) {
			let treedemo = _self.id.replace("#", "") + "0";
			let zTree = $.fn.zTree.getZTreeObj(treedemo),
				nodes = zTree.getSelectedNodes(),
				treeNode = nodes[0];
			if(nodes.length == 0) {
//				layer.alert("请先选择一个节点");
				return;
			}
			zTree.removeNode(treeNode);
		}
		_self.myData()
	}

	getDelNode() {
		let _self = this;
	}

	setData(val) {
		let _self = this;
		if(val){
			$.fn.zTree.init($("" + _self.id + "0" + ""), _self.setting, val);
		}
		
	}

	getData() {
		let _self = this;

	}
	getSetting() {
		let _self = this;
	}
	setCustom() {
		let _self = this;
	}

}

