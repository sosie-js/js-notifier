var notifier=function(e){function t(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return e[i].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=2)}([function(e,t,n){"use strict";e.exports=function(){var e={wrapper:"cdx-notifies",notification:"cdx-notifies__notification",crossBtn:"cdx-notifies__cross",okBtn:"cdx-notifies__button--confirm",cancelBtn:"cdx-notifies__button--cancel",input:"cdx-notifies__input",btn:"cdx-notifies__button",btnsWrapper:"cdx-notifies__btns-wrapper"},t=function(t){var n=document.createElement("DIV"),i=document.createElement("DIV"),r=t.message,c=t.style||"notify";if(r)return n.classList.add(e.notification),n.classList.add(e.notification+"--"+c),n.innerHTML=r,i.classList.add(e.crossBtn),i.addEventListener("click",n.remove.bind(n)),n.appendChild(i),n};return{alert:t,confirm:function(n){var i=t(n),r=document.createElement("div"),c=document.createElement("button"),o=document.createElement("button"),a=i.querySelector(e.crossBtn),d=n.cancelHandler,s=n.okHandler;return r.classList.add(e.btnsWrapper),c.innerHTML=n.okText||"Confirm",o.innerHTML=n.cancelText||"Cancel",c.classList.add(e.btn),o.classList.add(e.btn),c.classList.add(e.okBtn),o.classList.add(e.cancelBtn),d&&"function"==typeof d&&(o.addEventListener("click",d),a.addEventListener("click",d)),s&&"function"==typeof s&&c.addEventListener("click",s),c.addEventListener("click",i.remove.bind(i)),o.addEventListener("click",i.remove.bind(i)),r.appendChild(c),r.appendChild(o),i.appendChild(r),i},prompt:function(n){var i=t(n),r=document.createElement("div"),c=document.createElement("button"),o=document.createElement("input"),a=i.querySelector(e.crossBtn),d=n.cancelHandler,s=n.okHandler;return r.classList.add(e.btnsWrapper),c.innerHTML=n.okText||"Ok",c.classList.add(e.btn),c.classList.add(e.okBtn),o.classList.add(e.input),n.placeholder&&o.setAttribute("placeholder",n.placeholder),d&&"function"==typeof d&&a.addEventListener("click",d),s&&"function"==typeof s&&c.addEventListener("click",function(){s(o.value)}),c.addEventListener("click",i.remove.bind(i)),r.appendChild(o),r.appendChild(c),i.appendChild(r),i},wrapper:function(){var t=document.createElement("DIV");return t.classList.add(e.wrapper),t}}}()},function(e,t){},function(e,t,n){"use strict";e.exports=function(){function e(){if(c)return!0;c=i.wrapper(),document.body.appendChild(c)}function t(t){e();var n=null,o=t.time||8e3;switch(t.type){case"confirm":n=i.confirm(t);break;case"prompt":n=i.prompt(t);break;default:n=i.alert(t),window.setTimeout(function(){n.remove()},o)}c.appendChild(n),n.classList.add(r)}n(1);var i=n(0),r="cdx-notifies__notification--bounce-in",c=null;return{show:t}}()}]);