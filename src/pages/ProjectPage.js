import React, {useEffect, useState} from "react";
import Calendar from "../components/test/components/Calendar";
import ProjectForm from "../components/ProjectForm/ProjectForm";
import {inject, observer} from "mobx-react";
import {compareId, getProjectStatus, getProjectTitle} from "../js/functions/functions";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import Fetch from "../js/Fetch";
import Info from "../js/Info"
import {List} from "@material-ui/core";
import TextField from "../components/Fields/TextField/TextField";
import MoneyField from "../components/Fields/MoneyField/MoneyField";
import Grid from "@material-ui/core/Grid";
import CheckBoxField from "../components/Fields/CheckBoxField/CheckBoxField";
import InfoField from "../components/Fields/InfoField/InfoField";
import ClientField from "../components/Fields/ItemField/ClientField";
import ProfileField from "../components/Fields/ItemField/ProfileField";
import {useAccount} from "../stores/storeHooks";
import ProjectFolderField from "../components/Fields/ItemField/ProjectFolderField";
import {ActionsPanel2} from "../components/Actions/ActionsPanel/ActionsPanel";
import ActionButton, {BackActionButton} from "../components/Actions/ActionButton/ActionButton";
import {Add, AssignmentTurnedIn, Cancel, Delete, Done, FileCopy, Save, Send} from "@material-ui/icons";
import {useLastLocation} from "react-router-last-location";
import _ from "underscore";
import mainStore from "../stores/mainStore";
import Typography from "@material-ui/core/Typography";
import A from "../components/core/A";
import {ProjectItem} from "../components/ProjectItem/ProjectItem";


