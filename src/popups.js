define([
	"skylark-langx-ns",
	"skylark-domx-geom",
	"skylark-domx-query",
    "skylark-domx-plugins-base/plugins"
],function(skylark,geom,$,plugins){

	var stack = [];



    /**
    * get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function around(ref) {
        var extraY = 0;
        var dpSize = geom.size(popup);
        var dpWidth = dpSize.width;
        var dpHeight = dpSize.height;
        var refHeight = geom.height(ref);
        var doc = ref.ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + geom.scrollLeft(doc);
        var viewHeight = docElem.clientHeight + geom.scrollTop(doc);
        var offset = geom.pagePosition(ref);
        var offsetLeft = offset.left;
        var offsetTop = offset.top;

        offsetTop += refHeight;

        offsetLeft -=
            Math.min(offsetLeft, (offsetLeft + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offsetLeft + dpWidth - viewWidth) : 0);

        offsetTop -=
            Math.min(offsetTop, ((offsetTop + dpHeight > viewHeight && viewHeight > dpHeight) ?
            Math.abs(dpHeight + refHeight - extraY) : extraY));

        return {
            top: offsetTop,
            bottom: offset.bottom,
            left: offsetLeft,
            right: offset.right,
            width: offset.width,
            height: offset.height
        };
    }


	/*
	 * Popup the ui elment at the specified position
	 * @param popup  element to display
	 * @param options
	 *  - around {HtmlEleent}
	 *  - at {x,y}
	 *  - parent {}
	 */

	function open(popup,options) {
		if (options.around) {
			//A DOM node that should be used as a reference point for placing the pop-up. 
		}

		let $popup = $(popup);

		$popup.show()
			  .removeAttr( "aria-hidden" )
   			  .position( options.position );

   		stack.push({
   			popup : $popup[0]
   		})

	}

	/*
	 * Close specified popup and any popups that it parented.
	 * If no popup is specified, closes all popups.
     */
	function close(popup) {
		var count = 0;

		if (popup) {
			popup = $(popup)[0];
			for (var i= stack.length-1; i>=0; i--) {
				if (stack[i].popup == popup) {
					count = stack.length - i; 
					break;
				}
			}
		} else {
			count = stack.length;
		}
		for (var i=0; i<count ; i++ ) {
			var top = stack.pop(),
				$popup = $(top.popup);
			$popup.hide()
				.attr( "aria-hidden", "true" );
		} 
	}
	return plugins.popups = {
		around,
		open,
		close
	};
});