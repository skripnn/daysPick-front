import React, {useEffect, useState} from "react";
import ProjectPageNavigator from "../components/ProjectPageNavigator/ProjectPageNavigator";
import NavigatorButton from "../components/NavigatorButton/NavigatorButton";
import {ArrowBackIos, Save} from "@material-ui/icons";
import {getCalendar, getProject, postProject} from "../js/functions/fetch";
import {Redirect} from "react-router-dom";
import Calendar from "react-pick-calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {Hidden} from "@material-ui/core";

export default function ProjectPage(props) {
  const [state, setState] = useState({
    id: props.match.params.id || undefined,
    dates: [],
    title: '',
    money: null,
    client: null,
    is_paid: false,
    info: '',
    days: []
  })

  useEffect(() => {
    if (state.id) getProject(state.id).then(project => setState({...project, init: {daysPick: project.dates}}))
  // eslint-disable-next-line
  },[])

  const navigator = [
    <NavigatorButton
      key={"Назад"}
      label={"Назад"}
      icon={<ArrowBackIos />}
      onClick={() => window.history.back()}
    />,
    <NavigatorButton
      key={"Сохранить"}
      label={"Сохранить"}
      icon={<Save />}
      onClick={save}
    />,
  ]

  function save() {
    let errors = []
    if (!state.dates.length) errors.push('Выбери даты')
    if (!state.title && !state.client) errors.push('Введи название проекта или клиента')
    if (errors.length) {
      let errorsString = 'Ошибка:\n'
      for (let i=0; i< errors.length; i++) {
        errorsString += errors[i] + '\n'
      }
      alert(errorsString)
    }
    else {
      postProject(state).then(
        () => setState(prevState => ({...prevState, redirect: true})),
        (error) => alert(error)
      )
    }
  }

  if (state.redirect) return <Redirect to={'/user/' + localStorage.User + '/'}/>

  if (state.id && !state.dates.length) return <></>

  const content = (paddingBottom) => {
    return (
      <div className={'project-block'} style={{paddingBottom: paddingBottom}}>
        <Calendar
          edit={true}
          get={(start, end) => getCalendar(start, end, localStorage.User, state.id)}
          onChange={(days) => setState(prevState => ({...prevState, dates: days}))}
          init={state.init}
        />
        <ProjectForm
          {...state}
          onChange={(field) => setState(prevState => ({...prevState, ...field}))}
        />
      </div>
    )
  }

  return (
    <>
      <Hidden xsDown>
        <ProjectPageNavigator children={navigator}/>
        {content()}
      </Hidden>

      <Hidden smUp>
        <ProjectPageNavigator children={navigator} bottom/>
        {content(56)}
      </Hidden>
    </>
  )
}