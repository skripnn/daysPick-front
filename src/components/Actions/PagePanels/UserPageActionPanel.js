import {AccountCircle, EventBusy, List, PostAdd} from "@material-ui/icons";
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import UserFullName from "../../UserFullName/UserFullName";
import {getUser} from "../../../js/functions/functions";


function UserPageActionPanel(props) {

  const buttonsBlock = [
    <ActionButton
      key={"Выходные"}
      label={"Выходные"}
      icon={<EventBusy/>}
      active={props.edit}
      red={props.dayOffOver}
      onClick={() => props.setValue({profile: false, dayInfo: null, dayOffOver: false, edit: !props.edit})}
    />,
    <ActionButton
      key={'Добавить'}
      label={'Добавить'}
      icon={<PostAdd/>}
      link={'/project/'}
    />,
    <ActionButton
      key={"Проекты"}
      label={"Проекты"}
      icon={<List/>}
      active={!props.profile}
      onClick={() => props.setValue({edit: false, profile: false})}
    />,
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle/>}
      active={props.profile}
      onClick={() => props.setValue({edit: false, profile: true})}
    />
  ]
  const right = localStorage.User? buttonsBlock : []


  return (
    <ActionsPanel
      {...props}
      hidden={props.bottom ? props.hidden : false}
      left={props.bottom ? [] : [<UserFullName user={props.user} key={'userFullName'}/>]}
      right={props.hidden ? [] : right}
    />
  )
}

export default inject(stores => ({
  ...stores.UsersStore.getUser(getUser()).userPage,
  user: stores.UsersStore.getUser(getUser()).user,
  setValue: stores.UsersStore.getUser(getUser()).setValue
}))(observer(UserPageActionPanel))