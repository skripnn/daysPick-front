import {AccountCircle, ArrowBackIos, Delete, Save} from "@material-ui/icons";
import React from "react";
import ActionButton from "../ActionButton/ActionButton";
import ActionsPanel from "../ActionsPanel/ActionsPanel";
import {inject, observer} from "mobx-react";
import {deleteProject, postProject} from "../../../js/fetch/project";
import { useLastLocation } from 'react-router-last-location';

function ProjectPageActionPanel(props) {
  const lastLocation = useLastLocation()

  function back() {
    props.project.reset()
    props.history.push(lastLocation || '/user/' + localStorage.User + '/')
  }

  function del() {
    deleteProject(props.project.id).then(() => props.delProject).then(() => back())
  }

  function save() {
    let errors = []
    if (!props.project.dates.length) errors.push('Выбери даты')
    if (!props.project.title) errors.push('Введи название проекта')
    if (!props.project.client) errors.push('Выбери клиента')
    if (errors.length) {
      let errorsString = 'Ошибка:\n'
      for (let i=0; i< errors.length; i++) {
        errorsString += errors[i] + '\n'
      }
      alert(errorsString)
    }
    else {
      postProject(props.project.serializer()).then(
        (result) => {
          props.setProject(result)
          back()
        },
        (error) => alert(error)
      )
    }
  }

  const left = [
    lastLocation ?
    <ActionButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={back}
    />
    :
    <ActionButton
      key={"Профиль"}
      label={"Профиль"}
      icon={<AccountCircle />}
      onClick={back}
    />
  ]

  const right = [
    <ActionButton
      key={"Удалить"}
      label={"Удалить"}
      icon={<Delete />}
      onClick={del}
      disabled={!props.project.id}
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

export default inject(stores => ({
  calendar: stores.UsersStore.getUser(localStorage.User).calendar,
  project: stores.ProjectStore,
  delProject: stores.UsersStore.getUser(localStorage.User).delProject,
  setProject: stores.UsersStore.getUser(localStorage.User).setProject,
}))(observer(ProjectPageActionPanel))