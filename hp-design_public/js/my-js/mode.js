//模型
//let result;
 const mode={
 	session(key,data){
 		if (arguments.length > 1) {                                //存操作
           return sessionStorage.setItem(key, JSON.stringify(data));
  			 } else {                                                        //取操作
           let storeData = sessionStorage.getItem(key);
           return (storeData && JSON.parse(storeData)) || []; // 这里一定要设置初始值为 []
        }

 	},

   	local(key,data){
   		if (arguments.length > 1) {                                //存操作
           return localStorage.setItem(key, JSON.stringify(data));
			 } else {                                                        //取操作
           let storeData = localStorage.getItem(key);
           return (storeData && JSON.parse(storeData)) || []; // 这里一定要设置初始值为 []
        }

   	},	
	/*计算组件之间的关系
	 *更新2.18.7.4，修改原因：
	 * session里面的数据是没有顺序的，也就是说有可能最外层过后直接拿到最内层数据来判断。
	 * 这就会造成else内判断条件无法进入，但却是合法的也是最终需要的最近父元素。
	 * 所以需要需改这个if判断，通过二次计算来确定父元素，而不能直接通过obj.parentComponent == temp.id
	 * 来判断。
	 * 
	 * 二次修改：2018/10/9
	 * 修改原因：数据现在全部存储在变量中，也就是说local中获取不到数据。所以需要改为遍历控件树。
	 * */
	
	comRelationship(position){
		let _self = this;
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let treeli = $("#baseTree").children().length;
		//如果是form，则zTree==null
		if(treeli!=0){					
			//获取所有节点
	   		let rootNodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
	//		递归所有节点，计算出父级。
			result = _self.searchParent(position,rootNodes);

			
		}else{
			position.parentComponent ="root";
			position.parentId =win.rootDom;
			position.left = 0;
			position.top = 0;
			result = position
		}
		return result;
	},
	searchParent(position,nds,temp){
		let _self = this;
		for (let i=0;i<nds.length;i++) {
			if(nds[i].type != undefined && nds[i].type!="TZtree" && nds[i].type!="TButton" && nds[i].type!="TLabel" && nds[i].type!="TSelect" && nds[i].type!="TCheckBox"&& nds[i].type!="TRadioButton"){
				//满足条件记录该对象，并查询子元素。不满足则忽略，不查询子元素
				if(position.x<=nds[i].leftBorder && position.x>=nds[i].x && position.y<=nds[i].topBorder && position.y>=nds[i].y){
					//判断父组件类型，如果是tablepane需要做特别处理,内部div的id是最外层div的id加“_num”,以确保唯一。
					if(nds[i].pDescribe){
						if (nds[i].pDescribe=="no") {
							//找到显示的div，把组件放进去。
							let swdiv = $(nds[i].id).children().eq(1).children();
							for (let j=0;j<swdiv.length;j++) {
								if(!$(swdiv[j]).is(":hidden")){
									position.parentId = "#"+swdiv[j].id;
									//所有tablepane下的组件都会传递pDescribe，后面会根据这个筛选组件。
									position.pDescribe = "#"+swdiv[j].id;
									temp = nds[i];
								}
							}
							
						} else{
							//tablepane不是直接父组件，有其他嵌套。根据pDescribe判断是否显示，排除隐藏组件。
							if(!$(nds[i].pDescribe).is(":hidden")){
//									position.parentId = obj.id;
								//所有tablepane下的组件都会传递pDescribe，后面会根据这个筛选组件。
								position.pDescribe = nds[i].pDescribe;
								temp = nds[i];
							}else{
								continue;
							}
							
							
						}
						
					}else{
						temp = nds[i];
					}
					//判断是否有子元素，如果存在，则继续查找
					if (nds[i].children) {
						return _self.searchParent(position,nds[i].children,temp);
					}
					
				}
			}
		}
		if(temp){
		
			position.parentComponent = temp.id;
//			position.parentId = temp.id;			
			//若果有layout布局，比如有flex，就需要去掉position的top，和left，否则flex布局不会起作用。
		    if (position.parentComponent.indexOf("TFlowLayout") != -1) {
		    	position.left = 0;
				position.top = 0;
				position.posType = "relative";
				position.parentId = temp.id;
			//若果是gridlayout，还要判断是属于哪个网格的子组件	
		    }else if(position.parentComponent.indexOf("TGridLayout") != -1){
		    	position.parentId = temp.id;
		    	position.left = 0;
				position.top = 0;
				position.posType = "relative";
		    	let col = $(temp.id).children(".row").children("div");
		    	//找到当前父组件下的row下的div，遍历div得到每个div的范围，计算子组件属于哪个div
		    	for(let i=0;i<col.length;i++){
		    		let divBorder = col.eq(i).offset().left+$(col[i]).width();
		    		if(divBorder>position.x){
		    			position.parentId ="#"+col[i].id;
		    			break;
		    		}

		    	}
			//判断父组件为tabbedpane需要改变parentId
		    }else if(position.parentComponent.indexOf("TTabbedPane") != -1){
		    	position.left = position.left-temp.x;
		    	position.top = position.top-temp.y;
//		    	判断父组件为tableLayout需要计算每个单元格范围，并将parentId设为当前单元格id
		    }else if(position.parentComponent.indexOf("TTableLayout") != -1){
		    	//遍历所有行列，计算出单元格范围，确定parentId
		    	position.parentId = temp.id;
		    	let tbdom = $(temp.id).find("tr");	                        
		    	let tdHeight = 0;                     //列总高度
		    	let xh = true;                       
		    	
			    	for(let i=0;i<tbdom.length;i++){
			    		if(!xh){                         //用于找到td后结束循环
			    			break;
			    		}
			    		tddom = tbdom.eq(i).find("td");	
			    		let tdWidth = 0;                  //行总款度
			    		//第一行不计算列总高度
			    		if(i!=0){
			    			//上一行列高
			    			let he = tbdom.eq(i-1).find("td").eq(0).height();
			    			tdHeight = tdHeight+he;
			    		}
	
		    			for(let j=0;j<tddom.length;j++){
		    				//计算内部单元格范围。需要考虑想，x，y。（left，top是表格偏移量，x，y是当前组件鼠标位置，计算范围时，使用这个）	    				
							//单元格宽高
							let tdwd = tddom.eq(j).width();
							let tdhe = tddom.eq(j).height();
							//单元格距离左侧和顶部距离
							let pleft = temp.x + tdWidth;
							let ptop = temp.y+tdHeight;
							//单元格左侧和顶部边界
							let tdlBorder = pleft+tdwd+1;
							let tdpBorder = ptop+tdhe+1;
							//同一行中，每过一列，增加一个列宽
							tdWidth = tdWidth + tdwd;
							//当前鼠标位置x大于table的left偏移。y大于table的top。
							if(position.x>pleft && position.x<tdlBorder && position.y>ptop && position.y<tdpBorder){
								position.parentId = temp.id+" #"+tddom.eq(j)[0].id;
								position.left = 0;
								position.top = 0;
								position.width = "100%";
								position.height = "auto";
								position.posType = "relative";
								xh = false;
								break;
							}
		    			}
			    	}
		    	
		    	
		    }
		    else{
		    	position.parentId = temp.id;
		    	//如果有x，y,则相对距离根据x，y计算
		    	if(temp.x!=undefined){
		    		position.left = position.x-temp.x;
		    		position.top = position.y-temp.y;
		    	}
		    }
		    } 
		return position;
		
	},
	
//service返回数据解析:2018/8/23
	resultParse(result){
		let param = {};
		if(typeof result=="string"){
			result = JSON.parse(result);
		}
		if(!result||result.param==undefined){
			let arry = {};
			arry.newVal =[];
			return arry;
		}
		let data = result.param[0];
		if(data.beanType=="ArrayList"){
			param.type = "ArrayList";
			param.newVal = data.value;
		}else if(data.beanType=="JavaBean"){
			if(data.beanName=="PageEntity"){
				param.type = "pageList";
				param.newVal = data.value.content;
			}else {
				param.type = "pageList";
				param.newVal = data.value;
			}
		}else if(data.beanType=="PageEntity"){
			param.type = "PageEntity";
			param.newVal = data.value.content;
		}
		
		return param;
	}
	
	
}
 

