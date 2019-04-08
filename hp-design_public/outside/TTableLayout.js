class TTableLayoutControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"400";
		this.height = posion.height||"200";
		this.layoutRows = posion.layoutRows||"3";
		this.layoutCols = posion.layoutCols||"3";
		this.colWidth = posion.colWidth||null;
		this.colHeight = posion.colHeight||null;
		this.rowcolor = posion.rowcolor||null;
		this.addLayoutRows = posion.addLayoutRows||null;
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
		this.pushAction();
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
		_self.id = _self.id || "#TTableLayout_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TTableLayout_' + win.num + ' data-name="TTableLayout"  id="' + divId + '"><table class="table table-bordered" id="' + divId + '0"><tbody></tbody></table></div>')
		$(_self.id).addClass("la-drag");
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TTableLayout" ><table class="table table-bordered" id="' + divId + '0"><tbody></tbody></table></div>'
//		_self.layoutRows = "3";
//		_self.layoutCols = "3";
//		_self.width = "400";
//		_self.height = "200";
//		_self.posType = "absolute";
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.setLayoutRows(_self.layoutRows);
		_self.setLayoutCols(_self.layoutCols);
		_self.setColWidth(_self.colWidth);
		_self.setColHeight(_self.colHeight);
		_self.setRowcolor(_self.rowcolor);
		_self.plcUpView();
		
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.layoutRows = "layoutRows";
		plcparam.properties.layoutCols = "layoutCols";
		plcparam.properties.colWidth = "colWidth";
		plcparam.properties.colHeight = "colHeight";
		plcparam.properties.rowcolor = "rowcolor";
		plcparam.properties.addLayoutRows = "addLayoutRows";
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
	setLayoutRows(val){
		let _self = this;
		if (!val) {
			return false;
		}
		let trnum = $(_self.id + " tbody tr").eq(0).find("td").length;
		$(_self.id + " tbody").children().remove();
		if (trnum==0) {
			for (let i=0;i<val;i++) {
				$(_self.id + " tbody").append('<tr id="tr'+i+'"></tr>');
			}
			
		} else{
			for (let i=0;i<val;i++) {
				$(_self.id + " tbody").append('<tr id="tr'+i+'"></tr>');
				for (let j=0;j<trnum;j++) {
					$(_self.id + " tbody tr").eq(i).append('<td id="tr'+i+'_'+j+'"></td>');
				}
			}
		}
	
	}
	setLayoutCols(val){
		let _self = this;
		if (!val) {
			return false;
		}
		let trnum = $(_self.id + " tbody tr").length;
		if (trnum==0) {
			layer.alert("请先输入行数");
		} else{
			$(_self.id + " tbody").children().remove();
			for (let i=0;i<trnum;i++) {
				$(_self.id + " tbody").append('<tr id="tr'+i+'"></tr>');
				for (let j=0;j<val;j++) {
					$(_self.id + " tbody tr").eq(i).append('<td id="tr'+i+'_'+j+'"></td>');
				}
			}
		}
	}
	
	setAddLayoutRows(val){
		let _self = this;
		if(val){
			let tdnum = $(_self.id + " tbody tr").eq(0).find("td").length;
			let trnum = $(_self.id + " tbody tr").length;
			if(tdnum!=0){
				let naddhtml = "";
				for (let i=0;i<val;i++) {
					let colhtml="";
					let trn = trnum+i;
					for (let j=0;j<tdnum;j++) {
						colhtml = colhtml+'<td id="tr'+trn+'_'+j+'"></td>'
					}
					naddhtml = naddhtml+'<tr id="tr'+trn+'">'+colhtml+'</tr>'
				}
				$(_self.id + " tbody").append(naddhtml);
			}
			_self.layoutRows = parseInt(_self.layoutRows)+parseInt(val);
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			let nodes = zTree.getSelectedNodes();
			nodes[0].layoutRows = _self.layoutRows;
		}
	}
	
	setColWidth(val){
		let _self = this;
		if (val) {
			if(val=="divide"){
//				let tbw = $(_self.id).width();
				let dide = parseFloat(100 / parseInt(_self.layoutCols)).toFixed(1)+"%";
				
//				$(_self.id + " tbody td").width("150px");
				$(_self.id + " tbody td").css("width",dide);
			}else{
				let cw = val.split(",");
				let tddm = $(_self.id + " tbody tr").eq(0).find("td");
				for (let i=0;i<cw.length;i++) {
					tddm.eq(i).css("width",cw[i]);
				}
			}	
		}
	}
	
	setColHeight(val){
		let _self = this;
		if(val){
			$(_self.id + " tbody td").css("height",val);
		}
		
	}
	//layout行颜色。格式：行号，颜色值；	
	setRowcolor(val){
		let _self = this;
		if(val){
			let valArry = val.split(";");
			valArry.forEach(function(v,i){
				let rw = v.split(",");
				$(_self.id).find("tr").eq(rw[0]).css("background-color",rw[1]);
			});
		}

	}
	
	getAddLayoutRows(){
		let _self = this;
		return 0;
	}
	
	getRowcolor(){
		let _self = this;
		return _self.rowcolor;
	}
	
	getLayoutRows(){
		let _self = this;
//		let lr = mode.session(_self.name);
		return _self.layoutRows;
	}
	getLayoutCols(){
		let _self = this;
//		let lc = mode.session(_self.name);
		return _self.layoutCols;
	}
	getColWidth(){
		let _self = this;	
//		let clw = mode.session(_self.name);
		return _self.colWidth;
		
	}
	getColHeight(){
		let _self = this;	
//		let clw = mode.session(_self.name);
		return _self.colHeight;
		
	}
}

