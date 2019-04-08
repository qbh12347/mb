class TTableControl extends publicFn {
	constructor(posion) {
		super(posion);
//		this.posion = posion;
//		this.id = id;
//		this.name = name;
//		this.pan = pan;
		//与属性相对应,新增的时候posion中应该没有对应属性，所以会取默认值，当还原的时候要用posion中的数据而不是默认值。
		this.width = posion.width||"400";
		this.height = posion.height||"300";
		this.className=posion.className||"dfborder";
		this.head = posion.head||null;
		this.addCols = posion.addCols||null;
		this.data = posion.data||null;
		this.rows = posion.rows||null;
		this.addRows = posion.addRows||null;
		this.cols = posion.cols||null;
		this.selected = posion.selected||null;
		this.tableClass = posion.tableClass||"table table-bordered table-hover";
		this.tableAddClass= posion.tableAddClass||null;
		this.pageNum = posion.pageNum||5;
		this.isEdit = posion.isEdit||"true";
//		this.addDisabled;
		this.dateFormat = posion.dateFormat||null;
		this.tbBgColor = posion.tbBgColor||null;
		this.tbHeadColor = posion.tbHeadColor||null;
		this.tbBorder = posion.tbBorder||null;
		this.viewHtml = posion.viewHtml||null;
		this.disabled = posion.disabled||null;
		this.dataFormat = posion.dataFormat||null;
		this.pageIsHide = posion.pageIsHide||null;
		this.overflow = posion.overflow||null;
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
//		_self.posion.id = _self.posion.id || "#TTable_" + Math.random().toString(36).substr(2);
		_self.id = _self.id || "#TTable_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TTable_' + win.num + ' data-name="TTable" class="dfborder ttable" id="' + divId + '"><table class="table table-bordered table-hover" id="' + divId + '0"><thead></thead><tbody></tbody></table></div>')
//		$(_self.id).addClass("la-drag");
		$(_self.id).css({
			"position": _self.posType,
			"width": _self.width,
			"height": _self.height,
			"left": _self.left,
			"top": _self.top
		});
	}
	objJson() {
		let _self = this;
//		_self.id = _self.posion.id;
		_self.name = $(_self.id).attr("name");
//		win.name = _self.name;

//		_self.pan = _self.rolecss;
		let divId = _self.id.replace("#", "");
//		_self.className = _self.getClassName();
		_self.x = _self.getX();
		_self.y=_self.getY(); 
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
		
		
//		_self.posion.viewHtml = '<div name=TTable_' + win.num + ' data-name="TTable" class="dfborder" id="' + divId + '"><table class="table table-bordered" id="' + divId + '0"><thead></thead><tbody></tbody></table></div>'
		_self.viewHtml = '<div id="' + divId + '" data-name="TTable" class="dfborder ttable" ><table class="table table-bordered" id="' + divId + '0"><thead></thead><tbody></tbody></table></div>';
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.posion.id;
//		_self.name = _self.posion.name;
//		_self.pan = _self.posion.rolecss;
		_self.plcUpView();
		_self.setHead(_self.head);
		_self.setData(_self.data);
		_self.setRows(_self.rows);
		_self.setCols(_self.cols);
		_self.setTableClass(_self.tableClass);
		if(_self.pageIsHide!="true"){
			_self.setPageNum(_self.pageNum);
		}
		
		_self.setOverflow(_self.overflow);
		
//		_self.setAddCols('',_self.addCols);
//		_self.setAddRows('',_self.addRows);
//		_self.setSelected(_self.selected);
//		_self.setTableAddClass(_self.tableAddClass);
//		_self.setIsEdit(_self.isEdit);
//		_self.setDateFormat(_self.dateFormat);
		_self.setTbBgColor(_self.tbBgColor);
		_self.setTbHeadColor(_self.tbHeadColor);
		_self.setTbBorder(_self.tbBorder);

	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.head = "head";
		plcparam.properties.data = "data";
		plcparam.properties.rows = "rows";
		plcparam.properties.cols = "cols";
		plcparam.properties.tbBgColor = "tbBgColor";
		plcparam.properties.tbHeadColor = "tbHeadColor";
		plcparam.properties.tbBorder = "tbBorder";
		plcparam.properties.pageIsHide = "pageIsHide";
		plcparam.properties.overflow = "overflow";
		plcparam.properties.tableClass = "tableClass";
		plcparam.properties.pageNum = "pageNum";
		plcparam.properties.disabled  = "disabled";
		plcparam.eventList.click = "click";
		plcparam.eventList.trclick = "trclick";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";
		plcparam.eventList.focus = "focus";
		plcparam.eventList.change = "change";
		plcparam.eventList.dataFormat = "dataFormat";
//		2018/12/20新增，判断是否有button
		if(_self.head && !$.isArray(_self.head)){
			if(_self.head.indexOf("button")!=-1||_self.head.indexOf("icon")!=-1){
				let tbbtn = _self.head.split(";");
				for (let i=0;i<tbbtn.length;i++) {
					if(tbbtn[i].indexOf("button")!=-1||tbbtn[i].indexOf("icon")!=-1){
//						let claname = tbbtn[i].split(",")
						let claname = eval(tbbtn[i].substr(tbbtn[i].indexOf("button")+7)); 
//						claname = tbbtn[i][3];
						claname.forEach(function(v,k){
							if(v.indexOf("增")!=-1||v.indexOf("plus")!=-1){
								plcparam.eventList.add = "add";
							}else if(v.indexOf("编辑")!=-1||v.indexOf("改")!=-1||v.indexOf("pencil")!=-1){
								plcparam.eventList.edit = "edit";
							}else if(v.indexOf("删")!=-1||v.indexOf("trash")!=-1){
								plcparam.eventList.del = "del";
							}
						});
						
					}
				}
			}
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
	
	setTbBgColor(val){
		let _self = this;
		$(_self.id).find("tbody").css("background-color",val);
		$(_self.id).find("tbody input").css("background-color",val);
		$(_self.id).find("tbody select").css("background-color",val);
	}
	setTbHeadColor(val){
		let _self = this;
		$(_self.id).find("thead").css("background-color",val);
	}
	setTbBorder(val){
		let _self = this;
		$(_self.id).find("td").css("border",val);
		$(_self.id).find("th").css("border",val);
	}

	getTbBgColor(){
		let _self = this;
		return _self.tbBgColor;
	}
	getTbHeadColor(){
		let _self = this;
		return _self.tbHeadColor;
	}
	getTbBorder(){
		let _self = this;
		return _self.tbBorder
	}
	//增加列
	setAddCols(index,data){
		let _self = this;
		if(!data){
			return false;
		}
		let ndata = data.split(";");
//		let headName=[];             //head名
		let headType=[];             //head类型
//		let headWidth=[];            //head宽度
		let thtm = "";
		ndata.forEach(function(v, i) {
			let col = v.split(",");
			headType.push(col[2]);
			col[1]=col[1]||"auto";
			if (col[2]=="checkbox") {
				thtm = thtm+'<th style="width:'+col[1]+'"><input type="checkbox"/></th>';
			} else if(col[2]==true){
				thtm = thtm+'<th style="display:none">'+col[0]+'</th>';
			}else{
				thtm = thtm+'<th style="width:'+col[1]+'">'+col[0]+'</th>';
			}
		});
		
		if (index) {
			let predom = $(_self.id + " thead th").eq(parseInt(index));
			$(thtm).insertBefore(predom);
		} else{
			$(_self.id + " thead tr").append(thtm);	
		}
		
		//先获取行信息。
		let rowdata = $(_self.id).find("tbody tr");
		//存在行
		if(rowdata.length!=0){
			for (let i=0;i<rowdata.length;i++) {
				let ncols="";
				for (let j=0;j<headType.length;j++) {
					switch (headType[j]){
						case "checkbox": ncols = ncols+'<td><input type="checkbox"/></td>';
							break;
						case "true": ncols = ncols+'<td style="display:none"><input type="checkbox"/></td>';
							break;
						case "boolean": ncols = ncols+'<td><select><option></option><option>true</option><option>false</option></select></td>';
							break;
						case "select": ncols = ncols+'<td><select><option></option></select></td>';
							break;		
						case "number":
						//只能输入数字
						ncols = ncols+'<td><input type="text" onkeyup="value=value.replace(/[^\d]/g,\'\') " onbeforepaste="clipboardData.setData(\'text\',clipboardData.getData(\'text\').replace(/[^\d]/g,\'\'))"/></td>';
							break;	
							
						default:
						ncols = ncols+'<td><input type="text"/></td>';
							break;
					}
				}
				//将每一行中新增的列插入到指定的地方
				if (index) {
					let trposion = $(rowdata[i]).find("td").eq(parseInt(index));
					$(ncols).insertBefore(trposion);
				} else{
					$(rowdata[i]).append(ncols);	
				}
				
			}
		}
			
		
	}
	
	setHead(val) {
		let _self = this;
		if(val==""||val==undefined){
			return false;
		}else if(typeof val=="string"){
			_self.setHeadForString(val);
		}else if( $.isArray(val)){
			_self.setHeadForList(val);			
		}
	}
	
	
	//head是string
	setHeadForString(headstring){
		let _self = this;
		if(!headstring) {
			return false;
		}
		let head = headstring.split(";");
		$(_self.id + " thead").children().remove();
		$(_self.id + " thead").append('<tr></tr>');
		let ckd = false;
		head.forEach(function(v, i) {
			let col = v.split(",");
			col[1] = col[1]||null;
			if(col[2] == "checkbox") {
				if(col[0]){
					$(_self.id + " thead tr").append('<th style="width:' + col[1] + '">' + col[0] + '</th>');
				}else{
					ckd = true;
					$(_self.id + " thead tr").append('<th style="width:' + col[1] + '"><input type="checkbox"/></th>');
				}
				
//				if(col[1]) {
//					$(_self.id + " thead tr").append('<th style="width:' + col[1] + '"><input type="checkbox"/></th>');
//				} else {
//					$(_self.id + " thead tr").append('<th><input type="checkbox"/></th>');
//				}
			} else if(col[2]=="true") {
				$(_self.id + " thead tr").append('<th style="display:none">' + col[0] + '</th>');
			} else {
				//2018/8/24新增列宽度设置
				if(col[1]) {
					$(_self.id + " thead tr").append('<th style="width:' + col[1] + '">' + col[0] + '</th>');
				} else {
					$(_self.id + " thead tr").append('<th>' + col[0] + '</th>');
				}

			}
		});
		if(ckd){
			//全选功能
			$(_self.id + " thead tr th").on("change", "input[type='checkbox']", function() {
				let ck = $(_self.id + " thead tr th input[type='checkbox']").prop("checked");
				$(_self.id + " tbody tr input[type='checkbox']").prop("checked", ck);
			});
		}
		
	}
	//head是list[1,2,3,4]
	setHeadForList(headlist){
		let _self = this;
		$(_self.id + " thead").children().remove();
		$(_self.id + " thead").append('<tr></tr>');
		for (let i=0;i<headlist.length;i++) {
			$(_self.id + " thead tr").append('<th>'+headlist[i]+'</th>');
		}	
	}
	
	

	setData(val) {
		let _self = this;
		if(val==""||val==undefined){
			return false;
		}else if($.isPlainObject(val)){
			_self.setDataForObj(val);
		}else if($.isArray(val)){
			_self.setDataForList(val);
		}else if(typeof val=="string"){
			val = JSON.parse(val)
			_self.setDataForObj(val);
		}	
	}
	//data为json
	setDataForObj(dataobj){
		let _self = this;
		let fomt = false;
		let dateFomt;
//		let seon = mode.local(_self.name);
//		let head = seon.head;
		let head = _self.getHead();
		
		
		let tbdata = mode.resultParse(dataobj);
		tbdata = tbdata.newVal;
		$(_self.id + " tbody").children().remove();
		//判断head数据是否存在
		if(head == undefined || head == "") {
			//如果没有head，直接把数据全部放入tbody
			for(let i = 0; i < tbdata.length; i++) { //行
				let data = tbdata[i].value; 
				$(_self.id + " tbody").append('<tr class="tr_' + data.id + '"></tr>');
				for(item in tbdata[i]) {
					$(_self.id + " tbody tr").eq(i).append('<td><input type="text" value="' + data[item] + '"></td>');
				}
			}
		} else {
			head = head.split(";");
			for(let i = 0; i < tbdata.length; i++) { //行
				let data = tbdata[i].value;
				if(_self.dataFormat){
					eval(_self.dataFormat)
				}
				$(_self.id + " tbody").append('<tr class="tr_' + data.id + '"></tr>');
				for(let j = 0; j < head.length; j++) { //列 					
					
					let col = head[j].split(",");
					
					if(data[col[3]]==undefined || data[col[3]]==null || data[col[3]]=="null"){
						data[col[3]]="";
					}
					
					//head格式：name，width，type(checkbox,date:日期格式format，select,button)，param(如果是button，这里是名称，例如：["增加"，"编辑"，"删除"])，format  
					if(col[2] == "checkbox") {
						$(_self.id + " tbody tr").eq(i).append('<td><input type="checkbox"></td>');
						$(_self.id + " tbody tr").eq(i).find("input[type=checkbox]").prop("checked", data[col[3]]);
					} else if(col[2] == "date") {
						fomt = true;
						//把日期格式传参给日期函数
						dateFomt = col[4];
						$(_self.id + " tbody tr").eq(i).append('<td><input class="date" type="text" value="' + data[col[3]] + '"></td>');
					} else if(col[2] == "select") {
						$(_self.id + " tbody tr").eq(i).append('<td><select class="sel_' + ij + '"></select></td>');
						let dom = ".sel_" + ij;
						_self.setOptions(data[col[3]])
					}else if(col[2] == "boolean"){
						$(_self.id + " tbody tr").eq(i).append('<td><select class="sel_' + ij + '"><option>true</option><option>false</option></select></td>');
						let dom = ".sel_" + ij;
						$(dom).find("option[value="+data[col[3]]+"]").attr("selected","selected");
					}
					//2018/8/24新增隐藏列功能。
					else if(col[2] == "true") {
						$(_self.id + " tbody tr").eq(i).append('<td style="display:none"><input type="text" value="' + data[col[3]] + '"></td>');
					}
					//2018/12/20新增表格中增删查改等按钮,还可以是字体图标
					else if(col[2] == "button"){
						let trbton = "";
						let myarry = eval(head[j].substr(head[j].indexOf("button")+7));
						myarry.forEach(function(v,m){
							if(v.indexOf("增")!=-1){
								trbton = trbton + '<button type="button" class="btn btn-primary add">'+v+'</button>';
							}else if(v.indexOf("编辑")!=-1||v.indexOf("改")!=-1){
								trbton = trbton + '<button type="button" class="btn btn-info edit">'+v+'</button>';
							}else if(v.indexOf("删除")!=-1){
								trbton = trbton + '<button type="button" class="btn btn-danger del">'+v+'</button>';
							}else{
								trbton = trbton + '<button type="button" class="btn btn-default def">'+v+'</button>';
							}
						});
						$(_self.id + " tbody tr").eq(i).append('<td style="width:150px">'+trbton+'</td>');
					}
					else if(col[2] == "icon"){
						let icon = "";
						let myarry = eval(head[j].substr(head[j].indexOf("button")+7));
						myarry.forEach(function(v,m){
							if(v.indexOf("plus")!=-1){
								icon = icon + '<button type="button" class="'+v+' add"></button>';
							}else if(v.indexOf("pencil")!=-1||v.indexOf("改")!=-1){
								icon = icon + '<button type="button" class="'+v+' edit"></button>';
							}else if(v.indexOf(" trash")!=-1){
								icon = icon + '<button type="button" class="'+v+' del"></button>';
							}else{
								icon = icon + '<button type="button" class="'+v+' def"></button>';
							}
						});
						$(_self.id + " tbody tr").eq(i).append('<td style="width:150px">'+icon+'</td>');
					}
					
					else {
						$(_self.id + " tbody tr").eq(i).append('<td><input type="text" value="' + data[col[3]] + '"></td>');
					}
				}
			}
			//日期插件调用
			if(fomt) {
				_self.setFormat(dateFomt);
				_self.format = dateFomt;
				updateNodeData("format",dateFomt);
//				mode.session(_self.name, _self.posion)
			}

		}
		//selectTable也会调用此方法，所以需要用selectTable的特有属性来判断是否需要执行下面两个方法
		if(!_self.tableWidth) {
//			_self.setAddRow(1);
		}
		if(_self.pageIsHide=="true") {
			_self.setPageIsHide(_self.pageIsHide);
		}else{
			_self.setPage(_self.pageNum);
			
		}
		if(_self.disabled){
			_self.setDisabled(_self.disabled);
		}
	}
	//data是二维数组
	setDataForList(datalist,page){
		let _self = this;
		$(_self.id + " tbody").children().remove();
		for(let i=0;i<datalist.length;i++){
			$(_self.id + " tbody").append('<tr></tr>');
			let td = "";
			for (let j=0;j<datalist[i].length;j++) {
				if(datalist[i][j]){
					td = td + '<td>'+datalist[i][j]+'</td>';
				}else{
					td = td + '<td></td>';
				}
				
			}
			$(_self.id + " tbody tr").eq(i).append(td);
		}
	
			if(!page){
				_self.setPage();
			}
		
		
		 

	}
	
	setTableClass(className){
		let _self = this;
		$(_self.id +" table").attr("class",className);
	}
	
	setAddTableClass(className){
		let _self = this;
		$(_self.id +" table").addClass(className);
	}
	
	getTableClass(){
		let _self = this;
		 return $(_self.id +" table").attr("class");
	}
		
	setCols(val,tem,daty){
	  	if (!val) {
	  		return false;
	  	}
    	let _self = this; 
    	let rows = $(_self.id + " tbody").find("tr");
    	//清空行内数据，否则每次改变列都会在原来基础上新加。
    	$(rows).children().remove();
    	if (rows==undefined || rows=="") {
    		layer.alert("请先确定行数");
    	} else{
    		//先判断head是否有特殊字段，比如date，select等
    		let hed = _self.getHead();
    		//执行中模板进来时，拿不到session。另做处理
			if(tem){
				hed = daty.head;
				rows = $(tem).find(_self.id+" tbody tr");
			}
//  		let perd = {}  
			if(hed){
				let heae = hed.split(";");
				for (let i=0;i<rows.length;i++) {
					
					for (let j=0;j<val;j++) {
						let hr;
						if(heae[j]){
							hr = heae[j].split(",");
						}
						hr = hr||[];
//						let hr = heae[j].split(",");
						switch (hr[2]){
							case "date":$(rows[i]).append('<td><input type="text" class="date"/></td>');
								break;
							case "select":$(rows[i]).append('<td><select></select></td>');
								break;
							case "checkbox":$(rows[i]).append('<td><input type="checkbox" class="date"/></td>');
								break;
							case "boolean":$(rows[i]).append('<td><select><option></option><option>true</option><option>false</option></select></td>');
								break;
							
							
							default:
								$(rows[i]).append('<td><input type="text"/></td>');
								break;
						}
					}
				}
			}
			//绑定input点击事件
			if(hed){  
				if (hed.indexOf("date")!=-1) {
					_self.setFormat("Y-m-d H:i");
				}
			}
    	}
    		
    		
    			_self.setPage();
    		
    		if(daty){
    			_self.setDisabled(daty.disabled);
    		}
    		
    }
	setPageIsHide(val) {
		let _self = this;
		if(val=="true") { //隐藏分页
			$(_self.id).find("nav").remove();
			$(_self.id).find("tr").show();
		} else { //显示分页
			_self.setPage(_self.pageNum);
		}
	}
	setOverflow(val){
		let _self = this;
		if(val){
			val = val.split(",");
			if(val.length>1){
				if(val[0]=="y"){
					$(_self.id).css("overflow-y", val[1]);
				}else if(val[0]=="x"){
					$(_self.id).css("overflow-x", val[1]);
				}	
			}else{
				$(_self.id).css("overflow", val[0]);
			}
		}
		
	}
/** *
•Title: setTableSelectData
•Description: 此方法是用于给table中的select添加数据，其中数据来源有手动输入，和后台返回。
•参数解释：
•index：数据放入那一列的select中（当有多列select时使用）。没有默认表格中第一个select
•name：需要的字段名列如[type,code]。第一个为<option>中显示的内容，其余的放在标签中，形如：<option data-code="code">。(只有map数据才会有)
•data：需要放入的数据.格式为：
•1string：'1,2;3,4;'*(字符串如果需要额外在标签上添加属性，属性名依次为"data-cu1,data-cu2,....")


•Copyright: Copyright (c) das.com 2018.9.27
•Company: DAS
•@author qianbaohua
•@version 0.8
**/
	setTableSelectData(index,name,data){
		if(name){
			setTableSelectDataForMap(index,name,data);
		}else{
			setTableSelectDataForString(index,data);
		}
	}
	//字符串格式
	setTableSelectDataForString(index,data){
		let _self = this;
		let list = data.split(";");
		let selcol=" ";
		list.forEach(function(v,i){
			if(v.indexOf(",")==-1){
				selcol = selcol + '<option>'+v+'</option>'
			}else{
				//需要放多个数据到option上面
				let vnm = v.split(",");
				let sx = "";
				for (let j=1;j<vnm.length;j++) {
					sx = sx+'data-cu'+j+'='+vnm[j]+' ';
				}
				selcol = selcol + '<option '+sx+'>'+vnm[0]+'</option>'
			}
		});
		//遍历每一行，把html放到对应地方。
		let rowdom = $(_self.id + " tbody tr");
		//获取第一行中第一个select位置
		let selone = $(rowdom[0]).find("select")[0];
		//根据第一个select获取到他的父级td所处的位置，就是列号。
		let colnum = $(selone).parent().index();
		index = index||colnum;
		for (let i=0;i<rowdom.length;i++) {
			$(rowdom[i]).find("td").eq(index).find("select").append(selcol);
		}
	}
	
	//api返回数据格式（map）
	setTableSelectDataForMap(index,name,data){
		let _self = this;
		let seldata = mode.resultParse(data);
		seldata = seldata.newVal;
		let selcol = " ";
		name= new Array(name);
		
		for (let j=0;j<seldata.length;j++) {
			let sx = " ";
			for (let k =0;k<name.length;k++) {
				sx = sx+'data-'+name[k]+'='+seldata[j][name[k]]+' ';
//				sx = sx + 'data-'+name[k]+'='+seldata[j]name[k];
			}
			selcol= selcol + '<option '+sx+'>'+seldata[j][name[0]]+'</option>';
		}
		
		//遍历每一行，把html放到对应地方。
		let rowdom = $(_self.id + " tbody tr");
		//获取第一行中第一个select位置
		let selone = $(rowdom[0]).find("select")[0];
		//根据第一个select获取到他的父级td所处的位置，就是列号。
		let colnum = $(selone).parent().index();
		index = index||colnum;
		for (let i=0;i<rowdom.length;i++) {
			$(rowdom[i]).find("td").eq(index).find("select").append(selcol);
		}
		
		
	}
	
		
	setRows(val, tem) {
		let _self = this;
		if(!val) {
			return false;
		}
		let rows = $(_self.id + " tbody").find("tr");
		let trRow = $(_self.id + " tbody");
		if(tem) {
			rows = $(tem).find(_self.id + " tbody tr");
			trRow = $( tem ).find(_self.id + " tbody");
		}
		if(rows == undefined || rows == "") {
			for(let i = 0; i < val; i++) {
				trRow.append('<tr></tr>');
			}
		} else {
		

			let rw = Math.abs(parseInt(val) - rows.length);
//				if (rw>0) {
//					setAddRow(rw);
//				} else{
//					
//				}
			for(let i = 0; i < rw; i++) {
				trRow.append('<tr></tr>');
			}
			
		}
	}
	
	deleteRow(val){
		let _self = this;
    	//删除html,row:删除选中行，checked：删除所有选中行
    	if(val=="checked"){
    		let trl = $(_self.id+" tbody tr");
    		let tr = [];
			for (let j=0;j<trl.length;j++) {
				let ckd = $(trl[j]).find("input").eq(0);
				if($(ckd).is(':checked')){
					tr.push($(trl[j]));
				}
			}
			tr.forEach(function(v,i){
				v.remove();
			});
    	}else if(val=="row"){
    		rglo.trdom.remove();
    	}
    	
    }
	emptyTable(type){
		let _self = this;
		if(type=="delete"){
			$(_self.id).find("tbody").children().remove();
		}else{
			$(_self.id).find("tbody input").val('');
		}
	
	}
	setAddRow(val) {
		let _self = this;
		let cols = $(_self.id + " tbody tr").eq(0).find("td");
		let rows = $(_self.id + " tbody tr").length;
		let seon = mode.local(_self.name);
		let head = seon.head;
		let td;
		let fomt = false;
		let dateFomt;
		if(head) {
			td = head.split(";");
		} else {
			td = cols;
		}

		for(let j = 0; j < val; j++) {
			win.trnum++;
			$(_self.id + " tbody").append('<tr class="add_' + win.trnum + '"></tr>');
			if(td != "" && td != undefined) {
				for(let i = 0; i < td.length; i++) {
					if(head) {
						let col = td[i].split(",");
						if(col[2] == "checkbox") {
							$(_self.id + " tbody tr").eq(rows + j).append('<td><input class="date" type="checkbox"></td>');

						} else if(col[2] == "date") {
							fomt = true;
							//把日期格式传参给日期函数
							dateFomt = col[4];
							$(_self.id + " tbody tr").eq(rows + j).append('<td><input class="date" type="text" value=""></td>');
						} else if(col[2] == "select") {
							$(_self.id + " tbody tr").eq(rows + j).append('<td><select class="sel_' + ij + '"></select></td>');
							//		    				let dom = ".sel_"+ij;
							//		    				_self.setOptions(tbdata[i][col[3]])
						}
						//2018/8/24新增隐藏列功能。
						else if(col[2] == "false") {
							$(_self.id + " tbody tr").eq(rows + j).append('<td style="display:none"><input type="text" value=""></td>');
						} else {
							$(_self.id + " tbody tr").eq(rows + j).append('<td><input type="text" value=""></td>');
						}
					} else {
						$(_self.id + " tbody tr").eq(rows + j).append('<td><input type="text"/></td>');
					}

				}
			}
		}
		let nlength = $(_self.id).find("nav").length;
	
			_self.setPage(seon.pageNum);
		
		
		if(fomt) {
			_self.setFormat();

		}
		_self.setDisabled(seon.disabled);
	}

	setFormat(val, type) {
		let _self = this;
		win.laydate.render({
		    elem: _self.id+" .date",
		    type: "yyyy-MM-dd"
		});
	}


	setPage(val) {
		let _self = this;
		if(_self.pageIsHide=="true"){
			return false;
		}
		val = val || 5
		$(_self.id).find("nav").remove();
		$(_self.id + ' tbody').paginathing({
			perPage: val,
			insertAfter: _self.id + ' .table',
			pageNumbers: true
		});
	}
	setPageNum(val){
		let _self = this;
		if(_self.pageIsHide!="true"){
			_self.setPage(val);
		}
		
	}
	
	getPageNum(){
		let _self = this;
//		let pn = mode.session(_self.name);
		return _self.pageNum;
	}
	getHead() {
		let _self = this;
//		let hed = mode.session(_self.name);
		return _self.head;
	}	
	getPageIsHide(){
		let _self = this;
		return _self.pageIsHide;
	}
	getOverflow(){
		let _self = this;
		return _self.overflow;
	}
	
	getData(dataType) {
		let _self = this;
		let data;
		//没有num表示获取选中行数据，num有具体数值表示获取第几列数据。num==all表示获取表格所有数据,num==checked表示获取选中数据（复选框）,num=="row"表示获取当前行数据.
		//num==[a,b,c]表示获取这三列所有数据。
			if(dataType=="checked"){
//				let headata = mode.session(_self.name);
				let headata = _self.head;	
				if(headata.head){
					let tbdata=[];
					
					headata = headata.head.split(";");						
					let trl = $(_self.id+" tbody tr");
					for (let j=0;j<trl.length;j++) {
						let trdata = {};
						let ckd = $(trl[j]).find("input").eq(0);
						if($(ckd).is(':checked')){
							let tdl = $(trl[j]).find("input");
							for (let k = 0; k < tdl.length; k++) {
								let hdl = headata[k].split(",");
								if(hdl[3]){
									trdata[hdl[3]] = $(tdl[k]).val();
								}
							}
							tbdata.push(trdata);
						}

					}
					data = tbdata;
				}
				
			}else if(dataType=="all"){
//				let headata = mode.session(_self.name);
				let headata = _self.head;
				if(headata.head){
					let tbdata=[];
					
					headata = headata.head.split(";");						
					let trl = $(_self.id+" tbody tr");
					for (let j=0;j<trl.length;j++) {
						let trdata = {};
						let tdl = $(trl[j]).find("input");
						for (let k = 0; k < tdl.length; k++) {
							let hdl = headata[k].split(",");
							if(hdl[3]){
								trdata[hdl[3]] = $(tdl[k]).val();
							}
						}
						tbdata.push(trdata);
						
						
					}
					data = tbdata;
				}
				
			}else if(dataType=="row"){
				let td = rglo.trdom.find("input");
				for (let i=0;i<td.length;i++) {
					if(i==0){
						data = td.eq(i).val()+",";
					}else{
						data = data+td.eq(i).val()+",";
					}
				}
			} else if($.isNumeric(dataType)){
				data = rglo.trdom.find("input").eq(dataType).val();							
			}else if($.isArray(dataType)){
				//先要找到对应字段在head中的位置，从而确定列的位置
//				let headata = mode.session(_self.name);
				let headata = _self.head;
				headata = headata.head.split(";");
//				let colnum = [];
				let colname = {};
				headata.forEach(function(v,i){
					had  = v.split(",");
					for (let j=0;j<dataType.length;ij++) {
						if(had[3]==dataType[j]){
							colname[had[3]] = i;
//							colnum.push(i);
//							colname.push(had[3]);
						}
					}
				});
				
				//循环表格，取对应列数据
				let chdata = [];
				let trl = $(_self.id+" tbody tr");
				for (let k=0;k<trl.length;k++) {
					let tdata = {}
					for(x in colname){
						let coldom = $(trl[k]).find("td").eq(colname[x]).find("input").val();
						tdata[x] = coldom;
					}
					
					chdata.push(tdata);
				}
				data = chdata;
				
				
				
			}
			else{
				//当num==""时表示直接获取表格所有数据，没有字段
				let trl = $(_self.id+" tbody tr");
				let tbdata=[];
				for (let j=0;j<trl.length;j++) {
					let trdata = [];
					let tdl = $(trl[j]).find("td");
					for (let k = 0; k < tdl.length; k++) {
						if(!$(tdl[k]).is(':visible')){
							let td = $(tdl[k]).find("input[type='text']").val();
							trdata.push(td);
						}								
					}
					tbdata.push(trdata);						
				}
				data = tbdata;
				
				
//				let gd = mode.session(_self.name);
//				data = gd.data;
			}

		return data;
	}

	getRows() {
		let _self = this;
		let row = $(_self.id + " tbody").find("tr");
		if(row == "" || row == undefined) {
			row = 0;
		} else {
			row = row.length;
		}
		return row;
	}

	getCols() {
		let _self = this;
		let col = $(_self.id + " tbody tr").eq(0).find("td");
		if(col == "" || col == undefined) {
			col = 0;
		} else {
			col = col.length;
		}
		return col;
	}

	setCustom() {
		let _self = this;
	}
	/**
	 * type:区分是行，列，单元格，表格。对应类型：row,col,cell,table
	 * index:需要编辑的行或列：形如，[1,2,3],全部操作为all
	 * trueofalse:true,false
	 * */
	setIsedit(type,index,trueofalse){
		let _self = this;
		if(type){
			if (type=="row") {
				_self.setRowIsedit(index,trueofalse);
			} else if(type=="col"){
				_self.setColIsedit(index,trueofalse);
			}else if(type=="cell"){
				_self.setCellIsedit(index,trueofalse);
			}else if(type=="table"){
				_self.setTablelIsedit(index,trueofalse);
			}
		}
	
		
	}
	//行是否可编辑
	setRowIsedit(index,trueofalse){
		let _self = this;
		let trdom = $(_self.id).find("tbody tr");
		trueofalse = trueofalse||false;
		if (index) {
			let rownum = new Array(index);
			for (let i=0;i<rownum.length;i++) {
				$(trdom).eq(rownum[i]).find("input").prop("readonly",trueofalse);
			}
		}
		
		
	}
	//列是否可编辑
	setColIsedit(index,trueofalse){
		let _self = this;
		let trdom = $(_self.id).find("tbody tr");
		trueofalse = trueofalse||false;
		if (index) {
			let colnum = new Array(index);
			for (let i=0;i<trdom.length;i++) {
				
				for (let j=0;j<colnum.length;j++) {
					$(trdom[i]).find("td").eq(colnum[j]).find("input").prop("readonly",trueofalse);
				}
				
			}	
		}
		
		
		
	}
	//单元格是否可编辑
	setCellIsedit(index,trueofalse){
		let _self = this;
		let trdom = $(_self.id).find("tbody tr");
		trueofalse = trueofalse||false;
		let cellnum = new Array(index);
		$(trdom).eq(cellnum[0]).find("td").eq(cellnum[1]).find("input").prop("readonly",trueofalse);
		
		
	}
	//表格格是否可编辑
	setTablelIsedit(index,trueofalse){
		let _self = this;		
		trueofalse = trueofalse||false;
		$(_self.id).find("tbody tr").find("input").prop("readonly",trueofalse);

		
	}
	
	
	
	setDisabled(val){
    	let _self = this;
	    let tf;
	    let type;
	    let tbcol;
	    if (val==undefined) {
	    	return false
	    }
		if(val.indexOf(";")==-1){
			tf = val;
//			_self.setDisabled(val);
		}else{
			let nvl = val.split(";");
			tf = nvl[0];
//			type = nvl[1];
			tbcol = nvl[1];
			
		}

    	
    	let pop;
    	if (tf=="true") {
    		pop = true;
    	}else{
    		pop = false;
    	}
//  	if(type=="input"||type==undefined){
//  		$(_self.id).find("input").prop("readonly",pop);
//  	}
//  	else{
    		if(tbcol=="all"){
    			$(_self.id).find("input").prop("readonly",pop);
    		}else{
    			if(tbcol.indexOf(",")==-1){
    				let tbtr = $(_self.id+" tbody").find("tr");
    				for (let i=0;i<tbtr.length;i++) {
    					$(tbtr[i]).find("td").eq(tbcol-0).children().prop("readonly",pop);
    				}
    			}else{
    				let tbtr = $(_self.id+" tbody").find("tr");
    				let tbtd = tbcol.split(",");
    				for (let i=0;i<tbtr.length;i++) {
    					for (let j=0;j<tbtd.length;j++) {
    						$(tbtr[i]).find("td").eq(tbtd[j]).children().prop("readonly",pop);
    					}
    				}
    			}
    			
    		}
//  	}
    }
	getDisabled(){
		let _self = this;
//		return _self.Disabled
	}
}