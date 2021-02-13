import ActionButton from "../ActionButton/ActionButton";
import {AccountCircle, ArrowBackIos} from "@material-ui/icons";
import React from "react";
import {useLastLocation} from "react-router-last-location";
import {LocalUser} from "../../../js/functions/functions";

export default function BackOrProfileActionButton(props) {
  const lastLocation = useLastLocation()

  const back = (
    <ActionButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={props.onClick || (() => props.history.goBack())}
    />
  )

  const profile = (
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle />}
      onClick={props.onClick || (() => props.history.push(`/user/${LocalUser()}/`))}
    />
  )

  if (props.type === 'back') return back
  if (props.type === 'profile') return profile
  return lastLocation ? back : profile
}