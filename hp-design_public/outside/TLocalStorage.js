class TLocalStorageControl extends publicFn {
	constructor(posion) {
		super(posion);
		this.type = "TLocalStorage";
	}
	render(){
		this.init();
	}
	init() {
	let _self = this;
	win.num++
	let zTree = $.fn.zTree.getZTreeObj("baseTree");
	if(!zTree){
		return false;
	}
	let nodes = zTree.getSelectedNodes();
	if(nodes.length==0){
		nodes = zTree.getNodesByFilter(function (node) { return node.level == 0 });
	}
	let name = "TLocalStorage_"+win.num;
//	let name = "TLocalStorage";
	_self.id = name;
	_self.pId = nodes[0].id;
	_self.isParent = false;
	_self.name = name;
	zTree.addNodes(nodes[0],_self);
	}
	setItem(key,val){
		key= key.toLocaleString();
		if(typeof val =="object"){
			val = JSON.stringify(val);
		}
		val = val.toLocaleString();
		localStorage.setItem(key,val);
//		let zTree = $.fn.zTree.getZTreeObj("baseTree");
//		let nodes = zTree.getNodeByParam("id","TLocalStorage");
//		nodes[key] = val;	
	}
	
	getItem(key){
		return localStorage.getItem(key);
	}
	removeItem(key){
		localStorage.removeItem(key);
	}
	clearItem(){
		localStorage.clear();
	}
	addHtm() {
		let _self = this;
		let plcparam = _self.paramHtml();

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
		$(".c-right tbody tr").eq(0).find("input").val(_self.name);
	}
}