import React, {useState} from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import ActionsPanel from "../Actions/ActionsPanel/ActionsPanel";
import ActionButton from "../Actions/ActionButton/ActionButton";
import {ArrowBackIos, Delete, Save} from "@material-ui/icons";
import UserAvatar from "../UserAvatar/UserAvatar";
import Fetch from "../../js/Fetch";
import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import Avatar from "react-avatar-edit";

export default function AvatarDialog(props) {
  const [preview, setPreview] = useState(null)
  const [image, setImage] = useState(props.image)
  const [loading, setLoading] = useState(null)
  const fullScreen = useMediaQuery('(max-width:720px)');

  const Actions = (
    <ActionsPanel
      bottom={fullScreen}
      left={[
        <ActionButton
          onClick={props.close}
          label="Назад"
          icon={<ArrowBackIos/>}
          key={'back'}
        />,
        <ActionButton
          key={'preview'}
          disabled
          label="Аватар"
          icon={preview? <img src={preview} alt="Preview" style={{width: 24, height: 24}}/> : <UserAvatar avatar={props.avatar} full_name={props.full_name} size={24}/>}
        />
      ]}
      right={[
        <ActionButton
          key={'del'}
          onClick={del}
          label="Удалить"
          disabled={!props.avatar || loading}
          icon={<Delete/>}
          loading={loading === 'del'}
        />,
        <ActionButton
          key={'save'}
          onClick={save}
          label="Сохранить"
          disabled={!preview || loading}
          icon={<Save/>}
          loading={loading === 'save'}
        />
      ]}
    />
  )

  function del() {
    setLoading('del')
    Fetch.post('profile', {avatar: null, photo: null}).then(props.onChange).then(props.onChange).then(props.close)
  }

  function save() {
    setLoading('save')
    const data = new FormData()
    if (image !== props.image) data.append('photo', Fetch.fromBase64(image))
    data.append('avatar', Fetch.fromBase64(preview))
    Fetch.postForm(['profile', 'img'], data).then(props.onChange).then(props.close)
  }

  function onBeforeFileLoad(elem) {
    if(elem.target.files[0].size > 5000000){
      alert("Файл слишком большой");
      elem.target.value = "";
    }
  }

  return (
    <Dialog
      open={true}
      onClose={props.close}
      fullWidth
      fullScreen={fullScreen}
      maxWidth={'sm'}
    >
      {!fullScreen && <DialogTitle>{Actions}</DialogTitle>}
      <DialogContent>
        <Avatar
          src={image}
          label={'Выбери файл'}
          width={fullScreen? document.documentElement.clientWidth - 52 : 548}
          height={fullScreen? document.documentElement.clientHeight - 102 : 366}
          onCrop={setPreview}
          onClose={() => {
            setPreview(null)
            setImage(null)
          }}
          onFileLoad={f => Fetch.toBase64(f).then(setImage)}
          exportQuality={1}
          onBeforeFileLoad={onBeforeFileLoad}
        />
      </DialogContent>
      {fullScreen && Actions}
    </Dialog>
  )
}
