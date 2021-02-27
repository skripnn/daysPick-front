import React, {useEffect, useState} from "react";
import Fetch from "../../js/Fetch";
import {Box, IconButton, ListSubheader} from "@material-ui/core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ActionButton from "../Actions/ActionButton/ActionButton";
import DndTagsList from "./DndTagsList";
import {categoryIcon} from "../Tag/Tag";
import RecursiveTree from "./RecursiveTree";
import NewTag from "./NewTag";

function TagsEdit(props) {

  const {tags, set} = props
  const [state, setState] = useState([])
  const [open, setOpen] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [newTag, setNewTag] = useState(null)

  useEffect(() => setNewTag(null), [tags])

  function addNewTag() {
    if (newTag.title) Fetch.put(['profile', 'tags'], newTag).then(set)
    else setNewTag(null)
  }

  const menuOpenClick = () => {
    if (!state.length) Fetch.get(['profile', 'tags'], {filter: 'options'}).then(setState).then(() => setMenuOpen(true))
    else setMenuOpen(!menuOpen)
  }

  const toggle = (node, list, existing) => {
    let fetch = false
    if (!list) {
      fetch = true
      list = new Set(tags)
      existing = exist(node, list)
    }
    if (node.childs) node.childs.forEach(i => toggle(i, list, existing))
    else if (existing) list.forEach(i => {
      if (i.id === node.id) list.delete(i)
    })
    else if (!exist(node, list)) list.add(node)
    if (fetch) Fetch.post(['profile', 'tags'], [...list]).then(set)
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <ListSubheader disableSticky>
        <Box display={'flex'}>
          <Box>Специализации</Box>
          <IconButton onClick={menuOpenClick}>
            {menuOpen ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
          </IconButton>
        </Box>
      </ListSubheader>
      {menuOpen && <>
        <Box display={'flex'}>
          {state.map(node => <ActionButton
            key={node.id}
            label={node.title}
            icon={categoryIcon(node.category)}
            onClick={() => setOpen((!!open && open.id === node.id) ? null : node)}
            active={(!!open && open.id === node.id)}
          />)}
        </Box>
        {open && <RecursiveTree
          node={open}
          list={tags}
          toggle={toggle}
        />}
        <ListSubheader disableSticky>Мои специализации</ListSubheader>
      </>}
      <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
        <DndTagsList items={tags} set={set} itemsProps={{exist: true, onClick: toggle}}/>
        <NewTag tag={newTag} category={menuOpen && open ? open.category : undefined} setTag={setNewTag} addTag={addNewTag}/>
      </Box>
    </Box>
  )
}

export const exist = (node, list) => node.childs? node.childs.every(i => exist(i, list)) : [...list].some(i => i.id === node.id)

TagsEdit.defaultProps = {
  tags: [],
  set: () => {}
}

export default TagsEdit