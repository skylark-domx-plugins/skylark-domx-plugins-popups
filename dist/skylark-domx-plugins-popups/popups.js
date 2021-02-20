/**
 * skylark-domx-plugins-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-ns"],function(t){var e=[];return t.attach("domx.plugins.popups",{around:function(t){var e=geom.size(popup),o=e.width,n=e.height,i=geom.height(t),h=t.ownerDocument,p=h.documentElement,r=p.clientWidth+geom.scrollLeft(h),a=p.clientHeight+geom.scrollTop(h),g=geom.pagePosition(t),l=g.left,u=g.top;return u+=i,l-=Math.min(l,l+o>r&&r>o?Math.abs(l+o-r):0),{top:u-=Math.min(u,u+n>a&&a>n?Math.abs(n+i-0):0),bottom:g.bottom,left:l,right:g.right,width:g.width,height:g.height}},open:function(t,e){e.around},close:function(t){var o=0;if(t){for(var n=e.length-1;n>=0;n--)if(e[n].popup==t){o=e.length-n;break}}else o=e.length;for(n=0;n<o;n++){var i=e.pop().popup;i.hide&&i.hide()}}})});
//# sourceMappingURL=sourcemaps/popups.js.map
