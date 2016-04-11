/**
 * Copyright (c) 2014, 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojvalidation', 'ojs/internal-deps/dvt/DvtToolkit'], function(oj, $, comp, val, dvt)
{
/**
 * Creates an attribute group handler that will generate stylistic attribute values such as colors or shapes based on data set categories.
 * @param {Object} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @export
 * @constructor
 */
oj.AttributeGroupHandler = function(matchRules) {
  this.Init(matchRules);
};

oj.Object.createSubclass(oj.AttributeGroupHandler, oj.Object, "oj.AttributeGroupHandler");

oj.AttributeGroupHandler.prototype.Init = function(matchRules) {
  oj.AttributeGroupHandler.superclass.Init.call(this);
  this._matchRules = matchRules ? matchRules : {};
  this._assignments = {};
  this._valueIndex = 0;
  this.Values = this.getValueRamp();
  for (var key in this._matchRules) {
    // remove match rule value from attribute group values
    var idx = this.Values.indexOf(this._matchRules[key]);
    if (idx !== -1)
      this.Values.splice(idx, 1);
  }
}

/**
 * Returns the array of possible attribute values for this attribute group handler.
 * This array can be modified so subclasses should return a copy of its internal value ramp.
 * @returns {Array} The array of attribute values
 * @export
 */
oj.AttributeGroupHandler.prototype.getValueRamp = function() {
  return [];
}

/**
 * Assigns the given category an attribute value.  Will consistently return the same attribute value for equal categories.
 * @param {Object} category The category to assign
 * @returns {Object} The attribute value for the category
 * @export
 */
oj.AttributeGroupHandler.prototype.getValue = function(category) {
  if (this._matchRules[category])
    return this._matchRules[category];
  else if (this._assignments[category])
    return this._assignments[category];
  else {
    this._assignments[category] = this.Values[this._valueIndex];
    if (this._valueIndex == this.Values.length - 1)
      this._valueIndex = 0;
    else
      this._valueIndex++;
    return this._assignments[category];
  } 
}

/**
 * Returns the current map of key value pairs for categories and the assigned attribute values
 * @return {Array} The current list of category and value pairing
 * @export
 */
oj.AttributeGroupHandler.prototype.getCategoryAssignments  = function() {
  var assignments = [];
  for (var i in this._assignments)
    assignments.push({"category": i, "value": this._assignments[i]});
  return assignments;
}

/**
 * Reserves an attribute value for the given category
 * @param {String} category Used for checking inputs to getAttributeValue against when assigning an attribute value
 * @param {String} attributeValue The attribute value to assign for inputs matching the given category e.g. "square" or "circle"
 * @export
 */
oj.AttributeGroupHandler.prototype.addMatchRule = function(category, attributeValue) {
  this._matchRules[category] = attributeValue;
}
/**
 * Creates a color attribute group handler that will generate color attribute values.
 * @param {Object} [matchRules] A map of key value pairs for categories and the 
 * matching attribute value e.g. {"soda" : "#336699", "water" : "#CC3300", "iced tea" : "#F7C808"}.
 * Attribute values listed in the matchRules object will be reserved only for the 
 * matching categories when getAttributeValue is called.  Note that not all colors
 * in the default color ramp will meet minimum contrast requirements for text.
 * @export
 * @constructor
 * @extends {oj.AttributeGroupHandler}
 */
oj.ColorAttributeGroupHandler = function(matchRules) {
  // Create the array of colors for this instance.
  this._attributeValues = [];
  
  if ($(document.body).hasClass('oj-hicontrast'))  {
    // High Contrast: CSS colors get overridden to all white or all black. Use the default colors instead.
    this._attributeValues = oj.ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
  } 
  else {
    // Process the colors from the skin if not done already.
    if(!oj.ColorAttributeGroupHandler._colors) {
      oj.ColorAttributeGroupHandler._colors = [];
    
      // Process the colors from the CSS.
      var attrGpsDiv = $(document.createElement("div"));
      attrGpsDiv.attr("style", "display:none;");
      attrGpsDiv.attr("id", "attrGps");
      $(document.body).append(attrGpsDiv);
      for (var i = 0; i < oj.ColorAttributeGroupHandler._STYLE_CLASSES.length; i++) {
        var childDiv = $(document.createElement("div"));
        childDiv.addClass(oj.ColorAttributeGroupHandler._STYLE_CLASSES[i]);
        attrGpsDiv.append(childDiv);
        var color = childDiv.css('color');
        if (color)
          oj.ColorAttributeGroupHandler._colors.push(color);
      }
      attrGpsDiv.remove();
    }
    
    // Clone and use the processed colors.
    if (oj.ColorAttributeGroupHandler._colors.length > 0)
      this._attributeValues = oj.ColorAttributeGroupHandler._colors.slice();
    else
      this._attributeValues = oj.ColorAttributeGroupHandler._DEFAULT_COLORS.slice();
  }
  
  this.Init(matchRules);
}

oj.Object.createSubclass(oj.ColorAttributeGroupHandler, oj.AttributeGroupHandler, "oj.ColorAttributeGroupHandler");

