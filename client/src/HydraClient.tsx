import React from "react";
import { Hydra as client } from "alcaeus";

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

import { observable } from "mobx";

import HydraRenderer from "./components/HydraRenderer";
import { RendererSelection } from "./components/RendererSelection";
import { isDefined } from "./utils";

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
  }

  render() {
    const {
      state: { resources }
    } = this;
    const renderers = [
      { id: "foo", name: "Foo", comp: null, type: "" },
      { id: "bar", name: "Bar", comp: null, type: "" },
      { id: "baz", name: "Baz", comp: null, type: "" }
    ];
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
            <Divider />
            <RendererSelection renderers={renderers} />
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
