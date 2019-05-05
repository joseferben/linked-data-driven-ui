import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HydraResource } from "alcaeus/types/Resources";

const statusList = ["Backlog", "Ready", "In process", "Done"];
type Issue = {
  "https://schema.org/status": string;
  "https://schema.org/title": string;
  "https://schema.org/memberOf": HydraResource;
};
type IssueByStatus = { [index: string]: Issue[] };

class StatusGroup extends React.Component<
  { status: string; issues: Issue[] },
  any
> {
  render() {
    const { status } = this.props;
    return <span>{status}</span>;
  }
}

export class Kanban extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const issues = resource.members.reduce(
      (res: IssueByStatus, issue: Issue) => {
        const status = issue["https://schema.org/status"];
        if (res[status]) {
          res[status].push(issue);
        } else {
          res[status] = [issue];
        }
        return res;
      },
      {}
    );
    console.log(issues);
    return Object.keys(issues).map(status => (
      <StatusGroup status={status} issues={issues[status]} />
    ));
  }
}
