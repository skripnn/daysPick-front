import {AccountCircle, EventBusy, List, PostAdd} from "@material-ui/icons";
import React, {useRef, useState} from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import UserFullName from "../../UserFullName/UserFullName";
import {parseUser} from "../../../js/functions/functions";
import {Dialog, DialogContent, Popover} from "@material-ui/core";
import Fetch from "../../../js/Fetch";
import mainStore from "../../../stores/mainStore";


function UserPageActionPanel(props) {
  const {isSelf, edit, dayOffOver, profile, unconfirmedProjects, setValue} = props.userPage
  const [image, setImage] = useState(null)

  const buttonsBlock = [
    <ActionButton
      hidden={!isSelf}
      key={"Выходные"}
      label={"Выходные"}
      icon={<EventBusy/>}
      active={edit}
      red={dayOffOver}
      onClick={() => setValue({profile: false, dayInfo: null, dayOffOver: false, edit: !edit, activeProjectTab: 'Projects'})}
    />,
    <AddProjectActionButton
      key={'Добавить'}
      bottom={props.bottom}
      user={props.user}
      setProject={(obj) => {
        mainStore.ProjectStore.default(obj)
        Fetch.autoLink('project')
      }}
    />,
    <ActionButton
      badge={unconfirmedProjects}
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
  const right = !localStorage.User? []
    : isSelf ? buttonsBlock
      : props.user.is_public ? buttonsBlock.slice(1)
        : []

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


function AddProjectActionButton({bottom, setProject, user}) {
  const [anchorEl, setAnchorEl] = useState(null)
  const ref = useRef()

  const origin = {
    vertical: bottom ? 'bottom' : 'top',
    horizontal: 'center',
  }

  const label = (title) => <><span style={{paddingTop: 3.5}}>{title}</span><span style={{paddingBottom: 3.5}}>проект</span></>

  const isSelf = user.username === localStorage.User

  const setUserProject = () => setProject({
    user: user.username,
    user_info: user
  })

  return (
    <>
      <ActionButton
        ref={ref}
        key={'Добавить'}
        label={'Добавить'}
        icon={<PostAdd/>}
        onClick={isSelf ? () => setAnchorEl(ref.current) : setUserProject}
      />
      <Popover
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        marginThreshold={0}
        anchorOrigin={origin}
        transformOrigin={origin}
      >
        <ActionButton
          className={'full-width'}
          label={label('Собственный')}
          onClick={setUserProject}
        />
        <ActionButton
          className={'full-width'}
          label={label('Исходящий')}
          onClick={() => setProject({
            user: null,
            user_info: null
          })}
        />
        <ActionButton
          disabled
          className={'full-width'}
          label={label('Открытый')}
        />
      </Popover>
    </>
  )
}
