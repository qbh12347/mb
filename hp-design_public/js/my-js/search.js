/** *
•Title: searchControl
•Description: 这是panel的类，其中有创建视图，事件监听等方法
•Copyright: Copyright (c) das.com 2018.7.25
•Company: DAS
•@author qianbaohua
•@version 0.8
**/
class TSearchControl extends publicFn {
		constructor(posion,id,name,pan) {
    	super(id,name,pan); // 调用父类的constructor()
    	this.posion = posion;
    	this.id=id;
    	this.name=name;
    	this.pan = pan;
  	}
	/*页面初始化入口*/
	init(){
		this.initPosition();       //初始化position里的部分数据
        this.view();                    //创建组件标签		
		this.objJson();                 //初始化组件json数据
		this.updataViewRight();         //更新右侧参数列表    
		this.bindChangeEvent();         //注册右侧参数变化监听
		this.colorControl();            //注册颜色选择插件
        this.drag();                     // 注册拖动插件
        this.bingBorder();
        this.bingMouseEvent()           //注册物件自定义编辑事件
        gol.addNode(this.posion);      //拖拽完成添加节点
	}
	initPosition(){              
		let _self = this;

		_self.posion.bgColor ="white";
//		_self.posion.type = "TSearch";
		_self.posion.posType = "absolute";
		_self.posion.height = "26px";
		//判断子组件
	    _self.posion = mode.comRelationship(_self.posion); 
	}
	/*页面还原入口*/
	render(){
		this.view();
		this.updataView();
		this.updataViewRight();		  
		this.drag();
		this.bingBorder();
		this.bindChangeEvent();
		this.colorControl();
		this.bingMouseEvent();
	}
	view(){
		let _self = this; 
		_self.posion.id = _self.posion.id||"#searh_"+Math.random().toString(36).substr(2);	
		$(_self.posion.parentId).append('<div name="TSearch_'+win.num+'" id='+_self.posion.id.replace("#","")+'>'
		+'<input type="text" style="width:100%;height:100%"/><span style="position: absolute;right: 0;width:30px;height:26px;text-align:center;line-height:26px" class="glyphicon glyphicon-search"></span>'
		
		+'</div>');
		$(_self.posion.id).css({"position":_self.posion.posType,"z-index":"100","left":_self.posion.left,"top":_self.posion.top,"width":_self.posion.width,"height":_self.posion.height});		
		$(win.rootDom).find("div").removeClass("cked");
		$(_self.posion.id).addClass("cked");
	}
	
	updataView(){
		let _self = this;
		let obj = mode.session(_self.posion.name);
		_self.id=_self.posion.id;
		_self.name=_self.posion.name;
		_self.pan=_self.posion.rolecss;
		//根据input高度，设置搜索图标行高
		$(_self.id).find("span").css("line-height",_self.posion.height);
		_self.setCursor(obj.cursor);
		
	}
	objJson(){
		let _self = this;
		
		_self.id=_self.posion.id;
		_self.name=$(_self.posion.id).attr("name");
		win.name = _self.name;
		_self.pan=_self.posion.rolecss;
		_self.posion.viewHtml = '<div id='+_self.posion.id.replace("#","")+'>'
		+'<input type="text" style="width:100%"/><span style="position: absolute;right: 0;width:30px;height:26px;text-align:center;line-height:26px" class="glyphicon glyphicon-search"></span>'
		
		+'</div>'
//		_self.posion.lineHeight = _self.getLineHeight();
//		_self.posion.textAlign = _self.getTextAlign();

		_self.plcObjJson();

	}
	
