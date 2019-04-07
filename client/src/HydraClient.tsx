import React from "react";
import PropTypes from "prop-types";
import { Hydra as client } from "alcaeus";
import { observable } from "mobx";

import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Menu,
  Segment,
  Input,
  Dimmer,
  Loader
} from "semantic-ui-react";

import HydraRenderer from "./components/HydraRenderer";

function isDefined<T>(a: T | null | undefined): a is T {
  return a !== null && a !== undefined;
}

class HydraConsole extends React.Component {
  state = {
    resources: null
  };
  componentDidMount() {
    client.loadResource("http://localhost:3000/iot").then(res => {
      console.log("From http://localhost:3000/iot:");
      Promise.all(Array.from(res).map(r => client.loadResource(r.id))).then(
        res => {
          const resources = res.map(resource => resource.root);
          this.setState({ resources });
        }
      );
    });

    client.loadResource("http://localhost:3000/iot/apartments/0").then(res => {
      console.log("From http://localhost:3000/iot/apartments/0:");
      Promise.all(Array.from(res).map(r => client.loadResource(r.id))).then(
        res => {
          const resources = res.map(resource => resource.root);
          console.log(resources[0]);
        }
      );
    });
  }

  render() {
    const {
      state: { resources }
    } = this;
    return (
      <Container style={{ marginTop: "3em" }}>
        <Header as="h1">Hydra console</Header>
        <Grid>
          <Grid.Column width={4}>
            <Menu pointing secondary vertical>
              {isDefined(resources) ? (
                (resources || []).map(r => (
                  <Menu.Item
                    key={r["@id"]}
                    name={(r["@id"] || "").split("/").pop()}
                  />
                ))
              ) : (
                <Dimmer active inverted>
                  <Loader />
                </Dimmer>
              )}
            </Menu>
          </Grid.Column>
          <Grid.Column width={12}>
            <Input
              fluid
              label="http://"
              placeholder="hydra-api.com/entrypoint"
            />
            <Divider />
            <HydraRenderer />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default HydraConsole;
