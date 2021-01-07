import React, {useEffect, useState} from 'react';
import Container from "@material-ui/core/Container";
import Header from "./js/core/header";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/singUpPage";
import UsersPage from "./pages/usersPage";
import ConfirmPage from "./pages/confirmPage";
// import TestPage from "./pages/TestPage";

function App(props) {

  const { history } = props

  return (
    <div className="App">
      <Header/>
      <Container maxWidth="md" className={"content-block"}>
        <Switch>
          {/*<Route history={history} path='/test' component={TestPage}/>*/}
          <Route history={history} path='/project/:id' component={ProjectPage}/>
          <Route history={history} path='/project' component={ProjectPage}/>
          <Route history={history} path='/login' component={LoginPage}/>
          <Route history={history} path='/signup' component={SignUpPage}/>
          <Route history={history} path='/confirm' component={ConfirmPage}/>
          <Route history={history} path='/user/:username' component={UserPage}/>
          <Route history={history} path='/' component={UsersPage}/>
        </Switch>
      </Container>
    </div>
  )
}

export default withRouter(App)