(self.webpackChunkgov_portal_cms=self.webpackChunkgov_portal_cms||[]).push([[740],{94445(w){function F(d,o,g,P){for(var D=-1,W=d==null?0:d.length;++D<W;){var _=d[D];o(P,_,g(_),d)}return P}w.exports=F},7233(w,F,d){var o=d(97449);function g(P,D,W,_){return o(P,function(x,O,S){D(_,x,W(x),S)}),_}w.exports=g},88532(w,F,d){var o=d(94445),g=d(7233),P=d(45353),D=d(82261);function W(_,x){return function(O,S){var z=D(O)?o:g,ee=x?x():{};return z(O,_,P(S,2),ee)}}w.exports=W},36676(w,F,d){var o=d(87212),g=1/0;function P(D){var W=D==null?0:D.length;return W?o(D,g):[]}w.exports=P},94710(w,F,d){var o=d(95292),g=d(88532),P=Object.prototype,D=P.hasOwnProperty,W=g(function(_,x,O){D.call(_,O)?_[O].push(x):o(_,O,[x])});w.exports=W},60740(w,F,d){"use strict";d.d(F,{P:()=>Tt,a:()=>Dt,u:()=>vt});var o=d(92132),g=d(21272),P=d(57237),D=d(44604),W=d(60888),_=d(50215),x=d(94061),O=d(85963),S=d(4181),z=d(90151),ee=d(68074),me=d(61485),L=d(99248),R=d(67030),K=d(6239),f=d(83997),G=d(76079),oe=d(12408),Q=d(24093),te=d(12081),N=d(30893),k=d(56445),Z=d(412),q=d(77965),r=d(33544),U=d(54894),Re=d(89032),be=d(45635),b=d(94929),de=d(9005),Ae=d(44895),Te=d(74312),Xe=d(20415),T=d(2600),je=d(35223),ve=d(37679),Oe=d(60043),he=d(88761),ce=d(94710),ye=d(39404),Os=d(36676),ne=d(57505),Es=d(59080),J=d(48940),De=d(51187),Je=d(74930);const[Ms,Ps]=(0,Re.q)("PermissionsDataManager"),ue=()=>Ps("usePermissionsDataManager"),Rs=b.Ay.div`
  position: relative;

  ${({hasConditions:e,disabled:s,theme:n})=>e&&`
    &:before {
      content: '';
      position: absolute;
      top: -3px;
      left: -10px;
      width: 6px;
      height: 6px;
      border-radius: ${20/16}rem;;
      background: ${s?n.colors.neutral100:n.colors.primary600};
    }
  `}
`,$e=({onClick:e,className:s,hasConditions:n,variant:t})=>{const{formatMessage:i}=(0,U.A)();return(0,o.jsx)(Rs,{hasConditions:n,className:s,children:(0,o.jsx)(O.$,{variant:t,startIcon:(0,o.jsx)(Xe.A,{}),onClick:e,children:i({id:"global.settings",defaultMessage:"Settings"})})})};$e.defaultProps={className:null,hasConditions:!1,variant:"tertiary"},$e.propTypes={onClick:r.func.isRequired,className:r.string,hasConditions:r.bool,variant:r.string};const Ee=(0,b.Ay)($e)``,Ts=e=>Object.values(e).map(s=>Object.entries(s).filter(([,n])=>n).map(([n])=>n)).flat(),vs=e=>e.reduce((s,[n,t])=>(s.push({label:ye(n),children:t.map(i=>({label:i.displayName,value:i.id}))}),s),[]),Ds=(e,s)=>e.map(([,n])=>n).flat().reduce((n,t)=>({[t.id]:s.includes(t.id),...n}),{}),Ye=({arrayOfOptionsGroupedByCategory:e,isFormDisabled:s,isGrey:n,label:t,name:i,onChange:a,value:l})=>{const{formatMessage:c}=(0,U.A)(),p=u=>{a(i,Ds(e,u))};return(0,o.jsxs)(f.s,{as:"li",background:n?"neutral100":"neutral0",paddingBottom:3,paddingTop:3,children:[(0,o.jsxs)(f.s,{paddingLeft:6,style:{width:180},children:[(0,o.jsxs)(N.o,{variant:"sigma",textColor:"neutral600",children:[c({id:"Settings.permissions.conditions.can",defaultMessage:"Can"}),"\xA0"]}),(0,o.jsx)(N.o,{variant:"sigma",title:t,textColor:"primary600",ellipsis:!0,children:c({id:`Settings.roles.form.permissions.${t.toLowerCase()}`,defaultMessage:t})}),(0,o.jsxs)(N.o,{variant:"sigma",textColor:"neutral600",children:["\xA0",c({id:"Settings.permissions.conditions.when",defaultMessage:"When"})]})]}),(0,o.jsx)(x.a,{style:{maxWidth:430,width:"100%"},children:(0,o.jsx)(G.B,{id:i,customizeContent:u=>`${u.length} currently selected`,onChange:p,value:Ts(l),options:vs(e),disabled:s})})]})};Ye.propTypes={arrayOfOptionsGroupedByCategory:r.array.isRequired,isFormDisabled:r.bool.isRequired,isGrey:r.bool.isRequired,label:r.string.isRequired,name:r.string.isRequired,value:r.object.isRequired,onChange:r.func.isRequired};const $s=(e,s)=>e.reduce((n,t)=>(n[t.id]=T(s,t.id,!1),n),{}),Ss=(e,s)=>e.reduce((n,t)=>{const[i,a]=t,l=$s(a,s);return n[i]=l,n},{}),Ls=(e,s,n)=>e.reduce((t,i)=>{const a=T(s,[...i.pathToConditionsObject,"conditions"],{}),l=Ss(n,a);return t[i.pathToConditionsObject.join("..")]=l,t},{}),Se=({actions:e,headerBreadCrumbs:s,isFormDisabled:n,onClosed:t,onToggle:i})=>{const{formatMessage:a}=(0,U.A)(),{availableConditions:l,modifiedData:c,onChangeConditions:p}=ue(),u=(0,g.useMemo)(()=>Object.entries(ce(l,"category")),[l]),m=e.filter(({isDisplayed:h,hasSomeActionsSelected:M,hasAllActionsSelected:j})=>h&&(M||j)),y=(0,g.useMemo)(()=>Ls(m,c,u),[m,c,u]),[A,$]=(0,g.useState)(y),E=(h,M)=>{$((0,he.Ay)(j=>{j[h]||(j[h]={}),j[h].default||(j[h].default={}),j[h].default=M}))},C=()=>{const h=Object.entries(A).reduce((M,j)=>{const[v,H]=j,B=Object.values(H).reduce((V,I)=>({...V,...I}),{});return M[v]=B,M},{});p(h),i()};return(0,o.jsxs)(me.k,{labelledBy:"condition-modal-breadcrumbs",onClose:t,children:[(0,o.jsx)(L.r,{children:(0,o.jsx)(ve.B,{id:"condition-modal-breadcrumbs",label:s.join(", "),children:s.map((h,M,j)=>(0,o.jsx)(Oe.m,{isCurrent:M===j.length-1,children:ye(a({id:h,defaultMessage:h}))},h))})}),(0,o.jsxs)(K.c,{children:[m.length===0&&(0,o.jsx)(N.o,{children:a({id:"Settings.permissions.conditions.no-actions",defaultMessage:"You first need to select actions (create, read, update, ...) before defining conditions on them."})}),(0,o.jsx)("ul",{children:m.map(({actionId:h,label:M,pathToConditionsObject:j},v)=>{const H=j.join("..");return(0,o.jsx)(Ye,{arrayOfOptionsGroupedByCategory:u,label:M,isFormDisabled:n,isGrey:v%2===0,name:H,onChange:E,value:T(A,H,{})},h)})})]}),(0,o.jsx)(R.j,{startActions:(0,o.jsx)(O.$,{variant:"tertiary",onClick:i,children:a({id:"app.components.Button.cancel",defaultMessage:"Cancel"})}),endActions:(0,o.jsx)(O.$,{onClick:C,children:a({id:"Settings.permissions.conditions.apply",defaultMessage:"Apply"})})})]})};Se.propTypes={actions:r.arrayOf(r.shape({actionId:r.string.isRequired,checkboxName:r.string,hasSomeActionsSelected:r.bool.isRequired,hasAllActionsSelected:r.bool,isDisplayed:r.bool.isRequired,label:r.string})).isRequired,headerBreadCrumbs:r.arrayOf(r.string).isRequired,isFormDisabled:r.bool.isRequired,onClosed:r.func.isRequired,onToggle:r.func.isRequired};const pe=`${120/16}rem`,Le=`${200/16}rem`,Me=`${53/16}rem`,Ie=b.Ay.div`
  width: ${pe};
`,ze=(0,b.Ay)(f.s)`
  padding-right: ${({theme:e})=>e.spaces[2]};
  overflow: hidden;
  flex: 1;
  ${({isCollapsable:e})=>e&&"cursor: pointer;"}
`,Be=({children:e,isCollapsable:s,isActive:n,isFormDisabled:t,label:i,onChange:a,onClick:l,checkboxName:c,someChecked:p,value:u})=>{const{formatMessage:m}=(0,U.A)();return(0,o.jsxs)(f.s,{alignItems:"center",paddingLeft:6,style:{width:Le,flexShrink:0},children:[(0,o.jsx)(x.a,{paddingRight:2,children:(0,o.jsx)(_.J,{name:c,"aria-label":m({id:"Settings.permissions.select-all-by-permission",defaultMessage:"Select all {label} permissions"},{label:i}),disabled:t,onValueChange:y=>a({target:{name:c,value:y}}),indeterminate:p,value:u})}),(0,o.jsxs)(ze,{title:i,alignItems:"center",isCollapsable:s,...s&&{onClick:l,"aria-expanded":n,onKeyDown:({key:y})=>(y==="Enter"||y===" ")&&l(),tabIndex:0,role:"button"},children:[(0,o.jsx)(N.o,{fontWeight:n?"bold":"",textColor:n?"primary600":"neutral800",ellipsis:!0,children:ye(i)}),e]})]})};Be.defaultProps={children:null,checkboxName:"",onChange(){},value:!1,someChecked:!1,isCollapsable:!1},Be.propTypes={checkboxName:r.string,children:r.node,label:r.string.isRequired,isCollapsable:r.bool,isFormDisabled:r.bool.isRequired,onChange:r.func,onClick:r.func.isRequired,someChecked:r.bool,value:r.bool,isActive:r.bool.isRequired};const Qe=(0,g.memo)(Be),ie=e=>ne(e)?Os(Object.values(e).map(s=>ne(s)?ie(s):s)):[],We=e=>e?Object.keys(e).reduce((s,n)=>(n!=="conditions"&&(s[n]=e[n]),s),{}):null,re=e=>{const s=We(e),n=ie(s);if(!n.length)return{hasAllActionsSelected:!1,hasSomeActionsSelected:!1};const t=n.every(a=>a),i=n.some(a=>a)&&!t;return{hasAllActionsSelected:t,hasSomeActionsSelected:i}},Ce=(0,b.Ay)(de.A)`
  display: none;
  width: ${10/16}rem;
  transform: rotate(${({$isActive:e})=>e?"180":"0"}deg);
  margin-left: ${({theme:e})=>e.spaces[2]};
`,xe=e=>`
  ${N.o} {
    color: ${e.colors.primary600};
    font-weight: ${e.fontWeights.bold}
  }
  ${Ce} {
    display: block;
    path {
      fill: ${e.colors.primary600}
    };
  }
`,Is=(e,s,n)=>e.map(({actionId:t,isDisplayed:i,applyToProperties:a,label:l})=>{if(!i)return{actionId:t,hasSomeActionsSelected:!1,isDisplayed:i};const c=[...n.split(".."),t],p=q(a)?[...c,"properties","enabled"]:c,u=p.join(".."),m=T(s,[...c,"conditions"],null),y=ie(m).some(C=>C);if(q(a)){const C=T(s,p,!1);return{actionId:t,checkboxName:u,hasAllActionsSelected:C,hasConditions:y,hasSomeActionsSelected:C,isDisplayed:i,isParentCheckbox:!1,label:l,pathToConditionsObject:c}}const A=T(s,p,null),{hasAllActionsSelected:$,hasSomeActionsSelected:E}=re(A);return{actionId:t,checkboxName:u,hasAllActionsSelected:$,hasConditions:y,hasSomeActionsSelected:E,isDisplayed:i,isParentCheckbox:!0,label:l,pathToConditionsObject:c}}),Ke=(e,s)=>`
  ${Ze} {
    background-color: ${e.colors.primary100};
    color: ${e.colors.primary600};
    border-radius: ${s?"2px 2px 0 0":"2px"};
  }
  ${ss} {
    display: flex;
  }
  ${Ee} {
    display: block;
  }
  &:hover {
   ${xe(e)}
  }

  &:focus-within {
    ${({theme:n,isActive:t})=>Ke(n,t)}
  }
  
`,Ze=b.Ay.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: ${Me};
  background-color: ${({isGrey:e,theme:s})=>e?s.colors.neutral100:s.colors.neutral0};
  border: 1px solid transparent;
`,Bs=b.Ay.div`
  display: inline-flex;
  min-width: 100%;

  ${Ee} {
    display: none;
  }
  ${({isActive:e,theme:s})=>e&&Ke(s,e)}
  &:hover {
    ${({theme:e,isActive:s})=>Ke(e,s)}
  }
`,es=(0,b.Ay)(f.s)`
  width: ${pe};
  position: relative;
`,ss=(0,b.Ay)(x.a)`
  display: none;
  svg {
    width: 11px;
  }
  * {
    fill: ${({theme:e})=>e.colors.primary600};
  }
`,ts=b.Ay.span`
  position: absolute;
  top: -6px;
  left: 37px;
  width: 6px;
  height: 6px;
  border-radius: 20px;
  background: ${({theme:e})=>e.colors.primary600};
`,Ws=(0,b.Ay)(x.a)`
  position: absolute;
  right: 9px;
  transform: translateY(10px);
`,ns=({availableActions:e,isActive:s,isGrey:n,isFormDisabled:t,label:i,onClickToggle:a,pathToData:l})=>{const[c,p]=(0,g.useState)(!1),{formatMessage:u}=(0,U.A)(),{modifiedData:m,onChangeParentCheckbox:y,onChangeSimpleCheckbox:A}=ue(),$=()=>{p(B=>!B)},E=()=>{p(!1)},C=T(m,l.split(".."),{}),h=(0,g.useMemo)(()=>Object.keys(C).reduce((B,V)=>(B[V]=je(C[V],"conditions"),B),{}),[C]),{hasAllActionsSelected:M,hasSomeActionsSelected:j}=re(h),v=(0,g.useMemo)(()=>Is(e,m,l),[e,m,l]),H=v.some(({hasConditions:B})=>B);return(0,o.jsxs)(Bs,{isActive:s,children:[(0,o.jsxs)(Ze,{isGrey:n,children:[(0,o.jsx)(Qe,{isCollapsable:!0,isFormDisabled:t,label:i,checkboxName:l,onChange:y,onClick:a,someChecked:j,value:M,isActive:s,children:(0,o.jsx)(ss,{paddingLeft:2,children:s?(0,o.jsx)(Te.A,{}):(0,o.jsx)(Ae.A,{})})}),(0,o.jsx)(f.s,{style:{flex:1},children:v.map(({actionId:B,hasConditions:V,hasAllActionsSelected:I,hasSomeActionsSelected:Y,isDisplayed:ge,isParentCheckbox:X,checkboxName:se,label:_e})=>ge?X?(0,o.jsxs)(es,{justifyContent:"center",alignItems:"center",children:[V&&(0,o.jsx)(ts,{}),(0,o.jsx)(_.J,{disabled:t,name:se,"aria-label":u({id:"Settings.permissions.select-by-permission",defaultMessage:"Select {label} permission"},{label:`${_e} ${i}`}),onValueChange:ae=>{y({target:{name:se,value:ae}})},indeterminate:Y,value:I})]},B):(0,o.jsxs)(es,{justifyContent:"center",alignItems:"center",children:[V&&(0,o.jsx)(ts,{}),(0,o.jsx)(_.J,{disabled:t,indeterminate:V,name:se,onValueChange:ae=>{A({target:{name:se,value:ae}})},value:I})]},B):(0,o.jsx)(Ie,{},B))}),c&&(0,o.jsx)(Se,{headerBreadCrumbs:[i,"Settings.permissions.conditions.conditions"],actions:v,isFormDisabled:t,onClosed:E,onToggle:$})]}),(0,o.jsx)(Ws,{children:(0,o.jsx)(Ee,{onClick:$,hasConditions:H})})]})};ns.propTypes={availableActions:r.array.isRequired,isActive:r.bool.isRequired,isGrey:r.bool.isRequired,isFormDisabled:r.bool.isRequired,label:r.string.isRequired,onClickToggle:r.func.isRequired,pathToData:r.string.isRequired};const Ks=b.Ay.span`
  color: ${({theme:e})=>e.colors.danger700};
  padding-left: ${({theme:e})=>e.spaces[1]}px;
`,os=()=>(0,o.jsx)(Ks,{children:"*"}),ks=(e,s)=>e.map(n=>{const t=Array.isArray(n.subjects)&&n.subjects.indexOf(s)!==-1;return{...n,isDisplayed:t}}),Us=(0,b.Ay)(x.a)`
  transform: translate(-4px, -12px);

  &:before {
    content: '';
    width: ${4/16}rem;
    height: ${12/16}rem;
    background: ${({theme:e})=>e.colors.primary200};
    display: block;
  }
`,Fs=b.Ay.svg`
  position: relative;
  flex-shrink: 0;
  transform: translate(-0.5px, -1px);

  * {
    fill: ${({theme:e,color:s})=>e.colors[s]};
  }
`,ke=e=>(0,o.jsx)(Us,{children:(0,o.jsx)(Fs,{width:"20",height:"23",viewBox:"0 0 20 23",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,o.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.02477 14.7513C8.65865 17.0594 11.6046 18.6059 17.5596 18.8856C18.6836 18.9384 19.5976 19.8435 19.5976 20.9688V20.9688C19.5976 22.0941 18.6841 23.0125 17.5599 22.9643C10.9409 22.6805 6.454 20.9387 3.75496 17.1258C0.937988 13.1464 0.486328 7.39309 0.486328 0.593262H4.50974C4.50974 7.54693 5.06394 11.9813 7.02477 14.7513Z",fill:"#D9D8FF"})})});ke.defaultProps={fill:"primary200"},ke.propTypes={fill:r.string};const Ns=(0,g.memo)(ke),is=(0,b.Ay)(f.s)`
  width: ${pe};
  position: relative;
`,Vs=(0,b.Ay)(f.s)`
  height: ${Me};
`,qs=(0,b.Ay)(x.a)`
  padding-left: ${31/16}rem;
`,ws=(0,b.Ay)(x.a)`
  border-left: ${({isVisible:e,theme:s})=>e?`4px solid ${s.colors.primary200}`:"4px solid transparent"};
`,Hs=(0,b.Ay)(f.s)`
  padding-left: ${({theme:e})=>e.spaces[4]};
  width: ${({level:e})=>145-e*36}px;

  ${({isCollapsable:e,theme:s})=>e&&`
      ${Ce} {
        display: block;
        color: ${s.colors.neutral100};
      }
      &:hover {
        ${xe(s)}
      }
  `}
  ${({isActive:e,theme:s})=>e&&xe(s)};
`,Gs=b.Ay.div`
  padding-top: ${({theme:e})=>e.spaces[2]};
  margin-top: ${({theme:e})=>e.spaces[2]};
  width: ${4/16}rem;
  background-color: ${({theme:e})=>e.colors.primary200};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`,Ue=({childrenForm:e,isFormDisabled:s,recursiveLevel:n,pathToDataFromActionRow:t,propertyActions:i,parentName:a,propertyName:l})=>{const{formatMessage:c}=(0,U.A)(),{modifiedData:p,onChangeParentCheckbox:u,onChangeSimpleCheckbox:m}=ue(),[y,A]=(0,g.useState)(null),$=C=>{A(h=>h===C?null:C)},E=(0,g.useMemo)(()=>y?e.find(({value:C})=>C===y):null,[y,e]);return(0,o.jsxs)(qs,{children:[(0,o.jsx)(Gs,{}),e.map(({label:C,value:h,required:M,children:j},v)=>{const H=v+1<e.length,B=Array.isArray(j),V=y===h;return(0,o.jsxs)(ws,{isVisible:H,children:[(0,o.jsxs)(Vs,{children:[(0,o.jsx)(Ns,{color:"primary200"}),(0,o.jsxs)(f.s,{style:{flex:1},children:[(0,o.jsx)(Hs,{level:n,isActive:V,isCollapsable:B,children:(0,o.jsxs)(ze,{alignItems:"center",isCollapsable:B,...B&&{onClick:()=>$(h),"aria-expanded":V,onKeyDown:({key:I})=>(I==="Enter"||I===" ")&&$(h),tabIndex:0,role:"button"},title:C,children:[(0,o.jsx)(N.o,{ellipsis:!0,children:ye(C)}),M&&(0,o.jsx)(os,{}),(0,o.jsx)(Ce,{$isActive:V})]})}),(0,o.jsx)(f.s,{style:{flex:1},children:i.map(({actionId:I,label:Y,isActionRelatedToCurrentProperty:ge})=>{if(!ge)return(0,o.jsx)(Ie,{},I);const X=[...t.split(".."),I,"properties",l,...a.split(".."),h],se=T(p,X,!1);if(!j)return(0,o.jsx)(is,{justifyContent:"center",alignItems:"center",children:(0,o.jsx)(_.J,{disabled:s,name:X.join(".."),"aria-label":c({id:"Settings.permissions.select-by-permission",defaultMessage:"Select {label} permission"},{label:`${a} ${C} ${Y}`}),onValueChange:le=>{m({target:{name:X.join(".."),value:le}})},value:se})},Y);const{hasAllActionsSelected:_e,hasSomeActionsSelected:ae}=re(se);return(0,o.jsx)(is,{justifyContent:"center",alignItems:"center",children:(0,o.jsx)(_.J,{disabled:s,name:X.join(".."),"aria-label":c({id:"Settings.permissions.select-by-permission",defaultMessage:"Select {label} permission"},{label:`${a} ${C} ${Y}`}),onValueChange:le=>{u({target:{name:X.join(".."),value:le}})},value:_e,indeterminate:ae},Y)},Y)})})]})]}),E&&V&&(0,o.jsx)(x.a,{paddingBottom:2,children:(0,o.jsx)(Ue,{isFormDisabled:s,parentName:`${a}..${h}`,pathToDataFromActionRow:t,propertyActions:i,propertyName:l,recursiveLevel:n+1,childrenForm:E.children})})]},h)})]})};Ue.propTypes={childrenForm:r.array.isRequired,isFormDisabled:r.bool.isRequired,parentName:r.string.isRequired,pathToDataFromActionRow:r.string.isRequired,propertyActions:r.array.isRequired,propertyName:r.string.isRequired,recursiveLevel:r.number.isRequired};const Xs=(0,g.memo)(Ue),Js=e=>e.reduce((n,t)=>(t.isActionRelatedToCurrentProperty&&n.push(t.actionId),n),[]),Ys=(e,s,n,t,i)=>{const l=Js(e).reduce((c,p)=>{const u=[...n.split(".."),p,"properties",t,i],m=T(s,u,!1);return c[p]=m,c},{});return re(l)},rs=(0,b.Ay)(f.s)`
  width: ${pe};
  position: relative;
`,zs=(0,b.Ay)(f.s)`
  height: ${Me};
  flex: 1;

  ${({isCollapsable:e,theme:s})=>e&&`
      ${Ce} {
        display: block;
        color: ${s.colors.neutral100};
      }
      &:hover {
        ${xe(s)}
      }
  `}
  ${({isActive:e,theme:s})=>e&&xe(s)};
`,Fe=({childrenForm:e,label:s,isFormDisabled:n,name:t,required:i,pathToData:a,propertyActions:l,propertyName:c,isOdd:p})=>{const{formatMessage:u}=(0,U.A)(),[m,y]=(0,g.useState)(null),{modifiedData:A,onChangeCollectionTypeLeftActionRowCheckbox:$,onChangeParentCheckbox:E,onChangeSimpleCheckbox:C}=ue(),h=m===t,M=(0,g.useMemo)(()=>Array.isArray(e)?e:[],[e]),j=M.length>0,v=(0,g.useCallback)(()=>{j&&y(I=>I===t?null:t)},[j,t]),H=({target:{value:I}})=>{$(a,c,t,I)},{hasAllActionsSelected:B,hasSomeActionsSelected:V}=(0,g.useMemo)(()=>Ys(l,A,a,c,t),[l,A,a,c,t]);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(zs,{alignItems:"center",isCollapsable:j,isActive:h,background:p?"neutral100":"neutral0",children:(0,o.jsxs)(f.s,{children:[(0,o.jsxs)(Qe,{onChange:H,onClick:v,isCollapsable:j,isFormDisabled:n,label:s,someChecked:V,value:B,isActive:h,children:[i&&(0,o.jsx)(os,{}),(0,o.jsx)(Ce,{$isActive:h})]}),(0,o.jsx)(f.s,{children:l.map(({label:I,isActionRelatedToCurrentProperty:Y,actionId:ge})=>{if(!Y)return(0,o.jsx)(Ie,{},I);const X=[...a.split(".."),ge,"properties",c,t];if(!j){const le=T(A,X,!1);return(0,o.jsx)(rs,{justifyContent:"center",alignItems:"center",children:(0,o.jsx)(_.J,{disabled:n,name:X.join(".."),"aria-label":u({id:"Settings.permissions.select-by-permission",defaultMessage:"Select {label} permission"},{label:`${t} ${I}`}),onValueChange:$t=>{C({target:{name:X.join(".."),value:$t}})},value:le})},ge)}const se=T(A,X,{}),{hasAllActionsSelected:_e,hasSomeActionsSelected:ae}=re(se);return(0,o.jsx)(rs,{justifyContent:"center",alignItems:"center",children:(0,o.jsx)(_.J,{disabled:n,name:X.join(".."),onValueChange:le=>{E({target:{name:X.join(".."),value:le}})},"aria-label":u({id:"Settings.permissions.select-by-permission",defaultMessage:"Select {label} permission"},{label:`${t} ${I}`}),value:_e,indeterminate:ae})},I)})})]})}),h&&(0,o.jsx)(Xs,{childrenForm:M,isFormDisabled:n,parentName:t,pathToDataFromActionRow:a,propertyName:c,propertyActions:l,recursiveLevel:0})]})};Fe.defaultProps={childrenForm:[],required:!1},Fe.propTypes={childrenForm:r.array,label:r.string.isRequired,isFormDisabled:r.bool.isRequired,name:r.string.isRequired,pathToData:r.string.isRequired,propertyActions:r.array.isRequired,propertyName:r.string.isRequired,required:r.bool,isOdd:r.bool.isRequired};const Qs=(0,g.memo)(Fe),as=(0,b.Ay)(f.s)`
  width: ${pe};
  flex-shrink: 0;
`,Zs=(0,b.Ay)(f.s)`
  width: ${Le};
  height: ${Me};
  flex-shrink: 0;
`,ls=({headers:e,label:s})=>{const{formatMessage:n}=(0,U.A)(),t=n({id:"Settings.roles.form.permission.property-label",defaultMessage:"{label} permissions"},{label:s});return(0,o.jsxs)(f.s,{children:[(0,o.jsx)(Zs,{alignItems:"center",paddingLeft:6,children:(0,o.jsx)(N.o,{variant:"sigma",textColor:"neutral500",children:t})}),e.map(i=>i.isActionRelatedToCurrentProperty?(0,o.jsx)(as,{justifyContent:"center",children:(0,o.jsx)(N.o,{variant:"sigma",textColor:"neutral500",children:n({id:`Settings.roles.form.permissions.${i.label.toLowerCase()}`,defaultMessage:i.label})})},i.label):(0,o.jsx)(as,{},i.label))]})};ls.propTypes={headers:r.arrayOf(r.shape({label:r.string.isRequired,isActionRelatedToCurrentProperty:r.bool.isRequired})).isRequired,label:r.string.isRequired};const et=(e,s)=>e.map(n=>{const t=Array.isArray(n.applyToProperties)&&n.applyToProperties.indexOf(s)!==-1&&n.isDisplayed;return{label:n.label,actionId:n.actionId,isActionRelatedToCurrentProperty:t}}),st=b.Ay.div`
  display: inline-flex;
  flex-direction: column;
  min-width: 0;
`,ds=({availableActions:e,childrenForm:s,isFormDisabled:n,label:t,pathToData:i,propertyName:a})=>{const l=(0,g.useMemo)(()=>et(e,a),[e,a]);return(0,o.jsxs)(st,{children:[(0,o.jsx)(ls,{label:t,headers:l}),(0,o.jsx)(x.a,{children:s.map(({children:c,label:p,value:u,required:m},y)=>(0,o.jsx)(Qs,{childrenForm:c,label:p,isFormDisabled:n,name:u,required:m,propertyActions:l,pathToData:i,propertyName:a,isOdd:y%2===0},u))})]})};ds.propTypes={childrenForm:r.array.isRequired,availableActions:r.array.isRequired,isFormDisabled:r.bool.isRequired,label:r.string.isRequired,pathToData:r.string.isRequired,propertyName:r.string.isRequired};const tt=b.Ay.div`
  flex-direction: column;
  display: inline-flex;
  min-width: 100%;
  ${({theme:e,isActive:s})=>s&&`border: 1px solid ${e.colors.primary600};`}
`,cs=({allActions:e,contentTypeName:s,label:n,index:t,isActive:i,isFormDisabled:a,onClickToggleCollapse:l,pathToData:c,properties:p})=>{const u=(0,g.useCallback)(()=>{l(s)},[s,l]),m=(0,g.useMemo)(()=>ks(e,s),[e,s]);return(0,o.jsxs)(tt,{isActive:i,children:[(0,o.jsx)(ns,{availableActions:m,isActive:i,isGrey:t%2===0,isFormDisabled:a,label:n,onClickToggle:u,pathToData:c}),i&&p.map(({label:y,value:A,children:$})=>(0,o.jsx)(ds,{availableActions:m,childrenForm:$,isFormDisabled:a,label:y,pathToData:c,propertyName:A},A))]})};cs.propTypes={allActions:r.array.isRequired,contentTypeName:r.string.isRequired,index:r.number.isRequired,isActive:r.bool.isRequired,isFormDisabled:r.bool.isRequired,label:r.string.isRequired,onClickToggleCollapse:r.func.isRequired,pathToData:r.string.isRequired,properties:r.array.isRequired};const Ne=({actions:e,isFormDisabled:s,pathToData:n,subjects:t})=>{const[i,a]=(0,g.useState)(null),l=c=>{a(i===c?null:c)};return t.map(({uid:c,label:p,properties:u},m)=>(0,o.jsx)(cs,{allActions:e,contentTypeName:c,label:p,isActive:i===c,isFormDisabled:s,index:m,onClickToggleCollapse:l,pathToData:`${n}..${c}`,properties:u},c))};Ne.defaultProps={actions:[],subjects:[]},Ne.propTypes={actions:r.array.isRequired,isFormDisabled:r.bool.isRequired,pathToData:r.string.isRequired,subjects:r.arrayOf(r.shape({uid:r.string.isRequired,label:r.string.isRequired,properties:r.array.isRequired}))};const nt=(0,g.memo)(Ne),ot=e=>e.filter(({subjects:s})=>s&&s.length),it=e=>e.map(({actionId:s})=>s),rt=(e,s)=>e.reduce((n,t)=>(Object.keys(s).forEach(i=>{const a=T(s,[i,t],{}),l={[i]:We(a)};n[t]?n[t]={...n[t],...l}:n[t]=l}),n),{}),at=(e,s)=>{const n=it(e),t=rt(n,s);return Object.keys(t).reduce((a,l)=>(a[l]=re(t[l]),a),{})},lt=(0,b.Ay)(f.s)`
  width: ${pe};
  flex-shrink: 0;
`,Ve=({actions:e,isFormDisabled:s,kind:n})=>{const{formatMessage:t}=(0,U.A)(),{modifiedData:i,onChangeCollectionTypeGlobalActionCheckbox:a}=ue(),l=(0,g.useMemo)(()=>ot(e),[e]),c=(0,g.useMemo)(()=>at(l,i[n]),[i,l,n]);return(0,o.jsx)(x.a,{paddingBottom:4,paddingTop:6,style:{paddingLeft:Le},children:(0,o.jsx)(f.s,{gap:0,children:l.map(({label:p,actionId:u})=>(0,o.jsxs)(lt,{direction:"column",alignItems:"center",justifyContent:"center",gap:3,children:[(0,o.jsx)(N.o,{variant:"sigma",textColor:"neutral500",children:t({id:`Settings.roles.form.permissions.${p.toLowerCase()}`,defaultMessage:p})}),(0,o.jsx)(_.J,{disabled:s,onValueChange:m=>{a(n,u,m)},name:u,"aria-label":t({id:"Settings.permissions.select-all-by-permission",defaultMessage:"Select all {label} permissions"},{label:t({id:`Settings.roles.form.permissions.${p.toLowerCase()}`,defaultMessage:p})}),value:T(c,[u,"hasAllActionsSelected"],!1),indeterminate:T(c,[u,"hasSomeActionsSelected"],!1)})]},u))})})};Ve.defaultProps={actions:[]},Ve.propTypes={actions:r.arrayOf(r.shape({label:r.string.isRequired,actionId:r.string.isRequired,subjects:r.array.isRequired})),isFormDisabled:r.bool.isRequired,kind:r.string.isRequired};const dt=(0,g.memo)(Ve),ct=(0,b.Ay)(x.a)`
  overflow-x: auto;
`,us=({isFormDisabled:e,kind:s,layout:{actions:n,subjects:t}})=>{const i=be([...t],"label");return(0,o.jsxs)(ct,{background:"neutral0",children:[(0,o.jsx)(dt,{actions:n,kind:s,isFormDisabled:e}),(0,o.jsx)(nt,{actions:n,isFormDisabled:e,pathToData:s,subjects:i})]})};us.propTypes={isFormDisabled:r.bool.isRequired,kind:r.string.isRequired,layout:r.shape({actions:r.array,subjects:r.arrayOf(r.shape({uid:r.string.isRequired,label:r.string.isRequired,properties:r.array.isRequired}))}).isRequired};const ps=(0,g.memo)(us),ut=(e,s,n)=>e.map(t=>{const i=[...n,t.action,"properties","enabled"],a=T(s,i,!1),l=T(s,[...n,t.action,"conditions"],{}),c=ie(l).some(p=>p);return{...t,isDisplayed:a,checkboxName:i.join(".."),hasSomeActionsSelected:a,value:a,hasConditions:c,label:t.displayName,actionId:t.action,pathToConditionsObject:[...n,t.action]}}),pt=e=>{const s=Object.entries(e).reduce((t,i)=>{const[a,{conditions:l}]=i;return t[a]=l,t},{});return ie(s).some(t=>t)},gt=b.Ay.div`
  flex: 1;
  align-self: center;
  border-top: 1px solid ${({theme:e})=>e.colors.neutral150};
`,mt=b.Ay.div`
  position: relative;
  word-break: keep-all;
  ${({hasConditions:e,disabled:s,theme:n})=>e&&`
    &:before {
      content: '';
      position: absolute;
      top: ${-4/16}rem;
      left: ${-8/16}rem;
      width: ${6/16}rem;
      height: ${6/16}rem;
      border-radius: ${20/16}rem;
      background: ${s?n.colors.neutral100:n.colors.primary600};
    }
  `}
`,gs=({categoryName:e,isFormDisabled:s,subCategoryName:n,actions:t,pathToData:i})=>{const[a,l]=(0,g.useState)(!1),{modifiedData:c,onChangeParentCheckbox:p,onChangeSimpleCheckbox:u}=ue(),{formatMessage:m}=(0,U.A)(),y=T(c,i,{}),A=(0,g.useMemo)(()=>Object.keys(y).reduce((v,H)=>(v[H]=We(y[H]),v),{}),[y]),{hasAllActionsSelected:$,hasSomeActionsSelected:E}=re(A),C=()=>{l(v=>!v)},h=()=>{l(!1)},M=ut(t,c,i),j=pt(T(c,[...i],{}));return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsxs)(x.a,{children:[(0,o.jsxs)(f.s,{justifyContent:"space-between",alignItems:"center",children:[(0,o.jsx)(x.a,{paddingRight:4,children:(0,o.jsx)(N.o,{variant:"sigma",textColor:"neutral600",children:n})}),(0,o.jsx)(gt,{}),(0,o.jsx)(x.a,{paddingLeft:4,children:(0,o.jsx)(S.S,{name:i.join(".."),disabled:s,onValueChange:v=>{p({target:{name:i.join(".."),value:v}})},indeterminate:E,value:$,children:m({id:"app.utils.select-all",defaultMessage:"Select all"})})})]}),(0,o.jsxs)(f.s,{paddingTop:6,paddingBottom:6,children:[(0,o.jsx)(z.x,{gap:2,style:{flex:1},children:M.map(({checkboxName:v,value:H,action:B,displayName:V,hasConditions:I})=>(0,o.jsx)(ee.E,{col:3,children:(0,o.jsx)(mt,{disabled:s,hasConditions:I,children:(0,o.jsx)(S.S,{name:v,disabled:s,onValueChange:Y=>{u({target:{name:v,value:Y}})},value:H,children:V})})},B))}),(0,o.jsx)(Ee,{hasConditions:j,onClick:C})]})]}),a&&(0,o.jsx)(Se,{headerBreadCrumbs:[e,n],actions:M,isFormDisabled:s,onClosed:h,onToggle:C})]})};gs.propTypes={actions:r.array.isRequired,categoryName:r.string.isRequired,isFormDisabled:r.bool.isRequired,subCategoryName:r.string.isRequired,pathToData:r.array.isRequired};const qe=({childrenForm:e,kind:s,name:n,isOpen:t,isFormDisabled:i,isWhite:a,onOpenCategory:l,pathToData:c})=>{const{formatMessage:p}=(0,U.A)(),u=()=>{l(n)},m=(0,g.useMemo)(()=>n.split("::").pop(),[n]);return(0,o.jsxs)(P.n,{expanded:t,onToggle:u,id:`accordion-${n}`,variant:a?"primary":"secondary",children:[(0,o.jsx)(W.P,{title:ye(m),description:`${p({id:"Settings.permissions.category"},{category:m})} ${s==="plugins"?"plugin":s}`}),(0,o.jsx)(D.u,{children:(0,o.jsx)(x.a,{padding:6,children:e.map(({actions:y,subCategoryName:A,subCategoryId:$})=>(0,o.jsx)(gs,{actions:y,categoryName:m,isFormDisabled:i,subCategoryName:A,pathToData:[...c,$]},A))})})]})};qe.defaultProps={},qe.propTypes={childrenForm:r.array.isRequired,isOpen:r.bool.isRequired,isFormDisabled:r.bool.isRequired,isWhite:r.bool.isRequired,kind:r.string.isRequired,name:r.string.isRequired,onOpenCategory:r.func.isRequired,pathToData:r.array.isRequired};const we=({isFormDisabled:e,kind:s,layout:n})=>{const[t,i]=(0,g.useState)(null),a=l=>{i(l===t?null:l)};return(0,o.jsx)(x.a,{padding:6,background:"neutral0",children:n.map(({category:l,categoryId:c,childrenForm:p},u)=>(0,o.jsx)(qe,{childrenForm:p,kind:s,isFormDisabled:e,isOpen:t===l,isWhite:u%2===1,name:l,onOpenCategory:a,pathToData:[s,c]},l))})};we.propTypes={isFormDisabled:r.bool.isRequired,kind:r.string.isRequired,layout:r.arrayOf(r.shape({category:r.string.isRequired,categoryId:r.string.isRequired,childrenForm:r.arrayOf(r.shape({actions:r.array.isRequired})).isRequired}).isRequired).isRequired};const ms=(e,s,n)=>e.find(t=>t.action===s&&t.subject===n),hs=(e,s=[])=>e.reduce((n,t)=>(n[t.id]=s.indexOf(t.id)!==-1,n),{}),ys=({children:e},s,n="")=>e.reduce((t,i)=>{if(i.children)return{...t,[i.value]:ys(i,s,`${n}${i.value}.`)};const a=s.indexOf(`${n}${i.value}`)!==-1;return t[i.value]=a,t},{}),ht=(e,s,n)=>e.reduce((t,i)=>{const a=s.properties.find(({value:l})=>l===i);if(a){const l=T(n,["properties",a.value],[]),c=ys(a,l);t.properties[i]=c}return t},{properties:{}}),yt=(e,s)=>s.reduce((n,t)=>{const i=e.find(({uid:a})=>a===t)||null;return i&&(n[t]=i),n},{}),Cs=({subjects:e},s,n,t=[])=>s.reduce((i,a)=>{const l=a.subjects,c=yt(e,l);if(q(c))return i;const p=Object.keys(c).reduce((u,m)=>{const{actionId:y,applyToProperties:A}=a,C=c[m].properties.map(({value:v})=>v).every(v=>(A||[]).indexOf(v)===-1),h=ms(t,y,m),M=hs(n,T(h,"conditions",[]));if(q(A)||C)return J(u,[m,y],{properties:{enabled:h!==void 0},conditions:M}),u;const j=ht(A,c[m],h);return J(u,[m,y],{...j,conditions:M}),u},{});return Es(i,p)},{}),Ct=(e,s,n)=>e.reduce((t,i)=>{const a=ms(n,i.action,null);return t[i.action]={properties:{enabled:a!==void 0},conditions:hs(s,a?.conditions??[])},t},{}),xt=(e,s,n)=>e.reduce((t,i)=>(t[i.subCategoryId]=Ct(i.actions,s,n),t),{}),xs=(e,s,n=[])=>e.reduce((t,{categoryId:i,childrenForm:a})=>{const l=xt(a,s,n);return t[i]=l,t},{}),fs=e=>e.split(" ").join("-"),_s=(e,s)=>Object.entries(ce(e,s)).map(([n,t])=>({category:n,categoryId:fs(n),childrenForm:Object.entries(ce(t,"subCategory")).map(([i,a])=>({subCategoryName:i,subCategoryId:fs(i),actions:a}))})),ft=(e,s)=>{const{conditions:n,sections:{collectionTypes:t,singleTypes:i,plugins:a,settings:l}}=e,c={collectionTypes:t,singleTypes:i,plugins:_s(a,"plugin"),settings:_s(l,"category")},p={collectionTypes:Cs(t,t.actions||[],n,s),singleTypes:Cs(i,i.actions||[],n,s),plugins:xs(c.plugins,n,s),settings:xs(c.settings,n,s)};return{initialData:p,modifiedData:p,layouts:c}},Pe=e=>Object.keys(e).reduce((s,n)=>{const t=e[n];if(ne(t)&&!Z(t,"conditions"))return{...s,[n]:Pe(t)};if(ne(t)&&Z(t,"conditions")&&!ie(je(t,"conditions")).some(a=>a)){const a=Object.keys(t.conditions).reduce((l,c)=>(l[c]=!1,l),{});return{...s,[n]:{...t,conditions:a}}}return s[n]=t,s},{}),fe=(e,s,n=!1)=>Object.keys(e).reduce((t,i)=>{const a=e[i];return i==="conditions"&&!n?(t[i]=a,t):ne(a)?{...t,[i]:fe(a,s,i==="fields")}:(t[i]=s,t)},{}),_t={initialData:{},modifiedData:{},layouts:{}},bt=(e,s)=>(0,he.Ay)(e,n=>{switch(s.type){case"ON_CHANGE_COLLECTION_TYPE_GLOBAL_ACTION_CHECKBOX":{const{collectionTypeKind:t,actionId:i,value:a}=s,l=["modifiedData",t];Object.keys(T(e,l)).forEach(c=>{const p=T(e,[...l,c,i],void 0);if(p){let u=fe(p,a);if(!a&&u.conditions){const m=fe(u.conditions,!1);u={...u,conditions:m}}J(n,[...l,c,i],u)}});break}case"ON_CHANGE_COLLECTION_TYPE_ROW_LEFT_CHECKBOX":{const{pathToCollectionType:t,propertyName:i,rowName:a,value:l}=s;let c=De(e.modifiedData);const p=t.split(".."),u=T(c,p,{});Object.keys(u).forEach(m=>{if(Z(u[m],`properties.${i}`)){const y=T(u,[m,"properties",i,a]),A=[...p,m,"properties",i,a];if(!ne(y))J(c,A,l);else{const $=fe(y,l);J(c,A,$)}}}),l||(c=Pe(c)),J(n,"modifiedData",c);break}case"ON_CHANGE_CONDITIONS":{Object.entries(s.conditions).forEach(t=>{const[i,a]=t;J(n,["modifiedData",...i.split(".."),"conditions"],a)});break}case"ON_CHANGE_SIMPLE_CHECKBOX":{let t=De(e.modifiedData);J(t,[...s.keys.split("..")],s.value),s.value||(t=Pe(t)),J(n,"modifiedData",t);break}case"ON_CHANGE_TOGGLE_PARENT_CHECKBOX":{const{keys:t,value:i}=s,a=[...t.split("..")];let l=De(e.modifiedData);const c=T(l,a,{}),p=fe(c,i);J(l,a,p),i||(l=Pe(l)),J(n,["modifiedData"],l);break}case"RESET_FORM":{n.modifiedData=e.initialData;break}case"SET_FORM_AFTER_SUBMIT":{n.initialData=e.modifiedData;break}default:return n}}),He=e=>Object.entries(e).filter(([,s])=>s).map(([s])=>s),At=e=>{const[s,{conditions:n}]=e;return{action:s,subject:null,conditions:He(n),properties:{}}},jt=e=>Object.values(e).reduce((s,n)=>{const t=Object.entries(n).reduce((i,a)=>{const[,{properties:{enabled:l}}]=a;if(!l)return i;const c=At(a);return i.push(c),i},[]);return[...s,...t]},[]),bs=e=>Object.values(e).reduce((s,n)=>{const t=jt(n);return[...s,...t]},[]),As=(e,s="")=>Object.entries(e).reduce((n,t)=>{const[i,a]=t;return ne(a)?[...n,...As(a,`${s}${i}.`)]:(a&&!ne(a)&&n.push(`${s}${i}`),n)},[]),Ot=(e,s,{conditions:n,properties:t})=>Object.entries(t).reduce((i,a)=>{const[l,c]=a;return i.properties[l]=As(c),i},{action:e,subject:s,conditions:He(n),properties:{}}),Et=(e,s,{conditions:n})=>({action:e,subject:s,properties:{},conditions:He(n)}),Mt=(e,s)=>Object.entries(s).reduce((t,i)=>{const[a,l]=i;if(!ie(l).some(u=>u))return t;if(!l?.properties?.enabled){const u=Ot(a,e,l);return[...t,u]}if(!l.properties.enabled)return t;const p=Et(a,e,l);return t.push(p),t},[]),js=e=>Object.entries(e).reduce((n,t)=>{const[i,a]=t,l=Mt(i,a);return[...n,...l]},[]),Pt=e=>{const s=bs(e.plugins),n=bs(e.settings),t=js(e.collectionTypes),i=js(e.singleTypes);return[...s,...n,...t,...i]},Rt=[{labelId:"app.components.LeftMenuLinkContainer.collectionTypes",defaultMessage:"Collection Types",id:"collectionTypes"},{labelId:"app.components.LeftMenuLinkContainer.singleTypes",id:"singleTypes",defaultMessage:"Single Types"},{labelId:"app.components.LeftMenuLinkContainer.plugins",defaultMessage:"Plugins",id:"plugins"},{labelId:"app.components.LeftMenuLinkContainer.settings",defaultMessage:"Settings",id:"settings"}],Ge=(0,g.forwardRef)(({layout:e,isFormDisabled:s,permissions:n},t)=>{const[{initialData:i,layouts:a,modifiedData:l},c]=(0,g.useReducer)(bt,_t,()=>ft(e,n)),{formatMessage:p}=(0,U.A)();(0,g.useImperativeHandle)(t,()=>({getPermissions(){const E=(0,k.iv)(i.collectionTypes,l.collectionTypes),C=(0,k.iv)(i.singleTypes,l.singleTypes),h={...E,...C};let M;return q(h)?M=!1:M=Object.values(h).some(j=>Object.values(j).some(v=>Z(v,"conditions"))),{permissionsToSend:Pt(l),didUpdateConditions:M}},resetForm(){c({type:"RESET_FORM"})},setFormAfterSubmit(){c({type:"SET_FORM_AFTER_SUBMIT"})}}));const u=(E,C,h,M)=>{c({type:"ON_CHANGE_COLLECTION_TYPE_ROW_LEFT_CHECKBOX",pathToCollectionType:E,propertyName:C,rowName:h,value:M})},m=(E,C,h)=>{c({type:"ON_CHANGE_COLLECTION_TYPE_GLOBAL_ACTION_CHECKBOX",collectionTypeKind:E,actionId:C,value:h})},y=E=>{c({type:"ON_CHANGE_CONDITIONS",conditions:E})},A=(0,g.useCallback)(({target:{name:E,value:C}})=>{c({type:"ON_CHANGE_SIMPLE_CHECKBOX",keys:E,value:C})},[]),$=(0,g.useCallback)(({target:{name:E,value:C}})=>{c({type:"ON_CHANGE_TOGGLE_PARENT_CHECKBOX",keys:E,value:C})},[]);return(0,o.jsx)(Ms,{availableConditions:e.conditions,modifiedData:l,onChangeConditions:y,onChangeSimpleCheckbox:A,onChangeParentCheckbox:$,onChangeCollectionTypeLeftActionRowCheckbox:u,onChangeCollectionTypeGlobalActionCheckbox:m,children:(0,o.jsxs)(te.f,{id:"tabs",label:p({id:"Settings.permissions.users.tabs.label",defaultMessage:"Tabs Permissions"}),children:[(0,o.jsx)(oe.t,{children:Rt.map(E=>(0,o.jsx)(oe.o,{children:p({id:E.labelId,defaultMessage:E.defaultMessage})},E.id))}),(0,o.jsxs)(Q.T,{style:{position:"relative"},children:[(0,o.jsx)(Q.K,{children:(0,o.jsx)(ps,{layout:a.collectionTypes,kind:"collectionTypes",isFormDisabled:s})}),(0,o.jsx)(Q.K,{children:(0,o.jsx)(ps,{layout:a.singleTypes,kind:"singleTypes",isFormDisabled:s})}),(0,o.jsx)(Q.K,{children:(0,o.jsx)(we,{layout:a.plugins,kind:"plugins",isFormDisabled:s})}),(0,o.jsx)(Q.K,{children:(0,o.jsx)(we,{layout:a.settings,kind:"settings",isFormDisabled:s})})]})]})})});Ge.defaultProps={permissions:[],layout:{conditions:[],sections:{collectionTypes:{},singleTypes:{actions:[]},settings:[],plugins:[]}}},Ge.propTypes={layout:r.object,isFormDisabled:r.bool.isRequired,permissions:r.array};const Tt=(0,g.memo)(Ge),vt=(e,s={})=>{const{get:n}=(0,k.ry)(),{data:t,error:i,isError:a,isLoading:l}=(0,Je.useQuery)(["permissions",e],async()=>{const{data:{data:c}}=await n("/admin/permissions",{params:{role:e}});return c},s);return{data:t,error:i,isError:a,isLoading:l}},Dt=(e={id:null},s={})=>{const{id:n,...t}=e,{get:i}=(0,k.ry)(),{data:a,error:l,isError:c,isLoading:p,refetch:u}=(0,Je.useQuery)(["roles",n,"permissions",t],async()=>{const{data:{data:m}}=await i(`/admin/roles/${n}/permissions`,{params:t});return m},s);return{permissions:a,error:l,isError:c,isLoading:p,refetch:u}}},57237(w,F,d){"use strict";d.d(F,{I:()=>z,n:()=>me});var o=d(92132),g=d(21272),P=d(94929),D=d(97366),W=d(84175),_=d(30893),x=d(83997),O=d(94061);const S=({theme:L,expanded:R,variant:K,disabled:f,error:G})=>G?`1px solid ${L.colors.danger600} !important`:f?`1px solid ${L.colors.neutral150}`:R?`1px solid ${L.colors.primary600}`:K==="primary"?`1px solid ${L.colors.neutral0}`:`1px solid ${L.colors.neutral100}`,z=(0,P.Ay)(_.o)``,ee=(0,P.Ay)(O.a)`
  border: ${S};

  &:hover:not([aria-disabled='true']) {
    border: 1px solid ${({theme:L})=>L.colors.primary600};

    ${z} {
      color: ${({theme:L,expanded:R})=>R?void 0:L.colors.primary700};
    }

    ${_.o} {
      color: ${({theme:L,expanded:R})=>R?void 0:L.colors.primary600};
    }

    & > ${x.s} {
      background: ${({theme:L})=>L.colors.primary100};
    }

    [data-strapi-dropdown='true'] {
      background: ${({theme:L})=>L.colors.primary200};
    }
  }
`,me=({children:L,disabled:R=!1,error:K,expanded:f=!1,hasErrorMessage:G=!0,id:oe,onToggle:Q,toggle:te,size:N="M",variant:k="primary",shadow:Z})=>{const q=(0,W.B)(oe),r=g.useMemo(()=>({expanded:f,onToggle:Q,toggle:te,id:q,size:N,variant:k,disabled:R}),[R,f,q,Q,N,te,k]);return(0,o.jsxs)(D.C.Provider,{value:r,children:[(0,o.jsx)(ee,{"data-strapi-expanded":f,disabled:R,"aria-disabled":R,expanded:f,hasRadius:!0,variant:k,error:K,shadow:Z,children:L}),K&&G&&(0,o.jsx)(O.a,{paddingTop:1,children:(0,o.jsx)(_.o,{variant:"pi",textColor:"danger600",children:K})})]})}},44604(w,F,d){"use strict";d.d(F,{u:()=>D});var o=d(92132),g=d(97366),P=d(94061);const D=({children:W,..._})=>{const{expanded:x,id:O}=(0,g.O)();if(!x)return null;const S=`accordion-content-${O}`,z=`accordion-label-${O}`,ee=`accordion-desc-${O}`;return(0,o.jsx)(P.a,{role:"region",id:S,"aria-labelledby":z,"aria-describedby":ee,..._,children:W})}},97366(w,F,d){"use strict";d.d(F,{C:()=>g,O:()=>P});var o=d(21272);const g=(0,o.createContext)({disabled:!1,expanded:!1,id:"",size:"M",variant:"primary"}),P=()=>(0,o.useContext)(g)},60888(w,F,d){"use strict";d.d(F,{P:()=>L});var o=d(92132),g=d(9005),P=d(94929),D=d(57237),W=d(97366);const _=({expanded:R,disabled:K,variant:f})=>{let G="neutral100";return R?G="primary100":K?G="neutral150":f==="primary"&&(G="neutral0"),G};var x=d(18629),O=d(58805),S=d(83997),z=d(30893);const ee=(0,P.Ay)(x.Q)`
  text-align: left;

  // necessary to make the ellipsis prop work on the title
  > span {
    max-width: 100%;
  }

  svg {
    width: ${14/16}rem;
    height: ${14/16}rem;

    path {
      fill: ${({theme:R,expanded:K})=>K?R.colors.primary600:R.colors.neutral500};
    }
  }
`,me=(0,P.Ay)(S.s)`
  min-height: ${({theme:R,size:K})=>R.sizes.accordions[K]};
  border-radius: ${({theme:R,expanded:K})=>K?`${R.borderRadius} ${R.borderRadius} 0 0`:R.borderRadius};

  &:hover {
    svg {
      path {
        fill: ${({theme:R})=>R.colors.primary600};
      }
    }
  }
`,L=({title:R,description:K,as:f="span",togglePosition:G="right",action:oe,...Q})=>{const{onToggle:te,toggle:N,expanded:k,id:Z,size:q,variant:r,disabled:U}=(0,W.O)(),Re=`accordion-content-${Z}`,be=`accordion-label-${Z}`,b=`accordion-desc-${Z}`,de=q==="M"?6:4,Ae=q==="M"?de:de-2,Te=_({expanded:k,disabled:U,variant:r}),T={as:f,fontWeight:q==="S"?"bold":void 0,id:be,textColor:k?"primary600":"neutral700",ellipsis:!0,variant:q==="M"?"delta":void 0},je=k?"primary600":"neutral600",ve=k?"primary200":"neutral200",Oe=q==="M"?`${32/16}rem`:`${24/16}rem`,he=()=>{U||(N&&!te?(console.warn('Deprecation warning: Usage of "toggle" prop in Accordion component is deprecated. This is discouraged and will be removed in the next major release. Please use "onToggle" instead'),N()):te&&te())},ce=(0,o.jsx)(S.s,{justifyContent:"center",borderRadius:"50%",height:Oe,width:Oe,transform:k?"rotate(180deg)":void 0,"data-strapi-dropdown":!0,"aria-hidden":!0,as:"span",background:ve,cursor:U?"not-allowed":"pointer",onClick:he,shrink:0,children:(0,o.jsx)(O.I,{as:g.A,width:q==="M"?`${11/16}rem`:`${8/16}rem`,color:k?"primary600":"neutral600"})});return(0,o.jsx)(me,{paddingBottom:Ae,paddingLeft:de,paddingRight:de,paddingTop:Ae,background:Te,expanded:k,size:q,justifyContent:"space-between",cursor:U?"not-allowed":"",children:(0,o.jsxs)(S.s,{gap:3,flex:1,maxWidth:"100%",children:[G==="left"&&ce,(0,o.jsx)(ee,{onClick:he,"aria-disabled":U,"aria-expanded":k,"aria-controls":Re,"aria-labelledby":be,"data-strapi-accordion-toggle":!0,expanded:k,type:"button",flex:1,minWidth:0,...Q,children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(D.I,{...T,children:R}),K&&(0,o.jsx)(z.o,{as:"p",id:b,textColor:je,children:K})]})}),G==="right"&&(0,o.jsxs)(S.s,{gap:3,children:[ce,oe]}),G==="left"&&oe]})})}},76079(w,F,d){"use strict";d.d(F,{B:()=>D});var o=d(92132),g=d(94929),P=d(56654);const D=({options:_,...x})=>(0,o.jsx)(P.KF,{...x,children:_.map(O=>"children"in O?(0,o.jsx)(P.np,{label:O.label,values:O.children.map(S=>S.value.toString()),children:O.children.map(S=>(0,o.jsx)(W,{value:S.value,children:S.label},S.value))},O.label):(0,o.jsx)(P.fe,{value:O.value,children:O.label},O.value))}),W=(0,g.Ay)(P.fe)`
  padding-left: ${({theme:_})=>_.spaces[7]};
`}}]);
