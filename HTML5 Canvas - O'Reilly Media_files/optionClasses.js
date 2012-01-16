/**
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

/**
 * OptionFunct class client-side definition of IOption entity.  Contains 
 * PK, name, and swatching related images and text. 
 * @param {int} iPk option PK
 * @param {String} sName option name
 * @param {String} sLargeImage large image path
 * @param {String} sAltLargeImage alternate large image path
 * @param {String} sShownIn swatching "Shown in: xyz" text
 */
function MLOption(iPk, sName, sLargeImage, sAltLargeImage, sShownIn) {
  this.iPk = iPk;
  this.sName = sName;
  this.sLargeImage = sLargeImage;
  this.sAltLargeImage = sAltLargeImage;
  this.sShownIn = sShownIn;
}

/**
 * OptionType class client-side definition of IOptionType entity.  Contains 
 * PK and array of Option objects.
 * @param {int} iPk optionType PK
 * @param {array} aOptions array of Option objects used by the option type
 */
function MLOptionType(iPk, aOptions) {
  this.iPk = iPk;
  this.aOptions = aOptions;

  /**
   * Returns the Option object finding by option PK.
   * @param {int} iOptionPk option PK
   * @return {object} Option object
   */
  MLOptionType.prototype.getOptionByPk = function(iOptionPk) {

    for (var i = 0; i < this.aOptions.length; i++) {
      if (this.aOptions[i].iPk == iOptionPk) {
        return this.aOptions[i];
      }
    }

    return null;
  }
}

/**
 * OptionSku class client-side definition of SKU options and state.
 * @param {array} aOptions array of Option objects
 * @param {boolean} bInStock in-stock flag
 * @param {String} sReorderDate reorder date, if any
 * @param {String} sPrice price
 * @param {String} iPk sku PK
 */
function MLOptionsSku(aOptions, bInStock, sReorderDate, sPrice, iPk) {
  this.aOptions = aOptions;
  this.bInStock = bInStock;
  this.sReorderDate = sReorderDate;
  this.sPrice = sPrice;
  this.iPk = iPk;
}
