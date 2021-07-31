import React, {useEffect, useRef, useState} from "react";
import Fetch from "../../js/Fetch";
import {Chip, IconButton, List, ListSubheader, Paper} from "@material-ui/core";
import {AddCircle, ClearOutlined} from "@material-ui/icons";
import AutosizeInput from "react-input-autosize/lib/AutosizeInput";
import Tag from "../Tag/Tag";
import "./TagsEdit.css"
import {ChoiceFieldDialog} from "../Fields/DialogField/DialogField";
import SearchField from "../Fields/SearchField/SearchField";
import {useMobile} from "../hooks";
import Tags from "../UserProfile/Tags";

let dragState = false

export default function TagsEdit(props) {

  const {value, setValue} = props

  const ref = useRef()

  const [options, setOptions] = useState(value)


  const [tags, setTags] = useState(value)
  const [newTag, setNewTag] = useState(null)
  useEffect(() => setTags(value), [value])
  useEffect(() => {
    if (!newTag) setOptions(null)
    else Fetch.get(['profile', 'tags'], {filter: newTag.title}).then(setOptions)
  }, [newTag])

  const [ch, setCh] = useState(false)
  const [trigger, setTrigger] = useState(null)
  const [drag, setDrag] = useState(false)
  const [coordinates, setCoordinates] = useState({x: 0, y: 0})
  const [size, setSize] = useState({width: 0, height: 0})
  useEffect(() => {
    window.addEventListener('mouseup', () => setDrag(null))
    window.addEventListener('touchend', () => setDrag(null))
    window.addEventListener('touchcancel', () => setDrag(null))
    return (() => {
      window.removeEventListener('mouseup', () => setDrag(null))
      window.removeEventListener('touchend', () => setDrag(null))
      window.removeEventListener('touchcancel', () => setDrag(null))
    })
  }, [])

  const test = e => {
    if (dragState) e.preventDefault()
  }

  useEffect(() => {
    if (drag) {
      dragState = true
      document.addEventListener('touchmove', test, {passive: false})
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('touchmove', onDrag)
    } else {
      dragState = false
      document.removeEventListener('touchmove', test)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('touchmove', onDrag)
      setCoordinates({x: 0, y: 0})
      setSize({width: 0, height: 0})
    }
    // eslint-disable-next-line
  }, [drag])

  useEffect(() => {
    if (!drag) return
    const l = coordinates.x
    const r = coordinates.x + size.width
    const y = coordinates.y + size.height / 2
    const elL = document.elementsFromPoint(l, y).find(i => !i.classList.contains('drag') && i.classList.contains('tag'))
    const elR = document.elementsFromPoint(r, y).find(i => !i.classList.contains('drag') && i.classList.contains('tag'))
    const el = elL || elR
    if (!el && !!last && (l > last.r && y >= last.y)) {
      toEnd()
      return
    }
    if (!el) return
    const x = elL ? l : r
    const c = el.getBoundingClientRect()
    const centerX = c.left + c.width / 2
    if (x === centerX) return
    setCh(true)
    setTrigger({x: x, centerX: centerX, el: el})
    // eslint-disable-next-line
  }, [coordinates])
  // eslint-disable-next-line
  useEffect(change, [ch])


  const last = ref.current && ref.current.lastElementChild ? getLast() : null

  function getLast() {
    const c = ref.current.lastElementChild.getBoundingClientRect()
    return {
      x: c.left + c.width / 2 + 1,
      y: c.top,
      r: c.left + c.width,
      b: c.top + c.height,
    }
  }

  function toEnd() {
    let newTags = [...tags]
    let eI = newTags.findIndex(i => i.id === drag.id)
    const e = newTags[eI]
    newTags.splice(eI, 1, e)
    setTags(newTags)
  }

  function change() {
    if (!trigger) return

    let newTags = [...tags]
    let eI = newTags.findIndex(i => i.id === drag.id)
    const e = newTags[eI]
    newTags.splice(eI, 1)
    const trI = newTags.findIndex(i => i.title === trigger.el.firstElementChild.innerHTML)
    if (trigger.x > trigger.centerX) {
      newTags = [...newTags.slice(0, trI + 1), e, ...newTags.slice(trI + 1)]
    } else if (trigger.x < trigger.centerX) {
      newTags = [...newTags.slice(0, trI), e, ...newTags.slice(trI)]
    }
    setTags(newTags)
    setCh(false)
  }

  function addTag() {
    if (newTag.title) Fetch.put(['profile', 'tags'], newTag).then((r) => {
      setValue(r)
      setNewTag(null)
    })
  }


  function delTag(tag) {
    Fetch.post(['profile', 'tags'], tags.filter(i => i.id !== tag.id)).then((r) => {
      setValue(r)
      setNewTag(null)
    })
  }

  function addOptionTag(value) {
    Fetch.post(['profile', 'tags'], [...tags, value]).then((r) => {
      setValue(r)
      const newOptions = options.filter(i => i.id !== value.id)
      setOptions(newOptions.length ? newOptions : null)
    })
  }

  function onTake(e, el, i) {
    if (e instanceof TouchEvent) e = e.touches[0]
    const c = el.getBoundingClientRect()
    setCoordinates({
      x: e.pageX - c.width / 2 - 1,
      y: e.pageY - c.height / 2 - 1
    })
    setSize({
      width: c.width,
      height: c.height
    })
    setDrag(i)
  }


  function onDrag(e) {
    if (!drag) return
    if (e instanceof TouchEvent) e = e.touches[0]
    setCoordinates({
      x: e.pageX - size.width / 2 - 1,
      y: e.pageY - size.height / 2 - 1
    })
  }

  function onDrop() {
    setDrag(null)
    setCoordinates({x: 0, y: 0})
    setSize({width: 0, height: 0})
    Fetch.post(['profile', 'tags'], tags).then(r => {
      if (r.error) setTags(value)
      else setValue(r)
    }, () => setTags(value))
  }

  function exist() {
    return newTag ? !!tags.find(i => newTag.title.toLowerCase() === i.title.toLowerCase()) : false
  }

  const mobile = useMobile()

  return (<>
    <ListSubheader>
      <div style={{display: 'flex'}}>
        <span>Специализации</span>
        {mobile && <NewTagButton onClick={() => setNewTag({title: ''})}/>}
      </div>
    </ListSubheader>
    {(!mobile || (!!tags && !!tags.length)) &&
    <Paper ref={ref} variant={"outlined"} style={{padding: 5, marginLeft: 16, marginRight: 16}}>
      {tags.map(i => <Tag tag={i} key={i.id} onTake={onTake} hidden={drag && drag.id === i.id}
                          onDelete={delTag} edit/>)}
      {!drag && !mobile && <NewTag tag={newTag} setTag={setNewTag} addTag={addTag} exist={exist()}/>}
    </Paper>}
    {!mobile && !!options && !!options.length && options.filter(tag => !!newTag ? tag.title !== newTag.title : tag).map(tag => <OptionTag
      tag={tag} addTag={addOptionTag}
      key={tag.id}/>)}
    {!!drag && <DragTag tag={drag} x={coordinates.x} y={coordinates.y} onDrop={onDrop}/>}
    {mobile && <TagChoiceDialog
      open={!!newTag}
      close={() => setNewTag(null)}
      setValue={setValue}
      tags={tags}
    />}
  </>)
}

