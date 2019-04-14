import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Renderer } from "../HydraRenderer/types";
import { Label, Segment, Header, Divider } from "semantic-ui-react";

const move = (
  source: any,
  destination: any,
  droppableSource: { index: number; droppableId: string | number },
  droppableDestination: { index: number; droppableId: string | number }
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: { [index: string]: any } = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: "none",
  padding: "5px",
  margin: `0 0 5px 0`,
  ...draggableStyle
});

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export class RendererSelection extends React.Component<
  {
    baseRenderer: any;
    renderers: any;
    selectRenderer: (renderers: Renderer[]) => any;
  },
  {}
> {
  state: { items: Renderer[]; selected: Renderer[]; [index: string]: any } = {
    items: this.props.renderers,
    selected: []
  };

  id2List: { droppable: string; droppable2: string; [index: string]: any } = {
    droppable: "items",
    droppable2: "selected"
  };

  getList = (id: any) => this.state[this.id2List[id]];

  onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      );

      if (source.droppableId === "droppable2") {
        this.setState({ selected: items });
      } else {
        this.setState({ items: items });
      }
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      );

      this.props.selectRenderer(result.droppable2);
      this.setState({
        items: result.droppable,
        selected: result.droppable2
      });
    }
  };
  render() {
    const { baseRenderer } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef}>
              <Segment style={{ minHeight: "100px" }}>
                <Header as="h3" dividing>
                  Available renderers
                </Header>
                {this.state.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        <Label>{item.name}</Label>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Segment>
            </div>
          )}
        </Droppable>
        <Divider />
        <Droppable droppableId="droppable2">
          {provided => (
            <div ref={provided.innerRef}>
              <Segment style={{ minHeight: "150px" }}>
                <Header as="h3" dividing>
                  Active renderers
                </Header>
                <div style={getItemStyle(false, false)}>
                  <Label color="teal">{baseRenderer.name}</Label>
                </div>
                {this.state.selected.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        <Label>{item.name}</Label>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Segment>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
