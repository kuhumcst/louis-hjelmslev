SimileAjax = {}

/* data-structure.js */
SimileAjax.SortedArray=function(B,A){this._a=(A instanceof Array)?A:[];
this._compare=B;
};
SimileAjax.SortedArray.prototype.add=function(C){var A=this;
var B=this.find(function(D){return A._compare(D,C);
});
if(B<this._a.length){this._a.splice(B,0,C);
}else{this._a.push(C);
}};
SimileAjax.SortedArray.prototype.remove=function(C){var A=this;
var B=this.find(function(D){return A._compare(D,C);
});
while(B<this._a.length&&this._compare(this._a[B],C)==0){if(this._a[B]==C){this._a.splice(B,1);
return true;
}else{B++;
}}return false;
};
SimileAjax.SortedArray.prototype.removeAll=function(){this._a=[];
};
SimileAjax.SortedArray.prototype.elementAt=function(A){return this._a[A];
};
SimileAjax.SortedArray.prototype.length=function(){return this._a.length;
};
SimileAjax.SortedArray.prototype.find=function(D){var B=0;
var A=this._a.length;
while(B<A){var C=Math.floor((B+A)/2);
var E=D(this._a[C]);
if(C==B){return E<0?B+1:B;
}else{if(E<0){B=C;
}else{A=C;
}}}return B;
};
SimileAjax.SortedArray.prototype.getFirst=function(){return(this._a.length>0)?this._a[0]:null;
};
SimileAjax.SortedArray.prototype.getLast=function(){return(this._a.length>0)?this._a[this._a.length-1]:null;
};
SimileAjax.EventIndex=function(B){var A=this;
this._unit=(B!=null)?B:SimileAjax.NativeDateUnit;
this._events=new SimileAjax.SortedArray(function(D,C){return A._unit.compare(D.getStart(),C.getStart());
});
this._idToEvent={};
this._indexed=true;
};
SimileAjax.EventIndex.prototype.getUnit=function(){return this._unit;
};
SimileAjax.EventIndex.prototype.getEvent=function(A){return this._idToEvent[A];
};
SimileAjax.EventIndex.prototype.add=function(A){this._events.add(A);
this._idToEvent[A.getID()]=A;
this._indexed=false;
};
SimileAjax.EventIndex.prototype.removeAll=function(){this._events.removeAll();
this._idToEvent={};
this._indexed=false;
};
SimileAjax.EventIndex.prototype.getCount=function(){return this._events.length();
};
SimileAjax.EventIndex.prototype.getIterator=function(A,B){if(!this._indexed){this._index();
}return new SimileAjax.EventIndex._Iterator(this._events,A,B,this._unit);
};
SimileAjax.EventIndex.prototype.getReverseIterator=function(A,B){if(!this._indexed){this._index();
}return new SimileAjax.EventIndex._ReverseIterator(this._events,A,B,this._unit);
};
SimileAjax.EventIndex.prototype.getAllIterator=function(){return new SimileAjax.EventIndex._AllIterator(this._events);
};
SimileAjax.EventIndex.prototype.getEarliestDate=function(){var A=this._events.getFirst();
return(A==null)?null:A.getStart();
};
SimileAjax.EventIndex.prototype.getLatestDate=function(){var A=this._events.getLast();
if(A==null){return null;
}if(!this._indexed){this._index();
}var C=A._earliestOverlapIndex;
var B=this._events.elementAt(C).getEnd();
for(var D=C+1;
D<this._events.length();
D++){B=this._unit.later(B,this._events.elementAt(D).getEnd());
}return B;
};
SimileAjax.EventIndex.prototype._index=function(){var D=this._events.length();
for(var E=0;
E<D;
E++){var C=this._events.elementAt(E);
C._earliestOverlapIndex=E;
}var G=1;
for(var E=0;
E<D;
E++){var C=this._events.elementAt(E);
var B=C.getEnd();
G=Math.max(G,E+1);
while(G<D){var A=this._events.elementAt(G);
var F=A.getStart();
if(this._unit.compare(F,B)<0){A._earliestOverlapIndex=E;
G++;
}else{break;
}}}this._indexed=true;
};
SimileAjax.EventIndex._Iterator=function(B,A,D,C){this._events=B;
this._startDate=A;
this._endDate=D;
this._unit=C;
this._currentIndex=B.find(function(E){return C.compare(E.getStart(),A);
});
if(this._currentIndex-1>=0){this._currentIndex=this._events.elementAt(this._currentIndex-1)._earliestOverlapIndex;
}this._currentIndex--;
this._maxIndex=B.find(function(E){return C.compare(E.getStart(),D);
});
this._hasNext=false;
this._next=null;
this._findNext();
};
SimileAjax.EventIndex._Iterator.prototype={hasNext:function(){return this._hasNext;
},next:function(){if(this._hasNext){var A=this._next;
this._findNext();
return A;
}else{return null;
}},_findNext:function(){var B=this._unit;
while((++this._currentIndex)<this._maxIndex){var A=this._events.elementAt(this._currentIndex);
if(B.compare(A.getStart(),this._endDate)<0&&B.compare(A.getEnd(),this._startDate)>0){this._next=A;
this._hasNext=true;
return ;
}}this._next=null;
this._hasNext=false;
}};
SimileAjax.EventIndex._ReverseIterator=function(B,A,D,C){this._events=B;
this._startDate=A;
this._endDate=D;
this._unit=C;
this._minIndex=B.find(function(E){return C.compare(E.getStart(),A);
});
if(this._minIndex-1>=0){this._minIndex=this._events.elementAt(this._minIndex-1)._earliestOverlapIndex;
}this._maxIndex=B.find(function(E){return C.compare(E.getStart(),D);
});
this._currentIndex=this._maxIndex;
this._hasNext=false;
this._next=null;
this._findNext();
};
SimileAjax.EventIndex._ReverseIterator.prototype={hasNext:function(){return this._hasNext;
},next:function(){if(this._hasNext){var A=this._next;
this._findNext();
return A;
}else{return null;
}},_findNext:function(){var B=this._unit;
while((--this._currentIndex)>=this._minIndex){var A=this._events.elementAt(this._currentIndex);
if(B.compare(A.getStart(),this._endDate)<0&&B.compare(A.getEnd(),this._startDate)>0){this._next=A;
this._hasNext=true;
return ;
}}this._next=null;
this._hasNext=false;
}};
SimileAjax.EventIndex._AllIterator=function(A){this._events=A;
this._index=0;
};
SimileAjax.EventIndex._AllIterator.prototype={hasNext:function(){return this._index<this._events.length();
},next:function(){return this._index<this._events.length()?this._events.elementAt(this._index++):null;
}};


