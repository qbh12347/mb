	//专案列表树使用
	let hisSeting = {
		view: {
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false
		},
		data: {
			simpleData: {
				enable:true,
				idKey: "id",
				pIdKey: "pId",
				rootPId: ""
			}
		},
		callback: {
	//		beforeClick: beforeClick,
			onClick: hisClick,
			beforeRightClick: beforeRightClick,
			onRightClick:hisRightClick
		}
	}
/********************************************控件树相关方法start**********************************/
	//控件树使用
let nocliSetting = {
	edit: {
		drag: {
			autoExpandTrigger: false,     //拖拽时父节点自动展开是否触发 onExpand 事件回调函数      
			prev: dropPrev,               //拖拽到目标节点时，设置是否允许移动到目标节点前面的操作
			inner: dropInner,             //拖拽到目标节点时，设置是否允许成为目标节点的子节点
			next: dropNext                //拖拽到目标节点时，设置是否允许移动到目标节点后面的操作
		},
		enable: true,                     //设置 zTree 是否处于编辑状态
		showRemoveBtn: false,             //设置是否显示删除按钮
		showRenameBtn: false              //设置是否显示编辑名称按钮
	},	
	view: {
		dblClickExpand: false,
		showLine: true,
		selectedMulti: false
	},
	data: {
		simpleData: {
			enable:true,
//			idKey: "id",
//			pIdKey: "parentComponent",
			rootPId: ""
		}
	},
	callback: {
		onMouseDown: onClick,
//		onRightClick:componentRClick
		beforeDrag: beforeDrag,            //节点被拖拽之前的事件回调函数
		beforeDrop: beforeDrop,            //用于捕获节点拖拽操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作
		beforeDragOpen: beforeDragOpen,    //用于捕获拖拽节点移动到折叠状态的父节点后，即将自动展开该父节点之前的事件回调函数，并且根据返回值确定是否允许自动展开操作
//		onDrag: onDrag,                    //用于捕获节点被拖拽的事件回调函数
		onDrop: onDrop                     //用于捕获节点拖拽操作结束的事件回调函数
//		onExpand: onExpand                 //用于捕获节点被展开的事件回调函数
	}
	
};


//单击控件列表触发
function onClick(event, treeId, treeNode, clickFlag) {
	//form的name格式为"TForm_1[normal]";需要去掉[]中内容.
	let name; 
	if(!event.ctrlKey){
		
//	}else{
	
	if (treeNode.name.indexOf("[")==-1) {
		name = treeNode.name;
	}else{
		name = treeNode.name.substr(0,treeNode.name.indexOf("["));
	}
//	let posion = mode.session(name);
	
	
	//获取选中节点的参数
	let zTree = $.fn.zTree.getZTreeObj(treeId);
	let ckdNode = zTree.getSelectedNodes();
	$(win.rootDom).find("div").removeClass("cked");
	$(treeNode.id).addClass("cked");
	/**
	 *由于操作雷同,且可以自定义增加组件,所以作词修改,2018/8/31 
	 *由于textfield有三个写在一起，所以另作判断
	 */
	let allcol;
	let inputType = treeNode.type;
    eval(' allcol = new '+inputType+'Control(treeNode,treeNode.id,treeNode.name,treeNode.rolecss);');
    if(treeNode=="TLocalStorage"){
    	allcol.updataViewRight();  
    }else{
    	allcol.updataViewRight();   
		allcol.bindChangeEvent();
		allcol.colorControl();
		win.dom = treeNode.id;
    }

//	win.name = treeNode.name;
		//获取当前节点的事件
	if(ckdNode[0]&&ckdNode[0].nodeClick){
		new Function(ckdNode[0].nodeClick)();
	}
    event.stopPropagation();
   }
}
//function componentRClick(event, treeId, treeNode, clickFlag){
//	
//}
/**
 * 新增内容：控件树的节点可以移动
 * 新增时间：2018/9/29
 * 
 * */
