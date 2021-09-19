import React from "react";
import Grid from "@material-ui/core/Grid";

export default function ProjectForm({left, right}) {

  return (
    <Grid container justify="space-between" alignItems="flex-start" spacing={3} style={{marginTop: 12}}>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {left.map((i, n) => <Grid item xs={12} key={n.toString()}>{i}</Grid>)}
        </Grid>
      </Grid>
      <Grid item xs={12} sm md={6}>
        <Grid container direction="row" spacing={3}>
          {right.map((i, n) => <Grid item xs={12} key={n.toString()}>{i}</Grid>)}
        </Grid>
      </Grid>
    </Grid>
  )
}
