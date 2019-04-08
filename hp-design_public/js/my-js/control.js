/**************************************全局变量start*************************************/
const win = {};           //存储全局变量
win.num = 1;              //计数器，每创建一个控件，计数器就会+1，从而保证每个控件id的唯一性。
win.maxNum = 0;           //这是最大的num，用于还原时在最大计数器上继续累加，不会和前面id重复。
win.dom;                  //当前选中控件的id，删除等功能会用到。
//win.name;                 //当前选中控件的name，删除等功能会用到。
win.treeDom;              //控件树的id，用于区分控件树，和普通树。（控件树会有特殊操作）
win.rootDom=".c-drg";     //默认的html插入最外层dom。
win.treeNum=0;            //专案树计数器。确保每个专案树都有不同id
//win.trDom;                //当前选中的行（主要用于table中行的删除）
win.trnum = 0;            //用于runtime时，表格新增行id
win.treeNode;             //专案点击树节点获得当前节点数据
win.treeId;               //专案点击树节点根的节点 
win.upOrAdd;              //单档区分新增和更新
win.beanName ={};         //运行时通过这里面的beanName加载js文件（beanName来自于选择接口时）
win.stringJs;             //页面上生成的js
win.moreChecked=[]        //所有被选中的控件，多选功能使用。
win.jsUrl;                //页面中的js文件路径，主要用于导出时 ，同时会根据这里增加控件（每次新增一个目录，会同时新增component和里面的控件）
win.copy=[];              //用于复制粘贴
win._self;                //用于颜色选择插件（颜色选择器会出现对象混乱）;
win.editor;               //用于右侧控件事件弹出框中代码提示；
win.customJs;             //用于新增js文件中代码提示
let actionStack = [];     //redo undo使用
let actionStackPointer = 0;//redo undo使用 
//layer应用相关
win.laydate;               //TDatefield控件使用的日期插件引入.
layui.use('laydate', function(){
win.laydate = layui.laydate;
})
let layer;                   //控制弹出层
layui.use('layer', function(){ 
layer = layui.layer; 
});
win.element;                 //控制TTabbedpane选项卡
layui.use('element', function(){
   win.element = layui.element;
});
//360视图使用全局变量
let diag = [];
/**************************************全局变量end*************************************/
 //拖动事件
	function drgComponent(){
     $( ".list-drg" ).draggable({ 
     	opacity: 0.7, 
     	helper: "clone",
     	drag: function(e, t) {
//      t.helper.width(50);        
       },
        stop: function(e,t) {
		/*
		 *第一次修改
		 *修改时间：2018/8/31
		 *修改原因：代码优化
		 *修改内容：动态调用控件类（原来通过if判断调用）
		 *第二次修改
		 *修改时间：2019/1/15
		 *修改原因：不能实现自定义combo
		 *修改内容：增加自定义combo判断。
		 * */
		let type = t.helper.attr("data-type");
		let posion = {};
        win.num = win.num+1;
        //x,y用于计算父子关系
		posion.x = e.clientX+$(".c-out").scrollLeft();
		posion.y = e.clientY+$(".c-out").scrollTop();		
		//top，left用于组件css定位
		posion.top = t.offset.top;
		posion.left = t.offset.left;
		if(type=="customCombo"){
			//查询单档,去掉最外层，计算父子关系，改变name，id等属性，确保唯一性。
			win.num++
			let customJson= daSearch(win.treeId+"-component-"+t.helper.text());
			customJson = customJson[0].children;
			posion = mode.comRelationship(posion);
			customJson[0].parentId = posion.parentId;
			customJson[0].parentComponent = posion.parentComponent;
			customJson[0].left = posion.left;
			customJson[0].top = posion.top;
			customJson[0].posType = posion.posType;
			customJson[0].x = posion.x;
			customJson[0].y = posion.y;
			customJson[0].zIndex = 20;
//			customJson[0].id = "#"+customJson[0].type + "_" + Math.random().toString(36).substr(2);
//			customJson[0].name = customJson[0].type + "_" + win.num;
			let ndata = customAttributeChange(customJson);
			gol.res(ndata)
			gol.addNode(ndata[0]);
//			console.log(ndata)
			
		}else{	
			posion.type = type;
			eval('let claName = new '+type+'Control(posion); claName.init();');
		}
		
      }
     });
 }
 
 /**
  * Title：修改自定义控件id，name等
  * name：customAttributeChange
  *	time:2019/1/15
  * 
  * */
 
 function customAttributeChange(data,id){	
 	for (let i=0;i<data.length;i++) {
 		win.num++
 		let oldId = data[i].id.replace("#","");
 		data[i].id = "#"+data[i].type + "_" + Math.random().toString(36).substr(2);
 		data[i].name = data[i].type + "_" + win.num;
 		let nId = data[i].id.replace("#","");
 		data[i].viewHtml = data[i].viewHtml.replace(new RegExp(oldId,'g'),nId);
 		if(id){
 			data[i].parentId = id;
 		}
 		
 		if(data[i].children){ 			
 			customAttributeChange(data[i].children,data[i].id);
 		}
 	}
 	return data;
 }
 
/**
•Title: publicFn
•Description: 此类中是公共方法
•Copyright: Copyright (c) das.com 2018
•Company: DAS
•@author qianbaohua
•@version 0.8
•参数，val:值（比如宽高等）
•组件的宽高等作用在外层div，而不是让外层根据里面的内容自适应变化的原因：
•使用flexlayout后，物件宽高会自动根flex的宽高一样，只能去掉flex的宽高解决。
•但是flex宽高去掉后没法判断子组件，因为子组件的判断是通过父组件范围来确定 
 */

class publicFn{
	constructor(poin) {
		this.id = poin.id||null;                     //id
		this.name = poin.name||null;                 //name
		this.pan = poin.pan||null;                   //作用标签
		this.float = poin.float||null;               //浮动
		this.parentId = poin.parentId||null;         //父级id(html结构上的父级)
		this.parentComponent=poin.parentComponent||null;  //父级id（数据上的父级，与parentId有可能相同，也有可能不同）
		this.pDescribe = poin.pDescribe||null;       //tabpane相关描述
		this.fontSize=poin.fontSize||"1.4rem";       //字体大小
		this.fontColor=poin.fontColor||null;         //字体颜色
		this.bgColor=poin.bgColor||null;             //背景色
		this.fontFamily=poin.fontFamily||null;       //字体风格
		this.fontStyle=poin.fontStyle||null;         //字体样式
		this.fontWeight=poin.fontWeight||"normal";       //字体粗细
//		this.className=poin.className||null;         //控制类名
		this.text=poin.text||null;                   //文本内容
		this.cmAttribute=poin.cmAttribute||null;     //自定义属性
		this.visible=poin.visible||null;             //可见性
		this.border=poin.border||null;               //边框
		this.tips=poin.tips||null;                   //提示tips
		this.posType=poin.posType||"absolute";       //定位方式  
//		this.top=poin.top||null;                     //顶部
		this.bottom=poin.bottom||null;               //底部
		this.zIndex=poin.zIndex||10;                 //z-index
		this.type = poin.type||null;                 //类型
		this.x=poin.x||null;                         //X
		this.y=poin.y||null;                         //Y
		this.left=poin.left||null;                   //left
		this.top=poin.top||null;                     //top
		this.leftBorder = poin.leftBorder||null;     //左侧范围
		this.topBorder = poin.topBorder||null;       //顶部范围
		this.textAlign=poin.textAlign||"start";      //对齐方式
		this.lineHeight=poin.lineHeight||null;       //行高
		this.cursor=poin.cursor||null;               //鼠标形状
//		this.paramsCode=poin.paramsCode||null;       //baform增删查改传参代码
		this.margin=poin.margin||null;               //外边距 
		this.padding=poin.padding||null;             //内边距 
		this.float=poin.float||null;                 //浮动
		this.order=poin.order||null;                 //项目的排列顺序
		this.flex=poin.flex||null;                   //flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto 
		this.alignSelf=poin.alignSelf||null;         //lf属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。
		
		
	}
	/*************************************setStart**********************************/
//	onEvent(eventName, callback){
//		let _self = this;
//		this.handles = this.handles||{};
//     if(!this.handles[eventName]){
//          this.handles[eventName]=[];
//     }
//     this.handles[eventName].push(callback);
//	}
//	valueChange(eventName){
//		let _self = this;
//		if(this.handles[arguments[0]]){
//         for(var i=0;i<this.handles[arguments[0]].length;i++){
//             this.handles[arguments[0]][i](arguments[1]);
//         }
//     }
//	
//	}
	
	
	
	
	
