import React from "react";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Fetch from "../../js/Fetch";
import Tag from "../Tag/Tag";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


function Quote({ item, itemProps, index }) {
  return (
    <Draggable draggableId={item.id.toString()} index={index}>
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Tag tag={item} {...itemProps}/>
        </div>
      )}
    </Draggable>
  );
}

export default function DndTagsList(props) {

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const newTags = reorder(
      props.items,
      result.source.index,
      result.destination.index
    );
    Fetch.post(['profile', 'tags'], newTags)
    props.set( newTags );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list">
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {
              props.items.map((item, n) => <Quote item={item} itemProps={props.itemsProps} index={n} key={item.id} />)
            }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}