/* date-time.js */
SimileAjax.DateTime=new Object();
SimileAjax.DateTime.MILLISECOND=0;
SimileAjax.DateTime.SECOND=1;
SimileAjax.DateTime.MINUTE=2;
SimileAjax.DateTime.HOUR=3;
SimileAjax.DateTime.DAY=4;
SimileAjax.DateTime.WEEK=5;
SimileAjax.DateTime.MONTH=6;
SimileAjax.DateTime.YEAR=7;
SimileAjax.DateTime.DECADE=8;
SimileAjax.DateTime.CENTURY=9;
SimileAjax.DateTime.MILLENNIUM=10;
SimileAjax.DateTime.EPOCH=-1;
SimileAjax.DateTime.ERA=-2;
SimileAjax.DateTime.gregorianUnitLengths=[];
(function(){var B=SimileAjax.DateTime;
var A=B.gregorianUnitLengths;
A[B.MILLISECOND]=1;
A[B.SECOND]=1000;
A[B.MINUTE]=A[B.SECOND]*60;
A[B.HOUR]=A[B.MINUTE]*60;
A[B.DAY]=A[B.HOUR]*24;
A[B.WEEK]=A[B.DAY]*7;
A[B.MONTH]=A[B.DAY]*31;
A[B.YEAR]=A[B.DAY]*365;
A[B.DECADE]=A[B.YEAR]*10;
A[B.CENTURY]=A[B.YEAR]*100;
A[B.MILLENNIUM]=A[B.YEAR]*1000;
})();
SimileAjax.DateTime._dateRegexp=new RegExp("^(-?)([0-9]{4})("+["(-?([0-9]{2})(-?([0-9]{2}))?)","(-?([0-9]{3}))","(-?W([0-9]{2})(-?([1-7]))?)"].join("|")+")?$");
SimileAjax.DateTime._timezoneRegexp=new RegExp("Z|(([-+])([0-9]{2})(:?([0-9]{2}))?)$");
SimileAjax.DateTime._timeRegexp=new RegExp("^([0-9]{2})(:?([0-9]{2})(:?([0-9]{2})(.([0-9]+))?)?)?$");
SimileAjax.DateTime.setIso8601Date=function(H,F){var I=F.match(SimileAjax.DateTime._dateRegexp);
if(!I){throw new Error("Invalid date string: "+F);
}var B=(I[1]=="-")?-1:1;
var J=B*I[2];
var G=I[5];
var C=I[7];
var E=I[9];
var A=I[11];
var M=(I[13])?I[13]:1;
H.setUTCFullYear(J);
if(E){H.setUTCMonth(0);
H.setUTCDate(Number(E));
}else{if(A){H.setUTCMonth(0);
H.setUTCDate(1);
var L=H.getUTCDay();
var K=(L)?L:7;
var D=Number(M)+(7*Number(A));
if(K<=4){H.setUTCDate(D+1-K);
}else{H.setUTCDate(D+8-K);
}}else{if(G){H.setUTCDate(1);
H.setUTCMonth(G-1);
}if(C){H.setUTCDate(C);
}}}return H;
};
SimileAjax.DateTime.setIso8601Time=function(F,C){var G=C.match(SimileAjax.DateTime._timeRegexp);
if(!G){SimileAjax.Debug.warn("Invalid time string: "+C);
return false;
}var A=G[1];
var E=Number((G[3])?G[3]:0);
var D=(G[5])?G[5]:0;
var B=G[7]?(Number("0."+G[7])*1000):0;
F.setUTCHours(A);
F.setUTCMinutes(E);
F.setUTCSeconds(D);
F.setUTCMilliseconds(B);
return F;
};
SimileAjax.DateTime.timezoneOffset=new Date().getTimezoneOffset();
SimileAjax.DateTime.setIso8601=function(B,A){var D=null;
var E=(A.indexOf("T")==-1)?A.split(" "):A.split("T");
SimileAjax.DateTime.setIso8601Date(B,E[0]);
if(E.length==2){var C=E[1].match(SimileAjax.DateTime._timezoneRegexp);
if(C){if(C[0]=="Z"){D=0;
}else{D=(Number(C[3])*60)+Number(C[5]);
D*=((C[2]=="-")?1:-1);
}E[1]=E[1].substr(0,E[1].length-C[0].length);
}SimileAjax.DateTime.setIso8601Time(B,E[1]);
}if(D==null){D=B.getTimezoneOffset();
}B.setTime(B.getTime()+D*60000);
return B;
};
SimileAjax.DateTime.parseIso8601DateTime=function(A){try{return SimileAjax.DateTime.setIso8601(new Date(0),A);
}catch(B){return null;
}};
SimileAjax.DateTime.parseGregorianDateTime=function(G){if(G==null){return null;
}else{if(G instanceof Date){return G;
}}var B=G.toString();
if(B.length>0&&B.length<8){var C=B.indexOf(" ");
if(C>0){var A=parseInt(B.substr(0,C));
var E=B.substr(C+1);
if(E.toLowerCase()=="bc"){A=1-A;
}}else{var A=parseInt(B);
}var F=new Date(0);
F.setUTCFullYear(A);
return F;
}try{return new Date(Date.parse(B));
}catch(D){return null;
}};
SimileAjax.DateTime.roundDownToInterval=function(B,G,J,K,A){var D=J*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
var I=new Date(B.getTime()+D);
var E=function(L){L.setUTCMilliseconds(0);
L.setUTCSeconds(0);
L.setUTCMinutes(0);
L.setUTCHours(0);
};
var C=function(L){E(L);
L.setUTCDate(1);
L.setUTCMonth(0);
};
switch(G){case SimileAjax.DateTime.MILLISECOND:var H=I.getUTCMilliseconds();
I.setUTCMilliseconds(H-(H%K));
break;
case SimileAjax.DateTime.SECOND:I.setUTCMilliseconds(0);
var H=I.getUTCSeconds();
I.setUTCSeconds(H-(H%K));
break;
case SimileAjax.DateTime.MINUTE:I.setUTCMilliseconds(0);
I.setUTCSeconds(0);
var H=I.getUTCMinutes();
I.setTime(I.getTime()-(H%K)*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
break;
case SimileAjax.DateTime.HOUR:I.setUTCMilliseconds(0);
I.setUTCSeconds(0);
I.setUTCMinutes(0);
var H=I.getUTCHours();
I.setUTCHours(H-(H%K));
break;
case SimileAjax.DateTime.DAY:E(I);
break;
case SimileAjax.DateTime.WEEK:E(I);
var F=(I.getUTCDay()+7-A)%7;
I.setTime(I.getTime()-F*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.DAY]);
break;
case SimileAjax.DateTime.MONTH:E(I);
I.setUTCDate(1);
var H=I.getUTCMonth();
I.setUTCMonth(H-(H%K));
break;
case SimileAjax.DateTime.YEAR:C(I);
var H=I.getUTCFullYear();
I.setUTCFullYear(H-(H%K));
break;
case SimileAjax.DateTime.DECADE:C(I);
I.setUTCFullYear(Math.floor(I.getUTCFullYear()/10)*10);
break;
case SimileAjax.DateTime.CENTURY:C(I);
I.setUTCFullYear(Math.floor(I.getUTCFullYear()/100)*100);
break;
case SimileAjax.DateTime.MILLENNIUM:C(I);
I.setUTCFullYear(Math.floor(I.getUTCFullYear()/1000)*1000);
break;
}B.setTime(I.getTime()-D);
};
SimileAjax.DateTime.roundUpToInterval=function(D,F,C,A,B){var E=D.getTime();
SimileAjax.DateTime.roundDownToInterval(D,F,C,A,B);
if(D.getTime()<E){D.setTime(D.getTime()+SimileAjax.DateTime.gregorianUnitLengths[F]*A);
}};
SimileAjax.DateTime.incrementByInterval=function(B,E,A){A=(typeof A=="undefined")?0:A;
var D=A*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR];
var C=new Date(B.getTime()+D);
switch(E){case SimileAjax.DateTime.MILLISECOND:C.setTime(C.getTime()+1);
break;
case SimileAjax.DateTime.SECOND:C.setTime(C.getTime()+1000);
break;
case SimileAjax.DateTime.MINUTE:C.setTime(C.getTime()+SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.MINUTE]);
break;
case SimileAjax.DateTime.HOUR:C.setTime(C.getTime()+SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
break;
case SimileAjax.DateTime.DAY:C.setUTCDate(C.getUTCDate()+1);
break;
case SimileAjax.DateTime.WEEK:C.setUTCDate(C.getUTCDate()+7);
break;
case SimileAjax.DateTime.MONTH:C.setUTCMonth(C.getUTCMonth()+1);
break;
case SimileAjax.DateTime.YEAR:C.setUTCFullYear(C.getUTCFullYear()+1);
break;
case SimileAjax.DateTime.DECADE:C.setUTCFullYear(C.getUTCFullYear()+10);
break;
case SimileAjax.DateTime.CENTURY:C.setUTCFullYear(C.getUTCFullYear()+100);
break;
case SimileAjax.DateTime.MILLENNIUM:C.setUTCFullYear(C.getUTCFullYear()+1000);
break;
}B.setTime(C.getTime()-D);
};
SimileAjax.DateTime.removeTimeZoneOffset=function(B,A){return new Date(B.getTime()+A*SimileAjax.DateTime.gregorianUnitLengths[SimileAjax.DateTime.HOUR]);
};
SimileAjax.DateTime.getTimezone=function(){var A=new Date().getTimezoneOffset();
return A/-60;
};


