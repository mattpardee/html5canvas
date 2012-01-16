/*
Function for updating the hidden kit product field.
This function is called when a user makes any change in any of the kit items.  The function:
1) reads in the display type of the element
2) reads in the matching dynamically generated element hidden field
3) reads in all the elemnets hidden fields associated with the selected Sku
4) sets the read in value to the "selectedKitItems" hidden field.
5) the data string is accessed server-side by the matching for propert form.getSelectedKitItems()
*/
/*
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

var ERRORED_SKUS = new Array();

function setProductItems(formName, parentProductID, parentKitSkuID, elementID, elementIndex, elementDisplayType, itemProductID, itemSkuID) {
//alert("setProductItems(formName:"+formName+", parentProductID:"+parentProductID+", parentKitSkuID:"+parentKitSkuID+", elementID:"+elementID+", elementIndex:"+elementIndex+", elementDisplayType:"+elementDisplayType+", itemProductID:"+itemProductID+", itemSkuID:"+itemSkuID+")");

    var productItems = "";
    var counter = -1;
    var notDone = 1;
    var elementItemsObj;
    var elementItemsName;
    var debugging = "";
    var validate = false;

    if ( elementDisplayType == 2 ) {
        debugging = setSingleProductElement( formName, parentProductID, parentKitSkuID, elementID, elementIndex, itemProductID );
    } else if ( elementDisplayType == 3 ) {
        debugging = setSingleProductDropDownElement(formName, parentProductID, parentKitSkuID, elementIndex);
    } else if ( elementDisplayType == 4 ) {
       debugging = setMultipleProductsDropDownsElement(formName, parentProductID, parentKitSkuID, elementIndex, itemSkuID);
    } else if ( elementDisplayType == 5 ) {
        debugging = setMultipleProductsMinMaxElement(formName, parentProductID, parentKitSkuID, elementID, elementIndex, itemProductID, itemSkuID);
    } else {
        validate = true;
    }
    var skuItemsName = "document.getElementById('" + formName + "').selectedKitItems_" + parentProductID;
    var skuProductItemsObj = eval ( skuItemsName );

    if ( skuProductItemsObj != undefined && skuProductItemsObj.length != undefined ) {
        for ( var i=0; i<skuProductItemsObj.length; i++ ) {
            if ( skuProductItemsObj[i].checked ) {
                // Setting the kit sku
                var selectedKitSkuName = "document.getElementById('selectedKitSku_main_" + parentProductID + "')";
                var selectedKitSkuObj  = eval ( selectedKitSkuName );
                selectedKitSkuObj.value = skuProductItemsObj[i].value;
                //alert(selectedKitSkuObj.value);

                while ( notDone == 1 ) {
                    counter++;
                    elementItemsName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + counter;
				    elementItemsObj = eval( elementItemsName );
                    if ( elementItemsObj != undefined ) {
                        productItems = productItems + elementItemsObj.value;
                    } else {
                        notDone = 0;
                    }
                }
                productItems = productItems.substr(2);

                // Setting the kit items
                var selectedKitFieldName = "document.getElementById('selectedKitItems_main_" + parentProductID + "')";
                var selectedKitFieldObj  = eval ( selectedKitFieldName );
                selectedKitFieldObj.value = productItems;

                // Setting the sku option pairs
                var optionTypeFieldsName = "document.getElementById('" + formName + "').optionTypeValues_" + parentProductID + "_" + parentKitSkuID;
                var optionTypeFieldsObj = eval ( optionTypeFieldsName );
                //alert("optionTypeFieldsObj:"+optionTypeFieldsObj);

                var optionFieldName = "document.getElementById('option_main_" + parentProductID + "')";
                var optionFieldObj = eval( optionFieldName );
                optionFieldObj.value = optionTypeFieldsObj.value;
                //alert("optionFieldObj:"+optionFieldObj);

                // Setting the kit sku
                var qtyFieldName = "document.getElementById('" + formName + "').qty_" + parentProductID + "_" + parentKitSkuID;
                var qtyFieldObj = eval ( qtyFieldName );
                var qtyKitFieldName = "document.getElementById('qty_main_" + parentProductID + "')";
                var qtyKitFieldObj = eval ( qtyKitFieldName );
                qtyKitFieldObj.value = qtyFieldObj.value;
                //alert("qtyKitFieldObj:"+qtyKitFieldObj);

		        //alert(selectedKitFieldObj.value);
            }
		// alert(productItems);
        }
    } else {
        while ( notDone == 1 ) {
            counter++;
            elementItemsName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + counter;
            elementItemsObj = eval( elementItemsName );
            if ( elementItemsObj != undefined ) {
                productItems = productItems + elementItemsObj.value;
            } else {
                notDone = 0;
            }
        }
        productItems = productItems.substr(2);
        var selectedKitFieldName = "document.getElementById('selectedKitItems_main_" + parentProductID + "')";
        var selectedKitFieldObj  = eval ( selectedKitFieldName );
        selectedKitFieldObj.value = productItems;
        // Setting the sku option pairs
        var optionTypeFieldsName = "document.getElementById('" + formName + "').optionTypeValues_" + parentProductID + "_" + parentKitSkuID;
        var optionTypeFieldsObj = eval ( optionTypeFieldsName );
        var optionFieldName = "document.getElementById('" + formName + "').option";
        var optionFieldObj = eval( optionFieldName );

        optionFieldObj.value = optionTypeFieldsObj.value;

        // Setting the sku qty
        if ( formName == "mainForm" ) {
        var qtyFieldName = "document.getElementById('" + formName + "').qty_" + parentProductID + "_" + parentKitSkuID;
        var qtyFieldObj = eval ( qtyFieldName );
        var qtyKitFieldName = "document.getElementById('qty_main_" + parentProductID + "')";
        var qtyKitFieldObj = eval ( qtyKitFieldName );
        qtyKitFieldObj.value = qtyFieldObj.value;

        }
	    // alert(selectedKitFieldObj.value);

    }

}

function setMultipleProductsMinMaxElement(formName, parentProductID, parentKitSkuID, elementID, elementIndex, itemProductID, itemSkuID) {

    var elementItemsMinMaxSkuName = "";
    var elementItemsMinMaxSkuObj;
    var elementItemsMinMaxName = "";
    var elementItemsMinMaxObj;
    var elementItemsName = "";
    var elementItemsObj;
    var kitItemsString = "";

    elementItemsMinMaxName = "document.getElementById('" + formName + "').kitElementMinMax_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
    elementItemsMinMaxObj = eval( elementItemsMinMaxName );
    elementItemsMinMaxProdName = "document.getElementById('" + formName + "').kitElementMinMaxProd_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
    elementItemsMinMaxProdObj = eval( elementItemsMinMaxProdName );
    elementItemsMinMaxSkuName = "document.getElementById('" + formName + "').kitElementMinMaxSku_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
    elementItemsMinMaxSkuObj = eval( elementItemsMinMaxSkuName );

    for ( var i=0; i < elementItemsMinMaxObj.length; i++ ) {
       if ( elementItemsMinMaxObj[i] != undefined && elementItemsMinMaxSkuObj[i] != undefined && elementItemsMinMaxObj[i].value > 0 ) {
           kitItemsString = kitItemsString + "||" + elementID + "," + elementItemsMinMaxProdObj[i].value + "," + elementItemsMinMaxSkuObj[i].value + "," + elementItemsMinMaxObj[i].value;
       }
    }
   elementItemsName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;

   elementItemsObj= eval(elementItemsName );
   elementItemsObj.value =  kitItemsString;

   // alert( elementItemsObj.value );

   return elementItemsObj.value;

}
function setMultipleProductsDropDownsElement(formName, parentProductID, parentKitSkuID, elementIndex, maxNumElements ) {

   var elementItemsSelectOptionsName = "";
   var elementItemsSelectOptionObj;
   var elementItemsName = "";
   var elementItemsObj;
   var kitItemsString = "";

   for ( var i=0; i < maxNumElements; i++ ) {
       elementItemsSelectOptionsName = "document.getElementById('" + formName + "').kitElementSelectOption_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex + "_" + i;
	elementItemsSelectOptionObj = eval( elementItemsSelectOptionsName );
       if ( elementItemsSelectOptionObj.value != 0 ) {
           kitItemsString = kitItemsString + elementItemsSelectOptionObj.value;
       }
   }
   elementItemsName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
   elementItemsObj = eval(elementItemsName);
   elementItemsObj.value =  kitItemsString;

   return elementItemsObj.value;

}
function setSingleProductDropDownElement(formName, parentProductID, parentKitSkuID, elementIndex ) {

   var elementItemsName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
   var elementItemsObj;
   elementItemsObj = eval( elementItemsName );
   return elementItemsObj.value;

}

function setSingleProductElement(formName, parentProductID, parentKitSkuID, elementID, elementIndex, itemProductID ) {

    var notDone = 1;
    var selectObj;
    var selectName = "";
    var optionsString = "";
    var kitItemsString = "";
    var i;
    var options = 0;
    for ( i = 0; notDone == 1; i++ ) {

        selectName   = "optionValuePair_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex + "_" + i;
        selectObj    = eval("document.getElementById('" + formName + "')." + selectName );

        if ( selectObj != undefined ) {
            if ( selectObj.value != "0" ) {
                optionsString = optionsString + selectObj.value + "*";
                options++;
            }
       } else {
           notDone = 0;
       }
    }
    var kitElementName = "document.getElementById('" + formName + "').kitElement_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
    var kitElementObj;
    if ( optionsString.charAt(optionsString.length-1) == '*' ) {

     optionsString = optionsString.substr(0, optionsString.length-1) ;
    }
    kitItemsString = "||" + elementID + ","  + itemProductID + "," + optionsString + ",1";
    kitElementObj = eval(kitElementName);
    kitElementObj.value = kitItemsString;
    var skuItemsName = "document.getElementById('" + formName + "').selectedKitItems_" + parentProductID;
    var errorMsgName = "document.getElementById('" + formName + "').errorMessage_" + parentProductID + "_" + parentKitSkuID + "_" + elementIndex;
    var errorMsgObj = eval ( errorMsgName );

        if ( (i - options) > 1 && options > 0 ) {

            errorMsgObj.value = "Select Complete Set of Options";


        } else {

            errorMsgObj.value = "";

        }

    return kitElementObj.value;

}

function validateSingleProduct(formName, parentProductID, parentKitSkuID, elementID, elementIndex, itemProductID, skuItemsName ) {

   var notDone = 1;
   var selectObj;
   var selectName = "";
   var optionsString = "";
   var kitItemsString = "";
    var i = 0;
    var options = 0;
   for ( var j = 0; j < 5 ; j++ ) {
       options = 0;
       notDone = 1;
       for ( i = 0; notDone == 1; i++ ) {

            selectName   = "optionValuePair_" + parentProductID + "_" + parentKitSkuID + "_" + j + "_" + i;
            selectObj    = eval("document.getElementById('" + formName + "')." + selectName );
            if ( selectObj != undefined ) {
                if ( selectObj.value != "0" ) {
                    optionsString = optionsString + selectObj.value + "*";
                    options++;
                }
           } else {
               notDone = 0;
           }
       }
       // alert('Number of Option Types: ' + i);
       // alert('Number of Options Selected: ' + options);

        if ( (i - options) > 1 && options > 0 ) {
            alert('Select Complete Set of Options');
            var skuProductItemsObj = eval ( skuItemsName );
            if ( skuProductItemsObj != undefined && skuProductItemsObj.length != undefined ) {
                for ( var i=0; i<skuProductItemsObj.length; i++ ) {
                    if ( skuProductItemsObj[i].checked ) {
                        skuProductItemsObj[i].checked = false;
                    }
                }
            }
        }

    }


}
