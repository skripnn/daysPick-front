import mainStore from "../../stores/mainStore";
import Fetch from "../../js/Fetch";
import FacebookLogin from "./FacebookLogin/FacebookLogin";
import React from "react";

export default function SocialLogin() {
  function onComplete(r) {
    if (!r.token) return
    mainStore.UsersStore.setLocalUser(r)
    Fetch.link(['user', localStorage.User])
  }

  function post(name, value) {
    Fetch.post(['login', name], value).then(onComplete)
  }

  return (
    <FacebookLogin onClick={(v) => post('facebook', v)}/>
  )
}