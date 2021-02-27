import {TreeItem, TreeView} from "@material-ui/lab";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import React from "react";
import {exist} from "./TagsEdit";
import Tag from "../Tag/Tag";

export default function RecursiveTree(props) {

  const renderTree = (node) => (
    <TreeItem key={node.id} nodeId={node.id.toString()}
              label={<Tag tag={node} exist={exist(node, props.list)} onClick={props.toggle}/>}>
      {node.childs ? node.childs.map((i) => renderTree(i)) : null}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ArrowDropDownIcon/>}
      defaultExpandIcon={<ArrowRightIcon/>}
      defaultEndIcon={<div style={{width: 24}}/>}
      disableSelection
    >
      {props.node.childs.map(node => renderTree(node))}
      {!!props.newTag && <TreeItem
        nodeId={'add'}
        label={props.newTag}
      >
      </TreeItem>}
    </TreeView>
  )
}