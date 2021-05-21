import {Cancel, Delete, PostAdd, Save, Send} from "@material-ui/icons";
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
    money_per_day
  } = props.ProjectStore
  const [loading, setLoading] = useState(null)


  function back() {
    setLoading(null)
    Fetch.autoLink(lastLocation ? lastLocation.pathname : `/user/${localStorage.User}/`)
    props.ProjectStore.default()
  }

  function del() {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Удалить проект?')) return
    setLoading('del')
    Fetch.delete(['project', id]).then(back)
  }

  function save() {
    let errors = []
    if (!dates.length) errors.push('Выбери даты')
    // if (!title) errors.push('Введи название проекта')
    if (errors.length) {
      let errorsString = 'Ошибка:\n'
      for (let i = 0; i < errors.length; i++) {
        errorsString += errors[i] + '\n'
      }
      Info.warning(errorsString)
    } else {
      setLoading('save')
      Fetch.post(['project', id], serializer()).then(
        () => back(),
        (error) => {
          setLoading(null)
          Info.error(error)
        }
      )
    }
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
    <ActionButton
      key={"Сохранить"}
      label={user === creator ? "Сохранить" : (id ? "Изменить" : "Предложить")}
      icon={(user === creator || !!id) ? <Save/> : <Send/>}
      onClick={save}
      disabled={!!loading}
      loading={loading === 'save'}
    />
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