import mainStore from "../../stores/mainStore";
import Fetch from "../../js/Fetch";
import FacebookLogin from "./FacebookLogin/FacebookLogin";
import TelegramLogin from "./TelegramLogin/TelegramLogin";
import React from "react";

export default function SocialLogin() {
  function onComplete(r) {
    if (!r.token) return
    localStorage.setItem("Authorization", `Token ${r.token}`)
    mainStore.Account.setValue(r.account)
    Fetch.autoLink(`@${r.account.username}`)
  }

  function post(name, value) {
    Fetch.post(['login', name], value).then(onComplete)
  }

  return (<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%'}}>
    <FacebookLogin onClick={v => post('facebook', v)}/>
    <TelegramLogin onClick={v => post('telegram', v)}/>
  </div>)
}
