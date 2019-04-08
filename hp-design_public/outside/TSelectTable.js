class TSelectTableControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"176";
		this.height = posion.height||"25";
		this.head = posion.head||null;
		this.tableData = posion.tableData||null;
		this.tableWidth = posion.tableWidth||null;
		this.pageIsHide = posion.pageIsHide||null;
		this.clickVal = posion.clickVal||null;
		this.pageNum = posion.pageNum||"5";
		this.disabled = posion.disabled||null;
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
		_self.id = _self.id || "#TSelectTable_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TSelectTable_' + win.num + ' data-name="TSelectTable" id="' + divId + '" class="tselecttable"><div style="width:100%;height:100%"><input type = "text" style="height: 100%;width: 100%;"/><span style="position: absolute;right: 10px;top: 25%;font-size:12px"class="glyphicon glyphicon-chevron-down"></span></div>' +
			'<div class="selectTable" style="display:none;position:relative;width:30rem;height:30rem;border 1px solid #dddddd;overflow:scroll;background:#ffffff;"><table class="table table-bordered"><thead></thead><tbody></tbody></table></div>' +
			'</div>' +
			'');
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TSelectTable" class="tselecttable"><div style="width:100%;height:100%"><input type = "text" style="height: 100%;width: 100%;"/><span style="position: absolute;right: 10px;top: 25%;font-size:12px"class="glyphicon glyphicon-chevron-down"></span></div>' +
			'<div class="selectTable" style="display:none;position:relative;width:30rem;height:30rem;border 1px solid #dddddd;overflow:scroll;background:#ffffff;"><table class="table table-bordered"><thead></thead><tbody></tbody></table></div>' +
			'</div>';
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
//		let obj = mode.session(_self.name);
//		_self.id = _self.id;
//		_self.name = _self.name;
//		_self.pan = _self.rolecss;
		_self.plcUpView();
		_self.setHead(_self.head);
		_self.setTableData(_self.tableData);
		_self.setTableWidth(_self.tableWidth);
		_self.setPageNum(_self.pageNum);
		_self.setPageIsHide(_self.pageIsHide);
		_self.setDisabled(_self.disabled);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.head = "head";
		plcparam.properties.tableData = "tableData";
		plcparam.properties.tableWidth = "tableWidth";
		plcparam.properties.pageIsHide = "pageIsHide";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.focus = "focus";
		plcparam.properties.pageNum = "pageNum";
		plcparam.properties.clickVal = "clickVal";
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
	setHead(val) {
		//  	,,checkbox,;选择,,select,
		let _self = this;
		if(!val) {
			return false;
		}
		let head = val.split(";");
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


	setTableData(val) {
		let _self = this;
		if(val==""||val==undefined){
			return false;
		}else if($.isPlainObject(val)){
			_self.setDataForObj(val);
		}else if($.isArray(val)){
			_self.setDataForList(val);
		}else if(typeof val=="string"){
			val = eval(val);
			if($.isArray(val)){
				_self.setDataForList(val);
			}else{
				_self.setDataForObj(val);
			}
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
	
//		if(_self.disabled){
//			_self.setDisabled(_self.disabled);
//		}
	}
	//根据参数设置要传的参数，input中的值，并隐藏table	。两个参数param:用来传递的参数(放在data-param中)，val：input中要显示的值。
	setClickVal(param,val){
		
		
	}
	
	bingTrClick(){
		let _self = this;
		$(_self.id).on("click","tr",function(){
			if(_self.clickVal){
				let tdnum = _self.clickVal.split(",");
				let inp = $(this).find("td").eq(parseInt(tdnum[0])).find("input");
				let param;
				let val;
				if(inp.length==0){
					param = $(this).find("td").eq(parseInt(tdnum[0])).text();
					val = $(this).find("td").eq(parseInt(tdnum[1])).text();
				}else{
					param = $(this).find("td").eq(parseInt(tdnum[0])).find("input").val();
					val = $(this).find("td").eq(parseInt(tdnum[1])).find("input").val();
				}
				$(_self.id).find("input").val(val);
				$(_self.id).attr("data-param",param);
			}
			$(_self.id).children().eq(1).hide();
		});
		$(_self.id).find("tr").hover(function(){$(this).css("background","#3289c7")},function(){$(this).css("background","#ffffff")})
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
		if(_self.pageIsHide=="true") {
			_self.setPageIsHide(_self.pageIsHide);
		}else{
			_self.setPage(_self.pageNum);
			
		}
		 _self.bingTrClick();

	}
	
	
	setTableWidth(val) {
		let _self = this;
		$(_self.id).children().eq(1).width(val);
	}
	setPageNum(val){
		let _self = this;
		_self.setPage(val);
	}
	getClickVal(param,val){
		let _self = this;
		return _self.clickVal
	}
	getPageNum(){
		let _self = this;
//		let pn = mode.session(_self.name);
		return _self.pageNum;
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
	setPage(val){
    	let _self = this;
    	val=val||5
    	$(_self.id).find("nav").remove();
    	$(_self.id+' tbody').paginathing({
	      perPage: val,
	      insertAfter: _self.id+' .table',
	      pageNumbers: true
	    });
//	    $(_self.id+" nav").css("left",$(_self.id).width()/2)
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
	getDisabled() {
		let _self = this;
		return _self.disabled;
	}
	getHead() {
		let _self = this;
//		let hed = mode.session(_self.name);
		return _self.header;
	}

	getTableData() {
		let _self = this;
//		let gd = mode.session(_self.name);
		return _self.tableData;
	}

	getTableWidth() {
		let _self = this;
		let wd = $(_self.id).children().eq(1).width();
		return wd;
	}

	getPageIsHide() {
		let _self = this;
//		let hid = mode.session(_self.name);
		return _self.pageIsHide;
	}
	getPage (){
		
	}
	setCustom() {
		let _self = this;
		//点击出现表格
		$(_self.id+" span").on("click",function(e){
		$(this).parent().next().toggle();
		$(win.rootDom).find("div").removeClass("cked");
		$(_self.id).addClass("cked");
		_self.updataViewRight();
		_self.bindChangeEvent();
		_self.colorControl();
		gol.tree();
		e.stopPropagation();
		});	
		$(_self.id).children().eq(0).on("keyup","input",function(){
			let vl = $(this).val();
			$(_self.id+" table tbody tr").hide().filter(":contains('"+vl+"')").show();
		})
		
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
	

}