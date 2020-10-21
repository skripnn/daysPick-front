import React from 'react';
import {Container} from "@material-ui/core";
import Header from "./js/core/header";
import ProjectPage from "./js/pages/projectPage";
import UserPage from "./js/pages/userPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./js/pages/loginPage";
import SignUpPage from "./js/pages/singUpPage";
import UsersPage from "./js/pages/usersPage";
import ConfirmPage from "./js/pages/confirmPage";


class App extends React.Component {
  render () {
    const { history } = this.props

    return (
      <div className="App">
        <Header/>
        <Container maxWidth="md" className="content-block">
          <Switch>
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
}

export default withRouter(App)