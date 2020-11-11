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
import {actualProjects, archiveProjects, newProjects, updatedProjects} from "../functions/functions";
import withStyles from "@material-ui/core/styles/withStyles";
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from "@material-ui/core/Typography";
import "./projects-list.css"
import {Link} from "react-router-dom";


function ProjectRow(props) {
  function onMouseOver() {
    pick("set", props.dates)
    pick("set", props.id)
  }

  function onMouseLeave() {
    pick("unset", props.dates)
    pick("unset", props.id)
  }

  function onClick(e) {
    e.target.parentElement.querySelector('a').click()
  }

  const path = "/project/" + props.id + "/"
  let className = "project-list-row"
  console.log(props)
  if (props.is_paid) className += " paid"

  return (
    <TableRow className={className} id={props.id} onClick={onClick}
              onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
      <Hidden xsDown>
        <TableCell align="center">{props.dates[0]}</TableCell>
        <TableCell align="center">{props.dates[props.dates.length - 1]}</TableCell>
      </Hidden>
      <Hidden mdDown>
        <TableCell align="center" >{props.dates.length}</TableCell>
      </Hidden>
      <TableCell scope="row">
        {props.title}
        <Hidden><Link to={path}/></Hidden>
      </TableCell>
      <Hidden smDown>
        <TableCell>{props.client}</TableCell>
        <TableCell >{props.money}</TableCell>
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
              <TableCell align="center">Начало</TableCell>
              <TableCell align="center">Окончание</TableCell>
            </Hidden>
            <Hidden mdDown>
              <TableCell align="center">Дни</TableCell>
            </Hidden>
            <Hidden xsDown>
              <TableCell>Проект</TableCell>
            </Hidden>
            <Hidden smDown>
              <TableCell>Клиент</TableCell>
              <TableCell>Гонорар</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.projects.map((project) => (
            <ProjectRow key={project.id} {...project}/>
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
      borderBottomRightRadius: '4px',
      borderBottomLeftRadius: '4px',
      border: '1px solid rgba(0, 0, 0, .125)',
    },
    '&:first-child': {
      borderTopLeftRadius: '4px',
      borderTopRightRadius: '4px',
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
  const [expanded, setExpanded] = React.useState(props.expanded || "projects");

  const handleChange = (panel) => (event, isExpanded) => {
    let e = event.target
    if (e.tagName === "path") e = e.parentElement
    if (e.tagName === "svg" && e.parentElement.parentElement.tagName === "BUTTON") return
    setExpanded(isExpanded ? panel : false);
    props.setExpanded(isExpanded ? panel : false);
  };

  const panels = [
    {panel: "new", title: "Предложения", projects: newProjects(props.projects)},
    {panel: "updates", title: "Изменённые", projects: updatedProjects(props.projects)},
    {panel: "projects", title: "Проекты", projects: actualProjects(props.projects), required: true, leftButton: <NewProject/>},
    {panel: "archive", title: "Архив", projects: archiveProjects(props.projects)}
  ]

  if (!localStorage.getItem('User')) return <></>

  return (
    <Box className="project-list">
      {panels.map(panel => <Panel key={panel.panel} {...panel}
                                  accordion={{
                                    expanded: expanded === panel.panel,
                                    onChange: handleChange(panel.panel)
                                  }}/>)}
    </Box>
  )
}

function  NewProject() {
  const user =  window.location.pathname.match(/\/user\/(.*)\//)[1]
  const path = "/project/?user=" + user
  return (
    <Link to={path}>
      <IconButton variant="outlined">
        <AddBoxIcon fontSize="small"/>
      </IconButton>
    </Link>
  )
}


function Panel(props) {
  if (!props.required && props.projects.length === 0)  return <></>

  return (
    <Accordion square variant="outlined" {...props.accordion}>
      <AccordionSummary variant="outlined" expandIcon={<ExpandMoreIcon/>}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={1}>
            {props.leftButton}
          </Grid>
          <Grid item xs={11}>
            <Typography align="center">{props.title}</Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <ProjectsTable projects={props.projects}/>
      </AccordionDetails>
    </Accordion>
  )
}