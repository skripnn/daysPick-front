import React from "react";
import Button from "@material-ui/core/Button";
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import pick from "../functions/pick";
import "./buttons-block.css"


export default function DaysOffEdit(props) {
  function onMouseOver() {
    if (!props.state) {
      pick("set", props.daysOff)
    }
  }
  function onMouseLeave() {
    if (!props.state) {
      pick("unset", props.daysOff)
    }
  }

  const cardClass = !!props.state ? 'pick' : ''

  return (
    <Card variant="outlined" id="daysOff" onMouseOver={onMouseOver} onMouseLeave={onMouseLeave} className={cardClass}>
      <Grid container spacing={1} direction="row" alignItems="center">
        <Grid item>
          Выходные
        </Grid>
        <Grid item xs={3}>
          {props.state ?
            <ButtonSaveCancel onSaveClick={props.onSaveClick} onBackClick={props.onBackClick}/> :
            <ButtonEdit onClick={props.onEditClick}/>
          }
        </Grid>
      </Grid>
    </Card>
  );
}

function ButtonEdit(props) {
  return (
    <ButtonGroup>
      <Button onClick={props.onClick}>
        <EditIcon fontSize="small"/>
      </Button>
    </ButtonGroup>
  )
}

function ButtonSaveCancel(props) {
  return (
    <ButtonGroup>
      <Button onClick={props.onBackClick}>
        <CancelIcon fontSize="small"/>
      </Button>
      <Button onClick={props.onSaveClick}>
        <SaveIcon fontSize="small"/>
      </Button>
    </ButtonGroup>
  )
}
