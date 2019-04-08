/******************************************************runtimesTart****************************************************/
let rglo = {};
//rglo.num;
rglo.trdom;
rglo.id;
rglo.con=[];
//rglo.pid;
//rglo.bscon;                                            //baseform插入内容处id
rglo.rqparam;                                            //查询参数
rglo.rqresult;                                           //查询结果
rglo.flowLayout=[];                                      //flowLayout中的需要循环的组件，及其他信息
rglo.pdom;                                               //根据name获取到的父级dom（循环自定义组件使用）
rglo.customData                                           //父id，用于区别是否有多层嵌套（循环自定义组件使用）
rglo.listData;                                           //当前的数据（循环自定义组件使用）；
rglo.automaticRun=[]                                    //需要自动执行的事件
rglo.template = {};                                     //模板数据
rglo.temData;                                           //模板设置数据
//rglo.custom;                                            //动态传参数据
rglo.stringJs="";                                       //点击事件的js字符串 
rglo.init;                                              //初始化事件 
rglo.formId;                                            //form名称，script会写在form里面，而不是body里面。
rglo.newComponent="";                                   //每个物件new他的类。
let addObj = {};                                       //新增行数据
let updateObj = {};                                    //更新行数据
let delObj ={};                                       //删除行数据 

	/**
	 * 执行操作
	 * 修改于2018/9/10
	 * 修改原因：由于导出功能，不能单独一个iframe弹出，必须是一个隐藏的div，根据是执行还是导出，判断是否需要弹出框。
	 * */
	function jstoxml(type){
		_self = this;
		//每次执行先清空div
		$("#runTime").html('');
		rglo.newComponent = "";
		rglo.stringJs="";
		rglo.init = "";
		win.echart=[];
		let name = win.treeNode.id;
		let dandata;                       //单档数据
		let basData;                       //baseform数据
		//单档数据查询
//		dandata = daSearch(name);
		basData = JSON.parse(sessionStorage.getItem(name)); 
		//判断是否有baseform
		if (dandata && dandata[0].baseForm) {
			//存在baseform
			basData = JSON.parse(sessionStorage.getItem(dandata[0].baseForm)); 
		}
		//有baseform，先加载baseform
		if(basData){
			//由于是执行，所以需要改变最外层form的父节点，以确保插入到正确的div中。并且必须把最外层id传下去，否则会插入到编辑页面中
			basData[0].parentId = "#runTime";
			runTime(basData,true,"#runTime");
			//找到baseform插入内容的地方（con）
//			setcon(basData,name);
		}
		if(dandata){
			//没有baseform的时候
			if(rglo.con.length!=0){
				for(let i=0;i<rglo.con.length;i++){
					let con = rglo.con[i];
					dandata[0].parentId =con.pid; 				
				}
			}else{
				dandata[0].parentId ="#runTime";				
			}
			runTime(dandata,"","#runTime");
			rglo.con=[];
			creatScript(true); 
		}
		//判断是否需要弹出框
		if(type){
				layer.open({
			    type: 1,
			    title:"run",
			    id:'run',
			    area: ['100%', '100%'],
//			    content: 'runTime.html',
				content: $('#runTime'),
			    success:function(layero){
//			    	if(win.echart){
//			    		win.echart.forEach(function(v,i){
//			    			v.setSeries();
//			    		});
//			    	}
			    	
//			    creatScript(true); 	
			   	},
			   cancel: function(index, layero){
			   	localStorage.clear();
			   	rglo.stringJs = "";
			   	$("#runTime script").remove();
			   }
			});
		}
		
	}


