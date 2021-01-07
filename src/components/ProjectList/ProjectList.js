import React, {useEffect, useState} from "react";
import {checkUser, noArchiveProjects} from "../../js/functions/functions";
import {getProjectList} from "../../js/functions/fetch";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Hidden from "@material-ui/core/Hidden";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {ProjectRow} from "../ProjectRow/ProjectRow";
import ArchiveButton from "../ArchiveButton/ArchiveButton";
import './ProjectList.css'
import CloseButton from "../CloseButton/CloseButton";

export function ProjectsList(props) {

  const [state, setState] = useState({
    projects: [],
    showArchive: false,
    dayInfo: null
  })

  useEffect(() => {
    if (!props.projects && !checkUser()) getProjectList().then((result) => setState(prevState => ({
      ...prevState,
      projects: result
    })))
  }, [])

  useEffect(() => {
    setState(prevState => ({...prevState, dayInfo: props.dayInfo}))
  }, [props.dayInfo])


  if (checkUser()) return <></>
  let visibleProjects = state.dayInfo? state.dayInfo : state.showArchive? state.projects : noArchiveProjects(state.projects)
  return (
    <Box className="project-list">
      <div className={'project-list-head'}>
        <div/>
        <div>Проекты</div>
        <div>
          {state.dayInfo?
            <CloseButton onClick={props.close}/> :
            <ArchiveButton active={state.showArchive} onClick={() => setState(prevState => ({...prevState, showArchive: !prevState.showArchive}))}/>
          }
          </div>
      </div>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Проект</TableCell>
              <TableCell>Клиент</TableCell>
              <Hidden xsDown>
                <TableCell>Гонорар</TableCell>
                <TableCell align="center">Дни</TableCell>
              </Hidden>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProjects.map((project) => (
              <ProjectRow key={project.id} {...project}/>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
