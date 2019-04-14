import React, { SyntheticEvent } from "react";
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
import { GenericTable } from "./components/HydraRenderer/renderers/GenericTable";

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
    id: "genericTable",
    name: "GenericTable",
    comp: GenericTable,
    type: "http://www.w3.org/ns/hydra/core#Collection"
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
    url: "",
    rootResources: null,
    resource: null,
    selected: []
  };

  handleKeyPress(evt: any) {
    if (evt.key == "Enter") {
      client.loadResource(this.state.url).then(res => {
        console.log(res.root);
      });
    }
  }

  handleOnChange(evt: any) {
    this.setState({ url: evt.target.value });
  }

  componentDidMount() {
    window.onhashchange = () => {
      this.setState({ url: location.hash.split("#")[1] });
      client.loadResource(this.state.url).then(res => {
        this.setState({ resource: res.root });
      });
    };

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
      state: { rootResources, resource, selected, url }
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
                    href={"#" + r["@id"]}
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
              placeholder="http://hydra-api.com/entrypoint"
              value={url}
              onKeyPress={this.handleKeyPress.bind(this)}
              onChange={this.handleOnChange.bind(this)}
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