	setWidth(val){
		let _self = this;
		$(_self.id).css("width",val);
	}
	setHeight(val){
		let _self = this;
		$(_self.id).css("height",val);
	}
	setClassName(val){
		let _self = this;
		
		$(_self.id).attr("class",val);
	}
	setName(val){
		let _self = this;
//		let count = "tree_2";
//		let zTree = $.fn.zTree.getZTreeObj(count);
//		//获取当前选中的节点
//		let nodes = zTree.getSelectedNodes();
//		if (nodes.length == 0) {
//			layer.alert("请先选择一个节点");
//			return;
//		}else{
//			nodes[0].name = val;
//			zTree.updateNode(nodes[0]);
//		}
			
		$(_self.id).attr("name",val);
	}
	setId(){
		let _self = this;
	}
	//type是用在模态框中，因为模态框是在modal中打开，不是在runtime中。
	setVisible(val){
		let _self = this;
		
		val?$(_self.id).hide():$(_self.id).show();
//		$(_self.id).css("display",val);
	}
	setHtml(val){
		let _self = this;
		$(_self.id).html(val);
	}
	setTips(val){
		let _self = this;
		if(val){
			$(_self.id).attr("title",_self.tips);
		}
//		if(val!=""&&val!=undefined){
//		$(_self.id).on("mouseover",function(){
//			new Function('layer.tips("<span style=color:#000>'+_self.posion.tips+'</span>", "'+_self.id+'",{tips:[3,"#fff"]})')()
//		});
//		}
	}
	setZIndex(val){
		let _self = this;
		$(_self.id).css("z-index",val);
	}
	setPosition(val){
		let _self = this;
		$(_self.id).css("position",val);
	}
	setPosType(val){
		let _self = this;
		$(_self.id).css("position",val);
	}
	
	setLeft(val){
		let _self = this;
		$(_self.id).css("left",val);
//		_self.setX(val);
	}
	setX(val){
//		let _self = this;
//		$(_self.id).css("left",val);
	}
	setTop(val){
		let _self = this;
//		_self.setY(val);
		$(_self.id).css("top",val);
	}
	setBottom(val){
		if(!val){
			return false;
		}
		let _self = this;
		$(_self.id).css({"bottom":val,"top":"auto"});
	}
	setY(val){
		let _self = this;
//		$(_self.id).css("top",val);
	}
	setMargin(val){
		let _self = this;
		$(_self.id).css("margin",val);
	}
	setPadding(val){
		let _self = this;
		$(_self.id).css("padding",val);
	}
	setLineHeight(val){
		let _self = this;
		$(_self.id).css("line-height",val);
	}
	setTextAlign(val){
		let _self = this;
		if (_self.id.indexOf("TTable")!=-1) {
			$(_self.id).find("table tbody tr td").css("text-align",val);
		} else{
			$(_self.id).css("text-align",val);
		}
		
	}
	setFloat(val){
		if(!val){
			return false;
		}
		let _self = this;
		$(_self.id).css({"position":"auto","top":"auto","left":"auto","float":val});
	}
//	setRight(){
//		let _self = this;
//		$(_self.id).css("right",val);
//	}
//	setPageNum(val){
//		let _self = this;
//		_self.setPage(val);
//	}	
	setCursor(val){
		let _self = this;
		if(_self.pan){
			$(_self.id).find(_self.pan).css("cursor",val);
		}else{
			$(_self.id).css("cursor",val);
		}
		
	}

	setText(val,result){
		let _self = this;
		//如果是panel设置此属性无效。
	 	if (_self.id.indexOf("panel")!=-1||val ==undefined) {
			return false;
		}
		if(_self.pan){
			//判断类型，有val和text两种。
			if (_self.pan=="input"||_self.pan=="textarea"||_self.pan=="select") {
				$(_self.id).find(_self.pan).val(val);
			}else{
			//判断是否为模板数据
			if (val.indexOf("{")!=-1) {
				if (!rglo.temData) {
					//如果val是字符串直接使用，否则要解析
					if (result) {
						let vl = result.param[0].value.content;
						if(!vl){
							vl = result.param[0].value;
						}else{
							vl = result.param[0].value.content[0]
						}
						let ds = val.match(/{(\S*)}/)[1];
						$(_self.id).find(_self.pan).text(vl[ds]);
						
					} else{
						$(_self.id).find(_self.pan).text(val);
					}
					
				}else{
					//动态数据，没有模板
					if (rglo.custom) {
						let dy = val.match(/{(\S*)}/)[1];
						$("div[name='"+_self.name+"']").find(_self.pan).text(rglo.custom[dy]);	
					} else{
						let dy = val.match(/{(\S*)}/)[1];
						//2018/9/18由于_self.id中都加了#runtime在这里需要去掉
//						let temid = _self.id.replace("#runTime","");
						$("div[name='"+rglo.temData.pname+"'] div[name='"+_self.name+"']").find(_self.pan).text(rglo.temData[dy]);
					}
					
					
//					let dy = val.match(/{(\S*)}/)[1];
//					$("div[name='"+rglo.temData.pname+"']").find(_self.id).find(_self.pan).text(rglo.temData[dy]);
				}
				
			} else{
//				if(_self.pan=="button"){
//					$(_self.id).find("span").text(val);
//				}else{
					$(_self.id).find(_self.pan).text(val);
//				}
				
			}
		}	
			
		}else{
			if (_self.id.indexOf("TTextField")||_self.id.indexOf("TSelectTable")||_self.id.indexOf("TTextarea")) {
				$(_self.id).find("input").val(val);
			}else{
				if(_self.id.indexOf("TRadioButton")||_self.id.indexOf("TPanel")||_self.id.indexOf("TTablePane")||_self.id.indexOf("TForm")){
					return false;
				}else{
					$(_self.id).text(val);
				}
				
			}
		}
	}
//	setVal(val){
//		let _self = this;
//		if(_self.pan){
//			$(_self.id).find(_self.pan).val(val);
//		}else{
//			$(_self.id).val(val);
//		}
//	}
	setFontSize(val){
		let _self = this;
//		if(_self.pan){
//			$(_self.id).find(_self.pan).css("font-size",val);
//		}else{
			$(_self.id).css("font-size",val);
			if(_self.imgName){
				$(_self.id).find("i").css("font-size",val);
			}
//		}
	}
	setFontFamily(val){
		let _self = this;
		if(_self.pan){
			$(_self.id).find(_self.pan).css("font-family",val);
		}else{
			$(_self.id).css("font-family",val);
		}		
	}
	setFontStyle(val){
		let _self = this;
		if(_self.pan){
			$(_self.id).find(_self.pan).css("font-style",val);
		}else{
			$(_self.id).css("font-style",val);
		}		
	}
	setFontWeight(val){
		let _self = this;
		if(_self.pan){
			$(_self.id).find(_self.pan).css("font-weight",val);
		}else{
			$(_self.id).css("font-weight",val);
		}
	}
	setOrder(val){
		let _self = this;
		if(_self.type!="TFlowLayout"){
			if(_self.pan){
				$(_self.id).find(_self.pan).css("order",val);
			}else{
				$(_self.id).css("order",val);
			}
	
		}

	}
	setFlex(val){
		let _self = this;
		if(_self.type!="TFlowLayout"){
//			if (_self.pan) {
//				$(_self.id).find(_self.pan).css("flex",val);
//			}else{
				$(_self.id).css("flex",val);
//			}	
		}		
	}
	setAlignSelf(val){
		let _self = this;
		if(_self.type!="TFlowLayout"){
			if (_self.pan) {
				$(_self.id).find(_self.pan).css("align-self",val);
			}else{
				$(_self.id).css("align-self",val);
			}	
		}		
	}
	setBgColor(val){ 
		let _self = this;
		if(_self.pan){
			if (_self.pan=="label") {
				$(_self.id).css("background-color",val);
			} else{
				$(_self.id).find(_self.pan).css("background-color",val);
			}
			
		}else{
			$(_self.id).css("background-color",val);
		}
	}
	
	setFontColor(val){
		let _self = this;
		if(_self.pan){
			$(_self.id).find(_self.pan).css("color",val);
		}else{
			$(_self.id).css("color",val);
		}
	}
	
	//border存在只要左边框，或有边框等操作。格式为：left，right；1px solid red
	
