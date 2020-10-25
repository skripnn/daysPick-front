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
import {Hidden} from "@material-ui/core";
import {Link} from "react-router-dom";

export function Project(props) {
  function onBackClick() {
    window.history.back()
  }

  function Buttons() {
    if (props.project.status === "new" && props.project.user === localStorage.getItem("User")) {
      return <ButtonsAcceptDeclineBack/>
    }
    return <ButtonsSaveBack/>
  }

  function ButtonsSaveBack() {
    return (
      <>
        <ButtonGroup variant="outlined">
          <Button onClick={onBackClick}>
            Back
          </Button>
          <Button onClick={props.onSaveClick} endIcon={<SaveIcon />}>
            Save
          </Button>
        </ButtonGroup>
        <Hidden>
          <Link to={"/"} className="router-href"/>
        </Hidden>
      </>
    )
  }

  function ButtonsAcceptDeclineBack() {
    return (
      <>
      <ButtonGroup variant="outlined">
        <Button onClick={onBackClick}>
          Back
        </Button>
        <Button onClick={props.onDeleteClick}>
          Decline
        </Button>
        <Button onClick={props.onSaveClick}>
          Accept
        </Button>
      </ButtonGroup>
      <Hidden>
        <Link to={"/"} className="router-href"/>
      </Hidden>
    </>
    )
  }

  function DeleteButton() {
    if (!props.project.id) return <></>
    if (props.project.status === "new" && props.project.user === localStorage.getItem("User")) return <></>
    return (
      <IconButton variant="contained" onClick={props.onDeleteClick}>
        <DeleteIcon/>
      </IconButton>
    )
  }

  return (
      <Box className="project-block">
        <form id="project-form" autoComplete="off">
          {props.children}
          <ProjectForm {...props.project} clients={props.clients}/>
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={2}>
            <Grid item>
              <DeleteButton/>
            </Grid>
            <Grid item>
              <Buttons/>
            </Grid>
          </Grid>
        </form>
      </Box>
  )
}


