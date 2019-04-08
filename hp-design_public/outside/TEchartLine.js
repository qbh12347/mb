/** *
•Title: TEchartLineControl
•Description: 折线图
•Copyright: Copyright (c) das.com 2018.5.4
•Company: DAS
•@author qianbaohua
•@version 1.0
**/
class TEchartLineControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width||"300";
		this.height = posion.height||"200";
//		this.colors = posion.colors||null;
		this.title = posion.title||null;
		this.tooltip = posion.tooltip||null;
		this.grid = posion.grid||null;
		this.legendData = posion.legendData||null;
		this.xdata = posion.xdata||null;
		this.ydata = posion.ydata||null;
		this.sries = posion.sries||null;	
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
		_self.id = _self.id || "#TEchartLine_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TEchartLine_' + win.num + ' data-name="TEchartLine" class="techartline" id="' + divId + '"></div>');
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
		_self.viewHtml = '<div id="' + divId + '" data-name="TEchartLine" class="techartline"></div>'
//		_self.plcObjJson();
	}
	updataView() {
		let _self = this;
		_self.plcUpView();
		_self.setEchartLine(_self.title,_self.tooltip,_self.grid,_self.legendData,_self.xdata,_self.ydata,_self.sries);
//		_self.setTitle(_self.title);
//		_self.setLegendData(_self.legendData);
//		_self.setXdata(_self.xdata);
//		_self.setXshow(_self.xshow);
//		_self.setYshow(_self.yshow);
//		_self.setSeries(_self.series);
		
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
//		plcparam.properties.colors = "colors";
		plcparam.properties.title = "title";
		plcparam.properties.tooltip ="tooltip";
		plcparam.properties.grid = "grid";
		plcparam.properties.legendData = "legendData";
		plcparam.properties.xdata = "xdata";
		plcparam.properties.ydata = "ydata";
		plcparam.properties.sries = "sries";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.mouseup = "mouseup";
		plcparam.eventList.mouseover = "mouseover";
		plcparam.eventList.mouseout = "mouseout";
		plcparam.eventList.keydown = "keydown";
		plcparam.eventList.keyup = "keyup";

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
//2019/1/11修改折线图的通用方式
setEchartLine(title,tooltip,grid,legendData,xdata,ydata,sries){
	let _self = this;
	if(!xdata||!ydata||!sries){
		return false;
	}
//	typeof colors=="string"?colors=eval(colors):colors=colors;
	typeof title=="string"?title = eval('('+ title +')'):title = title;
	typeof tooltip=="string"?tooltip = eval('('+ tooltip +')'):tooltip = tooltip;
	typeof grid=="string"?grid = eval('('+ grid +')'):grid = grid;
	typeof legendData=="string"?legendData = eval('('+ legendData +')'):legendData = legendData;
	typeof xdata=="string"?xdata = eval('('+ xdata +')'):xdata = xdata;
	typeof ydata=="string"?ydata = eval('('+ ydata +')'):ydata = ydata;
	typeof sries=="string"?sries = eval(sries):sries = sries;
	
	//因为隐藏获取不到宽度
//	let pwd = ($("body").width()-20)*0.875;
//	$(_self.id).width(pwd);
	
	let myChart = echarts.init($(_self.id)[0]);
	let option = {
//	    color: colors,
	    title:title,
	    tooltip:tooltip,
	    grid: grid,
	    legend: legendData,
	    xAxis: xdata,
	    yAxis:ydata,
		series:sries
	
	};
	myChart.setOption(option);
}
	setColors(){
		
	}
	setTitle(){
		
	}
	setTooltip(){
		
	}
	setGrid(){
		
	}
	setLegendData(){
		
	}
	setXdata(){
		
	}
	setYdata(){
		
	}
	setSries(){
		
	}
	
	getColors(){
		let _self = this;
		return _self.colors
	}
	getTitle(){
		let _self = this;
		return _self.title;
	}
	getTooltip(){
		let _self = this;
		return _self.tooltip;
	}
	getGrid(){
		let _self = this;
		return _self.grid;
	}
	getLegendData(){
		let _self = this;
		return _self.legendData;
	}
	getXdata(){
		let _self = this;
		return _self.xdata;
	}
	getYdata(){
		let _self = this;
		return _self.ydata;
	}
	getSries(){
		let _self = this;
		return _self.sries;
	}
		
}
