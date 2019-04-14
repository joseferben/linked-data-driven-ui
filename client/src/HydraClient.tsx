import React from "react";
import { Hydra as client } from "alcaeus";

import {
  Container,
  Divider,
  Grid,
  Header,
  Menu,
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
import { Apartment } from "./components/HydraRenderer/renderers/Apartment";
import { Room } from "./components/HydraRenderer/renderers/Room";
import { BoldFont } from "./components/HydraRenderer/renderers/BoldFont";

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
  },
  {
    id: "apartment",
    name: "Apartment",
    comp: Apartment,
    type: "https://schema.org/Apartment"
  },
  {
    id: "room",
    name: "Room",
    comp: Room,
    type: "https://schema.org/Room"
  },
  {
    id: "boldFont",
    name: "BoldFont",
    comp: BoldFont,
    type: "*"
  }
];

class HydraConsole extends React.Component {
  state = {
    rootResources: null,
    resource: null,
    selected: []
  };

  componentDidMount() {
    client.loadResource("http://localhost:3000/iot/apartments/0").then(res => {
      this.setState({ resource: res.root });
    });

    client.loadResource("http://localhost:3000/iot").then(res => {
      console.log("From http://localhost:3000/iot:");
      Promise.all(Array.from(res).map(r => client.loadResource(r.id))).then(
        res => {
          const resources = res.map(resource => resource.root);
          this.setState({ rootResources: resources });
        }
      );
    });
  }

  selectRenderers(renderers: any) {
    this.setState({ selected: renderers });
  }

  render() {
    const {
      state: { rootResources, resource, selected }
    } = this;
    return (
      <Container style={{ marginTop: "3em" }}>
        <Header as="h1">Hydra console</Header>
        <Grid>
          <Grid.Column width={4}>
            <Menu vertical>
              {isDefined(rootResources) ? (
                (rootResources || []).map(r => (
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
            <HydraRenderer
              baseRenderer={baseRenderer}
              selectedRenderers={selected}
              resource={resource}
            />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default HydraConsole;
