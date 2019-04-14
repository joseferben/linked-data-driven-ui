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

import HydraRenderer from "./components/HydraRenderer";
import { RendererSelection } from "./components/RendererSelection";
import { isDefined } from "./utils";

import { GenericLinkedData } from "./components/HydraRenderer/renderers/GenericLinkedData";
import { Temperature } from "./components/HydraRenderer/renderers/Temperature";
import { Thermometer } from "./components/HydraRenderer/renderers/Thermometer";

class HydraConsole extends React.Component {
  state = {
    resources: null,
    selected: []
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

  selectRenderers(renderers: any) {
    this.setState({ selected: renderers });
  }

  render() {
    const {
      state: { resources }
    } = this;
    const baseRenderer = {
      id: "generic",
      name: "Generic Linked Data",
      comp: GenericLinkedData,
      type: "*"
    };
    const renderers = [
      {
        id: "temperature",
        name: "Temperature",
        comp: Temperature,
        type: "https://schema.org/PropertyValue"
      },
      {
        id: "thermometer",
        name: "Thermometer",
        comp: Thermometer,
        type: "http://localhost:3000/iot/apartments/Thermometer"
      }
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
            <RendererSelection
              renderers={renderers}
              selectRenderer={this.selectRenderers.bind(this)}
              baseRenderer={baseRenderer}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Input
              fluid
              label="http://"
              placeholder="hydra-api.com/entrypoint"
            />
            <Divider />
            <HydraRenderer selectedRenderers={this.state.selected} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default HydraConsole;
