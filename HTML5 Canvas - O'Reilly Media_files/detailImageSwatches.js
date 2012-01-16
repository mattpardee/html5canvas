/**
(C) Copyright MarketLive. 2006. All rights reserved.
MarketLive is a trademark of MarketLive, Inc.
Warning: This computer program is protected by copyright law and international treaties.
Unauthorized reproduction or distribution of this program, or any portion of it, may result
in severe civil and criminal penalties, and will be prosecuted to the maximum extent
possible under the law.
*/

/**
 * DetailImageSwatches object encapsulates the detail image and
 * swatch dynamic interface.  This includes events handling for
 * click and hover and synchronization with a dependent option menu.
 * @param {int} iProductPk product PK
 * @param {object} oOptionType swatch OptionType object
 * @param {int} iPreSelectedOptionPk if a swatch should be selected upon initialize
 * @param {String} sDefaultLargeImage default large image path
 * @param {String} sImagePath image server path
 */
function DetailImageSwatches(iProductPk, oOptionType, iPreSelectedOptionPk, sDefaultLargeImage, sImagePath) {

  /** Related product pk **/
  this.iProductPk = iProductPk;

  /** Swatch option type object **/
  this.oOptionType = oOptionType;

  /** Default large image **/
  this.sDefaultLargeImage = sDefaultLargeImage;

  /** Image server URL prefix **/
  this.sImagePath = sImagePath;

  /** Selected swatch option pk (-1 for no selected) **/
  this.iSelectedSwatch = -1;

  /** Hovered over swatch option pk (-1 for no hovered) **/
  this.iHoveredSwatch = -1;

  /** Detail image src location before hover changed image. **/
  this.sPreHoverLargeImage = '';

  /** Option value text before hover changed option value text. **/
  this.sPreHoverOptionValueText = '';

  /**
   * Gets a DOM image object ref for the large image.
   * @return A DOM image object ref or null if one could not be found.
   */
  DetailImageSwatches.prototype.getLargeImage = function() {
    return document.getElementById('largeImage');
  }

  /**
   * Gets a DOM image object ref for a specific swatch option.
   * @return A DOM image object ref or null if one could not be found.
   */
  DetailImageSwatches.prototype.getSwatchImage = function(iOptionPk) {
    return document.getElementById('swatch_' + this.oOptionType.iPk + '_' + iOptionPk);
  }

  /**
   * Sets option value text value which sits below the detail image
   * to the value that corresponds to the option type and option PKs.
   *
   * @param {String} sOptionValueText text to set into option value div
   */
  DetailImageSwatches.prototype.changeOptionValueText = function(sOptionValueText) {
    var oOptionText = document.getElementById('optionTextNearDetailImage');

    // The option text near detail image is optional.
    if (oOptionText != null) {

      if (sOptionValueText != null) {
        oOptionText.innerHTML = sOptionValueText;
      }
      else {
        oOptionText.innerHTML = '';
      }
    }
  }

  /**
   * Updates swatch images after click or synchronization.
   * @param {int} iOptionPk new selected swatch option PK
   */
  DetailImageSwatches.prototype.swatchChanged = function(iOptionPk) {

    // Set CSS to unselect current swatch
    if (this.iSelectedSwatch != -1) {
      this.getSwatchImage(this.iSelectedSwatch).className = 'swatchUnSelected';
    }

    // If changing to a valid option pk, grab option
    // and update image, text, etc. for that option.
    //
    if (iOptionPk > 0) {
      // Save selected swatch option.
      this.iSelectedSwatch = iOptionPk;

      // Get option object by pk.
      var oOption = this.oOptionType.getOptionByPk(iOptionPk);

      // Set CSS to selected new swatch image.
      this.getSwatchImage(this.iSelectedSwatch).className = 'swatchSelected';

      // Set option value text near detail image.
      this.changeOptionValueText(oOption.sShownIn);

      // Update the large image.
      this.getLargeImage().src = this.sImagePath + oOption.sLargeImage;
      
      // Update the additional views window
      if (window.AdditionalViews && !window.AdditionalViews.closed){
      	eval(sAdditionalViewsCall);
      }
      
      // Update the view larger window
      if (window.ViewLarger && !window.ViewLarger.closed){
      	eval(sViewLargerCall);
      }
    }
    // Else, go to no swatch selected and default large image.
    //
    else {
      // No swatch selected.
      this.iSelectedSwatch = -1;

      // Clear option value text near detail image.
      this.changeOptionValueText('&nbsp;');

      // Restore the default large image.
      this.getLargeImage().src = this.sImagePath + this.sDefaultLargeImage;
    }

    // Clear any hover state.
    this.iHoveredSwatch = -1;
  }

  /**
   * Event handler for onclick event on a swatch image.  Changes selected
   * swatch and optionally synchronizes related dependent menu.
   * @param {int} iOptionPk clicked option PK
   */
  DetailImageSwatches.prototype.swatchClicked = function(iOptionPk) {

  // Update selected swatch.
    this.swatchChanged(iOptionPk);

    // Try and find dependent option menus object corresponding
    // to this swatch by matching product pk.
    //
    try {
      var oDepMenus = eval('goDepOptMenus_' + this.iProductPk);

      oDepMenus.synchronize(this.oOptionType.iPk, iOptionPk);
    }
    catch (e) {
    }
  }

  /**
   * Event handler for onmouseover event on a swatch image.
   * This handles the "hover" on swatch functionality.
   * @param {int} iOptionPk option PK
   */
  DetailImageSwatches.prototype.swatchEnter = function(iOptionPk) {

    if (this.iSelectedSwatch != iOptionPk && this.iHoveredSwatch != iOptionPk) {

      // Set CSS hover on hovered swatch image.
      this.getSwatchImage(iOptionPk).className = 'swatchHover';

      var oLargeImg = this.getLargeImage();

      // Save off current large image.
      this.sPreHoverLargeImage = oLargeImg.src;

      // Save off current option value text.
      var oOptionText = document.getElementById('optionTextNearDetailImage');

      // The option text near detail image is optional.
      if (oOptionText != null) {
        this.sPreHoverOptionValueText = oOptionText.innerHTML;
      }
      else {
        this.sPreHoverOptionValueText = '';
      }

      // Get option object by pk.
      var oOption = this.oOptionType.getOptionByPk(iOptionPk);

      // Update large image.
      oLargeImg.src = this.sImagePath + oOption.sLargeImage;

      // Update option value text.
      this.changeOptionValueText(oOption.sShownIn);

      // Save hovered state.
      this.iHoveredSwatch = iOptionPk;
    }
  }

  /**
   * Event handler for onmouseout event on a swatch image.
   * This handles the "hover" on swatch ended functionality.
   * @param {int} iOptionPk option PK
   */
  DetailImageSwatches.prototype.swatchLeave = function(iOptionPk) {

    if (this.iHoveredSwatch != -1) {

      // Set CSS unselected on hovered swatch
      this.getSwatchImage(this.iHoveredSwatch).className = 'swatchUnSelected';

      // Restore large image to before hover value.
      this.getLargeImage().src = this.sPreHoverLargeImage;

      // Restore option value text to before hover value.
      var oOptionText = document.getElementById('optionTextNearDetailImage');

      // The option text near detail image is optional.
      if (oOptionText != null) {
        oOptionText.innerHTML = this.sPreHoverOptionValueText;
      }

      this.sPreHoverOptionValueText = '';

      // Clear hover swatch state.
      this.iHoveredSwatch = -1;
    }
  }

  /**
   * Try and sychronize our selected swatch with an option value
   * selected via another UI element (ie. select menu chosen).
   * @param {int} iOptionPk option PK to make selected swatch
   */
  DetailImageSwatches.prototype.synchronize = function(iOptionPk) {

    if (this.iSelectedSwatch != iOptionPk) {
      this.swatchChanged(iOptionPk);
    }
  }

  /**
   * Adds the "swatch" URL query parameter to the URL if a
   * current swatch is selected.
   * @param {String} sUrl product URL to open in daughter window
   */
  DetailImageSwatches.prototype.addSwatchQueryParameter = function(sUrl) {
    // If there is a selected swatch, we need to add
    // the "swatch" URL query parameter.
    if (this.iSelectedSwatch != -1) {

      // If the url already has parameters, swatch will be another one.
      if (sUrl.indexOf('?') > 0) {
        sUrl = sUrl + '&';
      }
      // Else, swatch is the first url parameter.
      else {
        sUrl = sUrl + '?';
      }

      sUrl = sUrl + 'swatch=' + this.oOptionType.iPk + '_' + this.iSelectedSwatch;
    }

    return sUrl;
  }

  /**
   * Opens the view larger daughter window appending the selected swatch
   * option value to the entity URL.
   * @param {String} sWidth width of daughter window
   * @param {String} sHeight height of daughter window
   * @param {String} sUrl product URL to open in daughter window
   */
  DetailImageSwatches.prototype.openViewLarger = function(sWidth, sHeight, sUrl) {
  	if (arguments[4]){
    	flyopen(sWidth, sHeight, this.addSwatchQueryParameter(sUrl), 'ViewLarger', arguments[4]);
    } else {
    	flyopen(sWidth, sHeight, this.addSwatchQueryParameter(sUrl), 'ViewLarger');
    }
  }

  /**
   * Opens the additional views daughter window appending the selected swatch
   * option value to the entity URL.
   * @param {String} sWidth width of daughter window
   * @param {String} sHeight height of daughter window
   * @param {String} sUrl product URL to open in daughter window
   */
  DetailImageSwatches.prototype.openAdditionalViews = function(sWidth, sHeight, sUrl) {
  	if (arguments[4]){
		flyopen(sWidth, sHeight, this.addSwatchQueryParameter(sUrl), 'AdditionalViews', arguments[4]);
	} else {
		flyopen(sWidth, sHeight, this.addSwatchQueryParameter(sUrl), 'AdditionalViews');
	}
  }

  //
  // INITIALIZATION
  //
  if (iPreSelectedOptionPk > 0) {
    this.swatchChanged(iPreSelectedOptionPk);
  }
}