	setBorder(val){
		let _self = this;
		if(val && val.indexOf(";")!=-1){
			$(_self.id).css("border","none");
			let brty = val.split(";");
			if(brty[0].indexOf(",")!=-1){
				let type = brty[0].split(",");
				for (let i=0;i<type.length;i++) {
					if(type[i]=="left"){
						$(_self.id).css("border-left",brty[1]);
					}
					if(type[i]=="right"){
						$(_self.id).css("border-right",brty[1]);
					}
					if(type[i]=="top"){
						$(_self.id).css("border-top",brty[1]);
					}
					if(type[i]=="bottom"){
						$(_self.id).css("border-bottom",brty[1]);
					}
				}
			}else{
				switch (brty[0]){
					case "left":$(_self.id).css("border-left",brty[1]);
						break;
					case "right":$(_self.id).css("border-right",brty[1]);
						break;
					case "top":$(_self.id).css("border-top",brty[1]);
						break;
					case "bottom":$(_self.id).css("border-bottom",brty[1]);
						break;	
					default:
						break;
				}
			}
			
		}else{
			$(_self.id).css("border",val);
		}
//		if(_self.pan){
//			$(_self.id).find(_self.pan).css("border",val);
//		}else{
//			$(_self.id).css("border",val);
//		}
	}
//	setSiblings(val){
//		let _self = this;
//		$(_self.id).siblings().css("background-color",val);
//	}
//	setIskey(val){
//		let _self = this;
//		_self.posion.iskey = val;
//		mode.session(_self.name,_self.posion);
//		if (val) {
//			win.keypanel = _self.id;
//		}
//		
////	}
//	setParamsCode(val){
//		let _self = this;
//		_self.posion.paramsCode = val;
//		mode.session(_self.name,_self.posion);
//	}
	//根据数据设置模板,name:模板单档名。target：插入位置div名。val：每次复制几份。
	setTemplate(name,target,val){
		rglo.stringJs = '';
		rglo.newComponent = "";
		rglo.init = "";
		let _self = this;
//		$("div[name='"+target+"']").children().remove();
		$("#runTime "+"div[name='"+target+"']").children().remove();
		//根据val类型区分模板，比如是combo模板，还是一般的循环模板
		let type = typeof val;
		
		if (type=="number") {
			if(val==1){
				let dandang = daSearch(name);
				let nId;			
				nId = "#runTime #" + $("div[name="+target+"]").attr("id");

				dandang[0].parentComponent = nId;
				dandang[0].parentId = nId;
				dandang[0].posType = "relative";
				dandang[0].left = 0;
				dandang[0].top = 0;
				dandang[0].width = "100%";
				dandang[0].height = "100%";
				runTime(dandang,'',nId);
			}else{
				for (let i=0;i<val;i++) {
					let xx = "cu_"+Math.random().toString(36).substr(2);
					olddata[0].name = olddata[0].name+"_"+xx;
					
					//置空rglo.pid主要是因为pid主要用于baseform，这里是防止影响到模板。
					rglo.pid = "";
					runTime(olddata,'','#runTime',olddata[0].parentId);
				}
			}	
		} else{
			let olddata = _self.getTemplate(name,target);
			let result = mode.resultParse(val);
			let newVal = result.newVal;
			let type = result.type;             //数据类型，不同的数据类型有不同的解析方式
			//由于数据类型不同，需要不同的解析方式
			if(type=="PageEntity"){
				if(newVal.content){
					newVal = newVal.content;
				}
			}
			
//			if(data.beanType=="ArrayList"){
////				rglo.temData = newVal[i].val;
//				type = "ArrayList";
//				newVal = data.value;
//			}else if(data.beanType=="JavaBean"){
//				if(data.beanName=="PageEntity"){
//					type = "pageList";
//					newVal = data.value.content;
//				}else if(data.beanName=="LinkedList"){
//					type = "pageList";
//					newVal = data.value;
//				}
//			}
			for (let i=0;i<newVal.length;i++) {
				let xx = "cu_"+Math.random().toString(36).substr(2);
				olddata[0].name = xx;
//				newVal[i].pname = olddata[0].name;
				rglo.pid = "";
				switch (type){
					case "ArrayList":
					newVal[i].value.pname = olddata[0].name;
					rglo.temData = newVal[i].value;					
						break;
					case "pageList":
					newVal[i].pname = olddata[0].name;
					rglo.temData = newVal[i];
						break;
					case "PageEntity":
					newVal[i].pname = olddata[0].name;
					rglo.temData = newVal[i];
						break;	
					default:
						break;
				}
				
//				rglo.temData = val[i];	
				runTime(olddata,'','#runTime',olddata[0].parentId);
			}
//			creatScriptTwo();
		}
		creatScript(true);
	}
	//根据条件新增内容
//	addTemplate(name,target,val){
//		rglo.stringJs = '';
//		let _self = this;
////		$("#runTime "+"div[name='"+target+"']").children().remove();
//		//根据val类型区分模板，比如是combo模板，还是一般的循环模板
//		let type = typeof val;
//		let olddata = _self.getTemplate(name,target);
//		if (type=="number") {	
//			for (let i=0;i<val;i++) {
//				let xx = Math.random().toString(36).substr(2);
//				olddata[0].name = olddata[0].name+"_"+xx;
//				
//				//置空rglo.pid主要是因为pid主要用于baseform，这里是防止影响到模板。
//				rglo.pid = "";
//				runTime(olddata,'',"#runTime",olddata[0].name);
//			}
//		}
//	
//	}

//	setCmAttribute(val){
//		let _self = this;
//		_self.cmAttribute = val;
		
		
//	}
	
	//新增2018.7.27
	//如果只有val，表示新增一个空白tab，名称是newtab。如果liname不是undefined，则名称是liname。如果divcon不是undefined，说明有内容，要查询单档。并放入新增的div中。
//	setAddList(val,liname,divcon){
//		let _self = this;
//		//获取li数量，用于后面确定id不重复
//		let lilen = $(_self.id).children().eq(0).find("li").length+1;
//		let liwidth = $(_self.id).children().eq(0).find("ul").width();
//		let name = "newtab";
//		
//		if (liname!=undefined) {
//			name = liname;
//		}
//		for (let i=0;i<val;i++) {
//			liwidth = liwidth+102;
//			lilen = lilen+i;
//			$(_self.id).children().eq(0).find("ul").append('<li>'+name+'</li>');
//			$(_self.id).children().eq(1).append('<div name=parent_'+lilen+' class=parent_'+lilen+'></div>');
//		}
//		//新增加的为选中状态，且显示，其他隐藏。
//		$(_self.id).children().eq(0).find("ul").children("li").eq(lilen-1).addClass("act").siblings().removeClass();
//		$(_self.id).children().eq(1).children().eq(lilen-1).show().siblings().hide();
//		let target = ".parent_"+lilen;
//		if (divcon!=undefined) {
//			let zadata = daSearch(divcon);
//			zadata = zadata[0].children;
//			zadata[0].parentId = target;
//			zadata[0].posType = "relative";
//			runTime(zadata,target,target.replace(".",""));
//		}
//		//ul列表宽度超出换行
//		let wd = $(_self.id).width();
//		if(liwidth>wd){
//			$(_self.id).children().eq(0).find("ul").css("max-width",wd);
//		}else{
//			$(_self.id).children().eq(0).find("ul").width(liwidth);
//		}
//		
//		
//	}
	
//	setDelList(val){
//		//val会是一个组件的name，根据这个找到选中的项，然后删除
//		let lis = $("div[name='"+val+"']").children().eq(0).find("li");
//		for (let i=0;i<lis.length;i++) {
//			if ($(lis[i]).hasClass("act")) {
//				lis[i].remove();
//				$("div[name='"+val+"']").children().eq(1).children().eq(i).remove();
//				break;
//			}
//		}
//		
//	}
	
//  setActiveColor(val){
//  	let _self = this;
//  	document.body.style.setProperty('--actBgColor',val);
//  }
	
//	setLayoutAddRows(val){
//		let _self = this;
//		let cols = $(_self.id + " tbody tr").eq(0).find("td").length;
//		for (let i=0;i<val;i++) {
//			$(_self.id + " tbody").append('<tr id="tr'+i+'"></tr>');
//			let trl = $(_self.id + " tbody tr");
//			let rlength = $(_self.id + " tbody tr");
//			if (cols!=0) {
//				for (let j=0;j<cols;j++) {
//					trl.eq(trl.length-1).append('<td id="tr'+i+'_'+j+'"></td>');
//				}
//			}
//		}
//	
//	}
	
	/*************************************setEnd**********************************/
		
