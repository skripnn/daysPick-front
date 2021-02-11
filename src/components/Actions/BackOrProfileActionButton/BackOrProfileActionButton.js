import ActionButton from "../ActionButton/ActionButton";
import {AccountCircle, ArrowBackIos} from "@material-ui/icons";
import React from "react";
import {useLastLocation} from "react-router-last-location";

export default function BackOrProfileActionButton(props) {
  const lastLocation = useLastLocation()

  function back() {
    props.history.push(lastLocation || `/user/${localStorage.User}/`)
  }

  return lastLocation ?
    <ActionButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={props.onClick || back}
    />
    :
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle />}
      onClick={props.onClick || back}
    />
}