function dropPrev(treeId, nodes, targetNode) {
	var pNode = targetNode.getParentNode();
	if(pNode && pNode.dropInner === false) {
		return false;
	} else {
		for(var i = 0, l = curDragNodes.length; i < l; i++) {
			var curPNode = curDragNodes[i].getParentNode();
			if(curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

function dropInner(treeId, nodes, targetNode) {
	if(targetNode && targetNode.dropInner === false) {
		return false;
	} else {
		for(var i = 0, l = curDragNodes.length; i < l; i++) {
			if(!targetNode && curDragNodes[i].dropRoot === false) {
				return false;
			} else if(curDragNodes[i].parentTId && curDragNodes[i].getParentNode() !== targetNode && curDragNodes[i].getParentNode().childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

function dropNext(treeId, nodes, targetNode) {
	var pNode = targetNode.getParentNode();
	if(pNode && pNode.dropInner === false) {
		return false;
	} else {
		for(var i = 0, l = curDragNodes.length; i < l; i++) {
			var curPNode = curDragNodes[i].getParentNode();
			if(curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
				return false;
			}
		}
	}
	return true;
}

var log, className = "dark",
	curDragNodes, autoExpandNode;

function beforeDrag(treeId, treeNodes) {
	className = (className === "dark" ? "" : "dark");
	showLog("[ " + getTime() + " beforeDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes.");
	for(var i = 0, l = treeNodes.length; i < l; i++) {
		if(treeNodes[i].drag === false) {
			curDragNodes = null;
			return false;
		} else if(treeNodes[i].parentTId && treeNodes[i].getParentNode().childDrag === false) {
			curDragNodes = null;
			return false;
		}
	}
	curDragNodes = treeNodes;
	//undo使用
	let myData = {};
	let str = JSON.stringify(treeNodes);
	myData.undo = JSON.parse(str);
//	myData.undo = str[0]
    actionStack[actionStackPointer] = myData;
	return true;
}

function beforeDragOpen(treeId, treeNode) {
	autoExpandNode = treeNode;
	return true;
}

function beforeDrop(treeId, treeNodes, targetNode, moveType, isCopy) {
	className = (className === "dark" ? "" : "dark");
	showLog("[ " + getTime() + " beforeDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
	showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is " + (isCopy == null ? "cancel" : isCopy ? "copy" : "move"));
	return true;
}

function onDrag(event, treeId, treeNodes) {
	className = (className === "dark" ? "" : "dark");
	showLog("[ " + getTime() + " onDrag ]&nbsp;&nbsp;&nbsp;&nbsp; drag: " + treeNodes.length + " nodes.");
}

function onDrop(event, treeId, treeNodes, targetNode, moveType, isCopy) {
	//改变一些节点参数，比如宽高，leftborder等。(注意考虑tablepane中的节点移动)；
	let pdom;
	if(moveType=="prev"||moveType=="next"){
		treeNodes[0].parentId = targetNode.parentId;
		treeNodes[0].parentComponent = targetNode.parentComponent;
		treeNodes[0].pDescribe = targetNode.pDescribe;
		pdom = targetNode.parentId;
	}else{
	treeNodes[0].parentId = targetNode.id;
	treeNodes[0].parentComponent = targetNode.id;
    if(targetNode.pDescribe=="no"){
    	let tpneChi = $(targetNode.id).children().eq(1).children();
		for (let i=0;i<tpneChi.length;i++) {
			if(!$(tpneChi[i]).is(":hidden")){
				treeNodes[0].pDescribe = "#"+$(tpneChi[i]).attr("id");
				treeNodes[0].parentId = "#"+$(tpneChi[i]).attr("id");
		
				break;
			}
			
		}
    }else{
    	treeNodes[0].pDescribe = targetNode.pDescribe;
    }

	
	
//	treeNodes[0].pDescribe = targetNode.pDescribe;
	treeNodes[0].x=targetNode.x;                         
	treeNodes[0].y=targetNode.y;                         
	treeNodes[0].left=0;                   
	treeNodes[0].top=0; 
	pdom = targetNode.id;
	}
	treeNodes[0].zIndex = 20;
	$(treeNodes[0].id).remove();
	gol.res(treeNodes);
//	let trn = $(treeNodes[0].id).clone(true);
//	$([0].id).remove();
//	$(pdom).append(trn);
//	$(treeNodes[0].id).css({"left":0,"top":0});
	
	let zTree = $.fn.zTree.getZTreeObj("baseTree");
	zTree.updateNode(treeNodes[0]);
	let str = JSON.stringify(treeNodes);
	actionStack[actionStackPointer].redo = JSON.parse(str);
	actionStack[actionStackPointer].ctype = "tree";
	actionStackPointer ++;
//	className = (className === "dark" ? "" : "dark");
//	showLog("[ " + getTime() + " onDrop ]&nbsp;&nbsp;&nbsp;&nbsp; moveType:" + moveType);
//	showLog("target: " + (targetNode ? targetNode.name : "root") + "  -- is " + (isCopy == null ? "cancel" : isCopy ? "copy" : "move"))
}

function onExpand(event, treeId, treeNode) {
	if(treeNode === autoExpandNode) {
		className = (className === "dark" ? "" : "dark");
		showLog("[ " + getTime() + " onExpand ]&nbsp;&nbsp;&nbsp;&nbsp;" + treeNode.name);
	}
}

function showLog(str) {
	if(!log) log = $("#log");
	log.append("<li class='" + className + "'>" + str + "</li>");
	if(log.children("li").length > 8) {
		log.get(0).removeChild(log.children("li")[0]);
	}
}

function getTime() {
	var now = new Date(),
		h = now.getHours(),
		m = now.getMinutes(),
		s = now.getSeconds(),
		ms = now.getMilliseconds();
	return(h + ":" + m + ":" + s + " " + ms);
}






/********************************************控件树相关方法end**********************************/

/*********************************单档相关方法*******************************/

	//点击树节点，查询单档。
	function hisClick(event, treeId, treeNode){
		//先判断是基础组件还是其他，如果是基础组件，点击不做操作
		win.treeNode = treeNode;
		win.maxNum = 0;       //2018/8/27新加初始化maxnum，和num，防止页面中出现过大数据（此处可以删除）
		win.num = 0;
		win.treeId = treeId;
		if (treeNode.uitype=="baseComponent") {
			return false;
		}
		if(!treeNode.isParent){
			//点击节点，如果组件列表存在，则不作操作，否则生成组件列表
			let compList = $("#collapseTwo").children();
			if (compList.length==0) {
				let roottree = $.fn.zTree.getZTreeObj(treeId);
//				let roottree = $.fn.zTree.getZTreeObj("javaHis");
				let comp = roottree.getNodesByParam("name","component");        //获取组件节点下所有子节点，放到组件菜单中
				let comchl = comp[0].children;
				for (let i=0;i<comchl.length;i++) {
					if (comchl[i].uitype == "baseComponent") {
						$("#collapseTwo").append('<div class="tb-one"><span data-type="'+comchl[i].name+'" class="list-drg">'+comchl[i].name+'</span><i style="float: right;margin-right: 10px;" class="glyphicon glyphicon-hand-right"></i></div>');
					}else if(comchl[i].uitype == "mobileComponent"){
						$("#collapseThree").append('<div class="tb-one"><span data-type="'+comchl[i].name+'" class="list-drg">'+comchl[i].name+'</span><i style="float: right;margin-right: 10px;" class="glyphicon glyphicon-hand-right"></i></div>');
						
					}
					else{
						$("#collapseOne").append('<div class="tb-one"><span data-type="'+comchl[i].uitype+'" class="list-drg">'+comchl[i].name+'</span><i style="float: right;margin-right: 10px;" class="glyphicon glyphicon-hand-right"></i></div>');
					}
				}
				drgComponent();
			}
			//如果有数据，保存时为更新，如果没数据，保存时为新增
			win.upOrAdd = false;
		    //点击节点查询数据,显示控件列表和参数列表	    
		    //删除session
//		    sessionStorage.clear();
//		    localStorage.clear();
		    //删除html,控件树
		    $("#baseTree").children().remove();
		    
		    $(".c-drg").html("");
		 
		  	//判断单档是否存在，如果存在查询出来使用，不存在添加一个空白form
		  	
//		   	let data = daSearch(treeNode.id);		   
			let data = JSON.parse(sessionStorage.getItem(treeNode.id)); 
			//如果在c-left和c-right都显示的情况下进来，再减去430，这是不合理的。第一次进来减去430是合理的。
			if($(".c-right").is(":hidden")){
				$(".c-out").width($(".r-con").width()-430);
			   	$(".c-drg").css({"min-width":"1366px"});
			  	$(".c-left").show();
				$(".c-right").show();
			}

//			$(".c-out").width($(".r-con").width()+30);
//			win.screenWidth = $(".c-drg").width();
			if (data==""||data==undefined) {
				win.upOrAdd = true;
				win.num = 1;
				//把单档信息存入根节点
				let pon = {}
		    	pon.uitype = treeNode.uitype;
		    	pon.uiName = treeNode.uiName;
		    	pon.desc = treeNode.desc;
		    	pon.subjectName = treeNode.pId;
				pon.version = treeNode.version;
				pon.baseForm = treeNode.base;
				pon.type="TForm";
		    	let eform = new TFormControl(pon);
		    	eform.init();
			}else{
				//对数据进行修改，达到自适应的目的
//		   		let ordata = pageAdapt(data,"za");
//				win.lsdata = data;	
//				uptwo("0");
//				console.log(data)
				gol.res(data);
				//给name上增加一个类型标识
//				data[0].name = data[0].name+"["+data[0].uitype+"]";
				$.fn.zTree.init($("#baseTree"), nocliSetting,data);
			}
			if(treeNode.uitype=="Mobile"){
		 		$(".c-drg").css({"width":"375px","margin":"0 auto","min-width":"auto","border":"1px solid #dddddd","box-shadow":"2px 2px 3px #aaaaaa"});
		 	}else{
		 		$(".c-drg").css({"width":"auto","margin":"0","min-width":"1366px","border":"none","box-shadow":"0"})
		 	}
		}

	}
	//专案右击事件
	function beforeRightClick(treeId, treeNode) {
		return (!treeNode || treeNode.right != false);
	}
	function hisRightClick(event, treeId, treeNode){
	//获得鼠标位置，弹出选择菜单
		win.treeNode = treeNode;
		win.treeId = treeId;
		$(".cl-menu").css({"left":event.clientX-20,"top":event.clientY+15});
		$(".cl-menu").show();
	}
	
	//专案baseform查询
	function basSearch(data){
//		console.log(data)
		for (let i=0;i<data.length;i++) {
			if (data[i].uitype=="baseForm") {
				$("#uiname").append('<option>'+data[i].id+'</option>');
			}
			if (data[i].children!=undefined) {
				basSearch(data[i].children);
			}
		}
	}
	
	
	
	
//$(function(){
function formInit(){	
	$(".c-out").height($(".r-con").height()-60);
	let uime;
	/*左侧菜单栏展开收起动画 **/
	$("#collapseTwo").on('show.bs.collapse', function () {
		$("#collapseTwo").prev().find("i").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	});
	$("#collapseTwo").on('hide.bs.collapse', function () {
		$("#collapseTwo").prev().find("i").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});
	
	$("#collapseThree").on('show.bs.collapse', function () {
		$("#collapseThree").prev().find("i").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	});
	$("#collapseThree").on('hide.bs.collapse', function () {
		$("#collapseThree").prev().find("i").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});
	
	$("#collapseOne").on('show.bs.collapse', function () {
		$("#collapseOne").prev().find("i").removeClass("glyphicon-plus").addClass("glyphicon-minus");
	});
	$("#collapseOne").on('hide.bs.collapse', function () {
		$("#collapseOne").prev().find("i").removeClass("glyphicon-minus").addClass("glyphicon-plus");
	});
	
//	const ulDom = $("#accordion ul")
//		for (let i=0;i<ulDom.length;i++) {					
//			ulDom.children("li").eq(i+1).on('show.bs.collapse', function () {
//				ulDom.children("li").eq(i).find("i").removeClass("glyphicon-plus").addClass("glyphicon-minus");
//			});
//			ulDom.children("li").eq(i+1).on('hide.bs.collapse', function () {
//				ulDom.children("li").eq(i).find("i").removeClass("glyphicon-minus").addClass("glyphicon-plus")
//			});
//	}
	//点击空白处关闭菜单
	$(document).click(function(e){
		let _con = $(".cl-menu");                  //右键菜单
		let _menu = $(".field-menu");              //导航栏菜单（文件等） 
		if(!_con.is(e.target) && _con.has(e.target).length === 0){
		    _con.hide();
		}
		if(!_menu.is(e.target) && _menu.has(e.target).length === 0){
			if (!_menu.is(":hidden")) {
				_menu.hide();
			}
		    
		}
	});
	
	//右侧高度
	$(".c-right").height($(window).height()-60);
	$(".c-left2").height($(".c-cont").height()-60);
	
	/*左侧专案列表 **/
	let treeSession = sessionStorage.getItem("leftTree");
	if(treeSession){
		$(".c-left2").children().remove();
		let result = JSON.parse(treeSession);
		for (let item in result) {						
			let hisNode = result[item];											
			$(".c-left2").append('<ul id='+hisNode[0].name+' class="ztree"></ul>');
			$.fn.zTree.init($("#"+hisNode[0].name), hisSeting,hisNode);
		}
	}
//	$.ajax({
//		type:"GET",
//		url:win.baseUrl+"subject/list",
//		async:true,
//		success:function(result){
//			if (result.code=="0") {
//				if (result.data.length!=0) {
//					$(".c-left2").children().remove();	
//					for (let i=0;i<result.data.length;i++) {						
//						let hisNode = result.data[i].pathData;											
//						$(".c-left2").append('<ul id='+hisNode[0].name+' class="ztree"></ul>');
//						$.fn.zTree.init($("#"+hisNode[0].name), hisSeting,hisNode);
//					}
//
//				} 				
//
//			} else{
//				layer.alert(result.msg);
//			}
//			
//		}
//	});
	//菜单绑定点击事件
	$(".cl-menu").on("click","li",function(){
		$(".cl-menu").hide();
		//点击新建目录，新建一个目录父节点，点击ui，新建一个子节点。并保存专案
		let name = $(this).text();
		let showOhide = false;
		if (name=="新建目录") {
			showOhide = true;
		} else if(name=="新建UI"){
			//从专案树结构中找出类型为baseform的专案名
			let zTree = $.fn.zTree.getZTreeObj(win.treeId);
			let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
			$("#uiname").children().remove(); //删除ui模板下拉中元素。
			$("#uiname").append('<option></option>')
			basSearch(nodes);
		}
		uime = layer.open({
	    type: 1,
	    title:name,
	    id:'nui',
	    shade : 0,
//	    offset:'',
	    area: ['400px', '450px'],
//		    content: '<textarea id="testmain" class="teareabtn"></textarea><div class="tearea"><button onclick="new Function(alert('+aa+'))();" type="button" class="btn btn-warning">运行测试</button><button onclick="layerSave()" type="button" class="btn btn-success">保存</button></div>'
	    content:$('.nui'),
	    success:function (){
//	    	$(".ml").show();
	    	if (showOhide) {
	    		$(".ml").show();
	    		$(".ui").hide();
	    	} else{
	    		$(".ml").hide();
	    		$(".ui").show();
	    	}
	    }
	  });
	});
	
	//新建单档
	$("#determine").click(function(){
		let zTree = $.fn.zTree.getZTreeObj(win.treeId);		
		if ($(".ml").is(":hidden")) {    //新建ui
			//调用专案保存api
			let uiName  = $(".ui").find("input").eq(0).val();      //单档名称
			let uitype = $(".ui").find("select").eq(0).val();      //ui类型
			let baseName = $(".ui").find("select").eq(1).val();    //ui模板，baseform名称
			let desc = $(".ui").find("textarea").val();            //描述
			let author =$(".ui").find("input").eq(1).val();        //作者
			let version = $(".ui").find("input").eq(2).val();      //版本
            //查询当前节点下一级子节点是否有同名单档，如果有则不能添加
          	if(win.treeNode.children){
          		for (let i=0;i<win.treeNode.children.length;i++) {
            	if (win.treeNode.children[i].name==uiName) {
            		layer.alert(uiName+"已存在");
            		return false;
            		break;
            	}
            }
          	}
            //查询单档插入的路径
            let uiNameUrl = searchNodeHref(win.treeNode);
            uiNameUrl = uiNameUrl+"-"+uiName;
			zTree.addNodes(win.treeNode, {base:baseName,uiName:uiNameUrl,version:version,author:author,desc:desc,uitype:uitype, id:uiNameUrl, pId:win.treeNode.id, isParent:false, name:uiName,right:false});	
		 	//如果是组件，则还要添加到组件列表
		 	if(uitype=="baseComponent"){
		 		$("#collapseTwo").append('<div class="tb-one"><span class="list-drg '+uiName+'-drg">'+uiName+'</span><i style="float: right;margin-right: 10px;" class="glyphicon glyphicon-hand-right"></i></div>')
		 	}else if(uitype=="customCombo"){
		 		$("#collapseOne").append('<div class="tb-one"><span class="list-drg '+uitype+'-drg">'+uiName+'</span><i style="float: right;margin-right: 10px;" class="glyphicon glyphicon-hand-right"></i></div>')
		 	}
		 	//如果是mobile，缩小设计屏幕
		 	if(uitype=="Mobile"){
		 		$(".c-drg").css({"width":"375px","margin":"0 auto","min-width":"auto","border":"1px solid #dddddd","box-shadow":"2px 2px 3px #aaaaaa"});
		 	}else{
		 		$(".c-drg").css({"width":"auto","margin":"0","min-width":"1366px","border":"none","box-shadow":"0"})
		 	}
		 	//更新专案
		 	gol.zaupdate();
		 	layer.close(uime);
	
		} else{                          //新建目录
			let subjectName = $(".ml").find("input").val();	
			zTree.addNodes(win.treeNode, {id:subjectName, pId:win.treeNode.name, isParent:true, name:subjectName,right:true,open:false});	
			//更新专案
			gol.zaupdate();
			layer.close(uime);
		}
		
	});
	
	//新建取消
	$("#cancel").click(function(){
		layer.close(uime);
	});
	/*tab效果 **/
	$(".r-ul li").click(function(){
		$(this).addClass("actived").siblings().removeClass("actived");
		$(".r-div>div").eq($(this).index()).addClass("showdiv").siblings().removeClass("showdiv")
	});
}	

//});

	function zaSave(zaname){
//		let zTree = $.fn.zTree.getZTreeObj("javaHisTree");
		let zTree = $.fn.zTree.getZTreeObj(zaname);
		//获取根节点
		let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
//		let param = {};
//		param.subjectName = zaname;		
//		param.pathData = nodes;
//		param = JSON.stringify(param);
		let leftTree = JSON.parse(sessionStorage.getItem("leftTree"));
		leftTree = leftTree||{};
		leftTree[zaname] = nodes;
		sessionStorage.setItem("leftTree",JSON.stringify(leftTree));
//		$.ajax({
//			type:"PUT",
//			url:win.baseUrl+"subject/add",
//			async:true,
//			contentType:"application/json",
//			data:param,
//			success:function(result){
//				if (result.code=="0") {
//										
//				} else{
//					layer.alert(result.msg);
//				}
//			}
//		});
	}	

let gol = {
		//专案更新
	zaupdate(){				
		let zTree = $.fn.zTree.getZTreeObj(win.treeId);
		//获取根节点
		let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
//		let param = {};
//		param.subjectName = win.treeId;
//		param.pathData = nodes;
//		param = JSON.stringify(param);
		let leftTree = JSON.parse(sessionStorage.getItem("leftTree"));
		leftTree = leftTree||{};
		leftTree[win.treeId] = nodes;
		sessionStorage.setItem("leftTree",JSON.stringify(leftTree));
		
		
//		$.ajax({
//			type:"POST",
//			url:win.baseUrl+"subject/upd/"+win.treeId,
//			async:true,
//			contentType:"application/json",
//			data:param,
//			success:function(result){
//				if (result.code=="0") {
//										
//				} else{
//					layer.alert(result.msg);
//				}
//			}
//		});
	},
	/*
	 * 方法名：单档删除
	 * 修改时间：2019/1/11
	 * 修改原因：单档删除有两种情况，一种是选择的叶子节点，直接删除，另一种是父节点，其中有多个子节点，需要遍历删除。
	 * 新增danDangDel方法，删除单档
	 * */
	
	zaDel(){
		let _self = this;
		let zTree = $.fn.zTree.getZTreeObj(win.treeId);
		//删除专案
		if(win.treeNode.level==0){
			_self.treDel();
			 zTree.removeNode(win.treeNode);
		}else if(win.treeNode.isParent){
			layer.confirm('确定删除？', {
					btn: ['确定', '取消'],
				    yes: function(index){
				    layer.close(index);
				    if(win.treeNode.children){
				    	_self.parNodeDel(win.treeNode.children);
				    }
				    zTree.removeNode(win.treeNode);
				    _self.zaupdate();
				    $(".c-drg").html("");
				}
			});
		}else{
			layer.confirm('确定删除？', {
					btn: ['确定', '取消'],
				    yes: function(index){
				    layer.close(index);
				    _self.danDangDel(win.treeNode.id);
				    zTree.removeNode(win.treeNode);
				    _self.zaupdate();
					$(".c-drg").html("");
				}
			});
		}
	},
	
	parNodeDel(node){
		let _self = this;
		for(let i=0;i<node.length;i++){
			if(node[i].children){
				parNodeDel(node[i].children);
			}else{
				_self.danDangDel(node[i].id);
			}
		}
		_self.zaupdate();
		$(".c-drg").html("");
	},
	
	danDangDel(name){
		let _self = this;
		let zTree = $.fn.zTree.getZTreeObj(win.treeId);
		let leftTree = JSON.parse(sessionStorage.getItem("leftTree"));
		if(leftTree[name]){
			delete  leftTree[name];
		}
		
		sessionStorage.setItem("leftTree",JSON.stringify(leftTree));
//		$.ajax({
//			type:"DELETE",
//			url:win.baseUrl+"data/del/"+name,
//			async:false,
//			success:function(result){
//				if (result.code=="0") {
//					
//				}
//			}
//		});
},
	//删除专案
	treDel(){
		let leftTree = JSON.parse(sessionStorage.getItem("leftTree"));
		let preNode = win.treeId.substr(0,win.treeId.indexOf("-"));
		let zTree = $.fn.zTree.getZTreeObj(preNode);
		let delNode = zTree.getNodeByParam("id",win.treeId.substr(-1,win.treeId.indexOf("-")));
		zTree.removeNode(delNode);
		sessionStorage.setItem("leftTree",JSON.stringify(leftTree));
//		$.ajax({
//			type:"DELETE",
//			url:win.baseUrl+"subject/del/"+win.treeId,
//			async:true,
//			success:function(result){
//				if (result.code=="0") {
//				} else{
//					layer.alert(result.msg);
//				}
//			}
//		});
	},
	//页面跳转
//	pageJump(){		
//		let ax = 'vat param = {};\n param.subjectName = ""; \n param.data = ""; \n $.ajax({\ntype:"PUT",\nurl:"'+win.baseUrl+'redirect/save",\n async:true,\n contentType:"application/json",\n data:param,\n success:function(result){\n}\n});'
//		$(".teareabtn").val($(".teareabtn").val()+ax);
//	},
	
//	brforeDel(){
//		//根据id找到选中的节点
//		_self = this;
//		let zTree = $.fn.zTree.getZTreeObj("baseTree");
//		let nodes = zTree.getNodeByParam("id",win.dom);
//		_self.sessionDel(nodes);
//	},
//	sessionDel(nodes){
//		_self = this;
//		sessionStorage.removeItem(nodes.name);
//		if(nodes.children!=undefined && nodes.children!=[]){
//			for(let i=0;i<nodes.children.length;i++){
//				_self.sessionDel(nodes.children[i]);				
//			}
//		}else{			
//			sessionStorage.removeItem(nodes.name);
//		}
//	
//	},
	removeTree(){
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let nodes = zTree.getNodeByParam("id",win.dom);
		zTree.removeNode(nodes);
	},
	//点击控件选中节点
	tree(){
//		let zTree = $.fn.zTree.getZTreeObj(win.treeDom);
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
//		let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
//		console.log(nodes)
//		let nod = zTree.getNodeByTId(win.dom);
		if(zTree){
			let nod = zTree.getNodeByParam("id", win.dom);
			zTree.selectNode(nod);
		}
		
	},
		//tree中追加节点
	addNode(node){
		_self = this;
//			let zTree = $.fn.zTree.getZTreeObj(win.treeDom);
			let zTree;
			/**
			 * 修改时间：20180/9/29
			 * 修改原因：控件树要存放控件所有信息，比如宽高等。之后保存还原都用这个，而不再用local。同样当这些参数变化时，也要修改树中对应数据。
			 * 修改内容：选中框放到这里是因为要避开updataView（不能存入变量中）,并且只有第一次拖拽才有，还原时不需要。
			 * */
			
				$(win.rootDom).find("div").removeClass("cked");
				$(node.id).addClass("cked");
			
//			获取父节点信息
			if(node.parentComponent=="root"){
//				let newNode = {uitype:node.uitype,id:node.id,isParent:true, parentComponent:node.parentComponent,name:node.name+"["+node.uitype+"]",type:node.type,open:true}
//				let newNode = {};
//				for(x in node){
//					newNode[x] = node[x];
//				}
				node.name = node.name+"["+node.uitype+"]";
//				node.childOuter = false;            //tree中子元素拖拽不能在根节点之外。（对多级无效）
				$.fn.zTree.init($("#baseTree"), nocliSetting,node);
				zTree = $.fn.zTree.getZTreeObj("baseTree");
//				let childNode = zTree.getNodeByParam("id",win.dom);
//				console.log("aa")
			}else{
				zTree = $.fn.zTree.getZTreeObj("baseTree");
				let pn = zTree.getNodeByParam("id",node.parentComponent);
				//判断是否需要一些tree中的属性，比如拖拽时哪些节点不能成为父节点。
				if(node.type=="TRadioButton"||node.type=="TCheckBox"||node.type=="TSelect"||node.type=="TZtree"||node.type=="TButton"||node.type=="TCheckBox"||node.type=="TDropdown"||node.type=="TLabel"){
					node.dropInner= false;
				}
				
//				let newNode = {id:node.id, parentComponent:node.parentComponent,name:node.name,type:node.type,open:false}
				//node为this，里面有很多变量，需要遍历这些变量，组成key：value形式，放入节点。
//				let newNode = {};
//				for(x in node){
//					newNode[x] = node[x];
//				}
				zTree.addNodes(pn,node);
			}
//			let pn = zTree.getNodeByTId(node.parentComponent);
//			let newNode = {id:node.id, parentComponent:node.parentComponent,name:node.name,type:node.type,open:false}
//			zTree.addNodes(pn,newNode);
			//获取到新添加的节点，选中。
			let childNode = zTree.getNodeByParam("id",win.dom);
			zTree.selectNode(childNode);
	},
	//更新session中tree数据
	
	//源码
	htmlCode(){
		let html = '<!DOCTYPE html><html><body><div class="container-fluid"><div class="row c-drg"><div id="'+win.dom.replace("#","")+'">'+$(win.dom).html()+'</div></div></div></body></html>';
		let formatSrc = $.htmlClean(html, {
        format: true,
        allowedAttributes: [["id"], ["class"]]
    });
	layer.open({
		    type: 1,
		    title:"html",
		    id:'code',
		    shade : 0.3,
		    area: ['500px', '400px'],
		    content: '<textarea style="width:100%;height:100%;border:none;resize:none;outline:none" readonly="readonly" id="htm" class="htm"></textarea>',
		    success:function(){
		    	$("#htm").val(formatSrc);
		    }
	});
	},
		//最小化
	min(){
		$(".c-left2").toggle();
	},
	
	//删除
	removeComponent(){
		_self = this;
			//删除html
			$(win.dom).remove();
			//删除session数据
//			_self.brforeDel();
			//删除tree节点
			_self.removeTree();
	
	},
	//更换主题
	qhzt(){
		let cssHref = "css/my-css/"+$("#cssType").val();
		$("#ztcss").attr("href",cssHref);  
	},
	crossCreen(){
		let cwidth = $(".c-drg").width();
		let cheight = $(".c-drg").height();
		if(cheight>cwidth){
			$(".c-drg").width("687");
			$(".c-drg").height("375");
			$(".c-drg").children("div[data-name='TForm']").css("overflow-y","scroll");
			 
		}else{
			$(".c-drg").children("div[data-name='TForm']").css("overflow-y","visible");
			$(".c-drg").width("375");
			$(".c-drg").height("667");
		}
	},
		
	
	
	//查询baseForm
	bseFormSearch(){
		var bf = new Promise(function(resolve, reject){
        	$.ajax({
				type:"GET",
				url:win.baseUrl+"data/baseForm",
				async:true,
				success:function(result){
					resolve(result);
				}
			});
      
   	 	});
    return bf; 
	},
	//查询form
	formSearch(){
		var fo = new Promise(function(resolve, reject){
        	$.ajax({
				type:"GET",
				url:win.baseUrl+"data/text1",
		//      url:"http://192.168.123.96:8083/hp/data/testTable", 
				async:true,
				success:function(result){
					resolve(result);
//					if (result.code=="0") {
//						let iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
//						iframeWin.runTime(result.data.data.data);
//					} else{
//						layer.alert(result.msg);
//					}
				}
			});
      
   	 	});
    return fo; 
	},
	//单档保存
	save(){	
		_self = this;
		//如果是baseform，需要找到内容页面插入的地方
//		if(arr[0].uitype=="baseForm"){
//			arr[0].keypanel = win.keypanel;
//		}
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });		
		//css文件		
//		nodes[0].cssType = $("#cssType").val();

		let param = {};
		param.uiName  = nodes[0].uiName;             //单档名称
		param.desc = nodes[0].desc;                  //描述
		param.version  = nodes[0].version;            //作者
//		param.firstJson = ""                     //入口索引
		param.data = {};                    //数据
		param.data.data=nodes;
		param.versionData =[];          // 版本数据
		let mydate = new Date();
    	let str = "" + mydate.getFullYear() + "-";
    	str += (mydate.getMonth()+1) + "-";
   		str += mydate.getDate() + "-";
		let vrn = {
			"update-time":str,
			"author":nodes[0].author,
			"version":nodes[0].version,
		}
//		param = JSON.stringify(param);
		//判断单档时新增还是保存；
		if(win.upOrAdd){       //新增
			ddUrl = "data/add";
			ptype = "PUT";			
			
		}else{
			ddUrl = "data/upd/"+nodes[0].uiName;
			ptype = "POST";
		}
		param = JSON.stringify(param);
		sessionStorage.setItem(nodes[0].uiName,JSON.stringify(nodes));
		
		
//      $.ajax({
//			type:ptype,
//			contentType:"application/json", 
//			url:win.baseUrl+ddUrl,
//			data:param,
//			async:true,
//			success:function(result){
//				if(result.code==0){
//					layer.msg("操作成功", {icon: 1});
//				}else{
//					layer.alert(result.msg);
//				}
//			}
//		});
	},

	//还原	
	res(data){
		let _self = this;		
		for (let i=0;i<data.length;i++) {
			// 做转换才能赋值
			let str = JSON.stringify(data[i]); 
			let sessionData = JSON.parse(str);
			//这是当前的num
			let count = sessionData.name.replace(/[^0-9]/ig,"");
//			let count = sessionData.id.substr(6,sessionData.id.indexOf("_")-6);
	   		win.num = parseInt(count);
	   		if (win.num>win.maxNum) {
				win.maxNum = win.num;
			}
//			delete sessionData.children;
//			mode.session(sessionData.name,sessionData);
			//计算比例
//			sessionData = pageSize(sessionData);
			/**
			 * 由于操作雷同，且需要动态添加组件，所以作此修改。2018/8/31
			 * 由于textfield有三个写在一起，所以另作判断
			 */
			let clatype;
			let obType = sessionData.type;
//			if(obType=="TTextField"||obType=="TDateField"||obType=="TPassWordField"||obType=="TNumberField"||obType=="TFile"){
//				obType = "textFieldControl";
//			}
			if(sessionData.name.indexOf("[")!=-1){
				sessionData.name = sessionData.name.substr(0,sessionData.name.indexOf("["));
			}
			eval('clatype = new '+obType+'Control(sessionData)');
			clatype.render();

		if (data[i].children!=undefined) {
			_self.res(data[i].children)
		}
			
		}
		  
		win.num = win.maxNum;
	},
	codeMenu(){
		let trnum=0;
		let fnData;
		$(".codeMenu").toggle();
	  	$.ajax({
				type:"GET",
				url:win.baseUrl+"apis",
//				contentType:"application/json", 
				async:true,
				success:function(result){
					if (result.code=="0") {
//						console.log(result);
						fnData = result.data;						
						$(".codeMenu tbody").children().remove();
						for(let i=0;i<fnData.length;i++){
							if($.isArray(fnData[i].params)){
								fnData[i].params = JSON.stringify(fnData[i].params);	
							}
							$(".codeMenu tbody").append('<tr><td data-ser="'+fnData[i].serviceName+'" data-type="'+fnData[i].beanName+'">'+fnData[i].methodName+'</td><td>'+fnData[i].desc+'</td><td>'+fnData[i].serviceName+'</td><td style="display:none">'+fnData[i].params+'</td></tr>');
//							if(!win.beanName[fnData[i].beanName]){
//								win.beanName[fnData[i].beanName]=fnData[i].beanName;
//							}
							
						}
						
					} else{
						layer.alert(result.msg);
					}
				}
			});
		$(".codeMenu tbody").on({
			mouseover:function(e){
				$(this).css("background-color","#3289c7");
				$(this).siblings().css("background-color","white");
			},
			click:function(e){
//				trnum++;
				let cla = $(this).children("td").eq(0).text();
				let bean = $(this).children("td").eq(0).attr("data-type");
				let ser =  $(this).children("td").eq(0).attr("data-ser");
				let param = JSON.parse($(this).children("td").eq(3).text());
				let user = "user";
				if(ser=="LocalService"){
					user = "";
				}
				
				let code1 = "";
				let code2 = "";
				let code3 = "";
				let code4 = "";
				let code6 ="";
				let code5 = "\n//todo";
				if(param.length==0){					
					code4 = "var sev = new "+ser+"();\n"+"var result = sev."+cla+"();";
				}else{
					for(let i=0;i<param.length;i++){
						
						if(param[i].beanType=="JavaBean"){
							if(!code1){
								code1 = "var beans = new  BeanFactory();\n";
							}
							code2 = code2+"var user_"+i+" = beans.newInstance('"+param[i].beanName+"');\n";	
							
						}else{						
							code3 = code3 + "//user_"+i+" "+param[i].beanType+"\n";
							
						}
						
						code6 = code6 + ",user_"+i+"";
						
		
					}
					code4 = "var sev = new "+ser+"();\n"+"var result = sev."+cla+"("+code6.substr(1,code6.length-1)+");";
					
				}
				let oldval = $(".teareabtn").val();
				$(".teareabtn").val('');
				win.editor.setValue(oldval+code1+code2+code3+code4+code5);		
				$(".codeMenu").hide();
			},
		},"tr");
	},
	/*代码编辑后保存,*/
	/*
	 *修改时间：2018/12/19
	 *修改原因：TTablePane和TDropdown需要有里面项目的点击事件
	 *修改内容：判断item和menu是否存在，需要做特殊操作。 
	 * */
	layerSave(){
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		var nodes = zTree.getSelectedNodes();
		let eventType = $(".layui-layer-title").text();
		let code = win.editor.getValue();
		if(eventType.indexOf("item")==-1&&eventType.indexOf("menu")==-1){
			nodes[0][eventType]=code;
		}else if(eventType.indexOf("item")!=-1){
			nodes[0].item = nodes[0].item||{}
			nodes[0].item[eventType] = code;
		}else if(eventType.indexOf("menu")!=-1){
			nodes[0].menu = nodes[0].menu||{}
			nodes[0].menu[eventType] = code;
		}		
		zTree.updateNode(nodes[0]);	
	},
	/**************************************rightSelectStrat****************************************/
//	rightSelect(){
//		let con;
//		let _self;
//		$(".c-right input").off("focus");
//		$(".r-top input").on("focus",function(){
//			_self = this;
//			$(".r-sel ul").children().remove();
//			let type = $(this).attr("data-type");
//			switch (type){
//				case 'fontFamily':
//					con = "Times New Roman,SimSun,SimHei,Microsoft Yahei,KaiTi,NSimSun,FangSong"; 					
//				break;
//			}
//			if(con!=undefined && con!=""){
//			con = con.split(",");
//			let lt = $(this).offset().left-30;
//			let top = $(this).offset().top+$(this).height()+15;
//			$(".r-sel").css({"left":lt,"top":top,"z-index":101});
//			for(let i=0;i<con.length;i++){
//				 $(".r-sel ul").append('<li>'+con[i]+'</li>'); 
//			}
//			$(".r-sel").show();
//			$(".r-sel ul li").click(function(){
//				$(_self).val($(this).text());
//				$(".r-sel").hide();		
//			});
//			}
//		});
//
//		
//	}
	/**************************************rightSelectEnd****************************************/
		
}

//function reserve(name){
////	let outData = mode.local('form2');
//	$.ajax({
//		type:"GET",
//		url:win.baseUrl+"data/"+name,
////      url:"http://192.168.123.96:8083/hp/data/testTable", 
//		async:true,
//		success:function(result){
//			if (result.code=="0") {
//				$.fn.zTree.init($("#baseTree"), setting,result.data.data.data);
//				gol.res(result.data.data.data);
//			} else{
//				layer.alert(result.msg);
//			}
//		}
//	});	
//}
//键盘删除
$(document).keydown(function(event){
	if (event.keyCode==46) {
		gol.removeComponent();
	}

});
//runTime
//function jstoxml(){
//	let data = mode.local("form2");
//	runTime(data);
//}
/*************************************************baseCss************************************************/
class baseCss{
	bacss(){
		let bc = {
			"width":"",
			"height":"",
			"position":"",
			"background-color":"",
			"color":"",
			"name":"",
			"border":"",
			"font-size":"",
			"font-family":"",
			"font-style":"",
			"class":"",
			"margin":""
		}
		return bc;
	}
}
class lbcss extends baseCss{
	constructor() {
    super(); // 调用父类的constructor()
  }
	precss(){
		let _self = this;
		let tbcss = _self.bacss();
//		tbcss. 

	}
	
}

/*************************************************baseEnd************************************************/
/*
 *文件菜单相关类或方法，包括新建，打开，导入，导出等
 * 
 * */
/*************************************************fieldStart************************************************/
let jdt;
let field = {
	//文件菜单显示
	fieldMenu(){
		$(".field-menu").show();
	},
	laopen(name){
	let zaxj = layer.open({
	    type: 1,
	    title:name,
	    id:'fmenu',
	    shade : 0,
//	    offset:'',
	    area: ['400px', '400px'],
	    content:$('.addzn'),
	    success:function (){

	    }
	  });
	  return zaxj;
	}
}
//点击列表，弹出新增弹窗
$(function(){
	$(".field-menu li").click(function(){
		let name = $(this).find("a").text();		
		switch (name){
			case "新建":
			//新建专案（根节点）
			let lay = field.laopen(name);
			$(".field-menu").hide();
			break;
			case "新建js文件":
			addJsField();
			$(".field-menu").hide();
				break;	
			case "导出":
			$(".field-menu").hide();
			getComponentJs();			
				break;	
			case "新增控件":
			addComponent();
				break;	
			case "编辑控件":
			editComponent();
				break;	
			default:
				break;
		}
	});
	
//	$("#collapseTwo").on("mousedown",".tb-one",function(e){
//		if (3==e.which) {
//			alert("Aa")
//			e.preventDefault();
//			e.stopPropagation();
//		}
//		
//	});
	//导出方法
	function getComponentJs(){
		//先要查询js路径
		let addjs = "";
		let jsUrl;
		let dandangname = [];
       	for (let x in win.jsUrl) {
       		addjs = addjs+'<script type="text/javascript" src="'+win.jsUrl[x]+'" ></script>\n';	
       	}
//     	let jsUrl = win.jsUrl["TButton.js"].substr(0,win.jsUrl["TButton.js"].indexOf("outside"));
		$.ajax({
			type:"get",
			url:win.baseUrl+"jscss/root",
			async:false,
			success:function(result){
				jsUrl = result.data+"hp-design/";
			}
		});
       	//根据选中节点获取根节点名称，在获取所有叶子节点，循环执行所有叶子节点
       	let root = win.treeNode.id.substr(0,win.treeNode.id.indexOf("-"));
       	let zTree = $.fn.zTree.getZTreeObj(root);
       	let nodes = zTree.getNodesByParam("name",root);
//     	let child = nodes[0].children;
       	let child = getAllChildrenNodes(nodes[0].children,dandangname);
//     	console.log(child)
       	//循环单档需要改变win.treeNode，所以需要先另存一份。循环完成后再还原回去
       	let oldwin = win.treeNode;
       	child.forEach(function(v,i){
       		win.treeNode = v;
         	jstoxml(false);
       		eport(jsUrl,addjs,root,child.length,i+1,v.cssType);
       	});
		win.treeNode = oldwin;
	}
	function eport(jsUrl,addjs,root,tal,perce,cssType){
		let comHtml = $("#runTime").html();
		cssType=cssType||"default.css";
		cssType = jsUrl+"css/my-css/"+cssType; 
		let exportHtml = '<!DOCTYPE html>\n<html>\n<head><meta charset="utf-8" />\n'
		+'<meta name="viewport" content="width=device-width, initial-scale=1">\n'
		+'<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">\n'
		+'<title></title>\n'
		+'<link rel="stylesheet" href="'+jsUrl+'bootstrap3.0/css/bootstrap.min.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'css/my-css/base.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'css/my-css/default.css" />\n'
//		+'<link rel="stylesheet" href="'+jsUrl+'layer/mobile/need/layer.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'colorpick/css/colpick.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'layer/layui/css/layui.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'zTree/zTreeStyle/zTreeStyle.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'css/my-css/quickQuery.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'css/my-css/jquery.json-viewer.css" />\n'
		+'<link rel="stylesheet" href="'+jsUrl+'bootstrap-table/css/bootstrap-table.min.css" />\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap3.0/js/jquery-3.3.1.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'factoryjs/bean.js"></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'factoryjs/service.js"></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap3.0/js/bootstrap.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jquery-ui/jquery-ui.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/my-js/index.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/my-js/mode.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/my-js/run.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'layer/layui/layui.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/my-js/control.js" ></script>\n'
//		+'<script type="text/javascript" src="'+jsUrl+'Connect.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap-table/js/bootstrap-treeview.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/jquery.json-viewer.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'zTree/js/jquery.ztree.core.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/page.js" ></script>\n'
//		+'<script type="text/javascript" src="'+jsUrl+'layer/layer.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'colorpick/js/colpick.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/quickQuery-packer.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap-table/js/bootstrap-table.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap-table/js/bootstrap-table-zh-CN.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'bootstrap-table/js/table-tree-view.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/qrcode.lib.min.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/my-js/myQrcode.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/pdf.js" ></script>\n'
		+'<script type="text/javascript" src="'+jsUrl+'js/jq-plugIn/echarts.common.min.js" ></script>\n'
		
		
		
		+addjs
		+'</head>\n<body>\n<div id="runTime">\n'
		+comHtml
		+'</div>\n'
		+'</body>'
		+'</html>\n'
		let param = {};
		param.uiName = win.treeNode.id;
		param.data = exportHtml;
		param.subjectName="";
		param = JSON.stringify(param);
		$.ajax({
			type:"PUT",
			url:win.baseUrl+"html/save",
			contentType:"application/json",
			data:param,
			async:false,
			success:function(result){
				if (result.code=="0") {					
					//进度条
					if(!jdt){
						jdt= layer.open({
						    type: 1,
						    title:false,
						    id:'jdt',
						    shade : 0.3,
						    closeBtn: 0,
						    area: ['50%', 'auto'],
						    content: $('#progrbar'),
						});
					}
					let per = parseInt((perce/tal)*100)+"%";
					$("#progrbar>div").css("width",per);
					$("#progrbar span").text(per);
					//如果是100%，表示完成。
					if(per=="100%"){
						layer.close(jdt);
						window.location.href=win.baseUrl+"exportZip/"+root;
					}
				} 
			}
		});
	}
	
	function getAllChildrenNodes(child,dd){
		//查询出所有单档名称。		
		if (child) {
			for (let i=0;i<child.length;i++) {
				if(child[i].name!="component"){
					if(child[i].children){
						getAllChildrenNodes(child[i].children,dd);
					}else{
						//没有子元素存在一种情况是只有父节点，这种情况需要排除
						if(!child[i].isParent){
							let param = {};
							param.id = child[i].id
							dd.push(param);
						}
						
					}
				}
			}
		}
		return dd;
	}
	
	
	
	//点击model触发，生成model代码
//	$("#modal").click(function(){
//	let fileName = $("#jbform").find("input").eq(0).val();          //文件名
//	let cpontName = fileName.substr(0,fileName.indexOf("."));           //控件名
//	let claName = $("#jbform").find("select").val();                //继承类名
//	let viewhtm = $("#view textarea").val();                        //view标签
//	if (!fileName||!viewhtm) {
//		if(!fileName){
//			layer.alert('文件名不能为空');
//		}else if(!viewhtm){
//			layer.alert('view不能为空');
//		}
//		$("#modal textarea").val("");
//		return false;
//	}
//		
//		
//		
//		$("#modal textarea").val(modal); 
//	});
	
	
	
	
});

$("#addparam").click(function(){
	
	$("#modal tbody").append('<tr><td><input type="text"></td><td><input type="text"></td></tr>')
});

//点击弹窗中确定，新增专案
$("#zaadd").click(function(){
	win.treeNum++
	let zaname = $(".add-fom").find("input").val();
	//新增一个ul，用于存放树。
	$(".c-left2").append('<ul id='+zaname+' class="ztree"></ul>');
//	let trnode={id:zaname, pId:"root", isParent:true, name:zaname,right:true};
	let children = [
	{id: "test-component-TSelect", name: "TSelect", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TForm", name: "TForm", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TPopover", name: "TPopover", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTabbedPane", name: "TTabbedPane", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TGridLayout", name: "TGridLayout", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTextArea", name: "TTextArea", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TLocalStorage", name: "TLocalStorage", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TSelectTable", name: "TSelectTable", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTextField", name: "TTextField", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TDropdown", name: "TDropdown", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TFlowLayout", name: "TFlowLayout", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTimeline", name: "TTimeline", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TQrcode", name: "TQrcode", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TMobileDateField", name: "TMobileDateField", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TPanel", name: "TPanel", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TFile", name: "TFile", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TRadioButton", name: "TRadioButton", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TZtree", name: "TZtree", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TDateField", name: "TDateField", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TPassWordField", name: "TPassWordField", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TButton", name: "TButton", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TLabel", name: "TLabel", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTable", name: "TTable", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TMenuTree", name: "TMenuTree", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TTableLayout", name: "TTableLayout", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TCheckBox", name: "TCheckBox", pId: "test-component", uitype: "baseComponent"},
	{id: "test-component-TEchartLine", name: "TEchartLine", pId: "test-component", uitype: "baseComponent"}
	];








	let trnode = {
		"id":zaname,
		"pId":"root",
		"isParent":true,
		"name":zaname,
		"right":true,
		"children":[
			{
			"id":zaname+"-component",
//			"isParent":true,
			"pId":zaname,
			"name":"component",
			"right":true,
			"children":children
			}
		]
	}
	
	
	$.fn.zTree.init($("#"+zaname+""), hisSeting,trnode);
	zaSave(zaname);
	layer.closeAll();
});
//点击取消退出新增
$("#zacancel").click(function(){
	layer.closeAll();
});
//编辑控件
function editComponent(){
	layer.open({
	    type: 1,
	    title:"编辑控件",
	    id:'edit',
	    shade : 0,
	    area: ['40%', '30%'],
	    content: $('#editcpt'),
	    success:function(){
	    	let cdom = $("#collapseTwo>div");
			for (let i=0;i<cdom.length;i++) {
				let cname = $(cdom[i]).find("span").text();
				$("#editcpt select").append('<option>'+cname+'</option>');
			}
	    }
	});
}
//新增js文件
function addJsField(){
	layer.open({
	    type: 1,
	    title:'新建js文件',
	    id:'jsfield',
	    shade : 0,
	    zIndex:9,
	    area: ['100%', '100%'],
	    content: $('#addjsfield'),
	    success:function(){
	    	if(!win.customJs){
	    		win.customJs = codeTips("customjs");
	    	}
	    	
	    }
	});
}

//保存新增的js文件
function addCustomJsField(){
	let jsname = $(".addjsfieldin input").val();
	let code = win.customJs.getValue();
	if(jsname){
		let param = {};
		param.data = code;
		param.fileName = jsname;
		param = JSON.stringify(param);
		$.ajax({
	      	type:"POST",
	      	url:win.baseUrl+"jscss/save",
	      	async:true,
	      	contentType:"application/json",
	      	data:param,
	      	success: result => {
	      		if(result.code=="0"){
	      			layer.alert("保存成功");
	      		}
		        
		     },
		    error: err => {
		       
		     }
	    });
	}else{
		layer.alert("请输入文件名")
	}
	
//	layer.close(layer.index);
}
//新增控件
function addComponent(type){
	//编辑也会进入这里，需要对编辑做判断.
	let editOrAdd;
	let name = "新增控件";
	if(type=='edit'){
		editOrAdd = $("#editcpt select").val();
		name = "编辑控件"
		layer.close(layer.index);
	}
	layer.open({
	    type: 1,
	    title:name,
	    id:'code',
	    shade : 0,
	    area: ['100%', '100%'],
	    content: $('#addcpt'),
	    success:function(){
	    	if(type=='edit'){
	    		editCode(editOrAdd);
	    	}
	    }
	});
}

//编辑控件中的还原代码。
function editCode(cname){
	$.ajax({
		type:"GET",
		url:win.baseUrl+"jscss/getContent/"+cname+".js",
		async:true,
		success:function(result){
			let jsCode = result.data;
			//继承类名
			let claName =$.trim(jsCode.substr(jsCode.indexOf("extends")+8,jsCode.indexOf("{")-jsCode.indexOf("extends")-8)); 
			let constructor = jsCode.substr(jsCode.indexOf("this"));
			$("#secondname").val(cname);
			$("#jbform select").val(claName);
			//初始化参数组,model
			let conThis = constructor.substr(0,constructor.indexOf("}"));
			conThis = conThis.split(";");
			conThis.pop();
			let conHtml = '';
			let defHtml = {};
			let cdeflut = ['width','height','pan','text','posType','fontSize','fontColor','bgColor','bgColor','fontStyle','fontWeight','zIndex','border','margin','padding','cursor','float','order','flex','alignSelf']
			conThis.forEach(function(v,i){
				if(v){
					let ckey = $.trim(v.substr(v.indexOf("posion.")+7,v.indexOf("||")-v.indexOf("posion.")-7));
					let val = $.trim(v.substr(v.indexOf("||")+2));
					val = val.substr(1,val.length-2)
					if(val=="null"||val=="undefined"||val==null||val=="ul"){
						val="";
					}
					if($.inArray(ckey,cdeflut)==-1 ){
						conHtml = conHtml+'<tr><td><input type="text" value='+ckey+'></td><td><input type="text" value='+val+'></td></tr>'
					}else{
						defHtml[ckey] = val
					}
				}	
			});
			
			if(conHtml){
				$("#modal tbody").append(conHtml);
			}
			if(!$.isEmptyObject(defHtml)){
				let defcom = $("#modal .list-group li");
				for (let j=0;j<defcom.length;j++) {
					let lname = $(defcom[j]).find("label").text();
					lname = lname.substr(0,lname.length-1);
					if(defHtml[lname]){
						$(defcom[j]).find("input").val(defHtml[lname]);
					}
				}
			}
			
			//classCode
			let cusCode = constructor.substr(constructor.indexOf("//customCode")+12);
			cusCode = cusCode.substr(0,cusCode.length-2);
			let claCode;
			let myCode ="";
			if(cusCode.indexOf("//customCode2")==-1){
				claCode = cusCode;
			}else{
				claCode = cusCode.substr(0,cusCode.indexOf("//customCode2")-15);
				myCode = cusCode.substr(cusCode.indexOf("//customCode2")+13);
			}			
			$("#modal textarea").val(claCode);
			$("#customCode textarea").val(myCode);
			
			
			//view
			constructor = constructor.substr(constructor.indexOf("<"));
			let viewHtml = constructor.substr(0,constructor.indexOf("')"));
			let nam = " name="+cname+"_'+win.num+' data-name=\""+cname+"\""
			viewHtml = viewHtml.replace(nam,'').replace("'+divId+'\g",'{id}');
			$("#view textarea").val(viewHtml);
			
			//event
			constructor = constructor.substr(constructor.indexOf("addHtm()"));
			let ent = constructor.substr(0,constructor.indexOf("}"));
			ent = ent.split(";");
			let emap = {};
			ent.forEach(function(v,i){
				if(v.indexOf("plcparam.eventList")!=-1){
//					plcparam.eventList.click = "click";
					let ekey = $.trim(v.substr(v.indexOf("t.")+2,v.indexOf("=")-v.indexOf("t.")-2));
					emap[ekey] = ekey;
				}
			});
			let evml = $("#event form>div");
			for (let i=0;i<evml.length;i++) {
				let ckname = $(evml[i]).find("input").attr("name");
				if(emap[ckname]){
					$(evml[i]).find("input").prop("checked",true);
				}
			}
			
			
//			console.log(jsCode)
		}
	});
}



//确定新增控件
function submitComponent(){
	//基本设置
	let cpontName = $("#jbform").find("input").eq(0).val();         //控件名
	let fileName = cpontName+".js";                                 //文件名
	let claName = $("#jbform").find("select").val();                //继承类名
	let width = $("#jbform").find("input").eq(2).val()||"auto";     //宽度
	let height = $("#jbform").find("input").eq(3).val()||"auto";    //高度
	let rolecss = $("#jbform").find("input").eq(4).val();           //css作用标签
	let viewhtm = $("#view textarea").val();                        //view标签
	let vevent = "" ;                                                //event中内容
	
	//model中新增属性，每有一个属性，就要生成一个set，get。
	let ctm = "";                                                   //放到addHtm（）中去的属性
	let setOrGet = "";                                              //set/get;
	let upset = "";                                                 //updataView()中使用的新增属性
	let model = $("#modal tbody tr");
	let deft = "";
	let perdeft = "";
	let sdt = "";
	//model中自定义的set/get方法
	let fncName = {};                             //自定义的方法名集合。
	let customFnc = "//customCode \n"+$("#modal textarea").val();
	if (customFnc) {
		let fnme = customFnc.split("&;");
		fnme.forEach(function(v,j){
			let cnm = $.trim(v.substr(0,v.indexOf("(")));
			fncName[cnm] = cnm;
		});
	let reg=new RegExp("&;","g");
	customFnc = customFnc.replace(reg,"\n")
//	customFnc = customFnc.replace("},\g","}\n");
//	if (!fncName["customEvent"]) {
//		sdt = 'customEvent() {\n let _self = this;\n}\n';
//	}
	}
	if (!fncName["setCustom"]) {
		sdt = 'setCustom() {\n let _self = this;\n}\n';
	}
	//model中新增参数
	if (model.length!=0) {
		for (let i=0;i<model.length;i++) {
			//获取每行第一列的属性名
			let param = $(model[i]).find("input").eq(0).val(); 
			let pavl = $(model[i]).find("input").eq(1).val(); 
			if (param) {				
				ctm = ctm + 'plcparam.properties.'+param+' = "'+param+'"; \n';
				let plcNm = param.replace(/\s[a-z]/g, function($1) {return $1.toLocaleUpperCase()}).replace(/^[a-z]/, function($1) {return $1.toLocaleUpperCase()});
			//判断是否自定义了set/get
			if(!fncName["set"+plcNm]){
				let sg = 'set'+plcNm+'(val){\n let _self = this;\n if(_self.pan){\n $(_self.id).find(_self.pan).css("'+param+'",val);\n'
						+'}else{\n $(_self.id).css("'+param+'",val);\n }\n }\n'	
						+'get'+plcNm+'(){\n let _self = this;\n return _self.'+param+'\n }\n';
				setOrGet = setOrGet + sg;
			}
						
				upset = upset+'_self.set'+plcNm+'(_self.'+param+'); \n'
				//判断是否有值
				if (param) {
					if(pavl){
						deft = deft + 'this.'+param+'= posion.'+param+'||"'+pavl+'";\n'
					}else{
						deft = deft + 'this.'+param+'= posion.'+param+'||null;\n'
					}
					
				}
			}
		}
	}
	
	//model默认参数设置(分为两部分，width，height，position，rolecss要放到前面，提前执行，因为放到objJson中初始化，updataView中设置，会使leftborder不准确)
	let moli = $("#modal li");	
	for (let k=0;k<moli.length;k++) {
		let nme = $(moli[k]).find("label").text().replace(":","");
		let pval = $(moli[k]).find("input").val();
		if(pval){
			//前四个属性单独放
//			if(k<4){
				perdeft = perdeft + 'this.'+nme+'= posion.'+nme+'||"'+pval+'";\n';
//			}else{
//				deft = deft + 'this.'+nme+'= "'+pval+'";\n';
//			}
			
		}
		
	}
	
	
	
	//事件选项框
	let ent  = $("#event input");
	for (let j=0;j<ent.length;j++) {
		if ($(ent[j]).prop("checked")) {
			let nm = $(ent[j]).attr("name");
			vevent = vevent+'plcparam.eventList.'+nm+' = "'+nm+'"; \n';
		}
	}
	//类外自定义方法
	let customCode = $("#customCode textarea").val();
	if(customCode){
		customCode = customCode.replace("&;/g","\n");
	}
	
	
//	vevent = vevent.replace(/,/g,"\n");
//	setAndGet = setAndGet.replace(/,/g,"\n");
	if (!fileName||!viewhtm) {
		if(!fileName){
			layer.alert('文件名不能为空');
		}else if(!viewhtm){
			layer.alert('view不能为空');
		}
		$("#modal textarea").val("");
		return false;
	}
		
	let rehtm = viewhtm.replace(/{id}/g,"'+divId+'");
	let nwhtm = rehtm.replace("<div","<div name="+cpontName+"_'+win.num+'"+" data-name=\""+cpontName+"\"");	
		
	let modal = 'class '+cpontName+'Control extends '+claName+' {\n'
	+'constructor(posion) {\n'
	+'super(posion);\n '+perdeft+deft+' }\n'
	
	+'init(){\n let _self = mode.comRelationship(this);\n this.view();\n this.objJson(); \n this.updataView();\n this.updataViewRight(); \n this.setCustom();\n this.drag();\n'
	+'this.bingBorder();\n this.bindChangeEvent();\n  this.colorControl();\n \ngol.addNode(this);\n this.pushAction();\n}\n'
	
//	+'initPosition(){\n let _self = this;\n '+perdeft+'' 
//	+'_self.posion = mode.comRelationship(_self.posion)\n }\n'
	
	+'render(){\nthis.view();\n this.updataView();\n this.updataViewRight(); \n this.drag();\n this.setCustom();\n this.bingBorder();\n'
    +'this.bindChangeEvent();\n  this.colorControl();\n }\n'	
    
    +'view(){\n let _self = this;\n _self.id = _self.id||"#'+cpontName+'_"+Math.random().toString(36).substr(2);\n'
    +'let divId = _self.id.replace("#","");\n'
    +'$(_self.parentId).append(\''+nwhtm+'\')\n'	
    +'$(_self.id).css({"position":_self.posType,"width":_self.width,"height":_self.height,"left":_self.left,"top":_self.top});\n}\n'
//  +'$(win.rootDom).find("div").removeClass("cked");\n $(_self.id).addClass("cked");\n}\n'
    
    +'objJson(){\n let _self = this;\n _self.id=_self.id;\n _self.name=$(_self.id).attr("name");\n'
    +'let divId = _self.id.replace("#","");\n _self.viewHtml =\''+nwhtm+'\'\n'	
//  +''+deft+''
	+'_self.x = _self.getX();\n _self.y=_self.getY();\n _self.leftBorder = _self.getLeftBorder();\n _self.topBorder = _self.getTopBorder();\n'
    +'}\n'
    
    +'updataView(){\n let _self = this;\n'
    +' _self.plcUpView();\n '+upset+' \n}\n'
    
    +' addHtm(){\n let _self = this;\n let plcparam = _self.paramHtml();\n'+ctm+vevent+' \n _self.creatHtml(plcparam);\n }\n'
    
//  +'viewEvent(){\n let _self = this;\n '+vevent+'\n}\n'
    
    //待修改
    +'updataViewRight(pamName){\n let _self = this;\n win.dom = _self.id;\n win._self = _self;\n'
    +'if (!pamName) {\n _self.addHtm();\n }\n'
    +'let inpt = $(".c-right .r-top tbody").find("input");\n for (let i=0;i<inpt.length;i++) {\n'
    +'let name = inpt.eq(i).attr("data-type");\n let fnc = name.replace(/\\s[a-z]/g,function($1){return $1.toLocaleUpperCase()}).replace(/^[a-z]/,function($1){return $1.toLocaleUpperCase()});\n'
    
    +'if(pamName){\n if(name==pamName){\n eval("_self."+name+"=_self.get"+fnc+"();");\n'
    +'if(name == checked || name == "visible"){\n'
    +'eval("inpt.eq(i).val(_self.get"+fnc+"());");\n }else{\n eval("inpt.eq(i).val(_self.get"+fnc+"());");\n }\n break;\n }\n }else{\n'
    +'if(name == "checked" || name == "visible"){\n eval("inpt.eq(i).attr(\'checked\',_self.get" + fnc + "());");\n'
    +'}else{\n eval("inpt.eq(i).val(_self.get"+fnc+"());");\n }\n}\n}\n}\n'
    
//  +'if(name == "checked" || name == "visible"){\n eval("inpt.eq(i).val(_self.get"+fnc+"());");\n'
//  +'}else{\n eval("inpt.eq(i).val(_self.get"+fnc+"());");}\n\n}\n}\n'    
    +setOrGet+sdt+customFnc

	+'\n}\n'//最外层
	//类外自定义方法
	+'//customCode2\n'+customCode;
	
	
	
	let param = {};
	param.data = modal;
	param.fileName = fileName;
	param = JSON.stringify(param);
	$.ajax({
      	type:"POST",
      	url:win.baseUrl+"jscss/save",
      	async:true,
      	contentType:"application/json",
      	data:param,
      	success: result => {
      		if(result.code=="0"){
      			layer.alert("保存成功");
      		}
	        
	     },
	    error: err => {
	       
	     }
    });

}

//返回功能
function goBack(){						
	window.history.go(-1);

}

/*************************************************fieldEnd************************************************/
$(".c-drg").attr("tabindex",0);	
$(".h-top .toolbar li").click(function(){
	$(".c-drg").focus();
});
$(".c-drg").on('keydown',function(e){
	if( (e.keyCode === 90) && e.ctrlKey){		
		undoOperation()
//		let comCol;
//		
//		if(actionStackPointer>=0){
//			if(actionStack[actionStackPointer].ctype=="tree"){
//				//删除当前节点
//				let zTree = $.fn.zTree.getZTreeObj("baseTree");
//				let nodes = zTree.getNodeByParam("id",actionStack[actionStackPointer].undo[0].id);
//				zTree.removeNode(nodes);
//				let pnds = zTree.getNodeByParam("id",actionStack[actionStackPointer].undo[0].parentComponent);
//				zTree.addNodes(pnds,actionStack[actionStackPointer].undo[0]);
//				$(actionStack[actionStackPointer].undo[0].id).remove();
//				gol.res(actionStack[actionStackPointer].undo);
//				
//			}else{
//				if(actionStack[actionStackPointer].undo){
//					$(actionStack[actionStackPointer].undo.id).remove();
//					let arry = [];
//					arry.push(actionStack[actionStackPointer].undo)
//					gol.res(arry);
//					let zTree = $.fn.zTree.getZTreeObj("baseTree");
//					zTree.updateNode(actionStack[actionStackPointer].undo);
//					
//				}else{
//					win.dom = actionStack[actionStackPointer].id;
//					gol.removeComponent();
//				}
//			}
//		}

	   
	}else if( (e.keyCode === 89) && e.ctrlKey && ( actionStackPointer < actionStack.length ) ){
		redoOperation()
//		if(actionStack[actionStackPointer].ctype=="tree"){
//			let zTree = $.fn.zTree.getZTreeObj("baseTree");
//			let nodes = zTree.getNodeByParam("id",actionStack[actionStackPointer].redo[0].id);
//			zTree.removeNode(nodes);
//			let pnds = zTree.getNodeByParam("id",actionStack[actionStackPointer].redo[0].parentComponent);
//			zTree.addNodes(pnds,actionStack[actionStackPointer].redo[0]);
//			$(actionStack[actionStackPointer].redo[0].id).remove();
//			gol.res(actionStack[actionStackPointer].redo);
//			
//			
//			
//		}else{
//			if(actionStack[actionStackPointer].redo){
//				$(actionStack[actionStackPointer].redo.id).remove();
//				let arry = [];
//				arry.push(actionStack[actionStackPointer].redo)
//				gol.res(arry);
//				let zTree = $.fn.zTree.getZTreeObj("baseTree");
//				zTree.updateNode(actionStack[actionStackPointer].redo);
//			}else{
//				eval('comCol = new '+actionStack[actionStackPointer].type+'Control(actionStack[actionStackPointer])');
//				comCol.render();
//				gol.addNode(actionStack[actionStackPointer]);
//			}
//		}
		
	}else if (e.keyCode == 86 && e.ctrlKey) {  
		if(win.copy){
			pasteComponent();
		} 
    }else if(e.keyCode == 67 && e.ctrlKey){
    	copyComponent();
    }else if(e.keyCode == 88 && e.ctrlKey){
    	shearComponent();
    }
});
//上一步，下一步
function undoOperation(){
//	let comCol;
	actionStackPointer --;
	if(actionStackPointer>=0){
		if(actionStack[actionStackPointer].ctype=="tree"){
			//删除当前节点
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			let nodes = zTree.getNodeByParam("id",actionStack[actionStackPointer].undo[0].id);
			zTree.removeNode(nodes);
			let pnds = zTree.getNodeByParam("id",actionStack[actionStackPointer].undo[0].parentComponent);
			zTree.addNodes(pnds,actionStack[actionStackPointer].undo[0]);
			$(actionStack[actionStackPointer].undo[0].id).remove();
			gol.res(actionStack[actionStackPointer].undo);
			
		}else{
			if(actionStack[actionStackPointer].undo){
				$(actionStack[actionStackPointer].undo.id).remove();
				let arry = [];
				arry.push(actionStack[actionStackPointer].undo)
				gol.res(arry);
				let zTree = $.fn.zTree.getZTreeObj("baseTree");
				zTree.updateNode(actionStack[actionStackPointer].undo);
				
			}else{
				win.dom = actionStack[actionStackPointer].id;
				gol.removeComponent();
			}
		}
	}
}

function redoOperation(){
	let comCol;
	if(actionStack[actionStackPointer].ctype=="tree"){
		let zTree = $.fn.zTree.getZTreeObj("baseTree");
		let nodes = zTree.getNodeByParam("id",actionStack[actionStackPointer].redo[0].id);
		zTree.removeNode(nodes);
		let pnds = zTree.getNodeByParam("id",actionStack[actionStackPointer].redo[0].parentComponent);
		zTree.addNodes(pnds,actionStack[actionStackPointer].redo[0]);
		$(actionStack[actionStackPointer].redo[0].id).remove();
		gol.res(actionStack[actionStackPointer].redo);
		
		
		
	}else{
		if(actionStack[actionStackPointer].redo){
			$(actionStack[actionStackPointer].redo.id).remove();
			let arry = [];
			arry.push(actionStack[actionStackPointer].redo)
			gol.res(arry);
			let zTree = $.fn.zTree.getZTreeObj("baseTree");
			zTree.updateNode(actionStack[actionStackPointer].redo);
		}else{
			eval('comCol = new '+actionStack[actionStackPointer].type+'Control(actionStack[actionStackPointer])');
			comCol.render();
			gol.addNode(actionStack[actionStackPointer]);
		}
	}
	actionStackPointer ++;
}







//pdf
function showpdf(name,Url){
//  var url = Url;
//	var url = "http://192.168.123.245:8090/hp/fileView/pdf?filePath=PDF\18\07\000000000157/180711000008_%E4%BD%8F%E9%99%A2%E8%AF%81_1"
	$("#runTime div[name="+name+"]").html("");
//	$("#runTime div[name="+name+"]").append('<canvas id="the-canvas" style="width: 100%;"></canvas>');
//	var url = "http://192.168.123.51:8080/javahis5/EMRWebFileViewServlet?pdfPath=PDF\18\07\000000000157/180711000008_%E4%BD%8F%E9%99%A2%E8%AF%81_1";
	PDFJS.workerSrc = 'http://192.168.123.245:8060/hp/js/jq-plugIn/pdf.worker.js';//加载核心库
	PDFJS.getDocument(Url).then(function getPdfHelloWorld(pdf) {
	for (var i = 0; i < pdf.numPages; i++) {
    pdf.getPage(i+1).then(function getPageHelloWorld(page) {
      var scale = 1.5;
      var viewport = page.getViewport(scale);

      //
      // Prepare canvas using PDF page dimensions
      //
      var canvas = document.createElement('canvas');
      var context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // 这里拿body当pdf容器
//    document.body.appendChild(canvas);
		$("#runTime div[name="+name+"]").append(canvas);
		$("#runTime div[name="+name+"] canvas").css("width","100%");
      //
      // Render PDF page into canvas context
      //
      page.render({canvasContext: context, viewport: viewport});
    });
	}	
	});
//	$("#runTime div[name="+name+"] canvas").css("width","100%");
}
/**************************************i18nstart****************************************/
function i18n(){
	$.ajax({
		type:"get",
		url:"js/my-js/mobel.json",
		async:true,
		success:function(result){
			let reobj = {};
			result = result.language;
			result.forEach(function(v,i){
				let param = {}
				v.property.forEach(function(m,j){
					param[m.code] = m.valueString;
				});
				reobj[v.code] = param;
				
			});
			let langage = $("#languageType").val();
			i18nBegin(reobj,langage);
		}
	});
}

function i18nBegin(result,langage){
	$("[i18n]").each(function(dm){
		let i18nKey = $(this).attr("i18n");
		$(this).text(result[i18nKey][langage]);
//		if(i18nKey && result[i18nKey]){
//			for (let i=0;i<result[i18nKey].length;i++) {
//				if(result[i18nKey][i].code==langage){
//					let text = result[i18nKey][i][valueString];
//					let type = $(this).attr("data-name")
//					switch (type){
//						case "TLabel":
//						$(this).find("label").text(text);
//							break;
//						case "TButton":
//						$(this).find("span").text(text);
//							break;
//						case "TCheckBox":
//						$(this).find("span").text(text);
//							break;
//						case "TDateField":
//							break;
//						case "TDropdown":
//							break;
//						case "TEchartLine":
//							break;
//						case "TFile":
//							break;
//						case "TFlowLayout":
//							break;
//						case "TForm":
//							break;
//						case "TGridLayout":
//							break;
//						case "TMenuTree":
//							break;
//						case "TMobileDateField":
//							break;
//						case "TPanel":
//							break;
//						case "TPassWordField":
//							break;
//						case "TPopover":
//							break;
//						case "TQrcode":
//							break;
//						case "TRadioButton":
//							break;
//						case "TSelect":
//						$(this).find("select").val(text);
//							break;	
//						case "TSelectTable":
//							break;
//						case "TTabbedPane":
//							break;
//						case "TTable":
//							break;
//						case "TTableLayout":
//							break;
//						case "TTextArea":
//							break;
//						case "TTextField":
//						$(this).find("input").val(text);
//							break;
//						case "TTimeline":
//							break;
//						case "TZtree":
//							break;
//						default:
//							break;
//					}
//					break;
//				}
//			}
//			
//		}
	})
}






/**************************************i18nend****************************************/