/* debug.js */
SimileAjax.Debug={silent:false};
SimileAjax.Debug.log=function(B){var A;
if("console" in window&&"log" in window.console){A=function(C){console.log(C);
};
}else{A=function(C){if(!SimileAjax.Debug.silent){alert(C);
}};
}SimileAjax.Debug.log=A;
A(B);
};
SimileAjax.Debug.warn=function(B){var A;
if("console" in window&&"warn" in window.console){A=function(C){console.warn(C);
};
}else{A=function(C){if(!SimileAjax.Debug.silent){alert(C);
}};
}SimileAjax.Debug.warn=A;
A(B);
};
SimileAjax.Debug.exception=function(B,D){var A,C=SimileAjax.parseURLParameters();
if(C.errors=="throw"||SimileAjax.params.errors=="throw"){A=function(F,E){throw (F);
};
}else{if("console" in window&&"error" in window.console){A=function(F,E){if(E!=null){console.error(E+" %o",F);
}else{console.error(F);
}throw (F);
};
}else{A=function(F,E){if(!SimileAjax.Debug.silent){alert("Caught exception: "+E+"\n\nDetails: "+("description" in F?F.description:F));
}throw (F);
};
}}SimileAjax.Debug.exception=A;
A(B,D);
};
SimileAjax.Debug.objectToString=function(A){return SimileAjax.Debug._objectToString(A,"");
};
SimileAjax.Debug._objectToString=function(D,A){var C=A+" ";
if(typeof D=="object"){var B="{";
for(E in D){B+=C+E+": "+SimileAjax.Debug._objectToString(D[E],C)+"\n";
}B+=A+"}";
return B;
}else{if(typeof D=="array"){var B="[";
for(var E=0;
E<D.length;
E++){B+=SimileAjax.Debug._objectToString(D[E],C)+"\n";
}B+=A+"]";
return B;
}else{return D;
}}};


