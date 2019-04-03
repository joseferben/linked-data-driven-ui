import React from "react";
import PropTypes from "prop-types";
import { Hydra } from "alcaeus";

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

export default HydraConsole;
