import LazyList from "../components/LazyList/LazyList";
import {useListStore} from "../components/hooks";
import React from "react";
import {ProjectItem} from "../components/ProjectItem/ProjectItem";

export default function FeedPage(props) {
  const f = useListStore()

  return (<>
    <LazyList
      preLoader
      getLink={'test'}
      getParams={{open: true}}
      set={f.set}
      add={f.add}
      page={f.page}
      pages={f.pages}
    >
      {f.list && f.list.map(project => <ProjectItem
          project={project}
          key={project.id}
          onClick={(p) => {console.log(p)}}
        />
      )}
    </LazyList>
  </>)
}
