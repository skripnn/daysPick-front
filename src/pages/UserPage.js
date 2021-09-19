import {ProfileFullName, RaiseButton} from "../components/UserFullName/UserFullName";
import {ProfileAvatar} from "../components/UserAvatar/UserAvatar";
import React from "react";
import {inject, observer} from "mobx-react";
import {useMount} from "../components/hooks";
import ActionButton from "../components/Actions/ActionButton/ActionButton";
import {AccountCircle, Close, EventBusy, List as ListIcon, PostAdd} from "@material-ui/icons";
import {ActionsPanel2} from "../components/Actions/ActionsPanel/ActionsPanel";
import Calendar from "../components/test/components/Calendar";
import Fetch from "../js/Fetch";
import {Profile} from "../components/UserProfile/UserProfile";
import HeaderText from "../components/Text/HeaderText";
import A from "../components/core/A";
import {ProjectItemAutoFolder} from "../components/ProjectItem/ProjectItem";
import {compareId, projectListTransform} from "../js/functions/functions";
import {IconButton, List} from "@material-ui/core";
import _ from 'underscore';
import mainStore from "../stores/mainStore";

function UserPage({UserPage:store}) {
  const {profile, calendar, projects, setValue, get, update} = store
  const {id, is_self, tab, unconfirmed_projects, daysOffEdit, filterPicked, picked, noOffset, setTab} = store
  useMount(() => {if (!id) get()})

  function onChange(daysPick, array, pick) {
    if (daysOffEdit) {
      Fetch.post('daysoff', {days: array, pick: pick}).then()
      calendar.setValue({daysOff: new Set(daysPick)})
    }
    else setValue({filterPicked: daysPick, tab: 'projects'})
  }

  function highlightDays(project) {
    setValue({picked: project.dates})
  }

  function unHighlightDays() {
    setValue({picked: [], noOffset: true})
  }

  function onAction() {
    unHighlightDays()
    update()
  }

  const visibleProjects = !!filterPicked.length?
    projects.filter(i => !!_.intersection(i.dates, filterPicked).length) :
    projectListTransform(projects)

  if (!id) return null

  return (<>
    <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <ProfileFullName
        profile={profile}
        leftChildren={<ProfileAvatar profile={profile} dialog/>}
        rightChildren={is_self && <RaiseButton />}
      />
      <ActionsPanel2>
        {is_self && <ActionButton
          hidden={!is_self}
          label={"Выходные"}
          icon={<EventBusy/>}
          active={daysOffEdit}
          onClick={() => setTab('daysOff')}
        />}
        <ActionButton
          label={'Добавить'}
          icon={<PostAdd/>}
          wrapper={<A link={`project?user=${profile.username}`} setter={mainStore.ProjectPage.download}/>}
        />
        <ActionButton
          badge={unconfirmed_projects}
          label={"Проекты"}
          icon={<ListIcon/>}
          active={tab === 'projects'}
          onClick={() => setTab('projects')}
        />
        <ActionButton
          label={"Профиль"}
          icon={<AccountCircle/>}
          active={tab === 'profile'}
          onClick={() => setTab('profile')}
        />
      </ActionsPanel2>
    </div>
    <Calendar
      content={{
        days: calendar.days,
        daysOff: daysOffEdit? [] : calendar.daysOff,
        daysPick: daysOffEdit? calendar.daysOff : !!filterPicked.length ? filterPicked : picked
      }}
      setContent={calendar.setContent}
      get={Fetch.calendarGetter(id)}
      edit
      noOffset={noOffset}
      onChange={onChange}
      onWeeksChange={(weeks) => setValue({range: {start: weeks[0].key, end: weeks[weeks.length - 1].key}})}
    />
    {tab === 'profile' && <Profile profile={profile}/>}
    {tab === 'projects' &&
      <List dense>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <HeaderText center>{`Актуальные проекты ${!projects || !projects.length ? ' отсутствуют' : ''}`}</HeaderText>
          <div style={{position: 'absolute', right: 0, alignSelf: 'center'}}>
            {!!filterPicked.length &&
              <IconButton size={'small'} onClick={() => setValue({filterPicked: []})}>
                <Close/>
              </IconButton>
            }
          </div>
        </div>
        {visibleProjects.map(project =>
          <ProjectItemAutoFolder
            key={project.id.toString()}
            project={project}
            onClick={(p) => Fetch.link(['project', p.id], mainStore.ProjectPage.download)}
            wrapperRender={p => <A link={['project', p.id]} noDiv preLinkFunction={unHighlightDays} key={project.id.toString()} disabled/>}

            onDelete={onAction}
            onPaid={onAction}
            onConfirm={onAction}
            paidButton={p => compareId(p.user, id)}
            confirmButton={p => compareId(p.user, id)}

            onTouchHold={(p) => setValue({picked: p.dates, noOffset: false})}
            onTouchEnd={unHighlightDays}
            onMouseOver={highlightDays}
            onMouseLeave={unHighlightDays}
          />
        )}
      </List>
    }
    <span className={'bottom-space'}/>
  </>)
}

export default inject('UserPage')(observer(UserPage))
