import {AccountCircle, EventBusy, List, PostAdd} from "@material-ui/icons";
import React, {useState} from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import UserFullName from "../../UserFullName/UserFullName";
import {parseUser} from "../../../js/functions/functions";
import {Dialog, DialogContent} from "@material-ui/core";
import Fetch from "../../../js/Fetch";
import mainStore from "../../../stores/mainStore";


function UserPageActionPanel(props) {
  const {isSelf, edit, dayOffOver, profile, setValue} = props.userPage
  const [image, setImage] = useState(null)

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
      label={isSelf ? 'Добавить' : 'Предложить'}
      icon={<PostAdd/>}
      onClick={() => {
        mainStore.ProjectStore.default({user: parseUser()})
        Fetch.autoLink('/project/')
      }}
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
  const right = isSelf ? buttonsBlock : props.user.is_public ? buttonsBlock.slice(1) : []

  function loadImage() {
    if (props.user.photo) Fetch.getImage(props.user.photo).then(setImage)
  }

  return (<>
    <ActionsPanel
      {...props}
      hidden={props.bottom ? props.hidden : false}
      left={props.bottom ? [] :
        <UserFullName user={props.user} avatar={'left'} edit={isSelf} raise={isSelf} avatarClick={loadImage}/>}
      right={props.hidden ? [] : right}
    />
    {<Dialog open={!!image} onClose={() => setImage(null)} maxWidth={"sm"} scroll={'body'} style={{maxHeight: '95vh'}}>
      <DialogContent style={{padding: 10}}>
        <img src={image} style={{maxWidth: '100%', maxHeight: '100%'}} alt={props.user.full_name}/>
      </DialogContent>
    </Dialog>}
  </>)
}

export default inject(stores => stores.UsersStore.getUser(parseUser()))(observer(UserPageActionPanel))