/* dom.js */
SimileAjax.DOM=new Object();
SimileAjax.DOM.registerEventWithObject=function(C,A,D,B){SimileAjax.DOM.registerEvent(C,A,function(F,E,G){return D[B].call(D,F,E,G);
});
};
SimileAjax.DOM.registerEvent=function(C,B,D){var A=function(E){E=(E)?E:((event)?event:null);
if(E){var F=(E.target)?E.target:((E.srcElement)?E.srcElement:null);
if(F){F=(F.nodeType==1||F.nodeType==9)?F:F.parentNode;
}return D(C,E,F);
}return true;
};
C.addEventListener(B,A,false);
SimileAjax.DOM.getPageCoordinates=function(B){var E=0;
var D=0;
if(B.nodeType!=1){B=B.parentNode;
}var C=B;
while(C!=null){E+=C.offsetLeft;
D+=C.offsetTop;
C=C.offsetParent;
}var A=document.body;
while(B!=null&&B!=A){if("scrollLeft" in B){E-=B.scrollLeft;
D-=B.scrollTop;
}B=B.parentNode;
}return{left:E,top:D};
};
SimileAjax.DOM.getSize=function(B){var A=this.getStyle(B,"width");
var C=this.getStyle(B,"height");
if(A.indexOf("px")>-1){A=A.replace("px","");
}if(C.indexOf("px")>-1){C=C.replace("px","");
}return{w:A,h:C};
};
SimileAjax.DOM.getStyle=function(B,A){if(B.currentStyle){var C=B.currentStyle[A];
}else{if(window.getComputedStyle){var C=document.defaultView.getComputedStyle(B,null).getPropertyValue(A);
}else{var C="";
}}return C;
};
SimileAjax.DOM.getEventRelativeCoordinates=function(A,B){
    var C=SimileAjax.DOM.getPageCoordinates(B);
    return{x: A.pageX-C.left, y: A.pageY-C.top};};
}
SimileAjax.DOM.getEventPageCoordinates=function(A){
    return{x:A.pageX,y:A.pageY};
};
SimileAjax.DOM.hittest=function(A,C,B){return SimileAjax.DOM._hittest(document.body,A,C,B);
};
SimileAjax.DOM._hittest=function(C,L,K,H){var M=C.childNodes;
outer:for(var G=0;
G<M.length;
G++){var A=M[G];
for(var F=0;
F<H.length;
F++){if(A==H[F]){continue outer;
}}if(A.offsetWidth==0&&A.offsetHeight==0){var B=SimileAjax.DOM._hittest(A,L,K,H);
if(B!=A){return B;
}}else{var J=0;
var E=0;
var D=A;
while(D){J+=D.offsetTop;
E+=D.offsetLeft;
D=D.offsetParent;
}if(E<=L&&J<=K&&(L-E)<A.offsetWidth&&(K-J)<A.offsetHeight){return SimileAjax.DOM._hittest(A,L,K,H);
}else{if(A.nodeType==1&&A.tagName=="TR"){var I=SimileAjax.DOM._hittest(A,L,K,H);
if(I!=A){return I;
}}}}}return C;
};
SimileAjax.DOM.cancelEvent=function(A){A.returnValue=false;
A.cancelBubble=true;
if("preventDefault" in A){A.preventDefault();
}};
SimileAjax.DOM.appendClassName=function(C,D){var B=C.className.split(" ");
for(var A=0;
A<B.length;
A++){if(B[A]==D){return ;
}}B.push(D);
C.className=B.join(" ");
};
SimileAjax.DOM.createInputElement=function(A){var B=document.createElement("div");
B.innerHTML="<input type='"+A+"' />";
return B.firstChild;
};
SimileAjax.DOM.createDOMFromTemplate=function(B){var A={};
A.elmt=SimileAjax.DOM._createDOMFromTemplate(B,A,null);
return A;
};
SimileAjax.DOM._createDOMFromTemplate=function(A,I,E){if(A==null){return null;
}else{if(typeof A!="object"){var D=document.createTextNode(A);
if(E!=null){E.appendChild(D);
}return D;
}else{var C=null;
if("tag" in A){var J=A.tag;
if(E!=null){if(J=="tr"){C=E.insertRow(E.rows.length);
}else{if(J=="td"){C=E.insertCell(E.cells.length);
}}}if(C==null){C=J=="input"?SimileAjax.DOM.createInputElement(A.type):document.createElement(J);
if(E!=null){E.appendChild(C);
}}}else{C=A.elmt;
if(E!=null){E.appendChild(C);
}}for(var B in A){var G=A[B];
if(B=="field"){I[G]=C;
}else{if(B=="className"){C.className=G;
}else{if(B=="id"){C.id=G;
}else{if(B=="title"){C.title=G;
}else{if(B=="type"&&C.tagName=="input"){}else{if(B=="style"){for(n in G){var H=G[n];
if(n=="float"){n="cssFloat";
}C.style[n]=H;
}}else{if(B=="children"){for(var F=0;
F<G.length;
F++){SimileAjax.DOM._createDOMFromTemplate(G[F],I,C);
}}else{if(B!="tag"&&B!="elmt"){C.setAttribute(B,G);
}}}}}}}}}return C;
}}};
SimileAjax.DOM._cachedParent=null;
SimileAjax.DOM.createElementFromString=function(A){if(SimileAjax.DOM._cachedParent==null){SimileAjax.DOM._cachedParent=document.createElement("div");
}SimileAjax.DOM._cachedParent.innerHTML=A;
return SimileAjax.DOM._cachedParent.firstChild;
};
SimileAjax.DOM.createDOMFromString=function(A,C,D){var B=typeof A=="string"?document.createElement(A):A;
B.innerHTML=C;
var E={elmt:B};
SimileAjax.DOM._processDOMChildrenConstructedFromString(E,B,D!=null?D:{});
return E;
};
SimileAjax.DOM._processDOMConstructedFromString=function(D,A,B){var E=A.id;
if(E!=null&&E.length>0){A.removeAttribute("id");
if(E in B){var C=A.parentNode;
C.insertBefore(B[E],A);
C.removeChild(A);
D[E]=B[E];
return ;
}else{D[E]=A;
}}if(A.hasChildNodes()){SimileAjax.DOM._processDOMChildrenConstructedFromString(D,A,B);
}};
SimileAjax.DOM._processDOMChildrenConstructedFromString=function(E,B,D){var C=B.firstChild;
while(C!=null){var A=C.nextSibling;
if(C.nodeType==1){SimileAjax.DOM._processDOMConstructedFromString(E,C,D);
}C=A;
}};


