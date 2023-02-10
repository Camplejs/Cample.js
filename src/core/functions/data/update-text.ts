"use-strict";
import { cloneElement, createError, getTextArray, isValuesEqual, testKeyRegex } from "../../../shared/utils";
import { TextArrayType, DynamicTextType } from "../../../types/types";
import { renderData } from "../render/render-data";
const regex = /\{{(.*?)}}/g;
export const updateText = (el:Element, value:any, updTxt:DynamicTextType, index:number, texts:TextArrayType) =>{
    if(el){
      const {key} = updTxt;
      const newVal = updTxt;
      if(updTxt.texts.length){
        updTxt.texts.forEach((e,i)=>{
          if(e){
            e.textContent = renderData(value, index);
          }else{
            updTxt.texts.splice(i, 1);
          }
        })
      }else{
        const cloneEl = cloneElement(el);
        const arrayText = getTextArray(Array.from(cloneEl.childNodes));
        const textRegex = arrayText
        .map((n) => n.textContent)
        .join()
        .trim();
        if (
          arrayText.length &&
          testKeyRegex(
            arrayText
              .map((n) => n.textContent)
              .join()
              .trim(),
              key
          )
        ) {
          let length = 0;
          textRegex.replace(regex, (str, d) => {
            const currentKey = d.trim();
            if(currentKey === key){
              length++;
            }
            return str;
          });
          for(let i=0;i<length;i++){
            let currentArrayText = getTextArray(Array.from(el.childNodes));
            currentArrayText.forEach((t) => {
              let isContain = false;
              for(let j = 0; j< texts.length;j++){
                if(t.contains(texts[j])){
                  isContain = true
                  break;
                }
              }
              if(!isContain){
                for(let j = 0; j< newVal.texts.length;j++){
                  if(t.contains(newVal.texts[j])){
                    isContain = true
                    break;
                  }
                }
              }
              if(t.textContent && t.nodeValue && testKeyRegex(t.textContent, key) && !isContain){
                  const regex = /\{{(.*?)}}/g;
                  const result: Array<any> = [];
                  t.nodeValue = t.nodeValue.replace(regex, (str, d) => {
                    const regexKey = d.trim();
                    if(regexKey === key){
                      result.push(str.replace(/ /g,''));
                      return str.replace(/ /g,'');
                    }
                    return str;
                  });
                  const reg = new RegExp(`{{${key}}}(.*)`, 's');
                  const arrSplit = t.textContent.split(reg);
                  const filteredArr = arrSplit.filter(txt=>txt);
                  const newNode = document.createTextNode(renderData(value, index));
                  const updateEl = (isFirstVal: boolean = false) =>{
                    el.insertBefore(newNode, t);
                    if(!isFirstVal){
                      el.removeChild(t);
                    }
                    newVal.texts.push(newNode);
                  }
                  switch(filteredArr.length){
                    case 0:
                      updateEl();
                    break;
                    case 1:
                      const newTextNode = document.createTextNode(filteredArr[0]);
                      switch(arrSplit.indexOf(filteredArr[0])){
                        case 0:
                          el.insertBefore(newTextNode, t);
                          updateEl();
                        break;
                        case 1:
                          updateEl(true)
                          el.insertBefore(newTextNode, t);
                          el.removeChild(t);
                        break;
                        default:
                          createError("Error: Data update");
                        break;
                      }
                    break;
                    case 2:
                      filteredArr.forEach((filteredVal, i)=>{
                        const newTextArr = document.createTextNode(filteredVal);
                        if(i===1){
                          updateEl(true);
                          el.insertBefore(newTextArr, t);
                          el.removeChild(t);
                        }else{
                          el.insertBefore(newTextArr, t);
                        }
                      })
                    break;
                    default:
                      createError("Error: Data update");
                    break;
                  }
              }
            });
          }
        };
      }
        try{
          if(!isValuesEqual(value,newVal.oldValue)){
            newVal.oldValue = newVal.value;
            newVal.value = value;
          }
        }catch(err){
          newVal.oldValue = newVal.value;
          newVal.value = value;
        }
        return newVal;
    }
    return updTxt
  }