	/*************************************getStart**********************************/
	getWidth(){
		let _self = this;
		return $(_self.id).css("width");
		
	}
	getHeight(){
		let _self = this;
		return $(_self.id).css("height");
	}
	getClassName(){
		let _self = this;
//		let cla = $(_self.id).attr("class");
		return $(_self.id).attr("class");
	}
	getName(gn,tsef){
		let _self = this;
		let cn = gn||"name"
		if (tsef) {
			return $(tsef).attr(cn);
		}else{
			return $(_self.id).attr(cn);
		}
		
	}
	getId(){
		let _self = this;
		return _self.id;
	}
	getVisible(){
		let _self = this;
		let isShowOrHide = $(_self.id).css("display");//判断页面上元素是否隐藏
	    isShowOrHide=="none"?_self.visible = true:_self.visible = false;
		return _self.visible;
	}
	getTips(){
		let _self = this;
//		let tip = mode.session(_self.name);		
		return _self.tips;
	}
	getZIndex(){
		let _self = this;
		return $(_self.id).css("z-index");
	}
	getPosition(){
		let _self = this;
		return $(_self.id).css("position");
	}
	getLeft(){
		let _self = this;
		return $(_self.id).css("left");
	}
	getTop(){
		let _self = this;
		return $(_self.id).css("top");
	}
	getBottom(){
		let _self = this;
		return $(_self.id).css("bottom");
	}
	getX(){
		let _self = this;
		return $(_self.id).offset().left +$(".c-out").scrollLeft();
	}
	getY(){
		let _self = this;
		let y = $(_self.id).offset().top  +$(".c-out").scrollTop();
		return y;
	}
	getLeftBorder(){
		let _self = this;
		//如果初始化没有width，会出现undefined
		if(_self.width){
		//tfrom获取width方式不同		
		if(_self.width.indexOf("%")!=-1){
			return $(_self.id).width()+_self.x+6;			
		}else{
			return parseInt(_self.width)+_self.x+6;
		}
		}
	}
	getTopBorder(){
		let _self = this;
		if(_self.height){
		if(_self.height.indexOf("%")!=-1){
			return $(_self.id).height()+_self.y+3;
		}else {
			return parseInt(_self.height)+_self.y+3;
		}
	}	
	}
	getCursor(){
		let _self = this;
		return $(_self.id).css("cursor");
	}
//	getRight(){
//		let _self = this;
//		return $(_self.id).css("right");
//	}
	
	getMargin(){
		let _self = this;
		return $(_self.id).css("margin");
	}
	getPadding(){
		let _self = this;
		return $(_self.id).css("padding");
	}
	getLineHeight(){
		let _self = this;
		return $(_self.id).css("line-height");
	}
	getTextAlign(){
		let _self = this;
		if (_self.id.indexOf("TTable")!=-1) {
			return $(_self.id).find("table tbody tr td").css("text-align");
		} else{
			return $(_self.id).css("text-align");
		}
	
	}		
	getFloat(){
		let _self = this;
		return $(_self.id).css("float");
	}
	
	
	
	getBorder(){
		let _self = this;
//		if(_self.pan){
//			return $(_self.id).find(_self.pan).css("border");
//		}else{
			return _self.border;
//		}
	}
	getText(){
		let _self = this;
//		let text = $(_self.id).text();
//		if (_self.id.indexOf("panel")!=-1) {
			
//			return false;
//		}
		
		if(_self.pan){
			if (_self.pan=="input"||_self.pan=="textarea"||_self.pan=="select") {
				return $(_self.id).find(_self.pan).val();
			}else{
				
				return $(_self.id).find(_self.pan).text();
			}
			
		}else{
			if (_self.id.indexOf("TSelectTable")||_self.indexOf("TTextarea")||_self.pan=="TSelect") {
				return $(_self.id).val();
			}else{
				return $(_self.id).text();
			}
			
		}
	}
//	getVal(){
//		let _self = this;
//		if(_self.pan){
//			return $(_self.id).find(_self.pan).val();
//		}else{
//			return $(_self.id).val();
//		}
//	}
	getFontSize(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("font-size");
		}else{
			return $(_self.id).css("font-size");
		}
	}
	getFontFamily(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("font-family");
		}else{
			return $(_self.id).css("font-family");
		}
	}
	getFontStyle(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("font-style");
		}else{
			return $(_self.id).css("font-style");
		}
	}
	getFontWeight(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("font-weight");
		}else{
			return $(_self.id).css("font-weight");
		}
	}
	getOrder(){
		let _self = this;
		if(_self.type!="TFlowLayout"){
			if(_self.pan){
				return $(_self.id).find(_self.pan).css("order");
			}else{
				return $(_self.id).css("order");
			}
		}
	}
	getFlex(){
		let _self = this;
		if(_self.type!="TFlowLayout"){
			if (_self.pan) {
				return $(_self.id).find(_self.pan).css("flex");
			} else{
				return $(_self.id).css("flex");
			}
		}
	}
	getAlignSelf(){
		let _self = this;
		if(_self.type!="TFlowLayout"){
			
			if (_self.pan) {
				return $(_self.id).find(_self.pan).css("align-self");
			} else{
				return $(_self.id).css("align-self");
			}
		}
	}
	getBgColor(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("background-color");
		}else{
			return $(_self.id).css("background-color");
		}
	}
	getFontColor(){
		let _self = this;
		if(_self.pan){
			return $(_self.id).find(_self.pan).css("color");
		}else{
			return $(_self.id).css("color");
		}
	}

	getParamsCode(){
		let _self = this;
//		let cd = mode.session(_self.name);
		return _self.paramsCode
	}
	getTemplate(name,target){
		if(!rglo.template[name]){        //模板不存在
			//根据名称获取到目标id,修改时间：2018/10/16.修改原因：不能从树结构中取目标节点id，原因是导出后，这么做是无效的。
//			let zTree = $.fn.zTree.getZTreeObj("baseTree");
//			let tarData = zTree.getNodeByParam("name",target);			
//			let tarid = tarData.id;
//			let tarid = "#runTime "+tarData.id;
//			$(tarid).html("");
			let tarid = "#"+$("div[name='"+target+"']").attr("id");
			let dandang = daSearch(name);
			let data = dandang[0].children;
			data[0].parentComponent = tarid;
			data[0].parentId = tarid;
			data[0].posType = "relative";
			data[0].left = 0;
			data[0].top = 0;
			rglo.template[name] = data;
		}
		//当页面内部跳转时，可能会没有form，所以无法再runtime中给rglo.formId赋值，所以在这里赋值一次，确保js有地方加载。
		rglo.formId = rglo.template[name][0].parentId;
		return rglo.template[name];
	}
	getPosType(){
		let _self = this;
		_self.getPosition();
	}
	
	getCmAttribute(){
		let _self = this;
//		let tbr = mode.session(_self.name);
		return _self.cmAttribute;
	}
	setCmAttribute (){
		
	}
	/*************************************getEnd**********************************/
	//非set，get的其他公用方法
	//模板删除.参数name是要删除的组件name.
	//一级一级的往上找，直到在父级name找到对应name，执行删除。
