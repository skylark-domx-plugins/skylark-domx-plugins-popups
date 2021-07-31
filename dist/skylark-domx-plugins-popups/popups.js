/**
 * skylark-domx-plugins-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns","skylark-domx-geom","skylark-domx-query","skylark-domx-plugins-base/plugins"],function(t,o,e,i){var n=[];return i.popups={around:function(t){var e=o.size(popup),i=e.width,n=e.height,r=o.height(t),h=t.ownerDocument,p=h.documentElement,a=p.clientWidth+o.scrollLeft(h),l=p.clientHeight+o.scrollTop(h),s=o.pagePosition(t),u=s.left,d=s.top;return d+=r,u-=Math.min(u,u+i>a&&a>i?Math.abs(u+i-a):0),{top:d-=Math.min(d,d+n>l&&l>n?Math.abs(n+r-0):0),bottom:s.bottom,left:u,right:s.right,width:s.width,height:s.height}},open:function(t,o){o.around;let i=e(t);i.show().removeAttr("aria-hidden").position(o.position),n.push({popup:i[0]})},close:function(t){var o=0;if(t){t=e(t)[0];for(var i=n.length-1;i>=0;i--)if(n[i].popup==t){o=n.length-i;break}}else o=n.length;for(i=0;i<o;i++){var r=n.pop();e(r.popup).hide().attr("aria-hidden","true")}}}});
//# sourceMappingURL=sourcemaps/popups.js.map
