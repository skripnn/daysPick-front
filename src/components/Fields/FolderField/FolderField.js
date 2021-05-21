import DialogField from "../DialogField/DialogField";
import {
  CircularProgress,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import React, {useEffect, useRef, useState} from "react";
import {CreateNewFolderOutlined, FolderOpen} from "@material-ui/icons";
import ClearIcon from "@material-ui/icons/Clear";
import ActionButton from "../../Actions/ActionButton/ActionButton";
import TextField from "../TextField/TextField";
import LazyList from "../../LazyList/LazyList";
import ProjectItem from "../../ProjectItem/ProjectItem";
import Loader from "../../../js/Loader";
import Fetch from "../../../js/Fetch";
import {useListStore} from "../../hooks";

export default function FolderField({value, set}) {
  const [folderTitle, setFolderTitle] = useState(null)
  const [open, setOpen] = useState(false)
  const f = useListStore()
  const ref = useRef()
  useEffect(() => {
    Loader.clear()
    if (open) Loader.set(() => {
      Fetch.get('projects', getParams).then(f.set)
    }, 300)
    //eslint-disable-next-line
  }, [folderTitle])

  useEffect(() => setFolderTitle(null), [value])
  useEffect(() => {if (!open) {
    setFolderTitle(null)
    f.set()
  }}, [open])

  const folderItem = value ?
    <ListItem button className={'dialog-field-item'}>
      <ListItemIcon style={{minWidth: "unset", paddingRight: 8}}>
        <FolderOpen/>
      </ListItemIcon>
      <ListItemText primary={value.title} style={{wrap: "no-wrap"}} />
      <ListItemSecondaryAction className={'dialog-field-item delete-button'}>
        <IconButton edge={"end"} onClick={() => set(null)}><ClearIcon/></IconButton>
      </ListItemSecondaryAction>
    </ListItem> : null

  const actionsPanelProps = {
    right: <ActionButton
      onClick={() => set({id: null, title: folderTitle})}
      label="Создать"
      disabled={!folderTitle}
      icon={<CreateNewFolderOutlined/>}/>,
    center: null
  }

  const getParams = {filter: folderTitle, folders: true}

  const folderList = (<div ref={ref}>
    <TextField
      label={'Название'}
      value={folderTitle || ''}
      onChange={(e) => setFolderTitle(e.target.value === '' ? null : e.target.value)}
    />
    <LazyList
      preLoader
      ref={ref}
      getLink={'projects'}
      getParams={getParams}
      set={f.set}
      add={f.add}
      page={f.page}
      pages={f.pages}
      observableRoot={ref.current? ref.current.parentElement : undefined}
    >
      {f.list.map(project => <ProjectItem
              project={project}
              key={project.id}
              onClick={(p) => set(p)}
              childProps={{onClick: () => {}}}
            />
          )}
    </LazyList>
  </div>)

  return (
    <DialogField
      label={'Папка'}
      value={value}
      set={set}
      ItemContent={folderItem}
      actionsPanelProps={actionsPanelProps}
      ChoiceContent={folderList}
      open={open}
      setOpen={setOpen}
    />
  )
}