/** @private */
oj.ColorAttributeGroupHandler._DEFAULT_COLORS = ['#267db3', '#68c182', '#fad55c',
                                                '#ed6647', '#8561c8', '#6ddbdb', 
                                                '#ffb54d', '#e371b2', '#47bdef', 
                                                '#a2bf39', '#a75dba', '#f7f37b'];

/** @private */
oj.ColorAttributeGroupHandler._STYLE_CLASSES = ['oj-dvt-category1',
  'oj-dvt-category2', 'oj-dvt-category3', 'oj-dvt-category4',
  'oj-dvt-category5', 'oj-dvt-category6', 'oj-dvt-category7',
  'oj-dvt-category8', 'oj-dvt-category9', 'oj-dvt-category10',
  'oj-dvt-category11', 'oj-dvt-category12'];

/** @private */
oj.ColorAttributeGroupHandler._colors = null;  
  
//** @inheritdoc */
oj.ColorAttributeGroupHandler.prototype.getValueRamp = function() {
  return this._attributeValues.slice();
}
/**
 * Class to help set css properties on the component root options object
 * @param {Object} object The root options object from which this path should be resolved
 * @param {string} path The string path within the options object to resolve
 * @constructor
 * @ignore
 */
var DvtJsonPath = function(object, path)
{
  this._path = path;
  this._root = object;
  this._delimiter = '/';
}

/**
 * Resolves the parameter of the leaf object and the leaf object itself
 * @param {Object} root The root object to update
 * @param {string} path The string path within the root object to resolve
 * @param {string} delimiter The string delimiter for the path string
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @return {Object} The resolved parameter
 * @private
 */
DvtJsonPath.prototype._resolveLeafObjectAndProperty = function(root, path, delimiter, createIfMissing)
{
  var result = {};
  while (root && path.indexOf(delimiter) > -1)
  {
    var subProperty = path.substring(0, path.indexOf(delimiter));
    if (createIfMissing && root[subProperty] === undefined)
    {
      root[subProperty] = {};
    }
    root = root[subProperty];
    path = path.substring(path.indexOf(delimiter) + 1, path.length);
  }

  if (root)
  {
    result['object'] = root;
    result['parameter'] = path;
  }

  return result;
}

/**
 * Resolves path to the leaf object and parameter of this object
 * @param {boolean} createIfMissing Flag to create the hierarchy of the namespaces if they do not exist
 * @private
 */
DvtJsonPath.prototype._resolvePath = function(createIfMissing)
{
  if (this._leaf === undefined)
  {
    var result = this._resolveLeafObjectAndProperty(this._root, this._path, this._delimiter, createIfMissing);

    this._leaf = result['object'];
    this._param = result['parameter'];
  }
}

/**
 * Returns value of the leaf element of the path.
 * @return {string} value The value of the leaf element or undefined if path structure is not yet created
 */
DvtJsonPath.prototype.getValue = function()
{
  this._resolvePath(false);
  return this._leaf === undefined ? undefined : this._leaf[this._param];
}

/**
 * Sets value of the leaf element of the path.
 * @param {string} value The value of the leaf element
 * @param {boolean} bOverride Whether to override the original value
 */
DvtJsonPath.prototype.setValue = function(value, bOverride)
{
  this._resolvePath(true);

  if (bOverride || !this._leaf[this._param])
  {
    this._leaf[this._param] = value;
  }
}
var DvtStyleProcessor = {
  'CSS_TEXT_PROPERTIES':
    function(cssDiv) {
      var ignoreProperties = {};
      if (cssDiv) {
        if (cssDiv.hasClass("oj-gaugeMetricLabel") && cssDiv.hasClass(cssDiv.parentNode, "oj-ledGauge")) {
          // Ignored because the size and color are fit to shape and based on background color.
          ignoreProperties['font-size'] = true;
          ignoreProperties['color'] = true;
        }
        else if (cssDiv.hasClass(cssDiv, "oj-chartSliceLabel")) {
          // Ignored because the color is automatically determined based on slice color.
          ignoreProperties['color'] = true;
        }
        else if (cssDiv.hasClass("oj-treemap-node-header")) {
          // Ignored because the weight is automatically determined based on the layer of the header.
          ignoreProperties['font-weight'] = true;
        }
      }
      return DvtStyleProcessor._buildTextCssPropertiesObject(cssDiv, ignoreProperties);
    },
  'CSS_BACKGROUND_PROPERTIES':
    function(cssDiv, styleClass, property, path) {
      return DvtStyleProcessor._buildCssBackgroundPropertiesObject(cssDiv);
    },
  'CSS_URL':
    function(cssDiv) {
      return DvtStyleProcessor._parseUrl(cssDiv);
    }
};
        
DvtStyleProcessor._INHERITED_FONT_COLOR = "rgb(254, 0, 254)";
DvtStyleProcessor._INHERITED_FONT_FAMILY = "Times";
DvtStyleProcessor._INHERITED_FONT_SIZE = "1px";
DvtStyleProcessor._INHERITED_FONT_WEIGHT = "1";
DvtStyleProcessor._INHERITED_FONT_STYLE = "normal";

