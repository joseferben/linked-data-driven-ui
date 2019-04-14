import React from "react";

const PositionedRoom = (props: any) => {
  const { xPos, yPos, renderer, data } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: `${xPos}%`,
        top: `${yPos}%`
      }}
    >
      {renderer(data)}
    </div>
  );
};

const coords = (resource: any) => {
  const {
    "https://schema.org/GeoCoordinates": {
      "https://schema.org/longitude": long,
      "https://schema.org/latitude": lat
    }
  } = resource;
  return [long, lat];
};

export class Apartment extends React.Component<
  { resource: any; renderer: (resource: any) => JSX.Element },
  {}
> {
  render() {
    const { resource, renderer } = this.props;
    const {
      "https://schema.org/hasMap": { "@id": floorPlan }
    } = resource;
    const [longitude, latitude] = coords(resource);
    const apartmentWidth = longitude * 2;
    const apartmentHeight = latitude * 2;
    const { "https://schema.org/containsPlace": rooms } = resource;
    return (
      <div>
        <img src={floorPlan} style={{ position: "absolute" }} />
        {rooms.map((r: any) => {
          const [roomLongitude, roomLatitude] = coords(r);
          const xPos = (roomLongitude / apartmentWidth) * 100;
          const yPos = (roomLatitude / apartmentHeight) * 100;
          return (
            <PositionedRoom
              renderer={renderer}
              data={r}
              key={r["@id"]}
              xPos={xPos}
              yPos={yPos}
            />
          );
        })}
      </div>
    );
  }
}
