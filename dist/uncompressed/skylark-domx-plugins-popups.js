/**
 * skylark-domx-plugins-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-domx-plugins-popups/popups',[
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
define('skylark-domx-plugins-popups/calc-offset',[
	"skylark-domx-geom",
	"./popups"
],function(
	geom,
	popups
){
    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function calcOffset(popup, ref) {
        var extraY = 0;
        var dpSize = geom.size(popup);
        var dpWidth = dpSize.width;
        var dpHeight = dpSize.height;
        var refHeight = geom.height(ref);
        var doc = popup.ownerDocument;
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

    return popups.calcOffset = calcOffset;
		
});
define('skylark-domx-plugins-popups/dropdown',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./popups"
],function(langx,browser,eventer,noder,geom,$,plugins,popups){

  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop';
  var toggle   = '[data-toggle="dropdown"]';

  var Dropdown = plugins.Plugin.inherit({
    klassName: "Dropdown",

    pluginName : "lark.popups.dropdown",

    options : {
      "selectors" : {
        "toggler" : '[data-toggle="dropdown"],.dropdown-menu'
      }

    },

    _construct : function(elm,options) {
      this.overrided(elm,options);

      var $el = this.$element = $(this._elm);
      $el.on('click.dropdown', this.toggle);
      $el.on('keydown.dropdown', this.options.selectors.toggler,this.keydown);
    },

    toggle : function (e) {
      var $this = $(this)

      if ($this.is('.disabled, :disabled')) {
        return;
      }

      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open');

      clearMenus()

      if (!isActive) {
        if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
          // if mobile we use a backdrop because click events don't delegate
          $(document.createElement('div'))
            .addClass('dropdown-backdrop')
            .insertAfter($(this))
            .on('click', clearMenus)
        }

        var relatedTarget = { relatedTarget: this }
        $parent.trigger(e = eventer.create('show.dropdown', relatedTarget))

        if (e.isDefaultPrevented()) {
          return;
        }

        $this
          .trigger('focus')
          .attr('aria-expanded', 'true')

        $parent
          .toggleClass('open')
          .trigger(eventer.create('shown.dropdown', relatedTarget))
      }

      return false
    },

    keydown : function (e) {
      if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) {
        return;
      }

      var $this = $(this);

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) {
        return;
      }

      var $parent  = getParent($this)
      var isActive = $parent.hasClass('open')

      if (!isActive && e.which != 27 || isActive && e.which == 27) {
        if (e.which == 27) $parent.find(toggle).trigger('focus')
        return $this.trigger('click')
      }

      var desc = ' li:not(.disabled):visible a'
      var $items = $parent.find('.dropdown-menu' + desc)

      if (!$items.length) return

      var index = $items.index(e.target)

      if (e.which == 38 && index > 0)                 index--         // up
      if (e.which == 40 && index < $items.length - 1) index++         // down
      if (!~index)                                    index = 0

      $items.eq(index).trigger('focus');
    }

  });

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector);

    return $parent && $parent.length ? $parent : $this.parent();
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && noder.contains($parent[0], e.target)) return

      $parent.trigger(e = eventer.create('hide.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger(eventer.create('hidden.dropdown', relatedTarget))
    })
  }



  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================
  $(document)
    .on('click.dropdown.data-api', clearMenus)
    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() });

  plugins.register(Dropdown);

  return popups.Dropdown = Dropdown;

});

define('skylark-domx-plugins-popups/comboBox',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./popups",
  "./dropdown"
],function(langx,browser,eventer,noder,geom,$,plugins,popups,Dropdown){


	// COMBOBOX CONSTRUCTOR AND PROTOTYPE

	var ComboBox = plugins.Plugin.inherit({
		klassName: "ComboBox",

		pluginName : "lark.popups.combobox",

		options : {

			autoResizeMenu: true,
			filterOnKeypress: false,
			showOptionsOnKeypress: false,
			filter: function filter (list, predicate, self) {
				var visible = 0;
				self.$dropMenu.find('.empty-indicator').remove();

				list.each(function (i) {
					var $li = $(this);
					var text = $(this).text().trim();

					$li.removeClass();

					if (text === predicate) {
						$li.addClass('text-success');
						visible++;
					} else if (text.substr(0, predicate.length) === predicate) {
						$li.addClass('text-info');
						visible++;
					} else {
						$li.addClass('hidden');
					}
				});

				if (visible === 0) {
					self.$dropMenu.append('<li class="empty-indicator text-muted"><em>No Matches</em></li>');
				}
			}
		},

    	_construct : function(elm,options) {
      		this.overrided(elm,options);
      		this.$element = this.$();

			this.$dropMenu = this.$element.find('.dropdown-menu');
			this.$input = this.$element.find('input');
			this.$button = this.$element.find('.btn');
			this.$button.plugin("lark.popups.dropdown");
			this.$inputGroupBtn = this.$element.find('.input-group-btn');

			this.$element.on('click.lark', 'a', langx.proxy(this.itemclicked, this));
			this.$element.on('change.lark', 'input', langx.proxy(this.inputchanged, this));
			this.$element.on('shown.bs.dropdown', langx.proxy(this.menuShown, this));
			this.$input.on('keyup.lark', langx.proxy(this.keypress, this));

			// set default selection
			this.setDefaultSelection();

			// if dropdown is empty, disable it
			var items = this.$dropMenu.children('li');
			if( items.length === 0) {
				this.$button.addClass('disabled');
			}

			// filter on load in case the first thing they do is press navigational key to pop open the menu
			if (this.options.filterOnKeypress) {
				this.options.filter(this.$dropMenu.find('li'), this.$input.val(), this);
			}
		},

		_destroy: function () {
			this.$element.remove();
			// remove any external bindings
			// [none]

			// set input value attrbute in markup
			this.$element.find('input').each(function () {
				$(this).attr('value', $(this).val());
			});

			// empty elements to return to original markup
			// [none]

			return this.$element[0].outerHTML;
		},

		doSelect: function ($item) {

			if (typeof $item[0] !== 'undefined') {
				// remove selection from old item, may result in remove and
				// re-addition of class if item is the same
				this.$element.find('li.selected:first').removeClass('selected');

				// add selection to new item
				this.$selectedItem = $item;
				this.$selectedItem.addClass('selected');

				// update input
				this.$input.val(this.$selectedItem.text().trim());
			} else {
				// this is a custom input, not in the menu
				this.$selectedItem = null;
				this.$element.find('li.selected:first').removeClass('selected');
			}
		},

		clearSelection: function () {
			this.$selectedItem = null;
			this.$input.val('');
			this.$dropMenu.find('li').removeClass('selected');
		},

		menuShown: function () {
			if (this.options.autoResizeMenu) {
				this.resizeMenu();
			}
		},

		resizeMenu: function () {
			var width = this.$element.outerWidth();
			this.$dropMenu.outerWidth(width);
		},

		selectedItem: function () {
			var item = this.$selectedItem;
			var data = {};

			if (item) {
				var txt = this.$selectedItem.text().trim();
				data = langx.mixin({
					text: txt
				}, this.$selectedItem.data());
			} else {
				data = {
					text: this.$input.val().trim(),
					notFound: true
				};
			}

			return data;
		},

		selectByText: function (text) {
			var $item = $([]);
			this.$element.find('li').each(function () {
				if ((this.textContent || this.innerText || $(this).text() || '').trim().toLowerCase() === (text || '').trim().toLowerCase()) {
					$item = $(this);
					return false;
				}
			});

			this.doSelect($item);
		},

		selectByValue: function (value) {
			var selector = 'li[data-value="' + value + '"]';
			this.selectBySelector(selector);
		},

		selectByIndex: function (index) {
			// zero-based index
			var selector = 'li:eq(' + index + ')';
			this.selectBySelector(selector);
		},

		selectBySelector: function (selector) {
			var $item = this.$element.find(selector);
			this.doSelect($item);
		},

		setDefaultSelection: function () {
			var selector = 'li[data-selected=true]:first';
			var item = this.$element.find(selector);

			if (item.length > 0) {
				// select by data-attribute
				this.selectBySelector(selector);
				item.removeData('selected');
				item.removeAttr('data-selected');
			}
		},

		enable: function () {
			this.$element.removeClass('disabled');
			this.$input.removeAttr('disabled');
			this.$button.removeClass('disabled');
		},

		disable: function () {
			this.$element.addClass('disabled');
			this.$input.attr('disabled', true);
			this.$button.addClass('disabled');
		},

		itemclicked: function (e) {
			this.$selectedItem = $(e.target).parent();

			// set input text and trigger input change event marked as synthetic
			this.$input.val(this.$selectedItem.text().trim()).trigger('change', {
				synthetic: true
			});

			// pass object including text and any data-attributes
			// to onchange event
			var data = this.selectedItem();

			// trigger changed event
			this.$element.trigger('changed.lark', data);

			e.preventDefault();

			// return focus to control after selecting an option
			this.$element.find('.dropdown-toggle').focus();
		},

		keypress: function (e) {
			var ENTER = 13;
			//var TAB = 9;
			var ESC = 27;
			var LEFT = 37;
			var UP = 38;
			var RIGHT = 39;
			var DOWN = 40;

			var IS_NAVIGATIONAL = (
				e.which === UP ||
				e.which === DOWN ||
				e.which === LEFT ||
				e.which === RIGHT
			);

			if(this.options.showOptionsOnKeypress && !this.$inputGroupBtn.hasClass('open')){
				this.$button.plugin("lark.popups.dropdown").toggle();
				this.$input.focus();
			}

			if (e.which === ENTER) {
				e.preventDefault();

				var selected = this.$dropMenu.find('li.selected').text().trim();
				if(selected.length > 0){
					this.selectByText(selected);
				}else{
					this.selectByText(this.$input.val());
				}

				this.$inputGroupBtn.removeClass('open');
			} else if (e.which === ESC) {
				e.preventDefault();
				this.clearSelection();
				this.$inputGroupBtn.removeClass('open');
			} else if (this.options.showOptionsOnKeypress) {
				if (e.which === DOWN || e.which === UP) {
					e.preventDefault();
					var $selected = this.$dropMenu.find('li.selected');
					if ($selected.length > 0) {
						if (e.which === DOWN) {
							$selected = $selected.next(':not(.hidden)');
						} else {
							$selected = $selected.prev(':not(.hidden)');
						}
					}

					if ($selected.length === 0){
						if (e.which === DOWN) {
							$selected = this.$dropMenu.find('li:not(.hidden):first');
						} else {
							$selected = this.$dropMenu.find('li:not(.hidden):last');
						}
					}
					this.doSelect($selected);
				}
			}

			// Avoid filtering on navigation key presses
			if (this.options.filterOnKeypress && !IS_NAVIGATIONAL) {
				this.options.filter(this.$dropMenu.find('li'), this.$input.val(), this);
			}

			this.previousKeyPress = e.which;
		},

		inputchanged: function (e, extra) {
			var val = $(e.target).val();
			// skip processing for internally-generated synthetic event
			// to avoid double processing
			if (extra && extra.synthetic) {
				this.selectByText(val);
				return;
			}
			this.selectByText(val);

			// find match based on input
			// if no match, pass the input value
			var data = this.selectedItem();
			if (data.text.length === 0) {
				data = {
					text: val
				};
			}

			// trigger changed event
			this.$element.trigger('changed.lark', data);
		}

	});



	ComboBox.prototype.getValue = ComboBox.prototype.selectedItem;

    plugins.register(ComboBox);

	return popups.ComboBox = ComboBox;
});

define('skylark-domx-plugins-popups/select-list',[
  "skylark-langx/langx",
  "skylark-domx-browser",
  "skylark-domx-eventer",
  "skylark-domx-noder",
  "skylark-domx-geom",
  "skylark-domx-query",
  "skylark-domx-plugins-base",
  "./popups",
  "./dropdown"
],function(langx,browser,eventer,noder,geom,$,plugins,popups,Dropdown){


	// SELECT CONSTRUCTOR AND PROTOTYPE

	var SelectList = plugins.Plugin.inherit({
		klassName: "SelectList",

		pluginName : "lark.popups.selectlist",
	
		options : {
			emptyLabelHTML: '<li data-value=""><a href="#">No items</a></li>'

		},

    	_construct : function(elm,options) {
      		this.overrided(elm,options);
      		this.$element = this.$();
			//this.options = langx.mixin({}, $.fn.selectlist.defaults, options);


			this.$button = this.$element.find('.btn.dropdown-toggle');
			this.$hiddenField = this.$element.find('.hidden-field');
			this.$label = this.$element.find('.selected-label');
			this.$dropdownMenu = this.$element.find('.dropdown-menu');

			this.$button.plugin("lark.popups.dropdown");

			this.$element.on('click.selectlist', '.dropdown-menu a', langx.proxy(this.itemClicked, this));
			this.setDefaultSelection();

			if (this.options.resize === 'auto' || this.$element.attr('data-resize') === 'auto') {
				this.resize();
			}

			// if selectlist is empty or is one item, disable it
			var items = this.$dropdownMenu.children('li');
			if( items.length === 0) {
				this.disable();
				this.doSelect( $(this.options.emptyLabelHTML));
			}

			// support jumping focus to first letter in dropdown when key is pressed
			this.$element.on('shown.dropdown', function () {
					var $this = $(this);
					// attach key listener when dropdown is shown
					$(document).on('keypress.selectlist', function(e){

						// get the key that was pressed
						var key = String.fromCharCode(e.which);
						// look the items to find the first item with the first character match and set focus
						$this.find("li").each(function(idx,item){
							if ($(item).text().charAt(0).toLowerCase() === key) {
								$(item).children('a').focus();
								return false;
							}
						});

				});
			});

			// unbind key event when dropdown is hidden
			this.$element.on('hide.dropdown', function () {
					$(document).off('keypress.selectlist');
			});
		},

		_destroy: function () {
			this.$element.remove();
			// any external bindings
			// [none]
			// empty elements to return to original markup
			// [none]
			// returns string of markup
			return this.$element[0].outerHTML;
		},

		doSelect: function ($item) {
			var $selectedItem;
			this.$selectedItem = $selectedItem = $item;

			this.$hiddenField.val(this.$selectedItem.attr('data-value'));
			this.$label.html($(this.$selectedItem.children()[0]).html());

			// clear and set selected item to allow declarative init state
			// unlike other controls, selectlist's value is stored internal, not in an input
			this.$element.find('li').each(function () {
				if ($selectedItem.is($(this))) {
					$(this).attr('data-selected', true);
				} else {
					$(this).removeData('selected').removeAttr('data-selected');
				}
			});
		},

		itemClicked: function (e) {
			this.$element.trigger('clicked.selectlist', this.$selectedItem);

			e.preventDefault();
			// ignore if a disabled item is clicked
			if ($(e.currentTarget).parent('li').is('.disabled, :disabled')) { return; }

			// is clicked element different from currently selected element?
			if (!($(e.target).parent().is(this.$selectedItem))) {
				this.itemChanged(e);
			}

			// return focus to control after selecting an option
			this.$element.find('.dropdown-toggle').focus();
		},

		itemChanged: function (e) {
			//selectedItem needs to be <li> since the data is stored there, not in <a>
			this.doSelect($(e.target).closest('li'));

			// pass object including text and any data-attributes
			// to onchange event
			var data = this.selectedItem();
			// trigger changed event
			this.$element.trigger('changed.selectlist', data);
		},

		resize: function () {
			var width = 0;
			var newWidth = 0;
			var sizer = $('<div/>').addClass('selectlist-sizer');


			if (Boolean($(document).find('html').hasClass('fuelux'))) {
				// default behavior for fuel ux setup. means fuelux was a class on the html tag
				$(document.body).append(sizer);
			} else {
				// fuelux is not a class on the html tag. So we'll look for the first one we find so the correct styles get applied to the sizer
				$('.fuelux:first').append(sizer);
			}

			sizer.append(this.$element.clone());

			this.$element.find('a').each(function () {
				sizer.find('.selected-label').text($(this).text());
				newWidth = sizer.find('.selectlist').outerWidth();
				newWidth = newWidth + sizer.find('.sr-only').outerWidth();
				if (newWidth > width) {
					width = newWidth;
				}
			});

			if (width <= 1) {
				return;
			}

			this.$button.css('width', width);
			this.$dropdownMenu.css('width', width);

			sizer.remove();
		},

		selectedItem: function () {
			var txt = this.$selectedItem.text();
			return langx.mixin({
				text: txt
			}, this.$selectedItem.data());
		},

		selectByText: function (text) {
			var $item = $([]);
			this.$element.find('li').each(function () {
				if ((this.textContent || this.innerText || $(this).text() || '').toLowerCase() === (text || '').toLowerCase()) {
					$item = $(this);
					return false;
				}
			});
			this.doSelect($item);
		},

		selectByValue: function (value) {
			var selector = 'li[data-value="' + value + '"]';
			this.selectBySelector(selector);
		},

		selectByIndex: function (index) {
			// zero-based index
			var selector = 'li:eq(' + index + ')';
			this.selectBySelector(selector);
		},

		selectBySelector: function (selector) {
			var $item = this.$element.find(selector);
			this.doSelect($item);
		},

		setDefaultSelection: function () {
			var $item = this.$element.find('li[data-selected=true]').eq(0);

			if ($item.length === 0) {
				$item = this.$element.find('li').has('a').eq(0);
			}

			this.doSelect($item);
		},

		enable: function () {
			this.$element.removeClass('disabled');
			this.$button.removeClass('disabled');
		},

		disable: function () {
			this.$element.addClass('disabled');
			this.$button.addClass('disabled');
		}

	});	


	SelectList.prototype.getValue = SelectList.prototype.selectedItem;


    plugins.register(SelectList);

	return popups.SelectList = SelectList;
});

define('skylark-domx-plugins-popups/main',[
	"./popups",
	"./calc-offset",
	"./dropdown",
	"./comboBox",
	"./select-list"
],function(popups){
	return popups;
});
define('skylark-domx-plugins-popups', ['skylark-domx-plugins-popups/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-domx-plugins-popups.js.map
