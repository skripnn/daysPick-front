import React, {useEffect, useState} from 'react';
import Container from "@material-ui/core/Container";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/singUpPage";
import UsersPage from "./pages/usersPage";
import ConfirmPage from "./pages/confirmPage";
import TestPage from "./pages/TestPage";
import './App.css'
import ActionsSwitch from "./components/Actions/ActionsSwitch";
import ClientsPage from "./pages/ClientsPage";
import Header from "./components/Header/Header";
import ProjectsList from "./components/ProjectList/ProjectList";

function App(props) {
  const [mobile, setMobile] = useState(document.body.clientWidth < 720)

  useEffect(() => {
    window.addEventListener('resize', () => setMobile(document.body.clientWidth < 720))
  },[])

  const { history } = props

  return (
    <div className="App">
      <Header history={history}/>
      <Container maxWidth="md" className={"content-block"}>
        <ActionsSwitch hidden={mobile} history={history}/>
        <Switch>
          <Route history={history} path='/clients' component={ClientsPage}/>
          <Route history={history} path='/projects/' component={ProjectsList}/>
          <Route history={history} path='/test' component={TestPage}/>
          <Route history={history} path='/project/:id' component={ProjectPage}/>
          <Route history={history} path='/project/' component={ProjectPage}/>
          <Route history={history} path='/login' component={LoginPage}/>
          <Route history={history} path='/signup' component={SignUpPage}/>
          <Route history={history} path='/confirm' component={ConfirmPage}/>
          <Route history={history} path='/user/:username' component={UserPage}/>
          <Route history={history} path='/' component={UsersPage}/>
        </Switch>
      </Container>
      {mobile && <div className={'block static'}>
        <ActionsSwitch bottom history={history}/>
      </div>}
    </div>
  )
}

export default withRouter(App)