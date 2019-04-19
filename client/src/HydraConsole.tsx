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
import { Hydra } from "./components/HydraRenderer/renderers/Hydra";

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
    id: "hydra",
    name: "Hydra",
    comp: Hydra,
    type: "http://www.w3.org/ns/hydra/core#Collection"
  },
  {
    id: "boldFont",
    name: "BoldFont",
    comp: BoldFont,
    type: "*"
  }
];

class HydraConsole extends React.Component<{ entryPoint: string }, any> {
  state = {
    url: "",
    rootResources: null,
    resource: null,
    selected: [],
    isLoading: false
  };

  handleKeyPress(evt: any) {
    if (evt.key == "Enter") {
      this.setState({ isLoading: true });
      client.loadResource(this.state.url).then(res => {
        this.setState({ resource: res.root });
        this.setState({ isLoading: false });
      });
    }
  }

  handleOnChange(evt: any) {
    this.setState({ url: evt.target.value });
  }

  componentDidMount() {
    if (location.hash.split("#")[1]) {
      client.loadResource(location.hash.split("#")[1]).then(res => {
        this.setState({ resource: res.root });
        this.setState({ isLoading: false });
      });
    }

    window.onhashchange = () => {
      this.setState({ url: location.hash.split("#")[1] || "" });
      this.setState({ isLoading: true });
      client.loadResource(this.state.url).then(res => {
        this.setState({ resource: res.root });
        this.setState({ isLoading: false });
        console.log(res.root);
      });
    };

    client.loadResource(this.props.entryPoint).then(res => {
      this.setState({ isLoading: true });
      Promise.all(Array.from(res).map(r => client.loadResource(r.id))).then(
        res => {
          const resources = res.map(resource => resource.root);
          this.setState({ rootResources: resources });
          this.setState({ isLoading: false });
        }
      );
    });
  }

  selectRenderers(renderers: any) {
    this.setState({ selected: renderers });
  }

  render() {
    const {
      state: { rootResources, resource, selected, url, isLoading }
    } = this;
    return (
      <Container style={{ marginTop: "3em" }}>
        <Header as="h1">Hydra console</Header>
        <Input
          loading={isLoading}
          fluid
          placeholder="http://hydra-api.com/entrypoint"
          value={url}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={this.handleOnChange.bind(this)}
        />
        <Divider />
        <Grid>
          <Grid.Column width={4}>
            <Header as="h3">Hydra resources</Header>
            <Menu vertical>
              {isDefined(rootResources) ? (
                (rootResources || [])
                  .filter(r => r !== null)
                  .map(r => (
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
