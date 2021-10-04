import React, {useEffect, useState} from "react";
import {useControlledState} from "../../hooks";
import Fetch from "../../../js/Fetch";
import {TagSimple} from "../../Tag/Tag";
import {compareId} from "../../../js/functions/functions";
import ChipInput from "material-ui-chip-input";

export function TagsSearchField({helperText, placeHolder, startAdornment, value, onChange, onTagsChange, ...otherProps}) {
  const [text, setText] = useControlledState(value, onChange)
  const [tagsOptions, setTagsOptions] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (text) Fetch.get('tags', {filter: text, exclude: tags.map(tag => tag.id)}).then(setTagsOptions)
    else setTagsOptions([])
  }, [text, tags])

  useEffect(() => {
    if (onTagsChange) onTagsChange(tags.length ? tags : null)
  //eslint-disable-next-line
  }, [tags])

  const renderer = (tag) => {
    return tag.chip.id ?
      <TagSimple tag={tag.chip} key={tag.chip.id} onDelete={v => setTags(tags.filter(i => !compareId(i, v)))} style={{height: 'unset', backgroundColor: '#e0e0e0'}} variant={'default'}/> :
      startAdornment
  }

  const onTagAdd = (tag) => {
    setTagsOptions(tagsOptions.filter(i => !compareId(i, tag)))
    setTags([...tags, tag])
    setText(null)
  }

  return (<div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
    <ChipInput
      className={'tags-input'}
      style={helperText ? {marginBottom: 20} : undefined}
      placeholder={placeHolder}
      helperText={helperText}
      size={"medium"}
      autoComplete={'off'}
      fullWidth
      inputValue={text}
      value={[{}, ...tags]}
      chipRenderer={renderer}
      onUpdateInput={e => onChange ? onChange(e.target.value) : setText(e.target.value)}
      onKeyDown={e => {
        if (e.key === 'Backspace' && !text && !!tags.length) setTags(tags.slice(0, tags.length - 1))
      }}
      {...otherProps}
    />
    {!!text && <div style={{display: "flex", flexWrap: 'wrap'}} className={'tags-list'}>
      {tagsOptions.map(tag => <TagSimple tag={tag} key={tag.id} onClick={onTagAdd}/>)}
    </div>}
  </div>)
}