function ProjectSelfComponent({ProjectPage:store}) {
  const {downloadedValues, project, calendar, setDays, setUser} = store
  const {money, money_per_day, money_calculating, info, days, setInfo, setValue, setParent} = project
  const account = useAccount()
  const lastLocation = useLastLocation()

  const [DayInfo, setDayInfo] = useState(null)
  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(
      <PopOverDay
        anchorEl={element}
        info={info}
        dayOff={dayOff}
        onClose={() => setDayInfo(null)}
      />
    )
  }

  function getChanges() {
    const changedFields = {}
    for (const key of Object.keys(project)) {
      let is_same = true
      if (['client', 'user', 'creator', 'canceled'].includes(key)) is_same = compareId(project[key], downloadedValues[key])
      else is_same = _.isEqual(project[key], downloadedValues[key])
      if (!is_same) changedFields[key] = project[key]
    }
    return Object.keys(changedFields).length ? changedFields : null
  }
  const changedFields = getChanges()

  const createFolderState = {
    user: project.user,
    client: project.client,
    money_calculating: money_calculating,
    money: money_calculating ? null : money,
    money_per_day: money_calculating ? money_per_day : null
  }

  const fields = {
    'title': <TextField label="Название" value={project.title} onChange={setValue} changeName={'title'} emptyNull helperText={getProjectStatus(downloadedValues, account)}/>,
    'money': <MoneyField money={money} money_per_day={money_per_day} money_calculating={money_calculating} setValue={setValue}/>,
    'client': <ClientField label={'Клиент'} value={project.client} onChange={(client) => setValue({client: client})}/>,
    'creator': <ProfileField label={'Заказчик'} value={project.creator} readOnly required/>,
    'folder': <ProjectFolderField label={'Папка'} value={project.parent} onChange={setParent} createState={createFolderState}/>,
    'user': <ProfileField label={'Исполнитель'} value={project.user} required onChange={setUser} readOnly={project.canceled}/>
  }

  const checkBoxes = (isPaid, isWait) => (
    <Grid container wrap={'nowrap'}>
      {isPaid && <Grid item xs>
        <CheckBoxField name={'is_paid'} label={!!(project.money || project.money_per_day) ? 'Оплачен' : 'Завершён'} checked={project.is_paid}
                       onChange={v => setValue({is_paid: v, is_wait: false})}/>
      </Grid>}
      {!project.is_paid && isWait && <Grid item xs style={{whiteSpace: 'nowrap'}}>
        <CheckBoxField name={'is_wait'} label={project.canceled ? 'Отменён' : 'Не подтверждён'} checked={project.is_wait}
                       onChange={v => setValue({is_wait: v})}/>
      </Grid>}
    </Grid>
  )
  const infoField = (rowsHeight) => <InfoField info={info} setInfo={setInfo} days={days} rowsHeight={rowsHeight}/>

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = ['title', 'money', 'client', 'folder', checkBoxes(true, true)]
  let right = [infoField(left.length - 1)]
  let deleteButtonProps = {
    label: 'Удалить',
    icon: <Delete/>
  }
  let saveButtonProps = {
    label: 'Сохранить',
    icon: <Save/>
  }
  let doubleButtonProps = {
    label: 'Дублировать',
    icon: <FileCopy/>,
    onClick: () => Fetch.link(`project?copy=${project.id}`, store.downloadFromTemplate)
  }

  function onDelete() {
    Fetch.delete(['project', project.id]).then((r) => {
      if (r.error) Info.error(r.error)
      else  {
        Info.success('Проект удалён')
        Fetch.backLink(lastLocation)
      }
    })
  }

  function validation() {
    if (!Object.keys(project.days).length) {
      Info.error('Выбери даты')
      return false
    }
    return !!changedFields;
  }

  function onSave() {
    if (!validation()) return
    Fetch.post(['project', project.id], project.id ? changedFields : project).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success('Проект сохранён')
        Fetch.backLink(lastLocation)
      }
    })
  }

  return (
    <>
      <ActionsPanel2
        left={<BackActionButton/>}
        right={<>
          {!!project.id &&
          <ActionButton
            onClick={onDelete}
            {...deleteButtonProps}
          />
          }
          {!!project.id && !changedFields &&
            <ActionButton
              {...doubleButtonProps}
            />
          }
          {(!!changedFields || !project.id) &&
            <ActionButton
              onClick={onSave}
              disabled={!changedFields}
              {...saveButtonProps}
            />
          }
        </>}
      />
      <Calendar
        edit
        get={Fetch.calendarGetter(project.user, project)}
        onChange={setDays}
        content={calendar}
        setContent={calendar.setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      <ProjectForm
        left={left.map(getField)}
        right={right.map(getField)}
      />
      {DayInfo}
      <span className={'bottom-space'}/>
    </>
  )
}
const ProjectSelf = inject('ProjectPage')(observer(ProjectSelfComponent))

