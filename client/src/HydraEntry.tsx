import React from "react";
import { Container, Header, Input } from "semantic-ui-react";

import HydraConsole from "./HydraConsole";

export default class HydraEntry extends React.Component {
  state = {
    entryPoint: "http://localhost:3000/kanban",
    entered: false
  };

  handleKeyPress(evt: any) {
    if (evt.key == "Enter") {
      this.setState({ entered: true });
      location.hash = "";
    }
  }

  handleOnChange(evt: any) {
    this.setState({ entryPoint: evt.target.value });
  }

  render() {
    let comp = (
      <Container style={{ marginTop: "3em" }}>
        <Header as="h1">Hydra API Entry point</Header>
        <Input
          fluid
          icon="angle right"
          placeholder="http://localhost:3000/iot"
          value={this.state.entryPoint}
          onKeyPress={this.handleKeyPress.bind(this)}
          onChange={this.handleOnChange.bind(this)}
        />
      </Container>
    );
    if (this.state.entryPoint !== "" && this.state.entered) {
      comp = <HydraConsole entryPoint={this.state.entryPoint} />;
    }

    return comp;
  }
}
