import React, {useEffect, useRef} from 'react';
import Container from "@material-ui/core/Container";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ConfirmPage from "./pages/confirmPage";
import './App.css'
import ActionsSwitch from "./components/Actions/ActionsSwitch";
import ClientsPage from "./pages/ClientsPage";
import Header from "./components/Header/Header";
import ProjectsPage from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from '@material-ui/styles';
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import {useMediaQuery} from "@material-ui/core";
import Fetch from "./js/Fetch";
import theme from "./js/theme";
import InfoBar from "./components/InfoBar/InfoBar";
import Keys from "./js/Keys";
import TestPage from "./pages/TestPage";
import mainStore from "./stores/mainStore";
import {useOnFocusHook} from "./components/hooks";

function App(props) {
  const mobile = useMediaQuery('(max-width:600px)')

  const { history } = props
  Fetch.history = history
  const ref = useRef()

  const lightTheme = useMediaQuery('(prefers-color-scheme: light)')
  useEffect(() => {
    const favicon = document.getElementById('favicon')
    if (lightTheme) favicon.href = favicon.href.replace('favicon.ico', 'favicon-black.ico')
    else favicon.href = favicon.href.replace('favicon-black.ico', 'favicon.ico')
  }, [lightTheme])

  useOnFocusHook(() => {
    if (localStorage.User) mainStore.UsersStore.getUser(localStorage.User).getUser()
  })

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header history={history}/>
        <Container maxWidth="md" className={"content-block"} ref={ref}>
          <ActionsSwitch hidden={mobile} history={history}/>
          <Switch>
            {Keys.env === 'dev' && <Route history={history} path='/test/' component={TestPage}/>}
            <Route history={history} path='/settings/' component={SettingsPage}/>
            <Route history={history} path='/profile/' component={ProfilePage}/>
            <Route history={history} path='/clients/' component={ClientsPage}/>
            <Route history={history} path='/projects/' component={ProjectsPage}/>
            <Route history={history} path='/project/:id/' component={ProjectPage}/>
            <Route history={history} path='/project/' component={ProjectPage}/>
            <Route history={history} path='/login/' component={LoginPage}/>
            <Route history={history} path='/signup/' component={SignupPage}/>
            <Route history={history} path='/confirm/' component={ConfirmPage}/>
            <Route history={history} path='/user/:username/' component={UserPage}/>
            <Route history={history} path='/search/' component={SearchPage}/>
            <Route history={history} path='/' component={MainPage}/>
          </Switch>
        </Container>
        <InfoBar/>
      </div>
      {mobile && <ActionsSwitch bottom history={history}/>}
    </ThemeProvider>
  )
}

export default withRouter(App)
