(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))a(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function s(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(r){if(r.ep)return;r.ep=!0;const o=s(r);fetch(r.href,o)}})();var O=Uint8Array,de=Uint16Array,ht=Int32Array,Ze=new O([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Qe=new O([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),gt=new O([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),_e=function(e,t){for(var s=new de(31),a=0;a<31;++a)s[a]=t+=1<<e[a-1];for(var r=new ht(s[30]),a=1;a<30;++a)for(var o=s[a];o<s[a+1];++o)r[o]=o-s[a]<<5|a;return{b:s,r}},et=_e(Ze,2),tt=et.b,yt=et.r;tt[28]=258,yt[258]=28;var bt=_e(Qe,0),xt=bt.b,Re=new de(32768);for(var A=0;A<32768;++A){var X=(A&43690)>>1|(A&21845)<<1;X=(X&52428)>>2|(X&13107)<<2,X=(X&61680)>>4|(X&3855)<<4,Re[A]=((X&65280)>>8|(X&255)<<8)>>1}var ye=(function(e,t,s){for(var a=e.length,r=0,o=new de(t);r<a;++r)e[r]&&++o[e[r]-1];var c=new de(t);for(r=1;r<t;++r)c[r]=c[r-1]+o[r-1]<<1;var u;if(s){u=new de(1<<t);var l=15-t;for(r=0;r<a;++r)if(e[r])for(var v=r<<4|e[r],m=t-e[r],d=c[e[r]-1]++<<m,f=d|(1<<m)-1;d<=f;++d)u[Re[d]>>l]=v}else for(u=new de(a),r=0;r<a;++r)e[r]&&(u[r]=Re[c[e[r]-1]++]>>15-e[r]);return u}),be=new O(288);for(var A=0;A<144;++A)be[A]=8;for(var A=144;A<256;++A)be[A]=9;for(var A=256;A<280;++A)be[A]=7;for(var A=280;A<288;++A)be[A]=8;var nt=new O(32);for(var A=0;A<32;++A)nt[A]=5;var $t=ye(be,9,1),kt=ye(nt,5,1),Ee=function(e){for(var t=e[0],s=1;s<e.length;++s)e[s]>t&&(t=e[s]);return t},U=function(e,t,s){var a=t/8|0;return(e[a]|e[a+1]<<8)>>(t&7)&s},Ne=function(e,t){var s=t/8|0;return(e[s]|e[s+1]<<8|e[s+2]<<16)>>(t&7)},St=function(e){return(e+7)/8|0},qe=function(e,t,s){return(t==null||t<0)&&(t=0),(s==null||s>e.length)&&(s=e.length),new O(e.subarray(t,s))},wt=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],B=function(e,t,s){var a=new Error(t||wt[e]);if(a.code=e,Error.captureStackTrace&&Error.captureStackTrace(a,B),!s)throw a;return a},Ct=function(e,t,s,a){var r=e.length,o=a?a.length:0;if(!r||t.f&&!t.l)return s||new O(0);var c=!s,u=c||t.i!=2,l=t.i;c&&(s=new O(r*3));var v=function(fe){var n=s.length;if(fe>n){var h=new O(Math.max(n*2,fe));h.set(s),s=h}},m=t.f||0,d=t.p||0,f=t.b||0,b=t.l,x=t.d,g=t.m,$=t.n,w=r*8;do{if(!b){m=U(e,d,1);var M=U(e,d+1,3);if(d+=3,M)if(M==1)b=$t,x=kt,g=9,$=5;else if(M==2){var F=U(e,d,31)+257,S=U(e,d+10,15)+4,Y=F+U(e,d+5,31)+1;d+=14;for(var J=new O(Y),le=new O(19),R=0;R<S;++R)le[gt[R]]=U(e,d+R*3,7);d+=S*3;for(var xe=Ee(le),$e=(1<<xe)-1,ue=ye(le,xe,1),R=0;R<Y;){var ke=ue[U(e,d,$e)];d+=ke&15;var k=ke>>4;if(k<16)J[R++]=k;else{var H=0,I=0;for(k==16?(I=3+U(e,d,3),d+=2,H=J[R-1]):k==17?(I=3+U(e,d,7),d+=3):k==18&&(I=11+U(e,d,127),d+=7);I--;)J[R++]=H}}var te=J.subarray(0,F),L=J.subarray(F);g=Ee(te),$=Ee(L),b=ye(te,g,1),x=ye(L,$,1)}else B(1);else{var k=St(d)+4,N=e[k-4]|e[k-3]<<8,E=k+N;if(E>r){l&&B(0);break}u&&v(f+N),s.set(e.subarray(k,E),f),t.b=f+=N,t.p=d=E*8,t.f=m;continue}if(d>w){l&&B(0);break}}u&&v(f+131072);for(var oe=(1<<g)-1,ie=(1<<$)-1,Se=d;;Se=d){var H=b[Ne(e,d)&oe],q=H>>4;if(d+=H&15,d>w){l&&B(0);break}if(H||B(2),q<256)s[f++]=q;else if(q==256){Se=d,b=null;break}else{var we=q-254;if(q>264){var R=q-257,ne=Ze[R];we=U(e,d,(1<<ne)-1)+tt[R],d+=ne}var pe=x[Ne(e,d)&ie],ce=pe>>4;pe||B(3),d+=pe&15;var L=xt[ce];if(ce>3){var ne=Qe[ce];L+=Ne(e,d)&(1<<ne)-1,d+=ne}if(d>w){l&&B(0);break}u&&v(f+131072);var me=f+we;if(f<L){var ve=o-L,Ce=Math.min(L,me);for(ve+f<0&&B(3);f<Ce;++f)s[f]=a[ve+f]}for(;f<me;++f)s[f]=s[f-L]}}t.l=b,t.p=Se,t.b=f,t.f=m,b&&(m=1,t.m=g,t.d=x,t.n=$)}while(!m);return f!=s.length&&c?qe(s,0,f):s.subarray(0,f)},Mt=new O(0),K=function(e,t){return e[t]|e[t+1]<<8},z=function(e,t){return(e[t]|e[t+1]<<8|e[t+2]<<16|e[t+3]<<24)>>>0},De=function(e,t){return z(e,t)+z(e,t+4)*4294967296};function At(e,t){return Ct(e,{i:2},t&&t.out,t&&t.dictionary)}var Fe=typeof TextDecoder<"u"&&new TextDecoder,Tt=0;try{Fe.decode(Mt,{stream:!0}),Tt=1}catch{}var Et=function(e){for(var t="",s=0;;){var a=e[s++],r=(a>127)+(a>223)+(a>239);if(s+r>e.length)return{s:t,r:qe(e,s-1)};r?r==3?(a=((a&15)<<18|(e[s++]&63)<<12|(e[s++]&63)<<6|e[s++]&63)-65536,t+=String.fromCharCode(55296|a>>10,56320|a&1023)):r&1?t+=String.fromCharCode((a&31)<<6|e[s++]&63):t+=String.fromCharCode((a&15)<<12|(e[s++]&63)<<6|e[s++]&63):t+=String.fromCharCode(a)}};function at(e,t){if(t){for(var s="",a=0;a<e.length;a+=16384)s+=String.fromCharCode.apply(null,e.subarray(a,a+16384));return s}else{if(Fe)return Fe.decode(e);var r=Et(e),o=r.s,s=r.r;return s.length&&B(8),o}}var Nt=function(e,t){return t+30+K(e,t+26)+K(e,t+28)},Dt=function(e,t,s){var a=K(e,t+28),r=K(e,t+30),o=at(e.subarray(t+46,t+46+a),!(K(e,t+8)&2048)),c=t+46+a,u=Pt(e,c,r,s,z(e,t+20),z(e,t+24),z(e,t+42)),l=u[0],v=u[1],m=u[2];return[K(e,t+10),l,v,o,c+r+K(e,t+32),m]},Pt=function(e,t,s,a,r,o,c){var u=r==4294967295,l=o==4294967295,v=c==4294967295,m=t+s,d=u+l+v;if(a&&d){for(;t+4<m;t+=4+K(e,t+2))if(K(e,t)==1)return[u?De(e,t+4+8*l):r,l?De(e,t+4):o,v?De(e,t+4+8*(l+u)):c,1];a<2&&B(13)}return[r,o,c,0]};function Lt(e,t){for(var s={},a=e.length-22;z(e,a)!=101010256;--a)(!a||e.length-a>65558)&&B(13);var r=K(e,a+8);if(!r)return{};var o=z(e,a+16),c=z(e,a-20)==117853008;if(c){var u=z(e,a-12);c=z(e,u)==101075792,c&&(r=z(e,u+32),o=z(e,u+48))}for(var l=0;l<r;++l){var v=Dt(e,o,c),m=v[0],d=v[1],f=v[2],b=v[3],x=v[4],g=v[5],$=Nt(e,g);o=x,m?m==8?s[b]=At(e.subarray($,$+d),{out:new O(f)}):B(14,"unknown compression type "+m):s[b]=qe(e,$,$+d)}return s}const P=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],Ae=["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"],Rt=new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR",minimumFractionDigits:2,maximumFractionDigits:2}),D=new Intl.NumberFormat("fr-FR"),je=[{id:"tr",label:"Trade Republic (TR)",aliases:["trade republic","traderepublic","tr"],categoryAliases:[],types:["income","expense"]},{id:"summeria",label:"Summeria",aliases:["summeria"],categoryAliases:[],types:["income","expense"]},{id:"cacf",label:"CACF",aliases:["cacf"],categoryAliases:[],types:["income","expense"]},{id:"cperso",label:"C Perso",aliases:["c perso"],categoryAliases:["alexandre peage","alexandre c perso","kelly c perso","kelly carte restaurant"],types:["expense"]},{id:"issues",label:"À vérifier",aliases:[],categoryAliases:[],types:["income","expense"]},{id:"works",label:"Travaux",aliases:[],categoryAliases:[],types:["expense"]},{id:"daily",label:"Dépenses du quotidien",aliases:[],categoryAliases:[],types:["expense"]}],st={alexandre:["alexandre tr","alexandre cacf","alexandre summeria","alexandre peage","alexandre c perso"],kelly:["kelly tr","kelly cacf","kelly summeria","kelly c perso","kelly carte restaurant"]},Ft={alexandre:["alexandre tr","alexandre cacf","alexandre summeria"],kelly:["kelly tr","kelly cacf","kelly summeria"]},rt=["remboursement","saveback","interets","dividende","cto","50/50 couple tr","50/50 couple cacf","50/50 couple summeria","alexandre peage","alexandre c perso","kelly c perso","kelly carte restaurant"],lt="clair.opening-balances.v1",ot="clair.current-balances.v1";function jt(){try{const e=JSON.parse(localStorage.getItem(lt)||"{}");return!e||typeof e!="object"||Array.isArray(e)?{}:e}catch{return{}}}function Bt(){try{const e=JSON.parse(localStorage.getItem(ot)||"{}");return!e||typeof e!="object"||Array.isArray(e)?{}:e}catch{return{}}}const i={transactions:[],fileName:"",dashboard:"overview",year:"all",category:"all",account:"all",type:"all",search:"",page:1,pageSize:10,openingBalances:jt(),currentBalances:Bt()},it=document.querySelector("#app");function y(e=""){return String(e).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t])}function p(e,t=!1){return Rt.format(e)}function Ie(e){if(typeof e=="number")return e;let t=String(e??"").trim();if(!t)return Number.NaN;const s=/^\(.*\)$/.test(t);t=t.replace(/[^\d,.-]/g,"");const a=t.lastIndexOf(","),r=t.lastIndexOf(".");if(a>=0&&r>a)t=t.replace(/,/g,"");else if(a>=0)t=`${t.slice(0,a).replace(/[.,]/g,"")}.${t.slice(a+1)}`;else if((t.match(/\./g)||[]).length>1){const c=t.lastIndexOf(".");t=`${t.slice(0,c).replace(/\./g,"")}.${t.slice(c+1)}`}const o=Number(t);return s?-Math.abs(o):o}function Ke(e){return new Intl.DateTimeFormat("fr-FR",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(e)}function Ot(e,t=!1){if(e instanceof Date&&!Number.isNaN(e.getTime()))return e;if(typeof e=="number"&&Number.isFinite(e)){const s=t?Date.UTC(1904,0,1):Date.UTC(1899,11,30);return new Date(s+Math.floor(e)*864e5)}if(typeof e=="string"&&e.trim()){const s=e.trim(),a=s.match(/^(\d{1,2})[/. -](\d{1,2})[/. -](\d{2,4})$/);if(a){const o=Number(a[3])+(a[3].length===2?2e3:0),c=new Date(Date.UTC(o,Number(a[2])-1,Number(a[1])));return Number.isNaN(c.getTime())?null:c}const r=new Date(s);if(!Number.isNaN(r.getTime()))return r}return null}function Q(e){return e==null?"":String(e).trim()}function C(e){return Q(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ")}function Z(e,t){const s=e.map(C);return t.map(C).map(a=>s.indexOf(a)).find(a=>a>=0)??-1}function zt(e){return C(e).includes("c perso")?"C Perso":Q(e.replace(/^(Revenus|Depenses)\s+/i,""))}function qt(e,t){if(t.id==="issues")return!!pt(e);if(!t.types.includes(e.type))return!1;const s=C(e.account),a=C(e.source),r=C(e.category);return t.categoryAliases.some(o=>r.includes(o)||s.includes(o))||t.aliases.some(o=>o==="tr"?[s,a].some(c=>c.split(/[^a-z0-9]+/).includes(o)):s.includes(o)||a.includes(o))}function ae(){const e=je.find(t=>t.id===i.dashboard);return(e==null?void 0:e.id)==="works"?i.transactions.filter(t=>He(t)&&[t.category,t.project].some(s=>C(s).includes("travaux"))):(e==null?void 0:e.id)==="daily"?i.transactions.filter(t=>He(t)&&![t.category,t.project].some(s=>C(s).includes("travaux"))):e?i.transactions.filter(t=>qt(t,e)):i.transactions}function W(e,t){return[...e.getElementsByTagNameNS("*",t)]}function Me(e,t){if(!e)throw new Error(`Le fichier Excel est incomplet : ${t} est absent.`);const s=new DOMParser().parseFromString(at(e),"application/xml");if(s.getElementsByTagName("parsererror").length)throw new Error(`Le fichier Excel contient un XML invalide (${t}).`);return s}function Ut(e){const t=e.startsWith("/")?e.slice(1):`xl/${e}`,s=[];for(const a of t.split("/"))a===".."?s.pop():a&&a!=="."&&s.push(a);return s.join("/")}function It(e){var a,r;const t=((r=(a=e.match(/^[A-Z]+/i))==null?void 0:a[0])==null?void 0:r.toUpperCase())??"";let s=0;for(const o of t)s=s*26+o.charCodeAt(0)-64;return s-1}function Kt(e){let t;try{t=Lt(e)}catch{throw new Error("Ce fichier Excel est endommagé ou n’est pas lisible.")}const s=Me(t["xl/workbook.xml"],"xl/workbook.xml"),a=Me(t["xl/_rels/workbook.xml.rels"],"xl/_rels/workbook.xml.rels"),r="http://schemas.openxmlformats.org/officeDocument/2006/relationships",o=new Map(W(a,"Relationship").map(d=>[d.getAttribute("Id"),d.getAttribute("Target")])),c=t["xl/sharedStrings.xml"]?Me(t["xl/sharedStrings.xml"],"xl/sharedStrings.xml"):null,u=c?W(c,"si").map(d=>W(d,"t").map(f=>f.textContent).join("")):[],l=W(s,"workbookPr")[0],v=["1","true"].includes(((l==null?void 0:l.getAttribute("date1904"))??"").toLowerCase()),m=new Map;for(const d of W(s,"sheet")){const f=d.getAttribute("name"),b=d.getAttributeNS(r,"id"),x=Ut(o.get(b)??""),g=Me(t[x],x),$=W(g,"row").map(w=>{const M=[];for(const k of W(w,"c")){const N=It(k.getAttribute("r")),E=W(k,"v")[0],F=k.getAttribute("t");let S=(E==null?void 0:E.textContent)??null;F==="s"&&S!==null?S=u[Number(S)]??"":F==="inlineStr"?S=W(k,"t").map(Y=>Y.textContent).join(""):F==="b"&&S!==null?S=S==="1":!F&&S!==null&&S!==""&&(S=Number(S)),M[N]=S}return M});m.set(f,$)}return{sheets:m,date1904:v}}function Pe(e,t){const s=e.sheets.get(t);if(!s)return[];const[a=[],...r]=s,o=a.map(Q),c=Z(o,["Date"]),u=Z(o,["Montant","Amount"]);if(c<0||u<0)return[];const l={date:c,amount:u,category:Z(o,["Category","Catégorie","Categorie"]),account:Z(o,["Account","Compte"]),project:Z(o,["Projet","Project"]),shop:Z(o,["Shop","Marchand","Magasin"]),memo:Z(o,["Memo","Note","Libellé","Libelle"]),reimbursed:Z(o,["Dejà remboursée","Déjà remboursée","Deja remboursee"])};return r.flatMap((v,m)=>{const d=Ot(v[l.date],e.date1904),f=Ie(v[l.amount]),b=l.reimbursed<0?Number.NaN:Ie(v[l.reimbursed]);if(!d||!Number.isFinite(f)&&!Number.isFinite(b))return[];const x=!Number.isFinite(f)&&Number.isFinite(b),g=Number.isFinite(f)?f:0,$=Number.isFinite(b)?Math.abs(b):0;return g===0&&$===0?[]:[{id:`${t}-${m}`,date:d,amount:g,category:l.category<0?"":Q(v[l.category]),account:(l.account<0?"":Q(v[l.account]))||zt(t),project:l.project<0?"":Q(v[l.project]),shop:l.shop<0?"":Q(v[l.shop]),memo:l.memo<0?"":Q(v[l.memo]),reimbursed:Number.isFinite($)?Math.abs($):0,reimbursementOnly:x,source:t,type:t.startsWith("Revenus")?"income":"expense",isTransfer:/transfert/i.test(v[l.category]==null?"":String(v[l.category]))}]})}function Ve(e){return[e.date.toISOString().slice(0,10),Math.round(Math.abs(e.amount)*100),C(e.category),C(e.account),C(e.project),C(e.shop),C(e.memo)].join("|")}function Vt(e){return e.arrayBuffer().then(t=>{const s=Kt(new Uint8Array(t)),r=[...s.sheets.keys()].filter(f=>/^(Revenus|Depenses)\s+/i.test(f)),o=r.filter(f=>/^Revenus\s+/i.test(f)).flatMap(f=>Pe(s,f)),c=r.filter(f=>/^Depenses\s+/i.test(f)).flatMap(f=>Pe(s,f)),u=Pe(s,"Depense C Perso");if(!r.length)throw new Error("Aucune feuille « Revenus… » ou « Depenses… » n’a été trouvée.");if(!o.length&&!c.length&&!u.length)throw new Error("Aucune transaction avec une date et un montant valides n’a été trouvée.");const l=new Map,v=f=>{for(const b of f){const x=Ve(b);l.set(x,(l.get(x)||0)+1)}},m=f=>{const b=[],x=new Map;for(const g of f){const $=Ve(g),w=x.get($)||0;w<(l.get($)||0)?x.set($,w+1):b.push(g)}return v(b),b};v(c);const d=m(u);return{transactions:[...o,...c,...d].sort((f,b)=>b.date-f.date||f.id.localeCompare(b.id)),duplicateCount:u.length-d.length}})}function V(e){return e.type==="expense"&&e.isTransfer&&C(e.category).includes("transfert externe")&&!e.reimbursementOnly}function ct(e){const t=C(e.account);return["tr","summeria"].find(s=>t.includes(`50/50 couple ${s}`)||t.includes(`alexandre ${s}`)||t.includes(`kelly ${s}`))??null}function _(e){return e.type==="expense"&&(!e.isTransfer||V(e))&&!e.reimbursementOnly}function Be(e){return _(e)&&C(e.source).includes("traderepublic")&&C(e.category).includes("plans d'epargne")}function Oe(e){return _(e)&&C(e.source).includes("traderepublic")&&C([e.category,e.account].join(" ")).includes("saveback")}function re(e){return e.type==="income"&&C([e.category,e.account].join(" ")).includes("saveback")}function He(e){return _(e)&&!e.isTransfer&&!e.reimbursementOnly&&!Be(e)&&!Oe(e)}function dt(){return ae().filter(e=>{const t=i.year==="all"||e.date.getUTCFullYear()===Number(i.year),s=i.category==="all"||e.category===i.category,a=i.account==="all"||e.account===i.account,r=i.type==="all"||e.type===i.type,o=C(i.search),c=!o||C([e.category,e.account,e.project,e.shop,e.memo,e.source].join(" ")).includes(o);return t&&s&&a&&r&&c})}function ut(e){const t=e.filter(u=>u.type==="income"&&!re(u)).reduce((u,l)=>u+l.amount,0),s=e.filter(_).reduce((u,l)=>u+Math.abs(l.amount),0),a=e.filter(u=>u.type==="expense"&&u.isTransfer&&!V(u)).reduce((u,l)=>u+Math.abs(l.amount),0),r=e.filter(Be).reduce((u,l)=>u+Math.abs(l.amount),0),o=e.filter(Oe).reduce((u,l)=>u+Math.abs(l.amount),0),c=Array.from({length:12},(u,l)=>({month:l,income:0,expenses:0,investments:0,savebackExpenses:0,investmentByPot:{alexandre:0,kelly:0,shared:0}}));for(const u of e){const l=c[u.date.getUTCMonth()];if(u.type==="income"&&!re(u)&&(l.income+=u.amount),_(u)){if(l.expenses+=Math.abs(u.amount),Be(u)){const v=Math.abs(u.amount);l.investments+=v;const m=ee(u);m&&(l.investmentByPot[m.kind]+=v)}Oe(u)&&(l.savebackExpenses+=Math.abs(u.amount))}}return{income:t,expenses:s,transfers:a,balance:t-s,investments:r,savebackExpenses:o,expensesWithoutSaveback:s-o,finalExpenses:s-r,monthly:c}}function ee(e){if(re(e)||e.isTransfer&&!V(e))return null;const t=C([e.category,e.account,e.memo].join(" "));if(!t.trim())return null;const s=e.type==="income",a=s?e.amount:Math.abs(e.amount),r=C(e.memo);if(V(e)){const c=C(e.account),u=ct(e);return u&&c.includes(`50/50 couple ${u}`)?{kind:"shared",income:0,expenses:a}:u&&c.includes(`alexandre ${u}`)?{kind:"alexandre",income:0,expenses:a}:u&&c.includes(`kelly ${u}`)?{kind:"kelly",income:0,expenses:a}:null}if(r.includes("cagnotte alexandre"))return{kind:"alexandre",income:s?a:0,expenses:s?0:a};if(r.includes("cagnotte kelly"))return{kind:"kelly",income:s?a:0,expenses:s?0:a};if(r.includes("cagnotte couple"))return{kind:"shared",income:s?a:0,expenses:s?0:a};const o=c=>{const u=Object.entries(c).find(([,l])=>l.some(v=>t.includes(v)));return u?u[0]:null};if(s){const c=o(st);if(c)return{kind:c,income:a,expenses:0}}else{const c=o(Ft);if(c)return{kind:c,income:0,expenses:a}}return rt.some(c=>t.includes(c))?{kind:"shared",income:s?a:0,expenses:s?0:a}:null}function pt(e){return e.isTransfer&&!V(e)||e.reimbursementOnly||ee(e)?null:!e.account&&!e.category&&!e.memo?"Compte, catégorie et mémo manquants : impossible de déterminer la cagnotte.":"Aucune règle de répartition reconnue pour ce compte, cette catégorie ou ce mémo."}function Ht(e){const t={alexandre:{income:0,expenses:0},kelly:{income:0,expenses:0},shared:{income:0,expenses:0}};let s=0,a=0,r=0;for(const c of e){if(c.isTransfer&&!V(c)||re(c))continue;const u=ee(c);if(!u){s+=1,c.type==="income"?a+=c.amount:r+=Math.abs(c.amount);continue}t[u.kind].income+=u.income,t[u.kind].expenses+=u.expenses}const o=t.shared.income-t.shared.expenses;return{alexandre:t.alexandre.income-t.alexandre.expenses+o/2,kelly:t.kelly.income-t.kelly.expenses+o/2,alexandrePersonal:t.alexandre.income-t.alexandre.expenses,kellyPersonal:t.kelly.income-t.kelly.expenses,sharedBalance:o,sharedIncome:t.shared.income,sharedExpenses:t.shared.expenses,unclassifiedCount:s,unclassifiedIncome:a,unclassifiedExpenses:r}}function We(e,t,s={}){const a=e.filter(g=>(!g.isTransfer||V(g))&&!g.reimbursementOnly);if(!a.length)return{months:[],unclassifiedCount:0};const r=a.reduce((g,$)=>$.date<g?$.date:g,a[0].date),o=a.reduce((g,$)=>$.date>g?$.date:g,a[0].date),c=r.getUTCFullYear()*12+r.getUTCMonth(),u=t==="all"?c:Number(t)*12,l=t==="all"?o.getUTCFullYear()*12+o.getUTCMonth():Number(t)*12+11,v=Math.min(c,u),m={alexandre:0,kelly:0,shared:0};let d=0;const f=[];let b=0;const x=new Map;for(const g of a){const $=g.date.getUTCFullYear()*12+g.date.getUTCMonth(),w=x.get($)||[];w.push(g),x.set($,w)}for(let g=v;g<=l;g+=1){const $=Math.floor(g/12),w=g%12===0?s[$]:null;w&&(m.alexandre=w.alexandre,m.kelly=w.kelly,m.shared=w.bank-w.alexandre-w.kelly,d=w.bank);const M={alexandre:{income:0,expenses:0},kelly:{income:0,expenses:0},shared:{income:0,expenses:0},bankIncome:0,bankExpenses:0};for(const k of x.get(g)||[]){if(k.type==="income"&&(M.bankIncome+=k.amount),_(k)&&(M.bankExpenses+=Math.abs(k.amount)),re(k))continue;const N=ee(k);if(!N){g>=u&&(b+=1);continue}M[N.kind].income+=N.income,M[N.kind].expenses+=N.expenses}for(const k of Object.keys(m))m[k]+=M[k].income-M[k].expenses;if(d+=M.bankIncome-M.bankExpenses,g>=u){const k=g%12;f.push({year:$,month:k,movement:M,balances:{...m},bankBalance:d})}}return{months:f,unclassifiedCount:b}}function Ue(e){const t=i.openingBalances[e];return!t||typeof t!="object"||Array.isArray(t)?{}:t}function ze(e,t){const s=Ue(e)[t];if(!s||typeof s!="object")return{bank:0,alexandre:0,kelly:0};const a=r=>Number.isFinite(Number(r))?Number(r):0;return{bank:a(s.bank),alexandre:a(s.alexandre),kelly:a(s.kelly)}}function Wt(e,t,s,a){const r=a.trim()===""?0:Number(a);if(!Number.isFinite(r))return!1;const o=Ue(e),c=ze(e,t),u={...i.openingBalances,[e]:{...o,[t]:{...c,[s]:r}}};return localStorage.setItem(lt,JSON.stringify(u)),i.openingBalances=u,!0}function Yt(e){const t=i.currentBalances[e];return Number.isFinite(Number(t))&&t!==""&&t!==null?Number(t):null}function Jt(e,t){const s=t.trim(),a={...i.currentBalances};if(!s)delete a[e];else{const r=Number(s);if(!Number.isFinite(r))return!1;a[e]=r}return localStorage.setItem(ot,JSON.stringify(a)),i.currentBalances=a,!0}function Ye(e){const t=C(e.account),s=C([e.category,e.account,e.memo].join(" ")),a=Math.abs(e.amount),r={alexandre:0,kelly:0},o=t.includes("alexandre")?"alexandre":t.includes("kelly")?"kelly":null,c=l=>l==="alexandre"?"Alexandre":"Kelly";if(e.isTransfer&&!V(e))return{linked:"Transfert interne · hors partage",alexandre:null,kelly:null,settlement:"Non réparti"};if(V(e)){const l=ee(e),m=ct(e)==="summeria"?"Summeria":"TR";if(!l)return{linked:"Transfert externe · compte payeur à vérifier",alexandre:null,kelly:null,settlement:"Aucune cagnotte reconnue"};const d=a/2;return l.kind==="shared"?{linked:`Transfert externe · payé par le couple (${m})`,alexandre:d,kelly:d,settlement:`Réglé à 50/50 · ${c("alexandre")} : ${p(d,!0)} · ${c("kelly")} : ${p(d,!0)}`}:{linked:`Transfert externe · cagnotte ${c(l.kind)} (${m})`,alexandre:l.kind==="alexandre"?a:0,kelly:l.kind==="kelly"?a:0,settlement:`Retiré de la cagnotte ${c(l.kind)}`}}if(re(e))return{linked:"Saveback bancaire · exclu des revenus",alexandre:null,kelly:null,settlement:"Compense le débit Saveback, sans alimenter une cagnotte"};if(e.reimbursementOnly){const l=e.reimbursed/2;return{linked:"Dépense déjà réglée · 50/50",alexandre:l,kelly:l,settlement:`Déjà partagé · ${c("alexandre")} : ${p(l,!0)} · ${c("kelly")} : ${p(l,!0)}`}}if(e.type==="expense"&&o&&(t.includes("c perso")||t.includes("peage")||t.includes("carte restaurant"))){r.alexandre=a/2,r.kelly=a/2;const l=o==="alexandre"?"kelly":"alexandre",v=Math.max(0,a-(e.reimbursed||0))/2;return{linked:`Dépense partagée · payée par ${c(o)}`,alexandre:r.alexandre,kelly:r.kelly,settlement:v>0?`${c(l)} doit ${p(v,!0)} à ${c(o)}`:"Part déjà considérée comme réglée à 50/50"}}const u=Object.entries(st).find(([,l])=>l.some(v=>t.includes(v)));if(u&&!t.includes("c perso")&&e.type==="expense"){const[l]=u;return r[l]=a,{linked:`Cagnotte ${c(l)}`,alexandre:r.alexandre,kelly:r.kelly,settlement:"Déduit de sa cagnotte personnelle"}}if(e.type==="income"&&u){const[l]=u;return r[l]=a,{linked:`Cagnotte ${c(l)}`,alexandre:r.alexandre,kelly:r.kelly,settlement:"Ajouté à sa cagnotte personnelle"}}if(rt.some(l=>s.includes(l))){const l=a/2;return r.alexandre=l,r.kelly=l,{linked:"Commun · 50/50",alexandre:l,kelly:l,settlement:`${c("alexandre")} : ${p(l,!0)} · ${c("kelly")} : ${p(l,!0)}`}}return{linked:"À vérifier",alexandre:null,kelly:null,settlement:"Aucune règle reconnue"}}function Gt(e){var l;const t={alexandre:["alexandre c perso","alexandre peage"],kelly:["kelly c perso","kelly carte restaurant"]},s={alexandre:0,kelly:0},a={alexandre:0,kelly:0},r={alexandre:0,kelly:0};for(const v of e){if(v.type!=="expense")continue;const m=C(v.account),d=(l=Object.entries(t).find(([,x])=>x.some(g=>m.includes(g))))==null?void 0:l[0];if(!d)continue;const f=Math.abs(v.amount);if(v.reimbursementOnly){a[d]+=v.reimbursed||0;continue}s[d]+=f;const b=Math.min(f,v.reimbursed||0);r[d]+=f-b}for(const v of Object.keys(r))r[v]=Math.max(0,r[v]-a[v]);const o=(r.alexandre-r.kelly)/2,c=o>0?"kelly":"alexandre",u=o>0?"alexandre":"kelly";return{paid:s,total:s.alexandre+s.kelly,owes:c,owedTo:u,amount:Math.abs(o),alreadyShared:a}}function Xt(e,t){var v;const s=t==="tr"?"TR":t==="summeria"?"Summeria":"CACF",a=`50/50 couple ${t}`,r=t==="tr"?"traderepublic":t,o={alexandre:0,kelly:0};let c=0,u=0;for(const m of e){const d=C(m.account),f=C(m.source);m.type==="income"&&(d.includes(`alexandre ${t}`)&&(o.alexandre+=m.amount),d.includes(`kelly ${t}`)&&(o.kelly+=m.amount),!re(m)&&f.includes(r)&&((v=ee(m))==null?void 0:v.kind)==="shared"&&(u+=m.amount)),m.type==="expense"&&(!m.isTransfer||V(m))&&!m.reimbursementOnly&&d.includes(a)&&(c+=Math.abs(m.amount))}const l=o.alexandre-o.kelly;return{accountId:t,accountLabel:s,contributions:o,sharedIncome:u,sharedExpenses:c,owedTo:l>0?"alexandre":"kelly",owes:l>0?"kelly":"alexandre",amount:Math.abs(l)/2}}function Zt(e){return[{...Gt(e),id:"cperso",accountLabel:"C Perso",destination:"privately",kind:"private"},...["tr","summeria","cacf"].map(s=>({...Xt(e,s),id:s,destination:"shared",kind:"shared"}))]}function Je(e,t){const s=new Map;for(const a of e){if(!_(a))continue;const r=t(a)||"Non renseigné";s.set(r,(s.get(r)||0)+Math.abs(a.amount))}return[...s.entries()].map(([a,r])=>({label:a,total:r})).sort((a,r)=>r.total-a.total)}function Qt(e,t){const s=new Map;for(const a of e){if(!_(a))continue;const r=t(a)||"Non renseigné",o=s.get(r)||{total:0,count:0};o.total+=Math.abs(a.amount),o.count+=1,s.set(r,o)}return[...s.entries()].map(([a,r])=>({label:a,...r})).sort((a,r)=>r.count-a.count||r.total-a.total)}function Ge(e,t){const s=new Map;for(const m of e){const d=m.date.getUTCFullYear()*12+m.date.getUTCMonth();s.has(d)||s.set(d,{key:d,year:m.date.getUTCFullYear(),month:m.date.getUTCMonth(),total:0,alexandre:0,kelly:0,unallocated:0,count:0});const f=s.get(d),b=Math.abs(m.amount);f.total+=b,f.count+=1;const x=ee(m);(x==null?void 0:x.kind)==="shared"?(f.alexandre+=b/2,f.kelly+=b/2):(x==null?void 0:x.kind)==="alexandre"?f.alexandre+=b:(x==null?void 0:x.kind)==="kelly"?f.kelly+=b:f.unallocated+=b}const a=[...s.values()].sort((m,d)=>m.key-d.key);if(t!=="all")for(let m=0;m<12;m+=1){const d=Number(t)*12+m;s.has(d)||s.set(d,{key:d,year:Number(t),month:m,total:0,alexandre:0,kelly:0,unallocated:0,count:0})}const r=[...s.values()].sort((m,d)=>m.key-d.key),o=a.reduce((m,d)=>m+d.total,0),c=a.reduce((m,d)=>m+d.alexandre,0),u=a.reduce((m,d)=>m+d.kelly,0),l=a.reduce((m,d)=>m+d.unallocated,0),v=a.filter(m=>m.count>0).length;return{total:o,alexandre:c,kelly:u,unallocated:l,average:v?o/v:0,activeMonthCount:v,months:r}}function Le(e,t,s){return[`<option value="all"${t==="all"?" selected":""}>${y(s)}</option>`,...e.map(a=>`<option value="${y(a)}"${t===a?" selected":""}>${y(a)}</option>`)].join("")}function mt(){it.innerHTML=`
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#" aria-label="Clair, accueil">
          <span class="brand-mark">c.</span>
          <span class="brand-name">clair<span>.</span></span>
        </a>
        <div class="side-label">VOTRE ESPACE</div>
        <nav class="sidebar-navigation" aria-label="Tableaux de bord">
          <button class="nav-link active" type="button" aria-current="page">
            <span class="nav-icon">◫</span> Vue d’ensemble
          </button>
        </nav>
        <div class="sidebar-bottom">
          <span class="privacy-icon">◉</span>
          <p>Vos données restent privées.<br />Le fichier est lu sur cet appareil.</p>
        </div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div class="breadcrumb">Votre foyer <span>/</span> Vue d’ensemble</div>
          <span class="local-badge"><i></i> 100 % local</span>
        </header>
        <section class="welcome">
          <div class="eyebrow">LE BUDGET, EN CLAIR</div>
          <h1>Bonjour, votre budget<br />prend forme ici.</h1>
          <p class="welcome-copy">Importez votre fichier Excel mensuel pour comprendre vos dépenses, suivre vos revenus et voir les tendances de votre foyer.</p>
          <div class="dropzone" id="dropzone">
            <div class="upload-icon">↑</div>
            <h2>Déposez votre fichier ici</h2>
            <p>Votre fichier Excel est analysé directement dans votre navigateur.</p>
            <label class="button button-primary" for="file-input">Choisir un fichier Excel</label>
            <input id="file-input" type="file" accept=".xlsx,.xlsm" hidden />
            <div class="file-hint">Formats acceptés : .xlsx, .xlsm (convertissez les fichiers .xls en .xlsx)</div>
          </div>
          <div class="how-it-works">
            <div><span class="step-number">01</span><strong>Importez</strong><small>Votre classeur habituel</small></div>
            <div><span class="step-number">02</span><strong>Explorez</strong><small>Les tendances en un clin d’œil</small></div>
            <div><span class="step-number">03</span><strong>Gardez la main</strong><small>Aucune donnée envoyée en ligne</small></div>
          </div>
        </section>
        <div class="toast-slot" id="toast-slot" aria-live="polite"></div>
      </main>
    </div>`,ft()}function j(){var ce,me,ve,Ce,fe;const e=je.find(n=>n.id===i.dashboard),t=(e==null?void 0:e.id)==="issues",s=(e==null?void 0:e.id)==="tr",a=(e==null?void 0:e.id)==="works",r=(e==null?void 0:e.id)==="daily",o=a||r,c=(e==null?void 0:e.label)??"Vue d’ensemble",u=[...new Set(ae().map(n=>n.date.getUTCFullYear()))].sort((n,h)=>h-n);i.year!=="all"&&!u.includes(Number(i.year))&&(i.year="all");const l=dt(),v=ut(l),m=Ht(l),d=e&&["tr","summeria","cacf"].includes(e.id)?Object.fromEntries(Object.keys(Ue(e.id)).map(Number).filter(Number.isInteger).map(n=>[n,ze(e.id,String(n))])):{},f=e&&!t&&!o?We(ae(),i.year,d):null,b=e&&!t&&!o?i.year==="all"?f:We(ae(),"all",d):null,x=(b==null?void 0:b.months)??[],g=x.length?x[x.length-1].bankBalance:null,$=e?Yt(e.id):null,w=$??((e==null?void 0:e.id)==="cperso"?null:g),M=i.transactions.filter(n=>i.year==="all"||n.date.getUTCFullYear()===Number(i.year)),k=Zt(M),N=t?l.length:0,E=Je(l,n=>n.category),F=Je(l,n=>n.account),S=o?Ge(l,i.year):null,Y=o?Qt(l,n=>n.shop||n.memo):[],J=a?F.map(n=>({...n,...Ge(l.filter(h=>h.account===n.label),i.year)})):[],le=o?[...l].sort((n,h)=>Math.abs(h.amount)-Math.abs(n.amount)).slice(0,5):[],R=[...new Set(ae().map(n=>n.category).filter(Boolean))].sort((n,h)=>n.localeCompare(h,"fr")),xe=[...new Set(ae().map(n=>n.account).filter(Boolean))].sort((n,h)=>n.localeCompare(h,"fr")),$e=ae().length,ue=Math.max(1,Math.ceil(l.length/i.pageSize));i.page=Math.min(i.page,ue);const ke=l.slice((i.page-1)*i.pageSize,i.page*i.pageSize),H=i.category!=="all"||i.account!=="all"||i.type!=="all"||i.search,I=i.year==="all"?"Toutes les années":String(i.year),te=i.year==="all"?String(u[0]??new Date().getFullYear()):i.year,L=e?ze(e.id,te):null,oe=n=>n==="alexandre"?"Alexandre":"Kelly",ie=k.find(n=>n.id==="cperso"),q=k.filter(n=>n.kind==="shared").reduce((n,h)=>(h.amount>0&&(n[h.owes]+=h.amount),n),{alexandre:0,kelly:0}),we=(t?[]:e?k.filter(n=>n.id===e.id):k).map(n=>{const h=n.kind==="private",T=n.amount,G=h?oe(n.owedTo):`le compte commun ${n.accountLabel}`,he=T>0?`${oe(n.owes)} doit verser ${p(T,!0)} à ${G}${h?" (règlement privé)":""}`:"Aucun remboursement à effectuer sur cette période.",Te=h?`Alexandre a payé ${p(n.paid.alexandre,!0)} · Kelly a payé ${p(n.paid.kelly,!0)}${n.alreadyShared.alexandre+n.alreadyShared.kelly>0?` · déjà partagé à 50/50 : ${p(n.alreadyShared.alexandre+n.alreadyShared.kelly,!0)}`:""}`:`Contributions personnelles : Alexandre ${p(n.contributions.alexandre,!0)} · Kelly ${p(n.contributions.kelly,!0)} · revenus communs ${p(n.sharedIncome,!0)} · dépenses communes ${p(n.sharedExpenses,!0)}`;return`<article class="settlement-card">
      <span class="settlement-title">${h?"Dépenses personnelles partagées · C Perso":`Contribution au compte commun · ${y(n.accountLabel)}`}</span>
      ${h?`<div class="settlement-people"><span>🤵‍♂️ Alexandre a payé <strong>${p(n.paid.alexandre,!0)}</strong></span><span>👰‍♀️ Kelly a payé <strong>${p(n.paid.kelly,!0)}</strong></span></div>`:""}
      <p class="settlement-result">${he}</p>
      <small>${Te}${h?"":" · Le versement est destiné au compte commun."}</small>
    </article>`}).join(""),ne=S?`
    <section class="expense-analysis" aria-label="${a?"Analyse des dépenses de travaux":"Analyse des dépenses du quotidien"}">
      <div class="expense-monthly-panel panel">
        <div class="panel-heading"><div><h2>Suivi des dépenses mois par mois</h2><p>Total dépensé et parts calculées selon les règles de répartition existantes</p></div></div>
        <div class="expense-monthly-chart">
          ${S.months.map(n=>{const h=Math.max(1,...S.months.map(he=>he.total)),T=n.total?Math.max(2,n.total/h*100):0,G=i.year==="all"?`${Ae[n.month]} ${n.year}`:Ae[n.month];return`<div class="expense-month-column">
              <span class="expense-month-total">${n.total?y(p(n.total)):""}</span>
              <div class="expense-month-track"><span class="expense-month-bar" title="${y(`${P[n.month]} ${n.year} · Total : ${p(n.total,!0)} · Alexandre : ${p(n.alexandre,!0)} · Kelly : ${p(n.kelly,!0)}${n.unallocated?` · Non attribué : ${p(n.unallocated,!0)}`:""}`)}" aria-label="${y(`${P[n.month]} ${n.year} : ${p(n.total,!0)}`)}" style="height:${T}%"></span></div>
              <span class="expense-month-label">${y(G)}</span>
            </div>`}).join("")}
        </div>
        <div class="table-wrap expense-monthly-table-wrap">
          <table class="expense-monthly-table">
            <thead><tr><th>Mois</th><th>Dépenses</th><th>Part Alexandre</th><th>Part Kelly</th>${S.unallocated?"<th>Non attribué</th>":""}<th>Opérations</th></tr></thead>
            <tbody>${S.months.map(n=>`<tr>
              <th scope="row">${y(i.year==="all"?`${P[n.month]} ${n.year}`:P[n.month])}</th>
              <td>${p(n.total,!0)}</td>
              <td>${p(n.alexandre,!0)}</td>
              <td>${p(n.kelly,!0)}</td>
              ${S.unallocated?`<td>${p(n.unallocated,!0)}</td>`:""}
              <td>${D.format(n.count)}</td>
            </tr>`).join("")}</tbody>
            <tfoot><tr><th scope="row">Total</th><td>${p(S.total,!0)}</td><td>${p(S.alexandre,!0)}</td><td>${p(S.kelly,!0)}</td>${S.unallocated?`<td>${p(S.unallocated,!0)}</td>`:""}<td>${D.format(l.length)}</td></tr></tfoot>
          </table>
        </div>
        ${S.unallocated?`<p class="allocation-note">La part « Non attribué » n’est pas incluse dans les parts individuelles. ${D.format(l.filter(n=>!ee(n)).length)} opération(s) n’ont pas de règle de répartition reconnue.</p>`:""}
      </div>
      <div class="expense-analysis-grid">
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Plus grosses dépenses</h2><p>Les opérations les plus élevées de la période</p></div></div>
          ${le.length?`<div class="expense-ranking-list">${le.map((n,h)=>{const T=Ye(n);return`<div class="expense-ranking-item">
              <span class="account-rank">${String(h+1).padStart(2,"0")}</span>
              <div class="expense-ranking-copy"><strong>${y(n.shop||n.memo||n.category||"Dépense")}</strong><small>${y(Ke(n.date))} · ${y(n.account||"Compte non renseigné")} · ${y(n.category||"Sans catégorie")}</small></div>
              <strong class="expense-ranking-amount">${p(Math.abs(n.amount),!0)}</strong>
              <small class="expense-ranking-share">${T.alexandre===null?"Parts à vérifier":`A. ${p(T.alexandre,!0)} · K. ${p(T.kelly,!0)}`}</small>
            </div>`}).join("")}</div>`:'<div class="chart-empty">Aucune dépense sur cette période.</div>'}
        </article>
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>${a?"Magasins les plus utilisés":"Marchands les plus fréquents"}</h2><p>Tri par nombre d’achats · montant total à droite</p></div></div>
          ${Y.length?`<div class="expense-merchant-list">${Y.slice(0,8).map((n,h)=>`
            <div class="expense-merchant-item">
              <span class="account-rank">${String(h+1).padStart(2,"0")}</span>
              <div class="expense-ranking-copy"><strong>${y(n.label)}</strong><small>${D.format(n.count)} achat${n.count>1?"s":""}</small><span class="bar-track"><span class="category-bar bar-${h%6}" style="width:${Math.max(3,n.count/Y[0].count*100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${p(n.total,!0)}</strong>
            </div>`).join("")}</div>`:'<div class="chart-empty">Aucun marchand renseigné sur cette période.</div>'}
        </article>
        <article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Répartition par catégorie</h2><p>Pour repérer les principaux postes de dépenses</p></div></div>
          ${E.length?`<div class="expense-merchant-list">${E.slice(0,8).map((n,h)=>`
            <div class="expense-merchant-item">
              <span class="account-rank">${String(h+1).padStart(2,"0")}</span>
              <div class="expense-ranking-copy"><strong>${y(n.label)}</strong><span class="bar-track"><span class="category-bar bar-${h%6}" style="width:${Math.max(3,n.total/E[0].total*100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${p(n.total,!0)}</strong>
            </div>`).join("")}</div>`:'<div class="chart-empty">Aucune catégorie sur cette période.</div>'}
        </article>
        ${a?`<article class="panel expense-ranking-panel">
          <div class="panel-heading"><div><h2>Dépenses par compte</h2><p>Comptes utilisés pour ces achats</p></div></div>
          ${J.length?`<div class="expense-merchant-list">${J.slice(0,8).map((n,h)=>`
            <div class="expense-merchant-item">
              <span class="account-rank">${String(h+1).padStart(2,"0")}</span>
              <div class="expense-ranking-copy"><strong>${y(n.label)}</strong><small>Alexandre ${p(n.alexandre,!0)} · Kelly ${p(n.kelly,!0)}</small><span class="bar-track"><span class="category-bar bar-${h%6}" style="width:${Math.max(3,n.total/F[0].total*100)}%"></span></span></div>
              <strong class="expense-ranking-amount">${p(n.total,!0)}</strong>
            </div>`).join("")}</div>`:'<div class="chart-empty">Aucun compte renseigné sur cette période.</div>'}
        </article>`:""}
      </div>
      <p class="allocation-note expense-budget-note">La moyenne mensuelle (${D.format(S.activeMonthCount)} mois avec dépenses) est un repère de budget basé sur vos données, pas une limite budgétaire personnalisée. Comparez les catégories et les marchands pour choisir où réduire vos dépenses.</p>
    </section>`:"",pe=!e&&!t?`
    <div class="settlement-summary-grid">
      <article class="settlement-card">
        <span class="settlement-title">Règlements privés · C Perso</span>
        <p class="settlement-result">${ie.amount>0?`${oe(ie.owes)} doit ${p(ie.amount,!0)} à ${oe(ie.owedTo)}`:"Aucune dette privée à régler."}</p>
        <small>Ce règlement se fait entre les personnes, en dehors des comptes communs.</small>
      </article>
      <article class="settlement-card">
        <span class="settlement-title">Versements à faire sur les comptes communs</span>
        <p class="settlement-result">${q.alexandre||q.kelly?`Alexandre : ${p(q.alexandre,!0)} · Kelly : ${p(q.kelly,!0)}`:"Aucun rééquilibrage à verser."}</p>
        <small>Montants à verser sur les comptes communs concernés ; ils ne sont pas des paiements privés entre vous.</small>
      </article>
    </div>`:"";it.innerHTML=`
    <div class="app-shell">
      <aside class="sidebar">
        <a class="brand" href="#" aria-label="Clair, accueil">
          <span class="brand-mark">c.</span><span class="brand-name">clair<span>.</span></span>
        </a>
        <div class="side-label">VOTRE ESPACE</div>
        <nav class="sidebar-navigation" aria-label="Tableaux de bord">
          <button class="nav-link${i.dashboard==="overview"?" active":""}" type="button" data-dashboard="overview"${i.dashboard==="overview"?' aria-current="page"':""}>
            <span class="nav-icon">◫</span> Vue d’ensemble
          </button>
          ${je.map(n=>`
            <button class="nav-link${i.dashboard===n.id?" active":""}" type="button" data-dashboard="${n.id}"${i.dashboard===n.id?' aria-current="page"':""}>
              <span class="nav-icon">${n.id==="tr"?"↗":n.id==="summeria"?"◌":n.id==="cacf"?"▤":n.id==="issues"?"!":n.id==="works"?"⌂":n.id==="daily"?"◷":"○"}</span> ${y(n.label)}
            </button>`).join("")}
        </nav>
        <div class="side-label side-label-period">PÉRIODE</div>
        <label class="side-select-label" for="year-filter">Année</label>
        <select id="year-filter" class="side-select">
          ${Le(u.map(String),i.year,"Toutes les années")}
        </select>
        <div class="sidebar-bottom">
          <span class="privacy-icon">◉</span>
          <p>Données privées, traitées<br />uniquement sur cet appareil.</p>
          <button class="text-button" id="change-file" type="button">Changer de fichier</button>
        </div>
      </aside>
      <main class="main-content dashboard">
        <header class="topbar">
          <div class="breadcrumb">Votre foyer <span>/</span> ${y(c)} <span>/</span> ${y(I)}</div>
          <div class="topbar-actions"><span class="local-badge"><i></i> 100 % local</span>
          <label class="button button-small" for="file-input">Importer un fichier</label>
          <input id="file-input" type="file" accept=".xlsx,.xlsm" hidden /></div>
        </header>
        <div class="dashboard-heading">
          <div>
            <div class="eyebrow">${y(c.toUpperCase())} · ${y(I.toUpperCase())}</div>
            <h1>${y(c)}</h1>
            <p class="subtitle">${t?"Transactions dont la répartition automatique reste à contrôler.":a?"Suivez le coût des travaux, les parts de chacun et les comptes utilisés.":r?"Comprenez vos habitudes de dépenses et trouvez des pistes pour mieux budgétiser.":e?"Revenus et dépenses de ce compte.":"Vos finances, sans détour."}</p>
          </div>
          <div class="file-chip"><span class="file-chip-icon">▤</span><span><strong>${y(i.fileName)}</strong><small>${D.format($e)} ${t?"opérations à vérifier":"transactions chargées"}</small></span></div>
        </div>
        <section class="kpi-grid" aria-label="Indicateurs clés">
          <article class="kpi-card">
            <div class="kpi-label">${o?"Dépenses suivies":t?"Revenus à vérifier":"Revenus"}</div><div class="kpi-value">${p(o?S.total:v.income)}</div>
            <div class="kpi-foot"><span class="tiny-dot dot-green"></span> ${o?"Dépenses de la période":t?"Sans règle de répartition":e?"Revenus de ce compte":"Toutes sources confondues"}</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">${o?"Part d’Alexandre":t?"Dépenses à vérifier":"Dépenses courantes"}</div><div class="kpi-value">${p(o?S.alexandre:v.expenses)}</div>
            <div class="kpi-foot"><span class="tiny-dot dot-orange"></span> ${o?"Selon la répartition définie":t?"Sans règle de répartition":(e==null?void 0:e.id)==="cperso"?"Dépenses personnelles":"Hors transferts entre comptes"}</div>
          </article>
          <article class="kpi-card kpi-highlight">
            <div class="kpi-label">${o?"Part de Kelly":t?"Opérations à vérifier":"Solde net"}</div><div class="kpi-value">${o?p(S.kelly):t?D.format(N):p(v.balance)}</div>
            <div class="kpi-foot"><span class="tiny-dot ${o?"dot-green":t?"dot-orange":v.balance>=0?"dot-green":"dot-red"}"></span> ${o?"Selon la répartition définie":t?"Sur la période sélectionnée":"Revenus moins dépenses courantes"}</div>
          </article>
          <article class="kpi-card">
            <div class="kpi-label">${o?"Moyenne mensuelle":t?"Montant concerné":"Épargne estimée"}</div><div class="kpi-value">${o?p(S.average):t?p(v.expenses):v.income>0?`${Math.round(v.balance/v.income*100)} %`:"—"}</div>
            <div class="kpi-foot">${o?`Sur ${D.format(S.activeMonthCount)} mois avec dépenses`:t?"Dépenses non classées":"Solde net rapporté aux revenus"}</div>
          </article>
        </section>
        ${ne}
        ${e&&!t&&!o?`
          <section class="panel current-balance-panel" aria-label="Argent disponible sur le compte">
            <div class="current-balance-copy">
              <span class="allocation-label">Argent disponible actuellement · ${y(c)}</span>
              <strong>${w===null?"À renseigner":p(w,!0)}</strong>
              <small>${$!==null?"Solde réel saisi par vous":e.id==="cperso"?"Renseignez le solde de vos comptes C Perso ; les dépenses seules ne permettent pas de le calculer.":"Estimation calculée depuis les soldes d’ouverture et les mouvements importés. Vous pouvez saisir le solde réel pour remplacer l’estimation."}</small>
            </div>
            <label class="current-balance-input">Solde réel du compte
              <span><input type="number" step="0.01" inputmode="decimal" data-current-balance value="${$===null?"":$.toFixed(2)}" placeholder="${w===null?"Montant":w.toFixed(2)}" aria-label="Solde réel disponible actuellement" /> €</span>
            </label>
          </section>`:""}
        ${s?`
          <section class="panel tr-expense-summary" aria-label="Détail des dépenses Trade Republic">
            <div class="panel-heading"><div><h2>Placements et dépenses réelles</h2><p>Sur la période sélectionnée et les filtres actifs</p></div></div>
            <div class="tr-expense-breakdown">
              <div><span>Total des débits</span><strong>${p(v.expenses,!0)}</strong></div>
              <div><span>Saveback offert par la banque</span><strong>${p(v.savebackExpenses,!0)}</strong></div>
              <div><span>Dépenses sans Saveback</span><strong>${p(v.expensesWithoutSaveback,!0)}</strong></div>
              <div><span>⁉️ Plans d’épargne investis</span><strong>${p(v.investments,!0)}</strong></div>
              <div class="tr-final-expenses"><span>Dépenses finales · hors placements</span><strong>${p(v.finalExpenses,!0)}</strong></div>
            </div>
            <p class="allocation-note">Le Saveback est affiché dans les débits mais compensé par le revenu Saveback du même mois. Les plans d’épargne sont des investissements, pas des dépenses de consommation ; leur total est ventilé par mois et par cagnotte ci-dessous.</p>
          </section>`:""}
        <section class="allocation-section" aria-label="Répartition des cagnottes"${t||o?" hidden":""}>
          <div class="allocation-heading">
            <div><h2>Cagnottes estimées</h2><p>Répartition par catégorie sur la période sélectionnée</p></div>
          </div>
          <div class="allocation-grid">
            <article class="allocation-card">
              <span class="allocation-label">🤵‍♂️ Alexandre · total estimé</span>
              <strong>${p(m.alexandre)}</strong>
              <small>Personnel : ${p(m.alexandrePersonal)} · part du commun : ${p(m.sharedBalance/2)}</small>
            </article>
            <article class="allocation-card">
              <span class="allocation-label">👰‍♀️ Kelly · total estimé</span>
              <strong>${p(m.kelly)}</strong>
              <small>Personnel : ${p(m.kellyPersonal)} · part du commun : ${p(m.sharedBalance/2)}</small>
            </article>
            <article class="allocation-card allocation-shared">
              <span class="allocation-label">💑 Pot commun · total</span>
              <strong>${p(m.sharedBalance)}</strong>
              <small>Revenus : ${p(m.sharedIncome)} · dépenses : ${p(m.sharedExpenses)}</small>
            </article>
          </div>
          <p class="allocation-note">La part commune est répartie à 50/50. ${D.format(m.unclassifiedCount)} opération${m.unclassifiedCount>1?"s":""} sans catégorie reconnue ne sont pas incluses (revenus : ${p(m.unclassifiedIncome)} · dépenses : ${p(m.unclassifiedExpenses)}).</p>
        </section>
        ${f?`
          <section class="panel pot-ledger-panel" aria-label="Suivi mensuel des cagnottes">
            <div class="panel-heading">
              <div><h2>Suivi mensuel des cagnottes</h2><p>Flux du mois et solde reporté au mois suivant${i.year==="all"?" · toutes les périodes":` · ${y(I)}`}</p></div>
            </div>
            ${["tr","summeria","cacf"].includes(e.id)?`
              <div class="opening-balance-editor">
                <div class="opening-balance-heading">
                  <div><strong>Solde d’ouverture au 1er janvier ${Number(te)}</strong><small>Reprise des soldes bancaires au 31 décembre ${Number(te)-1}</small></div>
                  <span>Enregistré sur cet appareil</span>
                </div>
                <div class="opening-balance-fields">
                  <label>Argent réellement sur le compte
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="bank" value="${L.bank.toFixed(2)}" aria-label="Solde bancaire au début de l’année" /> €</span>
                  </label>
                  <label>Part d’Alexandre
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="alexandre" value="${L.alexandre.toFixed(2)}" aria-label="Solde d’ouverture d’Alexandre" /> €</span>
                  </label>
                  <label>Part de Kelly
                    <span><input type="number" step="0.01" inputmode="decimal" data-opening-balance="kelly" value="${L.kelly.toFixed(2)}" aria-label="Solde d’ouverture de Kelly" /> €</span>
                  </label>
                  <div class="opening-balance-shared"><span>Part commune calculée</span><strong>${p(L.bank-L.alexandre-L.kelly,!0)}</strong></div>
                </div>
                <p>Les soldes d’Alexandre, Kelly et la part commune calculée servent de point de départ aux soldes mensuels de cette année. Vos valeurs restent enregistrées dans ce navigateur.</p>
              </div>`:""}
            ${f.months.length?`
              <div class="table-wrap pot-ledger-wrap">
                <table class="pot-ledger-table">
                  <thead>
                    <tr><th rowspan="2">Mois</th><th colspan="3">🤵‍♂️ Alexandre</th><th colspan="3">👰‍♀️ Kelly</th><th colspan="3">💑 50/50</th></tr>
                    <tr><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th><th>Revenus</th><th>Dépenses</th><th>Reste fin de mois</th></tr>
                  </thead>
                  <tbody>${f.months.map(n=>{const h=i.year==="all"?`${P[n.month]} ${n.year}`:P[n.month],T=G=>G?p(G,!0):"—";return`<tr>
                      <th scope="row">${y(h)}</th>
                      <td class="amount-col positive">${T(n.movement.alexandre.income)}</td>
                      <td class="amount-col">${T(n.movement.alexandre.expenses)}</td>
                      <td class="amount-col pot-balance">${p(n.balances.alexandre,!0)}</td>
                      <td class="amount-col positive">${T(n.movement.kelly.income)}</td>
                      <td class="amount-col">${T(n.movement.kelly.expenses)}</td>
                      <td class="amount-col pot-balance">${p(n.balances.kelly,!0)}</td>
                      <td class="amount-col positive">${T(n.movement.shared.income)}</td>
                      <td class="amount-col">${T(n.movement.shared.expenses)}</td>
                      <td class="amount-col pot-balance">${p(n.balances.shared,!0)}</td>
                    </tr>`}).join("")}</tbody>
                </table>
              </div>
              <p class="allocation-note">Soldes cumulés depuis la première opération du compte dans le fichier (départ à 0 €) ; les mois précédant l’année sélectionnée sont inclus dans le report. Les opérations non classées ne sont pas comptées${f.unclassifiedCount?` (${D.format(f.unclassifiedCount)} sur la période affichée)`:""}.${e.id==="cperso"?" Sur C Perso, le solde 50/50 est un cumul comptable des dépenses partagées, pas le solde d’un compte bancaire.":""}</p>
            `:'<div class="chart-empty">Aucune opération classée pour calculer les cagnottes de ce compte.</div>'}
          </section>`:""}
        ${t?`
          <section class="panel issue-summary-panel" aria-label="Opérations à vérifier">
            <div class="panel-heading"><div><h2>Pourquoi ces opérations apparaissent-elles ici ?</h2><p>${D.format(N)} opération${N>1?"s":""} sans règle connue pour l’attribuer à une cagnotte.</p></div></div>
            <p>Vérifiez le compte, la catégorie et le mémo dans le tableau ci-dessous. Les ajustements « Déjà remboursée » et les transferts internes sont volontairement exclus.</p>
          </section>`:""}
        <section class="settlement-section" aria-label="Équilibre des dépenses"${t||o?" hidden":""}>
          <div class="allocation-heading">
            <div><h2>${e?"Remboursement du compte":"Récapitulatif des remboursements"}</h2><p>Calculs sur ${y(I.toLowerCase())}, selon le compte payeur</p></div>
          </div>
          ${pe}
          <div class="settlement-grid">${we}</div>
        </section>
        <section class="primary-grid"${t||o?" hidden":""}>
          <article class="panel trend-panel">
            <div class="panel-heading">
              <div><h2>Revenus & dépenses</h2><p>${i.year==="all"?"Cumul par mois · toutes périodes":`Évolution mensuelle · ${y(I)}`}</p></div>
              <div class="legend"><span><i class="legend-income"></i> Revenus</span><span><i class="legend-expense"></i> ${s?"Dépenses finales":"Dépenses"}</span>${s?'<span><i class="legend-investment"></i> Placements</span>':""}</div>
            </div>
            <div class="chart-wrap"><canvas id="trend-chart" role="img" aria-label="Graphique mensuel des revenus et dépenses"></canvas><div class="chart-tooltip" id="chart-tooltip" role="status" hidden></div></div>
          </article>
          <article class="panel category-panel">
            <div class="panel-heading"><div><h2>Où va votre argent ?</h2><p>Répartition par catégorie</p></div></div>
            <div class="category-list">
              ${E.length?E.slice(0,6).map((n,h)=>`
                <div class="category-item">
                  <div class="category-row"><span class="category-name">${y(n.label)}</span><strong>${p(n.total)}</strong></div>
                  <div class="bar-track"><span class="category-bar bar-${h%6}" title="${y(n.label)} : ${y(p(n.total,!0))}" aria-label="${y(n.label)} : ${y(p(n.total,!0))}" style="width:${Math.max(3,n.total/E[0].total*100)}%"></span></div>
                </div>`).join(""):'<div class="chart-empty">Aucune dépense sur cette période.</div>'}
            </div>
            ${E.length>6?`<div class="chart-footnote">+ ${E.length-6} autres catégories</div>`:""}
          </article>
        </section>
        <section class="secondary-grid"${t||o?" hidden":""}>
          <article class="panel monthly-panel">
            <div class="panel-heading"><div><h2>Votre rythme sur l’année</h2><p>${s?"Revenus, dépenses finales et placements par mois":i.year==="all"?"Cumul par mois · toutes périodes":"Solde mensuel · revenus moins dépenses courantes"}</p></div></div>
            <div class="monthly-bars">
              ${v.monthly.map(n=>{const h=s?n.expenses-n.investments:n.expenses,T=Math.max(1,...v.monthly.map(ge=>Math.max(ge.income,s?ge.expenses-ge.investments:ge.expenses,s?ge.investments:0))),G=Math.max(n.income>0?2:0,n.income/T*100),he=Math.max(h>0?2:0,h/T*100),Te=Math.max(n.investments>0?2:0,n.investments/T*100);return`<div class="month-col" title="${P[n.month]} : ${p(n.income-n.expenses,!0)}">
                  <div class="month-bar-area"><span class="month-bar income-bar" title="${P[n.month]} · Revenus : ${y(p(n.income,!0))}" aria-label="${P[n.month]} · Revenus : ${y(p(n.income,!0))}" style="height:${G}%"></span><span class="month-bar expense-bar" title="${P[n.month]} · ${s?"Dépenses finales":"Dépenses"} : ${y(p(h,!0))}" aria-label="${P[n.month]} · ${s?"Dépenses finales":"Dépenses"} : ${y(p(h,!0))}" style="height:${he}%"></span>${s?`<span class="month-bar investment-bar" title="${P[n.month]} · Plans d’épargne : ${y(p(n.investments,!0))}" aria-label="${P[n.month]} · Plans d’épargne : ${y(p(n.investments,!0))}" style="height:${Te}%"></span>`:""}</div>
                  <span class="month-label">${Ae[n.month]}</span>
                </div>`}).join("")}
            </div>
            ${s?`
              <div class="table-wrap monthly-investments-wrap">
                <table class="monthly-investments-table">
                  <thead><tr><th>Mois</th><th>💑 Couple</th><th>🤵‍♂️ Alexandre</th><th>👰‍♀️ Kelly</th><th>Total investi</th></tr></thead>
                  <tbody>${v.monthly.map(n=>`<tr>
                    <th scope="row">${P[n.month]}</th>
                    <td>${p(n.investmentByPot.shared,!0)}</td>
                    <td>${p(n.investmentByPot.alexandre,!0)}</td>
                    <td>${p(n.investmentByPot.kelly,!0)}</td>
                    <td><strong>${p(n.investments,!0)}</strong></td>
                  </tr>`).join("")}</tbody>
                  <tfoot><tr><th>Total</th><td>${p(v.monthly.reduce((n,h)=>n+h.investmentByPot.shared,0),!0)}</td><td>${p(v.monthly.reduce((n,h)=>n+h.investmentByPot.alexandre,0),!0)}</td><td>${p(v.monthly.reduce((n,h)=>n+h.investmentByPot.kelly,0),!0)}</td><td><strong>${p(v.investments,!0)}</strong></td></tr></tfoot>
                </table>
              </div>`:""}
          </article>
          <article class="panel accounts-panel">
            <div class="panel-heading"><div><h2>Dépenses par compte</h2><p>Les comptes qui contribuent le plus</p></div></div>
            <div class="account-list">
              ${F.length?F.slice(0,5).map((n,h)=>`
                <div class="account-item"><span class="account-rank">${String(h+1).padStart(2,"0")}</span>
                  <span class="account-name">${y(n.label)}</span><strong>${p(n.total)}</strong></div>`).join(""):'<div class="chart-empty">Aucune dépense sur cette période.</div>'}
            </div>
          </article>
        </section>
        <section class="panel transactions-panel">
          <div class="panel-heading transactions-heading">
            <div><h2>Transactions</h2><p>${D.format(l.length)} opérations${H?" · filtres actifs":""}</p></div>
            <button class="text-button clear-filters" id="clear-filters" type="button"${H?"":" hidden"}>Effacer les filtres</button>
          </div>
          <div class="filters">
            <label class="search-wrap"><span aria-hidden="true">⌕</span><input id="search-filter" type="search" placeholder="Rechercher un marchand, un mémo…" value="${y(i.search)}" /></label>
            <select id="type-filter" aria-label="Filtrer par type">
              <option value="all"${i.type==="all"?" selected":""}>Tous les types</option>
              <option value="income"${i.type==="income"?" selected":""}>Revenus</option>
              <option value="expense"${i.type==="expense"?" selected":""}>Dépenses</option>
            </select>
            <select id="category-filter" aria-label="Filtrer par catégorie">${Le(R,i.category,"Toutes les catégories")}</select>
            <select id="account-filter" aria-label="Filtrer par compte">${Le(xe,i.account,"Tous les comptes")}</select>
          </div>
          ${l.length?`
            <div class="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Type</th>${t?"<th>Problème détecté</th>":""}<th>Catégorie</th><th>Libellé</th><th>Compte</th><th>Projet</th><th>Liée à</th><th class="amount-col">Part Alexandre</th><th class="amount-col">Part Kelly</th><th>Règlement estimé</th><th class="amount-col">Déjà remboursée</th><th class="amount-col">Montant</th></tr></thead>
                <tbody>${ke.map(n=>{const h=Ye(n);return`
                  <tr class="${n.reimbursementOnly?"reimbursement-row":""}">
                    <td class="date-cell">${Ke(n.date)}</td>
                    <td><span class="type-pill ${n.reimbursementOnly?"type-reimbursement":n.type==="income"?"type-income":"type-expense"}">${n.reimbursementOnly?"Déjà remboursée":n.type==="income"?"Revenu":"Dépense"}</span></td>
                    ${t?`<td class="issue-reason">${y(pt(n))}</td>`:""}
                    <td><span class="category-pill">${y(n.category||(n.type==="income"?"Revenu":"Dépense"))}</span></td>
                    <td><strong class="transaction-title">${y(n.shop||n.memo||"—")}</strong>${n.shop&&n.memo?`<small class="transaction-memo">${y(n.memo)}</small>`:""}</td>
                    <td class="muted-cell">${y(n.account||"—")}</td>
                    <td class="muted-cell">${y(n.project||"—")}</td>
                    <td>${y(h.linked)}</td>
                    <td class="amount-col">${h.alexandre===null?"—":p(h.alexandre,!0)}</td>
                    <td class="amount-col">${h.kelly===null?"—":p(h.kelly,!0)}</td>
                    <td>${y(h.settlement)}</td>
                    <td class="amount-col">${n.reimbursed?p(-n.reimbursed,!0):"—"}</td>
                    <td class="amount-col ${n.type==="income"?"positive":""}">${n.reimbursementOnly?"—":p(n.amount,!0)}</td>
                  </tr>`}).join("")}</tbody>
              </table>
            </div>
            <div class="pagination"><span>Affichage de ${(i.page-1)*i.pageSize+1}–${Math.min(i.page*i.pageSize,l.length)} sur ${D.format(l.length)}</span>
              <div><label for="page-size">Lignes</label><select id="page-size" aria-label="Transactions par page">${[10,25,50].map(n=>`<option value="${n}"${i.pageSize===n?" selected":""}>${n}</option>`).join("")}</select><button id="previous-page" type="button" aria-label="Page précédente" ${i.page<=1?"disabled":""}>←</button><span>${i.page} / ${ue}</span><button id="next-page" type="button" aria-label="Page suivante" ${i.page>=ue?"disabled":""}>→</button></div></div>
          `:'<div class="no-results"><span>⌕</span><strong>Aucune transaction trouvée</strong><p>Essayez un autre mot-clé ou modifiez vos filtres.</p></div>'}
        </section>
        <footer class="dashboard-footer">
          <span>Analyse locale · ${D.format($e)} transactions · ${D.format(i.duplicateCount)} doublons de feuilles annexes écartés</span>
          ${v.transfers>0?`<span>${p(v.transfers)} de transferts exclus des dépenses courantes</span>`:""}
        </footer>
        <div class="toast-slot" id="toast-slot" aria-live="polite"></div>
      </main>
    </div>`,vt(v.monthly,s),ft(),document.querySelectorAll("[data-dashboard]").forEach(n=>{n.addEventListener("click",()=>{i.dashboard=n.dataset.dashboard,i.account="all",i.category="all",i.type="all",i.search="",i.page=1,j()})}),document.querySelector("#year-filter").addEventListener("change",n=>{i.year=n.target.value,i.page=1,j()}),document.querySelectorAll("[data-opening-balance]").forEach(n=>{n.addEventListener("change",h=>{try{if(!Wt(e.id,te,h.target.dataset.openingBalance,h.target.value)){se("Saisissez un montant valide pour le solde d’ouverture.");return}j()}catch{se("Les soldes d’ouverture n’ont pas pu être enregistrés dans ce navigateur.")}})}),(ce=document.querySelector("[data-current-balance]"))==null||ce.addEventListener("change",n=>{try{if(!Jt(e.id,n.target.value)){se("Saisissez un montant valide pour le solde actuel.");return}j()}catch{se("Le solde actuel n’a pas pu être enregistré dans ce navigateur.")}}),document.querySelector("#type-filter").addEventListener("change",n=>{i.type=n.target.value,i.page=1,j()}),document.querySelector("#category-filter").addEventListener("change",n=>{i.category=n.target.value,i.page=1,j()}),document.querySelector("#account-filter").addEventListener("change",n=>{i.account=n.target.value,i.page=1,j()}),document.querySelector("#search-filter").addEventListener("input",n=>{const h=n.target.selectionStart;i.search=n.target.value,i.page=1,j();const T=document.querySelector("#search-filter");T.focus(),T.setSelectionRange(h,h)}),(me=document.querySelector("#clear-filters"))==null||me.addEventListener("click",()=>{i.category="all",i.account="all",i.type="all",i.search="",i.page=1,j()}),(ve=document.querySelector("#previous-page"))==null||ve.addEventListener("click",()=>{i.page-=1,j()}),(Ce=document.querySelector("#next-page"))==null||Ce.addEventListener("click",()=>{i.page+=1,j()}),(fe=document.querySelector("#page-size"))==null||fe.addEventListener("change",n=>{i.pageSize=Number(n.target.value),i.page=1,j()}),document.querySelector("#change-file").addEventListener("click",_t)}function vt(e,t=!1){const s=document.querySelector("#trend-chart");if(!s)return;const a=s.getContext("2d"),r=s.clientWidth,o=s.clientHeight,c=window.devicePixelRatio||1;s.width=r*c,s.height=o*c,a.scale(c,c),a.clearRect(0,0,r,o);const u=r-18,l=o-31,v=8,m=8,d=Math.max(1,...e.map(g=>Math.max(g.income,t?g.expenses-g.investments:g.expenses,t?g.investments:0))),f=u/12,b=Math.min(t?8:12,f*(t?.19:.26)),x=document.querySelector("#chart-tooltip");a.font="11px Inter, ui-sans-serif, system-ui, sans-serif",a.textBaseline="middle";for(let g=0;g<4;g+=1){const $=v+l/3*g;a.beginPath(),a.strokeStyle="#eceee8",a.lineWidth=1,a.moveTo(m,$),a.lineTo(m+u,$),a.stroke()}e.forEach((g,$)=>{const w=m+f*$+f/2,M=g.income/d*(l-4),N=(t?g.expenses-g.investments:g.expenses)/d*(l-4),E=g.investments/d*(l-4);a.fillStyle="#2c8563",a.beginPath(),a.roundRect(w-b*(t?1.5:1)-1,v+l-M,b,M,4),a.fill(),a.fillStyle="#f3a56e",a.beginPath(),a.roundRect(w+1,v+l-N,b,N,4),a.fill(),t&&(a.fillStyle="#8e83bd",a.beginPath(),a.roundRect(w+b+2,v+l-E,b,E,4),a.fill()),a.fillStyle="#878e86",a.textAlign="center",a.fillText(Ae[$],w,v+l+17)}),s.onpointermove=g=>{if(!x)return;const $=s.getBoundingClientRect(),w=g.clientX-$.left,M=Math.floor((w-m)/f);if(M<0||M>=e.length){x.hidden=!0;return}const k=e[M];x.textContent=t?`${P[M]} · Revenus : ${p(k.income,!0)} · Dépenses finales : ${p(k.expenses-k.investments,!0)} · Plans d’épargne : ${p(k.investments,!0)} · Saveback : ${p(k.savebackExpenses,!0)}`:`${P[M]} · Revenus : ${p(k.income,!0)} · Dépenses : ${p(k.expenses,!0)}`,x.style.left=`${Math.max(4,Math.min($.width-x.offsetWidth-4,w+12))}px`,x.style.top="8px",x.hidden=!1},s.onpointerleave=()=>{x&&(x.hidden=!0)}}function se(e,t="error"){const s=document.querySelector("#toast-slot");s&&(s.innerHTML=`<div class="toast toast-${t}" role="alert">${y(e)}<button type="button" aria-label="Fermer">×</button></div>`,s.querySelector("button").addEventListener("click",()=>s.replaceChildren()))}async function Xe(e){if(e){if(!/\.(xlsx|xlsm)$/i.test(e.name)){se("Choisissez un fichier .xlsx ou .xlsm. Les fichiers .xls doivent d’abord être convertis au format .xlsx.");return}try{const t=await Vt(e);i.transactions=t.transactions,i.fileName=e.name,i.duplicateCount=t.duplicateCount,i.dashboard="overview",i.year=String(Math.max(...t.transactions.map(s=>s.date.getUTCFullYear()))),i.category="all",i.account="all",i.type="all",i.search="",i.page=1,j(),t.duplicateCount>0&&se(`${D.format(t.duplicateCount)} doublons entre feuilles annexes et comptes ont été écartés des totaux.`,"info")}catch(t){se(t instanceof Error?t.message:"Le fichier n’a pas pu être lu.")}}}function ft(){var t;(t=document.querySelector("#file-input"))==null||t.addEventListener("change",s=>{var a;Xe((a=s.target.files)==null?void 0:a[0]),s.target.value=""});const e=document.querySelector("#dropzone");e&&(e.addEventListener("dragover",s=>{s.preventDefault(),e.classList.add("dragging")}),e.addEventListener("dragleave",()=>e.classList.remove("dragging")),e.addEventListener("drop",s=>{var a,r;s.preventDefault(),e.classList.remove("dragging"),Xe((r=(a=s.dataTransfer)==null?void 0:a.files)==null?void 0:r[0])}))}function _t(){i.transactions=[],i.fileName="",i.dashboard="overview",i.year="all",i.category="all",i.account="all",i.type="all",i.search="",i.page=1,mt()}window.addEventListener("resize",()=>{i.transactions.length&&vt(ut(dt()).monthly,i.dashboard==="tr")});mt();
