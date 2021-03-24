import mainStore from "../../stores/mainStore";
import Fetch from "../../js/Fetch";
import FacebookLogin from "./FacebookLogin/FacebookLogin";
import React from "react";
import VkLogin from "./VkLogin/VkLogin";

export default function SocialLogin() {
  function onComplete(r) {
    if (!r.token) return
    mainStore.UsersStore.setLocalUser(r)
    Fetch.link(['user', localStorage.User])
  }

  function post(name, value) {
    Fetch.post(['login', name], value).then(onComplete)
  }

  return (<div style={{display: 'flex'}}>
    <FacebookLogin id={171090181356627} onClick={(v) => post('facebook', v)}/>
    <VkLogin id={7786320} onClick={(v) => post('vk', v)}/>
  </div>)
}