function ProjectOutComponent({ProjectPage:store}) {
  const {downloadedValues, project, calendar, setDays, setUser} = store
  const {money, money_per_day, money_calculating, info, days, setInfo:onChangeInfo, setValue:onChange} = project
  const account = useAccount()
  const lastLocation = useLastLocation()
  const setValue = project.canceled ? () => Info.info('Изменение недоступно') : onChange
  const setInfo = project.canceled ? () => Info.info('Изменение недоступно') : onChangeInfo

  const [DayInfo, setDayInfo] = useState(null)
  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(
      <PopOverDay
        anchorEl={element}
        info={info}
        onClose={() => setDayInfo(null)}
      />
    )
  }

  function getChanges() {
    const changedFields = {}
    for (const key of Object.keys(project)) {
      let is_same = true
      if (['client', 'user', 'creator', 'canceled'].includes(key)) is_same = compareId(project[key], downloadedValues[key])
      else is_same = _.isEqual(project[key], downloadedValues[key])
      if (!is_same) changedFields[key] = project[key]
    }
    return Object.keys(changedFields).length ? {...changedFields, confirmed: false} : null
  }
  const changedFields = getChanges()

  const fields = {
    'title': <TextField label="Название" value={project.title} onChange={setValue} changeName={'title'} emptyNull/>,
    'money': <MoneyField money={money} money_per_day={money_per_day} money_calculating={money_calculating} setValue={setValue}/>,
    'user': <ProfileField label={'Исполнитель'} value={project.user} required onChange={setUser} helperText={getProjectStatus(downloadedValues, account)} disabled={!!project.id && !!downloadedValues.user} exclude={account.id}/>
  }

  const infoField = (rowsHeight) => <InfoField info={info} setInfo={setInfo} days={days} rowsHeight={rowsHeight}/>

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = ['title', 'money', 'user']
  let right = [infoField(left.length)]
  let deleteButtonProps = {
    label: !!project.canceled ? 'Удалить' : 'Отменить',
    icon: !!project.canceled ? <Delete/> : <Cancel/>
  }
  let saveButtonProps = {
    label: !!project.id ? 'Изменить' : project.user ? 'Предложить' : 'Сохранить',
    icon: !!project.id || !project.user ? <Save/> : <Send/>
  }
  let doubleButtonProps = {
    label: 'Дублировать',
    icon: <FileCopy/>,
    onClick: () => Fetch.link(`project?copy=${project.id}`, store.downloadFromTemplate)
  }

  function onDelete() {
    const text = !!project.canceled ? 'Проект удалён' : 'Проект отменён'
    Fetch.delete(['project', project.id]).then((r) => {
      if (r.error) Info.error(r.error)
      else  {
        Info.success(text)
        Fetch.backLink(lastLocation)
      }
    })
  }

  function validation() {
    if (!Object.keys(project.days).length) {
      Info.error('Выбери даты')
      return false
    }
    return !!changedFields;
  }

  function onSave() {
    if (!validation()) return
    const text = !!project.id ? 'Проект изменён' : 'Предложение отправлено'
    Fetch.post(['project', project.id], project.id ? changedFields : project).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success(text)
        Fetch.backLink(lastLocation)
      }
    })
  }

  return (
    <>
      <ActionsPanel2
        left={<BackActionButton/>}
        right={<>
          {!!project.id &&
          <ActionButton
            onClick={onDelete}
            {...deleteButtonProps}
          />
          }
          {!!project.id && !changedFields &&
          <ActionButton
            {...doubleButtonProps}
          />
          }
          {!project.canceled && !!changedFields &&
          <ActionButton
            onClick={onSave}
            disabled={!changedFields}
            {...saveButtonProps}
          />
          }
        </>}
      />
      <Calendar
        triggerGet={project.user}
        edit={!project.canceled}
        get={Fetch.calendarGetter(project.user, project)}
        onChange={setDays}
        content={calendar}
        setContent={calendar.setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      <ProjectForm
        left={left.map(getField)}
        right={right.map(getField)}
      />
      {DayInfo}
      <span className={'bottom-space'}/>
    </>
  )
}
const ProjectOut = inject('ProjectPage')(observer(ProjectOutComponent))

