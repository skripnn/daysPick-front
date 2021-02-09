import React, {useEffect} from "react";
import {checkUser, getUser, noArchiveProjects} from "../../js/functions/functions";
import {getProjects} from "../../js/fetch/project";
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
import {inject, observer} from "mobx-react";

function ProjectsList(props) {

  function closeDayInfo() {
    props.setValue({dayOffOver: false, dayInfo: null})
  }

  useEffect(() => {
    if (!checkUser()) getProjects().then((result) => props.setProjects(result))
  }, [])


  if (checkUser()) return <></>
  let visibleProjects = props.dayInfo? props.dayInfo : props.showArchive? props.projects : noArchiveProjects(props.projects)
  return (
    <Box className="project-list">
      <div className={'project-list-head'}>
        <div/>
        <div>Проекты</div>
        <div>
          {props.dayInfo?
            <CloseButton onClick={closeDayInfo}/> :
            <ArchiveButton active={props.showArchive} onClick={() => props.setValue({showArchive: !props.showArchive})}/>
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

export default inject(stores => {
  const user = getUser()
  return {
    projects: stores.UsersStore.getUser(user).projects,
    setProjects: stores.UsersStore.getUser(user).setProjects,
    ...stores.UsersStore.getUser(user).userPage,
    setValue: stores.UsersStore.getUser(user).setValue
  }
})(observer(ProjectsList))
