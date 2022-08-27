'use-strict';
export const renderData = (template, data, index) => {
    if (typeof data === "undefined")
        return template;
    const regex = /\{{(.*?)}}/g;
    template = template.replace(regex, (str, d) => {
        let key = d.trim();
        if (Array.isArray(data[key]))
            return data[key][index];
        if(typeof data[key] === 'object' && data[key] && !Array.isArray(data[key])){
            if(data[key].value || data[key].defaultValue){
                let returnValue = data[key];
                if(data[key].defaultValue){
                    if (Array.isArray(data[key].defaultValue)){
                        returnValue = data[key].defaultValue[index];
                    }else{
                        returnValue = data[key].defaultValue;
                    }
                }
                if (data[key].value){
                    if (Array.isArray(data[key].value)){
                        if(data[key].value[index]){
                            returnValue = data[key].value[index]
                        }else if(returnValue === data[key]){
                            returnValue= undefined;
                        }
                    }else{
                        returnValue = data[key].value
                    }
                }
                return returnValue;
            }else return data[key];
        }
        return data[key];
    });
    return template;
};
