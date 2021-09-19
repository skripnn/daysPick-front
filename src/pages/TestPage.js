import Calendar, {UsersList} from "../components/test/components/Calendar";
import Fetch from "../js/Fetch";
import {useState} from "react";
import {CalendarBase} from "../components/test/Calendar";

function TestPageCalendar() {
  // const [state, setState] = useState(null)
  // const [days, setDays] = useState([])
  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])

  const onChange = (state, dates) => {
    setProjects(prevState => prevState.map(i => ({...i, ...state.find(p => p.user.username === i.user.username)})))
    setProject(prevState => ({...prevState, dates: dates}))
  }
  // console.log('state', state)
  // console.log('days', days)

  return (<>
    <Calendar
      edit
      get={Fetch.getCalendar}
      usersContent={projects}
      onChange={onChange}
      username={localStorage.User}
      noOffset={true}
      // multiView
      // multi={<UsersList project={project} projects={projects} setProject={setProject} onChange={setProjects}/>}
    />
  </>)
}

function TestPage() {
  const [user, setUser] = useState(null)

  return <Calendar/>
    }

export default TestPageCalendar
