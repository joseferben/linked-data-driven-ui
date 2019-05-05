import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HydraResource } from "alcaeus/types/Resources";
import { Grid, Card, Label, Divider, Button } from "semantic-ui-react";

import { refreshObservable } from "../../../../observable";
import { Operation } from "../../types";

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

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  margin: "0 0 5px 0",
  userSelect: "none",
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({});

class IssueCard extends React.Component<{ issue: Issue }, any> {
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
    const { issue } = this.props;
    const deleteOperation = issue.operations.find(o => o.method === "DELETE");
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
      <Droppable droppableId={`droppable-${index}`}>
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
    return (
      <Grid columns={4}>
        <Grid.Row>
          <DragDropContext
            onDragEnd={() => {
              console.log("dropped issue");
            }}
          >
            {statusList.map((status, index) => (
              <Grid.Column key={status.name}>
                <StatusHeader status={status} />
                <Divider />

                <StatusGroup
                  index={index}
                  status={status.name}
                  issues={issues[status.name]}
                />
              </Grid.Column>
            ))}
          </DragDropContext>
        </Grid.Row>
      </Grid>
    );
  }
}
