/*!
 * JavaScript Custom Forms : Range Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.2.3
 */
!function(e){e.addModule(function(e){"use strict";return{name:"Range",selector:'input[type="range"]',options:{realElementClass:"jcf-real-element",fakeStructure:'<span class="jcf-range"><span class="jcf-range-wrapper"><span class="jcf-range-track"><span class="jcf-range-handle"><span class="jcf-range-count"><div class="jcf-range-count-number"></div></span></span></span></span>',dataListMark:'<span class="jcf-range-mark"></span>',rangeDisplayWrapper:'<span class="jcf-range-display-wrapper"></span>',rangeDisplay:'<span class="jcf-range-display"></span>',handleSelector:".jcf-range-handle",trackSelector:".jcf-range-track",activeHandleClass:"jcf-active-handle",verticalClass:"jcf-vertical",orientation:"horizontal",range:!1,dragHandleCenter:!0,snapToMarks:!0,snapRadius:5,minRange:0},matchElement:function(e){return e.is(this.selector)},init:function(){this.initStructure(),this.attachEvents(),this.refresh()},initStructure:function(){for(this.page=e("html"),this.realElement=e(this.options.element).addClass(this.options.hiddenClass),this.fakeElement=e(this.options.fakeStructure).insertBefore(this.realElement).prepend(this.realElement),this.track=this.fakeElement.find(this.options.trackSelector),this.trackHolder=this.track.parent(),this.handle=this.fakeElement.find(this.options.handleSelector),this.createdHandleCount=0,this.activeDragHandleIndex=0,this.isMultiple=this.realElement.prop("multiple")||"string"==typeof this.realElement.attr("multiple"),this.values=this.isMultiple?this.realElement.attr("value").split(","):[this.realElement.val()],this.handleCount=this.isMultiple?this.values.length:1,this.rangeDisplayWrapper=e(this.options.rangeDisplayWrapper).insertBefore(this.track),"min"!==this.options.range&&"all"!==this.options.range||(this.rangeMin=e(this.options.rangeDisplay).addClass("jcf-range-min").prependTo(this.rangeDisplayWrapper)),"max"!==this.options.range&&"all"!==this.options.range||(this.rangeMax=e(this.options.rangeDisplay).addClass("jcf-range-max").prependTo(this.rangeDisplayWrapper));this.createdHandleCount<this.handleCount;)this.createdHandleCount++,this.handle.clone().addClass("jcf-index-"+this.createdHandleCount).insertBefore(this.handle),this.createdHandleCount>1&&(this.rangeMid||(this.rangeMid=e()),this.rangeMid=this.rangeMid.add(e(this.options.rangeDisplay).addClass("jcf-range-mid").prependTo(this.rangeDisplayWrapper)));this.handle.detach(),this.handle=null,this.handles=this.fakeElement.find(this.options.handleSelector),this.handles.eq(0).addClass(this.options.activeHandleClass),this.isVertical="vertical"===this.options.orientation,this.directionProperty=this.isVertical?"top":"left",this.offsetProperty=this.isVertical?"bottom":"left",this.eventProperty=this.isVertical?"pageY":"pageX",this.sizeProperty=this.isVertical?"height":"width",this.sizeMethod=this.isVertical?"innerHeight":"innerWidth",this.fakeElement.css("touchAction",this.isVertical?"pan-x":"pan-y"),this.isVertical&&this.fakeElement.addClass(this.options.verticalClass),this.minValue=parseFloat(this.realElement.attr("min")),this.maxValue=parseFloat(this.realElement.attr("max")),this.stepValue=parseFloat(this.realElement.attr("step"))||1,this.minValue=isNaN(this.minValue)?0:this.minValue,this.maxValue=isNaN(this.maxValue)?100:this.maxValue,1!==this.stepValue&&(this.maxValue-=(this.maxValue-this.minValue)%this.stepValue),this.stepsCount=(this.maxValue-this.minValue)/this.stepValue,this.createDataList()},attachEvents:function(){this.realElement.on({focus:this.onFocus}),this.trackHolder.on("jcf-pointerdown",this.onTrackPress),this.handles.on("jcf-pointerdown",this.onHandlePress)},createDataList:function(){var t=this,s=[],a=this.realElement.attr("list");a&&(e("#"+a).find("option").each(function(){var a,i,n=parseFloat(this.value||this.innerHTML);isNaN(n)||(i=t.valueToOffset(n),s.push({value:n,offset:i}),a=e(t.options.dataListMark).text(n).attr({"data-mark-value":n}).css(t.offsetProperty,i+"%").appendTo(t.track))}),s.length&&(t.dataValues=s))},getDragHandleRange:function(e){var t=-(1/0),s=1/0;return e>0&&(t=this.valueToStepIndex(parseFloat(this.values[e-1])+this.options.minRange)),e<this.handleCount-1&&(s=this.valueToStepIndex(parseFloat(this.values[e+1])-this.options.minRange)),{minStepIndex:t,maxStepIndex:s}},getNearestHandle:function(t){this.isVertical&&(t=1-t);var s=this.handles.eq(0),a=1/0,i=this;return this.handleCount>1&&this.handles.each(function(){var n=parseFloat(this.style[i.offsetProperty])/100,r=Math.abs(n-t);a>r&&(a=r,s=e(this))}),s},onTrackPress:function(e){var t,s,a;e.preventDefault(),this.realElement.is(":disabled")||this.activeDragHandle||(t=this.track[this.sizeMethod](),s=this.track.offset()[this.directionProperty],this.activeDragHandle=this.getNearestHandle((e[this.eventProperty]-s)/this.trackHolder[this.sizeMethod]()),this.activeDragHandleIndex=this.handles.index(this.activeDragHandle),this.handles.removeClass(this.options.activeHandleClass).eq(this.activeDragHandleIndex).addClass(this.options.activeHandleClass),a=this.activeDragHandle[this.sizeMethod]()/2,this.dragData={trackSize:t,innerOffset:a,trackOffset:s,min:s,max:s+t},this.page.on({"jcf-pointermove":this.onHandleMove,"jcf-pointerup":this.onHandleRelease}),"mouse"===e.pointerType&&this.realElement.focus(),this.onHandleMove(e))},onHandlePress:function(t){var s,a,i;t.preventDefault(),this.realElement.is(":disabled")||this.activeDragHandle||(this.activeDragHandle=e(t.currentTarget),this.activeDragHandleIndex=this.handles.index(this.activeDragHandle),this.handles.removeClass(this.options.activeHandleClass).eq(this.activeDragHandleIndex).addClass(this.options.activeHandleClass),s=this.track[this.sizeMethod](),a=this.track.offset()[this.directionProperty],i=this.options.dragHandleCenter?this.activeDragHandle[this.sizeMethod]()/2:t[this.eventProperty]-this.handle.offset()[this.directionProperty],this.dragData={trackSize:s,innerOffset:i,trackOffset:a,min:a,max:a+s},this.page.on({"jcf-pointermove":this.onHandleMove,"jcf-pointerup":this.onHandleRelease}),"mouse"===t.pointerType&&this.realElement.focus())},onHandleMove:function(t){var s,a,i,n,r,h=this;if(s=this.isVertical?this.dragData.max+(this.dragData.min-t[this.eventProperty])-this.dragData.innerOffset:t[this.eventProperty]-this.dragData.innerOffset,s<this.dragData.min?s=this.dragData.min:s>this.dragData.max&&(s=this.dragData.max),t.preventDefault(),this.options.snapToMarks&&this.dataValues){var l=s-this.dragData.trackOffset;a=(s-this.dragData.trackOffset)/this.dragData.trackSize*100,e.each(this.dataValues,function(e,t){var s=t.offset/100*h.dragData.trackSize,i=s-h.options.snapRadius,n=s+h.options.snapRadius;return l>=i&&n>=l?(a=t.offset,!1):void 0})}else a=(s-this.dragData.trackOffset)/this.dragData.trackSize*100;i=Math.round(a*this.stepsCount/100),this.handleCount>1&&(r=this.getDragHandleRange(this.activeDragHandleIndex),i<r.minStepIndex?i=Math.max(r.minStepIndex,i):i>r.maxStepIndex&&(i=Math.min(r.maxStepIndex,i))),n=i*(100/this.stepsCount),this.dragData.stepIndex!==i&&(this.dragData.stepIndex=i,this.dragData.offset=n,this.activeDragHandle.css(this.offsetProperty,this.dragData.offset+"%"),this.values[this.activeDragHandleIndex]=""+this.stepIndexToValue(i),this.updateValues(),this.realElement.trigger("input"))},onHandleRelease:function(){var e;"number"==typeof this.dragData.offset&&(e=this.stepIndexToValue(this.dragData.stepIndex),this.realElement.val(e).trigger("change")),this.page.off({"jcf-pointermove":this.onHandleMove,"jcf-pointerup":this.onHandleRelease}),delete this.activeDragHandle,delete this.dragData},onFocus:function(){this.fakeElement.hasClass(this.options.focusClass)||(this.fakeElement.addClass(this.options.focusClass),this.realElement.on({blur:this.onBlur,keydown:this.onKeyPress}))},onBlur:function(){this.fakeElement.removeClass(this.options.focusClass),this.realElement.off({blur:this.onBlur,keydown:this.onKeyPress})},onKeyPress:function(e){var t=38===e.which||39===e.which,s=37===e.which||40===e.which;if(9===e.which&&this.handleCount>1){if(e.shiftKey&&this.activeDragHandleIndex>0)this.activeDragHandleIndex--;else{if(e.shiftKey||!(this.activeDragHandleIndex<this.handleCount-1))return;this.activeDragHandleIndex++}e.preventDefault(),this.handles.removeClass(this.options.activeHandleClass).eq(this.activeDragHandleIndex).addClass(this.options.activeHandleClass)}(s||t)&&(e.preventDefault(),this.step(t?this.stepValue:-this.stepValue))},updateValues:function(){var e=this.values.join(",");this.values.length>1?(this.realElement.prop("valueLow",this.values[0]),this.realElement.prop("valueHigh",this.values[this.values.length-1]),this.realElement.val(e),this.realElement.val()!==e&&this.realElement.val(this.values[this.values.length-1])):this.realElement.val(e),this.updateRanges()},updateRanges:function(){var e,t=this;this.rangeMin&&(e=this.handles[0],this.rangeMin.css(this.offsetProperty,0).css(this.sizeProperty,e.style[this.offsetProperty])),this.rangeMax&&(e=this.handles[this.handles.length-1],this.rangeMax.css(this.offsetProperty,e.style[this.offsetProperty]).css(this.sizeProperty,100-parseFloat(e.style[this.offsetProperty])+"%")),this.rangeMid&&this.handles.each(function(e,s){var a,i;e>0&&(a=t.handles[e-1],i=t.rangeMid[e-1],i.style[t.offsetProperty]=a.style[t.offsetProperty],i.style[t.sizeProperty]=parseFloat(s.style[t.offsetProperty])-parseFloat(a.style[t.offsetProperty])+"%")})},step:function(e){var t=parseFloat(this.values[this.activeDragHandleIndex||0]),s=t,a=this.minValue,i=this.maxValue;isNaN(t)&&(s=0),s+=e,this.handleCount>1&&(this.activeDragHandleIndex>0&&(a=parseFloat(this.values[this.activeDragHandleIndex-1])+this.options.minRange),this.activeDragHandleIndex<this.handleCount-1&&(i=parseFloat(this.values[this.activeDragHandleIndex+1])-this.options.minRange)),s>i?s=i:a>s&&(s=a),s!==t&&(this.values[this.activeDragHandleIndex||0]=""+s,this.updateValues(),this.realElement.trigger("input").trigger("change"),this.setSliderValue(this.values))},valueToStepIndex:function(e){return(e-this.minValue)/this.stepValue},stepIndexToValue:function(e){return this.minValue+this.stepValue*e},valueToOffset:function(e){var t=this.maxValue-this.minValue,s=(e-this.minValue)/t;return 100*s},getSliderValue:function(){return e.map(this.values,function(e){return parseFloat(e)||0})},setSliderValue:function(e){var t=this;this.handles.each(function(s,a){a.style[t.offsetProperty]=t.valueToOffset(e[s])+"%"})},refresh:function(){var e=this.realElement.is(":disabled");this.fakeElement.toggleClass(this.options.disabledClass,e),this.setSliderValue(this.getSliderValue()),this.updateRanges()},destroy:function(){this.realElement.removeClass(this.options.hiddenClass).insertBefore(this.fakeElement),this.fakeElement.remove(),this.realElement.off({keydown:this.onKeyPress,focus:this.onFocus,blur:this.onBlur})}}})}(jcf);