/* graphics.js */
SimileAjax.Graphics=new Object();
SimileAjax.Graphics.createTranslucentImage=function(A,C){
    var B=document.createElement("img");
    B.setAttribute("src",A);
    if(C!=null){
        B.style.verticalAlign=C;
    }
    return B;
};
SimileAjax.Graphics.setOpacity=function(B,A){
    var C=(A/100).toString();
    B.style.opacity=C;
};
SimileAjax.Graphics.bubbleConfig={containerCSSClass:"simileAjax-bubble-container",innerContainerCSSClass:"simileAjax-bubble-innerContainer",contentContainerCSSClass:"simileAjax-bubble-contentContainer",borderGraphicSize:50,borderGraphicCSSClassPrefix:"simileAjax-bubble-border-",arrowGraphicTargetOffset:33,arrowGraphicLength:100,arrowGraphicWidth:49,arrowGraphicCSSClassPrefix:"simileAjax-bubble-arrow-",closeGraphicCSSClass:"simileAjax-bubble-close",extraPadding:20};
SimileAjax.Graphics.createBubbleForContentAndPoint=function(F,D,C,A,B,E){if(typeof A!="number"){A=300;
}if(typeof E!="number"){E=0;
}F.style.position="absolute";
F.style.left="-5000px";
F.style.top="0px";
F.style.width=A+"px";
document.body.appendChild(F);
window.setTimeout(function(){var J=F.scrollWidth+10;
var G=F.scrollHeight+10;
var I=0;
if(E>0&&G>E){G=E;
I=J-25;
}var H=SimileAjax.Graphics.createBubbleForPoint(D,C,J,G,B);
document.body.removeChild(F);
F.style.position="static";
F.style.left="";
F.style.top="";
if(I>0){var K=document.createElement("div");
F.style.width="";
K.style.width=I+"px";
K.appendChild(F);
H.content.appendChild(K);
}else{F.style.width=J+"px";
H.content.appendChild(F);
}},200);
};
SimileAjax.Graphics.createBubbleForPoint=function(B,A,K,M,D){K=parseInt(K,10);
M=parseInt(M,10);
var E=SimileAjax.Graphics.bubbleConfig;
var L=K+2*E.borderGraphicSize;
var P=M+2*E.borderGraphicSize;
var O=function(S){return S+" "+S+"-pngTranslucent";
};
var H=document.createElement("div");
H.className=O(E.containerCSSClass);
H.style.width=K+"px";
H.style.height=M+"px";
var F=document.createElement("div");
F.className=O(E.innerContainerCSSClass);
H.appendChild(F);
var I=function(){if(!J._closed){document.body.removeChild(J._div);
J._doc=null;
J._div=null;
J._content=null;
J._closed=true;
}};
var J={_closed:false};
var R=SimileAjax.WindowManager.pushLayer(I,true,H);
J._div=H;
J.close=function(){SimileAjax.WindowManager.popLayer(R);
};
var G=function(T){var S=document.createElement("div");
S.className=O(E.borderGraphicCSSClassPrefix+T);
F.appendChild(S);
};
G("top-left");
G("top-right");
G("bottom-left");
G("bottom-right");
G("left");
G("right");
G("top");
G("bottom");
var C=document.createElement("div");
C.className=O(E.contentContainerCSSClass);
F.appendChild(C);
J.content=C;
var Q=document.createElement("div");
Q.className=O(E.closeGraphicCSSClass);
F.appendChild(Q);
SimileAjax.WindowManager.registerEventWithObject(Q,"click",J,"close");
(function(){var Z=SimileAjax.Graphics.getWindowDimensions();
var U=Z.w;
var S=Z.h;
var V=Math.ceil(E.arrowGraphicWidth/2);
var Y=function(a){var b=document.createElement("div");
b.className=O(E.arrowGraphicCSSClassPrefix+"point-"+a);
F.appendChild(b);
return b;
};
if(B-V-E.borderGraphicSize-E.extraPadding>0&&B+V+E.borderGraphicSize+E.extraPadding<U){var X=B-Math.round(K/2);
X=B<(U/2)?Math.max(X,E.extraPadding+E.borderGraphicSize):Math.min(X,U-E.extraPadding-E.borderGraphicSize-K);
if((D&&D=="top")||(!D&&(A-E.arrowGraphicTargetOffset-M-E.borderGraphicSize-E.extraPadding>0))){var T=Y("down");
T.style.left=(B-V-X)+"px";
H.style.left=X+"px";
H.style.top=(A-E.arrowGraphicTargetOffset-M)+"px";
return ;
}else{if((D&&D=="bottom")||(!D&&(A+E.arrowGraphicTargetOffset+M+E.borderGraphicSize+E.extraPadding<S))){var T=Y("up");
T.style.left=(B-V-X)+"px";
H.style.left=X+"px";
H.style.top=(A+E.arrowGraphicTargetOffset)+"px";
return ;
}}}var W=A-Math.round(M/2);
W=A<(S/2)?Math.max(W,E.extraPadding+E.borderGraphicSize):Math.min(W,S-E.extraPadding-E.borderGraphicSize-M);
if((D&&D=="left")||(!D&&(B-E.arrowGraphicTargetOffset-K-E.borderGraphicSize-E.extraPadding>0))){var T=Y("right");
T.style.top=(A-V-W)+"px";
H.style.top=W+"px";
H.style.left=(B-E.arrowGraphicTargetOffset-K)+"px";
}else{var T=Y("left");
T.style.top=(A-V-W)+"px";
H.style.top=W+"px";
H.style.left=(B+E.arrowGraphicTargetOffset)+"px";
}})();
document.body.appendChild(H);
return J;
};
SimileAjax.Graphics.getWindowDimensions=function(){if(typeof window.innerHeight=="number"){return{w:window.innerWidth,h:window.innerHeight};
}else{if(document.documentElement&&document.documentElement.clientHeight){return{w:document.documentElement.clientWidth,h:document.documentElement.clientHeight};
}else{if(document.body&&document.body.clientHeight){return{w:document.body.clientWidth,h:document.body.clientHeight};
}}}};
SimileAjax.Graphics.createAnimation=function(B,E,D,C,A){return new SimileAjax.Graphics._Animation(B,E,D,C,A);
};
SimileAjax.Graphics._Animation=function(B,E,D,C,A){this.f=B;
this.cont=(typeof A=="function")?A:function(){};
this.from=E;
this.to=D;
this.current=E;
this.duration=C;
this.start=new Date().getTime();
this.timePassed=0;
};
SimileAjax.Graphics._Animation.prototype.run=function(){var A=this;
window.setTimeout(function(){A.step();
},20);
};
SimileAjax.Graphics._Animation.prototype.step=function(){this.timePassed+=20;
var B=this.timePassed/this.duration;
var A=-Math.cos(B*Math.PI)/2+0.5;
var D=A*(this.to-this.from)+this.from;
try{this.f(D,D-this.current);
}catch(C){}this.current=D;
if(this.timePassed<this.duration){this.run();
}else{this.f(this.to,0);
this["cont"]();
}};
SimileAjax.Graphics.getWidthHeight=function(C){var A,B;
if(C.getBoundingClientRect==null){A=C.offsetWidth;
B=C.offsetHeight;
}else{var D=C.getBoundingClientRect();
A=Math.ceil(D.right-D.left);
B=Math.ceil(D.bottom-D.top);
}return{width:A,height:B};
};
SimileAjax.Graphics.getFontRenderingContext=function(A,B){return new SimileAjax.Graphics._FontRenderingContext(A,B);
};
SimileAjax.Graphics._FontRenderingContext=function(A,B){this._elmt=A;
this._elmt.style.visibility="hidden";
if(typeof B=="string"){this._elmt.style.width=B;
}else{if(typeof B=="number"){this._elmt.style.width=B+"px";
}}};
SimileAjax.Graphics._FontRenderingContext.prototype.dispose=function(){this._elmt=null;
};
SimileAjax.Graphics._FontRenderingContext.prototype.update=function(){this._elmt.innerHTML="A";
this._lineHeight=this._elmt.offsetHeight;
};
SimileAjax.Graphics._FontRenderingContext.prototype.computeSize=function(D,C){var B=this._elmt;
B.innerHTML=D;
B.className=C===undefined?"":C;
var A=SimileAjax.Graphics.getWidthHeight(B);
B.className="";
return A;
};
SimileAjax.Graphics._FontRenderingContext.prototype.getLineHeight=function(){return this._lineHeight;
};


