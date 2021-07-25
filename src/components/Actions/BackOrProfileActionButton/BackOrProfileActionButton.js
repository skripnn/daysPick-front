import ActionButton from "../ActionButton/ActionButton";
import {ArrowBackIos, Home} from "@material-ui/icons";
import React from "react";
import {useLastLocation} from "react-router-last-location";
import Fetch from "../../../js/Fetch";

export default function BackOrProfileActionButton(props) {
  const lastLocation = useLastLocation()

  const back = (
    <ActionButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={props.onClick || (() => Fetch.back())}
    />
  )

  const profile = localStorage.User ? (
    <ActionButton
      key={"Домой"}
      label={"Домой"}
      icon={<Home />}
      onClick={props.onClick || (() => Fetch.link(`/@${localStorage.User}/`))}
    />
  ) : null

  if (props.type === 'back') return back
  if (props.type === 'profile') return profile
  return lastLocation ? back : profile
}
