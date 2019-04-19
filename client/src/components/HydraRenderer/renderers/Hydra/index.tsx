import React from "react";
import { Button, Label, Table } from "semantic-ui-react";

const HYDRA_OPERATIONS = "http://www.w3.org/ns/hydra/core#operation";

const isLink = (path: string) => {
  if (!path || typeof path !== "string") {
    return false;
  }
  return path.includes("http://") || path.includes("https://");
};

const Method = (props: any) => {
  const { method } = props;
  const methods: { [index: string]: JSX.Element } = {
    DELETE: (
      <Button color="red" size="tiny">
        Delete
      </Button>
    )
  };
  return methods[method] ? (
    methods[method]
  ) : (
    <Button size="tiny" primary>
      {method}
    </Button>
  );
};

const Row = (props: any) => {
  const { data, keys } = props;
  return (
    <Table.Row>
      {keys.map((k: any) => {
        let comp;
        if (isLink(data[k])) {
          comp = <a href={"#" + data[k]}>{data[k]}</a>;
        } else if (k === HYDRA_OPERATIONS) {
          comp = data[k].method;
          comp = <Method method={data[k].method} />;
        } else {
          comp = data[k];
        }
        return <Table.Cell key={k}>{comp}</Table.Cell>;
      })}
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
    const { resource, renderer } = this.props;
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
    const labels = keysToLabels(keys);
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