	updataViewRight(){
		let _self = this;
//		let obj = mode.session(_self.posion.name);
		win.dom = _self.posion.id;
		win.name = _self.posion.name;
		let right = new search();        //创建右侧参数列表html；
//		right.htm();
		right.addHtm();
		let inpt = $(".c-right tbody").find("input");
		for (let i=0;i<inpt.length;i++) {
			let name = inpt.eq(i).attr("data-type");
			switch (name){
				case "width":
				inpt.eq(i).val(_self.getWidth());
					break;
				case "height":
				inpt.eq(i).val(_self.getHeight());
					break;
				case "zIndex":
				inpt.eq(i).val(_self.getZindex());
					break;	
				case "visible":
				inpt.eq(i).prop("checked",_self.getVisible());
					break;
				case "fontSize":
				inpt.eq(i).val(_self.getFontSize());
					break;	
				case "fontFamily":
				inpt.eq(i).val(_self.getFontFamily());
					break;
				case "fontStyle":
				inpt.eq(i).val(_self.getFontStyle());
					break;
				case "fontColor":
				inpt.eq(i).css("background-color",_self.getFontColor());
					break;	
				case "bgColor":
				inpt.eq(i).css("background-color",_self.getBgColor());
					break;	
				case "border":
				inpt.eq(i).val(_self.getBorder());
					break;	
				case "name":
				inpt.eq(i).val(_self.getName());
					break;	
				case "controlClassName":
				inpt.eq(i).val(_self.getClassName());
					break;
				case "margin":
				inpt.eq(i).val(_self.getMargin());
					break;	
				case "order":
				inpt.eq(i).val(_self.getOrder());
					break;
				case "flex":
				inpt.eq(i).val(_self.getFlex());
					break;
				case "alignSelf":
				inpt.eq(i).val(_self.getAlignSelf());
					break;	
				case "tips":
					let tip = _self.getTips();
//					inpt.eq(i).val(tip.replace("<br/>",","));
					if (tip!=undefined && tip!="") {
						inpt.eq(i).val(tip.replace("<br/>",","));
					}				
					break;	
				case "textAlign":
				inpt.eq(i).val(_self.getTextAlign());
					break;
				case "lineHeight":
				inpt.eq(i).val(_self.getLineHeight());
					break;
				case "X":
				inpt.eq(i).val(_self.getLeft());
					break;
				case "Y":
				inpt.eq(i).val(_self.getTop());
					break;
				case "setContent":
				inpt.eq(i).val(_self.getContent());
					break;	
						
				default:
					break;
			}
		
		}
	}
	
	bindChangeEvent(){
		let _self = this;		
		$(".c-right input").off("change");  //先删除以前绑定的事件，重新绑定。
		$(".c-right button").off("click");
		$(".c-right input").on("change",function(){
			let type = $(this).attr("data-type");			
			let val;
			type == "visible"?val = $(this).prop("checked"):val = $(this).val();
			_self.rightChangeEvent(type,val);
		});
		//编辑器弹出
		$(".c-right button").on("click",function(){	
			let eventType = $(this).attr("data-type");
			_self.layerCli(eventType,_self.posion.name);
		});	
		//点击查询按钮
		$(_self.posion.id).find("span").click(function(e){
			if (_self.posion.searchCli!=undefined) {
				eval(_self.posion.searchCli);
			}
			e.stopPropagation();
		});
		
	}
	//绑定鼠标键盘对应事件
	bingMouseEvent(){
		let time = null;
		let _self = this;
		let obj;
		$(_self.posion.id).on({
			click:function(e){
				obj = mode.session(_self.posion.name);
				clearTimeout(time);                           //解决单双击冲突问题
				time = setTimeout(function(){
				if (obj.click!=undefined && obj.click!="") {
					new Function(obj.click)();
				}	
				},300);
//				e.stopPropagation();
			},
			dblclick:function(e){
				obj = mode.session(_self.posion.name);
				clearTimeout(time);
				if (obj.dblclick!=undefined && obj.dblclick!="") {
					new Function(obj.dblclick)();
				}
//				e.stopPropagation();
			},
			mousedown:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mousedown!=undefined && obj.mousedown!="") {
					new Function(obj.mousedown)();
				}
				//右击事件
				if (obj.rightClick!=undefined && obj.rightClick!="") {
					if (3==e.which) {
						new Function(obj.rightClick)();
					}
				}
//				e.stopPropagation();
			},
			mouseup:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mouseup!=undefined && obj.mouseup!="") {
					new Function(obj.mouseup)();
				}
//				e.stopPropagation();
			},
			mouseover:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mouseover!=undefined && obj.mouseover!="") {
					new Function(obj.mouseover)();
				}
				//判断tips是否存在，存在要添加事件
				if (obj.tips!="" && obj.tips!=undefined) {
					new Function('layer.tips("<span style=color:#000>'+obj.tips+'</span>", "'+obj.id+'",{tips:[3,"#fff"]})')()
				}
//				e.stopPropagation();
			},
			mouseout:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mouseout!=undefined && obj.mouseout!="") {
					new Function(obj.mouseout)();
				}
//				e.stopPropagation();
			},
			mouseenter:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mouseenter!=undefined && obj.mouseenter!="") {
					new Function(obj.mouseenter)();
				}
//				e.stopPropagation();
			},
			mouseleave:function(e){
				obj = mode.session(_self.posion.name);
				if (obj.mouseleave!=undefined && obj.mouseleave!="") {
					new Function(obj.mouseleave)();
				}
//				e.stopPropagation();
			}
			
		});
		//禁止右击事件
		　$(_self.posion.id).delegate(obj,'contextmenu', function (e) {
		　　　　e.preventDefault();
		　});
	}
		
}