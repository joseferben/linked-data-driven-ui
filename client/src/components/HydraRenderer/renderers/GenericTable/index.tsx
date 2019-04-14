import React from "react";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

const isLink = (path: string) =>
  path.includes("http://") || path.includes("https://");

const Row = (props: any) => {
  const { data, keys } = props;
  return (
    <Table.Row>
      {keys.map((k: any) => (
        <Table.Cell key={k}>
          {isLink(data[k]) ? <a href={"#" + data[k]}>{data[k]}</a> : data[k]}
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

export class GenericTable extends React.Component<
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
      return typeof member[0][k] !== "object" && k !== "@type";
    });
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            {keys.map((k: any) => {
              const label = k.split("/").pop();
              return <Table.HeaderCell key={k}>{label}</Table.HeaderCell>;
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
