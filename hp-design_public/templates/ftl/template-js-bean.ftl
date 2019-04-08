<#list beans as bean>
    function ${bean.beanName}(){
        <#list bean.params as p>
        this.${p};
        </#list>
    }

	${bean.beanName}.prototype={
		<#list bean.params as p>
		set${p ? cap_first}:function(${p}){
			this.${p}=${p};
		},
		</#list>
		<#list bean.params as p>
		get${p ? cap_first}:function(${p}){
			return this.${p};
		},
		</#list>
		getJsonData:function(){
			var jsonData={
		<#list bean.params as p>
			<#if p_has_next>
				"${p}":typeof(${p}) == "undefined" ? null : this.${p},
			<#else>
			    "${p}":typeof(${p}) == "undefined" ? null : this.${p}
			</#if>
		</#list>
			};
			return jsonData;
		},
		setValueByName:function(fieldname,value){
			switch (fieldname){
		<#list bean.params as p>
			   case "${p}":
					this.${p} = value;
					break;
		</#list>
				default:
					return "Field "+fieldname +"undefine;";
			}
		},
		getType:function(){
			return "${bean.beanName}";
	}
};
</#list>

// bean unit
function BeanFactory(){}

BeanFactory.prototype={
	newInstance:function(beanName){
        switch(beanName){
<#list beans as bean>
		case "${bean.beanName}":
                return new ${bean.beanName}();
                break;
</#list>

			default:
				return "undefined";
				break;
		}
	}
};