function TagChoiceDialog({open, close, setValue, tags}) {
  const [newTagTitle, setNewTagTitle] = useState(null)
  const [options, setOptions] = useState([])

  function addOptionTag(tag) {
    add(tag)
    setOptions(options.filter(i => i.id !== tag.id))
  }

  useEffect(downloadOptions, [newTagTitle, open])

  function downloadOptions() {
    if (open && !newTagTitle) Fetch.get(['profile', 'tags']).then(setOptions)
  }

  function add(tag) {
    Fetch.put(['profile', 'tags'], tag).then(setValue).then(downloadOptions)
  }

  function del(tag) {
    Fetch.post(['profile', 'tags'], tags.filter(i => i.id !== tag.id)).then(setValue).then(downloadOptions)
  }

  function capitalize(string) {
    if (!string) return string
    return string ? string[0].toUpperCase() + string.slice(1) : string;
  }

  let hideNewTag = !newTagTitle
  if (!hideNewTag && !!tags && tags.map(tag => tag.title).includes(newTagTitle)) hideNewTag = true
  if (!hideNewTag && !!options && options.map(tag => tag.title).includes(newTagTitle)) hideNewTag = true

  return (
    <ChoiceFieldDialog
      open={open}
      close={close}
      label={'Добавить специализации'}
    >
      <>
        <SearchField
          noFilter
          get={() => Fetch.get(['profile', 'tags'], {filter: newTagTitle}).then(setOptions)}
          onChangeFilter={value => setNewTagTitle(capitalize(value))}
        />
        <List dense>
          {!hideNewTag && <OptionTag tag={{title: newTagTitle}} addTag={addOptionTag}/>}
          {!!options && !!options.length && options.map(tag => <OptionTag tag={tag} addTag={addOptionTag}
                                                                          key={tag.id}/>)}
        </List>
        {!!tags && !!tags.length &&
        <List dense>
          <ListSubheader>Мои специализации</ListSubheader>
          <Tags tags={tags} tagProps={{onDelete: del}}/>
        </List>}
      </>
    </ChoiceFieldDialog>
  )
}

function DragTag(props) {

  return (
    <Chip
      className={'tag drag'}
      variant="outlined"
      label={props.tag ? props.tag.title : null}
      onDelete={() => console.log(props.tag? props.tag.id : null)}
      style={{left: props.x, top: props.y}}
      onMouseUp={props.onDrop}
      onTouchEnd={props.onDrop}
      onTouchCancel={props.onDrop}
    />
  )
}

function NewTagButton({onClick}) {
  return (
    <IconButton
      size={"small"}
      style={{margin: 2, color: "rgba(0, 0, 0, 0.26)"}}
      onClick={onClick}
    >
      <AddCircle/>
    </IconButton>
  )
}


function NewTag(props) {

  const clear = () => props.setTag(null)
  const isEmpty = !props.tag || !props.tag.title
  const add = () => isEmpty || props.exist ? clear() : props.addTag()

  function capitalize(string) {
    return string ? string[0].toUpperCase() + string.slice(1) : string;
  }

  const mobile = useMobile()

  return (props.tag && !mobile ?
      <Chip
        style={{margin: 2}}
        variant="outlined"
        deleteIcon={isEmpty || props.exist ? <ClearOutlined/> : <AddCircle/>}
        onDelete={add}
        onKeyDown={(e) => {
          if (e.key === 'Escape') clear()
          if (e.key === 'Enter' && !!props.addTag) add()
        }}
        label={
          <AutosizeInput
            inputClassName={'tag-input'}
            autoFocus
            minWidth={50}
            value={props.tag.title}
            onChange={e => props.setTag({...props.tag, title: capitalize(e.target.value)})}
            // onBlur={isEmpty ? clear : undefined}
          />
        }
      /> : <NewTagButton onClick={() => props.setTag({title: ''})}/>
  )
}

function OptionTag({tag, addTag}) {
  return (
    <Chip
      className={'tag'}
      variant="outlined"
      label={tag.title}
      deleteIcon={<AddCircle/>}
      onDelete={() => addTag(tag)}
    />
  )
}
