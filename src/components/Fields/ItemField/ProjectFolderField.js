import Item from "../../Items/Item";
import ItemField from "./ItemField";
import React from "react";
import {FolderOpen} from "@material-ui/icons";
import {NewSeriesDialog} from "../../NewSeriesDialog/NewSeriesDialog";

export default function ProjectFolderField({label, value, onChange, createState, ...otherProps}) {
  const itemRender = (v) => (
    <Item
      primary={
        <div style={{display: 'flex', alignItems: 'center', height: 22}}>
          <FolderOpen fontSize={"inherit"} style={{paddingRight: 4}}/>{v.title}
        </div>
      }
    />
  )

  const listRender = (list) => list.map(i => (
    <Item
      key={i.id.toString()}
      slim
      primary={
        <div style={{display: 'flex', alignItems: 'center', height: 22}}>
          <FolderOpen fontSize={"inherit"} style={{paddingRight: 4}}/>{i.title}
        </div>
      }
      secondary={i.client? i.client.full_name : '...'}
      third={!!(i.money || i.money_per_day) && new Intl.NumberFormat('ru-RU').format(i.money || i.money_per_day) + ` ₽${i.money_per_day ? '/день' : ''}`}
      onClick={() => onChange(i)}
    />
  ))

  return (
    <ItemField
      label={label}
      value={value}
      onChange={onChange}
      itemRender={itemRender}
      getLink={'projects'}
      getParams={{folders: 1}}
      listRender={listRender}
      createDialog={<NewSeriesDialog onSave={onChange} openState={createState}/>}
      emptyLoading
      {...otherProps}
    />
  )
}