//	delTemplate(name,dom){
//		let pdom = dom.parents();
//		
//		for (let i=0;i<pdom.length;i++) {
//			if ($(pdom[i]).attr("name").indexOf(name)!=-1) {
//				pdom[i].remove();
//				break;
//			}
//		}
//	}
	
	setToggle(target){
		$("#runTime div[name="+target+"]").toggle();
	}
	/*************************************publicFn(物件公共方法) Start**********************************/	
	
	//点击弹出编码窗口
	layerCli(eventType){
		$(".teareabtn").val('');
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		var nodes = zTree.getSelectedNodes();
		
		
		layer.open({
	    type: 1,
	    title:eventType,
	    id:'vevent',
	    zIndex:9, 
	    shade : 0,
	    maxmin: true,
	    offset:'rb',
	    area: ['500px', '400px'],
//		    content: '<textarea id="testmain" class="teareabtn"></textarea><div class="tearea"><button onclick="new Function(alert('+aa+'))();" type="button" class="btn btn-warning">运行测试</button><button onclick="layerSave()" type="button" class="btn btn-success">保存</button></div>'
	    content:$('.runtest'),
	    success:function(){
	    	//解决编辑窗口放大后高度问题
	    	$("#vevent").height("90%");
		    if(eventType.indexOf("item")!=-1){
		    	if(nodes[0].item){
		    		nodes[0].item[eventType]==undefined?win.editor.getValue():win.editor.setValue(nodes[0].item[eventType]);
		    	}
		    	
		    }else if(eventType.indexOf("menu")!=-1){
		    	if(nodes[0].menu){
		    		nodes[0].menu[eventType]==undefined?win.editor.getValue():win.editor.setValue(nodes[0].menu[eventType]);
		    	}
		    }else if(eventType.indexOf("btn")!=-1){
		    	if(nodes[0].btn){
		    		nodes[0].btn[eventType]==undefined?win.editor.getValue():win.editor.setValue(nodes[0].btn[eventType]);
		    	}
		    }else{
		    	nodes[0][eventType]==undefined?win.editor.getValue():win.editor.setValue(nodes[0][eventType]);
		    }
//				eval('nodes[0][eventType]==undefined?$(".teareabtn").val(""):$(".teareabtn").val(nodes[0][eventType]);');
		    

	    }
		});
	}
	
	//颜色控件,修改原因：1.会出现选择这个控件，改变的却是那个控件（解决：win._self），2.想要改变的是背景色，结果改变的是字体颜色（解决：input:focus）
	colorControl(){
		let _self = this
		let type;
		$('.selectColor').colpick({
			layout:'hex',
			onBeforeShow:function(){
				type = $(".c-right").find(":focus").attr("data-type");
				console.log(type);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				_self = win._self;
				_self.undo();
				hex = '#'+hex;				
				$(".c-right input[data-type="+type+"]").css('background-color',hex);
				eval('_self.'+type+' = hex');
				let fname = type.replace(/\s[a-z]/g, function($1) {
					return $1.toLocaleUpperCase()
				}).replace(/^[a-z]/, function($1) {
					return $1.toLocaleUpperCase()
				});
				eval('_self.set'+fname+'(hex)');
				_self.updateNodeData(type,hex);
				_self.redo();
				$(el).colpickHide();
				
			}
		});
	}
	//当参数变化后，更新节点数据。其中type并不一定只有一个，可能会有多个，因为有些属性变化时会影响到其他属性，所以要一起改变。
	updateNodeData(type){
		let _self = this;
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		//判断zTree是否存在，当form进来时会出现控件树为空，获取不到选中节点。
		if(zTree){

			let nodes = zTree.getSelectedNodes();
			if (typeof type=="string") {
				nodes[0][type] = _self[type];
		
			} else{
				for (let x in type) {
					nodes[0][x] = _self[x];
				}
			}
			zTree.updateNode(nodes[0]); 	
		}	
	}
	
	//参数改变事件
	//valtype用于text中区别类型，比如tree，textfield。
	rightChangeEvent(type,val,cval){
		let _self = this;
		if(type=="width"){
			//由于redo，undo功能，先要拿到改变前的数据，再拿改变后的数据。
			//undo数据
			_self.undo();
			
			_self.width = val;
			_self.setWidth(val);
			//不拿父级宽度x百分比得到自己宽度的原因是，父级去掉选中框后会比原来多出6个像素宽度，这时候得到的结果会出现自己比父级宽度还大。
			_self.leftBorder = $(_self.id).width()+$(_self.id).offset().left+$(".c-out").scrollLeft();
			_self.x= _self.getX();
			_self.y= _self.getY();
			let tmap = {};
			tmap.width = _self.width;
			tmap.leftBorder = _self.leftBorder;
			tmap.x = _self.x;
			tmap.y = _self.y;
			_self.updateNodeData(tmap);
			
			_self.redo();
		}else if(type=="height"){
			_self.undo();
			_self.height = val;
			_self.setHeight(val);
			_self.topBorder = $(_self.id).height()+$(_self.id).offset().top+$(".c-out").scrollTop();			
			_self.x= _self.getX();
			_self.y= _self.getY();
			
			//高度变化时，line-height要做相应变化，例如select，search等会用到
			if(_self.type=="TSelect" || _self.type=="TSearch"){
				if (_self.height.indexOf("px")==-1) {
					_self.height = _self.height+"px";
				}
				$(_self.id).find("span").css({"line-height":_self.height,"height":_self.height})
			}
			let tmap = {};
			tmap.height = _self.height;
			tmap.topBorder = _self.topBorder;
			tmap.x = _self.x;
			tmap.y = _self.y;
			_self.updateNodeData(tmap);
			_self.redo();
		}else if(type=="text"){
			_self.undo();
			_self.text = val;
			if(_self.id.indexOf("tree")!=-1){
				let count = _self.id.replace("#","")+"0";
	//					count = "tree_"+count;
				let zTree = $.fn.zTree.getZTreeObj(count);
				//获取当前选中的节点
				let nodes = zTree.getSelectedNodes();
	//					let treeNode = nodes[0];
				if (nodes.length == 0) {
					layer.alert("请先选择一个节点");
					return;
				}else{
					nodes[0].name = val;
					zTree.updateNode(nodes[0]);
				}
			}else{
//				mode.session(_self.name,_self.posion);
				_self.setText(val);
				_self.updateNodeData(type,val);
			}
			_self.redo();
		}
//		else if(type=="name"){
//			let count = "baseTree";
//			let zTree = $.fn.zTree.getZTreeObj(count);
//			//获取当前选中的节点
//			let nodes = zTree.getSelectedNodes();
//			if (nodes.length == 0) {
//				layer.alert("请先选择一个节点");
//				return;
//			}else{
//				nodes[0].name = val;
//				zTree.updateNode(nodes[0]);
//			}
//			sessionStorage.removeItem(_self.posion.name); 
//			_self.posion.name = val;
//			_self.name = val;
//			mode.session(_self.name,_self.posion);
//			_self.setName(val);
//		}
		else if(type=="flex"){
			_self.undo();
			_self.flex = val;				
			_self.setFlex(val);
			_self.width = _self.getWidth();
			//减去6个像素原因是当为1,1，auto时，会自动填满，会有6个像素差。
			_self.leftBorder = _self.getX()+ parseFloat(_self.width.replace("px",''))-6;
			let tmap = {};
			tmap.width = _self.width;
			tmap.leftBorder = _self.leftBorder;
			tmap.flex = val;
			_self.updateNodeData(tmap,val);
			_self.redo();
		}else if(type=="tips"){
			_self.undo();
			let content = val.replace(",","<br/>");
			_self.tips = content;
			_self.updateNodeData(type,val);
			_self.redo();
		}else if(type=="checked"){
			_self.undo();
			_self.checked = cval;
			_self.setChecked(_self.checked);
			_self.updateNodeData(type,val);
			_self.redo();
		}else if(type=="X"){
			_self.undo();
			_self.left = val;
			_self.setLeft(val);
			_self.leftBorder = $(_self.id).width()+$(_self.id).offset().left;
			let tmap = {};
			tmap.left = _self.left;
			tmap.leftBorder = _self.leftBorder;
			_self.updateNodeData(tmap,val);
			_self.redo();
			
		}else if(type=="Y"){
			_self.undo();
			_self.top = val;
			_self.setTop(val);
			_self.topBorder = $(_self.id).height()+$(_self.id).offset().top;
			let tmap = {};
			tmap.top = _self.top;
			tmap.topBorder = _self.topBorder;
			_self.updateNodeData(tmap,val);
			_self.redo();
		}else if(type=="bgImgUrl"){
			_self.undo();
			if(val.indexOf("url") == -1) {
				_self.bgImgUrl = "url("+win.baseUrl+"img/" + val + ")";

			} else {
				_self.bgImgUrl = val;
				
			}
			_self.setBgImgUrl(_self.bgImgUrl);
			_self.updateNodeData(type,val);
			_self.redo();
		}else if(type=="pressImgUrl"){
			_self.undo();
			if(val.indexOf("url") == -1) {
				_self.pressImgUrl = "url("+win.baseUrl+"img/" + val + ")";

			} else {
				_self.pressImgUrl = val;
				
			}
			_self.setPressImgUrl(_self.pressImgUrl);
			_self.updateNodeData(type,val);
			_self.redo();
		}else if(type=="releaseImgUrl"){
			_self.undo();
			if(val.indexOf("url") == -1) {
				_self.releaseImgUrl = "url("+win.baseUrl+"img/" + val + ")";

			} else {
				_self.releaseImgUrl = val;
				
			}
			_self.setReleaseImgUrl(_self.releaseImgUrl);
			_self.updateNodeData(type,val);
			_self.redo();
		}else{
			_self.undo();
			eval('_self.'+type+' = val;');
			let fname = type.replace(/\s[a-z]/g, function($1) {
				return $1.toLocaleUpperCase()
			}).replace(/^[a-z]/, function($1) {
				return $1.toLocaleUpperCase()
			});
			
			eval('_self.set'+fname+'(val)');
			_self.updateNodeData(type,val);
			_self.redo();
		}

	}
	//移动事件
	drag(){
		let _self = this;
		$(_self.id).draggable({
			containment: _self.parentId,
			scroll: false,
			// reundo	拖拉组件reundo	@lijunwei	start
          start: function(e,t) {
				_self.top = t.position.top; 
				_self.left = t.position.left;
				_self.x = t.offset.left + $(".c-out").scrollLeft();
			    _self.y = t.offset.top + $(".c-out").scrollTop();
			    _self.leftBorder = $(_self.id).width()+_self.x;
				_self.topBorder = $(_self.id).height()+_self.y;
				_self.undo();
				
          },
			stop: function(e,t) {
				win.moreChecked = [];
            	_self.top = t.position.top; 
				_self.left = t.position.left;
				_self.x = t.offset.left + $(".c-out").scrollLeft();
			    _self.y = t.offset.top + $(".c-out").scrollTop();
			    //直接拿数据中的宽高是带单位的，所以这里自己获取
			    _self.leftBorder = $(_self.id).width()+_self.x;
				_self.topBorder = $(_self.id).height()+_self.y;
				let tmap = {};
				tmap.top = _self.top;
				tmap.left = _self.left;
				tmap.x = _self.x;
				tmap.y = _self.y;
				tmap.leftBorder = _self.leftBorder;
				tmap.topBorder = _self.topBorder;
				gol.tree();
				_self.updateNodeData(tmap);
				
				_self.redo();
                
                
				$(win.rootDom).find("div").removeClass("cked");	
		        t.helper.addClass("cked");						
				_self.updataViewRight();
				_self.bindChangeEvent();
				_self.colorControl();
	      }
		});
	}
	/*****************************************reundo相关start**************************************/
	execActionPointer(type){	// 不填参数为默认操作移动指针，0：undo移动指针	1：redo移动指针
		actionStackPointer ++;
        actionStack.length = actionStackPointer;
	}
	
	// 复制一个单层对象
	copySimpleLevelObj(obj){
		let _posion = JSON.stringify(obj);
		_posion = JSON.parse(_posion);
		return _posion;
	}
	  // 设置组件的位置
	updatePosition(){
		let _self = this;
		_self.setLeft(_self.left);
		_self.setTop(_self.top);
	}
	//下一步
	redo(){
        let _self = this;
        let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let nodes = zTree.getNodeByParam("id",_self.id);
        actionStack[actionStackPointer].redo = _self.copySimpleLevelObj(nodes);
		actionStackPointer ++;
	}
