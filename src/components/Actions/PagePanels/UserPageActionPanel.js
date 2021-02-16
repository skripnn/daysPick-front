import {AccountCircle, EventBusy, List, PostAdd} from "@material-ui/icons";
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import UserFullName from "../../UserFullName/UserFullName";
import {parseUser} from "../../../js/functions/functions";


function UserPageActionPanel(props) {
  const {isSelf, edit, dayOffOver, profile, setValue} = props.userPage

  const buttonsBlock = [
    <ActionButton
      hidden={!isSelf}
      key={"Выходные"}
      label={"Выходные"}
      icon={<EventBusy/>}
      active={edit}
      red={dayOffOver}
      onClick={() => setValue({profile: false, dayInfo: null, dayOffOver: false, edit: !edit})}
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
      active={!profile}
      onClick={() => setValue({edit: false, profile: false})}
    />,
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle/>}
      active={profile}
      onClick={() => setValue({edit: false, profile: true})}
    />
  ]
  const right = localStorage.User? buttonsBlock : []


  return (
    <ActionsPanel
      {...props}
      hidden={props.bottom ? props.hidden : false}
      left={props.bottom ? [] : <UserFullName user={props.user} avatar={'left'} edit={isSelf}/>}
      right={props.hidden ? [] : right}
    />
  )
}

export default inject(stores => stores.UsersStore.getUser(parseUser()))(observer(UserPageActionPanel))