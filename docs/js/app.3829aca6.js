(function(t){function e(e){for(var a,r,o=e[0],u=e[1],c=e[2],h=0,p=[];h<o.length;h++)r=o[h],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&p.push(i[r][0]),i[r]=0;for(a in u)Object.prototype.hasOwnProperty.call(u,a)&&(t[a]=u[a]);l&&l(e);while(p.length)p.shift()();return s.push.apply(s,c||[]),n()}function n(){for(var t,e=0;e<s.length;e++){for(var n=s[e],a=!0,o=1;o<n.length;o++){var u=n[o];0!==i[u]&&(a=!1)}a&&(s.splice(e--,1),t=r(r.s=n[0]))}return t}var a={},i={app:0},s=[];function r(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=a,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="";var o=window["webpackJsonp"]=window["webpackJsonp"]||[],u=o.push.bind(o);o.push=e,o=o.slice();for(var c=0;c<o.length;c++)e(o[c]);var l=u;s.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("cd49")},"4e95":function(t,e,n){},5916:function(t,e,n){},"5c0b":function(t,e,n){"use strict";var a=n("e332"),i=n.n(a);i.a},"8b4d":function(t,e,n){},a932:function(t,e,n){"use strict";var a=n("4e95"),i=n.n(a);i.a},ae6e:function(t,e,n){"use strict";var a=n("5916"),i=n.n(a);i.a},cd49:function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var a=n("2b0e"),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"app__info",class:{extended:t.showInformation},on:{click:t.informationClickHanler}},[n("i",{staticClass:"fa fa-info app__info__icon"}),n("transition",{attrs:{name:"fade"}},[t.showInformation?n("div",{staticClass:"app__info__content"},[n("p",[t._v("Opiskelijaravintolat sivulta löydät kaikki ravintolat koko Suomesta joihin Kela myöntää ateriatukea. \n          Ravintolan merkkiä klikkaamalla näet kyseisen ravintolat lounaslistan sekä aukioloajat. \n          Rajapintojen puutteiden vuoksi kaikkien ravintoloiden ruokalistoja tai lounasaikoja ei välttämättä ole saatavilla.\n        ")]),n("br"),n("p",{staticClass:"app__info__content__disclaimer"},[t._v("\n          Ravintoloiden sijainti kartalla on suuntaa antava ja se pohjautuu ravintoloiden Kelalle antamaan osoitteistoon.\n        ")])]):t._e()])],1),n("Map",{attrs:{restaurants:t.restaurantList}})],1)},s=[],r=(n("ac6a"),n("d225")),o=n("b0b4"),u=n("308d"),c=n("6bb5"),l=n("4e2b"),h=n("9ab4"),p=n("60a3"),d=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"map"},[n("LMap",{staticStyle:{height:"100%",width:"100%"},attrs:{zoom:t.zoom,center:t.center},on:{"update:zoom":t.zoomUpdated,"update:center":t.centerUpdated,"update:bounds":t.boundsUpdated}},[n("LTileLayer",{attrs:{url:t.url}}),t._l(t.restaurantList,function(t){return n("RestaurantMarker",{key:t.title,attrs:{restaurant:t}})})],2)],1)},f=[],v=n("e11e"),m=n("2699"),_=n("a40a"),b=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{},[n("LMarker",{attrs:{"lat-lng":t.convertLatLng(t.restaurant.location)},on:{click:t.clickHandler}},[n("l-popup",[n("Popup",{attrs:{restaurant:t.restaurant,loadMenu:t.loadMenu}})],1)],1)],1)},k=[],y=n("4e2b6"),g=n("f60f"),j=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"popup"},[n("div",{staticClass:"popup__label"},[t._v(t._s(t.title))]),n("div",{staticClass:"popup__label"},[t._v("Osoite: "+t._s(t.restaurant.address))]),t.hasTime?n("div",{staticClass:"popup__label"},[t._v("Lounasaika: "+t._s(t.lunchTime))]):n("div",{staticClass:"popup__label"},[t._v("Lounasaika: Ei lounasaikaa saatavilla")]),t.hasMenu?n("div",{staticClass:"popup__menu"},[t._m(0),t._l(t.lunchMenu,function(e){return n("div",{key:e.Name,staticClass:"popup__menu__item"},[n("div",{staticClass:"popup__menu__item__title"},[t._v(t._s(e.Name))]),n("div",{staticClass:"popup__menu__item__ingredients"},[n("Incredient",{attrs:{item:e}})],1),n("div",{staticClass:"popup__menu__item__price"},[t._v(t._s(e.Price))])])})],2):n("div",[n("div",{staticClass:"popup__label"},[t._v("Ei ruokalistaa saatavilla")])]),t.isLoading?n("div",{staticClass:"popup__loading"},[n("i",{staticClass:"fa fa-spinner fa-spin"})]):t._e()])},O=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"popup__menu__item__labels"},[n("div",{},[t._v("Nimi")]),n("div",{},[t._v("Ainekset")]),n("div",{},[t._v("Hinta")])])}],w=(n("7f7f"),n("6762"),n("2fdb"),n("28a5"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"incredient"},[n("div",{staticClass:"incredient__container",class:{expanded:t.showFullIncredients}},t._l(t.item.Components,function(e){return n("div",{key:e,staticClass:"incredient__ingredients__item",domProps:{innerHTML:t._s(e)}})}),0),t.showFullIncredients?n("div",{staticClass:"incredient__container__button",on:{click:function(e){t.showFullIncredients=!t.showFullIncredients}}},[t._v("\n      Näytä vähemmän\n  ")]):n("div",{staticClass:"incredient__container__button",on:{click:function(e){t.showFullIncredients=!t.showFullIncredients}}},[t._v("\n      Näytä enemmän\n  ")])])}),M=[],C=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(u["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.showFullIncredients=!1,t}return Object(l["a"])(e,t),e}(p["c"]);Object(h["a"])([Object(p["b"])()],C.prototype,"item",void 0),C=Object(h["a"])([p["a"]],C);var I=C,T=I,D=(n("e642"),n("2877")),P=Object(D["a"])(T,w,M,!1,null,"e517d704",null),x=P.exports,U=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(u["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.lunchMenu=[],t.lunchTime="",t.title=t.restaurant.title,t.hasMenu=!0,t.hasTime=!0,t.isLoading=!0,t}return Object(l["a"])(e,t),Object(o["a"])(e,[{key:"fetchLuchMenu",value:function(t){return fetch("https://akalhainen.me/"+t).then(function(t){return t.json()},function(t){console.error(t)})}},{key:"getDate",value:function(t,e,n){var a=e.toLowerCase(),i=a.split(n),s=t.split(n),r=i.indexOf("mm"),o=i.indexOf("dd"),u=i.indexOf("yyyy"),c=parseInt(s[r]);c-=1;var l=new Date(parseInt(s[u]),c,parseInt(s[o]));return l}},{key:"parseFazer",value:function(t){t.MenusForDays||(this.hasMenu=!1,this.hasTime=!1);var e=t.MenusForDays.filter(function(t){return new Date(t.Date).getDate()===(new Date).getDate()})[0];this.lunchMenu=e.SetMenus,this.title=t.RestaurantName,this.lunchTime=e.LunchTime,this.lunchMenu.length<1&&(this.hasMenu=!1,this.hasTime=!1)}},{key:"parseUnicafe",value:function(t){var e=this,n=t.filter(function(t){return e.title.toLowerCase().includes(t.menuData.name.toLowerCase())})[0];if(!n)return this.hasMenu=!1,void(this.hasTime=!1);var a=(new Date).getFullYear(),i=n.menuData.menus.filter(function(t){var n=t.date.split(" ")[1]+a,i=e.getDate(n,"dd.mm.yyyy",".");return i.getDate()===(new Date).getDate()})[0].data;this.title=n.title;var s=n.menuData.visitingHours.lounas.items;(new Date).getDay();s?this.lunchTime=s[0].label+" "+s[0].hours+", "+s[1].label+" "+s[1].hours:(this.lunchTime="",this.hasMenu=!1,this.hasTime=!1);var r=[];i.forEach(function(t){var e={Price:"",Components:[""],Name:""};e.Components=[t.ingredients],e.Price="Opiskelija: "+t.price.value.student,e.Name=t.name,r.push(e)}),this.lunchMenu=r,this.lunchMenu.length<1&&(this.hasMenu=!1)}},{key:"parseSodexo",value:function(t){t.menus||(this.hasMenu=!1,this.hasTime=!1);var e=["saturday","sunday","monday","tuesday","wednesday","thursday","friday"],n=e[(new Date).getDay()],a=[];t.menus[n]&&(t.menus[n].forEach(function(t){var e={Price:"",Components:[""],Name:""};e.Components=[t.properties],e.Price=t.price,e.Name=t.title_fi,a.push(e)}),this.lunchMenu=a,this.title=t.meta.ref_title,this.lunchTime="",this.hasTime=!1),this.lunchMenu.length<1&&(this.hasMenu=!1,this.hasTime=!1)}},{key:"parseJuvenes",value:function(t){var e=this;t.MealOptions||(this.hasMenu=!1,this.hasTime=!1),fetch(this.restaurant.website).then(function(t){return t.json()},function(t){console.error(t)}).then(function(n){var a=["Sat","Sun","Mon","Tue","Wed","Thu","Fri"],i=a[(new Date).getDay()],s=[];t.MealOptions.forEach(function(t){if(-1!==t.MealOptionId){var e={Price:"",Components:[""],Name:""};e.Components=t.MenuItems[0]?[t.MenuItems[0].Incredients]:[],e.Price="",e.Name=t.Name_FI,s.push(e)}}),e.lunchMenu=s,e.title=t.KitchenName;var r="".concat(i,"Start"),o="".concat(i,"End");e.lunchTime=n.d.OpenInfo[r]+" - "+n.d.OpenInfo[o],e.lunchMenu.length<1&&(e.hasMenu=!1,e.hasTime=!1)})}}]),e}(p["c"]);Object(h["a"])([Object(p["b"])()],U.prototype,"restaurant",void 0),Object(h["a"])([Object(p["b"])()],U.prototype,"loadMenu",void 0),U=Object(h["a"])([Object(p["a"])({components:{Incredient:x},watch:{loadMenu:function(t,e){var n=this;!e&&t&&(console.log(this.restaurant.lunchUrl),this.restaurant.lunchUrl?this.fetchLuchMenu(this.restaurant.lunchUrl).then(function(t){switch(n.isLoading=!1,n.restaurant.type){case"fazer":n.parseFazer(t);break;case"unicafe":n.parseUnicafe(t);break;case"sodexo":n.parseSodexo(t);break;case"juvenes":n.parseJuvenes(t);break}}):(this.isLoading=!1,this.hasMenu=!1,this.hasTime=!1))}}})],U);var N=U,F=N,E=(n("ae6e"),Object(D["a"])(F,j,O,!1,null,"2808bc93",null)),S=E.exports,z=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(u["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.loadMenu=!1,t}return Object(l["a"])(e,t),Object(o["a"])(e,[{key:"mounted",value:function(){}},{key:"clickHandler",value:function(){this.loadMenu=!0}},{key:"convertLatLng",value:function(t){return Object(v["latLng"])(t.lat,t.lng)}}]),e}(p["c"]);Object(h["a"])([Object(p["b"])()],z.prototype,"restaurant",void 0),z=Object(h["a"])([Object(p["a"])({components:{LMarker:y["a"],LPopup:g["a"],Popup:S}})],z);var R=z,A=R,H=Object(D["a"])(A,b,k,!1,null,"c8c8ad5a",null),$=H.exports,J=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(u["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.url="https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",t.zoom=14,t.center=[60.167255,24.940523],t.bounds=null,t.showParagraph=!1,t}return Object(l["a"])(e,t),Object(o["a"])(e,[{key:"mounted",value:function(){delete v["Icon"].Default.prototype._getIconUrl,v["Icon"].Default.imagePath="/",v["Icon"].Default.mergeOptions({iconRetinaUrl:n("584d"),iconUrl:n("6397"),shadowUrl:n("e2b9")}),navigator.geolocation&&navigator.geolocation.getCurrentPosition(this.setPosition)}},{key:"setPosition",value:function(t){this.center=[t.coords.latitude,t.coords.longitude],this.zoom=14}},{key:"restaurantList",get:function(){var t=this.restaurants.filter(function(t){return null!==t.location});return t}}]),e}(p["c"]);Object(h["a"])([Object(p["b"])()],J.prototype,"restaurants",void 0),J=Object(h["a"])([Object(p["a"])({components:{LMap:m["a"],LTileLayer:_["a"],RestaurantMarker:$},methods:{zoomUpdated:function(t){this.zoom=t},centerUpdated:function(t){this.center=t},boundsUpdated:function(t){this.bounds=t}}})],J);var Y=J,B=Y,K=(n("a932"),Object(D["a"])(B,d,f,!1,null,"a941f7be",null)),q=K.exports,W=function(){function t(e,n,a,i,s,o){if(Object(r["a"])(this,t),this._title=e,this._address=n,this._location=a,this._website=i,this._type=s,this._lunchUrl=o,this.location){this._marker=L.marker([+this.location.lat,+this.location.lng]);var u=this.website?"<p>"+this.title+'</p><br><a href="'+this.website+'">Ruokalista</a>':"<p>"+this.title+"</p>";this._marker.bindPopup(u)}}return Object(o["a"])(t,[{key:"addMarkerToMap",value:function(t){this._marker&&(this._map=t,this._marker.addTo(t))}},{key:"hideMarker",value:function(){this._marker&&this._marker.remove()}},{key:"showMarker",value:function(){(this._map||this._marker)&&this._marker.addTo(this._map)}},{key:"title",get:function(){return this._title}},{key:"type",get:function(){return this._type}},{key:"address",get:function(){return this._address}},{key:"location",get:function(){return this._location}},{key:"website",get:function(){return this._website}},{key:"lunchUrl",get:function(){return this._lunchUrl}}]),t}(),X=function(t){function e(){var t;return Object(r["a"])(this,e),t=Object(u["a"])(this,Object(c["a"])(e).apply(this,arguments)),t.restaurantList=[],t.timeout=0,t.showInformation=!1,t.content=0,t}return Object(l["a"])(e,t),Object(o["a"])(e,[{key:"getRestaurants",value:function(){return fetch("https://akalhainen.me/ruokalistat/restaurants.json").then(function(t){return t.json()})}},{key:"informationClickHanler",value:function(t){this.content=this.content+1,this.showInformation=!this.showInformation}},{key:"created",value:function(){var t=this;this.getRestaurants().then(function(e){e.forEach(function(e){var n=new W(e.title,e.address,e.location,e.website,e.type,e.lunchUrl);t.restaurantList.push(n)})}),document.addEventListener("swUpdated",this.updateApp,{once:!0})}},{key:"updateApp",value:function(t){console.log("Deploying update..")}}]),e}(p["c"]);X=Object(h["a"])([Object(p["a"])({components:{Map:q},data:function(){return{}}})],X);var G=X,Q=G,V=(n("5c0b"),Object(D["a"])(Q,i,s,!1,null,null,null)),Z=V.exports,tt=n("2f62");a["default"].use(tt["a"]);var et=new tt["a"].Store({state:{unicafeMenu:void 0},mutations:{unicafeMenu:function(t,e){t.unicafeMenu=e}},getters:{unicafeMenu:function(t){return t.unicafeMenu}},actions:{}}),nt=n("9483");Object(nt["a"])("".concat("","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(t){document.dispatchEvent(new CustomEvent("swUpdated",{detail:t})),console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(t){console.error("Error during service worker registration:",t)}});var at=n("ce5b"),it=n.n(at);a["default"].use(it.a),a["default"].config.productionTip=!1,new a["default"]({store:et,render:function(t){return t(Z)}}).$mount("#app")},e332:function(t,e,n){},e642:function(t,e,n){"use strict";var a=n("8b4d"),i=n.n(a);i.a}});
//# sourceMappingURL=app.3829aca6.js.map