//	上一步
	undo(){
        let _self = this;
//      actionStackPointer ++;
        let myData = {};
        let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let nodes = zTree.getNodeByParam("id",_self.id);
        
		myData.undo = _self.copySimpleLevelObj(nodes);
        actionStack[actionStackPointer] = myData;
        
	}
	pushAction(){
	    let _this = this;	    
	    let ndom = _this.copySimpleLevelObj(_this);	   
        actionStack[actionStackPointer] = ndom;
        actionStackPointer ++;
	}
	
	reundoStackSave(){
		let _this = this;
	    let ndom = _this.copySimpleLevelObj(_this);
	    actionStackPointer ++;
        actionStack[actionStackPointer] = ndom;
	}
	
	
	
	
	
	
	/*****************************************reundo相关end**************************************/
	//点击事件，点击触发选中。
	/**
	 * 修改原因：由于多选功能，执行完mousedown后还会来执行click事件，所以需要禁止这里的click
	 * 修改时间：2018/9/11
	 * 修改内容：新增ctrlKey判断，判断是否按下atrl健，以区别是多选，还是单选。并且单选时清空多选数组中数据。
	 * */
	bingBorder(id){
	let _self = this;
//	let sot = false;
//	$(_self.id).attr("tabindex",0);
	$(_self.id).on({
		mousedown:function(e){
			//ctrl+鼠标左键,多选功能。2018/9/11
			if(e.ctrlKey && e.buttons == 1){					
				win.moreChecked.push(_self);
				return false;
			}
		},
		click:function(e){
			if(this.id.indexOf("TTable")==-1 && this.id.indexOf("TMobileDateField")==-1 && this.id.indexOf("TDateField")==-1 && this.id.indexOf("TDateField")==-1 && this.id.indexOf("TTextField")==-1 && this.id.indexOf("TPassWordField")==-1&& this.id.indexOf("TSelect")==-1){
				$(".c-drg").focus();
			}
			
//			$(_self.id).focus();
			if(e.ctrlKey){
			$(this).addClass("cked");
			}else{
				$(win.rootDom).find("div").removeClass("cked");
				$(this).addClass("cked");
				win.moreChecked = [];
				_self.updataViewRight();
				_self.bindChangeEvent();
				_self.colorControl();
				gol.tree();
				
			}
			e.stopPropagation();	
		}
		});
	}

	//还原时更新视图公共事件
	plcUpView(obj){
		let _self = this;
		_self.setWidth(_self.width);
		_self.setHeight(_self.height);
		_self.setPosType(_self.posType);
		_self.setLeft(_self.left);
		_self.setTop(_self.top);
		_self.setBottom(_self.bottom);
		_self.setText(_self.text);
		_self.setClassName(_self.className);
		_self.setName(_self.name);
		_self.setVisible(_self.visible);
		_self.setTips(_self.tips);
		_self.setMargin(_self.margin);
		_self.setPadding(_self.padding);
		_self.setLineHeight(_self.lineHeight);
		_self.setTextAlign(_self.textAlign);
		_self.setFontSize(_self.fontSize);
		_self.setFontFamily(_self.fontFamily);
		_self.setFontStyle(_self.fontStyle);
		_self.setFontWeight(_self.fontWeight);
		_self.setOrder(_self.order);
		_self.setFlex(_self.flex);
		_self.setAlignSelf(_self.alignSelf);
		_self.setCursor(_self.cursor);
		_self.setZIndex(_self.zIndex);
		_self.setBorder(_self.border);
		_self.setBgColor(_self.bgColor);
		_self.setFontColor(_self.fontColor);
		_self.setFloat(_self.float);
		
	}
	
	
	//更新右侧参数列表公共事件
	plcUpdataRight(name,inpt){
		switch (name){
			case "width":
			inpt.eq(i).val(_self.getWidth());
				break;
			case "height":
			inpt.eq(i).val(_self.getHeight());
				break;					
			case "visible":
			inpt.eq(i).prop("checked",_self.getVisible());
				break;
			case "zIndex":
			inpt.eq(i).val(_self.getZIndex());
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
			case "name":
			inpt.eq(i).val(_self.getName());								
				break;	
			case "className":
			inpt.eq(i).val(_self.getClassName());
				break;
			case "fontColor":
			inpt.eq(i).css("background-color",_self.getFontColor());
				break;	
			case "bgColor":
			inpt.eq(i).css("background-color",_self.getBgColor());
				break;	
			case "margin":
			inpt.eq(i).val(_self.getMargin());
				break;
			case "padding":
			inpt.eq(i).val(_self.getPadding());
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
		
				
			default:
				break;
		}
	}
	//右侧公共参数
	paramHtml(){
		let _self = this;
		const paramCss= {
			"properties":{
				"name":"name",             //名称
				"id":"id",                 //id
				"width":"width",           //宽度
				"height":"height",         //高度
				"fontSize":"fontSize",     //字体大小
				"fontColor":"fontColor",   //字体颜色
				"bgColor":"bgColor",       //背景色
				"fontFamily":"fontFamily", //字体风格
				"fontStyle":"fontStyle",   //字体样式
				"fontWeight":"fontWeight", //字体粗细
				"className":"className",   //控制类名
				"text":"text",             //文本内容
				"cmAttribute":"cmAttribute",//自定义属性
				"visible":"visible",       //可见性
				"border":"border",         //边框
				"tips":"tips",             //提示tips
				"posType":"posType",       //定位方式  
				"top":"top",               //顶部	
				"bottom":"bottom",         //底部
				"left":"left",             //左侧
				"zIndex":"zIndex",         //z-index
//				"X":"X",                   //X
//				"Y":"Y",                   //Y
				
				"textAlign":"textAlign",   //对齐方式
				"lineHeight":"lineHeight", //行高
				"cursor":"cursor",         //鼠标形状
//				"paramsCode":"paramsCode", //baform增删查改传参代码
				"margin":"margin",         //外边距 
				"padding":"padding",       //内边距 
				"float":"float",           //浮动
				"order":"order",           //项目的排列顺序
				"flex":"flex",             //flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto 
				"alignSelf":"alignSelf"    //lf属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。
				
			},
			"eventList":{
				
//				"click":"click",       //双击事件
//				"dbclick":"dbclick",   //双击击事件
//				"rightClick":"rightClick",//右击事件
//				"run":"run"               //立即执行页面	
				
			}
			
		}
//		_self.creatHtml(paramCss);
		return paramCss;
	}
	
	//右侧参数列表html生成
	creatHtml(phtml){
	  	let _self = this;
	  	//初始化
//	  	if(!type){
	  		$(".c-right table tbody").children().remove();
//	  	}
		
	  	let proper = phtml.properties;                 //控件属性
	  	let evn = phtml.eventList;                     //控件事件
	  	for(let item in proper){
	  		if (item.indexOf("Color")!=-1) {
	  			$(".c-right .r-top tbody").append('<tr><td>'+item+'</td><td><input class="selectColor" data-type="'+item+'" type="text" /><span class="icon iconfont icon-gengduo" title="详解"></span></td></li>');
	  		}else if(item=="visible" || item=="checked"){
	  			$(".c-right .r-top tbody").append('<tr><td>'+item+'</td><td><input class="cked" style="height:20px;margin:0" data-type="'+item+'" type="checkbox" /><span class="icon iconfont icon-gengduo" title="详解"></span></td></li>');	  			
	  		}else if(item=="id"){
	  			$(".c-right .r-top tbody").append('<tr><td>'+item+'</td><td><input data-type="'+item+'" type="text" readonly/><span class="icon iconfont icon-gengduo" title="详解"></span></td></tr>');	  			
	  		}
	  		
//	  		else if(item.indexOf("Node")!=-1){
//	  			$(".c-right .r-top tbody").append('<tr><td>'+item+'</td><td><button type="button" data-type="'+item+'" class="btn btn-primary">'+item+'</button></td></tr>');	  			
//	  		}
	  		else{
	  			$(".c-right .r-top tbody").append('<tr><td>'+item+'</td><td><input data-type="'+item+'" type="text"/><span class="icon iconfont icon-gengduo" title="详解"></span></td></tr>');	  			
	  			
	  		}
	  	}
	  	for(let x in evn){
	  		$(".c-right .r-bottom tbody").append('<tr><td>'+x+'</td><td><button type="button" data-type="'+x+'" class="btn btn-primary">editCode</button></td></tr>');
	  	}
	  	
	  	//打开help文档
	  	$(".c-right table tbody td span").click(function(){
	  		let nameType = $(this).siblings().attr("data-type");
	  		window.open("../hp-design/help.html?"+nameType+"");
	  	});
	}
	
	bindChangeEvent(){
		let _self = this;
		$(".c-right input").off("change");  //先删除以前绑定的事件，重新绑定。
		$(".c-right button").off("click");
//		$(_self.posion.id+" input").off("click");
		//监听右侧参数变化
		$(".c-right input").on("change",function(){
			let type = $(this).attr("data-type");			
			let val;
			type == "visible"?val = $(this).prop("checked"):val = $(this).val();
			let ck;
			let cval;
			if(_self.type=="TCheckBox"){
				ck = $(this).attr("data-type");
				ck=="checked"?cval = $(this).prop("checked"):cval = $(this).val();
			}
			
			_self.rightChangeEvent(type,val,cval);
			
		});
		//监听右侧输入框点击
		$(".c-right input").on("focus",function(){
			let type = $(this).attr("data-type");
			let ndom = $(this);
			if((_self.type=="TTextField" || _self.type=="TPassWordField")&&type=="format"){
				$("#myformat").remove();
				let cthtml = '<div id="myformat"><table class="table table-bordered table-hover"><tr><td style="width:100px">只能为数字</td><td>/^[0-9]*$/</td></tr>'
				+'<tr><td>手机号</td><td>/^1[3|4|5|7|8|9][0-9]\d{4,8}$/</td></tr>'
				+'<tr><td>邮箱</td><td>/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/</td></tr>'
				+'<tr><td>身份证</td><td>/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/</td></tr>'
				+'<tr><td>英文和数字</td><td>/^[A-Za-z0-9]+$/</td></tr>'
				+'<tr><td>密码(以字母开头，长度在6~18之间，只能包含字母、数字和下划线)</td><td>/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/</td></tr>'
				+'</table></div>'
				let top = $(this).offset().top+30;
				let winscr = $(window).height();
				$("body").append(cthtml);		
				if(top+200>winscr){
					let bom = $(window).height()-$(this).offset().top-50
					$("#myformat").css({"position":"absolute","bottom":bom,"right":"10px","width":"300px","z-index":100,"background":"#ffffff"})
				}
				//表格点击事件
				$("#myformat tr").click(function(){
					_self.format = $(this).find("td").eq(1).text();
					ndom.val(_self.format);	
					ndom.focus();
					$("#myformat").remove();
					let zTree = $.fn.zTree.getZTreeObj("baseTree");
					let nodes = zTree.getNodeByParam("id",_self.id);
					nodes.format = _self.format;
				});
				
				//点击空白处关闭事件
				$(".c-right").click(function(e){
					let target = $(e.target);
					if((target.closest("#myformat").length == 0)){
					    $("#myformat").remove();
					}
					
				})
			}
		});
		
		
		//编辑器弹出
		$(".c-right button").on("click",function(){	
			let eventType = $(this).attr("data-type");
//			if(eventType.indexOf("item")!=-1){
//				
//			}
//			$(".teareabtn").val('');
			_self.layerCli(eventType);
		});
		
//		_self.customEvent();
	}
	
	/*************************************publicFn end**********************************/
}

