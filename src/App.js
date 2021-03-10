import React, {useEffect} from 'react';
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
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import {useMediaQuery} from "@material-ui/core";
import Fetch from "./js/Fetch";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App(props) {

  const mobile = useMediaQuery('(max-width:600px)')

  const { history } = props
  Fetch.history = history

  const theme = createMuiTheme({
    palette: {
      text: {
        primary: '#5b5b5b'
      },
      primary: {
        main: '#cae3fc',
        contrastText: '#5b5b5b'
      },
      secondary: {
        main: '#5b5b5b'
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
    overrides: {
      MuiButton: {
        textPrimary: {
          color: '#5b5b5b',
        },
      },
      MuiFormLabel: {
        root: {
          '&$focused': {
            color: '#5b5b5b',
          },
        },
        focused: {},
      },
      MuiInput: {
        root: {
          '&$focused': {
            color: '#5b5b5b',
          },
        },
        underline: {
          "&:after": {
            "borderBottom": "2px solid #5b5b5b"
          }
        }
      }
    }
  });


  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <ScrollToTop />
        <Header history={history}/>
        <Container maxWidth="md" className={"content-block"} style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
          <ActionsSwitch hidden={mobile} history={history}/>
          <Switch>
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
        {mobile && <div className={'block static'}>
          <ActionsSwitch bottom history={history}/>
        </div>}
      </div>
    </ThemeProvider>
  )
}

export default withRouter(App)