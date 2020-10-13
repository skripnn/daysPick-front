import React from 'react';
import {projectsToDays, projectsSort, setUrl} from "./js/functions/functions";
import {getProject, getFromUrl, postDaysOff, getDaysOff, postProject, deleteProject} from "./js/functions/fetch";
import {Container} from "@material-ui/core";
import {ProjectsList} from "./js/project-block/projects-list";
import {defaultProject, Project} from "./js/project-block/project";
import DaysOffEdit from "./js/buttons-block/days-off";
import Header from "./js/core/app-bar";
import {Calendar} from "./js/calendar-block/calendar";
// import {Calendar} from "./js/calendar";
import {ClientsList} from "./js/client-block/clients-list";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      daysOffEdit: false,
      onload: false,
      calendar: {edit: false},
      project: null,
      clients: [],
      projectListExpanded: "projects"
    }

    this.setEditProject = this.setEditProject.bind(this)
    this.updateProjects = this.updateProjects.bind(this)

    this.changeDaysPick = this.changeDaysPick.bind(this)
    this.editDaysOff = this.editDaysOff.bind(this)
    this.saveDaysOff = this.saveDaysOff.bind(this)
    this.backDaysOff = this.backDaysOff.bind(this)

    this.projectSave = this.projectSave.bind(this)
    this.projectDelete = this.projectDelete.bind(this)
    this.projectBack = this.projectBack.bind(this)
    this.projectNew = this.projectNew.bind(this)
    this.projectEdit = this.projectEdit.bind(this)

    this.setProjectListExpanded = this.setProjectListExpanded.bind(this)
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    setUrl(this.state)
  }

  componentDidMount() {
    getFromUrl().then(
      (result) => {
        if (window.location.pathname === "/admin/clients/") {
          this.setState({clients: result})
        }
        else this.updateProjects(result)
        this.setState({onload: true})
      },
      (error) => {
        alert(error);
      }
    )
  }

  setEditProject(id) {
    if (id) {
      getProject(id).then(
        (result) => {
          this.setState({
            project: result.project,
            calendar: {
              edit: true,
              days: projectsToDays(this.state.projects, result.project),
              daysOff: this.state.daysOff,
              daysPick: result.project.dates,
              dates: result.project.dates
            }
          })
        },
      )
    }
    else {
      if (id !== null) id = defaultProject
      this.setState({
        project: id,
        calendar: {
          edit: id !== null,
          days: projectsToDays(this.state.projects),
          daysOff: this.state.daysOff,
        }
      })
    }
  }

  updateProjects(result) {
    const projects = projectsSort(result.projects)
    this.setState({
      projects: projects,
      daysOff: result.daysOff,
      calendar: {
        edit: !!result.project,
        days: projectsToDays(projects, result.project),
        daysOff: result.daysOff,
        daysPick: result.project? result.project.dates : [],
        dates: result.project? result.project.dates : undefined
      },
      project: result.project || null
    });
  }

  changeDaysPick(daysPick) {
    this.setState({
      calendar: {
        edit: this.state.calendar.edit,
        days: this.state.calendar.days,
        daysOff: this.state.calendar.daysOff,
        daysPick: daysPick
      }
    })
  }

  editDaysOff() {
    this.setState({
      calendar: {
        edit: true,
        days: this.state.calendar.days,
        daysOff: [],
        daysPick: this.state.daysOff
      }
    })
  }

  saveDaysOff() {
    postDaysOff(this.state.calendar.daysPick).then(
      (result) => {
        this.updateProjects(result)
      },
      (error) => {
        alert(error);
      }
    )
  }

  backDaysOff() {
    getDaysOff().then(
      (result) => {
        this.setState({
          daysOff: result,
          calendar: {
            edit: false,
            days: this.state.calendar.days,
            daysOff: result
          }
        })
      },
      (error) => {
        alert(error);
      }
    )
  }

  projectSave() {
    let project = {
      id: this.state.project.id,
      title: document.querySelector("input#title").value,
      money: document.querySelector("input#money").value || null,
      dates: this.state.calendar.daysPick,
      contact: {
        name: document.querySelector("input#name").value,
        phone: document.querySelector("input#phone").value
      },
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
    if (project.contact.name === "") {
      alert("Заполните имя клиента")
      return
    }

    postProject(project).then(
      (result) => {
        this.updateProjects(result)
      },
      (error) => {
        alert(error);
      })
  }

  projectDelete() {
    deleteProject(this.state.project.id).then(
      (result) => {
        this.updateProjects(result)
      },
      (error) => {
        alert(error);
      })
  }

  projectBack() {
    this.setEditProject(null)
  }

  projectNew() {
    this.setEditProject()
  }

  projectEdit(e) {
    this.setEditProject(e.target.parentElement.id)
  }

  setProjectListExpanded(expanded) {
    this.setState({
      projectListExpanded: expanded
    })
  }

  getContent() {
    if (!this.state.onload) {
      return <></>
    }

    if(window.location.pathname === "/admin/clients/") {
      return <ClientsList clients={this.state.clients}/>
    }

    if (!this.state.project) {
      return (
        <>
          <DaysOffEdit state={this.state.calendar.edit}
                       daysOff={this.state.daysOff}
                       onSaveClick={this.saveDaysOff}
                       onBackClick={this.backDaysOff}
                       onEditClick={this.editDaysOff}/>
          <Calendar {...this.state.calendar}
                    changeDaysPick={this.changeDaysPick}/>
          <ProjectsList project={this.state.project}
                        projects={this.state.projects}
                        expanded={this.state.projectListExpanded}
                        setExpanded={this.setProjectListExpanded}
                        onNewClick={this.projectNew}
                        onRowClick={this.projectEdit}/>
        </>
      )
    }

    if (!!this.state.project) {
      return (
        <>
          <Project
            project={this.state.project}
            onSaveClick={this.projectSave}
            onBackClick={this.projectBack}
            onDeleteClick={this.projectDelete}
          >
            <Calendar {...this.state.calendar}
                      changeDaysPick={this.changeDaysPick}/>
          </Project>
        </>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <Container maxWidth="md" className="content-block">
          {this.getContent()}
        </Container>
      </div>
    );
  }
}


export default App;