/* units.js */
SimileAjax.NativeDateUnit=new Object();
SimileAjax.NativeDateUnit.makeDefaultValue=function(){return new Date();
};
SimileAjax.NativeDateUnit.cloneValue=function(A){return new Date(A.getTime());
};
SimileAjax.NativeDateUnit.getParser=function(A){if(typeof A=="string"){A=A.toLowerCase();
}return(A=="iso8601"||A=="iso 8601")?SimileAjax.DateTime.parseIso8601DateTime:SimileAjax.DateTime.parseGregorianDateTime;
};
SimileAjax.NativeDateUnit.parseFromObject=function(A){return SimileAjax.DateTime.parseGregorianDateTime(A);
};
SimileAjax.NativeDateUnit.toNumber=function(A){return A.getTime();
};
SimileAjax.NativeDateUnit.fromNumber=function(A){return new Date(A);
};
SimileAjax.NativeDateUnit.compare=function(D,C){var B,A;
if(typeof D=="object"){B=D.getTime();
}else{B=Number(D);
}if(typeof C=="object"){A=C.getTime();
}else{A=Number(C);
}return B-A;
};
SimileAjax.NativeDateUnit.earlier=function(B,A){return SimileAjax.NativeDateUnit.compare(B,A)<0?B:A;
};
SimileAjax.NativeDateUnit.later=function(B,A){return SimileAjax.NativeDateUnit.compare(B,A)>0?B:A;
};
SimileAjax.NativeDateUnit.change=function(A,B){return new Date(A.getTime()+B);
};