// Chrome adjusts px font size when zooming, so only set the font size if the inherited size is less than 4px.
DvtStyleProcessor._FONT_SIZE_BUFFER = 4.0;

/** 
 * A map of resolved style properties, where each key is a style class and each value is an object with property to 
 * value mappings.
 * @private
 */
DvtStyleProcessor._styleCache = {};

DvtStyleProcessor.defaultStyleProcessor = function(cssDiv, property) {
  return cssDiv.css(property);
}

/**
 * @param {Object} cssDiv The element with style class or with some default style
 * @private
 */
DvtStyleProcessor._parseUrl = function(cssDiv) {
  var url = cssDiv.css('background-image');
  if (url && url.indexOf('url(') !== -1)
    return url.slice(url.indexOf('url(')+4, url.length-1).replace(/"/g,"");
  else
    return url;
};

/**
 * Returns the css background properties object.
 * @param {Object} cssDiv The element with style class or with some default style
 * @return {Object} The object of CSS background properties including 
 *                  border-color, border-width, and background-color
 * @private
 */
DvtStyleProcessor._buildCssBackgroundPropertiesObject = function(cssDiv) {
  var cssObj = {};
  if (cssDiv.css('border-top-color')) {
    cssObj["border-color"] = cssDiv.css('border-top-color');
  }
  if (cssDiv.css('border-width') && cssDiv.css('border-style') && 
      cssDiv.css('border-style') != 'none') {
    cssObj["border-width"] = cssDiv.css('border-width');
  }
  if (cssDiv.css('background-color')) {
    cssObj["background-color"] = cssDiv.css('background-color');
  }
  return cssObj;
};

/**
 * Returns the css text properties object.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {Object} ignoreProperties The css properties to ignore
 * @return {Object} The CSS text properties object including font-family, 
 *                  font-size, font-weight, color, and font-style
 */
DvtStyleProcessor._buildTextCssPropertiesObject = function(cssDiv, ignoreProperties)
{
  var cssObj = {};
  var value = cssDiv.css('font-family');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_FAMILY) {
    cssObj["font-family"] = value.replace(/"/g,"'");
  }
  value = cssDiv.css('font-size');
  if (value && !(value.indexOf("px") > -1 && 
      parseFloat(value) < DvtStyleProcessor._FONT_SIZE_BUFFER) && 
      !ignoreProperties ['font-size']) {
    cssObj["font-size"] = value;
  }
  value = cssDiv.css('font-weight');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_WEIGHT && 
      !ignoreProperties['font-weight']) {
    cssObj["font-weight"] = value;
  }
  value = cssDiv.css('color');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_COLOR && 
      !ignoreProperties ['color']) {
    cssObj["color"] = value;
  }
  value = cssDiv.css('font-style');
  if (value && value !== DvtStyleProcessor._INHERITED_FONT_STYLE) {
    cssObj["font-style"] = value;
  }
  return cssObj;
};

/**
 * Creates dummy divs for each component style class and merges their values with the component options object.
 * @param {Object} element DOM node to add CSS styles to for processing
 * @param {Object} options The options object to merge CSS properties with
 * @param {Array} componentClasses The style classes associated with the component
 * @param {Object} childClasses Style classes associated with a component's children
 * @private
 */ 
DvtStyleProcessor.processStyles = function(element, options, componentClasses, childClasses)
{
  // Add the component style classes to a hidden dummy div
  var outerDummyDiv = $(document.createElement("div"));
  outerDummyDiv.attr("style", "display:none;");
  element.append(outerDummyDiv);
  var styleClasses = '';
  for (var i=0; i<componentClasses.length; i++)
    styleClasses = styleClasses + componentClasses[i] + " ";
  outerDummyDiv.attr("class", styleClasses);
  $(document.body).append(outerDummyDiv);

  // Add an inner dummy div to overwrite inherited values and prevent populating options object with them
  var innerDummyDiv = $(document.createElement("div"));
  innerDummyDiv.css("font-size", DvtStyleProcessor._INHERITED_FONT_SIZE);
  innerDummyDiv.css("color", DvtStyleProcessor._INHERITED_FONT_COLOR);
  innerDummyDiv.css("font-weight", DvtStyleProcessor._INHERITED_FONT_WEIGHT);
  innerDummyDiv.css("font-style", DvtStyleProcessor._INHERITED_FONT_STYLE);
  outerDummyDiv.append(innerDummyDiv);
  
  for (var styleClass in childClasses) {
    // Retrieve the definitions for the styleClass. Convert to an array if not already.
    var definitions = childClasses[styleClass];
    if(!(definitions instanceof Array))
      definitions = [definitions];
  
    // Process the style definitions
    DvtStyleProcessor._processStyle(innerDummyDiv, options, styleClass, definitions);
  }
  
  // Remove the dummy div when complete
  outerDummyDiv.remove();
};

/**
 * Resolves the css properties for a specified style class.
 * @param {Object} element The DOM node to add CSS styles to for processing.
 * @param {Object} options The options object to merge CSS properties with.
 * @param {string} styleClass The style class.
 * @param {Array} definitions Array of maps of CSS style attribute and values to process.
 * @private
 */ 
