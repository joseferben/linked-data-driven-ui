import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HydraResource, IOperation } from "alcaeus/types/Resources";
import { Grid, Card, Label, Divider, Button } from "semantic-ui-react";
import { observable, IObservableObject } from "mobx";
import { observer } from "mobx-react";

import { refreshObservable } from "../../../../observable";
import { Operation } from "../../types";
import HydraRenderer from "../..";

type Status = { name: string; color: "grey" | "orange" | "yellow" | "green" };
const statusList: Status[] = [
  { name: "Backlog", color: "grey" },
  { name: "Ready", color: "orange" },
  { name: "In process", color: "yellow" },
  { name: "Done", color: "green" }
];
type Issue = {
  id: string;
  "https://schema.org/status": string;
  "https://schema.org/title": string;
  "https://schema.org/description": string;
  "https://schema.org/memberOf": HydraResource;
} & HydraResource;

type IssueByStatus = { [index: string]: Issue[] };

type State = { issues: IssueByStatus } & IObservableObject;
const state: State = observable({
  issues: {}
});
const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  margin: "0 0 5px 0",
  userSelect: "none",
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  height: "400px"
});

const removeIssue = (state: State, id: string) => {
  Object.keys(state.issues).map(status => {
    state.issues[status] = state.issues[status].filter(
      issue => issue.id !== id
    );
  });
};

class IssueCard extends React.Component<{ issue: Issue }, any> {
  constructor(props: any) {
    super(props);
    this.state = { loading: false };
  }

  handleInvoke(operation: Operation, data?: any) {
    removeIssue(state, operation._resource.id);
    this.setState({ loading: true });
    operation
      .invoke(JSON.stringify(data))
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(reason => {
        console.error(reason.message);
        this.setState({ loading: false });
      });
  }

  render() {
    const { issue } = this.props;
    const deleteOperation = issue.operations.find(
      o => o.method === "DELETE"
    ) as Operation | undefined;
    return (
      <Card>
        <Card.Content>
          <Card.Header>{issue["https://schema.org/title"]}</Card.Header>
          <Card.Description>
            {issue["https://schema.org/description"]}
          </Card.Description>
        </Card.Content>
        {deleteOperation ? (
          <Card.Content extra>
            <div className="ui one buttons">
              <Button
                basic
                loading={this.state.loading}
                onClick={() => this.handleInvoke.bind(this)(deleteOperation)}
                color="red"
              >
                Delete
              </Button>
            </div>
          </Card.Content>
        ) : null}
      </Card>
    );
  }
}

const StatusHeader = ({ status }: { status: Status }) => {
  return <Label color={status.color}>{status.name}</Label>;
};

class StatusGroup extends React.Component<
  { status: string; index: number; issues: Issue[] },
  any
> {
  render() {
    const { status, issues = [], index } = this.props;
    return (
      <Droppable droppableId={`droppable-${status}`}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {issues.map((issue, index) => (
              <Draggable key={issue.id} draggableId={issue.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <IssueCard issue={issue} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

export const Kanban = observer(
  class extends React.Component<
    { resource: any; renderer: (resource: any) => JSX.Element },
    any
  > {
    componentDidMount() {
      const { resource } = this.props;
      state.issues = resource.members.reduce(
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
    }
    render() {
      return (
        <Grid columns={4}>
          <Grid.Row>
            <DragDropContext
              onDragEnd={evt => {
                console.log("dropped issue");
                console.log(evt);
              }}
            >
              {statusList.map((status, index) => (
                <Grid.Column key={status.name}>
                  <StatusHeader status={status} />
                  <Divider />
                  <StatusGroup
                    index={index}
                    status={status.name}
                    issues={state.issues[status.name]}
                  />
                </Grid.Column>
              ))}
            </DragDropContext>
          </Grid.Row>
        </Grid>
      );
    }
  }
);
