define([
	"skylark-langx-ns"
],function(skylark){

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

	}

	/*
	 * Close specified popup and any popups that it parented.
	 * If no popup is specified, closes all popups.
     */
	function close(popup) {
		var count = 0;

		if (popup) {
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
				popup1 = top.popup;
			if (popup1.hide) {
				popup1.hide();
			} else {

			}

		} 
	}
	return skylark.attach("domx.plugins.popups",{
		around,
		open,
		close
	});
});