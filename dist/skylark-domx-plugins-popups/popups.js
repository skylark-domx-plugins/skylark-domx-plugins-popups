/**
 * skylark-domx-plugins-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-domx-geom","skylark-domx-query"],function(t,o,e){var i=[];return t.attach("domx.plugins.popups",{around:function(t){var e=o.size(popup),i=e.width,n=e.height,r=o.height(t),h=t.ownerDocument,a=h.documentElement,p=a.clientWidth+o.scrollLeft(h),l=a.clientHeight+o.scrollTop(h),u=o.pagePosition(t),s=u.left,d=u.top;return d+=r,s-=Math.min(s,s+i>p&&p>i?Math.abs(s+i-p):0),{top:d-=Math.min(d,d+n>l&&l>n?Math.abs(n+r-0):0),bottom:u.bottom,left:s,right:u.right,width:u.width,height:u.height}},open:function(t,o){o.around;let n=e(t);n.show().removeAttr("aria-hidden").position(o.position),i.push({popup:n[0]})},close:function(t){var o=0;if(t){t=e(t)[0];for(var n=i.length-1;n>=0;n--)if(i[n].popup==t){o=i.length-n;break}}else o=i.length;for(n=0;n<o;n++){var r=i.pop();e(r.popup).hide().attr("aria-hidden","true")}}})});
//# sourceMappingURL=sourcemaps/popups.js.map
