(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{G521:function(e,t,n){"use strict";var a=n("vOnD"),r=n("PD6+");function i(e,t){return null==e?t:100*e/12+"%"}var o=a.default.div.withConfig({displayName:"grid__Item",componentId:"sc-8y3ucw-0"})(["width:",";","{width:",";}","{width:",";}","{width:",";}","{width:",";}"],(function(e){return i(e.size,"100%")}),(function(e){return e.theme.media.xs.up}),(function(e){return i(e.xs)}),(function(e){return e.theme.media.sm.up}),(function(e){return i(e.sm)}),(function(e){return e.theme.media.md.up}),(function(e){return i(e.md)}),(function(e){return e.theme.media.lg.up}),(function(e){return i(e.lg)})),l=a.default.div.withConfig({displayName:"grid__UiGrid",componentId:"sc-8y3ucw-1"})(["display:flex;flex-wrap:wrap;margin:",";& > ","{padding:",";}"],(function(e){return e.largeGutter?e.theme.spacing(-8,-4,0):e.theme.spacing(-4,-2,0)}),o,(function(e){return e.largeGutter?e.theme.spacing(8,4,0):e.theme.spacing(4,2,0)}));t.a=Object(r.a)(l,{Item:o})},iE3p:function(e,t,n){"use strict";n.r(t),n.d(t,"query",(function(){return O}));n("3nLz"),n("y7hu");var a=n("Wbzz"),r=n("q1tI"),i=n.n(r),o=n("9eSz"),l=n.n(o),u=n("8fdv"),c=n("pmm0"),m=n("AaHD"),d=n("9qV1"),s=n("B7F5"),f=n("z2p8"),p=n("uK4y"),g=(n("C8Qj"),n("vOnD")),h=n("PD6+"),w=g.default.div.withConfig({displayName:"gallery__Image",componentId:"sc-1wt1l9o-0"})(["position:relative;width:100%;padding-bottom:80%;overflow:hidden;background:",";& > img,.gatsby-image-wrapper{position:absolute !important;top:0;left:0;width:100% !important;height:100% !important;transition:transform 0.2s ease-in-out;}"],(function(e){return e.theme.color.gray3})),b=g.default.div.withConfig({displayName:"gallery__UiGallery",componentId:"sc-1wt1l9o-1"})(["position:relative;background:",";border-radius:",";box-shadow:",";overflow:hidden;cursor:pointer;padding-bottom:",";&:hover{box-shadow:",";color:",";","{& > img,.gatsby-image-wrapper{transform:scale(1.1);}}}"],(function(e){return e.theme.color.white1}),(function(e){return e.theme.radius.medium}),(function(e){return e.theme.shadow.small}),(function(e){return e.theme.spacing(17)}),(function(e){return e.theme.shadow.lift}),(function(e){return e.theme.color.black1}),w),v=g.default.div.withConfig({displayName:"gallery__Label",componentId:"sc-1wt1l9o-2"})(["padding:",";font-size:",";opacity:0.7;"],(function(e){return e.theme.spacing(5,5,1)}),(function(e){return e.theme.fontSize.text2})),y=g.default.h4.withConfig({displayName:"gallery__Title",componentId:"sc-1wt1l9o-3"})(["background:",";margin:0;padding:",";"],(function(e){return e.theme.color.white1}),(function(e){return e.theme.spacing(0,5,5)})),E=g.default.div.withConfig({displayName:"gallery__Overlay",componentId:"sc-1wt1l9o-4"})(["position:absolute;bottom:0;left:0;right:0;background:",";"],(function(e){return e.theme.color.white1})),k=Object(h.a)(b,{Image:w,Label:v,Title:y,Overlay:E}),I=n("keVQ"),_=n("G521"),x=n("5nJX"),C=n("/xLX"),O="3662633375";t.default=function(e){var t=e.data,n=t.wordpressPage,r=t.allWordpressWpGallery,o=i.a.useMemo((function(){return Object(m.b)(n.blocks||[])}),[n.blocks]),g=i.a.createElement(p.a,null,i.a.createElement("h1",null,n.title)),h=i.a.createElement(p.a,null,i.a.createElement(I.a,null,i.a.createElement(_.a,null,r.edges.map((function(e){var t=e.node,n=t.acf.preview.localFile.preview;return i.a.createElement(_.a.Item,{key:t.id,xs:6,sm:4},i.a.createElement(a.Link,{to:t.link},i.a.createElement(k,null,i.a.createElement(k.Image,null,(null==n?void 0:n.fixed)?i.a.createElement(l.a,{fixed:n.fixed,alt:t.title}):i.a.createElement("img",{src:t.acf.preview.source_url,alt:t.title})),i.a.createElement(k.Overlay,null,i.a.createElement(C.a,{color:u.a.WHITE}),i.a.createElement(k.Label,null,t.date),i.a.createElement(k.Title,null,t.title)))))})))));return i.a.createElement(s.a,null,i.a.createElement(f.a,{title:n.title}),o.length?i.a.createElement(c.a,{blocks:o,title:g,footer:h}):i.a.createElement(x.a,null,g,i.a.createElement(d.a,{content:n.content}),h))}},keVQ:function(e,t,n){"use strict";var a=n("vOnD").default.div.withConfig({displayName:"offset__UiGalleryOffset",componentId:"sc-10x8k5e-0"})(["padding:",";"],(function(e){return e.theme.spacing(8,0,4)}));t.a=a},pmm0:function(e,t,n){"use strict";var a=n("q1tI"),r=n.n(a),i=n("5nJX"),o=n("Gv9F"),l=n("AaHD"),u=function(e){var t=e.blocks,n=e.title,a=e.footer;if(!t||!t.length)return null;var u=Object(l.a)(t);return r.a.createElement(r.a.Fragment,null,u.map((function(e,t){return r.a.createElement(i.a,{key:t,backgroundColor:e.backgroundColor,textColor:e.textColor},0===t&&n,r.a.createElement(o.a,{blocks:e.blocks}),t===u.length-1&&a)})))};t.a=r.a.memo(u)},y7hu:function(e,t,n){"use strict";n("t+fG")("link",(function(e){return function(t){return e(this,"a","href",t)}}))}}]);
//# sourceMappingURL=component---src-templates-all-gallery-tsx-bfb1f1530af1b221db6f.js.map