function ProjectInComponent({ProjectPage:store}) {
  const {downloadedValues, project, calendar} = store
  const {money, money_per_day, money_calculating, info, days} = project
  const account = useAccount()
  const lastLocation = useLastLocation()
  const setValue = () => Info.info('Изменение недоступно')

  const [DayInfo, setDayInfo] = useState(null)
  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(
      <PopOverDay
        anchorEl={element}
        info={info}
        dayOff={dayOff}
        onClose={() => setDayInfo(null)}
      />
    )
  }
  const status = getProjectStatus(downloadedValues, account)

  const fields = {
    'title': <TextField label="Название" value={getProjectTitle(project)} changeName={'title'} emptyNull helperText={status} onChange={setValue}/>,
    'money': <MoneyField money={money} money_per_day={money_per_day} money_calculating={money_calculating} setValue={setValue}/>,
    'creator': <ProfileField label={'Заказчик'} value={project.creator} disabled/>,
  }

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = ['title', 'money', 'creator']
  let right = [<InfoField info={info} days={days} height={69 * 3 + (status ? 23 : 0)} setInfo={setValue}/>]
  let deleteButtonProps = {
    label: project.canceled ? 'Удалить' : 'Отказаться',
    icon: project.canceled ? <Delete/> : <Cancel/>
  }
  let saveButtonProps = {
    label: project.confirmed ? 'Оплачен' : 'Принять',
    icon: project.confirmed ? <Done/> : <AssignmentTurnedIn/>
  }

  function onDelete() {
    Fetch.delete(['project', project.id]).then((r) => {
      if (r.error) Info.error(r.error)
      else  {
        Info.success('Проект удалён')
        Fetch.backLink(lastLocation)
      }
    })
  }

  function onSave() {
    const text = project.confirmed ? 'Проект завершён' : 'Предложение принято'
    Fetch.post(['project', project.id], project.confirmed ? {is_paid: true} : {confirmed: true, is_wait: false}).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success(text)
        Fetch.get('account').then(mainStore.Account.setValue)
        Fetch.backLink(lastLocation)
      }
    })
  }

  return (
    <>
      <ActionsPanel2
        left={<BackActionButton/>}
        right={<>
          <ActionButton
            onClick={onDelete}
            {...deleteButtonProps}
          />
          {!project.canceled &&
          <ActionButton
            onClick={onSave}
            {...saveButtonProps}
          />
          }
        </>}
      />
      <Calendar
        get={Fetch.calendarGetter(project.user, project)}
        content={calendar}
        setContent={calendar.setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      <ProjectForm
        left={left.map(getField)}
        right={right.map(getField)}
      />
      {DayInfo}
      <span className={'bottom-space'}/>
    </>
  )
}
const ProjectIn = inject('ProjectPage')(observer(ProjectInComponent))

