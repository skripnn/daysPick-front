import React, {useEffect, useState} from "react";
import {Calendar} from "../calendar-block/calendar";
import {projectsSort, projectsToDays, setClients} from "../functions/functions";
import {Project} from "../project-block/project";
import {deleteProject, getFromUrl, postProject} from "../functions/fetch";
import {toHomePage} from "../functions/router";

export default function ProjectPage() {
  const [state, setState] = useState(null)
  const [calendar, setCalendar] = useState(null)

  function changeAll(result) {
    setState({
      projects: projectsSort(result.projects),
      daysOff: result.daysOff,
      project: result.project,
      clients: setClients(result.projects)
    })
    setCalendar({
      edit: true,
      days: projectsToDays(result.projects, result.project),
      daysOff: result.daysOff,
      daysPick: result.project.dates,
      dates: result.project.dates
    })
  }

  // function changeState(fields) {
  //   setState({
  //     projects: fields.projects || state.projects,
  //     daysOff: fields.daysOff || state.daysOff,
  //     project: fields.project || state.project,
  //     clients: fields.clients || state.clients
  //   })
  // }

  function changeCalendar(fields) {
    setCalendar({
      edit: fields.edit !== undefined? fields.edit : calendar.edit,
      days: fields.days || calendar.days,
      daysOff: fields.daysOff || calendar.daysOff,
      daysPick: fields.daysPick || calendar.daysPick,
      dates: fields.dates || calendar.dates
    })
  }

  function changeDaysPick(daysPick) {
    changeCalendar({
      daysPick: daysPick
    })
  }

  function onSaveClick() {
    let project = {
      id: state.project.id,
      title: document.querySelector("input#title").value,
      money: document.querySelector("input#money").value || null,
      dates: calendar.daysPick,
      client: document.querySelector("input#client").value,
      info: document.querySelector("textarea#info").value,
    }

    if (project.dates.length === 0) {
      alert("Выберете даты")
      return
    }
    if (project.title === "") {
      alert("Введите название проекта")
      return
    }
    if (project.client === "") {
      alert("Заполните название клиента")
      return
    }

    postProject(project).then(
      () => toHomePage(),
      (error) => alert(error))
  }

  function onDeleteClick() {
    deleteProject(state.project.id).then(
      () => toHomePage(),
      (error) => alert(error))
  }

  useEffect(() => {
    function start() {
      getFromUrl().then(result => changeAll(result))
    }
    start()
  }, [])

  if (state === null || calendar === null) return <></>

  return(
    <>
      {console.log(state)}
      <Project
        project={state.project}
        onSaveClick={onSaveClick}
        onDeleteClick={onDeleteClick}
        clients={state.clients}>
        <Calendar {...calendar}
                  changeDaysPick={changeDaysPick}/>
      </Project>
    </>
  )
}