/*****************************************其他类型公用方法start************************************/
/**
 * Title：单档查询
 * date：2018/8/30
 * @version 0.8
 * */
function daSearch(nedeurl){
//	let nodehf = searchNodeHref(treeNode); 
	let data;
	$.ajax({
		type:"GET",
		url:win.baseUrl+"data/"+nedeurl,
		async:false,                   //同步操作，否则数据返回前页面已执行，会没有数据
		success:function(result){
			if (result.code=="0") {
				data = result.data.data.data;
			} else{
				data="";
			}
		},
		error:function(result){
			data="";
		}
	});
	return data;
};
/**
 * Title：单档，专案路径查询
 * Description：根据选中节点查询它的父节点，遍历父节点，生成节点路径。
 * date：2018/8/30
 * @version 0.8
 * */
function searchNodeHref(treeNode){
	let nodeHref;
	if(treeNode){
		let parentNode = treeNode.getPath();
		for (let i=0;i<parentNode.length;i++) {
			nodeHref?nodeHref=nodeHref+"-"+parentNode[i].id:nodeHref=parentNode[i].id;
		}
		
	}
	return nodeHref;
}

/** *
•Title: itemOnclick
•Description: 此功能是补充bootstrap-treeview.js插件缺少节点点击事件。
•Copyright: Copyright (c) das.com 2018/8/29
•Company: DAS
•@author qianbaohua
•@version 0.8
**/

