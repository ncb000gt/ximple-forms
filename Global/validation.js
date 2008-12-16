function validate(validators,data_src){
    function check_choices(choices,value){
	var i;
	if(choices instanceof Array){
	    var tmp={};
	    for(i in choices){
		tmp[choices[i]]=1;
	    }
	    choices=tmp;
	}
	if(!(value instanceof Array)){
	    value=[value];
	}
	for(i in value){
	    if(!(value[i]in choices)){
		return false;
	    }
	}
	return true;
    }

    function check_length(min,max,value){
	if (value == undefined){
	    return false;
	}
	if (value._prototype)
	    return true;
	if(value instanceof Array){
	    for(var i in value){
		if(!check_length(min,max,value[i])){
		    return false;
		}
	    }
	    return true;
	}
	var len=value.length;
	if ((len==undefined) && (min>0)) return true;
	if(!min){min=0;}
	if(!max){max=len;}
	return(len>=min)&&(len<=max);
    }

    function check_regexp(rx,value){
	if(!(rx instanceof RegExp)){
	    rx=new RegExp(rx);
	}
	if(value instanceof Array){
	    for(var i in value){
		if(!rx.test(value[i])){
		    return false;
		}
	    }
	    return true;
	}
	return rx.test(value);
    }

    function check_type(type,value){
	type=type.toLowerCase();
	var failure=true;
	switch(type){
	case"date":
	    var d=new Date(value);
	    failure=isNaN(d.getFullYear());
	    break;
	case"int":
	    failure=isNaN(parseInt(value,10));
	    break;
	case"float":
	    failure=isNaN(parseFloat(value));
	    break;
	case"number":
	    failure=isNaN(new Number(value));
	    break;
	default:
	    break;
	}
	return(!failure);
    }

    function check_exist(field,data){
	if (data[field]){
	    return true;
	} else {
	    return false;
	}
    }

    function check_function(f, data){
	return f(data);
    }

    function get_scalar(key,data_src){
	if ('elements' in data_src){
	    var element=data_src.elements[key];
	    if(!element){
		return null;
	    }
	    if("selectedIndex"in element){
		return element.options[element.selectedIndex].value;
	    }
	    return element.value;
	} else {
	    return data_src[key];
	}
    }

    function get_vector(key,data_src){
	var elements = ('elements' in data_src) ? data_src.elements[key] : data_src[key];
	var values=[];
	var e;
	if(typeof elements == 'string'){
            elements = [elements];
	}
	for(var i=0;i<elements.length;i++){
	    e=elements[i];
	    if(e.checked){
		values.push(e.value);
	    }
	}
	for (var i = 0; i < elements.length; i++) {
            e = elements[i];
            if (e) {
		values.push(e);
            }
	}
	if (values.length > 0) { return values; }
	return null;
    }

    function get_type(rule){
	if("type"in rule){
	    return rule.type;
	}
	var types=["date","int","float","number"];
	for(var i in types){
	    if(types[i]in rule){
		return types[i];
	    }
	}
	return null;
    }

    function Enforce(validators,data_src){
	var errors=null,rule,success,type,value;
	for(var i in validators){
	    success=true;
	    rule=validators[i];
	    var key = rule.key+'';
	    value=("vector"in rule) ? get_vector(key,data_src) : get_scalar(key,data_src);
	    if(!value && value != ''){
		if(!("lazy" in rule)){
		    success=false;
		}
	    } else{
		if("choices"in rule){
		    success=check_choices(rule.choices,value);
		}
		if(success&&(("maxlength"in rule)||("minlength"in rule))){
		    success=check_length(rule.minlength,rule.maxlength,value);
		}
		if(success&&("exist"in rule)){
		    success1=(check_exist(key,data_src));
		    success2=(check_length(1,9999,value));
		    success=(success1 && success2);
		}
		if(success&&("regex"in rule)){
		    success=check_regexp(rule.regex,value);
		}
		if(success&&("func"in rule)){
		    success=check_function(rule.func,data_src);
		}
		if(success){
		    type=get_type(rule);
		    if(type){
			success=check_type(type,value);
		    }
		}
	    }
	    if(!success){
		if (!errors) {
		    errors = {
		    };
		}
		if (!errors[key]){
		    errors[key] = [];
		}
		errors[key].push(rule.error);
	    }
	}
	return errors;
    }
    var errors=Enforce(validators,data_src);
    return errors;
}

function isEmptyObject(obj){
  var empty = true;
  for (var field in obj){
    empty = false;
    break;
  }
  return empty;
}