import React, {useEffect, useState} from 'react';
import Container from "@material-ui/core/Container";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import {Route, Switch, useLocation, withRouter} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ConfirmPage from "./pages/confirmPage";
import './App.css'
import ActionsSwitch from "./components/Actions/ActionsSwitch";
import ClientsPage from "./pages/ClientsPage";
import Header from "./components/Header/Header";
import ProjectsPage from "./pages/ProjectsPage";
import {isMobil} from "./js/functions/functions";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import SignupPage from "./pages/SignupPage";
import TestPage from "./pages/TestPage";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App(props) {
  const [mobile, setMobile] = useState(isMobil())

  useEffect(() => {
    window.addEventListener('resize', () => setMobile(isMobil()))
  },[])

  const { history } = props

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#cae3fc'
      },
      secondary: {
        main: '#404040'
      },
      info: {
        main: '#ebedf0'
      },
      success: {
        main: '#4db34b'
      },
      warning: {
        main: '#ff6c6c'
      }
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ScrollToTop />
        <Header history={history}/>
        <Container maxWidth="md" className={"content-block"} style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
          <ActionsSwitch hidden={mobile} history={history}/>
          <Switch>
            <Route history={history} path='/test/' component={TestPage}/>
            <Route history={history} path='/profile/' component={ProfilePage}/>
            <Route history={history} path='/clients/' component={ClientsPage}/>
            <Route history={history} path='/projects/' component={ProjectsPage}/>
            <Route history={history} path='/project/:id/' component={ProjectPage}/>
            <Route history={history} path='/project/' component={ProjectPage}/>
            <Route history={history} path='/login/' component={LoginPage}/>
            <Route history={history} path='/signup/' component={SignupPage}/>
            <Route history={history} path='/confirm/' component={ConfirmPage}/>
            <Route history={history} path='/user/:username/' component={UserPage}/>
            <Route history={history} path='/' component={SearchPage}/>
          </Switch>
        </Container>
        {mobile && <div className={'block static'}>
          <ActionsSwitch bottom history={history}/>
        </div>}
      </div>
    </ThemeProvider>
  )
}

export default withRouter(App)