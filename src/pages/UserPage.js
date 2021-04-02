import React, {useState} from "react";
import Calendar from '../components/Calendar';
import {inject, observer} from "mobx-react";
import {IconButton,
  InputAdornment,
  List, ListItem,
  ListSubheader
} from "@material-ui/core";
import ProjectItem from "../components/ProjectItem/ProjectItem";
import PopOverDay from "../components/PopOverDay/PopOverDay";
import Fetch from "../js/Fetch";
import Box from "@material-ui/core/Box";
import Tag from "../components/Tag/Tag";
import {Call, Mail} from "@material-ui/icons";
import TextField from "../components/Fields/TextField/TextField";
import Loader from "../js/Loader";
import Info from "../js/Info";


function UserPage(props) {
  const [pick, setPick] = useState([])
  const [triggerGet, setTriggerGet] = useState(new Date().getTime())
  const {userPage, user, projects, calendar, getUser, delProject, getProject} = props.UserStore
  const [DayInfo, setDayInfo] = useState(null);
  const p = user.phone_confirm
  const phone = p? `+${p[0]} (${p.slice(1,4)}) ${p.slice(4,7)}-${p.slice(7,9)}-${p.slice(9)}` : p

  const [copied, setCopied] = useState(null)

  const content = {
    days: calendar.days,
    daysOff: userPage.edit ? [] : calendar.daysOff,
    daysPick: userPage.edit ? calendar.daysOff : pick
  }

  function showInfo(element, info, date, dayOff) {
    if (!info && !dayOff) return
    setDayInfo(<PopOverDay
      anchorEl={element}
      info={info}
      dayOff={user.username === localStorage.User && dayOff}
      onClose={() => setDayInfo(null)}
      onClick={popoverLink}
    />)
  }

  function onChange(daysPick, array, pick) {
    Fetch.post('daysoff', {days: array, pick: pick}).then()
    calendar.setValue({daysOff: new Set(daysPick)})
  }

  function link(project) {
    props.setProject(project)
    props.history.push(`/project/${project.id}/`)
  }

  function popoverLink(project) {
    const p = getProject(project.id)
    p ? props.setProject(p) : props.default({id: project.id, hidden: true})
    props.history.push(`/project/${project.id}/`)
  }

  function del(project) {
    delProject(project.id)
    Fetch.delete(['project', project.id]).then(() => {
      delProject(project.id)
      setTriggerGet(new Date().getTime())
    })
  }

  function paidToggle(project) {
    project.is_paid = !project.is_paid
    Fetch.post(['project', project.id], project).then(getUser)
  }

  function confirmProject(project) {
    project.is_wait = false
    Fetch.post(['project', project.id], project).then(() => {
      getUser()
      setTriggerGet(new Date().getTime())
    })
  }

  function copyToClipboard(string, label) {
    let textarea;
    let result;

    try {
      textarea = document.createElement('textarea');
      textarea.setAttribute('readonly', true);
      textarea.setAttribute('contenteditable', true);
      textarea.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set.
      textarea.value = string;

      document.body.appendChild(textarea);

      textarea.focus();
      textarea.select();

      const range = document.createRange();
      range.selectNodeContents(textarea);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      textarea.setSelectionRange(0, textarea.value.length);
      result = document.execCommand('copy');
    } catch (err) {
      console.error(err);
      result = null;
    } finally {
      document.body.removeChild(textarea);
    }

    // manual copy fallback using prompt
    if (!result) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const copyHotkey = isMac ? '⌘C' : 'CTRL+C';
      result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
      if (!result) {
        return false;
      }
    }
    setCopied(label)
    Loader.set(() => setCopied(null), 1500)
    return true;
  }


  if (userPage.loading) return <></>

  return (
    <div>
      <Calendar
        triggerGet={triggerGet}
        triggerNew={user.username}
        content={content}
        setContent={calendar.setContent}
        get={(start, end) => Fetch.getCalendar(start, end, user.username)}
        offset={false}
        edit={userPage.edit}
        onChange={onChange}
        onDay={{
          onTouchHold: showInfo,
          onContextMenu: showInfo
        }}
        onError={Info.error}
      />
      {userPage.profile ?
        <>
          {!!user.tags.length && <>
            <ListSubheader>Специализации</ListSubheader>
            <Box display={"flex"} flexWrap={'wrap'}>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
              {user.tags.map(tag => <Tag tag={tag} key={tag.id}/>)}
            </Box>
          </>}
          {(!!user.show_email || !!user.show_phone) &&
          <List dense>
            <ListSubheader>Контакты</ListSubheader>
            {(user.show_phone && phone) && <ListItem>
              <TextField
                fullWidth={false}
                onClick={() => copyToClipboard(phone, 'phone')}
                value={phone}
                label={copied === 'phone' ? 'Скопировано' : 'Телефон'}
                inputProps={{style: {cursor: 'pointer', paddingBottom: 5, paddingTop: 5}}}
                onFocus={e => e.target.blur()}
                InputProps={{
                  disableUnderline: true, startAdornment:
                    <InputAdornment position={'start'} style={{marginRight: 0}}>
                      <a href={`tel:+${phone}`}>
                        <IconButton size={'small'}>
                          <Call/>
                        </IconButton>
                      </a>
                    </InputAdornment>
                }}
              />
            </ListItem>}

            {(user.show_email && user.email_confirm) && <ListItem>
              <TextField
                fullWidth={false}
                onClick={() => copyToClipboard(user.email_confirm, 'email')}
                value={user.email_confirm}
                label={copied === 'email' ? 'Скопировано' : 'E-mail'}
                inputProps={{style: {cursor: 'pointer', paddingBottom: 5, paddingTop: 5}}}
                onFocus={e => e.target.blur()}
                InputProps={{
                  disableUnderline: true, startAdornment:
                    <InputAdornment position={'start'} style={{marginRight: 0}}>
                      <a href={`mailto:${user.email_confirm}`}>
                        <IconButton size={'small'}>
                          <Mail/>
                        </IconButton>
                      </a>
                    </InputAdornment>
                }}
              />
            </ListItem>}
          </List>
          }
        </>
        :
        <List dense>
          <ListSubheader disableSticky style={{
            textAlign: "center",
            color: "rgba(0, 0, 0, 0.7)"
          }}>{`Акутальные проекты${!projects.length ? ' отсутствуют' : ''}`}</ListSubheader>
          {projects.map(project => <ProjectItem
            project={project}
            key={project.id}

            onClick={link}
            onDelete={del}
            paidToggle={paidToggle}
            confirmProject={confirmProject}

            onTouchHold={() => setPick(Object.keys(project.days))}
            onTouchEnd={() => setPick([])}
            onMouseOver={() => setPick(Object.keys(project.days))}
            onMouseLeave={() => setPick([])}
          />)}
        </List>
      }
      {DayInfo}
    </div>
  )
}

export default inject(stores => ({
  UserStore: stores.UsersStore.getUser(),
  setProject: stores.ProjectStore.setProject,
  default: stores.ProjectStore.default
}))(observer(UserPage))