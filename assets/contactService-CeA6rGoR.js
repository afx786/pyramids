import{c as s,a as e}from"./index-B5HGcxS3.js";/**
 * @license lucide-react v1.24.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=[["rect",{width:"14",height:"20",x:"5",y:"2",rx:"2",ry:"2",key:"1yt0o3"}],["path",{d:"M12 18h.01",key:"mhygvu"}]],a=s("smartphone",c),n={getMyInfo:()=>e.get("/contacts/my-info"),updateMyInfo:t=>e.put("/contacts/my-info",t),sendRequest:t=>e.post("/contacts/request",{target_id:t}),approveRequest:t=>e.post(`/contacts/request/${t}/approve`),declineRequest:t=>e.post(`/contacts/request/${t}/decline`),getRequestStatus:t=>e.get(`/contacts/request/status/${t}`),getReceivedRequests:()=>e.get("/contacts/requests/received"),withdrawRequest:t=>e.post(`/contacts/request/${t}/withdraw`)};export{a as S,n as c};
