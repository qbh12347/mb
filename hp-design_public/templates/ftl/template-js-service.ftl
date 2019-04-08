<#list services as service>
function ${service.serviceName}(){
}

${service.serviceName}.prototype={
<#if (service.methods?size>0)>
	<#list service.methods as method>
    <#if method_has_next>
	${method.methodName}:function(<#list method.paramBeans as paramBean><#if paramBean_has_next>${paramBean.value},<#else>${paramBean.value}</#if></#list>){
		var isLogInSuccess;
		<#if method.logIn>
		$.ajax({
			type:'GET',
			<#if remoteApiSwitch>
			url: "/userToken/get<#list method.logInparam as logInparam>/"+${logInparam}+"</#list>",
			<#else>
			url: "${remoteApiUrl}/userToken/get<#list method.logInparam as logInparam>/"+${logInparam}+"</#list>",
			contentType: "application/json",
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			</#if>
			async: false,

			success: function (data) {
				isLogInSuccess = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest,textStatus,errorThrown);
			}
		});

		if(isLogInSuccess == undefined){
			alert("登陆失败");
			return;
		}
		if(!isLogInSuccess){
			alert("用户名密码不正确");
			return;
		}
		</#if>

		var json={
			"Type":"CALL",
			"serviceName":"${service.serviceName}","methodName":"${method.methodName}",
            "param":[
			<#list method.paramBeans as paramBean>
				<#if paramBean_has_next>
				{
					"seq":${paramBean.seq},
					"beanType":"${paramBean.beanType}",
					"beanClass":"${paramBean.beanClass}",
					"beanName":"${paramBean.beanName}",
					"value":${paramBean.value}
				},
				<#else>
				{
					"seq":${paramBean.seq},
					"beanType":"${paramBean.beanType}",
					"beanClass":"${paramBean.beanClass}",
					"beanName":"${paramBean.beanName}",
					"value":${paramBean.value}
				}
				</#if>
			</#list>
			]
		};

		var result;

		$.ajax({
			type:'POST',
			<#if remoteApiSwitch>
			url: "/base/${service.name}/${method.methodName}",
			<#else>
			url: "${remoteApiUrl}/base/${service.name}/${method.methodName}",
			</#if>
			async: false,
			contentType:"application/json; charset=utf-8",
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			data:JSON.stringify(json),

			//success : function(data1,status1) {
				//var p=JSON.stringify(data1);
				//var result = $.parseJSON(p);
				//$.each(result, function(k, v) {
				//	if (result["Type"] == 'RETURN') {
				//		var array=result["param"]
				//		var calArray = null;
				//		for (var i=0;i<array.length;i++) {
				//			if (array[i]["beanType"] == 'JavaBean') {
				//				var f=BeanFactory(beanname);
				//				var tempJson = array[0]["value"]
				//				$.each(tempJson, function(key, value) {
				//					f.setValueByName(key, value);
				//				});
				//			}
				//			calArray.push(array[i]["beanName"]);
				//		}
				//	}
				//});
				//return result;
			//},
			success: function (data) {
				result = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("请求失败");
				console.log(XMLHttpRequest,textStatus,errorThrown);
				result = null;
			}
		});

		<#if method.logOut>
		var isLogOutSuccess;
		$.ajax({
			type:'GET',
			<#if remoteApiSwitch>
			url: "/userToken/remove",
			<#else>
			url: "${remoteApiUrl}/userToken/remove",
			</#if>
			async: false,
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			success: function (data) {
				isLogOutSuccess = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest,textStatus,errorThrown);
			}
		});
		if(isLogOutSuccess == undefined){
			//return;
		}
		if(!isLogOutSuccess){
			alert("注销失败");
			//return;
		}
		</#if>
		return result;
	},
    <#else>
		${method.methodName}:function(<#list method.paramBeans as paramBean><#if paramBean_has_next>${paramBean.value},<#else>${paramBean.value}</#if></#list>){
		var isLogInSuccess;
		<#if method.logIn>
		$.ajax({
			type:'GET',
			<#if remoteApiSwitch>
			url: "/userToken/get<#list method.logInparam as logInparam>/"+${logInparam}+"</#list>",
			<#else>
			url: "${remoteApiUrl}/userToken/get<#list method.logInparam as logInparam>/"+${logInparam}+"</#list>",
			contentType: "application/json",
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			</#if>
			async: false,

			success: function (data) {
				isLogInSuccess = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest,textStatus,errorThrown);
			}
		});

		if(isLogInSuccess == undefined){
			alert("登陆失败");
			return;
		}
		if(!isLogInSuccess){
			alert("用户名密码不正确");
			return;
		}
		</#if>

		var json={
			"Type":"CALL",
			"serviceName":"${service.serviceName}","methodName":"${method.methodName}",
            "param":[
		<#list method.paramBeans as paramBean>
			<#if paramBean_has_next>
				{
					"seq":${paramBean.seq},
					"beanType":"${paramBean.beanType}",
					"beanClass":"${paramBean.beanClass}",
					"beanName":"${paramBean.beanName}",
					"value":${paramBean.value}
				},
			<#else>
				{
					"seq":${paramBean.seq},
					"beanType":"${paramBean.beanType}",
					"beanClass":"${paramBean.beanClass}",
					"beanName":"${paramBean.beanName}",
					"value":${paramBean.value}
				}
			</#if>
		</#list>
			]
		};

		var result;

		$.ajax({
			type:'POST',
		<#if remoteApiSwitch>
			url: "/base/${service.name}/${method.methodName}",
		<#else>
			url: "${remoteApiUrl}/base/${service.name}/${method.methodName}",
		</#if>
			async: false,
			contentType:"application/json; charset=utf-8",
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			data:JSON.stringify(json),

			//success : function(data1,status1) {
				//var p=JSON.stringify(data1);
				//var result = $.parseJSON(p);
				//$.each(result, function(k, v) {
				//	if (result["Type"] == 'RETURN') {
				//		var array=result["param"]
				//		var calArray = null;
				//		for (var i=0;i<array.length;i++) {
				//			if (array[i]["beanType"] == 'JavaBean') {
				//				var f=BeanFactory(beanname);
				//				var tempJson = array[0]["value"]
				//				$.each(tempJson, function(key, value) {
				//					f.setValueByName(key, value);
				//				});
				//			}
				//			calArray.push(array[i]["beanName"]);
				//		}
				//	}
				//});
				//return result;
			//},
			success: function (data) {
				result = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				alert("请求失败");
				console.log(XMLHttpRequest,textStatus,errorThrown);
				result = null;
			}
		});

		<#if method.logOut>
		var isLogOutSuccess;
		$.ajax({
			type:'GET',
			<#if remoteApiSwitch>
			url: "/userToken/remove",
			<#else>
			url: "${remoteApiUrl}/userToken/remove",
			</#if>
			async: false,
			//加上 xhrFields及crossDomain
			xhrFields: {
				//允许带上凭据
				withCredentials: true
			},
			crossDomain: true,
			success: function (data) {
				isLogOutSuccess = data;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest,textStatus,errorThrown);
			}
		});
		if(isLogOutSuccess == undefined){
			//return;
		}
		if(!isLogOutSuccess){
			alert("注销失败");
			//return;
		}
		</#if>
		return result;
	}
    </#if>
	</#list>
</#if>
}

</#list>





