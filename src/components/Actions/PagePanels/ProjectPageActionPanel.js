import {AssignmentTurnedIn, Cancel, Delete, PostAdd, Save, Send} from "@material-ui/icons";
import React, {useState} from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import { useLastLocation } from 'react-router-last-location';
import BackOrProfileActionButton from "../BackOrProfileActionButton/BackOrProfileActionButton";
import Fetch from "../../../js/Fetch";
import mainStore from "../../../stores/mainStore";
import Info from "../../../js/Info";

function ProjectPageActionPanel(props) {
  const lastLocation = useLastLocation()
  const {
    id,
    dates,
    title,
    user,
    serializer,
    creator,
    canceled,
    is_folder,
    client,
    money,
    money_calculating,
    money_per_day,
    confirmed
  } = props.ProjectStore
  const [loading, setLoading] = useState(null)

  function back() {
    setLoading(null)
    Fetch.autoLink(lastLocation ? lastLocation.pathname : `@${localStorage.User}`)
    props.ProjectStore.default()
  }

  function del() {
    const text = user === creator || canceled ? "Удалить проект?" : (user === localStorage.User ? "Отказаться от проекта?" : "Отменить проект?")
    // eslint-disable-next-line no-restricted-globals
    if (!confirm(text)) return
    setLoading('del')
    Fetch.delete(['project', id]).then(back)
  }

  function save() {
    if (!user) Info.warning('Ошибка: Выбери подрядчика для проекта')
    else if (!dates.length) Info.warning('Ошибка: Выбери даты')
    else if (user !== localStorage.User && !title) Info.warning('Ошибка: Введи название проекта')
    else {
      setLoading('save')
      Fetch.post(['project', id], serializer()).then(
        r => {
          if (r && r.error) setLoading(null)
          else back()
        }
      )
    }
  }

  const confirmButton = (
    <ActionButton
      key={"Принять"}
      label={'Принять'}
      icon={<AssignmentTurnedIn/>}
      onClick={save}
      disabled={!!loading || confirmed}
      loading={loading === 'save'}
    />
  )

  const suggestButton = (
    <ActionButton
      key={"Сохранить"}
      label={id ? "Изменить" : "Предложить"}
      icon={!!id ? <Save/> : <Send/>}
      onClick={save}
      disabled={!!loading}
      loading={loading === 'save'}
    />
  )

  const saveButton = (
    <ActionButton
      key={"Сохранить"}
      label={"Сохранить"}
      icon={<Save/>}
      onClick={save}
      disabled={!!loading}
      loading={loading === 'save'}
    />
  )

  const saveButtonChoice = () => {
    if (user === creator) return saveButton
    if (user === localStorage.User) {
      if (!confirmed) return confirmButton
      return saveButton
    }
    return suggestButton
  }

  const left = <BackOrProfileActionButton {...props}/>
  const right = canceled ? [
    <ActionButton
      key={"Удалить"}
      label={"Удалить"}
      icon={<Delete/>}
      onClick={del}
      disabled={!id || !!loading}
      loading={loading === 'del'}
    />
  ] : [
    <ActionButton
      key={"Удалить"}
      label={user === creator ? "Удалить" : (user === localStorage.User ? "Отказаться" : "Отменить")}
      icon={user === creator ? <Delete/> : <Cancel/>}
      onClick={del}
      disabled={!id || !!loading}
      loading={loading === 'del'}
    />,
    saveButtonChoice()
  ]
  if (is_folder) right.unshift(<ActionButton
    key={'Добавить'}
    label={'Добавить'}
    icon={<PostAdd/>}
    onClick={() => {
      mainStore.ProjectStore.default({
        parent: {
          id: id,
          title: title,
          client: client,
          money: money,
          money_calculating: money_calculating,
          money_per_day: money_per_day
        },
        client: client,
        money: money,
        money_calculating: money_calculating,
        money_per_day: money_per_day
      })
      Fetch.autoLink('project')
    }}
  />)

  return (
    <ActionsPanel
      {...props}
      left={left}
      right={right}
    />
  )
}

export default inject('ProjectStore')(observer(ProjectPageActionPanel))
