import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import "./Header.css"
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import Menu from "../Menu/Menu";


export default function Header(props) {
  const auth = !!localStorage.User

  return (
    <AppBar position="static">
      <Toolbar className={'header'} variant={"dense"}>
        <Box flexGrow={1}>
          <Typography variant="h6">
            <Link to="/">DaysPick</Link>
          </Typography>
        </Box>
        {auth? (
            <Menu user={props.user} history={props.history}/>
        ) : "Sign In"}
      </Toolbar>
    </AppBar>
  );
}

