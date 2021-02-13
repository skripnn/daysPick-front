import ActionButton from "../ActionButton/ActionButton";
import {AccountCircle, ArrowBackIos} from "@material-ui/icons";
import React from "react";
import {useLastLocation} from "react-router-last-location";

export default function BackOrProfileActionButton(props) {
  const lastLocation = useLastLocation()

  return lastLocation ?
    <ActionButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={props.onClick || (() => props.history.goBack())}
    />
    :
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle />}
      onClick={props.onClick || (() => props.history.push(`/user/${localStorage.User}/`))}
    />
}