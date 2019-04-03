import React from "react";
import PropTypes from "prop-types";
import { Hydra } from "alcaeus";
import { observable } from "mobx";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import UrlInputBar from "./components/UrlInputBar";
import HydraRenderer from "./components/HydraRenderer";

const styles = {
  root: {
    width: "auto",
    flexGrow: 1,
    margin: "2em 4em 0 4em",
    marginRight: "2em"
  },
  paper: {
    padding: "4px"
  }
};

const store = observable({ hydraUrl: "http://localhost:3000/iot/apartments" });

function HydraConsole(props: any) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs md>
          <UrlInputBar store={store} />
        </Grid>
      </Grid>
      <Grid container spacing={24}>
        <Grid item xs md>
          <Paper className={classes.paper}>
            <HydraRenderer />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

HydraConsole.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HydraConsole);
