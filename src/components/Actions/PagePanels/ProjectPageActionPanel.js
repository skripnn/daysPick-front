import {Delete, Save} from "@material-ui/icons";
import React, {useState} from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import { useLastLocation } from 'react-router-last-location';
import BackOrProfileActionButton from "../BackOrProfileActionButton/BackOrProfileActionButton";
import Fetch from "../../../js/Fetch";

function ProjectPageActionPanel(props) {
  const lastLocation = useLastLocation()
  const {id, dates, title, user, serializer} = props.ProjectStore
  const [loading, setLoading] = useState(null)

  function back() {
    props.history.push(lastLocation? lastLocation.pathname : `/user/${user}/`)
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
    if (!title) errors.push('Введи название проекта')
    if (errors.length) {
      let errorsString = 'Ошибка:\n'
      for (let i=0; i< errors.length; i++) {
        errorsString += errors[i] + '\n'
      }
      alert(errorsString)
    }
    else {
      setLoading('save')
      Fetch.post(['project', id], serializer()).then(
        () => back(),
        (error) => {
          setLoading(null)
          alert(error)
        }
      )
    }
  }

  const left = <BackOrProfileActionButton {...props} />

  const right = [
    <ActionButton
      key={"Удалить"}
      label={"Удалить"}
      icon={<Delete />}
      onClick={del}
      disabled={!id || !!loading}
      loading={loading === 'del'}
    />,
    <ActionButton
      key={"Сохранить"}
      label={"Сохранить"}
      icon={<Save />}
      onClick={save}
      disabled={!!loading}
      loading={loading === 'save'}
    />,
  ]

  return (
    <ActionsPanel
      {...props}
      left={left}
      right={right}
    />
  )
}

export default inject('ProjectStore')(observer(ProjectPageActionPanel))