function ProjectFolderSelfComponent({ProjectPage:store}) {
  const {downloadedValues, project, calendar, downloadFromTemplate} = store
  const {money, money_per_day, money_calculating, info, days, children, setInfo, setValue} = project
  const account = useAccount()
  const lastLocation = useLastLocation()

  const [pick, setPick] = useState([].concat(...children.map(p => p.dates)))
  useEffect(unHighlightDays, [children])

  function highlightDays(p) {
    setPick(p.dates)
  }

  function unHighlightDays() {
    setPick([].concat(...children.map(p => p.dates)))
  }

  const [DayInfo, setDayInfo] = useState(null)
  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(
      <PopOverDay
        anchorEl={element}
        info={info}
        dayOff={compareId(project.user, account) && dayOff}
        onClose={() => setDayInfo(null)}
      />
    )
  }

  function getChanges() {
    const changedFields = {}
    for (const key of Object.keys(project)) {
      let is_same = true
      if (['client', 'user', 'creator', 'canceled'].includes(key)) is_same = compareId(project[key], downloadedValues[key])
      else is_same = _.isEqual(project[key], downloadedValues[key])
      if (!is_same) changedFields[key] = project[key]
    }
    return Object.keys(changedFields).length ? changedFields : null
  }
  const changedFields = getChanges()

  function changeMoney(obj) {
    if (Object.keys(obj).includes('money_calculating')) setValue({
      ...obj,
      money: project.money_per_day,
      money_per_day: project.money
    })
    else setValue(obj)
  }

  const fields = {
    'title': <TextField label="Название" value={project.title} onChange={setValue} changeName={'title'} emptyNull helperText={getProjectStatus(downloadedValues, account)}/>,
    'money': <MoneyField money={money} money_per_day={money_per_day} money_calculating={money_calculating} setValue={changeMoney}/>,
    'client': <ClientField label={'Клиент'} value={project.client} onChange={(client) => setValue({client: client})}/>,
  }

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = ['title', <InfoField info={info} setInfo={setInfo} days={days} height={69 * 2 + 14}/>,
    <div style={{textAlign: 'center', width: '100%'}}>
      <Typography color={'secondary'} variant={'overline'}>Значения по умолчанию</Typography>
    </div>, 'money', 'client'
  ]
  let right = [
    <List dense style={{height: 374, overflow: "scroll"}}>
    {children.map(p => (
      <ProjectItem
        child
        key={p.id.toString()}
        project={p}
        deleteButton={false}
        paidButton={false}
        confirmButton={false}
        wrapperRender={p => <A link={['project', p.id]} noDiv preLinkFunction={unHighlightDays} key={project.id.toString()} disabled/>}
        onClick={p => Fetch.link(['project', p.id], mainStore.ProjectPage.download)}

        onTouchHold={highlightDays}
        onTouchEnd={unHighlightDays}
        onMouseOver={highlightDays}
        onMouseLeave={unHighlightDays}
      />
    ))}
    </List>
  ]
  let saveButtonProps = {
    label: 'Сохранить',
    icon: <Save/>
  }
  let deleteButtonProps = {
    label: 'Удалить',
    icon: <Delete/>
  }
  let addButtonProps = {
    label: 'Добавить',
    icon: <Add/>
  }

  function onSave() {
    Fetch.post(['project', project.id], project.id ? changedFields : project).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success('Проект сохранён')
        downloadedValues.setValue(project)
      }
    })
  }

  function onDelete() {
    //eslint-disable-next-line
    if (!confirm('Удалить серию проектов?')) return
    Fetch.delete(['project', project.id]).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success('Серия проектов удалена')
        Fetch.backLink(lastLocation)
      }
    })
  }

  return (
    <>
      <ActionsPanel2
        left={<BackActionButton/>}
        right={<>
          {compareId(project.user, account) &&
            <ActionButton
              onClick={onDelete}
              {...deleteButtonProps}
            />
          }
          {!changedFields ?
            <ActionButton
              onClick={() => Fetch.link(`project?series=${project.id}`, downloadFromTemplate)}
              {...addButtonProps}
            /> :
            <ActionButton
              onClick={onSave}
              {...saveButtonProps}
            />
          }
        </>}
      />
      <Calendar
        get={Fetch.calendarGetter(project.user, project)}
        content={{...calendar, daysPick: pick}}
        setContent={calendar.setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      <ProjectForm
        left={left.map(getField)}
        right={right.map(getField)}
      />
      {DayInfo}
      <span className={'bottom-space'}/>
    </>
  )
}
const ProjectFolderSelf = inject('ProjectPage')(observer(ProjectFolderSelfComponent))

