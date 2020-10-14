import React from "react";
import pick from "../functions/pick";
import Box from "@material-ui/core/Box";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from "@material-ui/core/Grid";
import {IconButton} from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Hidden from "@material-ui/core/Hidden";
import {actualProjects, archiveProjects} from "../functions/functions";
import withStyles from "@material-ui/core/styles/withStyles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from "@material-ui/core/Typography";
import "./projects-list.css"


function ProjectRow(props) {
  function onMouseOver() {
    pick("set", props.dates)
    pick("set", props.id)
  }

  function onMouseLeave() {
    pick("unset", props.dates)
    pick("unset", props.id)
  }

  return (
    <TableRow className="project-list-row" id={props.id} onClick={props.onClick}
              onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <Hidden xsDown>
        <TableCell align="center" width={100}>{props.dates[0]}</TableCell>
        <TableCell align="center" width={100}>{props.dates[props.dates.length - 1]}</TableCell>
      </Hidden>
      <Hidden mdDown>
        <TableCell align="center" width={50}>{props.dates.length}</TableCell>
      </Hidden>
      <TableCell scope="row">{props.title}</TableCell>
      <Hidden smDown>
        <TableCell>{props.client}</TableCell>
        <TableCell width={100}>{props.money}</TableCell>
      </Hidden>
    </TableRow>
  )
}

function ProjectsTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <Hidden xsDown>
              <TableCell align="center" width={100}>Начало</TableCell>
              <TableCell align="center" width={100}>Окончание</TableCell>
            </Hidden>
            <Hidden mdDown>
              <TableCell align="center" width={50}>Дни</TableCell>
            </Hidden>
            <Hidden xsDown>
              <TableCell>Проект</TableCell>
            </Hidden>
            <Hidden smDown>
              <TableCell>Клиент</TableCell>
              <TableCell width={100}>Гонорар</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.projects.map((project) => (
            <ProjectRow key={project.id} onClick={props.onRowClick} {...project}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    borderBottom: 0,
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
    '&$expanded&:last-child': {
      border: '1px solid rgba(0, 0, 0, .125)',
    },
    '&:last-child': {
      borderRadius: '0 0 4px 4px',
      border: '1px solid rgba(0, 0, 0, .125)',
    },
    '&:first-child': {
      borderRadius: '4px 4px 0 0',
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    marginTop: 0,
    paddingTop: 0,
    minHeight: 40,
    '&$expanded': {
      minHeight: 40,
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
    },
  },
  content: {
    margin: '0 0 0 -12px',
    '&$expanded': {
      margin: '0 0 0 -12px',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);


export function ProjectsList(props) {
  const [expanded, setExpanded] = React.useState(props.expanded);

  const handleChange = (panel) => (event, isExpanded) => {
    let e = event.target
    if (e.tagName === "path") e = e.parentElement
    if (e.tagName === "svg" && e.parentElement.parentElement.tagName === "BUTTON") return
    setExpanded(isExpanded ? panel : false);
    props.setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box className="project-list">
      <Accordion square variant="outlined" expanded={expanded === "projects"} onChange={handleChange("projects")}>
        <AccordionSummary variant="outlined" expandIcon={<ExpandMoreIcon />}>
            <Grid container direction="row" justify="flex-start" alignItems="center">
              <Grid item xs={1}>
                <NewProject onClick={props.onNewClick}/>
              </Grid>
              <Grid item xs={11}>
                <Typography align="center">Проекты</Typography>
              </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <ProjectsTable projects={actualProjects(props.projects)} onRowClick={props.onRowClick}/>
        </AccordionDetails>
      </Accordion>
      <Accordion square variant="outlined" expanded={expanded === "archive"} onChange={handleChange("archive")}>
        <AccordionSummary variant="outlined" expandIcon={<ExpandMoreIcon />}>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={1}/>
            <Grid item xs={11}>
              <Typography align="center">Архив</Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails>
          <ProjectsTable projects={archiveProjects(props.projects)} onRowClick={props.onRowClick}/>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}


function  NewProject(props) {
  return (
    <IconButton variant="outlined" onClick={props.onClick}>
      <AddBoxIcon fontSize="small"/>
    </IconButton>
  )
}