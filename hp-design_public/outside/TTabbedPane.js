class TTabbedPaneControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"300";
		this.height = posion.height||"300";
		this.pDescribe = posion.pDescribe||"no";
		this.tabType = posion.tabType||"layui-tab";
		this.allowClose = posion.allowClose||null;
		this.tabAdd = posion.tabAdd||"";
		this.tabTitle = posion.tabTitle||"首页;项目";
		
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
		_self.id = _self.id || "#TTabbedPane_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div id="'+divId+'" name=TTabbedPane_' + win.num + ' data-name="TTabbedPane"  lay-filter= "'+divId+'">'
		+'<ul class="layui-tab-title"> </ul> <div class="layui-tab-content"></div></div>');
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
		_self.id = _self.id;
		_self.name = $(_self.id).attr("name");
//		win.name = _self.name;
		_self.x = _self.getX();
		_self.y=_self.getY(); 
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
//		_self.pan = _self.rolecss;
		let divId = _self.id.replace("#", "");
		_self.viewHtml = '<div id="' + divId + '" data-name="TTabbedPane" lay-filter= "'+divId+'">'
						 +'<ul class="layui-tab-title"> </ul> <div class="layui-tab-content"></div></div>'
	}
	updataView() { 
		let _self = this;
		_self.plcUpView();
		_self.setAllowClose(_self.allowClose);
		_self.setTabType(_self.tabType);
		_self.setTabTitle(_self.tabTitle);
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();		
		plcparam.properties.tabType = "tabType";
		plcparam.properties.allowClose = "allowClose";
		plcparam.properties.tabTitle = "tabTitle";
		plcparam.eventList.tabClick = "tabClick";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";
		//2018/9/14新增
//		let tite = _self.tabTitle.split(";"); 	
//			tite.forEach(function(v,i){
//				if (v.indexOf(",")!=-1) {
//					plcparam.eventList["item"+i] = "item"+i;
//				}
//			});
				
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
	/**
	 * 修改原因：以前的控件写法不好。
	 * 修改时间：2018/12/29
	 * 修改内容：重做此控件
	 * */
	setTabType(val){
		let _self = this;
		$(_self.id).removeClass();
		$(_self.id).addClass(val);
		if(val=="layui-tab layui-tab-brief"){
			$(_self.id).attr("lay-filter","docDemoTabBrief");
		}
	}
	setAllowClose(val){
		let _self = this;
		$(_self.id).attr("lay-allowClose",val);
	}
	
	setTabAdd(title,html){
		let _self = this;
		let name=$(_self.id).attr("lay-filter");
		
		win.element.tabAdd(name, {
		  title: title,
		  content: html //支持传入html
//		  id: 
		}); 
		
	}
	
	setTabTitle(val){
		let _self = this;
		$(_self.id).children().eq(0).find("li").remove();
		if(val != undefined && val != "") {
			let title = val.split(";");
			let divLength = $(_self.id).children().eq(1).children().length;
			title.forEach(function(v, i) {
				let name = v;
//				if(v.indexOf(",")!=-1){
//					v = v.split(",");
//					name = v[0];	
//					if(!type){
//						$(".c-right .r-bottom tbody").append('<tr><td>item'+i+'</td><td><button type="button" data-type="item'+i+'" class="btn btn-primary">editCode</button></td></tr>');
//					}
//				}
				if(i == 0) {
					$(_self.id).children().eq(0).append('<li class="layui-this">' + name + '</li>');
				} else {
					$(_self.id).children().eq(0).append('<li>' + name + '</li>');
				}
				if(i > divLength - 1) {
					let oldId = _self.id.replace("#runTime ","");
					if(i == 0) {
						$(_self.id).children().eq(1).append('<div class="layui-tab-item layui-show" id="' + oldId.replace("#", "") + i + '"></div>');
					} else {
						$(_self.id).children().eq(1).append('<div class="layui-tab-item" id="' + oldId.replace("#", "") + i + '"></div>');
					}

				}
			});
//			$(_self.id).children().eq(1).children().eq(0).show().siblings().hide();
//			$(_self.id).children().eq(1).css("height", "100%");
			_self.setCustom()
		}
		
	}
	
	
	setCustom() {
		let _self = this;
		$(_self.id).children().eq(0).find("li").off("click");
		$(_self.id).children().eq(0).on("click","li", function() {
			$(this).addClass("layui-this").siblings().removeClass("layui-this");
			$(_self.id).children().eq(1).children().eq($(this).index()).addClass("layui-show").siblings().removeClass("layui-show");

		});
//		win.element.render(_self.id);
//		  win.element.on(_self.id, function(data){
//		    console.log(data);
//		  });
	}
	
	//调用html模板
	setTabTemplate(name,targetId){
		rglo.stringJs = '';
		rglo.newComponent ="";
		rglo.init = "";
		rglo.temData = "";
		let _self = this;
		let dandang = daSearch(name);
		let nId;
		if(targetId.indexOf("#")!=-1){
			nId = "#" + $("#runTime "+targetId).children().eq(1).children("div:last").attr("id");
			if(!nId){
				let cusid = "tbdiv_" + Math.random().toString(36).substr(2)
				$("#runTime "+targetId).children().eq(1).children("div:last").attr("id",cusid);
				nId = "#"+cusid
			}
		}

		dandang[0].parentComponent = nId;
		dandang[0].parentId = nId;
		dandang[0].posType = "relative";
		dandang[0].left = 0;
		dandang[0].top = 0;
		dandang[0].width = "100%";
		dandang[0].height = "100%";
		runTime(dandang,'',nId);
		creatScript();
	
	}
	
		//清除html模板.name:要清除的标签名，target：标签的最外层id
	delTemplate(target,name){
		let title = $("#runTime div[name="+target+"]").children().eq(0).find("li");
		for (let i=0;i<title.length;i++) {
			let ttext = $(title[i]).text();
			if(ttext==name){
				$(title[i]).remove();
				$("#runTime div[name="+target+"]").children().eq(1).children().eq(i).remove();
			}
		}
	}
	getTabType(){
		let _self = this;
		return _self.tabType;
	}
	getAllowClose(){
		let _self = this;
		return _self.allowClose;
	}
	getCloseBtn(){
		let _self = this;
		return _self.closeBtn;
	}
	getTabTitle(){
		let _self = this;
		return _self.tabTitle;
	}
	
}
