import React from "react";
import PropTypes from "prop-types";
import { Hydra as client } from "alcaeus";
import { withRouter } from "react-router";

import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Menu,
  Segment,
  Input
} from "semantic-ui-react";

import HydraRenderer from "./components/HydraRenderer";

function HydraConsole(props: any) {
  client.loadResource("http://localhost:3000/iot").then(res => {
    console.log("From http://localhost:3000/iot:");
    console.log(res);
    for (let r of res) {
      console.log(r.id);
    }
  });

  client.loadResource("https://wikibus-data-test.gear.host/").then(res => {
    console.log("From https://wikibus-data-test.gear.host/:");
    console.log(res);
    for (let r of res) {
      console.log(r.id);
    }
  });
  return (
    <Container style={{ marginTop: "3em" }}>
      <Header as="h1">Hydra console</Header>
      <Grid columns={1} stackable>
        <Grid.Column>
          <Input fluid label="http://" placeholder="hydra-api.com/entrypoint" />
        </Grid.Column>
      </Grid>
      <Grid columns={1} stackable>
        <Grid.Column>
          <HydraRenderer />
        </Grid.Column>
      </Grid>
    </Container>
  );
}

export default withRouter(HydraConsole);