//data：数据。temId：#runTime。base：true，false判断是否为baseform，以确定是否执行con属性的判断。outName:循环模板的name。
function runTime(data,base,temId,outName){ 
	for (let i=0;i<data.length;i++) {
		let param = {};
//		let daty = data[i];
		var parentDom;
		//存入session里面的数据不能有children，否则保存会多出数据
		// 做转换才能赋值
		let str = JSON.stringify(data[i]); 
		let sessionData = JSON.parse(str);
		delete sessionData.children;
		daty = sessionData;
		if(daty.name.indexOf("[")!=-1){
			daty.name = daty.name.substr(0,daty.name.indexOf("["));
		}
		if(daty.type=="TLocalStorage"){
			let localdata = JSON.stringify(daty); 
			rglo.newComponent = rglo.newComponent+"\n "+daty.name+"cus = "+localdata+"\n "+ daty.name+"=new "+daty.type+"Control("+daty.name+"cus);"
			continue;
		}
		
////		daty = pageSize(sessionData);
//		mode.local(sessionData.name,sessionData);
		//判断paramsCode中是否有代码，如果有需要做对应操作
		/*if (daty.paramsCode!=undefined && daty.paramsCode!="") {
			let pcode = daty.paramsCode.split(",");
			rglo.rqparam = pcode[0];                                          
			rglo.rqresult= pcode[1];  
		}*/
		
		
		//baseform进来时，会有setcontent，记录当前div的id和setcontent内容。(这里主要是头尾，左侧等可以写死的地方)
	/*	if (daty.setContent!=""&&daty.setContent!=undefined) {
			param.pid = daty.id;
			param.con = daty.setContent;
			rglo.con.push(param);
		}*/
		//如果是baseform，需要判断name是否有con，以确定插入位置2018/9/10
		if(base){
			if(daty.name.indexOf("con")!=-1){
				let param = {};
				param.pid = daty.id;
				param.con = daty.name;
				rglo.con.push(param);
			}
			
		}
        //当模板使用时，需要加父id确保唯一。(没有模板也需要最外层id，否则会影响到编辑页面)
        if(outName){
        	if(outName==daty.name){
        		parentDom = $(temId+" "+daty.parentId);
        	}else{
        		if(rglo.temData){
        			if(daty.parentId==outName){
        				parentDom = $(temId +" "+ outName);
        			}else{
        				let pnm = "#"+$("div[name="+rglo.temData.pname+"]").attr("id");
        				if(daty.parentId==pnm){
        					parentDom = $(temId +" "+ outName+" "+"div[name="+rglo.temData.pname+"]");
        				}else{
        					parentDom = $(temId +" "+ outName+" "+"div[name="+rglo.temData.pname+"]"+" "+daty.parentId);
        				}
        				
        			}
        			
        			
        			
        			
        		}else{
//      			let pname = "#"+$(temId+" div[name='"+outName+"']").attr("id");
					let pname = temId+" "+outName;
//      			if(pname==daty.parentId){
//      				parentDom = $(temId+" div[name="+outName+"]");
//      			}else{
//      				parentDom = $(temId+" div[name="+outName+"]"+" "+daty.parentId);
//      			}
					parentDom = $(pname)
        		}
        	}
        }else{
        	if(temId==daty.parentId){
        		parentDom = $(daty.parentId);
        	}else{
        		parentDom = $(temId).find(daty.parentId);
        	}
        	
        }
			//在html字符串上面增加name属性，主要是模板循环时css中会用到
			daty.viewHtml = daty.viewHtml.replace("<div","<div name="+daty.name+"");
			parentDom.append(daty.viewHtml);
			//如果有自定义属性，则放到dom上去
			if(daty.cmAttribute!=undefined){
				//移动医生站baseform右侧列表使用					
				let cab = daty.cmAttribute.split(";");
				for (let i=0;i<cab.length;i++) {
					cma = cab[i].split(",");
					if(rglo.temData){
						$("div[name="+daty.name+"]").attr(cma[0],rglo.temData[cma[1]]);
					}else{
						$("div[name="+daty.name+"]").attr(cma[0],cma[1]);
					}
					
				}
//				$("div[name="+temName+"]").attr("data-cu",rglo.temData[cab[0]]);
//				$("div[name="+temName+"]").attr("data-cm",rglo.temData[cab[1]]);
				
			}
			//每个form都会有一个init初始化事件，将事件保存在rglo.init中，在页面上生成出来。
			if (daty.type=="TForm") {
				rglo.formId = daty.id;
				if(daty.init){
					rglo.init = daty.init;
//					creatScript();
				}
				
			}
			//生成html后，设置css属性，以及js
			bingCss(daty,temId);
//			eval(daty.fon);
			//由于runtime和modal不在一起，需要做区分，后期可以去掉。
//			daty.fon = daty.fon.replace('#runTime',temId);
//			rglo.newComponent = rglo.newComponent+"\n"+daty.fon
			//修改时间：2018/10/8.修改原因：由于参数全部在变量中，为了保证runtime时能拿到变量，需要在new的时候传入。修改内容：去掉fon，runtime时自己生成newComponent。
			//参数转为字符串，生成的时候才能当成参数。 
			let strData = JSON.stringify(daty); 
			if(base){
				rglo.newComponent = rglo.newComponent+"\n "+daty.name+"basecus = "+strData+"\n "+ daty.name+"=new "+daty.type+"Control("+daty.name+"basecus);"
			}else{
				rglo.newComponent = rglo.newComponent+"\n "+daty.name+"cus = "+strData+"\n "+ daty.name+"=new "+daty.type+"Control("+daty.name+"cus);"
			}
			

		 	bingEvent(daty,temId);
		if(data[i].children != [] && data[i].children!=undefined){
			runTime(data[i].children,base,temId,outName);
		}
	}
	
}
	//单档查询