/*****************************************页面自适应计算start*********************************************************/
//拖拽时
//function pageAdapt(val,type){
////	var drgWidth = $(".c-drg").width();
//
////	var _left = this;
//	//每次拖拽，宽高变化之后，都要按照1366最小dpi缩放物件。（需要按比例计算宽高，和间距）
//	var nowWidth = $(window).width();               //实际当前屏幕大小
//	var nowHeight = $(window).height();
//	var widthPerce = (1366/nowWidth).toFixed(2);//宽度百分比，保留两位小数
//	var heightPerce = (768/nowHeight).toFixed(2);
//	var wh;
//	if (type=="height") {
//		wh = val*heightPerce;
//	} else{
//		wh = val*widthPerce;
//	}
//
//	return wh;
//
//}
//页面还原比例计算
//function pageSize(data){
//	var drgWidth = $(".c-drg").width();
//	var nowWidth = $(window).width();               //实际当前屏幕大小
//	var nowHeight = $(window).height();
//	var widthPerce = (nowWidth/1366).toFixed(2);    //宽度百分比，保留两位小数
//	var heightPerce = (nowHeight/768).toFixed(2);
//	if (data.width.toString().indexOf("%")==-1) {
//		data.width = data.width*widthPerce;
//		data.height = data.height*heightPerce;
//		data.left = data.left*widthPerce;
//		data.top = data.top*heightPerce;
//		data.x = data.x*widthPerce;
//	}
//
//	return data;
//}

/*****************************************页面自适应计算end*********************************************************/

