import React, {useEffect, useState} from "react";
import {Calendar} from "../calendar-block/calendar";
import {projectsToDays, setClients} from "../functions/functions";
import {Project} from "../project-block/project";
import {deleteProject, getFromUrl, postProject} from "../functions/fetch";

export default function ProjectPage() {
  const [state, setState] = useState(null)
  const [calendar, setCalendar] = useState(null)

  function changeAll(result) {
    setState({
      project: result.project,
      clients: setClients(result.projects)
    })
    setCalendar({
      edit: (result.project.id && result.project.creator === localStorage.getItem('User')) || 'true',
      days: projectsToDays(result.projects, result.project),
      daysOff: result.daysOff,
      daysPick: result.project.dates,
      dates: result.project.dates
    })
  }

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

  function changeStatus() {
    if (state.project.status === "ok" || state.project.status === localStorage.getItem("User")) return state.project.status
    if (state.project.status === "new" || state.project.status === state.project.creator) return "ok"
  }

  function onSaveClick() {
    let project = {
      id: state.project.id,
      status: changeStatus(),
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
      () => window.history.back(),
      (error) => alert(error))
  }

  function onDeleteClick(e) {
    e.preventDefault()
    deleteProject(state.project.id).then(
      () => window.history.back(),
      (error) => alert(error))
  }

  useEffect(() => {
    function start() {
      getFromUrl().then(result => changeAll(result))
    }
    start()
  }, [])

  if (!state || !calendar) return <></>

  return(
    <>
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
