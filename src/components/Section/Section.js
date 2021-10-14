import Container from "@material-ui/core/Container";
import React from "react";

export default function Section({top, bottom, middle, sticky, children}) {
  const style = (top || bottom || middle) && {
    paddingTop: top ? undefined : 0,
    paddingBottom: bottom? undefined : 0
  }
  if (style && sticky) {
    style.position = 'sticky'
    style.top = sticky
    style.zIndex = 500
  }
  return (
    <Container maxWidth="md" className={"content-block"} style={style}>
      {children}
    </Container>
  )
}
