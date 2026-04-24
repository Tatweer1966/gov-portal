"use strict";(self.webpackChunkgov_portal_cms=self.webpackChunkgov_portal_cms||[]).push([[865],{60865(K,m,t){t.r(m),t.d(m,{default:()=>cs});var s=t(92132),o=t(56445),c=t(82437),x=t(97927),l=t(21272),S=t(11273),D=t(42455),L=t(38413),p=t(55356),r=t(74773),g=t(30893),b=t(85963),q=t(4198),F=t(94061),_=t(35513),ss=t(40216),ts=t(26127),w=t(90361),i=t(33363),z=t(50215),es=t(98765),ns=t(25641),A=t(83997),N=t(94929);const B=N.Ay.div`
  background: ${({theme:a})=>a.colors.danger500};
  border: none;
  border-radius: 16px;
  position: relative;
  height: ${24/16}rem;
  width: ${40/16}rem;

  & span {
    font-size: ${({visibleLabels:a})=>a?"1rem":0};
  }

  &:before {
    content: '';
    background: ${({theme:a})=>a.colors.neutral0};
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    transition: all 0.5s;
    left: ${({theme:a})=>a.spaces[1]};
    top: ${({theme:a})=>a.spaces[1]};
  }

  @media (prefers-reduced-motion: reduce) {
    &:before {
      transition: none;
    }
  }
`,os=N.Ay.button`
  background: transparent;
  padding: 0;
  border: none;

  &[aria-checked='true'] ${B} {
    background: ${({theme:a})=>a.colors.success500};
  }

  &[aria-checked='true'] ${B}:before {
    transform: translateX(1rem);
  }
`,as=l.forwardRef(({label:a,onChange:u,onLabel:v="On",offLabel:h="Off",selected:M,visibleLabels:n=!1,...j},f)=>(0,s.jsx)(os,{ref:f,role:"switch","aria-checked":M,"aria-label":a,onClick:u,visibleLabels:n,type:"button",...j,children:(0,s.jsxs)(A.s,{children:[(0,s.jsxs)(B,{children:[(0,s.jsx)("span",{children:v}),(0,s.jsx)("span",{children:h})]}),n&&(0,s.jsx)(F.a,{as:"span","aria-hidden":!0,paddingLeft:2,color:M?"success600":"danger600",children:M?v:h})]})}));var V=t(88353),ds=t(53563),$=t(5194),H=t(50612),is=t(41909),ls=t(36481),rs=t(54894),P=t(74930),Q=t(17703),Ss=t(55151),Ds=t(79077),Ls=t(59057),ps=t(15126),As=t(63299),Bs=t(67014),$s=t(59080),Ps=t(79275),Os=t(14718),Ws=t(61535),Is=t(5790),Rs=t(12083),Us=t(41286),Ks=t(35223),Fs=t(5409),ws=t(2600),zs=t(48940),Ns=t(51187);const hs=()=>{const[a,u]=(0,l.useState)(!1),[v,h]=(0,l.useState)([]),M=(0,c.d4)(x.s),{formatMessage:n}=(0,rs.A)(),{formatAPIError:j}=(0,o.wq)(),f=(0,o.hN)();(0,o.L4)();const{push:gs}=(0,Q.W6)(),{pathname:G}=(0,Q.zy)(),{isLoading:xs,allowedActions:{canCreate:O,canUpdate:J,canDelete:X}}=(0,o.ec)(M.settings.webhooks),{get:us,post:ms,put:vs}=(0,o.ry)(),{notifyStatus:Y}=(0,S.W)(),js="webhooks",{isLoading:fs,data:y,error:W,refetch:k}=(0,P.useQuery)(js,async()=>{const{data:{data:e}}=await us("/admin/webhooks");return e});(0,l.useEffect)(()=>{if(W){f({type:"warning",message:j(W)});return}y&&Y(n({id:"Settings.webhooks.list.loading.success",defaultMessage:"Webhooks have been loaded"}))},[y,W,f,n,Y,j]);const Z=(0,P.useMutation)(async()=>{await ms("/admin/webhooks/batch-delete",{ids:v})},{onError(e){f({type:"warning",message:j(e)}),u(!1)},onSuccess(){h([]),u(!1),k()}}),ys=(0,P.useMutation)(async({isEnabled:e,id:d})=>{const{id:E,...U}=y.find(Es=>Es.id===d)??{},Ts={...U,isEnabled:e};await vs(`/admin/webhooks/${d}`,Ts)},{onError(e){f({type:"warning",message:j(e)})},onSuccess(){k()}}),Ms=()=>Z.mutate(),Cs=e=>h(e?y.map(d=>d.id):[]),bs=(e,d)=>h(e?E=>[...E,d]:E=>E.filter(U=>U!==d)),I=e=>gs(`${G}/${e}`),R=xs||fs,T=y?.length??0,C=v.length;return(0,s.jsxs)(D.P,{children:[(0,s.jsx)(o.x7,{name:"Webhooks"}),(0,s.jsxs)(L.g,{"aria-busy":R,children:[(0,s.jsx)(p.Q,{title:n({id:"Settings.webhooks.title",defaultMessage:"Webhooks"}),subtitle:n({id:"Settings.webhooks.list.description",defaultMessage:"Get POST changes notifications"}),primaryAction:O&&!R&&(0,s.jsx)(o.z9,{startIcon:(0,s.jsx)($.A,{}),variant:"default",to:`${G}/create`,size:"S",children:n({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})}),C>0&&X&&(0,s.jsx)(r.B,{startActions:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(g.o,{variant:"epsilon",textColor:"neutral600",children:n({id:"Settings.webhooks.to.delete",defaultMessage:"{webhooksToDeleteLength, plural, one {# webhook} other {# webhooks}} selected"},{webhooksToDeleteLength:C})}),(0,s.jsx)(b.$,{onClick:()=>u(!0),startIcon:(0,s.jsx)(H.A,{}),size:"L",variant:"danger-light",children:n({id:"global.delete",defaultMessage:"Delete"})})]})}),(0,s.jsx)(q.s,{children:R?(0,s.jsx)(F.a,{background:"neutral0",padding:6,shadow:"filterShadow",hasRadius:!0,children:(0,s.jsx)(o.Bl,{})}):T>0?(0,s.jsxs)(_.X,{colCount:5,rowCount:T+1,footer:(0,s.jsx)(ss.S,{onClick:()=>O?I("create"):{},icon:(0,s.jsx)($.A,{}),children:n({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})}),children:[(0,s.jsx)(ts.d,{children:(0,s.jsxs)(w.Tr,{children:[(0,s.jsx)(i.Th,{children:(0,s.jsx)(z.J,{"aria-label":n({id:"global.select-all-entries",defaultMessage:"Select all entries"}),indeterminate:C>0&&C<T,value:C===T,onValueChange:Cs})}),(0,s.jsx)(i.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:n({id:"global.name",defaultMessage:"Name"})})}),(0,s.jsx)(i.Th,{width:"60%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:n({id:"Settings.webhooks.form.url",defaultMessage:"URL"})})}),(0,s.jsx)(i.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:n({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})})}),(0,s.jsx)(i.Th,{children:(0,s.jsx)(es.s,{children:n({id:"Settings.webhooks.list.th.actions",defaultMessage:"Actions"})})})]})}),(0,s.jsx)(ns.N,{children:y.map(e=>(0,s.jsxs)(w.Tr,{...(0,o.qM)({fn:()=>I(e.id),condition:J}),children:[(0,s.jsx)(i.Td,{...o.dG,children:(0,s.jsx)(z.J,{"aria-label":`${n({id:"global.select",defaultMessage:"Select"})} ${e.name}`,value:v?.includes(e.id),onValueChange:d=>bs(d,e.id),name:"select"})}),(0,s.jsx)(i.Td,{children:(0,s.jsx)(g.o,{fontWeight:"semiBold",textColor:"neutral800",children:e.name})}),(0,s.jsx)(i.Td,{children:(0,s.jsx)(g.o,{textColor:"neutral800",children:e.url})}),(0,s.jsx)(i.Td,{children:(0,s.jsx)(A.s,{children:(0,s.jsx)(as,{onLabel:n({id:"global.enabled",defaultMessage:"Enabled"}),offLabel:n({id:"global.disabled",defaultMessage:"Disabled"}),label:`${e.name} ${n({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})}`,selected:e.isEnabled,onChange:d=>{d.stopPropagation(),ys.mutate({isEnabled:!e.isEnabled,id:e.id})},visibleLabels:!0})})}),(0,s.jsx)(i.Td,{children:(0,s.jsxs)(A.s,{gap:1,children:[J&&(0,s.jsx)(V.K,{label:n({id:"Settings.webhooks.events.update",defaultMessage:"Update"}),icon:(0,s.jsx)(is.A,{}),noBorder:!0}),X&&(0,s.jsx)(V.K,{onClick:d=>{d.stopPropagation(),h([e.id]),u(!0)},label:n({id:"Settings.webhooks.events.delete",defaultMessage:"Delete webhook"}),icon:(0,s.jsx)(H.A,{}),noBorder:!0})]})})]},e.id))})]}):(0,s.jsx)(ds.p,{icon:(0,s.jsx)(ls.A,{width:"160px"}),content:n({id:"Settings.webhooks.list.empty.description",defaultMessage:"No webhooks found"}),action:(0,s.jsx)(b.$,{variant:"secondary",startIcon:(0,s.jsx)($.A,{}),onClick:()=>O?I("create"):{},children:n({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})})})]}),(0,s.jsx)(o.TM,{isOpen:a,onToggleDialog:()=>u(e=>!e),onConfirm:Ms,isConfirmButtonLoading:Z.isLoading})]})},cs=()=>{const a=(0,c.d4)(x.s);return(0,s.jsx)(o.kz,{permissions:a.settings.webhooks.main,children:(0,s.jsx)(hs,{})})}},74773(K,m,t){t.d(m,{B:()=>c});var s=t(92132),o=t(83997);const c=({startActions:x,endActions:l})=>!x&&!l?null:(0,s.jsxs)(o.s,{justifyContent:"space-between",alignItems:"flex-start",paddingBottom:4,paddingLeft:10,paddingRight:10,children:[(0,s.jsx)(o.s,{gap:2,wrap:"wrap",children:x}),(0,s.jsx)(o.s,{gap:2,shrink:0,wrap:"wrap",children:l})]})},40216(K,m,t){t.d(m,{S:()=>p});var s=t(92132),o=t(94929),c=t(94061),x=t(48653),l=t(83997),S=t(30893);const D=(0,o.Ay)(c.a)`
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
    fill: ${({theme:r})=>r.colors.primary600};
  }
`,L=(0,o.Ay)(c.a)`
  border-radius: 0 0 ${({theme:r})=>r.borderRadius} ${({theme:r})=>r.borderRadius};
  display: block;
  width: 100%;
  border: none;
`,p=({children:r,icon:g,...b})=>(0,s.jsxs)("div",{children:[(0,s.jsx)(x.c,{}),(0,s.jsx)(L,{as:"button",background:"primary100",padding:5,...b,children:(0,s.jsxs)(l.s,{children:[(0,s.jsx)(D,{"aria-hidden":!0,background:"primary200",children:g}),(0,s.jsx)(c.a,{paddingLeft:3,children:(0,s.jsx)(S.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:r})})]})})]})}}]);