//	function daSearch(uiname){
//		let data;
//		$.ajax({
//			type:"GET",
//			url:win.baseUrl+"data/"+uiname,
//			async:false,                   //同步操作，否则数据返回前页面已执行，会没有数据
//			success:function(result){
//				if (result.code=="0") {
//					data = result.data.data.data;
////					console.log(data)
//				} else{
//					data="";
////					layer.alert(result.msg);
//				}
//			},
//			error:function(result){
//				data="";
////				console.log(result) 
//			}
//		});
//		return data;
//	};


function bingCss(daty,temId){
	let dtype = daty.type;
	//由于执行页面时会生成和编辑页面相同的html，会导致id有重复，所以执行页面需要加上最外层temId
//	eval('var setOget = new '+daty.type+'Control(daty,temId+" "+daty.id,daty.name,daty.rolecss);');
	daty.id = temId+" "+daty.id;
	eval('var setOget = new '+daty.type+'Control(daty);');
	dom = $(daty.id);
//	let setOget = new publicFn(daty.id,daty.name,daty.rolecss);
//	let ctype = "";
//	let dom;
//	if (temId==undefined) {
//		dom = $(daty.id);
//	} else{
//		if(temId==daty.id){
//			dom = $(daty.id);
//		}else{
//			dom = $(temId).find(daty.id);
//		}
//	}

	dom.css({
		"width":daty.width,
		"height":daty.height,
		"line-height":daty.lineHeight,
		"position":daty.posType,
		"left":daty.left,
		"top":daty.top,
		"z-index":daty.zIndex,
//		"overflow":daty.overflow,
//		"background-color":daty.bgColor,
//		"color":daty.color,		
//		"border":daty.border,
//		"font-size":daty.fontSize,
//		"font-family":daty.fontFamily,
//		"font-style":daty.fontStyle,		
		"margin":daty.margin,
		"padding":daty.padding,
		"text-align":daty.textAlign,
		"order":daty.order,
		"flex":daty.flex,
		"float":daty.float,
		"align-self":daty.alignSelf,
		"cursor" :daty.cursor,
		"font-size":daty.fontSize
	});
	if(daty.bottom){
		dom.css({"bottom":daty.bottom,"top":"auto"});
	}
	if(daty.tips){
		dom.attr("title",daty.tips);
	}
	setOget.setBorder(daty.border);	
//	dom.attr("name",daty.name);
//	dom.attr("class",daty.className);
	dom.addClass(daty.className);
	daty.visible?dom.hide():dom.show();
	switch (dtype){
		case "TButton":
			ctype = "button";
//			dom.find("button").css("border",daty.border);
			dom.find(ctype).text(daty.text);	
			dom.find(ctype).css("background-color",daty.bgColor);
//			if(daty.toolBar){
//				setOget.setToolBar(daty.toolBar);
//			}
			setOget.setButtonClass(daty.buttonClass);
			setOget.setBgImgUrl(daty.bgImgUrl);
			setOget.setBgSize(daty.bgSize);
			setOget.setBgRepeat(daty.bgRepeat);
			
			break;
		case "TCheckBox":
			ctype = "span";
			dom.find("input").prop("checked",daty.checked);
//			dom.css("border",daty.border);
			dom.find("span").text(daty.text);
			dom.find(ctype).css("background-color",daty.bgColor);
			break;
		case "TForm":
		ctype = "";
//		dom.css("border",daty.border);
		dom.css("min-width",daty.minWidth);
		dom.css("min-height",daty.minHeight);
			break;		
			
		case "TLabel":
			ctype = "label";
//			dom.find("label").css("border",daty.border);
			setOget.setBorder(daty.border);
			setOget.setText(daty.text);
//			dom.find("label").text(daty.text);
			dom.css("background-color",daty.bgColor);
			dom.find("i").addClass(daty.imgName);
			break;
		case "TFlowLayout":
			ctype = "";
//			dom.css("border",daty.border);
			dom.css("flex-wrap",daty.flexWrap);
			dom.css("display","flex");
			dom.css("flex-direction",daty.flexDirection);
			dom.css("justify-content",daty.justifyContent);
			dom.css("align-items",daty.alignItems);	
			setOget.setOverflow(daty.overflow);
			break;			
		case "TGridLayout":
			ctype = "";
//			dom.css("border",daty.border);
			let collg=[];
			let colsm=[];
			let colmd=[];
			let colxs=[];
			if(daty.lg){
				collg=daty.lg.split(",");
			}
			if(daty.sm){
				colsm=daty.sm.split(",");
			}
			if(daty.md){
				colmd =daty.md.split(",");
			}
			if(daty.xs){
				colxs =daty.xs.split(",");
			}
			//由于daty.id 在前面坐了修改，这里需要去掉temId
			let oldId = $.trim(daty.id.replace(temId,""));
			for (let i=0;i<collg.length;i++) {
				dom.children(".row").append('<div id="'+oldId.replace("#","")+i+'" style="height:100%;padding:0" class=" col-lg-'+collg[i]+' col-sm-'+colsm[i]+'   col-md-'+colmd[i]+' col-xs-'+colxs[i]+'"></div>');
			}
			break;
		case "TTableLayout":
			ctype = "";
			dom.find("table tbody tr td").css("border-color",daty.border);
			dom.find("table thead tr th").css("border-color",daty.border);
			dom.find("table thead tr th").css("color",daty.headerColor);
			dom.find(".table-bordered").css("border-color",daty.border);
			
			dom.find("tbody td input").css("color",daty.color);
			dom.find("table thead").css("background-color",daty.headerBgColor);
			dom.css("background-color",daty.bgColor);
			setOget.setLayoutRows(daty.layoutRows);
			setOget.setLayoutCols(daty.layoutCols);
			setOget.setColWidth(daty.colWidth);
			setOget.setColHeight(daty.colHeight);
			setOget.setRowcolor(daty.rowcolor);
			break;
		case "TPanel":
			ctype = "";
			setOget.setBgImgUrl(daty.bgImgUrl);
			setOget.setBgSize(daty.bgSize);
			setOget.setBgRepeat(daty.bgRepeat);
			setOget.setBgPosition(daty.bgPosition);
			
			setOget.setOverflow(daty.overflow);
			break;	
		case "TTimeline":
			ctype = "";
			setOget.setData(daty.data);
			setOget.setOverflow(daty.overflow);
			break;	
		case "TRadioButton":
			ctype = "";
//			dom.find("form").css("border",daty.border);
			let item = daty.item.split(",");
			item.forEach(function(v,i){
				if (daty.selected == i) {
					dom.find("form").append('<label><input data-type="'+i+'" checked name="name" type="radio"><span class=radio'+i+'>'+v+'</span></label>');
				} else{
					dom.find("form").append('<label><input data-type="'+i+'" name="name" type="radio"><span class=radio'+i+'>'+v+'</span></label>');
				}
				
			});
				
			break;
		case "TSelect":
			ctype = "select";
//			dom.find("select").css("border",daty.border);
			dom.find("select").val(daty.selected);
//			if(daty.options){
//				let list = daty.options.split(",");
//				for (let i=0;i<list.length;i++) {
//					dom.find("select").append('<option>'+list[i]+'</option>');
//				}
//			}
			setOget.setOptions(daty.options);
			dom.find(ctype).css("background-color",daty.bgColor);
			break;	
		case "TSelectTable":
			dom.children().eq(0).find("input").val(daty.text);
			ctype = "input";
//			dom.children().eq(0).find("input").css("border",daty.border);
	//		let tsmode = new publicFn(daty.id,daty.name,daty.rolecss);
			setOget.setHead(daty.head);
			setOget.setTableData(daty.tableData);
			setOget.setTableWidth(daty.tableWidth);
			setOget.setPageIsHide(daty.pageIsHide);
			dom.find("tbody tr input").prop("readonly",true);
		
		
			let mysjs = '$("'+daty.id+' span").on("click",function(e){\n $(this).parent().next().toggle();\n});\n'
					   +'$("'+daty.id+'").children().eq(0).on("keyup","input",function(){\n let vl = $(this).val();\n'
					   +'$("'+daty.id+'"+" table tbody tr").hide().filter(":contains(\'"+vl+"\')").show();\n})\n'
			rglo.stringJs = rglo.stringJs+mysjs;
			rglo.init =rglo.init+"\n "+daty.name+".bingTrClick();\n";
			dom.find(ctype).css("background-color",daty.bgColor);
			break;
		case "TTabbedPane":
			ctype = "";
//			dom.css("border",daty.border);
//			let title = daty.list.split(",");
			let liwidth=0;
			setOget.setTabType(daty.tabType);
			if (daty.tabTitle) {
				setOget.setTabTitle(daty.tabTitle);
			}
			let nfile = daty.id.substr(10);
			dom.attr("lay-filter",nfile);
	       
			break;	
		case "TTable":	
			ctype = "input";

		
			dom.find("tbody td input").css("color",daty.color);

			if(daty.head!=""&&daty.head!=undefined){
				setOget.setHead(daty.head);	
			}
			if(daty.setData!=""&&daty.setData!=undefined){
				setOget.setData(daty.setData);
//				setOget.setPage();
			
			}else if(daty.rows!=undefined && daty.cols!=undefined){
				setOget.setRows(daty.rows,'');
				setOget.setCols(daty.cols,'',daty);
				
			}
			setOget.setTableClass(daty.tableClass);
			setOget.setDisabled(daty.disabled);
			setOget.setPageNum(daty.pageNum);
			setOget.setTbBgColor(daty.tbBgColor);
			setOget.setTbHeadColor(daty.tbHeadColor);
			setOget.setTbBorder(daty.tbBorder);
			
//			dom.find(ctype).css("background-color",daty.bgColor);
//			dom.find("table").attr("class",daty.tableClass);
			let tyr = false;
			if(daty.trclick){
				tyr = true;
			}
			let trcli = '$("'+daty.id+' tbody").on("click","tr",function(e){\n'
			            +'rglo.trdom = $(this);\n'
			            +'if ('+tyr+') {\n'
			            +daty.trclick+'\n}\n e.stopPropagation();\n});\n'
			rglo.stringJs = rglo.stringJs+"\n"+trcli;
//			tbBindEvent(daty,temId);
			break;
		case "TTextArea":
//		dom.find("textarea").val(daty.text);
		ctype = "textarea";
//		dom.find("textarea").css({"border":daty.border});
		dom.find(ctype).css("background-color",daty.bgColor);
			break;	
		case "TDateField":
		ctype = "input";
		setOget.setDisabled(daty.disabled);
		dom.find("input").val(daty.text);
			break;	
			
		case "TMobileDateField":
		ctype = "input";
		setOget.setFormat(daty.format);
			break;		
			
		case "TPassWordField":
		ctype = "input";
		setOget.setDisabled(daty.disabled);
		dom.find("input").val(daty.text);
			break;
		case "TFile":
		ctype = "input";
			break;	
//		case "TCollapse":
//		ctype = ".cola";
//
//		dom.find("a").css({"height":"3rem","line-height":"3rem","display":"inline-block","width":"100%","border-bottom":"1px solid #dddddd"});
//		dom.on("click","a",function(){
//			$(this).next().toggle();
//		});
//		dom.find(ctype).css("background-color",daty.bgColor);
//			break;
		case "TTextField":
		ctype = "input";
		setOget.setDisabled(daty.disabled);
		dom.find("input").val(daty.text);
			break;
		case "TZtree":
		ctype = "";
		setOget.setSetting();
		
		
			break;	
		case "TDropdown":
		ctype = "";
//		dom.css("border",daty.border);
//		setOget.setMenuTitle(daty.menuTitle);
		setOget.setMenuList(daty.menuList);
			break;	
		case "TMenuTree":
		ctype = "";
		setOget.setCustom();
		win.dom = daty.id;//点击事件需要用到win.dom
			break;	
		case "TEchartLine":
		ctype = "";
//		let sjs = 'let titleone = '+daty.title+';\n let tooltipone ='+daty.tooltip+';\n let gridone = '+daty.grid+';\n let legendDataone = '+daty.legendData+';\n let xdataone='+daty.xdata+';\n let ydataone='+daty.ydata+';\n let sriesone='+daty.sries+';\n'
//					+''+daty.name+'.setEchartLine(titleone,tooltipone,gridone,legendDataone,xdataone,ydataone,sriesone)'
//		rglo.stringJs = rglo.stringJs+"\n"+sjs;
//		setOget.setEchartLine(daty.title,daty.tooltip,daty.grid,daty.legendData,daty.xdata,daty.ydata,daty.sries);
		let sjs = 'let setOget='+JSON.stringify(setOget)+';\n let mydata = new TEchartLineControl(setOget);\nmydata.updataView();'
		rglo.stringJs = rglo.stringJs+"\n"+sjs;
			break;
		default:
		
		
		
			break;
	}
	if (ctype!="") {
		dom.find(ctype).css({
//			"background-color":daty.bgColor,
			"color":daty.fontColor,
//			"font-size":daty.fontSize,
			"font-family":daty.fontFamily,
			"font-style":daty.fontStyle,
			"font-weight":daty.fontWeight,
			"cursor" :daty.cursor,
//			"border":daty.border
		});
//		dom.find(ctype).text(daty.text);
	}else{
		dom.css({
			"background-color":daty.bgColor,
			"color":daty.fontColor,
//			"font-size":daty.fontSize,
			"font-family":daty.fontFamily,
			"font-style":daty.fontStyle,
			"font-weight":daty.fontWeight,
//			"border":daty.border
		});
//		dom.text(daty.text);
	}
}





