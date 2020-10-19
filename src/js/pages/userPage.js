import {projectsSort, projectsToDays} from "../functions/functions";
import React, {useEffect, useState} from "react";
import {getDaysOff, getFromUrl, postDaysOff} from "../functions/fetch";
import DaysOffEdit from "../buttons-block/days-off";
import {Calendar} from "../calendar-block/calendar";
import {ProjectsList} from "../project-block/projects-list";
import pick from "../functions/pick";


export default function UserPage() {
  const [state, setState] = useState(null)
  const [calendar, setCalendar] = useState(null)

  function changeAll(result) {
    if (!result) return
    setState({
      projects: projectsSort(result.projects),
      daysOff: result.daysOff,
      projectListExpanded: state === null? "projects" : state.projectListExpanded
    })
    setCalendar({
      edit: false,
      days: projectsToDays(result.projects),
      daysOff: result.daysOff,
      daysPick: []
    })
  }

  function changeCalendar(fields) {
    setCalendar({
      edit: fields.edit !== undefined? fields.edit : calendar.edit,
      days: fields.days || calendar.days,
      daysOff: fields.daysOff || calendar.daysOff,
      daysPick: fields.daysPick || calendar.daysPick
    })
  }

  function changeState(fields) {
    setState({
      projects: fields.projects || state.projects,
      daysOff: fields.daysOff || state.daysOff,
      projectListExpanded: fields.projectListExpanded || state.projectListExpanded
    })
  }

  function setProjectListExpanded(expanded) {
    changeState({
      projectListExpanded: expanded
    })
  }

  function changeDaysPick(daysPick) {
    changeCalendar({
      daysPick: daysPick
    })
  }

  function editDaysOff() {
    changeCalendar({
      edit: true,
      daysPick: state.daysOff,
      daysOff: []
    })
  }

  function saveDaysOff() {
    postDaysOff(calendar.daysPick).then(
      (result) => {
        changeAll(result)
        pick("unset", "daysOff")
      }
    )
  }

  function backDaysOff() {
    getDaysOff().then(
      (result) => {
        changeState({daysOff: result})
        changeCalendar({
          edit: false,
          daysOff: result,
          daysPick: []
        })
        pick("unset", "daysOff")
      }
    )
  }

  useEffect(() => {
    function start() {
      getFromUrl().then(result => {
        changeAll(result)
      })
    }
    start()
    // eslint-disable-next-line
  }, [])

  if (!state || !calendar) return <></>

  const DaysOff = () => {
    if (window.location.pathname.match(/\/user\/(.*)\//)[1] === localStorage.getItem("User")) {
      return (
        <DaysOffEdit state={calendar.edit}
                     daysOff={state.daysOff}
                     onSaveClick={saveDaysOff}
                     onBackClick={backDaysOff}
                     onEditClick={editDaysOff}/>
      )
    }
    return <></>
  }


  return (
    <>
      <DaysOff/>
      <Calendar {...calendar}
                changeDaysPick={changeDaysPick}/>
      <ProjectsList projects={state.projects}
                    expanded={state.projectListExpanded}
                    setExpanded={setProjectListExpanded}/>
    </>
  )
}


