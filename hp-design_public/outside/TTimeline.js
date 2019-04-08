class TTimelineControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.width = posion.width || "300px";
		this.height = posion.height || "450";	
		this.posType = posion.posType || "absolute";
		this.overflow = posion.overflow || "scroll";
		this.data = posion.data || null;
//		this.timelineColor = posion.timelineColor || "#0099FF";
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
	}
	view() {
		let _self = this;
		_self.id = _self.id || "#TTimeline_" + Math.random().toString(36).substr(2);
		let divId = _self.id.replace("#", "");
		$(_self.parentId).append('<div name=TTimeline_' + win.num + ' data-name="TTimeline" id="' + divId + '" class="ttimeline">'
		+'<div class="timeline"><div class="timeline-item"><div class="timeline-triangle"></div><div class="timeline-content"></div>'
		+'</div></div></div>');
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
		let divId = _self.id.replace("#", "");		
		_self.viewHtml = '<div id="' + divId + '" data-name="TTimeline"  class="ttimeline">'
		+'<div class="timeline"><div class="timeline-item"><div class="timeline-triangle"></div><div class="timeline-content"></div>'
		+'</div></div></div>'
		_self.x = _self.getX();
		_self.y = _self.getY();
		_self.leftBorder = _self.getLeftBorder();
		_self.topBorder = _self.getTopBorder();
	}
	updataView() {
		let _self = this;
		_self.plcUpView();
		_self.setOverflow(_self.overflow);
		_self.setTimelineColor(_self.timelineColor);
		_self.setData(_self.data);
		
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();
		plcparam.properties.overflow = "overflow";
//		plcparam.properties.timelineColor = "timelineColor";
		plcparam.properties.data = "data";
		plcparam.eventList.click = "click";
		plcparam.eventList.dbclick = "dbclick";
		plcparam.eventList.rightClick = "rightClick";
		plcparam.eventList.mousedown = "mousedown";
		plcparam.eventList.mouseup = "mouseup";

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
					if(name == checked || name == "visible") {
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
	
	setCustom() {
		let _self = this;
	}
	//
	setData(val){
		let _self = this;
		if(val){
			$(_self.id).children().children().eq(0).siblings().remove();
			if(typeof val =="string"){
				val = JSON.parse(val);
			}			
			let lor = "";			
			for (let i=0;i<val.length;i++) {
				let ahtl = ""; 
				for (let j=0;j<val[i].name.length;j++) {
					let ndata = val[i].name[j];
					ahtl = ahtl +'<div class="mz" onclick=tlbaogao("'+ndata[0]+'")><a href="javascript:;">'+ndata[1]+'</a></div>';
				}
//				for (let item in val[i]) {
//					if(item!="date"){
//						
//						ahtl = ahtl +'<div class="mz" onclick=tlbaogao("'+val[i]["applyNo"]+'")><a href="javascript:;">'+val[i][item]+'</a></div>';
//					}
//					
//				}
				let chtml = "";
				if(ahtl){
					chtml = '<div class="timeline-item"><div class="timeline-icon"></div>'
					+'<div class="timeline-content '+lor+'"><p>'+val[i].date+'</p>'
					+ahtl
					+'</div></div>'
				}
				
				$(_self.id).children().append(chtml);
				if(!lor){
					lor = "right";
				}else{
					lor = "";
				}
			}
		}
	}
	setOverflow(val){
		let _self = this;
		$(_self.id).css("overflow-y",val);
	}
	setTimelineColor(val){
		let _self = this;
		$(_self.id +" .timeline:before").css("background",val);
		$(_self.id +" .timeline-icon").css("background",val);
		$(_self.id +" .timeline-triangle").css("border-color",val);
	}
	getData(){
		let _self = this;
		return _self.data
	}
	getOverflow(){
		let _self = this;
		return _self.overflow
	}
	getTimelineColor(){
		let _self = this;
		return _self.timelineColor
	}
}