/*****************************************根据拼音带出汉字start******************************************************/
function pinYinToChinese(data){
	var uArr = [];
	for (var i=0;i<data.length;i++) {
		var preArr = [data[i].id,data[i].name,data[i].code]
		uArr.push(preArr);
	}
	$quickQuery(uArr);
}



/*****************************************根据拼音带出汉字end********************************************************/
/********************************************************table联动相关start***********************************************/
//此方法用于根据传入的dom,获取到里面td的val数据,返回传入另一个表格.
function tbLink(tr){
	var trCla= tr[0].className;
	trCla = trCla.replace(" trbg","");
	trCla = trCla.replace(" tract","");
	var ntd = tr.find("input[type='text']");
	var param = {};	
	param[trCla] = [];
	var trckd = tr.find("input[type='checkbox']").prop("checked");
	if (!trckd) {
		param[trCla].del = true;
	}
	for (var i=0;i<ntd.length;i++) {
		param[trCla].push($(ntd[i]).val());
	}
	return param;
}
function tdCancel(tr){
	var trCla= tr[0].className;
	trCla = trCla.replace(" trbg","");
	trCla = trCla.replace(" tract","");
	$("."+trCla).find("input[type='checkbox']").prop("checked",false);
}
/********************************************************table联动相关end***********************************************/
/**************************************************focus光标移动控制sart*****************************************/
/**
 * 参数说明:
 * input中使用时
 * 
 * that：当前元素dom。
 * length：控制移动的长度，即输入字符长度满足多少时，光标移到下一个位置。
 * targetName：光标的下一个位置的name；
 * 
 * table中使用时
 * targetName:"next":下一列，最后一列换行。具体数字（["row",1]）（["col",1]）：当前焦点所在的行或下一行所在的数字列。数组（[1,2]）:第一行的第二列。
 * 
 * init:初始化的时候焦点位置(name)
 * */
function docusControl(that,length,targetName,init){
	if(init){
		let initdom = $("div[name="+init+"]").find("input");
		if(initdom.length!=0){
			$(initdom).focus();
		}
	}else{
	let type = that.attr("data-name");
	if(type=="TTextField"){
		let nval = that.find("input").val().length;
		if(nval>=length){
			$("div[name="+targetName+"]").find("input").focus();
		}
	}else{//table
		//在表格中需要先判断目前光标所在位置，如果不在表格中，默认第一列获得光标。
		let tbfocus = that.parent();
		$(tbfocus).on("keyup",function(){
			let inval = $(this).find("input:focus");
			if(inval.val().length>=length){
				if($.isArray(targetName)){
					//分为两种
					let nrow = $(inval).parent().parent();   			//tr
					if(targetName[0]=="row"||targetName[0]=="col"){
						if(targetName[0]=="row"){
							$(nrow).find("td").eq(targetName[1]).find("input").focus();
						}else{
							$(nrow).next().find("td").eq(targetName[1]).find("input").focus();
						}
					}else{
						$(nrow).parent().find("tr").eq(targetName[0]).find("td").eq(targetName[1]).find("input").focus();
					}	
					
				}else if(targetName=="next"){
//					let nextdom = $(inval).parent().next();   
					let nrow = $(inval).parent().parent();   			//tr
					let nindex = $(inval).parent().index();         //当前td在当前tr中的位置
					for(let i=nindex;i<$(nrow).children().length;i++){       //当前位置往后找，有则焦点后移，没有转入下一行
						let ninput = $(nrow).children().eq(i).next();
						if(ninput.length==0){                                //下一个不存在
							let xrow = $(nrow).next();                //下一行
							if(xrow.length!=0){
								$(xrow).find("input[type='text']").eq(0).focus();
								break;
							}
						}else{                                        //下一个存在
							let xint = $(ninput).find("input[type='text']");
							if(xint.length!=0){
								$(xint).focus();
								break;
							}
						}
						
					}
			}
			}
		});

	}
}	
	
}

/**************************************************focus光标移动控制end*****************************************/
/**************************************************代码提示功能start*****************************************/
win.editor = codeTips("testmain");
function codeTips(id){
 	let jseditor = CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,     // 显示行数
        indentUnit: 4,         // 缩进单位为4
        styleActiveLine: true, // 当前行背景高亮
        matchBrackets: true,   // 括号匹配
//      mode: 'htmlmixed',     // HMTL混合模式
        lineWrapping: true,    // 自动换行
        theme: 'monokai',      // 使用monokai模版
//      mode:"text/x-java",
//      keyMap:"vim",
//      extraKeys: {"Ctrl": "autocomplete"},
//		extraKeys:{"Ctrl":"autocomplete"}//ctrl-space唤起智能提示
    });
    jseditor.setOption("extraKeys", {
        // Tab键换成4个空格
        Tab: function(cm) {
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
        },
        // F11键切换全屏
        "F11": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        // Esc键退出全屏
        "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
    });
    jseditor.on("cursorActivity", function () {
            //调用显示提示
            jseditor.showHint();
	});
	return jseditor;
}
/**************************************************代码提示功能end*****************************************/