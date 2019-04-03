import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";

const styles = {
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "100%"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4
  }
};

function UrlInputBar(props: any) {
  const { classes } = props;
  return (
    <Paper className={classes.root} elevation={1}>
      <InputBase
        className={classes.input}
        placeholder="Hydra API entry point"
      />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="Directions"
      >
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}

UrlInputBar.propTypes = {
  classes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

export default withStyles(styles)(UrlInputBar);