DvtStyleProcessor._processStyle = function(element, options, styleClass, definitions)
{
  // Ensure an entry for the styleClass exists in the cache.
  if(!DvtStyleProcessor._styleCache[styleClass])
    DvtStyleProcessor._styleCache[styleClass] = {};
  
  // Process each definition.
  var cssDiv = null;
  for (var i=0;i<definitions.length; i++) {
    var definition = definitions[i];
    var property = definition['property'];
    if(property) {
      // Check if the style cache already has a resolved copy of the value
      var value = DvtStyleProcessor._styleCache[styleClass][property];
      if(typeof value == 'undefined') {
        // Property not found in the cache. Ensure creation of the cssDiv to resolve the property.
        if(!cssDiv) {
          cssDiv = $(document.createElement("div"));
          cssDiv.addClass(styleClass);
          element.append(cssDiv);
        }
        
        // Resolve and store in the cache.
        value = DvtStyleProcessor._resolveStyle(cssDiv, property);
        DvtStyleProcessor._styleCache[styleClass][property] = value;
      }
      
      // If a value exists, apply to the JSON. 
      if(value != null) {
        var path = new DvtJsonPath(options, definition['path']);
        // If a handler was used, combine the value from the options with the value from the skin.
        var handler = DvtStyleProcessor[property];
        if(handler != null) {
          var optionsValue = path.getValue();
          // For urls, just overwrite the previous value. DVTs don't currently
          // expose options for urls coming from the CSS so we don't need
          // to worry about merging.
          if (property !== 'CSS_URL') {
            var strValue = '';
            if(optionsValue != null) {
              for (var attr in value) {
                if (optionsValue.indexOf(attr) === -1)
                  strValue += attr + ':' + value[attr] + ';';
              }
              strValue += optionsValue;
            } else { // still need to convert cached value which is an object to a string
              for (var attr in value)
                strValue += attr + ':' + value[attr] + ';';
            }
            value = strValue;
          }
        }
        
        // Override original value only if we have already merged the original value with the new value, such as for 
        // text or background styles.
        path.setValue(value, handler != null);
      }
    }
  }
};

/**
 * Helper function to resolve the css properties within a dummy div and handle caching.
 * @param {Object} cssDiv The div to use for processing CSS style.
 * @param {string} property The css property to be resolved.
 * @return {string | null} The resolved value.
 * @private
 */ 
DvtStyleProcessor._resolveStyle = function(cssDiv, property)
{
  var handler = DvtStyleProcessor[property];
  var value = handler ? handler(cssDiv) : DvtStyleProcessor.defaultStyleProcessor(cssDiv, property);
  
  // Ensure the returned value is not null or empty string.
  return (value != null && !(typeof value == 'string' && value.replace(/^\s+/g, '') == '')) ? value : null;
}
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.dvtBaseComponent
 * @augments oj.baseComponent
 * @since 0.7
 * @abstract
 */
