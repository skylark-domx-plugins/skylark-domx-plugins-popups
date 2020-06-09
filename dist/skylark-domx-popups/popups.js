/**
 * skylark-domx-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(t){var e=[];return t.attach("domx.popups",{around:function(t){var e=geom.size(popup),o=e.width,n=e.height,i=geom.height(t),h=t.ownerDocument,r=h.documentElement,a=r.clientWidth+geom.scrollLeft(h),p=r.clientHeight+geom.scrollTop(h),g=geom.pagePosition(t),l=g.left,u=g.top;return u+=i,l-=Math.min(l,l+o>a&&a>o?Math.abs(l+o-a):0),{top:u-=Math.min(u,u+n>p&&p>n?Math.abs(n+i-0):0),bottom:g.bottom,left:l,right:g.right,width:g.width,height:g.height}},open:function(t,e){e.around},close:function(t){var o=0;if(t){for(var n=e.length-1;n>=0;n--)if(e[n].popup==t){o=e.length-n;break}}else o=e.length;for(n=0;n<o;n++){var i=e.pop().popup;i.hide&&i.hide()}}})});
//# sourceMappingURL=sourcemaps/popups.js.map