/* window-manager.js */
SimileAjax.WindowManager={_initialized:false,_listeners:[],_draggedElement:null,_draggedElementCallback:null,_dropTargetHighlightElement:null,_lastCoords:null,_ghostCoords:null,_draggingMode:"",_dragging:false,_layers:[]};
SimileAjax.WindowManager.initialize=function(){if(SimileAjax.WindowManager._initialized){return ;
}SimileAjax.DOM.registerEvent(document.body,"mousedown",SimileAjax.WindowManager._onBodyMouseDown);
SimileAjax.DOM.registerEvent(document.body,"mousemove",SimileAjax.WindowManager._onBodyMouseMove);
SimileAjax.DOM.registerEvent(document.body,"mouseup",SimileAjax.WindowManager._onBodyMouseUp);
SimileAjax.WindowManager._layers.push({index:0});
SimileAjax.WindowManager._initialized=true;
};
SimileAjax.WindowManager.getBaseLayer=function(){SimileAjax.WindowManager.initialize();
return SimileAjax.WindowManager._layers[0];
};
SimileAjax.WindowManager.getHighestLayer=function(){SimileAjax.WindowManager.initialize();
return SimileAjax.WindowManager._layers[SimileAjax.WindowManager._layers.length-1];
};
SimileAjax.WindowManager.registerEventWithObject=function(D,A,E,B,C){SimileAjax.WindowManager.registerEvent(D,A,function(G,F,H){return E[B].call(E,G,F,H);
},C);
};
SimileAjax.WindowManager.registerEvent=function(D,B,E,C){if(C==null){C=SimileAjax.WindowManager.getHighestLayer();
}var A=function(G,F,I){if(SimileAjax.WindowManager._canProcessEventAtLayer(C)){SimileAjax.WindowManager._popToLayer(C.index);
try{E(G,F,I);
}catch(H){SimileAjax.Debug.exception(H);
}}SimileAjax.DOM.cancelEvent(F);
return false;
};
SimileAjax.DOM.registerEvent(D,B,A);
};
SimileAjax.WindowManager.pushLayer=function(C,D,B){var A={onPop:C,index:SimileAjax.WindowManager._layers.length,ephemeral:(D),elmt:B};
SimileAjax.WindowManager._layers.push(A);
return A;
};
SimileAjax.WindowManager.popLayer=function(B){for(var A=1;
A<SimileAjax.WindowManager._layers.length;
A++){if(SimileAjax.WindowManager._layers[A]==B){SimileAjax.WindowManager._popToLayer(A-1);
break;
}}};
SimileAjax.WindowManager.popAllLayers=function(){SimileAjax.WindowManager._popToLayer(0);
};
SimileAjax.WindowManager.registerForDragging=function(B,C,A){SimileAjax.WindowManager.registerEvent(B,"mousedown",function(E,D,F){SimileAjax.WindowManager._handleMouseDown(E,D,C);
},A);
};
SimileAjax.WindowManager._popToLayer=function(C){while(C+1<SimileAjax.WindowManager._layers.length){try{var A=SimileAjax.WindowManager._layers.pop();
if(A.onPop!=null){A.onPop();
}}catch(B){}}};
SimileAjax.WindowManager._canProcessEventAtLayer=function(B){if(B.index==(SimileAjax.WindowManager._layers.length-1)){return true;
}for(var A=B.index+1;
A<SimileAjax.WindowManager._layers.length;
A++){if(!SimileAjax.WindowManager._layers[A].ephemeral){return false;
}}return true;
};
SimileAjax.WindowManager.cancelPopups=function(A){var F=(A)?SimileAjax.DOM.getEventPageCoordinates(A):{x:-1,y:-1};
var E=SimileAjax.WindowManager._layers.length-1;
while(E>0&&SimileAjax.WindowManager._layers[E].ephemeral){var D=SimileAjax.WindowManager._layers[E];
if(D.elmt!=null){var C=D.elmt;
var B=SimileAjax.DOM.getPageCoordinates(C);
if(F.x>=B.left&&F.x<(B.left+C.offsetWidth)&&F.y>=B.top&&F.y<(B.top+C.offsetHeight)){break;
}}E--;
}SimileAjax.WindowManager._popToLayer(E);
};
SimileAjax.WindowManager._onBodyMouseDown=function(B,A,C){if(!("eventPhase" in A)||A.eventPhase==A.BUBBLING_PHASE){SimileAjax.WindowManager.cancelPopups(A);
}};
SimileAjax.WindowManager._handleMouseDown=function(B,A,C){SimileAjax.WindowManager._draggedElement=B;
SimileAjax.WindowManager._draggedElementCallback=C;
SimileAjax.WindowManager._lastCoords={x:A.clientX,y:A.clientY};
SimileAjax.DOM.cancelEvent(A);
return false;
};
SimileAjax.WindowManager._onBodyMouseMove=function(A,N,H){if(SimileAjax.WindowManager._draggedElement!=null){var P=SimileAjax.WindowManager._draggedElementCallback;
var E=SimileAjax.WindowManager._lastCoords;
var M=N.clientX-E.x;
var J=N.clientY-E.y;
if(!SimileAjax.WindowManager._dragging){if(Math.abs(M)>5||Math.abs(J)>5){try{if("onDragStart" in P){P.onDragStart();
}if("ghost" in P&&P.ghost){var K=SimileAjax.WindowManager._draggedElement;
SimileAjax.WindowManager._ghostCoords=SimileAjax.DOM.getPageCoordinates(K);
SimileAjax.WindowManager._ghostCoords.left+=M;
SimileAjax.WindowManager._ghostCoords.top+=J;
var O=K.cloneNode(true);
O.style.position="absolute";
O.style.left=SimileAjax.WindowManager._ghostCoords.left+"px";
O.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
O.style.zIndex=1000;
SimileAjax.Graphics.setOpacity(O,50);
document.body.appendChild(O);
P._ghostElmt=O;
}SimileAjax.WindowManager._dragging=true;
SimileAjax.WindowManager._lastCoords={x:N.clientX,y:N.clientY};
document.body.focus();
}catch(G){SimileAjax.Debug.exception("WindowManager: Error handling mouse down",G);
SimileAjax.WindowManager._cancelDragging();
}}}else{try{SimileAjax.WindowManager._lastCoords={x:N.clientX,y:N.clientY};
if("onDragBy" in P){P.onDragBy(M,J);
}if("_ghostElmt" in P){var O=P._ghostElmt;
SimileAjax.WindowManager._ghostCoords.left+=M;
SimileAjax.WindowManager._ghostCoords.top+=J;
O.style.left=SimileAjax.WindowManager._ghostCoords.left+"px";
O.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
if(SimileAjax.WindowManager._draggingModeIndicatorElmt!=null){var I=SimileAjax.WindowManager._draggingModeIndicatorElmt;
I.style.left=(SimileAjax.WindowManager._ghostCoords.left-16)+"px";
I.style.top=SimileAjax.WindowManager._ghostCoords.top+"px";
}if("droppable" in P&&P.droppable){var L=SimileAjax.DOM.getEventPageCoordinates(N);
var H=SimileAjax.DOM.hittest(L.x,L.y,[SimileAjax.WindowManager._ghostElmt,SimileAjax.WindowManager._dropTargetHighlightElement]);
H=SimileAjax.WindowManager._findDropTarget(H);
if(H!=SimileAjax.WindowManager._potentialDropTarget){if(SimileAjax.WindowManager._dropTargetHighlightElement!=null){document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
SimileAjax.WindowManager._dropTargetHighlightElement=null;
SimileAjax.WindowManager._potentialDropTarget=null;
}var F=false;
if(H!=null){if((!("canDropOn" in P)||P.canDropOn(H))&&(!("canDrop" in H)||H.canDrop(SimileAjax.WindowManager._draggedElement))){F=true;
}}if(F){var C=4;
var D=SimileAjax.DOM.getPageCoordinates(H);
var B=document.createElement("div");
B.style.border=C+"px solid yellow";
B.style.backgroundColor="yellow";
B.style.position="absolute";
B.style.left=D.left+"px";
B.style.top=D.top+"px";
B.style.width=(H.offsetWidth-C*2)+"px";
B.style.height=(H.offsetHeight-C*2)+"px";
SimileAjax.Graphics.setOpacity(B,30);
document.body.appendChild(B);
SimileAjax.WindowManager._potentialDropTarget=H;
SimileAjax.WindowManager._dropTargetHighlightElement=B;
}}}}}catch(G){SimileAjax.Debug.exception("WindowManager: Error handling mouse move",G);
SimileAjax.WindowManager._cancelDragging();
}}SimileAjax.DOM.cancelEvent(N);
return false;
}};
SimileAjax.WindowManager._onBodyMouseUp=function(B,A,C){if(SimileAjax.WindowManager._draggedElement!=null){try{if(SimileAjax.WindowManager._dragging){var E=SimileAjax.WindowManager._draggedElementCallback;
if("onDragEnd" in E){E.onDragEnd();
}if("droppable" in E&&E.droppable){var D=false;
var C=SimileAjax.WindowManager._potentialDropTarget;
if(C!=null){if((!("canDropOn" in E)||E.canDropOn(C))&&(!("canDrop" in C)||C.canDrop(SimileAjax.WindowManager._draggedElement))){if("onDropOn" in E){E.onDropOn(C);
}C.ondrop(SimileAjax.WindowManager._draggedElement,SimileAjax.WindowManager._draggingMode);
D=true;
}}if(!D){}}}}finally{SimileAjax.WindowManager._cancelDragging();
}SimileAjax.DOM.cancelEvent(A);
return false;
}};
SimileAjax.WindowManager._cancelDragging=function(){var B=SimileAjax.WindowManager._draggedElementCallback;
if("_ghostElmt" in B){var A=B._ghostElmt;
document.body.removeChild(A);
delete B._ghostElmt;
}if(SimileAjax.WindowManager._dropTargetHighlightElement!=null){document.body.removeChild(SimileAjax.WindowManager._dropTargetHighlightElement);
SimileAjax.WindowManager._dropTargetHighlightElement=null;
}if(SimileAjax.WindowManager._draggingModeIndicatorElmt!=null){document.body.removeChild(SimileAjax.WindowManager._draggingModeIndicatorElmt);
SimileAjax.WindowManager._draggingModeIndicatorElmt=null;
}SimileAjax.WindowManager._draggedElement=null;
SimileAjax.WindowManager._draggedElementCallback=null;
SimileAjax.WindowManager._potentialDropTarget=null;
SimileAjax.WindowManager._dropTargetHighlightElement=null;
SimileAjax.WindowManager._lastCoords=null;
SimileAjax.WindowManager._ghostCoords=null;
SimileAjax.WindowManager._draggingMode="";
SimileAjax.WindowManager._dragging=false;
};
SimileAjax.WindowManager._findDropTarget=function(A){while(A!=null){if("ondrop" in A&&(typeof A.ondrop)=="function"){break;
}A=A.parentNode;
}return A;
};