function itemOnclick(target){
	
	//找到当前节点id
	var nodeid = $(target).attr('data-nodeid');
	var tree = $(win.dom);
	//获取当前节点对象
	var node = tree.treeview('getNode', nodeid);
	
	if(node.state.expanded){ 
	    //处于展开状态则折叠
	    tree.treeview('collapseNode', node.nodeId);  
	} else {
	    //展开
	    tree.treeview('expandNode', node.nodeId);
}
}

	/** *
	•Title: sameWidth
	•Description: 同宽功能,以第一个为基准.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function sameWidth(){
		if(win.moreChecked.length!=0){	
			let onewd = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				onewd = v.width;
			}else{
				let nodes = zTree.getNodeByParam("id",v.id);
				v.undo();
				v.setWidth(onewd);
				nodes.width = onewd;
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= $(v.id).offset().left;				
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}

	/** *
	•Title: sameHeight
	•Description: 同高功能,以第一个为基准.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function sameHeight(){
		if(win.moreChecked.length!=0){	
			let oneht = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				oneht = v.height;
			}else{
				let nodes = zTree.getNodeByParam("id",v.id);
				v.undo();
				v.setHeight(oneht);
				nodes.height = oneht;
				nodes.topBorder = $(v.id).height()+$(v.id).offset().top;
				nodes.y= $(v.id).offset().top;
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
	
	/** *
	•Title: topAlign
	•Description: 顶部对齐功能,以第一个为基准.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function topAlign(){
		if(win.moreChecked.length!=0){	
			let eqtop = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				eqtop = v.top;
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				v.setTop(eqtop);
				nodes.top = eqtop;
				nodes.topBorder = $(v.id).height()+$(v.id).offset().top;
				nodes.y= $(v.id).offset().top;			
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
	
	/** *
	•Title: bottomAlign
	•Description: 底部对齐功能,以第一个为基准.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function bottomAlign(){
		if(win.moreChecked.length!=0){	
			let blgn = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				blgn = $(v.id).css("bottom");
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				v.setBottom(blgn);
				nodes.top = $(v.id).css("top");
				nodes.topBorder = $(v.id).height()+$(v.id).offset().top;
				nodes.y= $(v.id).offset().top;
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
	
	/** *
	•Title: cenAlign
	•Description: 中间对齐功能,以第一个为基准.第一个宽度的一半,加上偏移量就是中心点距离.用这个距离减去其他控件宽度一半,就是其他控件的偏移量.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function cenAlign(){
		if(win.moreChecked.length!=0){	
			let clgn = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				clgn = ($(v.id).width()/2)+v.left;
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				nodes.left = clgn-parseInt($(v.id).width()/2);
				v.setLeft(nodes.left);
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= $(v.id).offset().left;	
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
	

	/** *
	•Title: leftAlign
	•Description: 左对齐,以第一个为基准.
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function leftAlign(){
		if(win.moreChecked.length!=0){	
			let legn = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				legn = v.left;
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				v.setLeft(legn);
				nodes.left = legn;
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= $(v.id).offset().left;
				zTree.updateNode(nodes);
				v.redo();
			}
//			let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
//			console.log(nodes)
			});
		}
	}
	/** *
	•Title: rightAlign
	•Description: 右对齐,以第一个为基准.右对齐需要根据偏移量和宽度来计算,不能像左对齐一样直接使用.(总距离用left+width)
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function rightAlign(){
		if(win.moreChecked.length!=0){	
			let rign = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			if (i==0) {
				//这里不使用-320来计算是为了防止在小屏幕时,出现较大误差.(由于宽度单位问题,不能直接使用)
				rign = v.left + $(v.id).width();
			}else{
				//需要考虑border
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				nodes.left = rign-$(v.id).width();
				v.setLeft(nodes.left);
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= $(v.id).offset().left;
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
/** *
	•Title: centerAlign
	•Description: 居中,目前居中的是控件里面的内容
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function centerAlign(){
		if(win.moreChecked.length!=0){	
			let rign = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			v.undo();
			let nodes = zTree.getNodeByParam("id",v.id);
			v.setTextAlign("center");
			nodes.textAlign = "center";
			zTree.updateNode(nodes);
			v.redo();
//			if (i==0) {
//				//这里不使用-320来计算是为了防止在小屏幕时,出现较大误差.(由于宽度单位问题,不能直接使用)
//				rign = v.left + $(v.id).width();
//			}else{
//				//需要考虑border
//				v.left = rign-$(v.id).width();
//				v.setLeft(v.left);
//				v.leftBorder = $(v.id).width()+$(v.id).offset().left;
//				v.x= v.getX;
//				mode.session(v.name,v.posion);
//			}								
			});
		}
	}
/** *
	•Title: leftDivide
	•Description: 左右平分,根据外层容器,平分内部控件.当使用这个功能时,内部控件为relitive,宽度为百分比
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function leftDivide(){
		if(win.moreChecked.length!=0){	
			let rign = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			win.moreChecked.forEach(function(v,i){
			v.setTextAlign("center");
			v.textAlign = "center";
			mode.session(v.name,v.posion);
			if (i==0) {
				//这里不使用-320来计算是为了防止在小屏幕时,出现较大误差.(由于宽度单位问题,不能直接使用)
				rign = v.left + $(v.id).width();
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				//需要考虑border
				nodes.left = rign-$(v.id).width();
				v.setLeft(nodes.left);
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= v.getX;
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}
/** *
	•Title: topDivide
	•Description: 上下平分,根据外层容器,平分内部控件.当使用这个功能时,内部控件为relitive,宽度为百分比
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function topDivide(){
		if(win.moreChecked.length!=0){	
			let rign = 0;
			let zTree = $.fn.zTree.getZTreeObj("baseTree"); 
			win.moreChecked.forEach(function(v,i){
			v.setTextAlign("center");
			v.textAlign = "center";
			mode.session(v.name,v.posion);
			if (i==0) {
				//这里不使用-320来计算是为了防止在小屏幕时,出现较大误差.(由于宽度单位问题,不能直接使用)
				rign = v.left + $(v.id).width();
			}else{
				v.undo();
				let nodes = zTree.getNodeByParam("id",v.id);
				//需要考虑border
				nodes.left = rign-$(v.id).width();
				v.setLeft(nodes.left);
				nodes.leftBorder = $(v.id).width()+$(v.id).offset().left;
				nodes.x= v.getX;
				zTree.updateNode(nodes);
				v.redo();
			}								
			});
		}
	}

/** *
	•Title: copyComponent
	•Description: 组件复制,复制一定是复制的数据,否则无法还原,而且还要考虑id,name等重复问题.还有多选的问题。
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	•这里分为两种情况，多选和单选，单选正常操作即可。多选要考虑到复制，粘贴，删除，redo,undo.
	**/
	function copyComponent(){
		win.copy = [];
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		if(win.moreChecked.length!=0){
			zTree.cancelSelectedNode();
			win.moreChecked.forEach(function(v,i){				
			let nNode = zTree.getNodeByParam("id",v.id);
			win.copy.push(nNode);
			});
		}else{		
			let nodes = zTree.getSelectedNodes();
			win.copy = nodes;
		}
		
	}
	/** *
	•Title: shearComponent
	•Description: 组件剪切.删除当前选中的控件。其余与复制一样。
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function shearComponent(){
		win.copy = [];
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		if(win.moreChecked.length!=0){
			zTree.cancelSelectedNode();
			win.moreChecked.forEach(function(v,i){
				
				let nNode = zTree.getNodeByParam("id",v.id);				
				win.copy.push(nNode);
				zTree.removeNode(nNode);
				$(nNode.id).remove();
			});
		}else{
		
			let nodes = zTree.getSelectedNodes();
			win.copy.push(nodes);
			zTree.removeNode(nNode);
			$(nNode.id).remove();
		}
	}

/** *
	•Title: pasteComponent
	•Description: 组件粘贴
	•Copyright: Copyright (c) das.com 2018.9.11
	•Company: DAS
	•@author qianbaohua
	•@version 1.0
	**/
	function pasteComponent(){
		//这里做一次转换的原因是，直接let mynodes = win.copy;会导致修改mynodes时，baseTree中的这个节点会直接跟着变。
		if(win.copy.length!=0){
//			win.copy.forEach(function(v,i){
				let zTree = $.fn.zTree.getZTreeObj("baseTree");
//				let nNode = zTree.getNodeByParam("id",v.id);
				let mynodes = JSON.stringify(win.copy);
				mynodes = JSON.parse(mynodes);
				let newNode = changeParam(mynodes,true,'');
//				console.log(newNode)
				newNode.forEach(function(v,i){
					let pNode = zTree.getNodeByParam("id",v.parentId);
					zTree.addNodes(pNode,v);
				});
//				let pNode = zTree.getNodeByParam("id",newNode.parentId);
//				zTree.addNodes(pNode,newNode);
				gol.res(newNode);
//			});	
		}
	
	}
    
// 	let pComt;
// 	let pId;
	function changeParam(nodes,ty,nid){

		for (let i=0;i<nodes.length;i++) {
			//需要改变的参数有：name,id,x,y,leftBorder,topBorder
			if(ty){		
				let zTree = $.fn.zTree.getZTreeObj("baseTree");
				let selNodes = zTree.getSelectedNodes();
				nodes[i].left = parseFloat(nodes[i].left.toString().replace("px",""))+10;
				nodes[i].top =  parseFloat(nodes[i].top.toString().replace("px",""))+10;
				if(selNodes.length==0){
					nodes[i].parentComponent = nodes[i].parentComponent;
					nodes[i].parentId = nodes[i].parentId;
				}else{
					nodes[i].parentComponent = selNodes[0].id;
					nodes[i].parentId = selNodes[0].id;
				}
				nodes[i].zIndex = 20;
			}
			nodes[i].name = nodes[i].name+"_copy_"+parseInt(100*Math.random());
			nodes[i].id = nodes[i].id+"_copy_"+parseInt(100*Math.random());
			if(nid){
				if(nodes[i].parentComponent==nodes[i].parentId){
					nodes[i].parentComponent = nid;
					nodes[i].parentId = nid;
				}else{
					nodes[i].parentComponent = nid;
					let num = nodes[i].parentId.substr(nodes[i].parentId.length-1,1);
					nodes[i].parentId = nid +num;
				}
				
			}
//			pComt = nodes[i].id;
//			pId = nodes[i].id;
			if(nodes[i].children){
				changeParam(nodes[i].children,'',nodes[i].id);
			}
//			let zTree = $.fn.zTree.getZTreeObj("baseTree");
//			var nodes = zTree.getSelectedNodes();
			
		}
		return nodes;
	}









/*****************************************其他类型公用方法end************************************/