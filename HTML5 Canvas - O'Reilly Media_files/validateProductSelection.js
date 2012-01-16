/*
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

function validateProductSelection(qtyMessage, optionMsg, form, minQty) {
	var iTotalQty = 0;
    var qtyErrorMsg = qtyMessage.toString();
    var optionErrorMsg = optionMsg.toString();
    var qtyValue = '';
    var optValue = '';
    var optTypeValue = '';
    var selectedKitItems = '';
    var iValue;
    var qty = new Array();
    var optionTypes = new Array();
    var options = new Array();
    var productWithNoOptions = 0;
    var productWithOptions = 0;
    var validOptions = 0;
    var j = 0;
    var badOptions = 0;
    var qtyValid = false;
    var isKit = false;
    var productPk = "";
    var bValidationResult = true;
    var tmpIdStr = "kitElement_";

    for(var i = 0; i < form.length; i++) {

        var field = form.elements[i];
	  // alert( ' field name: ' + field.name + ', field value ' + field.value + ' field type ' + field.type);
        if ((field.type == "text" || field.type == "select-one") && (field.name == "qty")) {

            qtyValue = (field.type == "text")? field.value:field[field.selectedIndex].value;
            if( isNotDigitsPrompt(field, qtyValue, qtyMessage) ) {
                return false;
            }

        } else if (field.type == "hidden" ) {
            if(field.name == "option") {
              optValue =  field.value;
            } else if (field.name == "optionTypes") {
              optTypeValue = field.value;
            } else if (field.name == "qty") {
              qtyValue = field.value;
		      isKit = true;
		    }
		// make sure that any javascript attached to a radio button gets triggered if its checked/selected.
        } else if (field.type == "radio" && field.checked){
            field.click();
        } else if (field.type == "select-one" && field.name.indexOf("options_")==0){
		    // Create kit element field id when kit is displayed as product only
			tmpIdStr += field.value + "_";
        }

		if ( field.name == "productPk" ) {
			productPk = field.value;
			tmpIdStr += productPk + "_";
	  	}
		if ( productPk.length > 0 && isKit  ) {
		 	var fieldName =  "document.getElementById('mainForm').selectedKitItems_" + productPk;
			obj = eval( fieldName);
				if ( obj.value == undefined ) {
					var k=0;
					for ( k=0; k < obj.length ; k++ ) {
						if ( obj[k].checked ) {
							break;
						}
					}

					if ( k == obj.length ) {
						alert('select a kit');
						return false;
					} else {
					    bValidationResult = validateKitSingleProductOptions(productPk);
					}
				}
	  	}

        // if all fields values are collected, store them into the arrays
        if (qtyValue != "" && optValue != "" &&  optTypeValue != "") {
        // alert(" qtyValue " + qtyValue + " optValue " + optValue + " optTypeValue " + optTypeValue );
          qty[j] = qtyValue;
          options[j] = optValue;
          optionTypes[j] = optTypeValue;
          j++;
          optTypeValue = ""; qtyValue = ""; optValue = "";
        }
    }
	    // Get the value of Kit Element String and store it in SelectedKitItems field.
   	if(tmpIdStr != null && tmpIdStr != ""){
   		tmpIdStr += "option";

   		// Get object of SelectedKitItems field
   		var fieldName =  "document.getElementById('mainForm').selectedKitItems";
   		obj = eval(fieldName);
   		// Get object of kit Element field.
   		var targetFieldName =  "document.getElementById('mainForm')." + tmpIdStr;
   		tarObj = eval(targetFieldName);
		if(obj != null && tarObj != null && tarObj.value == undefined ) {
			var k=0;
			for ( k=0; k < tarObj.length ; k++ ) {
				//alert(tarObj[k].value);
				obj.value = obj.value + tarObj[k].value;
			}
			//alert(obj.value);
		} else if (obj != null && tarObj != null ) {
			obj.value = tarObj.value;
		}
   	}

      // alert("qty.length " + qty.length + " options.length " + options.length + " optionTypes.length " + optionTypes.length + " j " + j);
      // go through the arrays and validate
    for (var m = 0; m < j; m++) {
          // check qty
        qtyValue = qty[m];

        if (isAllDigits(qtyValue)) {
            iValue = parseInt(qtyValue);
            if (!isNaN(iValue)) {
                iTotalQty += iValue;
                qtyValid = true;
            }
        }
       // now check options selection
       if (qtyValid && (iValue > 0)) {
           qtyValid = false;
           optTypeValue = optionTypes[m];
           optValue = options[m];
           if (optTypeValue > 0) {
               // product has options so check if any selected
               if(optValue != "none") {
                   // something was selected
                   // now check that number of options corresponds to selection
                   arr = optValue.split(":");
                   if (arr.length == optTypeValue) {
                       // got the same number of options as the number of drop-down menus
                       // now check if a zero value is selected for each one of them
                       for(var n = 0; n < arr.length; n++) {
                            subArr = arr[n].split("=");
                            if ((subArr[1] != 0)) {
                                validOptions++;
                            }
                       }
                       if (validOptions == optTypeValue) {
                           productWithOptions++;
                       } else {
                           badOptions++;
                       }
                       // reset var
                       validOptions = 0;
                   } else {
                       badOptions++;
                   }
               } else {
                   badOptions++;
               }
           } else {
               // product has no options, increment counter.
               productWithNoOptions++;
           }
       } // end if valid qty and qty > 0
    } // end for

    // validate quantity. On detail page, minQty is probably 1.
    // On basket, 0 is a valid qty -- means to remove
    if (iTotalQty < minQty) {
        alert(qtyErrorMsg);
        return false;
    } else {
        if (badOptions > 0) {
          alert(optionErrorMsg);
          return false;
        } else {
            // if nothing was selected for product with options and
            // there is no product without options
            // and there is a qty greater than minQty then there's an error
            if ( (productWithOptions < 1) && (productWithNoOptions < 1) && (iTotalQty > minQty) ) {
               alert(optionErrorMsg);
               return false;
            } else {
               return true;
            }
        }
    }
    return bValidationResult;

}

function isNotDigitsPrompt(field, qtyValue, qtyMessage) {
    if ( qtyValue == "" ) {
        field.value = "0";
        return false;
    } else if ( !isAllDigits(qtyValue) ) {
        alert(qtyMessage);
        return true;
    }
}
function isAllDigits(argvalue) {
   argvalue = argvalue.toString();
   if(!validateNotEmpty(argvalue)) return false;

   if(!validatePositiveInt(argvalue)) return false;

   return true;
}

function validateInteger( strValue ) {
  var objRegExp  = /(^-?\d\d*$)/;

  //check for integer characters
  return objRegExp.test(strValue);
}

function validatePositiveInt( strValue ) {
  var objRegExp  = /(^\d\d*$)/;

  //check for integer characters
  return objRegExp.test(strValue);
}

function validateNotEmpty( strValue ) {
   var strTemp = strValue;
   strTemp = trimAll(strTemp);
   if(strTemp.length > 0){
     return true;
   }
   return false;
}

function trimAll( strValue ) {
 var objRegExp = /^(\s*)$/;

    //check for all spaces
    if(objRegExp.test(strValue)) {
       strValue = strValue.replace(objRegExp, '');
       if( strValue.length == 0)
          return strValue;
    }

   //check for leading & trailing spaces
   objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
   if(objRegExp.test(strValue)) {
       //remove leading and trailing whitespace characters
       strValue = strValue.replace(objRegExp, '$2');
    }
  return strValue;
}

function validateKitSingleProductOptions( productPk ) {
    // locate error message
    var selectedSkuFieldName =  "document.getElementById('mainForm').selectedKitSku";
    var selectedSkuFieldObj =  eval( selectedSkuFieldName );
    var selectedSkuPk = selectedSkuFieldObj.value;
    var errorMessageFieldName = "";
    var errorMessageFieldObj;
    var notDone = 1;

    for ( var j = 0; notDone == 1 ; j++ ) {
        errorMessageFieldName = "document.getElementById('mainForm').errorMessage_" +  productPk + "_" + selectedSkuPk + "_" + j;
        errorMessageFieldObj = eval( errorMessageFieldName );
        if ( errorMessageFieldObj != undefined ) {
            if ( errorMessageFieldObj.value != "" ) {
                alert(errorMessageFieldObj.value);
                notDone = 0;
                return false;
            }
        } else {
            notDone = 0;
        }
    }
    return true;

}