oj.__registerWidget('oj.dvtBaseComponent', $['oj']['baseComponent'], {  
  //** @inheritdoc */ 
  _ComponentCreate : function() {
    this._super();
    
    // Create a reference div within the element to be used for computing relative event coords.
    this._referenceDiv = $(document.createElement("div"));
    this._referenceDiv.attr("style", "visibility:hidden;");
    this.element.append(this._referenceDiv);
  
    // Create the DvtContext, which creates the svg element and adds it to the DOM.
    var parentElement = this.element[0].parentElement;
    if (parentElement && parentElement._dvtcontext)
      this._context = parentElement._dvtcontext;
    else
      this._context = new dvt.DvtContext(this.element[0], null, this._referenceDiv[0]);
    
    // Set the reading direction on the context
    this._context.setReadingDirection(this._GetReadingDirection());
    
    // Set the tooltip and datatip callbacks and div style classes
    this._context.setTooltipAttachedCallback(oj.Components.subtreeAttached);
    this._context.setTooltipStyleClass('oj-dvt-tooltip');
    this._context.setDatatipStyleClass('oj-dvt-datatip');
    
    // Set high contrast mode if needed
    if ($(document.body).hasClass('oj-hicontrast'))
      dvt.DvtAgent.setHighContrast(true);
    
    // Create and cache the component instance
    this._component = this._CreateDvtComponent(this._context, this._HandleEvent, this);

    // Add the component to the display tree of the rendering context.
    this._context.getStage().addChild(this._component);  
    
    // Set the helpers for locale support
    this._setLocaleHelpers();
    
    // Retrieve and apply the translated strings onto the component bundle
    this._processTranslations();

    // Load component resources
    this._LoadResources();
  },
  
  //** @inheritdoc */      
  _AfterCreate : function () 
  {
    // Allow superclass to process root attributes and context menus
    this._super();
    
    this.element.attr("tabIndex", 0);
    
    // Render the component
    this._Render();
    
    // Add resize listener with 250ms delay
    this._resizeListener = this._handleResize.bind(this);
    oj.DomUtils.addResizeListener(this.element[0], this._resizeListener, 250);
  },
  
  //** @inheritdoc */ 
  refresh : function() {
    this._super();
  
    // Update the reading direction on the context
    this._context.setReadingDirection(this._GetReadingDirection());
    
    // Retrieve and apply the translated strings onto the component bundle
    this._processTranslations();
  
    // Render the component with any changes
    this._Render();
  },
  
  //** @inheritdoc */ 
  getNodeBySubId : function(locator) {
    var automation = (this._component && this._component.getAutomation) ? this._component.getAutomation() : null;
    if (automation) {
      // Convert the locator to the subid string, since the shared JS layer only accepts the subid string syntax.
      var subId = this._ConvertLocatorToSubId(locator);
      return automation.getDomElementForSubId(subId);
    }
  },
  
  //** @inheritdoc */ 
  getSubIdByNode : function(node) {
    var automation = (this._component && this._component.getAutomation) ? this._component.getAutomation() : null;
    if (automation) {
      // Retrieve the subid string from the shared JS layer, and convert it to the locator object.
      var subId = automation.getSubIdForDomElement(node);
      return subId ? this._ConvertSubIdToLocator(subId) : null;
    }
  },
  
  /**
   * Converts the specified locator object into a subId string.
   * @param {Object} locator
   * @return {string|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ConvertLocatorToSubId : function(locator) {
    // subclasses must override to support getNodeBySubId
    return null;
  },
  
  /**
   * Converts the specified subId string into a locator object.
   * @param {string} subId
   * @return {Object|null}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ConvertSubIdToLocator : function(subId) {
    // subclasses must override to support getSubIdByNode
    return null;
  },
  
  /**
   * Create dummy divs for style classes and merge style class values with json .
   * options object
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _ProcessStyles : function() {
    // Append the component style classes to the element
    var componentStyles = this._GetComponentStyleClasses();
    for(var i=0; i<componentStyles.length; i++) {
      this.element.addClass(componentStyles[i]);
    }
  	
  	// Process selectors for this component
    DvtStyleProcessor.processStyles(this.element, this.options, 
                                    this._GetComponentStyleClasses(), 
                                    this._GetChildStyleClasses());
  },
  
  /**
   * Returns the style classes associated with the component.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetComponentStyleClasses : function() {
    return ['oj-dvtbase'];
  },
  
  /**
   * Returns a map of the style classes associated with a component's children.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetChildStyleClasses : function() {
    return {};
  },
  
  /**
   * Returns an array of supported event types.  Used in conjunction with _setOptions to skip unnecessary rendering when 
   * event listeners are bound. Subclasses must override to return supported event types.
   * @return {Array}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetEventTypes : function() {
    return [];
  },
  
  /**
   * Returns a map containing keys corresponding to the string ids in ojtranslations.js and values corresponding to the 
   * toolkit constants for the DvtBundle objects.  This map must be guaranteed to be a new instance so that subclasses can
   * add their translations to it.
   * @return {Object}
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];
  
    // Create the mapping to return.
    var ret = {
      'DvtUtilBundle.CLEAR_SELECTION': translations['labelClearSelection'],
      'DvtUtilBundle.COLON_SEP_LIST' : translations['labelAndValue'],
      'DvtUtilBundle.INVALID_DATA': translations['labelInvalidData'],
      'DvtUtilBundle.NO_DATA': translations['labelNoData'],
      
      // Accessibility
      'DvtUtilBundle.DATA_VISUALIZATION': translations['labelDataVisualization'],
      'DvtUtilBundle.STATE_SELECTED': translations['stateSelected'],
      'DvtUtilBundle.STATE_UNSELECTED': translations['stateUnselected'],
      'DvtUtilBundle.STATE_MAXIMIZED': translations['stateMaximized'],
      'DvtUtilBundle.STATE_MINIMIZED': translations['stateMinimized'],
      'DvtUtilBundle.STATE_EXPANDED': translations['stateExpanded'],
      'DvtUtilBundle.STATE_COLLAPSED': translations['stateCollapsed'],
      'DvtUtilBundle.STATE_ISOLATED': translations['stateIsolated'],
      'DvtUtilBundle.STATE_HIDDEN': translations['stateHidden'],
      'DvtUtilBundle.STATE_VISIBLE': translations['stateVisible'],
      
      'DvtUtilBundle.SCALING_SUFFIX_THOUSAND': translations['labelScalingSuffixThousand'],
      'DvtUtilBundle.SCALING_SUFFIX_MILLION': translations['labelScalingSuffixMillion'],
      'DvtUtilBundle.SCALING_SUFFIX_BILLION': translations['labelScalingSuffixBillion'],
      'DvtUtilBundle.SCALING_SUFFIX_TRILLION': translations['labelScalingSuffixTrillion'],
      'DvtUtilBundle.SCALING_SUFFIX_QUADRILLION': translations['labelScalingSuffixQuadrillion']
    };
    
    // Add abbreviated month strings
    var monthNames = oj.LocaleData.getMonthNames("abbreviated");
    ret['DvtUtilBundle.MONTH_SHORT_JANUARY'] = monthNames[0];
    ret['DvtUtilBundle.MONTH_SHORT_FEBRUARY'] = monthNames[1];
    ret['DvtUtilBundle.MONTH_SHORT_MARCH'] = monthNames[2];
    ret['DvtUtilBundle.MONTH_SHORT_APRIL'] = monthNames[3];
    ret['DvtUtilBundle.MONTH_SHORT_MAY'] = monthNames[4];
    ret['DvtUtilBundle.MONTH_SHORT_JUNE'] = monthNames[5];
    ret['DvtUtilBundle.MONTH_SHORT_JULY'] = monthNames[6];
    ret['DvtUtilBundle.MONTH_SHORT_AUGUST'] = monthNames[7];
    ret['DvtUtilBundle.MONTH_SHORT_SEPTEMBER'] = monthNames[8];
    ret['DvtUtilBundle.MONTH_SHORT_OCTOBER'] = monthNames[9];
    ret['DvtUtilBundle.MONTH_SHORT_NOVEMBER'] = monthNames[10];
    ret['DvtUtilBundle.MONTH_SHORT_DECEMBER'] = monthNames[11];
    
    return ret;
  },
  
  /**
   * Retrieves the translated resource with the specified 
   * @param {string} key The key used to retrieve the translated resource.
   * @param {Array.<string>} params The array of named parameters that need to be converted into index based parameters.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _GetTranslatedResource: function(key, params) {
    var translatedResource = this.options['translations'][key];
    
    // If named parameters are defined, replace with index based params     
    if(params) {
      var paramMap = {};
      
      for(var i=0; i<params.length; i++) {
        paramMap[params[i]] = '{' + i + '}';
      }
      
      translatedResource = oj.Translations.applyParameters(translatedResource, paramMap);
    }

    return translatedResource;
  },
   
  /**
   * Called to process the translated strings for this widget.  
   * @private
   */
  _processTranslations: function() {
    // Retrieve the map of translation keys + DvtBundle identifiers
    var translationMap = this._GetTranslationMap();
    
    // Register with the DvtBundle
    dvt.DvtBundle.addLocalizedStrings(translationMap);
  },
  
  /**
   * @private
   * @instance
   * @memberof! oj.dvtBaseComponent
   */
  _setLocaleHelpers : function () {
    var helpers = {};
    
    // Number converter factory for use in formatting default strings
    helpers['numberConverterFactory'] = oj.Validation.getDefaultConverterFactory('number');
    
    // Date to iso converter to be called before passing to the date time converter
    helpers['dateToIsoConverter'] = function(input) {
      return (input instanceof Date) ? oj.IntlConverterUtils.dateToLocalIso(input) : input;
    }
    
    // Iso to date converter to be called for JS that requires Dates
    helpers['isoToDateConverter'] = function(input) {
      return (typeof(input) == 'string') ? oj.IntlConverterUtils.isoToLocalDate(input) : input;
    }
    
    this._context.setLocaleHelpers(helpers);
  },
  
  //** @inheritdoc */ 
  _destroy : function() {
    // Hide all component tooltips
    this._context.hideTooltips();
    
    // Call destroy on the JS component
    if (this._component.destroy)
      this._component.destroy();
      
    // Remove DOM resize listener  
    oj.DomUtils.removeResizeListener(this.element[0], this._resizeListener);
    
    // Remove children and clean up DOM changes
    this.element.children().remove();
    this.element.removeAttr('role').removeAttr('tabIndex');
    
    // Remove style classes that were added
    var componentStyles = this._GetComponentStyleClasses();
    for(var i=0; i<componentStyles.length; i++) {
      this.element.removeClass(componentStyles[i]);
    }
    
    // Call super last for destroy
    this._super();
  },

  //** @inheritdoc */ 
  _setOptions : function(options, flags) {
    // Call the super to update the property values
    this._superApply(arguments);
    
    // Render the component with the updated options.
    if(this._bUserDrivenChange) {
      // Option change fired in response to user gesture. Already reflected in UI, so no render needed.
      return;
    }
    else {
      // Event listeners don't require rendering.  Iterate through options to check for non-event options.
      // Also no render is needed if the component has exposed a method to update the option without rerendering.
      var bRenderNeeded = false;
      var eventTypes = this._GetEventTypes();
      var optimizedOptions = ['highlightedCategories', 'selection', 'dataCursorPosition'];
      $.each(options, function(key, value) {
        if(eventTypes.indexOf(key) < 0 && optimizedOptions.indexOf(key) < 0) {
          bRenderNeeded = true;
          return false;
        }
      }); 
        
      if(bRenderNeeded) 
        this._Render();
      else {
        // Update options without rerendering. Check for undefined to allow nulls.
        if (options['highlightedCategories'] !== undefined)
          this._component.highlight(options['highlightedCategories']);
        if (options['selection'] !== undefined)
          this._component.select(options['selection']);
        if (options['dataCursorPosition'] !== undefined && this._component.positionDataCursor)
          this._component.positionDataCursor(options['dataCursorPosition']);
      }
    }
  },
  
  
  /**
   * Called by _create to instantiate the specific DVT component instance.  Subclasses must override.
   * @param {dvt.DvtContext} context
   * @param {Function} callback
   * @param {Object} callbackObj
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return null; // subclasses must override
  },
  
  /**
   * Called by the component to process events.  Subclasses should override to delegate DVT component events to their 
   * JQuery listeners.
   * @param {Object} event
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _HandleEvent : function(event) {
    // TODO: hiddenCategories and highlightedCategories should use DvtOptionChangeEvent
    
    var type = event && event.getType ? event.getType() : null;
    if (type === dvt.DvtCategoryHideShowEvent.TYPE_HIDE || type === dvt.DvtCategoryHideShowEvent.TYPE_SHOW) {
      this._UserOptionChange('hiddenCategories', event['hiddenCategories']);
    }
    else if (type === dvt.DvtCategoryRolloverEvent.TYPE_OVER || type === dvt.DvtCategoryRolloverEvent.TYPE_OUT) {
      this._UserOptionChange('highlightedCategories', event['categories']);
    }
    else if (type === dvt.DvtOptionChangeEvent.TYPE) {
      this._UserOptionChange(event['key'], event['value'], event['optionMetadata']);
    }
    else if (this.options['contextMenu'] && type === dvt.DvtComponentTouchEvent.TOUCH_HOVER_END_TYPE) {
      this._OpenContextMenu($.Event(event.getNativeEvent()), 'touch');
    }
  },
  
  /**
   * Called when the component is resized.
   * @param {number} width
   * @param {number} height
   * @private
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _handleResize : function(width, height) {
    // Render the component at the new size if it changed enough
    var newWidth = this.element.width();
    var newHeight = this.element.height();
    if(this._width == null || this._height == null || (Math.abs(newWidth - this._width) + Math.abs(newHeight - this._height) >= 5)) 
      this._Render(true);
  },
  
  /**
   * Called once during component creation to load resources.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _LoadResources : function() {
    // subcomponents should override
  }, 
          
  /**
   * Called to render the component at the current size.
   * @param {boolean} isResize (optional) Whether it is a resize rerender.
   * @protected
   * @instance
   * @memberof oj.dvtBaseComponent
   */
  _Render : function(isResize) {
    // Fix 18498656: If the component is not attached to a visible subtree of the DOM, rendering will fail because 
    // getBBox calls will not return the correct values.  Log an error message in this case and avoid rendering.
    // Note: Checking offsetParent() does not work here since it returns false for position: fixed.
    if(!this._context.isReadyToRender()){
      oj.Logger.info(this.options['translations']['messageNotReadyToRender']['summary']);
      this._renderNeeded = true; 
    }
    else {
      // Add the width, height, and locale as private fields in the options for debugging purposes
      this._width = this.element.width();
      this._height = this.element.height();
      this.options['_width'] = this._width;
      this.options['_height'] = this._height;
      this.options['_locale'] = oj.Config.getLocale();
    
      // Merge css styles with with json options object
      this._ProcessStyles();
      
      // Render the component. Skip the options on resize to suppress animation.
      this._component.render(isResize ? null : this.options, this._width, this._height);
      
      this._renderNeeded = false;
    }
  },
  
  //** @inheritdoc */ 
  _NotifyShown: function()
  {
    this._super();
    if(this._renderNeeded)
      this._Render();
  },
  
  //** @inheritdoc */ 
  _NotifyAttached: function()
  {
    this._super();
    if(this._renderNeeded)
      this._Render();
  },
    
  //** @inheritdoc */ 
  _NotifyDetached : function() {
    this._super();
    this._context.hideTooltips();
  },
  
  //** @inheritdoc */ 
  _NotifyHidden : function() {
    this._super();
    this._context.hideTooltips();
  },
  
  /**
   * Sets an option change that was driven by user gesture.  Used in conjunction with _setOption to ensure that the
   * correct optionMetadata flag for writeback is set.
   * @param {string} key The name of the option to set.
   * @param {Object} value The value to set for the option.
   * @param {Object} optionMetadata The optionMetadata for the optionChange event
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _UserOptionChange : function(key, value, optionMetadata) {
    this._bUserDrivenChange = true;

    this.option(key, value, {'_context': {writeback:true, optionMetadata: optionMetadata, internalSet: true}});
    
    this._bUserDrivenChange = false;
  },
  
  //** @inheritdoc */ 
  _NotifyContextMenuGesture: function(menu, event, eventType) {
    // DVTs support context menus on touch hold release which is detected by the 
    // toolkit and handled in _HandleEvent after receiving touch hold release event.
    if (eventType === "touch")
      return;
    // Position context menus relative to the current keyboard focus when keyboard triggered
    else if (eventType === "keyboard")
      this._OpenContextMenu(event, eventType, {"position": {"of": this._component.getKeyboardFocus()}});
    else
      this._super(menu, event, eventType);
  },
  
  /**
   * Returns a DVT component associated with a DOMElement
   * @param {Element} element The DOMElement to get the DVT component from.
   * @return {Object} The DVT component associated with the DOMElement or null
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _GetDvtComponent: function(element) {
    var widget = oj.Components.getWidgetConstructor(element)("instance");
    if (widget) {
      return widget._component;
    }
    return null;
  },
  
  
  /**
   * Adds getters for the properties on the specified map.
   * @param {Object|null} map
   * @memberof oj.dvtBaseComponent
   * @instance
   * @protected
   */
  _AddAutomationGetters: function(map) {
    if(!map)
      return;
    
    // Bug 20884377: Adds legacy getters to the object maps returned by the automation code. These getters are 
    // deprecated and will be removed in 1.2.0.
    var props = {};
    for (var key in map) {
      this._addGetter(map, key, props);
    }
    Object.defineProperties(map, props);
  },
  
  /**
   * Adds getter for the specified property on the specified properties map.
   * @param {Object} map
   * @param {string} key
   * @param {Object} props The properties map onto which the getter will be added.
   * @memberof oj.dvtBaseComponent
   * @instance
   * @private
   */
  _addGetter: function(map, key, props) {
    var prefix = (key == 'selected') ? 'is' : 'get';
    var getterName = prefix + key.charAt(0).toUpperCase() + key.slice(1);
    props[getterName] = {'value': function() { return map[key] }};
  },
  
  /**
   * Converts an indexPath array to a string of the form '[index0][index1]...[indexN]'.
   * @param {Array} indexPath
   * @return {string} The resulting string.
   * @instance
   * @protected
   */
  _GetStringFromIndexPath : function(indexPath) {
    var ret = '';
    for(var i=0; i<indexPath.length; i++) {
      ret += '[' + indexPath[i] + ']';
    }
    return ret;
  },
  
  /**
   * Converts a string containing indices in the form '[index0][index1]...[indexN]' to an array of indices.
   * @param {string} subId
   * @return {Array} The resulting array to be used for locator indexPath.
   * @instance
   * @protected
   */
  _GetIndexPath : function(subId) {
    var indexPath = [];
    var currentIndex = 0;
    while(subId.indexOf('[', currentIndex) > 0) {
      var start = subId.indexOf('[', currentIndex) + 1;
      var end = subId.indexOf(']', currentIndex)
      indexPath.push(Number(subId.substring(start, end)));
      currentIndex = end + 1;
    }
    return indexPath;
  },
  
  /**
   * Converts a string containing a single index in the form '[index]' into the numerical index.
   * @param {string} subId
   * @return {number}
   * @instance
   * @protected
   */
  _GetFirstIndex : function(subId) {
    return Number(this._GetFirstBracketedString(subId));
  },
  
  /**
   * Returns the first bracketed substring in the specified string.
   * @param {string} subId
   * @return {string}
   * @instance
   * @protected
   */
  _GetFirstBracketedString : function(subId) {
    var start = subId.indexOf('[') + 1;
    var end = subId.indexOf(']');
    return subId.substring(start, end);
  }
  
}, true);
/**
 * <p>This component should be bound to an HTML div element, and the SVG DOM that it generates should be treated as a 
 * black box, as it is subject to change.  This component should not be extended.</p>
 * 
 * @ojfragment warning
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * 
 * <p>The application is responsible for populating the shortDesc value in the 
 * component options object with meaningful descriptors when the component does 
 * not provide a default descriptor.</p>
 * 
 * @ojfragment a11y
 * @memberof oj.ojChart
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * 
 * <p>The application is responsible for populating the shortDesc value in the 
 * component options object with meaningful descriptors when the component does 
 * not provide a default descriptor.  Since component terminology for keyboard 
 * and touch shortcuts can conflict with those of the application, it is the 
 * application's responsibility to provide these shortcuts, possibly via a help 
 * popup.</p>
 * 
 * @ojfragment a11yKeyboard
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 * 
 * <p>
 *   As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the 
 *   component must be <code class="prettyprint">refresh()</code>ed.
 * </p>
 * 
 * @ojfragment rtl
 * @memberof oj.dvtBaseComponent
 */

/**
 * Creates a shape attribute group handler that will generate shape attribute values.
 * @param {Object} [matchRules] A map of key value pairs for categories and the matching attribute value e.g. {"soda" : "square", "water" : "circle", "iced tea" : "triangleUp"}.
 *                            Attribute values listed in the matchRules object will be reserved only for the matching categories when getAttributeValue is called.
 * @export
 * @constructor
 * @extends {oj.AttributeGroupHandler}
 */
oj.ShapeAttributeGroupHandler = function(matchRules) {
  this.Init(matchRules);
}

oj.Object.createSubclass(oj.ShapeAttributeGroupHandler, oj.AttributeGroupHandler, "oj.ShapeAttributeGroupHandler");

oj.ShapeAttributeGroupHandler._attributeValues = ['square', 'circle', 'diamond', 'plus', 'triangleDown', 'triangleUp', 'human'];

//** @inheritdoc */
oj.ShapeAttributeGroupHandler.prototype.getValueRamp = function() {
  return oj.ShapeAttributeGroupHandler._attributeValues.slice();
}
});
