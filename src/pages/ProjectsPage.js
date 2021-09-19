import React, {useState} from "react";
import {inject, observer} from "mobx-react";
import {ProjectItemAutoFolder} from "../components/ProjectItem/ProjectItem";
import Fetch from "../js/Fetch";
import LazyList from "../components/LazyList/LazyList";
import {StatisticsDialog} from "../components/ProjectsStatistics/ProjectsStatistics";
import {useAccount} from "../stores/storeHooks";
import {compareId} from "../js/functions/functions";
import A from "../components/core/A";
import {AddCircleOutline, Folder} from "@material-ui/icons";
import ActionButton2 from "../components/Actions/ActionButton/ActionButton2";
import ActionsPanel2 from "../components/Actions/ActionsPanel/ActionsPanel2";
import Typography from "@material-ui/core/Typography";
import mainStore from "../stores/mainStore";
import {NewSeriesDialog} from "../components/NewSeriesDialog/NewSeriesDialog";


function ProjectsListPage({store, getLink}) {
  const {fullList, filteredList, save, del} = store
  const {list, page, pages, add} = filteredList.exist() ? filteredList : fullList
  const [statistics, setStatistics] = useState(null)
  const [filter, setFilter] = useState(null)
  const [newSeries, setNewSeries] = useState(null)
  const {id, username} = useAccount()

  function getStatistics() {
    Fetch.post([getLink, 'statistics'], filter).then(setStatistics)
  }

  function reload() {
    Fetch.get(getLink).then(fullList.set)
  }

  return (
    <div>
      <LazyList
        searchFieldParams={{
          set: filteredList.set,
          calendarGet: getLink === 'offers' ? Fetch.getOffersCalendar : Fetch.calendarGetter(id),
        }}
        getLink={getLink}
        getParams={{user: id}}
        pages={pages}
        page={page}
        set={fullList.set}
        add={add}
        onFilterChange={setFilter}
      >
        <ActionsPanel2>
          <ActionButton2
            label={'Новый проект'}
            icon={<AddCircleOutline style={{marginBottom: 0.25}}/>}
            wrapper={<A link={`project${getLink === 'offers' ? '' : `?user=${username}`}`} setter={mainStore.ProjectPage.setValue}/>}
          />
          <ActionButton2
            label={'Новая серия'}
            icon={<Folder style={{marginBottom: 0.25}}/>}
            onClick={() => setNewSeries({user: getLink === 'offers' ? null : id})}
          />
          {!!list.length && <ActionButton2
            label={'Статистика'}
            onClick={getStatistics}
          />}
        </ActionsPanel2>
        {!list.length ?
          <Typography variant={'body2'} color={'secondary'}>Нет проектов</Typography> :
          list.map((project) =>
            <ProjectItemAutoFolder
              key={project.id.toString()}
              project={project}
              onClick={p => Fetch.link(['project', p.id], mainStore.ProjectPage.download)}
              wrapperRender={p => <A link={['project', p.id]} noDiv key={project.id.toString()} disabled/>}
              onDelete={del}
              onConfirm={save}
              onPaid={save}
              paidButton={p => compareId(p.user, id)}
              confirmButton={p => compareId(p.user, id)}
            />
          )
        }
      </LazyList>
      <StatisticsDialog value={statistics} close={() => setStatistics(null)}/>
      <NewSeriesDialog openState={newSeries} onClose={() => setNewSeries(null)} onSave={reload}/>
    </div>
  )
}

export const OffersPage = inject(stores => ({
  store: stores.OffersPage,
  getLink: 'offers'
}))(observer(ProjectsListPage))

export const ProjectsPage = inject(stores => ({
  store: stores.ProjectsPage,
  getLink: 'projects'
}))(observer(ProjectsListPage))

