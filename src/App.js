import React, {useEffect, useRef} from 'react';
import Container from "@material-ui/core/Container";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmailLinkPage from "./pages/EmailLinkPage";
import './App.css'
import ActionsSwitch from "./components/Actions/ActionsSwitch";
import ClientsPage from "./pages/ClientsPage";
import Header from "./components/Header/Header";
import {ProjectsPage, OffersPage} from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from '@material-ui/styles';
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import SettingsPage from "./pages/SettingsPage";
import {Dialog, useMediaQuery} from "@material-ui/core";
import Fetch from "./js/Fetch";
import theme from "./js/theme";
import InfoBar from "./components/InfoBar/InfoBar";
import Keys from "./js/Keys";
import TestPage from "./pages/TestPage";
import {useMobile, useWindowHeightResizeCallback} from "./components/hooks";
import FeedPage from "./pages/FeedPage";
import Terms from "./pages/terms";
import mainStore from "./stores/mainStore";
import Login from "./components/Login/Login";
import RecoveryPage from "./pages/RecoveryPage";

function App(props) {
  const mobile = useMobile()
  useWindowHeightResizeCallback(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  })

  const { history } = props
  Fetch.history = history
  const ref = useRef()

  const lightTheme = useMediaQuery('(prefers-color-scheme: light)')
  useEffect(() => {
    const favicon = document.getElementById('favicon')
    if (lightTheme) favicon.href = favicon.href.replace('favicon.ico', 'favicon-black.ico')
    else favicon.href = favicon.href.replace('favicon-black.ico', 'favicon.ico')
  }, [lightTheme])

  useEffect(() => {
    if (localStorage.User && localStorage.User !== mainStore.AccountStore.username) {
      Fetch.get('account').then(mainStore.AccountStore.setValue)
    }
  // eslint-disable-next-line
  }, [localStorage.User])

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header history={history}/>
        <Container maxWidth="md" className={"content-block"} ref={ref}>
          <ActionsSwitch hidden={mobile} history={history}/>
          <Switch>
            {Keys.env === 'dev' && <Route history={history} path='/test/' component={TestPage}/>}
            {Keys.env === 'dev' && <Route history={history} path='/feed/' component={FeedPage}/>}
            <Route history={history} path={'/terms/'} component={Terms}/>
            <Route history={history} path={'/recovery/'} component={RecoveryPage}/>
            <AuthRoute history={history} path='/settings/' component={SettingsPage}/>
            <AuthRoute history={history} path='/profile/' component={ProfilePage}/>
            <AuthRoute history={history} path='/clients/' component={ClientsPage}/>
            <AuthRoute history={history} path='/projects/' component={ProjectsPage}/>
            <AuthRoute history={history} path='/offers/' component={OffersPage}/>
            <AuthRoute history={history} path='/project/:id/' component={ProjectPage}/>
            <AuthRoute history={history} path='/project/' component={ProjectPage}/>
            <Route history={history} path='/login/' component={LoginPage}/>
            <Route history={history} path='/signup/' component={SignupPage}/>
            <Route history={history} path='/confirm/' component={EmailLinkPage}/>
            <Route history={history} path='/user/:username/' component={UserPage}/>
            <Route history={history} path='/search/' component={SearchPage}/>
            <Route history={history} path={'/:prefix([@]):username([0-9a-z]*)/'} component={UserPage}/>
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

function AuthRoute({history, path, component}) {
  if (localStorage.User) return <Route history={history} path={path} component={component}/>
  return (
    <Dialog open={true} fullWidth maxWidth={'xs'}>
      <Login onSuccess={() => window.open(window.location.href,"_self")}/>
    </Dialog>
  )
}
