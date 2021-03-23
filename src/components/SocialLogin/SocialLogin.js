import mainStore from "../../stores/mainStore";
import Fetch from "../../js/Fetch";
import FacebookLogin from "./FacebookLogin/FacebookLogin";
import React from "react";

export default function SocialLogin() {
  function onComplete(r) {
    mainStore.UsersStore.setLocalUser(r)
    Fetch.link(['user', localStorage.User])
  }


  function facebookClick(value) {
    Fetch.post(['login', 'facebook'], value).then(r => {
      if (r.token) {
        onComplete(r)
      }
      else {
        alert(r.error)
      }
    })
  }

  return (<div style={{display: 'flex'}}>
    <FacebookLogin id={171090181356627} onClick={facebookClick}/>
  </div>)
}