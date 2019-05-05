import React from "react";
import { Button, Label, Table } from "semantic-ui-react";
import { HydraResource, SupportedOperation } from "alcaeus/types/Resources";
import { refreshObservable } from "../../../../observable";

const HYDRA_OPERATIONS = "http://www.w3.org/ns/hydra/core#operation";

type Operation = {
  method: "DELETE" | "POST" | "PUT";
  description: string;
  expects: any;
  requiresInput: boolean;
  returns: any;
  title: string;
  _resource: HydraResource;
  _supportedOperation: SupportedOperation;
  invoke: (data?: any) => Promise<any>;
};

const isLink = (path: string) => {
  if (!path || typeof path !== "string") {
    return false;
  }
  return path.includes("http://") || path.includes("https://");
};

class OperationComp extends React.Component<{ operation: Operation }, any> {
  constructor(props: any) {
    super(props);
    this.state = { loading: false };
  }

  handleInvoke(operation: Operation, data?: any) {
    this.setState({ loading: true });
    operation
      .invoke(JSON.stringify(data))
      .then(() => {
        return refreshObservable.refreshFn().then(() => {
          this.setState({ loading: false });
        });
      })
      .catch(reason => {
        console.error(reason.message);
        this.setState({ loading: false });
      });
  }

  render() {
    const { operation } = this.props;
    if (operation.method === "DELETE") {
      return (
        <Button
          compact
          loading={this.state.loading}
          onClick={() => this.handleInvoke.bind(this)(operation)}
          color="red"
          size="tiny"
        >
          Delete
        </Button>
      );
    } else {
      return (
        <Button
          compact
          loading={this.state.loading}
          onClick={() =>
            this.handleInvoke.bind(this)(operation, operation.expects)
          }
          size="tiny"
        >
          {operation.title}
        </Button>
      );
    }
  }
}

const Operations = (props: any) => {
  const { operations } = props;
  return (
    <Button.Group vertical>
      {operations.map((operation: Operation, idx: number) => {
        return <OperationComp operation={operation} key={idx} />;
      })}
    </Button.Group>
  );
};

const Row = (props: any) => {
  const { data, keys } = props;
  let hasOperations = false;
  try {
    hasOperations = data.operations != null;
  } catch (e) {
    hasOperations = false;
  }
  return (
    <Table.Row>
      {keys.map((k: any) => {
        let comp;
        if (isLink(data[k])) {
          comp = <a href={"#" + data[k]}>{data[k]}</a>;
        } else {
          comp = data[k];
        }
        return <Table.Cell key={k}>{comp}</Table.Cell>;
      })}
      {hasOperations ? (
        <Table.Cell>
          <Operations operations={data.operations} />
        </Table.Cell>
      ) : null}
    </Table.Row>
  );
};

const keysToLabels = (keys: string[]): string[] => {
  return keys
    .sort((a: any, b: any) => {
      if (a === "@id") {
        return -1;
      }
      if (b === "@id") {
        return 1;
      }
      if (a === HYDRA_OPERATIONS) {
        return 1;
      }
      return -1;
    })
    .map(k => {
      if (k === HYDRA_OPERATIONS) {
        return "Operation";
      } else if (k === "@id") {
        return "Id";
      } else {
        return k.split("/").pop() || "";
      }
    });
};

export class Hydra extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource } = this.props;
    const {
      "http://www.w3.org/ns/hydra/core#member": memberElement = []
    } = resource;
    const member = Array.isArray(memberElement)
      ? memberElement
      : [memberElement];
    const keys = Object.keys(member[0] || {}).filter(k => {
      return (
        HYDRA_OPERATIONS === k ||
        (typeof member[0][k] !== "object" && k !== "@type")
      );
    });
    const labels = [...keysToLabels(keys), "Operations"];
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            {labels.map((label: any) => {
              return (
                <Table.HeaderCell
                  style={{ textTransform: "capitalize" }}
                  key={label}
                >
                  {label}
                </Table.HeaderCell>
              );
            })}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {member.map((m: any) => (
            <Row key={m["@id"]} keys={keys} data={m} />
          ))}
        </Table.Body>
      </Table>
    );
  }
}
