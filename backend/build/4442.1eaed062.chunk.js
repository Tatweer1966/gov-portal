"use strict";(self.webpackChunkgov_portal_cms=self.webpackChunkgov_portal_cms||[]).push([[4442],{40216(Et,S,n){n.d(S,{S:()=>Z});var t=n(92132),g=n(94929),O=n(94061),H=n(48653),N=n(83997),Q=n(30893);const J=(0,g.Ay)(O.a)`
  height: ${24/16}rem;
  width: ${24/16}rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: ${10/16}rem;
    width: ${10/16}rem;
  }

  svg path {
    fill: ${({theme:j})=>j.colors.primary600};
  }
`,f=(0,g.Ay)(O.a)`
  border-radius: 0 0 ${({theme:j})=>j.borderRadius} ${({theme:j})=>j.borderRadius};
  display: block;
  width: 100%;
  border: none;
`,Z=({children:j,icon:k,...B})=>(0,t.jsxs)("div",{children:[(0,t.jsx)(H.c,{}),(0,t.jsx)(f,{as:"button",background:"primary100",padding:5,...B,children:(0,t.jsxs)(N.s,{children:[(0,t.jsx)(J,{"aria-hidden":!0,background:"primary200",children:k}),(0,t.jsx)(O.a,{paddingLeft:3,children:(0,t.jsx)(Q.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:j})})]})})]})},14442(Et,S,n){n.r(S),n.d(S,{default:()=>zt});var t=n(92132),g=n(94061),O=n(85963),H=n(58805),N=n(88353),Q=n(4198),J=n(55356),f=n(83997),Z=n(35513),j=n(26127),k=n(90361),B=n(33363),xt=n(40216),y=n(30893),c=n(56445),Ct=n(46270),Mt=n(54514),Dt=n(68802),Tt=n(77701),jt=n(41231),rt=n(41909),U=n(5194),Pt=n(50612),D=n(2600),Ot=n(412),lt=n(56336),dt=n(39404),L=n(54894),Y=n(17703),W=n(21272),o=n(33544),d=n(15712),E=n(94929),Vt=n(14718),Xt=n(69064),Gt=n(48940),Ht=n(77160),Qt=n(21835),Jt=n(17024),Yt=n(51187),qt=n(12083),te=n(94710),ee=n(14311),ne=n(82437),oe=n(89102),se=n(5409),ie=n(35336),ae=n(71547),re=n(71210),le=n(5790),de=n(35223),ce=n(45635);const ct=E.Ay.tr`
  &.component-row,
  &.dynamiczone-row {
    position: relative;
    border-top: none !important;

    table tr:first-child {
      border-top: none;
    }

    > td:first-of-type {
      padding: 0 0 0 ${(0,c.a8)(20)};
      position: relative;

      &::before {
        content: '';
        width: ${(0,c.a8)(4)};
        height: calc(100% - 40px);
        position: absolute;
        top: -7px;
        left: 1.625rem;
        border-radius: 4px;

        ${({isFromDynamicZone:e,isChildOfDynamicZone:s,theme:i})=>s?`background-color: ${i.colors.primary200};`:e?`background-color: ${i.colors.primary200};`:`background: ${i.colors.neutral150};`}
      }
    }
  }

  &.dynamiczone-row > td:first-of-type {
    padding: 0;
  }
`;function z({customRowComponent:e,component:s,isFromDynamicZone:i,isNestedInDZComponent:a,firstLoopComponentUid:p}){const{modifiedData:l}=(0,d.u)(),{schema:{attributes:m}}=D(l,["components",s],{schema:{attributes:[]}});return(0,t.jsx)(ct,{isChildOfDynamicZone:i,className:"component-row",children:(0,t.jsx)("td",{colSpan:12,children:(0,t.jsx)(w,{customRowComponent:e,items:m,targetUid:s,firstLoopComponentUid:p||s,editTarget:"components",isFromDynamicZone:i,isNestedInDZComponent:a,isSub:!0,secondLoopComponentUid:p?s:null})})})}z.defaultProps={component:null,customRowComponent:null,firstLoopComponentUid:null,isFromDynamicZone:!1,isNestedInDZComponent:!1},z.propTypes={component:o.string,customRowComponent:o.func,firstLoopComponentUid:o.string,isFromDynamicZone:o.bool,isNestedInDZComponent:o.bool};function q({isActive:e,icon:s}){return(0,t.jsx)(f.s,{alignItems:"center",background:e?"primary200":"neutral200",justifyContent:"center",height:8,width:8,borderRadius:"50%",children:(0,t.jsx)(H.I,{as:d.C[s]||d.C.cube,height:5,width:5})})}q.defaultProps={isActive:!1,icon:"Cube"},q.propTypes={isActive:o.bool,icon:o.string};const pt=(0,E.Ay)(g.a)`
  position: absolute;
  display: none;
  top: 5px;
  right: ${(0,c.a8)(8)};

  svg {
    width: ${(0,c.a8)(10)};
    height: ${(0,c.a8)(10)};

    path {
      fill: ${({theme:e})=>e.colors.primary600};
    }
  }
`,vt=(0,E.Ay)(f.s)`
  width: ${(0,c.a8)(140)};
  height: ${(0,c.a8)(80)};
  position: relative;
  border: 1px solid ${({theme:e})=>e.colors.neutral200};
  background: ${({theme:e})=>e.colors.neutral100};
  border-radius: ${({theme:e})=>e.borderRadius};
  max-width: 100%;

  &.active,
  &:focus,
  &:hover {
    border: 1px solid ${({theme:e})=>e.colors.primary200};
    background: ${({theme:e})=>e.colors.primary100};

    ${pt} {
      display: block;
    }

    ${y.o} {
      color: ${({theme:e})=>e.colors.primary600};
    }

    /* > ComponentIcon */
    > div:first-child {
      background: ${({theme:e})=>e.colors.primary200};
      color: ${({theme:e})=>e.colors.primary600};

      svg {
        path {
          fill: ${({theme:e})=>e.colors.primary600};
        }
      }
    }
  }
`;function tt({component:e,dzName:s,index:i,isActive:a,isInDevelopmentMode:p,onClick:l}){const{modifiedData:m,removeComponentFromDynamicZone:T}=(0,d.u)(),{schema:{icon:C,displayName:x}}=D(m,["components",e],{schema:{}}),h=r=>{r.stopPropagation(),T(s,i)};return(0,t.jsxs)(vt,{alignItems:"center",direction:"column",className:a?"active":"",borderRadius:"borderRadius",justifyContent:"center",paddingLeft:4,paddingRight:4,shrink:0,onClick:l,role:"tab",tabIndex:a?0:-1,cursor:"pointer","aria-selected":a,"aria-controls":`dz-${s}-panel-${i}`,id:`dz-${s}-tab-${i}`,children:[(0,t.jsx)(q,{icon:C,isActive:a}),(0,t.jsx)(g.a,{marginTop:1,maxWidth:"100%",children:(0,t.jsx)(y.o,{variant:"pi",fontWeight:"bold",ellipsis:!0,children:x})}),p&&(0,t.jsx)(pt,{as:"button",onClick:h,children:(0,t.jsx)(Dt.A,{})})]})}tt.defaultProps={component:null,isActive:!1,isInDevelopmentMode:!1,onClick(){}},tt.propTypes={component:o.string,dzName:o.string.isRequired,index:o.number.isRequired,isActive:o.bool,isInDevelopmentMode:o.bool,onClick:o.func};const At=(0,E.Ay)(U.A)`
  width: ${(0,c.a8)(32)};
  height: ${(0,c.a8)(32)};
  padding: ${(0,c.a8)(9)};
  border-radius: ${(0,c.a8)(64)};
  background: ${({theme:e})=>e.colors.primary100};
  path {
    fill: ${({theme:e})=>e.colors.primary600};
  }
`,bt=(0,E.Ay)(g.a)`
  height: ${(0,c.a8)(90)};
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`,Rt=(0,E.Ay)(f.s)`
  width: 100%;
  overflow-x: auto;
`,It=(0,E.Ay)(g.a)`
  padding-top: ${(0,c.a8)(90)};
`,$t=(0,E.Ay)(f.s)`
  flex-shrink: 0;
  width: ${(0,c.a8)(140)};
  height: ${(0,c.a8)(80)};
  justify-content: center;
  align-items: center;
`;function et({customRowComponent:e,components:s,addComponent:i,name:a,targetUid:p}){const{isInDevelopmentMode:l}=(0,d.u)(),[m,T]=(0,W.useState)(0),{formatMessage:C}=(0,L.A)(),x=r=>{m!==r&&T(r)},h=()=>{i(a)};return(0,t.jsx)(ct,{className:"dynamiczone-row",isFromDynamicZone:!0,children:(0,t.jsxs)("td",{colSpan:12,children:[(0,t.jsx)(bt,{paddingLeft:8,children:(0,t.jsxs)(Rt,{gap:2,children:[l&&(0,t.jsx)("button",{type:"button",onClick:h,children:(0,t.jsxs)($t,{direction:"column",alignItems:"stretch",gap:1,children:[(0,t.jsx)(At,{}),(0,t.jsx)(y.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:C({id:(0,d.g)("button.component.add"),defaultMessage:"Add a component"})})]})}),(0,t.jsx)(f.s,{role:"tablist",gap:2,children:s.map((r,u)=>(0,t.jsx)(tt,{dzName:a,index:u,component:r,isActive:m===u,isInDevelopmentMode:l,onClick:()=>x(u)},r))})]})}),(0,t.jsx)(It,{children:s.map((r,u)=>{const _={customRowComponent:e,component:r};return(0,t.jsx)(g.a,{id:`dz-${a}-panel-${u}`,role:"tabpanel",tabindex:0,"aria-labelledby":`dz-${a}-tab-${u}`,style:{display:m===u?"block":"none"},children:(0,t.jsx)("table",{children:(0,t.jsx)("tbody",{children:(0,W.createElement)(z,{..._,isFromDynamicZone:!0,targetUid:p,key:r})})})},r)})})]})})}et.defaultProps={addComponent(){},components:[],customRowComponent:null,name:null},et.propTypes={addComponent:o.func,components:o.instanceOf(Array),customRowComponent:o.func,name:o.string,targetUid:o.string.isRequired};const Bt=(0,E.Ay)(g.a)`
  height: ${24/16}rem;
  width: ${24/16}rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: ${10/16}rem;
    width: ${10/16}rem;
  }

  svg path {
    fill: ${({theme:e,color:s})=>e.colors[`${s}600`]};
  }
`,Lt=(0,E.Ay)(g.a)`
  border-radius: 0 0 ${({theme:e})=>e.borderRadius} ${({theme:e})=>e.borderRadius};
  display: block;
  width: 100%;
  border: none;
  position: relative;
  left: -0.25rem;
`,ut=({children:e,icon:s,color:i,...a})=>(0,t.jsx)(Lt,{paddingBottom:4,paddingTop:4,as:"button",type:"button",...a,children:(0,t.jsxs)(f.s,{children:[(0,t.jsx)(Bt,{color:i,"aria-hidden":!0,background:`${i}200`,children:s}),(0,t.jsx)(g.a,{paddingLeft:3,children:(0,t.jsx)(y.o,{variant:"pi",fontWeight:"bold",textColor:`${i}600`,children:e})})]})});ut.propTypes={color:o.string.isRequired,children:o.string.isRequired,icon:o.node.isRequired};const Ut=(0,E.Ay)(g.a)`
  table {
    width: 100%;
    white-space: nowrap;
  }

  thead {
    border-bottom: 1px solid ${({theme:e})=>e.colors.neutral150};

    tr {
      border-top: 0;
    }
  }

  tr {
    border-top: 1px solid ${({theme:e})=>e.colors.neutral150};

    & td,
    & th {
      padding: ${({theme:e})=>e.spaces[4]};
    }

    & td:first-of-type,
    & th:first-of-type {
      padding: 0 ${({theme:e})=>e.spaces[1]};
    }
  }

  th,
  td {
    vertical-align: middle;
    text-align: left;
    color: ${({theme:e})=>e.colors.neutral600};
    outline-offset: -4px;
  }
`;function w({addComponentToDZ:e,customRowComponent:s,editTarget:i,firstLoopComponentUid:a,isFromDynamicZone:p,isMain:l,isNestedInDZComponent:m,isSub:T,items:C,secondLoopComponentUid:x,targetUid:h}){const{formatMessage:r}=(0,L.A)(),{trackUsage:u}=(0,c.z1)(),{isInDevelopmentMode:_,modifiedData:I,isInContentTypeView:v}=(0,d.u)(),{onOpenModalAddField:b}=(0,d.a)(),P=()=>{u("hasClickedCTBAddFieldBanner"),b({forTarget:i,targetUid:h})};return h?C.length===0&&l?(0,t.jsxs)(Z.X,{colCount:2,rowCount:2,children:[(0,t.jsx)(j.d,{children:(0,t.jsxs)(k.Tr,{children:[(0,t.jsx)(B.Th,{children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.name",defaultMessage:"Name"})})}),(0,t.jsx)(B.Th,{children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.type",defaultMessage:"Type"})})})]})}),(0,t.jsx)(c.m5,{action:(0,t.jsx)(O.$,{onClick:P,size:"L",startIcon:(0,t.jsx)(U.A,{}),variant:"secondary",children:r({id:(0,d.g)("table.button.no-fields"),defaultMessage:"Add new field"})}),colSpan:2,content:v?{id:(0,d.g)("table.content.no-fields.collection-type"),defaultMessage:"Add your first field to this Collection-Type"}:{id:(0,d.g)("table.content.no-fields.component"),defaultMessage:"Add your first field to this component"}})]}):(0,t.jsxs)(Ut,{children:[(0,t.jsx)(g.a,{paddingLeft:6,paddingRight:l?6:0,...l&&{style:{overflowX:"auto"}},children:(0,t.jsxs)("table",{children:[l&&(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{children:[(0,t.jsx)("th",{children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.name",defaultMessage:"Name"})})}),(0,t.jsx)("th",{colSpan:"2",children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.type",defaultMessage:"Type"})})})]})}),(0,t.jsx)("tbody",{children:C.map(A=>{const{type:$}=A,K=s;return(0,t.jsxs)(W.Fragment,{children:[(0,t.jsx)(K,{...A,isNestedInDZComponent:m,targetUid:h,editTarget:i,firstLoopComponentUid:a,isFromDynamicZone:p,secondLoopComponentUid:x}),$==="component"&&(0,t.jsx)(z,{...A,customRowComponent:s,targetUid:h,isNestedInDZComponent:p,editTarget:i,firstLoopComponentUid:a}),$==="dynamiczone"&&(0,t.jsx)(et,{...A,customRowComponent:s,addComponent:e,targetUid:h})]},A.name)})})]})}),l&&_&&(0,t.jsx)(xt.S,{icon:(0,t.jsx)(U.A,{}),onClick:P,children:r({id:(0,d.g)(`form.button.add.field.to.${I.contentType?I.contentType.schema.kind:i||"collectionType"}`),defaultMessage:"Add another field"})}),T&&_&&(0,t.jsx)(ut,{icon:(0,t.jsx)(U.A,{}),onClick:P,color:p?"primary":"neutral",children:r({id:(0,d.g)("form.button.add.field.to.component"),defaultMessage:"Add another field"})})]}):(0,t.jsxs)(Z.X,{colCount:2,rowCount:2,children:[(0,t.jsx)(j.d,{children:(0,t.jsxs)(k.Tr,{children:[(0,t.jsx)(B.Th,{children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.name",defaultMessage:"Name"})})}),(0,t.jsx)(B.Th,{children:(0,t.jsx)(y.o,{variant:"sigma",textColor:"neutral600",children:r({id:"global.type",defaultMessage:"Type"})})})]})}),(0,t.jsx)(c.m5,{colSpan:2,content:{id:(0,d.g)("table.content.create-first-content-type"),defaultMessage:"Create your first Collection-Type"}})]})}w.defaultProps={addComponentToDZ(){},customRowComponent:null,firstLoopComponentUid:null,isFromDynamicZone:!1,isNestedInDZComponent:!1,isMain:!1,isSub:!1,items:[],secondLoopComponentUid:null,targetUid:null},w.propTypes={addComponentToDZ:o.func,customRowComponent:o.func,editTarget:o.string.isRequired,firstLoopComponentUid:o.string,isFromDynamicZone:o.bool,isNestedInDZComponent:o.bool,isMain:o.bool,items:o.instanceOf(Array),secondLoopComponentUid:o.string,targetUid:o.string,isSub:o.bool};const Wt=(0,E.Ay)(g.a)`
  position: absolute;
  left: -1.125rem;
  top: 0px;

  &:before {
    content: '';
    width: ${4/16}rem;
    height: ${12/16}rem;
    background: ${({theme:e,color:s})=>e.colors[s]};
    display: block;
  }
`,Kt=E.Ay.svg`
  position: relative;
  flex-shrink: 0;
  transform: translate(-0.5px, -1px);

  * {
    fill: ${({theme:e,color:s})=>e.colors[s]};
  }
`,gt=e=>(0,t.jsx)(Wt,{children:(0,t.jsx)(Kt,{width:"20",height:"23",viewBox:"0 0 20 23",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e,children:(0,t.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.02477 14.7513C8.65865 17.0594 11.6046 18.6059 17.5596 18.8856C18.6836 18.9384 19.5976 19.8435 19.5976 20.9688V20.9688C19.5976 22.0941 18.6841 23.0125 17.5599 22.9643C10.9409 22.6805 6.454 20.9387 3.75496 17.1258C0.937988 13.1464 0.486328 7.39309 0.486328 0.593262H4.50974C4.50974 7.54693 5.06394 11.9813 7.02477 14.7513Z"})})});gt.propTypes={color:o.string.isRequired};const nt=({content:e})=>dt(e);nt.defaultProps={content:null},nt.propTypes={content:o.string};const Ft=(0,E.Ay)(g.a)`
  position: relative;
`,ot=({type:e,customField:s,repeatable:i})=>{const{formatMessage:a}=(0,L.A)();let p=e;return["integer","biginteger","float","decimal"].includes(e)?p="number":["string"].includes(e)&&(p="text"),s?(0,t.jsx)(y.o,{children:a({id:(0,d.g)("attribute.customField"),defaultMessage:"Custom field"})}):(0,t.jsxs)(y.o,{children:[a({id:(0,d.g)(`attribute.${p}`),defaultMessage:e}),"\xA0",i&&a({id:(0,d.g)("component.repeatable"),defaultMessage:"(repeatable)"})]})};ot.defaultProps={customField:null,repeatable:!1},ot.propTypes={type:o.string.isRequired,customField:o.string,repeatable:o.bool};function st({configurable:e,customField:s,editTarget:i,firstLoopComponentUid:a,isFromDynamicZone:p,name:l,onClick:m,relation:T,repeatable:C,secondLoopComponentUid:x,target:h,targetUid:r,type:u}){const{contentTypes:_,isInDevelopmentMode:I,removeAttribute:v}=(0,d.u)(),{formatMessage:b}=(0,L.A)(),P=u==="relation"&&T.includes("morph"),A=["integer","biginteger","float","decimal"].includes(u)?"number":u,$=D(_,[h],{}),K=D($,["schema","displayName"],""),F=D($,"plugin"),at=h?"relation":A,V=()=>{P||e!==!1&&m(i,x||a||r,l,u,s)};let R;return x&&a?R=2:a?R=1:R=0,(0,t.jsxs)(Ft,{as:"tr",...(0,c.qM)({fn:V,condition:I&&e&&!P}),children:[(0,t.jsxs)("td",{style:{position:"relative"},children:[R!==0&&(0,t.jsx)(gt,{color:p?"primary200":"neutral150"}),(0,t.jsxs)(f.s,{paddingLeft:2,gap:4,children:[(0,t.jsx)(d.A,{type:at,customField:s}),(0,t.jsx)(y.o,{fontWeight:"bold",children:l})]})]}),(0,t.jsx)("td",{children:h?(0,t.jsxs)(y.o,{children:[b({id:(0,d.g)(`modelPage.attribute.${P?"relation-polymorphic":"relationWith"}`),defaultMessage:"Relation with"}),"\xA0",(0,t.jsxs)("span",{style:{fontStyle:"italic"},children:[(0,t.jsx)(nt,{content:K}),"\xA0",F&&`(${b({id:(0,d.g)("from"),defaultMessage:"from"})}: ${F})`]})]}):(0,t.jsx)(ot,{type:u,customField:s,repeatable:C})}),(0,t.jsx)("td",{children:I?(0,t.jsx)(f.s,{justifyContent:"flex-end",...c.dG,children:e?(0,t.jsxs)(f.s,{gap:1,children:[!P&&(0,t.jsx)(N.K,{onClick:V,label:`${b({id:"app.utils.edit",defaultMessage:"Edit"})} ${l}`,noBorder:!0,icon:(0,t.jsx)(rt.A,{})}),(0,t.jsx)(N.K,{onClick:X=>{X.stopPropagation(),v(i,l,x||a||"")},label:`${b({id:"global.delete",defaultMessage:"Delete"})} ${l}`,noBorder:!0,icon:(0,t.jsx)(Pt.A,{})})]}):(0,t.jsx)(jt.A,{})}):(0,t.jsx)(g.a,{height:(0,c.a8)(32)})})]})}st.defaultProps={configurable:!0,customField:null,firstLoopComponentUid:null,isFromDynamicZone:!1,onClick(){},relation:"",repeatable:!1,secondLoopComponentUid:null,target:null,targetUid:null,type:null},st.propTypes={configurable:o.bool,customField:o.string,editTarget:o.string.isRequired,firstLoopComponentUid:o.string,isFromDynamicZone:o.bool,name:o.string.isRequired,onClick:o.func,relation:o.string,repeatable:o.bool,secondLoopComponentUid:o.string,target:o.string,targetUid:o.string,type:o.string};const St=(0,W.memo)(st),Nt=e=>{let s;switch(e){case"date":case"datetime":case"time":case"timestamp":s="date";break;case"integer":case"biginteger":case"decimal":case"float":s="number";break;case"string":case"text":s="text";break;case"":s="relation";break;default:s=e}return s},Zt={collectionTypesConfigurations:[{action:"plugin::content-manager.collection-types.configure-view",subject:null}],componentsConfigurations:[{action:"plugin::content-manager.components.configure-layout",subject:null}],singleTypesConfigurations:[{action:"plugin::content-manager.single-types.configure-view",subject:null}]},it=({disabled:e,isTemporary:s,isInContentTypeView:i,contentTypeKind:a,targetUid:p})=>{const{formatMessage:l}=(0,L.A)(),{push:m}=(0,Y.W6)(),{collectionTypesConfigurations:T,componentsConfigurations:C,singleTypesConfigurations:x}=Zt,h=l({id:"content-type-builder.form.button.configure-view",defaultMessage:"Configure the view"});let r=T;const u=()=>(s||m(i?`/content-manager/collectionType/${p}/configurations/edit`:`/content-manager/components/${p}/configurations/edit`),!1);return i&&a==="singleType"&&(r=x),i||(r=C),(0,t.jsx)(c.d4,{permissions:r,children:(0,t.jsx)(O.$,{startIcon:(0,t.jsx)(Tt.A,{}),variant:"tertiary",onClick:u,disabled:s||e,children:h})})};it.defaultProps={contentTypeKind:"collectionType",isInContentTypeView:!0,isTemporary:!1,targetUid:""},it.propTypes={disabled:o.bool.isRequired,contentTypeKind:o.string,isInContentTypeView:o.bool,isTemporary:o.bool,targetUid:o.string};const kt=(0,W.memo)(it),zt=()=>{const{initialData:e,modifiedData:s,isInDevelopmentMode:i,isInContentTypeView:a,submitData:p}=(0,d.u)(),{formatMessage:l}=(0,L.A)(),{trackUsage:m}=(0,c.z1)(),T=(0,Y.W5)("/plugins/content-type-builder/:kind/:currentUID"),{onOpenModalAddComponentsToDZ:C,onOpenModalAddField:x,onOpenModalEditField:h,onOpenModalEditSchema:r,onOpenModalEditCustomField:u}=(0,d.a)(),_=a?"contentType":"component",I=[_,"schema","attributes"],v=D(s,[_,"uid"]),b=D(s,[_,"isTemporary"],!1),P=D(s,[_,"schema","kind"],null),A=D(s,I,[]),$=Ot(e,[_,"plugin"]),K=!lt(s,e),F=a?"contentType":"component",at=M=>{C({dynamicZoneTarget:M,targetUid:v})},V=async(M,mt,ht,_t,ft)=>{const yt=Nt(_t);ft?u({forTarget:M,targetUid:mt,attributeName:ht,attributeType:yt,customFieldUid:ft}):h({forTarget:M,targetUid:mt,attributeName:ht,attributeType:yt,step:_t==="component"?"2":null})};let R=D(s,[_,"schema","displayName"],"");const X=D(s,[_,"schema","kind"],""),G=T?.params.currentUID==="create-content-type";!R&&G&&(R=l({id:(0,d.g)("button.model.create"),defaultMessage:"Create new collection type"}));const wt=()=>{const M=X||_;M==="collectionType"&&m("willEditNameOfContentType"),M==="singleType"&&m("willEditNameOfSingleType"),r({modalType:_,forTarget:_,targetUid:v,kind:M})};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(Y.XG,{message:M=>M.hash==="#back"?!1:l({id:(0,d.g)("prompt.unsaved")}),when:K}),(0,t.jsx)(J.Q,{id:"title",primaryAction:i&&(0,t.jsxs)(f.s,{gap:2,children:[!G&&(0,t.jsx)(O.$,{startIcon:(0,t.jsx)(U.A,{}),variant:"secondary",onClick:()=>{x({forTarget:F,targetUid:v})},children:l({id:(0,d.g)("button.attributes.add.another"),defaultMessage:"Add another field"})}),(0,t.jsx)(O.$,{startIcon:(0,t.jsx)(Mt.A,{}),onClick:()=>p(),type:"submit",disabled:lt(s,e),children:l({id:"global.save",defaultMessage:"Save"})})]}),secondaryAction:i&&!$&&!G&&(0,t.jsx)(O.$,{startIcon:(0,t.jsx)(rt.A,{}),variant:"tertiary",onClick:wt,children:l({id:"app.utils.edit",defaultMessage:"Edit"})}),title:dt(R),subtitle:l({id:(0,d.g)("listView.headerLayout.description"),defaultMessage:"Build the data architecture of your content"}),navigationAction:(0,t.jsx)(c.N_,{startIcon:(0,t.jsx)(Ct.A,{}),to:"/plugins/content-type-builder/",children:l({id:"global.back",defaultMessage:"Back"})})}),(0,t.jsx)(Q.s,{children:(0,t.jsxs)(f.s,{direction:"column",alignItems:"stretch",gap:4,children:[(0,t.jsx)(f.s,{justifyContent:"flex-end",children:(0,t.jsx)(f.s,{gap:2,children:(0,t.jsx)(kt,{targetUid:v,isTemporary:b,isInContentTypeView:a,contentTypeKind:P,disabled:G},"link-to-cm-settings-view")})}),(0,t.jsx)(g.a,{background:"neutral0",shadow:"filterShadow",hasRadius:!0,children:(0,t.jsx)(w,{items:A,customRowComponent:M=>(0,t.jsx)(St,{...M,onClick:V}),addComponentToDZ:at,targetUid:v,editTarget:F,isMain:!0})})]})})]})}}}]);