function bingEvent(daty,temId){
	//rglo.pdom主要用于baseform中。temName主要用于模板循环中
			let cliId;
//			daty.id = daty.id.replace("#runTime",'');
			daty.id = daty.id.substr(1);
			daty.id = daty.id.substr(daty.id.indexOf("#"));
			
			
			if (temId==undefined) {
				cliId = daty.id;
			} else{
				if(temId==daty.id){
					cliId = daty.id;
				}else{
					if(rglo.temData){						
						let myid = "#"+$("div[name='"+rglo.temData.pname+"']").attr("id");
						if(myid==daty.id){
							cliId = "div[name='"+rglo.temData.pname+"']";
						}else{
							cliId = "div[name='"+rglo.temData.pname+"'] "+daty.id;
						}
					}else{
						cliId = temId+" "+daty.id;
					}
					
				}
			}
		/*	if (rglo.pdom) {
				if(temName){
					if(daty.name==temName){
						cliId = "div[name='"+rglo.pdom+"'] div[name='"+temName+"']";
//						cliId = $('div[name="'+rglo.pdom+'"]').find('div[name="'+temName+'"]');
					}else{
						cliId = "div[name='"+rglo.pdom+"'] div[name='"+temName+"'] "+daty.id+"";
//						cliId = $('div[name="'+rglo.pdom+'"]').find('div[name="'+temName+'"]').find(daty.id);
					}
				}else{
//					cliId = $('div[name="'+rglo.pdom+'"]').find(daty.id);
				}
			} else{
				if(temName){
					if(daty.name==temName){
						cliId = "div[name='"+temName+"']";
//						cliId = $('div[name="'+temName+'"]');
					}else{
						cliId = "div[name='"+temName+"'] "+daty.id+"";
//						cliId = $('div[name="'+temName+'"]').find(daty.id);
					}
				}else{
					cliId = daty.id;
				}
			}*/
			
			if (daty.click) {
				
				
				let sjs = '$("'+cliId+'").click(function(){\n'+daty.click+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
//				var stringJs = '$("'+cliId+'").click(function(){\n'+daty.click+'\n});';
//				$("body").append('<script>stringJs</script>');
			}
			
			if(daty.dblclick){
				let sjs = '$("'+cliId+'").dblclick(function(){\n'+daty.dblclick+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			
			if(daty.mousedown){
				let sjs = '$("'+cliId+'").mousedown(function(){\nif (3==e.which) {\n '+daty.rightClick+'\n}\n else{\n'+daty.mousedown+'\n});\n}\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.mouseup){
				let sjs = '$("'+cliId+'").mouseup(function(){\n'+daty.mouseup+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			
			if(daty.mouseover){
				let sjs = '$("'+cliId+'").mouseover(function(){\n'+daty.mouseover+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.mouseout){
				let sjs = '$("'+cliId+'").mouseout(function(){\n'+daty.mouseout+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.mouseenter){
				let sjs = '$("'+cliId+'").mouseenter(function(){\n'+daty.mouseenter+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.mouseleave){
				let sjs = '$("'+cliId+'").mouseleave(function(){\n'+daty.mouseleave+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.change){
				let sjs = '$("'+cliId+'").change(function(){\n'+daty.change+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.keydown){
				let sjs = '$("'+cliId+'").keydown(function(){\n'+daty.keydown+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.keyup){
				let sjs = '$("'+cliId+'").keyup(function(){\n'+daty.keyup+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.keypress){
				let sjs = '$("'+cliId+'").keypress(function(){\n'+daty.keypress+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}
			//输入框获得焦点事件，输入框内容改变检查format正则。
			if(daty.focus){
				let sjs = '$("'+cliId+'").focus(function(){\n'+daty.focus+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs;
			}			
			if(daty.format){
				let sjs;
				if(daty.type =="TDateField"){ 
					sjs = 'win.laydate.render({\n elem: "'+cliId+' input",\n'
					+'type: "'+daty.dateType+'",\n range: '+daty.range+',\n format:"'+daty.format+'",\n'
					+' min: "'+daty.min+'",\n max: "'+daty.max+'",\n lang: "'+daty.lang+'",\n theme:"'+daty.theme+'",\n'
					+'done: function(value, date, endDate){\n_self.text = value;\n}\n});\n'
				}else{
					sjs = '$("'+cliId+' input").keyup(function(){\n let nval = $("'+cliId+' input").val();\n let reg ='+daty.format+'\n if(!(reg.test(nval))){\n$("'+cliId+' input").val("");\n}\n});\n'
				}
				rglo.stringJs = rglo.stringJs+sjs;
			}
			//2019/1/2新增tabbedpane的点击事件。
			if(daty.tabClick){
				let filen = daty.id.substr(10);
				let sjs = 'win.element.on("tab('+filen+')")", function(data){\n '+daty.tabClick+'});\n';
				rglo.stringJs = rglo.stringJs+sjs;

//				for (x in daty.item) {
//					let im = x.replace(/[^0-9]/ig,"");
//					sjs = sjs+'$("#runTime '+daty.id+'").children().eq(0).find("li").eq('+im+').on("click",function(){\n'
//							 +daty.item[x]+"});\n"
//				}
//				rglo.stringJs = rglo.stringJs+sjs;
				
			}
			
			//2018/12/19新增TDropDown的点击事件。
			if(daty.menu){
//				let tite = daty.list.split(";");
				let sjs = "";
				for (x in daty.menu) {
					let im = x.replace(/[^0-9]/ig,"");
					sjs = sjs+'$("#runTime '+daty.id+' ul").find("li").eq('+im+').on("click",function(){\n'
							 +daty.menu[x]+"});\n"
				}
				
				rglo.stringJs = rglo.stringJs+sjs;
				
			}
			//2018/12/19新增table中的点击事件(主要是增删查改)。
			if(daty.add){
				let sjs = '$("#runTime '+daty.id+' tbody").on("click",".add",function(){\n'+daty.add+"});\n";
				rglo.stringJs = rglo.stringJs+sjs;
				
			}
			if(daty.edit){
				let sjs = '$("#runTime '+daty.id+' tbody").on("click",".edit",function(){\n'+daty.edit+"});\n";
				rglo.stringJs = rglo.stringJs+sjs;
			}
			if(daty.del){
				let sjs = '$("#runTime '+daty.id+' tbody").on("click",".del",function(){\n'+daty.del+"});\n";
				rglo.stringJs = rglo.stringJs+sjs;
			}
			//自定义方法
			if (daty.customFunction) {
				rglo.stringJs = rglo.stringJs+daty.customFunction+"\n"; 
			}
			//树节点点击事件
			if(daty.nodeClick){
				let sjs = '\n function nodeClick(event, data){\n'+daty.nodeClick+'}\n';
//				let sjs = '\n $("'+cliId+'").on("nodeSelected",function(event, data) {\n'+daty.nodeClick+'\n});\n'
				rglo.stringJs = rglo.stringJs+sjs; 
			}
}
//type用来区别模态框
function creatScript(type){	
	//修改这里的原因是，有外层包裹会导致在外面可能获取不到里面的变量
	let init = '$(function(){\n'+rglo.newComponent+"\n"+rglo.init+'\n})';
//	let init = ''+rglo.newComponent+"\n"+rglo.init+'\n';
	let dom;
	if(type){
		dom = "#runTime "+rglo.formId;
	}else{
		dom = rglo.formId;
	}
	$(dom).append('<script>'+init+'</script>');
	if (rglo.stringJs) {
		$(dom).append('<script>'+rglo.stringJs+'</script>');
	}
	
}

function creatScriptTwo(){
	if (rglo.stringJs) {
		
		
		$(rglo.formId).append('<script>'+rglo.stringJs+'</script>');
	}
}

/******************************************************runtimesEnd****************************************************/
function tbBindEvent(data,temId){
	//表格点击事件
	let tbData = $(data.id);
	if (temId!=undefined) {
		tbData = $("div[name='"+temId+"']").find(data.id);
	}
	tbData.find("input").off("click");
	tbData.find("input").off("change");
   tbData.on("click","tr",function(e){
//  	clitr = $(this).parent().parent();
    	rglo.trdom = $(this)[0].className.replace(" tract","");   	
    	$(this).addClass("tract").siblings().removeClass("tract");
    	if (data.trClick!=undefined) {
				eval(data.trClick);
			}
		e.stopPropagation();
    });
    //表格变化    
	tbData.on("change","input",function(){
		if(rglo.trdom.indexOf("tr")!=-1){                    //存在行"tr",说明来源是数据
			let head = data.header.split(";");
			for(let i=0;i<head.length;i++){
				let cod = head[i].split(",");
				updateObj[rglo.trdom]=updateObj[rglo.trdom]||{};
				updateObj[rglo.trdom][cod[3]]=$("."+rglo.trdom).find("input").eq(i).val();
				
			}
	}else{                                                  //不存在"tr",说明是页面新增;
			let head = data.header.split(";");
			for(let i=0;i<head.length;i++){
				let cod = head[i].split(",");
				addObj[rglo.trdom]=addObj[rglo.trdom]||{};
				addObj[rglo.trdom][cod[3]]=$("."+rglo.trdom).find("input").eq(i).val();
			}
//			if($(clitr).next().length==0){                   //如果是最后一行,再新增一行.   
//				 addrows(data.id,1);
//			}
		}
			
});
}


//baseForm中查询
function bsearch(){	
	let beans = new  BeanFactory();
	let user = beans.newInstance('User');
	if(rglo.rqparam){                            //如果数据存在
		eval(rglo.rqparam);	
	}
	let serv = new UserService();
//	let result = serv.list(user);
	let result = serv.query(user);
	if (rglo.rqresult) {
		eval(rglo.rqresult);	
	}

}
//baseForm中新增
function badd(){
	let beans = new  BeanFactory();
	let user = beans.newInstance('User');
	let serv = new UserService();
	for (let item in addObj) {              //遍历所有是新增的数据,每条调用一次接口,完成数据新增	
		user.setId(addObj[item].id);
		user.setName(addObj[item].name);
		user.setAge(addObj[item].age);
		let result = serv.add(user);
//		console.log(addObj[item].name+";" + result.msg);
//		serv.add(user);
	}

//	let UserService = new UserService();
//	let result = UserService.add(user);
}
//baseForm中修改
function bchange(){
	let beans = new  BeanFactory();
	let user = beans.newInstance('User');
	let sev = new UserService();
	for (let item in updateObj) {              //遍历所有是更新的数据,每条调用一次接口,完成数据更新
//		user.setName(updateObj[item]);
		user.setId(updateObj[item].id);
		user.setName(updateObj[item].name);
		user.setAge(updateObj[item].age);
		sev.upd(user);
	}
}
//baseForm中删除
function bdel(){	
	if(rglo.trdom.indexOf("tr")==-1){         //如果是新增的数据删除,不用掉接口,直接删除当前行,并删除新增addObj中对应数据
		delete addObj[rglo.trdom];
	}else{                                    //如果是原始数据删除,则需要调用接口,并删除updateObj中对应数据.
		let beans = new  BeanFactory();
		let user = beans.newInstance('User');
		let serv = new UserService();
		user.seId(rglo.trdom);
		
		serv.del(user);
//		delete updateObj[rglo.trdom];
	}
	rglo.trdom.remove();
}
//baseForm中清空
function bdel(){
	$("body div").find("input").val("");
	$("body div").find("select").val("");
}


let newnum = 0;
function addrows(id,val){
	let _self = this; 
	let cols = $(id + " tbody tr").eq(0).find("td");    	
	let rows = $(id + " tbody tr").length;
	for(let j=0;j<val;j++){
		win.trnum++;
		$(id + " tbody").append('<tr class="add_'+win.trnum+'"></tr>');
		if(cols!=""&&cols!=undefined){
    		for(let i=0;i<cols.length;i++){
    			$(id + " tbody tr").eq(rows+j).append('<td><input type="text"/></td>');
    		}
		}	
	}
	$(id).find("nav").remove();
	$(id+' tbody').paginathing({
      perPage: 5,
      insertAfter: id+' .table',
      pageNumbers: true
    });
}

//pdf
//function showpdf(Url){
////  var url = Url;
//	var url = "http://192.168.123.245:8090/hp/fileView/pdf?filePath=PDF\18\07\000000000157/180711000008_%E4%BD%8F%E9%99%A2%E8%AF%81_1"
//	$("#panel_3syrvqnvzbd").html("");
//	$("#panel_3syrvqnvzbd").append('<canvas id="the-canvas" style="width: 100%;height: 100%;"></canvas>');
////	var url = "http://192.168.123.51:8080/javahis5/EMRWebFileViewServlet?pdfPath=PDF\18\07\000000000157/180711000008_%E4%BD%8F%E9%99%A2%E8%AF%81_1";
//	PDFJS.workerSrc = 'js/jq-plugIn/pdf.worker.js';//加载核心库
//	PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
//	//
//	// 获取第一页数据
//	//
//	pdf.getPage(1).then(function getPageHelloWorld(page) {
//	var scale = 1;
//	var viewport = page.getViewport(scale);
////	JSON.stringify()
//	//
//	// Prepare canvas using PDF page dimensions
//	//
//	var canvas = document.getElementById('the-canvas');
//	var context = canvas.getContext('2d');
//	canvas.height = viewport.height;
//	canvas.width = viewport.width;
//	
//	//
//	// Render PDF page into canvas context
//	//
//	var renderContext = {
//	canvasContext: context,
//	viewport: viewport
//	};
//	page.render(renderContext);
//	});
//	});
//
//}


/********************************************************页面跳转start***********************************************/
//模态框
function customModal(name,target){
	var id;
	rglo.stringJs="";  
	rglo.newComponent = "";//置空全局变量，防止多次添加事件
	rglo.init = "";
	rglo.temData = "";
	if (target) {
//		var tgt = mode.local(target);
		var tgt = $("#runTime div[name='target']")
		id = tgt.id;
	} else{
		id = ".c-drg";
	}
	$("#cusModal").remove();
	$(id).append('<div id="cusModal" style="display:none;width:100%;height:100%"></div>');
	var divdata = daSearch(name);
	divdata[0].parentId = "#cusModal";
	runTime(divdata,'',"#cusModal");
//	rglo.formId = rglo.template[name][0].parentId;
	creatScript(false);
	let arean = divdata[0].children[0].area.split(",");
		layer.open({
	    type: 1,
		title: divdata[0].children[0].title,
		closeBtn:divdata[0].children[0].closeBtn, 
	    id:'mymodal',
	    shade : divdata[0].children[0].shade,
	    area: arean,
	    content:$("#cusModal"),
	    skin:divdata[0].children[0].skin,
	    offset:divdata[0].children[0].offset,
	    anim:divdata[0].children[0].anim,
	    maxmin:divdata[0].children[0].maxmin,
	    fixed:divdata[0].children[0].fixed,
	    maxWidth:divdata[0].children[0].maxWidth,
	    maxHeight:divdata[0].children[0].maxHeight,
	    
	    success:function (){
			
	    }
	  });
}



/********************************************************页面跳转end***********************************************/
