/**
 * Copyright (c) 2014, 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
"use strict";
define(["ojs/ojcore", "jquery", "ojs/ojcomponentcore", "ojs/ojdvt-base", "ojs/internal-deps/dvt/DvtChart"], function($oj$$25$$, $$$$24$$, $comp$$6$$, $base$$6$$, $dvt$$3$$) {
  $oj$$25$$.$__registerWidget$("oj.ojChart", $$$$24$$.oj.dvtBaseComponent, {widgetEventPrefix:"oj", options:{categoryFilter:null, categoryHighlight:null, optionChange:null, selectInput:null, viewportChange:null, viewportChangeInput:null, drill:null}, $_CreateDvtComponent$:function($context$$80$$, $callback$$100$$, $callbackObj$$5$$) {
    return $dvt$$3$$.DvtChart.newInstance($context$$80$$, $callback$$100$$, $callbackObj$$5$$);
  }, $_ConvertLocatorToSubId$:function($locator$$31$$) {
    var $subId$$31$$ = $locator$$31$$.subId;
    "oj-chart-item" == $subId$$31$$ ? $subId$$31$$ = "dataItem[" + $locator$$31$$.seriesIndex + "][" + $locator$$31$$.itemIndex + "]" : "oj-chart-group" == $subId$$31$$ ? $subId$$31$$ = "group" + this.$_GetStringFromIndexPath$($locator$$31$$.indexPath) : "oj-chart-series" == $subId$$31$$ ? $subId$$31$$ = "series[" + $locator$$31$$.index + "]" : "oj-chart-axis-title" == $subId$$31$$ ? $subId$$31$$ = $locator$$31$$.axis + ":title" : "oj-chart-reference-object" == $subId$$31$$ ? $subId$$31$$ = $locator$$31$$.axis + 
    ":referenceObject[" + $locator$$31$$.index + "]" : "oj-legend-section" == $subId$$31$$ ? $subId$$31$$ = "legend:section" + this.$_GetStringFromIndexPath$($locator$$31$$.indexPath) : "oj-legend-item" == $subId$$31$$ ? ($subId$$31$$ = "legend:section" + this.$_GetStringFromIndexPath$($locator$$31$$.sectionIndexPath), $subId$$31$$ += ":item[" + $locator$$31$$.itemIndex + "]") : "oj-chart-tooltip" == $subId$$31$$ && ($subId$$31$$ = "tooltip");
    return $subId$$31$$;
  }, $_ConvertSubIdToLocator$:function($itemSubstr_subId$$32$$) {
    var $locator$$32$$ = {};
    if (0 == $itemSubstr_subId$$32$$.indexOf("dataItem")) {
      var $indexPath$$2_sectionSubstr$$ = this.$_GetIndexPath$($itemSubstr_subId$$32$$);
      $locator$$32$$.subId = "oj-chart-item";
      $locator$$32$$.seriesIndex = $indexPath$$2_sectionSubstr$$[0];
      $locator$$32$$.itemIndex = $indexPath$$2_sectionSubstr$$[1];
    } else {
      if (0 == $itemSubstr_subId$$32$$.indexOf("group")) {
        $locator$$32$$.subId = "oj-chart-group", $locator$$32$$.indexPath = this.$_GetIndexPath$($itemSubstr_subId$$32$$);
      } else {
        if (0 == $itemSubstr_subId$$32$$.indexOf("series")) {
          $locator$$32$$.subId = "oj-chart-series", $locator$$32$$.index = this.$_GetFirstIndex$($itemSubstr_subId$$32$$);
        } else {
          if (0 < $itemSubstr_subId$$32$$.indexOf("Axis:title")) {
            $locator$$32$$.subId = "oj-chart-axis-title", $locator$$32$$.axis = $itemSubstr_subId$$32$$.substring(0, $itemSubstr_subId$$32$$.indexOf(":"));
          } else {
            if (0 < $itemSubstr_subId$$32$$.indexOf("Axis:referenceObject")) {
              $locator$$32$$.subId = "oj-chart-reference-object", $locator$$32$$.axis = $itemSubstr_subId$$32$$.substring(0, $itemSubstr_subId$$32$$.indexOf(":")), $locator$$32$$.index = this.$_GetFirstIndex$($itemSubstr_subId$$32$$);
            } else {
              if (0 == $itemSubstr_subId$$32$$.indexOf("legend")) {
                if (0 < $itemSubstr_subId$$32$$.indexOf(":item")) {
                  var $itemStartIndex$$ = $itemSubstr_subId$$32$$.indexOf(":item"), $indexPath$$2_sectionSubstr$$ = $itemSubstr_subId$$32$$.substring(0, $itemStartIndex$$);
                  $itemSubstr_subId$$32$$ = $itemSubstr_subId$$32$$.substring($itemStartIndex$$);
                  $locator$$32$$.subId = "oj-legend-item";
                  $locator$$32$$.sectionIndexPath = this.$_GetIndexPath$($indexPath$$2_sectionSubstr$$);
                  $locator$$32$$.itemIndex = this.$_GetFirstIndex$($itemSubstr_subId$$32$$);
                } else {
                  0 == $itemSubstr_subId$$32$$.indexOf("section") && ($locator$$32$$.subId = "oj-legend-section", $locator$$32$$.indexPath = this.$_GetIndexPath$($itemSubstr_subId$$32$$));
                }
              } else {
                "tooltip" == $itemSubstr_subId$$32$$ && ($locator$$32$$.subId = "oj-chart-tooltip");
              }
            }
          }
        }
      }
    }
    return $locator$$32$$;
  }, $_ProcessStyles$:function() {
    this._super();
    this.options.styleDefaults || (this.options.styleDefaults = {});
    if (!this.options.styleDefaults.colors) {
      var $handler$$50$$ = new $oj$$25$$.$ColorAttributeGroupHandler$;
      this.options.styleDefaults.colors = $handler$$50$$.$getValueRamp$();
    }
  }, $_GetComponentStyleClasses$:function() {
    var $styleClasses$$6$$ = this._super();
    $styleClasses$$6$$.push("oj-chart");
    return $styleClasses$$6$$;
  }, $_GetChildStyleClasses$:function() {
    var $styleClasses$$7$$ = this._super();
    $styleClasses$$7$$["oj-chart-footnote"] = {path:"footnote/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-slice-label"] = {path:"styleDefaults/sliceLabelStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-subtitle"] = {path:"subtitle/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-title"] = {path:"title/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-xaxis-tick-label"] = {path:"xAxis/tickLabel/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-xaxis-title"] = {path:"xAxis/titleStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-yaxis-tick-label"] = {path:"yAxis/tickLabel/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-yaxis-title"] = {path:"yAxis/titleStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-y2axis-tick-label"] = {path:"y2Axis/tickLabel/style", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-y2axis-title"] = {path:"y2Axis/titleStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-chart-stock-falling"] = {path:"styleDefaults/stockFallingColor", property:"background-color"};
    $styleClasses$$7$$["oj-chart-stock-range"] = {path:"styleDefaults/stockRangeColor", property:"background-color"};
    $styleClasses$$7$$["oj-chart-stock-rising"] = {path:"styleDefaults/stockRisingColor", property:"background-color"};
    $styleClasses$$7$$["oj-chart-pan-icon"] = {path:"_resources/panUp", property:"CSS_URL"};
    $styleClasses$$7$$["oj-chart-pan-icon oj-active"] = {path:"_resources/panDown", property:"CSS_URL"};
    $styleClasses$$7$$["oj-chart-select-icon"] = {path:"_resources/selectUp", property:"CSS_URL"};
    $styleClasses$$7$$["oj-chart-select-icon oj-active"] = {path:"_resources/selectDown", property:"CSS_URL"};
    $styleClasses$$7$$["oj-chart-zoom-icon"] = {path:"_resources/zoomUp", property:"CSS_URL"};
    $styleClasses$$7$$["oj-chart-zoom-icon oj-active"] = {path:"_resources/zoomDown", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend"] = {path:"legend/textStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-legend-title"] = {path:"legend/titleStyle", property:"CSS_TEXT_PROPERTIES"};
    $styleClasses$$7$$["oj-legend-section-close-icon"] = {path:"legend/_resources/closedEnabled", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend-section-close-icon oj-hover"] = {path:"legend/_resources/closedOver", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend-section-close-icon oj-active"] = {path:"legend/_resources/closedDown", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend-section-open-icon"] = {path:"legend/_resources/openEnabled", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend-section-open-icon oj-hover"] = {path:"legend/_resources/openOver", property:"CSS_URL"};
    $styleClasses$$7$$["oj-legend-section-open-icon oj-active"] = {path:"legend/_resources/openDown", property:"CSS_URL"};
    return $styleClasses$$7$$;
  }, $_GetEventTypes$:function() {
    return "categoryFilter categoryHighlight drill optionChange selectInput viewportChange viewportChangeInput".split(" ");
  }, $_GetTranslationMap$:function() {
    var $translations$$12$$ = this.options.translations, $ret$$31$$ = this._super();
    $ret$$31$$["DvtChartBundle.DEFAULT_GROUP_NAME"] = this.$_GetTranslatedResource$("labelDefaultGroupName", ["groupName"]);
    $ret$$31$$["DvtChartBundle.LABEL_SERIES"] = $translations$$12$$.labelSeries;
    $ret$$31$$["DvtChartBundle.LABEL_GROUP"] = $translations$$12$$.labelGroup;
    $ret$$31$$["DvtChartBundle.LABEL_VALUE"] = $translations$$12$$.labelValue;
    $ret$$31$$["DvtChartBundle.LABEL_TARGET_VALUE"] = $translations$$12$$.labelTargetValue;
    $ret$$31$$["DvtChartBundle.LABEL_X"] = $translations$$12$$.labelX;
    $ret$$31$$["DvtChartBundle.LABEL_Y"] = $translations$$12$$.labelY;
    $ret$$31$$["DvtChartBundle.LABEL_Z"] = $translations$$12$$.labelZ;
    $ret$$31$$["DvtChartBundle.LABEL_PERCENTAGE"] = $translations$$12$$.labelPercentage;
    $ret$$31$$["DvtChartBundle.LABEL_LOW"] = $translations$$12$$.labelLow;
    $ret$$31$$["DvtChartBundle.LABEL_HIGH"] = $translations$$12$$.labelHigh;
    $ret$$31$$["DvtChartBundle.LABEL_OPEN"] = $translations$$12$$.labelOpen;
    $ret$$31$$["DvtChartBundle.LABEL_CLOSE"] = $translations$$12$$.labelClose;
    $ret$$31$$["DvtChartBundle.LABEL_VOLUME"] = $translations$$12$$.labelVolume;
    $ret$$31$$["DvtChartBundle.LABEL_MIN"] = $translations$$12$$.labelMin;
    $ret$$31$$["DvtChartBundle.LABEL_MAX"] = $translations$$12$$.labelMax;
    $ret$$31$$["DvtChartBundle.LABEL_OTHER"] = $translations$$12$$.labelOther;
    $ret$$31$$["DvtChartBundle.PAN"] = $translations$$12$$.tooltipPan;
    $ret$$31$$["DvtChartBundle.MARQUEE_SELECT"] = $translations$$12$$.tooltipSelect;
    $ret$$31$$["DvtChartBundle.MARQUEE_ZOOM"] = $translations$$12$$.tooltipZoom;
    $ret$$31$$["DvtUtilBundle.CHART"] = $translations$$12$$.componentName;
    $translations$$12$$.labelDefaultGroupName = $translations$$12$$.labelDefaultGroupName.replace("{groupName}", "{0}");
    return $ret$$31$$;
  }, $_HandleEvent$:function($event$$328_selectPayload$$) {
    var $filterType_type$$85$$ = $event$$328_selectPayload$$ && $event$$328_selectPayload$$.getType ? $event$$328_selectPayload$$.getType() : null;
    if ($filterType_type$$85$$ === $dvt$$3$$.DvtSelectionEvent.TYPE || $filterType_type$$85$$ === $dvt$$3$$.DvtSelectionEvent.TYPE_INPUT) {
      var $selection$$14$$ = $event$$328_selectPayload$$.getSelection();
      if ($selection$$14$$) {
        for (var $selectedItems_viewportChangePayload$$ = [], $i$$323$$ = 0;$i$$323$$ < $selection$$14$$.length;$i$$323$$++) {
          var $selectedItem$$ = {id:$selection$$14$$[$i$$323$$].getId(), series:$selection$$14$$[$i$$323$$].getSeries(), group:$selection$$14$$[$i$$323$$].getGroup()};
          $selectedItems_viewportChangePayload$$.push($selectedItem$$);
        }
        $event$$328_selectPayload$$ = {endGroup:$event$$328_selectPayload$$.getEndGroup(), startGroup:$event$$328_selectPayload$$.getStartGroup(), xMax:$event$$328_selectPayload$$.getXMax(), xMin:$event$$328_selectPayload$$.getXMin(), yMax:$event$$328_selectPayload$$.getYMax(), yMin:$event$$328_selectPayload$$.getYMin()};
        $filterType_type$$85$$ === $dvt$$3$$.DvtSelectionEvent.TYPE ? this.$_UserOptionChange$("selection", $selectedItems_viewportChangePayload$$, $event$$328_selectPayload$$) : ($event$$328_selectPayload$$.items = $selectedItems_viewportChangePayload$$, this._trigger("selectInput", null, $event$$328_selectPayload$$));
      }
    } else {
      $filterType_type$$85$$ === $dvt$$3$$.DvtCategoryHideShowEvent.TYPE_HIDE || $filterType_type$$85$$ === $dvt$$3$$.DvtCategoryHideShowEvent.TYPE_SHOW ? ($filterType_type$$85$$ = $filterType_type$$85$$ === $dvt$$3$$.DvtCategoryHideShowEvent.TYPE_HIDE ? "out" : "in", this._trigger("categoryFilter", null, {category:$event$$328_selectPayload$$.getCategory(), type:$filterType_type$$85$$}), this.$_UserOptionChange$("hiddenCategories", $event$$328_selectPayload$$.hiddenCategories)) : $filterType_type$$85$$ === 
      $dvt$$3$$.DvtCategoryRolloverEvent.TYPE_OVER || $filterType_type$$85$$ === $dvt$$3$$.DvtCategoryRolloverEvent.TYPE_OUT ? (this._trigger("categoryHighlight", null, {categories:$event$$328_selectPayload$$.categories, type:$filterType_type$$85$$ === $dvt$$3$$.DvtCategoryRolloverEvent.TYPE_OVER ? "on" : "off"}), this.$_UserOptionChange$("highlightedCategories", $event$$328_selectPayload$$.categories)) : $filterType_type$$85$$ === $dvt$$3$$.DvtChartViewportChangeEvent.TYPE || $filterType_type$$85$$ === 
      $dvt$$3$$.DvtChartViewportChangeEvent.TYPE_INPUT ? ($selectedItems_viewportChangePayload$$ = {endGroup:$event$$328_selectPayload$$.getEndGroup(), startGroup:$event$$328_selectPayload$$.getStartGroup(), xMax:$event$$328_selectPayload$$.getXMax(), xMin:$event$$328_selectPayload$$.getXMin(), yMax:$event$$328_selectPayload$$.getYMax(), yMin:$event$$328_selectPayload$$.getYMin()}, $filterType_type$$85$$ === $dvt$$3$$.DvtChartViewportChangeEvent.TYPE && (this.options.xAxis || (this.options.xAxis = 
      {}), this.options.yAxis || (this.options.yAxis = {}), this.options.xAxis.viewportStartGroup = null, this.options.xAxis.viewportEndGroup = null, null != $event$$328_selectPayload$$.getXMin() && null != $event$$328_selectPayload$$.getXMax() && (this.options.xAxis.viewportMin = $event$$328_selectPayload$$.getXMin(), this.options.xAxis.viewportMax = $event$$328_selectPayload$$.getXMax()), null != $event$$328_selectPayload$$.getYMin() && null != $event$$328_selectPayload$$.getYMax() && (this.options.yAxis.viewportMin = 
      $event$$328_selectPayload$$.getYMin(), this.options.yAxis.viewportMax = $event$$328_selectPayload$$.getYMax())), this._trigger($filterType_type$$85$$ === $dvt$$3$$.DvtChartViewportChangeEvent.TYPE ? "viewportChange" : "viewportChangeInput", null, $selectedItems_viewportChangePayload$$)) : $filterType_type$$85$$ === $dvt$$3$$.DvtDrillEvent.TYPE ? this._trigger("drill", null, {id:$event$$328_selectPayload$$.getId(), series:$event$$328_selectPayload$$.getSeries(), group:$event$$328_selectPayload$$.getGroup()}) : 
      this._super($event$$328_selectPayload$$);
    }
  }, $_LoadResources$:function() {
    null == this.options._resources && (this.options._resources = {});
    var $resources$$ = this.options._resources;
    $resources$$.overviewGrippy = $oj$$25$$.$Config$.$getResourceUrl$("resources/internal-deps/dvt/chart/drag_horizontal.png");
    $resources$$.panCursorDown = $oj$$25$$.$Config$.$getResourceUrl$("resources/internal-deps/dvt/chart/hand-closed.cur");
    $resources$$.panCursorUp = $oj$$25$$.$Config$.$getResourceUrl$("resources/internal-deps/dvt/chart/hand-open.cur");
  }, getTitle:function() {
    return this.$_component$.getAutomation().getTitle();
  }, getGroup:function($groupIndex$$) {
    return this.$_component$.getAutomation().getGroup($groupIndex$$);
  }, getSeries:function($seriesIndex$$) {
    return this.$_component$.getAutomation().getSeries($seriesIndex$$);
  }, getGroupCount:function() {
    return this.$_component$.getAutomation().getGroupCount();
  }, getSeriesCount:function() {
    return this.$_component$.getAutomation().getSeriesCount();
  }, getDataItem:function($seriesIndex$$1$$, $groupIndex$$1$$) {
    var $ret$$32$$ = this.$_component$.getAutomation().getDataItem($seriesIndex$$1$$, $groupIndex$$1$$);
    this.$_AddAutomationGetters$($ret$$32$$);
    return $ret$$32$$;
  }, getLegend:function() {
    var $ret$$33$$ = this.$_component$.getAutomation().getLegend();
    this.$_AddAutomationGetters$($ret$$33$$);
    return $ret$$33$$;
  }, getPlotArea:function() {
    var $ret$$34$$ = this.$_component$.getAutomation().getPlotArea();
    this.$_AddAutomationGetters$($ret$$34$$);
    return $ret$$34$$;
  }, getXAxis:function() {
    var $ret$$35$$ = this.$_component$.getAutomation().getXAxis();
    this.$_AddAutomationGetters$($ret$$35$$);
    return $ret$$35$$;
  }, getYAxis:function() {
    var $ret$$36$$ = this.$_component$.getAutomation().getYAxis();
    this.$_AddAutomationGetters$($ret$$36$$);
    return $ret$$36$$;
  }, getY2Axis:function() {
    var $ret$$37$$ = this.$_component$.getAutomation().getY2Axis();
    this.$_AddAutomationGetters$($ret$$37$$);
    return $ret$$37$$;
  }, getValuesAt:function($x$$54$$, $y$$38$$) {
    return this.$_component$.getValuesAt($x$$54$$, $y$$38$$);
  }, getContextByNode:function($context$$81_node$$55$$) {
    return($context$$81_node$$55$$ = this.getSubIdByNode($context$$81_node$$55$$)) && "oj-chart-tooltip" !== $context$$81_node$$55$$.subId ? $context$$81_node$$55$$ : null;
  }});
  $oj$$25$$.$__registerWidget$("oj.ojSparkChart", $$$$24$$.oj.dvtBaseComponent, {widgetEventPrefix:"oj", options:{}, $_CreateDvtComponent$:function($context$$82$$, $callback$$101$$, $callbackObj$$6$$) {
    return $dvt$$3$$.DvtSparkChart.newInstance($context$$82$$, $callback$$101$$, $callbackObj$$6$$);
  }, $_GetComponentStyleClasses$:function() {
    var $styleClasses$$8$$ = this._super();
    $styleClasses$$8$$.push("oj-sparkchart");
    return $styleClasses$$8$$;
  }, $_GetTranslationMap$:function() {
    var $translations$$13$$ = this.options.translations, $ret$$38$$ = this._super();
    $ret$$38$$["DvtUtilBundle.CHART"] = $translations$$13$$.componentName;
    return $ret$$38$$;
  }, $_Render$:function() {
    this.element.attr("title") ? (this.options.shortDesc = this.element.attr("title"), this.element.data(this.element, "title", this.element.attr("title")), this.element.removeAttr("title")) : this.element.data("title") && (this.options.shortDesc = this.element.data("title"));
    this._super();
  }, getDataItem:function($itemIndex$$) {
    var $auto$$8$$ = this.$_component$.getAutomation();
    return new $oj$$25$$.$SparkChartDataItem$($auto$$8$$.getDataItem($itemIndex$$));
  }});
  $oj$$25$$.$SparkChartDataItem$ = function $$oj$$25$$$$SparkChartDataItem$$($data$$146$$) {
    this.$_data$ = $data$$146$$;
  };
  $goog$exportPath_$$("SparkChartDataItem", $oj$$25$$.$SparkChartDataItem$, $oj$$25$$);
  $oj$$25$$.$SparkChartDataItem$.prototype.$getBorderColor$ = function $$oj$$25$$$$SparkChartDataItem$$$$getBorderColor$$() {
    return this.$_data$ ? this.$_data$.borderColor : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getBorderColor", {$getBorderColor$:$oj$$25$$.$SparkChartDataItem$.prototype.$getBorderColor$});
  $oj$$25$$.$SparkChartDataItem$.prototype.$getColor$ = function $$oj$$25$$$$SparkChartDataItem$$$$getColor$$() {
    return this.$_data$ ? this.$_data$.color : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getColor", {$getColor$:$oj$$25$$.$SparkChartDataItem$.prototype.$getColor$});
  $oj$$25$$.$SparkChartDataItem$.prototype.getDate = function $$oj$$25$$$$SparkChartDataItem$$$getDate$() {
    return this.$_data$ ? this.$_data$.date : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getDate", {getDate:$oj$$25$$.$SparkChartDataItem$.prototype.getDate});
  $oj$$25$$.$SparkChartDataItem$.prototype.getFloatValue = function $$oj$$25$$$$SparkChartDataItem$$$getFloatValue$() {
    return this.$getLow$();
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getFloatValue", {getFloatValue:$oj$$25$$.$SparkChartDataItem$.prototype.getFloatValue});
  $oj$$25$$.$SparkChartDataItem$.prototype.$getLow$ = function $$oj$$25$$$$SparkChartDataItem$$$$getLow$$() {
    return this.$_data$ ? this.$_data$.low : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getLow", {$getLow$:$oj$$25$$.$SparkChartDataItem$.prototype.$getLow$});
  $oj$$25$$.$SparkChartDataItem$.prototype.$getHigh$ = function $$oj$$25$$$$SparkChartDataItem$$$$getHigh$$() {
    return this.$_data$ ? this.$_data$.high : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getHigh", {$getHigh$:$oj$$25$$.$SparkChartDataItem$.prototype.$getHigh$});
  $oj$$25$$.$SparkChartDataItem$.prototype.$getValue$ = function $$oj$$25$$$$SparkChartDataItem$$$$getValue$$() {
    return this.$_data$ ? this.$_data$.value : null;
  };
  $oj$$25$$.$Object$.$exportPrototypeSymbol$("SparkChartDataItem.prototype.getValue", {$getValue$:$oj$$25$$.$SparkChartDataItem$.prototype.$getValue$});
});
