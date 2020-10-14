import React from 'react';
import {Container} from "@material-ui/core";
import Header from "./js/core/app-bar";
import ProjectPage from "./js/pages/projectPage";
import HomePage from "./js/pages/homePage"
import {Route, Switch, Redirect} from "react-router-dom"

export default class App extends React.Component {
  getContent() {
    if (window.location.pathname === "/admin/") return <HomePage/>
    if (window.location.pathname.startsWith("/admin/project/")) return <ProjectPage/>
    else return <></>
  }

  render () {
    const { history } = this.props

    return (
      <div className="App">
        <Header/>
        <Container maxWidth="md" className="content-block">
          <Switch>
            <Route history={history} path='/admin/project/' component={ProjectPage}/>
            <Route history={history} path='/admin/' component={HomePage}/>
            <Redirect from='/' to='/admin/'/>
          </Switch>
          {/*{this.getContent}*/}
        </Container>
      </div>
    )
  }
}
