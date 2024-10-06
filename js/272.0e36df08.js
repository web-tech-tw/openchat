(self["webpackChunkopenchat"]=self["webpackChunkopenchat"]||[]).push([[272],{7272:function(t,i,e){"use strict";e.r(i),e.d(i,{default:function(){return g}});var r=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"flex flex-wrap w-full justify-center bg-sky-500 py-20"},[t.ready?t.access?e("div",[e("div",{staticClass:"max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg"},[e("h2",{staticClass:"text-gray-800 text-3xl font-semibold"},[t._v("檢查加入代碼")]),e("p",{staticClass:"mt-2 text-gray-600"},[t._v("請輸入申請人的加入代碼：")]),e("div",{staticClass:"w-full mt-2 text-gray-600 flex rounded bg-white shadow-md"},[e("input",{directives:[{name:"model",rawName:"v-model",value:t.query,expression:"query"}],staticClass:"w-full border-none bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none",attrs:{placeholder:"例如：000000",type:"text"},domProps:{value:t.query},on:{keydown:function(i){return!i.type.indexOf("key")&&t._k(i.keyCode,"enter",13,i.key,"Enter")?null:t.submit.apply(null,arguments)},input:function(i){i.target.composing||(t.query=i.target.value)}}}),e("button",{staticClass:"m-2 rounded px-4 py-2 font-semibold",on:{click:t.submit}},[e("svg",{staticClass:"mt-1 h-6 w-6",attrs:{fill:"none",stroke:"currentColor","stroke-width":"2",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"}},[e("path",{attrs:{d:"M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z","stroke-linecap":"round","stroke-linejoin":"round"}})])])]),e("p",{directives:[{name:"show",rawName:"v-show",value:t.status,expression:"status"}],staticClass:"mt-2 text-red-600"},[t._v(t._s(t.status))])]),t.application.code?e("div",{staticClass:"max-w-md mx-3 my-5 py-4 px-8 bg-white shadow-lg rounded-lg"},[e("h2",{staticClass:"text-gray-800 text-3xl font-semibold mb-3"},[t._v(" 加入代碼："+t._s(t.application.code)+" ")]),e("p",{staticClass:"mt-2 text-gray-600"},[e("ul",{staticClass:"mb-3"},[e("li",[t._v("申請時間："+t._s(t.dateParsedCreatedAt))])]),e("ul",{staticClass:"mb-3"},[e("li",[t._v("IP 位址："+t._s(t.application.ip_address))]),e("li",[t._v("IP 地理資訊： "),e("ul",{staticClass:"pl-3"},[e("li",[t._v("國家："+t._s(t.application.ip_geolocation.country))]),e("li",[t._v("城市："+t._s(t.application.ip_geolocation.city))]),e("li",[t._v("時區："+t._s(t.application.ip_geolocation.timezone))])])])]),e("ul",{staticClass:"mb-3"},[e("li",[t._v("使用者裝置資訊： "),e("ul",{staticClass:"pl-3"},[e("li",[t._v("作業系統： "),e("ul",{staticClass:"pl-3"},[e("li",[t._v("名稱："+t._s(t.uaParsed.os.name))]),e("li",[t._v("版本："+t._s(t.uaParsed.os.version))])])]),e("li",[t._v("瀏覽器： "),e("ul",{staticClass:"pl-3"},[e("li",[t._v("名稱："+t._s(t.uaParsed.browser.name))]),e("li",[t._v("版本："+t._s(t.uaParsed.browser.version))]),e("li",[t._v("使用者代理： "),e("p",{staticClass:"pl-3"},[e("code",[t._v(t._s(t.uaParsed.ua))])])])])])])])])]),t.application.approval_by?e("p",{staticClass:"mt-2 text-amber-600"},[t._v(" 已由 "+t._s(t.application.approval_by)+" 於 "+t._s(t.dateParsedApprovalAt)+" 許可 ")]):e("div",{staticClass:"flex justify-end mt-4"},[e("button",{staticClass:"flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-1 rounded-full",on:{click:t.approval}},[t._v(" 許可 ")]),e("button",{staticClass:"flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 mx-1 rounded-full",on:{click:t.reject}},[t._v(" 否決 ")])])]):t._e()]):e("div",{staticClass:"text-white"},[t._v(" "+t._s(t.status||"存取遭拒")+" ")]):e("div",{staticClass:"text-white"},[t._v(" 載入中... ")])])},n=[],a=e(8176),s=e.n(a),o=e(3189),u=e.n(o),c=e(8602),l=e.n(c),d=e(4003),f=e.n(d),h=e(1482),b=e.n(h);u().extend(l()),u().extend(f()),u().extend(b());var w={name:"AdminJoinView",data:()=>({access:!1,ready:!1,query:null,status:null,application:{}}),methods:{dateToHuman(t){const i=u().tz.guess();return u().tz(t,i).format("llll")},async submit(){if(this.status="",!this.query)return void(this.status="請輸入資料");const t={params:{code:this.query}};try{const i=await this.$axios.get("application",t);this.application=i.data,this.status=""}catch(i){if(this.application={},404!==i?.response?.status)return void(this.status="發生嚴重錯誤");this.status="加入代碼不存在"}},async approval(){const t={params:{code:this.query}};try{await this.$axios.patch("application",null,t),await this.submit()}catch(i){console.error(i)}},async reject(){const t={params:{code:this.query}};try{await this.$axios.delete("application",t),this.application={}}catch(i){console.error(i)}}},computed:{uaParsed(){const{user_agent:t}=this.application;return s()(t)},dateParsedCreatedAt(){const{created_at:t}=this.application;return this.dateToHuman(1e3*t)},dateParsedApprovalAt(){const{approval_at:t}=this.application;return this.dateToHuman(1e3*t)}},async created(){if(this.profile=await this.$profile(),this.profile)Array.isArray(this.profile?.roles)&&this.profile.roles.includes("openchat")?this.access=!0:console.log("forbidden"),this.ready=!0;else{const t="https://web-tech.tw/openchat/#/admin/join",i=`https://web-tech.tw/sara/?refer=${encodeURIComponent(t)}`;location.assign(i)}}},m=w,p=e(1001),v=(0,p.Z)(m,r,n,!1,null,null,null),g=v.exports},3189:function(t){!function(i,e){t.exports=e()}(0,(function(){"use strict";var t=1e3,i=6e4,e=36e5,r="millisecond",n="second",a="minute",s="hour",o="day",u="week",c="month",l="quarter",d="year",f="date",h="Invalid Date",b=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,w=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,m={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var i=["th","st","nd","rd"],e=t%100;return"["+t+(i[(e-20)%10]||i[e]||i[0])+"]"}},p=function(t,i,e){var r=String(t);return!r||r.length>=i?t:""+Array(i+1-r.length).join(e)+t},v={s:p,z:function(t){var i=-t.utcOffset(),e=Math.abs(i),r=Math.floor(e/60),n=e%60;return(i<=0?"+":"-")+p(r,2,"0")+":"+p(n,2,"0")},m:function t(i,e){if(i.date()<e.date())return-t(e,i);var r=12*(e.year()-i.year())+(e.month()-i.month()),n=i.clone().add(r,c),a=e-n<0,s=i.clone().add(r+(a?-1:1),c);return+(-(r+(e-n)/(a?n-s:s-n))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:d,w:u,d:o,D:f,h:s,m:a,s:n,ms:r,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",y={};y[g]=m;var x="$isDayjsObject",$=function(t){return t instanceof D||!(!t||!t[x])},k=function t(i,e,r){var n;if(!i)return g;if("string"==typeof i){var a=i.toLowerCase();y[a]&&(n=a),e&&(y[a]=e,n=a);var s=i.split("-");if(!n&&s.length>1)return t(s[0])}else{var o=i.name;y[o]=i,n=o}return!r&&n&&(g=n),n||!r&&g},_=function(t,i){if($(t))return t.clone();var e="object"==typeof i?i:{};return e.date=t,e.args=arguments,new D(e)},M=v;M.l=k,M.i=$,M.w=function(t,i){return _(t,{locale:i.$L,utc:i.$u,x:i.$x,$offset:i.$offset})};var D=function(){function m(t){this.$L=k(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[x]=!0}var p=m.prototype;return p.parse=function(t){this.$d=function(t){var i=t.date,e=t.utc;if(null===i)return new Date(NaN);if(M.u(i))return new Date;if(i instanceof Date)return new Date(i);if("string"==typeof i&&!/Z$/i.test(i)){var r=i.match(b);if(r){var n=r[2]-1||0,a=(r[7]||"0").substring(0,3);return e?new Date(Date.UTC(r[1],n,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)):new Date(r[1],n,r[3]||1,r[4]||0,r[5]||0,r[6]||0,a)}}return new Date(i)}(t),this.init()},p.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},p.$utils=function(){return M},p.isValid=function(){return!(this.$d.toString()===h)},p.isSame=function(t,i){var e=_(t);return this.startOf(i)<=e&&e<=this.endOf(i)},p.isAfter=function(t,i){return _(t)<this.startOf(i)},p.isBefore=function(t,i){return this.endOf(i)<_(t)},p.$g=function(t,i,e){return M.u(t)?this[i]:this.set(e,t)},p.unix=function(){return Math.floor(this.valueOf()/1e3)},p.valueOf=function(){return this.$d.getTime()},p.startOf=function(t,i){var e=this,r=!!M.u(i)||i,l=M.p(t),h=function(t,i){var n=M.w(e.$u?Date.UTC(e.$y,i,t):new Date(e.$y,i,t),e);return r?n:n.endOf(o)},b=function(t,i){return M.w(e.toDate()[t].apply(e.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(i)),e)},w=this.$W,m=this.$M,p=this.$D,v="set"+(this.$u?"UTC":"");switch(l){case d:return r?h(1,0):h(31,11);case c:return r?h(1,m):h(0,m+1);case u:var g=this.$locale().weekStart||0,y=(w<g?w+7:w)-g;return h(r?p-y:p+(6-y),m);case o:case f:return b(v+"Hours",0);case s:return b(v+"Minutes",1);case a:return b(v+"Seconds",2);case n:return b(v+"Milliseconds",3);default:return this.clone()}},p.endOf=function(t){return this.startOf(t,!1)},p.$set=function(t,i){var e,u=M.p(t),l="set"+(this.$u?"UTC":""),h=(e={},e[o]=l+"Date",e[f]=l+"Date",e[c]=l+"Month",e[d]=l+"FullYear",e[s]=l+"Hours",e[a]=l+"Minutes",e[n]=l+"Seconds",e[r]=l+"Milliseconds",e)[u],b=u===o?this.$D+(i-this.$W):i;if(u===c||u===d){var w=this.clone().set(f,1);w.$d[h](b),w.init(),this.$d=w.set(f,Math.min(this.$D,w.daysInMonth())).$d}else h&&this.$d[h](b);return this.init(),this},p.set=function(t,i){return this.clone().$set(t,i)},p.get=function(t){return this[M.p(t)]()},p.add=function(r,l){var f,h=this;r=Number(r);var b=M.p(l),w=function(t){var i=_(h);return M.w(i.date(i.date()+Math.round(t*r)),h)};if(b===c)return this.set(c,this.$M+r);if(b===d)return this.set(d,this.$y+r);if(b===o)return w(1);if(b===u)return w(7);var m=(f={},f[a]=i,f[s]=e,f[n]=t,f)[b]||1,p=this.$d.getTime()+r*m;return M.w(p,this)},p.subtract=function(t,i){return this.add(-1*t,i)},p.format=function(t){var i=this,e=this.$locale();if(!this.isValid())return e.invalidDate||h;var r=t||"YYYY-MM-DDTHH:mm:ssZ",n=M.z(this),a=this.$H,s=this.$m,o=this.$M,u=e.weekdays,c=e.months,l=e.meridiem,d=function(t,e,n,a){return t&&(t[e]||t(i,r))||n[e].slice(0,a)},f=function(t){return M.s(a%12||12,t,"0")},b=l||function(t,i,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r};return r.replace(w,(function(t,r){return r||function(t){switch(t){case"YY":return String(i.$y).slice(-2);case"YYYY":return M.s(i.$y,4,"0");case"M":return o+1;case"MM":return M.s(o+1,2,"0");case"MMM":return d(e.monthsShort,o,c,3);case"MMMM":return d(c,o);case"D":return i.$D;case"DD":return M.s(i.$D,2,"0");case"d":return String(i.$W);case"dd":return d(e.weekdaysMin,i.$W,u,2);case"ddd":return d(e.weekdaysShort,i.$W,u,3);case"dddd":return u[i.$W];case"H":return String(a);case"HH":return M.s(a,2,"0");case"h":return f(1);case"hh":return f(2);case"a":return b(a,s,!0);case"A":return b(a,s,!1);case"m":return String(s);case"mm":return M.s(s,2,"0");case"s":return String(i.$s);case"ss":return M.s(i.$s,2,"0");case"SSS":return M.s(i.$ms,3,"0");case"Z":return n}return null}(t)||n.replace(":","")}))},p.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},p.diff=function(r,f,h){var b,w=this,m=M.p(f),p=_(r),v=(p.utcOffset()-this.utcOffset())*i,g=this-p,y=function(){return M.m(w,p)};switch(m){case d:b=y()/12;break;case c:b=y();break;case l:b=y()/3;break;case u:b=(g-v)/6048e5;break;case o:b=(g-v)/864e5;break;case s:b=g/e;break;case a:b=g/i;break;case n:b=g/t;break;default:b=g}return h?b:M.a(b)},p.daysInMonth=function(){return this.endOf(c).$D},p.$locale=function(){return y[this.$L]},p.locale=function(t,i){if(!t)return this.$L;var e=this.clone(),r=k(t,i,!0);return r&&(e.$L=r),e},p.clone=function(){return M.w(this.$d,this)},p.toDate=function(){return new Date(this.valueOf())},p.toJSON=function(){return this.isValid()?this.toISOString():null},p.toISOString=function(){return this.$d.toISOString()},p.toString=function(){return this.$d.toUTCString()},m}(),S=D.prototype;return _.prototype=S,[["$ms",r],["$s",n],["$m",a],["$H",s],["$W",o],["$M",c],["$y",d],["$D",f]].forEach((function(t){S[t[1]]=function(i){return this.$g(i,t[0],t[1])}})),_.extend=function(t,i){return t.$i||(t(i,D,_),t.$i=!0),_},_.locale=k,_.isDayjs=$,_.unix=function(t){return _(1e3*t)},_.en=y[g],_.Ls=y,_.p={},_}))},1482:function(t){!function(i,e){t.exports=e()}(0,(function(){"use strict";var t={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"};return function(i,e,r){var n=e.prototype,a=n.format;r.en.formats=t,n.format=function(i){void 0===i&&(i="YYYY-MM-DDTHH:mm:ssZ");var e=this.$locale().formats,r=function(i,e){return i.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,(function(i,r,n){var a=n&&n.toUpperCase();return r||e[n]||t[n]||e[a].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,(function(t,i,e){return i||e.slice(1)}))}))}(i,void 0===e?{}:e);return a.call(this,r)}}}))},4003:function(t){!function(i,e){t.exports=e()}(0,(function(){"use strict";var t={year:0,month:1,day:2,hour:3,minute:4,second:5},i={};return function(e,r,n){var a,s=function(t,e,r){void 0===r&&(r={});var n=new Date(t),a=function(t,e){void 0===e&&(e={});var r=e.timeZoneName||"short",n=t+"|"+r,a=i[n];return a||(a=new Intl.DateTimeFormat("en-US",{hour12:!1,timeZone:t,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:r}),i[n]=a),a}(e,r);return a.formatToParts(n)},o=function(i,e){for(var r=s(i,e),a=[],o=0;o<r.length;o+=1){var u=r[o],c=u.type,l=u.value,d=t[c];d>=0&&(a[d]=parseInt(l,10))}var f=a[3],h=24===f?0:f,b=a[0]+"-"+a[1]+"-"+a[2]+" "+h+":"+a[4]+":"+a[5]+":000",w=+i;return(n.utc(b).valueOf()-(w-=w%1e3))/6e4},u=r.prototype;u.tz=function(t,i){void 0===t&&(t=a);var e,r=this.utcOffset(),s=this.toDate(),o=s.toLocaleString("en-US",{timeZone:t}),u=Math.round((s-new Date(o))/1e3/60),c=15*-Math.round(s.getTimezoneOffset()/15)-u;if(Number(c)){if(e=n(o,{locale:this.$L}).$set("millisecond",this.$ms).utcOffset(c,!0),i){var l=e.utcOffset();e=e.add(r-l,"minute")}}else e=this.utcOffset(0,i);return e.$x.$timezone=t,e},u.offsetName=function(t){var i=this.$x.$timezone||n.tz.guess(),e=s(this.valueOf(),i,{timeZoneName:t}).find((function(t){return"timezonename"===t.type.toLowerCase()}));return e&&e.value};var c=u.startOf;u.startOf=function(t,i){if(!this.$x||!this.$x.$timezone)return c.call(this,t,i);var e=n(this.format("YYYY-MM-DD HH:mm:ss:SSS"),{locale:this.$L});return c.call(e,t,i).tz(this.$x.$timezone,!0)},n.tz=function(t,i,e){var r=e&&i,s=e||i||a,u=o(+n(),s);if("string"!=typeof t)return n(t).tz(s);var c=function(t,i,e){var r=t-60*i*1e3,n=o(r,e);if(i===n)return[r,i];var a=o(r-=60*(n-i)*1e3,e);return n===a?[r,n]:[t-60*Math.min(n,a)*1e3,Math.max(n,a)]}(n.utc(t,r).valueOf(),u,s),l=c[0],d=c[1],f=n(l).utcOffset(d);return f.$x.$timezone=s,f},n.tz.guess=function(){return Intl.DateTimeFormat().resolvedOptions().timeZone},n.tz.setDefault=function(t){a=t}}}))},8602:function(t){!function(i,e){t.exports=e()}(0,(function(){"use strict";var t="minute",i=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(r,n,a){var s=n.prototype;a.utc=function(t){var i={date:t,utc:!0,args:arguments};return new n(i)},s.utc=function(i){var e=a(this.toDate(),{locale:this.$L,utc:!0});return i?e.add(this.utcOffset(),t):e},s.local=function(){return a(this.toDate(),{locale:this.$L,utc:!1})};var o=s.parse;s.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t)};var u=s.init;s.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds()}else u.call(this)};var c=s.utcOffset;s.utcOffset=function(r,n){var a=this.$utils().u;if(a(r))return this.$u?0:a(this.$offset)?c.call(this):this.$offset;if("string"==typeof r&&(r=function(t){void 0===t&&(t="");var r=t.match(i);if(!r)return null;var n=(""+r[0]).match(e)||["-",0,0],a=n[0],s=60*+n[1]+ +n[2];return 0===s?0:"+"===a?s:-s}(r),null===r))return this;var s=Math.abs(r)<=16?60*r:r,o=this;if(n)return o.$offset=s,o.$u=0===r,o;if(0!==r){var u=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(s+u,t)).$offset=s,o.$x.$localOffset=u}else o=this.utc();return o};var l=s.format;s.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return l.call(this,i)},s.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},s.isUTC=function(){return!!this.$u},s.toISOString=function(){return this.toDate().toISOString()},s.toString=function(){return this.toDate().toUTCString()};var d=s.toDate;s.toDate=function(t){return"s"===t&&this.$offset?a(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():d.call(this)};var f=s.diff;s.diff=function(t,i,e){if(t&&this.$u===t.$u)return f.call(this,t,i,e);var r=this.local(),n=a(t).local();return f.call(r,n,i,e)}}}))},8176:function(t,i,e){var r;(function(n,a){"use strict";var s="1.0.38",o="",u="?",c="function",l="undefined",d="object",f="string",h="major",b="model",w="name",m="type",p="vendor",v="version",g="architecture",y="console",x="mobile",$="tablet",k="smarttv",_="wearable",M="embedded",D=500,S="Amazon",C="Apple",O="ASUS",T="BlackBerry",z="Browser",Y="Chrome",A="Edge",U="Firefox",q="Google",L="Huawei",N="LG",H="Microsoft",P="Motorola",j="Opera",I="Samsung",E="Sharp",Z="Sony",B="Xiaomi",R="Zebra",V="Facebook",W="Chromium OS",F="Mac OS",G=function(t,i){var e={};for(var r in t)i[r]&&i[r].length%2===0?e[r]=i[r].concat(t[r]):e[r]=t[r];return e},J=function(t){for(var i={},e=0;e<t.length;e++)i[t[e].toUpperCase()]=t[e];return i},X=function(t,i){return typeof t===f&&-1!==K(i).indexOf(K(t))},K=function(t){return t.toLowerCase()},Q=function(t){return typeof t===f?t.replace(/[^\d\.]/g,o).split(".")[0]:a},tt=function(t,i){if(typeof t===f)return t=t.replace(/^\s\s*/,o),typeof i===l?t:t.substring(0,D)},it=function(t,i){var e,r,n,s,o,u,l=0;while(l<i.length&&!o){var f=i[l],h=i[l+1];e=r=0;while(e<f.length&&!o){if(!f[e])break;if(o=f[e++].exec(t),o)for(n=0;n<h.length;n++)u=o[++r],s=h[n],typeof s===d&&s.length>0?2===s.length?typeof s[1]==c?this[s[0]]=s[1].call(this,u):this[s[0]]=s[1]:3===s.length?typeof s[1]!==c||s[1].exec&&s[1].test?this[s[0]]=u?u.replace(s[1],s[2]):a:this[s[0]]=u?s[1].call(this,u,s[2]):a:4===s.length&&(this[s[0]]=u?s[3].call(this,u.replace(s[1],s[2])):a):this[s]=u||a}l+=2}},et=function(t,i){for(var e in i)if(typeof i[e]===d&&i[e].length>0){for(var r=0;r<i[e].length;r++)if(X(i[e][r],t))return e===u?a:e}else if(X(i[e],t))return e===u?a:e;return t},rt={"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"},nt={ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"},at={browser:[[/\b(?:crmo|crios)\/([\w\.]+)/i],[v,[w,"Chrome"]],[/edg(?:e|ios|a)?\/([\w\.]+)/i],[v,[w,"Edge"]],[/(opera mini)\/([-\w\.]+)/i,/(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,/(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i],[w,v],[/opios[\/ ]+([\w\.]+)/i],[v,[w,j+" Mini"]],[/\bop(?:rg)?x\/([\w\.]+)/i],[v,[w,j+" GX"]],[/\bopr\/([\w\.]+)/i],[v,[w,j]],[/\bb[ai]*d(?:uhd|[ub]*[aekoprswx]{5,6})[\/ ]?([\w\.]+)/i],[v,[w,"Baidu"]],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,/(avant|iemobile|slim)\s?(?:browser)?[\/ ]?([\w\.]*)/i,/(?:ms|\()(ie) ([\w\.]+)/i,/(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i,/(heytap|ovi)browser\/([\d\.]+)/i,/(weibo)__([\d\.]+)/i],[w,v],[/\bddg\/([\w\.]+)/i],[v,[w,"DuckDuckGo"]],[/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],[v,[w,"UC"+z]],[/microm.+\bqbcore\/([\w\.]+)/i,/\bqbcore\/([\w\.]+).+microm/i,/micromessenger\/([\w\.]+)/i],[v,[w,"WeChat"]],[/konqueror\/([\w\.]+)/i],[v,[w,"Konqueror"]],[/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],[v,[w,"IE"]],[/ya(?:search)?browser\/([\w\.]+)/i],[v,[w,"Yandex"]],[/slbrowser\/([\w\.]+)/i],[v,[w,"Smart Lenovo "+z]],[/(avast|avg)\/([\w\.]+)/i],[[w,/(.+)/,"$1 Secure "+z],v],[/\bfocus\/([\w\.]+)/i],[v,[w,U+" Focus"]],[/\bopt\/([\w\.]+)/i],[v,[w,j+" Touch"]],[/coc_coc\w+\/([\w\.]+)/i],[v,[w,"Coc Coc"]],[/dolfin\/([\w\.]+)/i],[v,[w,"Dolphin"]],[/coast\/([\w\.]+)/i],[v,[w,j+" Coast"]],[/miuibrowser\/([\w\.]+)/i],[v,[w,"MIUI "+z]],[/fxios\/([-\w\.]+)/i],[v,[w,U]],[/\bqihu|(qi?ho?o?|360)browser/i],[[w,"360 "+z]],[/(oculus|sailfish|huawei|vivo)browser\/([\w\.]+)/i],[[w,/(.+)/,"$1 "+z],v],[/samsungbrowser\/([\w\.]+)/i],[v,[w,I+" Internet"]],[/(comodo_dragon)\/([\w\.]+)/i],[[w,/_/g," "],v],[/metasr[\/ ]?([\d\.]+)/i],[v,[w,"Sogou Explorer"]],[/(sogou)mo\w+\/([\d\.]+)/i],[[w,"Sogou Mobile"],v],[/(electron)\/([\w\.]+) safari/i,/(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,/m?(qqbrowser|2345Explorer)[\/ ]?([\w\.]+)/i],[w,v],[/(lbbrowser)/i,/\[(linkedin)app\]/i],[w],[/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],[[w,V],v],[/(Klarna)\/([\w\.]+)/i,/(kakao(?:talk|story))[\/ ]([\w\.]+)/i,/(naver)\(.*?(\d+\.[\w\.]+).*\)/i,/safari (line)\/([\w\.]+)/i,/\b(line)\/([\w\.]+)\/iab/i,/(alipay)client\/([\w\.]+)/i,/(twitter)(?:and| f.+e\/([\w\.]+))/i,/(chromium|instagram|snapchat)[\/ ]([-\w\.]+)/i],[w,v],[/\bgsa\/([\w\.]+) .*safari\//i],[v,[w,"GSA"]],[/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i],[v,[w,"TikTok"]],[/headlesschrome(?:\/([\w\.]+)| )/i],[v,[w,Y+" Headless"]],[/ wv\).+(chrome)\/([\w\.]+)/i],[[w,Y+" WebView"],v],[/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],[v,[w,"Android "+z]],[/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],[w,v],[/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i],[v,[w,"Mobile Safari"]],[/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i],[v,w],[/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],[w,[v,et,rt]],[/(webkit|khtml)\/([\w\.]+)/i],[w,v],[/(navigator|netscape\d?)\/([-\w\.]+)/i],[[w,"Netscape"],v],[/mobile vr; rv:([\w\.]+)\).+firefox/i],[v,[w,U+" Reality"]],[/ekiohf.+(flow)\/([\w\.]+)/i,/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,/(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,/(firefox)\/([\w\.]+)/i,/(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,/(links) \(([\w\.]+)/i,/panasonic;(viera)/i],[w,v],[/(cobalt)\/([\w\.]+)/i],[w,[v,/master.|lts./,""]]],cpu:[[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],[[g,"amd64"]],[/(ia32(?=;))/i],[[g,K]],[/((?:i[346]|x)86)[;\)]/i],[[g,"ia32"]],[/\b(aarch64|arm(v?8e?l?|_?64))\b/i],[[g,"arm64"]],[/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],[[g,"armhf"]],[/windows (ce|mobile); ppc;/i],[[g,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],[[g,/ower/,o,K]],[/(sun4\w)[;\)]/i],[[g,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i],[[g,K]]],device:[[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i],[b,[p,I],[m,$]],[/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i,/samsung[- ]([-\w]+)/i,/sec-(sgh\w+)/i],[b,[p,I],[m,x]],[/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i],[b,[p,C],[m,x]],[/\((ipad);[-\w\),; ]+apple/i,/applecoremedia\/[\w\.]+ \((ipad)/i,/\b(ipad)\d\d?,\d\d?[;\]].+ios/i],[b,[p,C],[m,$]],[/(macintosh);/i],[b,[p,C]],[/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],[b,[p,E],[m,x]],[/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],[b,[p,L],[m,$]],[/(?:huawei|honor)([-\w ]+)[;\)]/i,/\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i],[b,[p,L],[m,x]],[/\b(poco[\w ]+|m2\d{3}j\d\d[a-z]{2})(?: bui|\))/i,/\b; (\w+) build\/hm\1/i,/\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,/\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,/oid[^\)]+; (m?[12][0-389][01]\w{3,6}[c-y])( bui|; wv|\))/i,/\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i],[[b,/_/g," "],[p,B],[m,x]],[/oid[^\)]+; (2\d{4}(283|rpbf)[cgl])( bui|\))/i,/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],[[b,/_/g," "],[p,B],[m,$]],[/; (\w+) bui.+ oppo/i,/\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i],[b,[p,"OPPO"],[m,x]],[/\b(opd2\d{3}a?) bui/i],[b,[p,"OPPO"],[m,$]],[/vivo (\w+)(?: bui|\))/i,/\b(v[12]\d{3}\w?[at])(?: bui|;)/i],[b,[p,"Vivo"],[m,x]],[/\b(rmx[1-3]\d{3})(?: bui|;|\))/i],[b,[p,"Realme"],[m,x]],[/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,/\bmot(?:orola)?[- ](\w*)/i,/((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i],[b,[p,P],[m,x]],[/\b(mz60\d|xoom[2 ]{0,2}) build\//i],[b,[p,P],[m,$]],[/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],[b,[p,N],[m,$]],[/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,/\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,/\blg-?([\d\w]+) bui/i],[b,[p,N],[m,x]],[/(ideatab[-\w ]+)/i,/lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i],[b,[p,"Lenovo"],[m,$]],[/(?:maemo|nokia).*(n900|lumia \d+)/i,/nokia[-_ ]?([-\w\.]*)/i],[[b,/_/g," "],[p,"Nokia"],[m,x]],[/(pixel c)\b/i],[b,[p,q],[m,$]],[/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],[b,[p,q],[m,x]],[/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i],[b,[p,Z],[m,x]],[/sony tablet [ps]/i,/\b(?:sony)?sgp\w+(?: bui|\))/i],[[b,"Xperia Tablet"],[p,Z],[m,$]],[/ (kb2005|in20[12]5|be20[12][59])\b/i,/(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i],[b,[p,"OnePlus"],[m,x]],[/(alexa)webm/i,/(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i,/(kf[a-z]+)( bui|\)).+silk\//i],[b,[p,S],[m,$]],[/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],[[b,/(.+)/g,"Fire Phone $1"],[p,S],[m,x]],[/(playbook);[-\w\),; ]+(rim)/i],[b,p,[m,$]],[/\b((?:bb[a-f]|st[hv])100-\d)/i,/\(bb10; (\w+)/i],[b,[p,T],[m,x]],[/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i],[b,[p,O],[m,$]],[/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],[b,[p,O],[m,x]],[/(nexus 9)/i],[b,[p,"HTC"],[m,$]],[/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,/(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,/(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i],[p,[b,/_/g," "],[m,x]],[/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],[b,[p,"Acer"],[m,$]],[/droid.+; (m[1-5] note) bui/i,/\bmz-([-\w]{2,})/i],[b,[p,"Meizu"],[m,x]],[/; ((?:power )?armor(?:[\w ]{0,8}))(?: bui|\))/i],[b,[p,"Ulefone"],[m,x]],[/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron|infinix|tecno)[-_ ]?([-\w]*)/i,/(hp) ([\w ]+\w)/i,/(asus)-?(\w+)/i,/(microsoft); (lumia[\w ]+)/i,/(lenovo)[-_ ]?([-\w]+)/i,/(jolla)/i,/(oppo) ?([\w ]+) bui/i],[p,b,[m,x]],[/(kobo)\s(ereader|touch)/i,/(archos) (gamepad2?)/i,/(hp).+(touchpad(?!.+tablet)|tablet)/i,/(kindle)\/([\w\.]+)/i,/(nook)[\w ]+build\/(\w+)/i,/(dell) (strea[kpr\d ]*[\dko])/i,/(le[- ]+pan)[- ]+(\w{1,9}) bui/i,/(trinity)[- ]*(t\d{3}) bui/i,/(gigaset)[- ]+(q\w{1,9}) bui/i,/(vodafone) ([\w ]+)(?:\)| bui)/i],[p,b,[m,$]],[/(surface duo)/i],[b,[p,H],[m,$]],[/droid [\d\.]+; (fp\du?)(?: b|\))/i],[b,[p,"Fairphone"],[m,x]],[/(u304aa)/i],[b,[p,"AT&T"],[m,x]],[/\bsie-(\w*)/i],[b,[p,"Siemens"],[m,x]],[/\b(rct\w+) b/i],[b,[p,"RCA"],[m,$]],[/\b(venue[\d ]{2,7}) b/i],[b,[p,"Dell"],[m,$]],[/\b(q(?:mv|ta)\w+) b/i],[b,[p,"Verizon"],[m,$]],[/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],[b,[p,"Barnes & Noble"],[m,$]],[/\b(tm\d{3}\w+) b/i],[b,[p,"NuVision"],[m,$]],[/\b(k88) b/i],[b,[p,"ZTE"],[m,$]],[/\b(nx\d{3}j) b/i],[b,[p,"ZTE"],[m,x]],[/\b(gen\d{3}) b.+49h/i],[b,[p,"Swiss"],[m,x]],[/\b(zur\d{3}) b/i],[b,[p,"Swiss"],[m,$]],[/\b((zeki)?tb.*\b) b/i],[b,[p,"Zeki"],[m,$]],[/\b([yr]\d{2}) b/i,/\b(dragon[- ]+touch |dt)(\w{5}) b/i],[[p,"Dragon Touch"],b,[m,$]],[/\b(ns-?\w{0,9}) b/i],[b,[p,"Insignia"],[m,$]],[/\b((nxa|next)-?\w{0,9}) b/i],[b,[p,"NextBook"],[m,$]],[/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],[[p,"Voice"],b,[m,x]],[/\b(lvtel\-)?(v1[12]) b/i],[[p,"LvTel"],b,[m,x]],[/\b(ph-1) /i],[b,[p,"Essential"],[m,x]],[/\b(v(100md|700na|7011|917g).*\b) b/i],[b,[p,"Envizen"],[m,$]],[/\b(trio[-\w\. ]+) b/i],[b,[p,"MachSpeed"],[m,$]],[/\btu_(1491) b/i],[b,[p,"Rotor"],[m,$]],[/(shield[\w ]+) b/i],[b,[p,"Nvidia"],[m,$]],[/(sprint) (\w+)/i],[p,b,[m,x]],[/(kin\.[onetw]{3})/i],[[b,/\./g," "],[p,H],[m,x]],[/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],[b,[p,R],[m,$]],[/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],[b,[p,R],[m,x]],[/smart-tv.+(samsung)/i],[p,[m,k]],[/hbbtv.+maple;(\d+)/i],[[b,/^/,"SmartTV"],[p,I],[m,k]],[/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],[[p,N],[m,k]],[/(apple) ?tv/i],[p,[b,C+" TV"],[m,k]],[/crkey/i],[[b,Y+"cast"],[p,q],[m,k]],[/droid.+aft(\w+)( bui|\))/i],[b,[p,S],[m,k]],[/\(dtv[\);].+(aquos)/i,/(aquos-tv[\w ]+)\)/i],[b,[p,E],[m,k]],[/(bravia[\w ]+)( bui|\))/i],[b,[p,Z],[m,k]],[/(mitv-\w{5}) bui/i],[b,[p,B],[m,k]],[/Hbbtv.*(technisat) (.*);/i],[p,b,[m,k]],[/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,/hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i],[[p,tt],[b,tt],[m,k]],[/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],[[m,k]],[/(ouya)/i,/(nintendo) ([wids3utch]+)/i],[p,b,[m,y]],[/droid.+; (shield) bui/i],[b,[p,"Nvidia"],[m,y]],[/(playstation [345portablevi]+)/i],[b,[p,Z],[m,y]],[/\b(xbox(?: one)?(?!; xbox))[\); ]/i],[b,[p,H],[m,y]],[/((pebble))app/i],[p,b,[m,_]],[/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i],[b,[p,C],[m,_]],[/droid.+; (glass) \d/i],[b,[p,q],[m,_]],[/droid.+; (wt63?0{2,3})\)/i],[b,[p,R],[m,_]],[/(quest( \d| pro)?)/i],[b,[p,V],[m,_]],[/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],[p,[m,M]],[/(aeobc)\b/i],[b,[p,S],[m,M]],[/droid .+?; ([^;]+?)(?: bui|; wv\)|\) applew).+? mobile safari/i],[b,[m,x]],[/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],[b,[m,$]],[/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],[[m,$]],[/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i],[[m,x]],[/(android[-\w\. ]{0,9});.+buil/i],[b,[p,"Generic"]]],engine:[[/windows.+ edge\/([\w\.]+)/i],[v,[w,A+"HTML"]],[/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],[v,[w,"Blink"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,/ekioh(flow)\/([\w\.]+)/i,/(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,/(icab)[\/ ]([23]\.[\d\.]+)/i,/\b(libweb)/i],[w,v],[/rv\:([\w\.]{1,9})\b.+(gecko)/i],[v,w]],os:[[/microsoft (windows) (vista|xp)/i],[w,v],[/(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i],[w,[v,et,nt]],[/windows nt 6\.2; (arm)/i,/windows[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,/(?:win(?=3|9|n)|win 9x )([nt\d\.]+)/i],[[v,et,nt],[w,"Windows"]],[/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,/(?:ios;fbsv\/|iphone.+ios[\/ ])([\d\.]+)/i,/cfnetwork\/.+darwin/i],[[v,/_/g,"."],[w,"iOS"]],[/(mac os x) ?([\w\. ]*)/i,/(macintosh|mac_powerpc\b)(?!.+haiku)/i],[[w,F],[v,/_/g,"."]],[/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i],[v,w],[/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,/(blackberry)\w*\/([\w\.]*)/i,/(tizen|kaios)[\/ ]([\w\.]+)/i,/\((series40);/i],[w,v],[/\(bb(10);/i],[v,[w,T]],[/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],[v,[w,"Symbian"]],[/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i],[v,[w,U+" OS"]],[/web0s;.+rt(tv)/i,/\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],[v,[w,"webOS"]],[/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i],[v,[w,"watchOS"]],[/crkey\/([\d\.]+)/i],[v,[w,Y+"cast"]],[/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i],[[w,W],v],[/panasonic;(viera)/i,/(netrange)mmh/i,/(nettv)\/(\d+\.[\w\.]+)/i,/(nintendo|playstation) ([wids345portablevuch]+)/i,/(xbox); +xbox ([^\);]+)/i,/\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,/(mint)[\/\(\) ]?(\w*)/i,/(mageia|vectorlinux)[; ]/i,/([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,/(hurd|linux) ?([\w\.]*)/i,/(gnu) ?([\w\.]*)/i,/\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,/(haiku) (\w+)/i],[w,v],[/(sunos) ?([\w\.\d]*)/i],[[w,"Solaris"],v],[/((?:open)?solaris)[-\/ ]?([\w\.]*)/i,/(aix) ((\d)(?=\.|\)| )[\w\.])*/i,/\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i,/(unix) ?([\w\.]*)/i],[w,v]]},st=function(t,i){if(typeof t===d&&(i=t,t=a),!(this instanceof st))return new st(t,i).getResult();var e=typeof n!==l&&n.navigator?n.navigator:a,r=t||(e&&e.userAgent?e.userAgent:o),s=e&&e.userAgentData?e.userAgentData:a,u=i?G(at,i):at,y=e&&e.userAgent==r;return this.getBrowser=function(){var t={};return t[w]=a,t[v]=a,it.call(t,r,u.browser),t[h]=Q(t[v]),y&&e&&e.brave&&typeof e.brave.isBrave==c&&(t[w]="Brave"),t},this.getCPU=function(){var t={};return t[g]=a,it.call(t,r,u.cpu),t},this.getDevice=function(){var t={};return t[p]=a,t[b]=a,t[m]=a,it.call(t,r,u.device),y&&!t[m]&&s&&s.mobile&&(t[m]=x),y&&"Macintosh"==t[b]&&e&&typeof e.standalone!==l&&e.maxTouchPoints&&e.maxTouchPoints>2&&(t[b]="iPad",t[m]=$),t},this.getEngine=function(){var t={};return t[w]=a,t[v]=a,it.call(t,r,u.engine),t},this.getOS=function(){var t={};return t[w]=a,t[v]=a,it.call(t,r,u.os),y&&!t[w]&&s&&s.platform&&"Unknown"!=s.platform&&(t[w]=s.platform.replace(/chrome os/i,W).replace(/macos/i,F)),t},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return r},this.setUA=function(t){return r=typeof t===f&&t.length>D?tt(t,D):t,this},this.setUA(r),this};st.VERSION=s,st.BROWSER=J([w,v,h]),st.CPU=J([g]),st.DEVICE=J([b,p,m,y,x,k,$,_,M]),st.ENGINE=st.OS=J([w,v]),typeof i!==l?("object"!==l&&t.exports&&(i=t.exports=st),i.UAParser=st):"function"===c&&e.amdO?(r=function(){return st}.call(i,e,i,t),r===a||(t.exports=r)):typeof n!==l&&(n.UAParser=st);var ot=typeof n!==l&&(n.jQuery||n.Zepto);if(ot&&!ot.ua){var ut=new st;ot.ua=ut.getResult(),ot.ua.get=function(){return ut.getUA()},ot.ua.set=function(t){ut.setUA(t);var i=ut.getResult();for(var e in i)ot.ua[e]=i[e]}}})("object"===typeof window?window:this)}}]);
//# sourceMappingURL=272.0e36df08.js.map