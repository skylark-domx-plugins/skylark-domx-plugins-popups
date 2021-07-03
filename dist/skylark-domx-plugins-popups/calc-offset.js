/**
 * skylark-domx-plugins-popups - The skylark popup utility library for dom api extension.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-domx-geom","./popups"],function(t,e){return e.calcOffset=function(e,i){var h=t.size(e),o=h.width,n=h.height,l=t.height(i),r=e.ownerDocument,a=r.documentElement,c=a.clientWidth+t.scrollLeft(r),g=a.clientHeight+t.scrollTop(r),m=t.pagePosition(i),s=m.left,f=m.top;return f+=l,s-=Math.min(s,s+o>c&&c>o?Math.abs(s+o-c):0),{top:f-=Math.min(f,f+n>g&&g>n?Math.abs(n+l-0):0),bottom:m.bottom,left:s,right:m.right,width:m.width,height:m.height}}});
//# sourceMappingURL=sourcemaps/calc-offset.js.map