function ProjectFolderOutComponent({ProjectPage:store}) {
  const {downloadedValues, project, calendar, downloadFromTemplate} = store
  const {money, money_per_day, money_calculating, info, days, children, setInfo, setValue} = project
  const account = useAccount()
  const lastLocation = useLastLocation()

  const [pick, setPick] = useState([].concat(...children.map(p => p.dates)))
  useEffect(unHighlightDays, [children])

  function highlightDays(p) {
    setPick(p.dates)
  }

  function unHighlightDays() {
    setPick([].concat(...children.map(p => p.dates)))
  }

  const [DayInfo, setDayInfo] = useState(null)
  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(
      <PopOverDay
        anchorEl={element}
        info={info}
        dayOff={compareId(project.user, account) && dayOff}
        onClose={() => setDayInfo(null)}
      />
    )
  }

  function getChanges() {
    const changedFields = {}
    for (const key of Object.keys(project)) {
      let is_same = true
      if (['client', 'user', 'creator', 'canceled'].includes(key)) is_same = compareId(project[key], downloadedValues[key])
      else is_same = _.isEqual(project[key], downloadedValues[key])
      if (!is_same) changedFields[key] = project[key]
    }
    return Object.keys(changedFields).length ? changedFields : null
  }
  const changedFields = getChanges()

  function changeMoney(obj) {
    if (Object.keys(obj).includes('money_calculating')) setValue({
      ...obj,
      money: project.money_per_day,
      money_per_day: project.money
    })
    else setValue(obj)
  }

  const fields = {
    'title': <TextField label="Название" value={project.title} onChange={setValue} changeName={'title'} emptyNull/>,
    'money': <MoneyField money={money} money_per_day={money_per_day} money_calculating={money_calculating} setValue={changeMoney}/>,
    'user': <ProfileField label={'Исполнитель'} value={project.user} onChange={(v) => setValue({user: v })} exclude={account.id}/>,
  }

  const getField = (fieldName) => fields[fieldName] || fieldName

  let left = ['title', <InfoField info={info} setInfo={setInfo} days={days} height={69 * 2 + 14}/>,
    <div style={{textAlign: 'center', width: '100%'}}>
      <Typography color={'secondary'} variant={'overline'}>Значения по умолчанию</Typography>
    </div>, 'money', 'user'
  ]
  let right = [
    <List dense style={{height: 374, overflow: "scroll"}}>
      {children.map(p => (
        <ProjectItem
          child
          key={p.id.toString()}
          project={p}
          deleteButton={false}
          paidButton={false}
          confirmButton={false}
          wrapperRender={p => <A link={['project', p.id]} noDiv preLinkFunction={unHighlightDays} key={project.id.toString()} disabled/>}
          onClick={p => Fetch.link(['project', p.id], mainStore.ProjectPage.download)}

          onTouchHold={highlightDays}
          onTouchEnd={unHighlightDays}
          onMouseOver={highlightDays}
          onMouseLeave={unHighlightDays}
        />
      ))}
    </List>
  ]
  let saveButtonProps = {
    label: 'Сохранить',
    icon: <Save/>
  }
  let deleteButtonProps = {
    label: 'Удалить',
    icon: <Delete/>
  }
  let addButtonProps = {
    label: 'Добавить',
    icon: <Add/>
  }

  function onSave() {
    Fetch.post(['project', project.id], project.id ? changedFields : project).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success('Проект сохранён')
        downloadedValues.setValue(project)
      }
    })
  }

  function onDelete() {
    //eslint-disable-next-line
    if (!confirm('Удалить серию?')) return
    Fetch.delete(['project', project.id]).then((r) => {
      if (r.error) Info.error(r.error)
      else {
        Info.success('Серия удалена')
        Fetch.backLink(lastLocation)
      }
    })
  }

  return (
    <>
      <ActionsPanel2
        left={<BackActionButton/>}
        right={<>
          {!project.children.length &&
            <ActionButton
              onClick={onDelete}
              {...deleteButtonProps}
            />
          }
          {!changedFields ?
            <ActionButton
              onClick={() => Fetch.link(`project?series=${project.id}`, downloadFromTemplate)}
              {...addButtonProps}
            /> :
            <ActionButton
              onClick={onSave}
              {...saveButtonProps}
            />
          }
        </>}
      />
      <Calendar
        get={Fetch.calendarGetter(project.user, project)}
        content={{...calendar, daysPick: pick}}
        setContent={calendar.setContent}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      <ProjectForm
        left={left.map(getField)}
        right={right.map(getField)}
      />
      {DayInfo}
      <span className={'bottom-space'}/>
    </>
  )
}
const ProjectFolderOut = inject('ProjectPage')(observer(ProjectFolderOutComponent))

function ProjectPage({ProjectPage:store}) {
  const {project} = store
  const account = useAccount()
  if (project.is_series) return compareId(project.user, account) ? <ProjectFolderSelf/> : <ProjectFolderOut/>
  else if (compareId(project.creator, project.user)) return <ProjectSelf/>
  else if (compareId(project.creator, account)) return <ProjectOut/>
  else if (compareId(project.user, account)) return <ProjectIn/>
  return null
}

export default inject('ProjectPage')(observer(ProjectPage))
