import React from 'react';
import Container from "@material-ui/core/Container";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, withRouter} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import EmailLinkPage from "./pages/EmailLinkPage";
import './App.css'
import ClientsPage from "./pages/ClientsPage";
import Header from "./components/Header/Header";
import {ProjectsPage, OffersPage} from "./pages/ProjectsPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from '@material-ui/styles';
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import {Dialog} from "@material-ui/core";
import Fetch from "./js/Fetch";
import theme from "./js/theme";
import InfoBar, {LoadingBar} from "./components/InfoBar/InfoBar";
import Keys from "./js/Keys";
import {useColorScheme, useMobileUpdate} from "./components/hooks";
import FeedPage from "./pages/FeedPage";
import TermsPage from "./pages/TermsPage";
import Login from "./components/Login/Login";
import RecoveryPage from "./pages/RecoveryPage";
import Test from "./components/test/Test";
import SettingsPage from "./pages/SettingsPage";
import {useAuthorization, usePreLoader, useUsername} from "./stores/storeHooks";
import FavoritesPage from "./pages/FavoritesPage";

function App(props) {
  const { history } = props
  Fetch.history = history

  useColorScheme()
  useMobileUpdate()
  const authorization = useAuthorization()
  const loading = usePreLoader()
  if (!authorization || loading) return null

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <LoadingBar/>
        <Header history={history}/>
        <Container maxWidth="md" className={"content-block"}>
          <Switch>
            {Keys.env === 'dev' && <Route history={history} path='/test/' component={Test}/>}
            {Keys.env === 'dev' && <Route history={history} path='/feed/' component={FeedPage}/>}
            <Route history={history} path={'/terms/'} component={TermsPage}/>
            <Route history={history} path={'/recovery/'} component={RecoveryPage}/>
            <AuthRoute history={history} path='/settings/' component={SettingsPage}/>
            <AuthRoute history={history} path='/profile/' component={ProfilePage}/>
            <AuthRoute history={history} path='/clients/' component={ClientsPage}/>
            <AuthRoute history={history} path='/favorites/' component={FavoritesPage}/>
            <AuthRoute history={history} path='/projects/' component={ProjectsPage}/>
            <AuthRoute history={history} path='/offers/' component={OffersPage}/>
            <AuthRoute history={history} path='/project/:id/' component={ProjectPage}/>
            <AuthRoute history={history} path='/project/' component={ProjectPage}/>
            <NonAuthRoute history={history} path='/login/' component={LoginPage}/>
            <NonAuthRoute history={history} path='/signup/' component={SignupPage}/>
            <Route history={history} path='/confirm/' component={EmailLinkPage}/>
            <Route history={history} path='/search/' component={SearchPage}/>
            <Route history={history} path={'/:prefix([@]):username([0-9a-z]*)/'} component={UserPage}/>
            <Route history={history} path='/' component={MainPage}/>
          </Switch>
        </Container>
        <InfoBar/>
      </div>
    </ThemeProvider>
  )
}

export default withRouter(App)

function AuthRoute({history, path, component}) {
  if (localStorage.Authorization) return <Route history={history} path={path} component={component}/>
  return (
    <Dialog open={true} fullWidth maxWidth={'xs'}>
      <Login onSuccess={() => window.open(window.location.href,"_self")}/>
    </Dialog>
  )
}

function NonAuthRoute({history, path, component}) {
  const username = useUsername()
  if (localStorage.Authorization && !username) return null
  if (localStorage.Authorization && !!username) Fetch.autoLink(`@${username}`)
  else if (!localStorage.Authorization) return <Route history={history} path={path} component={component}/>
  return null
}
