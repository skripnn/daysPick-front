import React from "react";
import {ProjectForm} from "./project-form";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import "./project.css"


export const defaultProject = {
  title: "",
  money: "",
  dates: [],
  client: "",
  info: "",
}

export function Project(props) {
  return (
      <Box className="project-block">
        <form id="project-form" noValidate autoComplete="off">
          {props.children}
          <ProjectForm {...props.project} clients={props.clients}/>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
            <Grid item>
              {props.project.id ? <DeleteButton onClick={props.onDeleteClick}/> : <></>}
            </Grid>
            <Grid item>
              <Buttons onSaveClick={props.onSaveClick} onBackClick={props.onBackClick}/>
            </Grid>
          </Grid>
        </form>
      </Box>
  )
}


function Buttons(props) {
  return (
    <ButtonGroup variant="outlined">
      <Button onClick={props.onBackClick}>
        Back
      </Button>
      <Button onClick={props.onSaveClick} endIcon={<SaveIcon />}>
        Save
      </Button>
    </ButtonGroup>
  )
}

function DeleteButton(props) {
  return (
    <IconButton variant="contained" onClick={props.onClick}>
      <DeleteIcon/>
    </IconButton>
  )
}
