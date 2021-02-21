import {Delete, Save} from "@material-ui/icons";
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import { useLastLocation } from 'react-router-last-location';
import BackOrProfileActionButton from "../BackOrProfileActionButton/BackOrProfileActionButton";
import Fetch from "../../../js/Fetch";

function ProjectPageActionPanel(props) {
  const lastLocation = useLastLocation()
  const {id, dates, title, user, serializer} = props.ProjectStore

  function back() {
    props.history.push(lastLocation? lastLocation.pathname : `/user/${user}/`)
    props.ProjectStore.default()
  }

  function del() {
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
      Fetch.post(['project', id], serializer()).then(
        () => back(),
        (error) => alert(error)
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
      disabled={!id}
    />,
    <ActionButton
      key={"Сохранить"}
      label={"Сохранить"}
      icon={<Save />}
      onClick={save}
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