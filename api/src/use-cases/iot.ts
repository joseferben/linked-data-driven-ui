import express from "express";

import { baseUrl } from "../config";

const context = {
  "@context": [
    "http://schema.org",
    "http://www.w3.org/ns/hydra/context.jsonld",
    {
      "@base": `${baseUrl}/iot`
    }
  ]
};

const rooms = [
  {
    "@id": "/apartments/1/rooms/1",
    "@type": ["Room", "Collection"],
    amenityFeature: "Kitchen",
    member: [
      {
        "@id": "/apartments/1/rooms/1/thermometer/1",
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 23
        }
      },
      {
        "@id": "/apartments/1/rooms/1/thermostat/1",
        "@type": "Thermostat",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 23
        }
      }
    ]
  },
  {
    "@id": "/apartments/1/rooms/2",
    "@type": "Room",
    amenityFeature: "Laundry Storage"
  },
  {
    "@id": "/apartments/1/rooms/3",
    "@type": "Room",
    amenityFeature: "1/2 Bath"
  },
  {
    "@id": "/apartments/1/rooms/4",
    "@type": "Room",
    amenityFeature: "Formal Living"
  },
  {
    "@id": "/apartments/1/rooms/5",
    "@type": ["Room", "Collection"],
    amenityFeature: "Entrance",
    member: {
      "@id": "/apartments/1/rooms/5/thermometer/1",
      "@type": "Thermometer",
      temperature: {
        "@type": "QuantitativeValue",
        unitText: "°C",
        value: 22.2
      }
    }
  },
  {
    "@id": "/apartments/1/rooms/6",
    "@type": ["Room", "Collection"],
    amenityFeature: "Family",
    member: [
      {
        "@id": "/apartments/1/rooms/6/thermometer/1",
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 22.2
        }
      },
      {
        "@id": "/apartments/1/rooms/6/thermometer/1",
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 22.3
        }
      },
      {
        "@id": "/apartments/1/rooms/6/thermometer/1",
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 22.8
        }
      }
    ]
  }
];

const apartments = [
  {
    "@context": context,
    "@id": "/apartments/1",
    "@type": ["Apartment", "Collection"],
    hasMap: {
      "@type": "URL",
      image: "/floorplan.jpg"
    },
    member: rooms,
    numberOfRooms: 6,
    petsAllowed: false,
    totalItems: "42"
  }
];

const iot = express.Router();

iot.get("/apartments", (req, res) =>
  res.json({
    "@context": context,
    "@id": "/apartments",
    "@type": "Collection",
    member: { "@id": "/apartments/1" }
  })
);

iot.get("/apartments/1", (req, res) => {
  res.json(apartments[0]);
});
iot.get("/apartments/1/rooms/1", (req, res) => res.json(rooms[0]));
iot.get("/apartments/1/rooms/1/thermometers/1", (req, res) =>
  res.json({
    "@id": "/apartments/1/rooms/1/thermometer/1",
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23
    }
  })
);
iot.get("/apartments/1/rooms/1/thermostats/1", (req, res) =>
  res.json({
    "@id": "/apartments/1/rooms/1/thermostat/1",
    "@type": "Thermostat",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23
    }
  })
);
iot.get("/apartments/1/rooms/2", (req, res) => res.json(rooms[1]));
iot.get("/apartments/1/rooms/3", (req, res) => res.json(rooms[2]));
iot.get("/apartments/1/rooms/4", (req, res) => res.json(rooms[3]));
iot.get("/apartments/1/rooms/5", (req, res) => res.json(rooms[4]));
iot.get("/apartments/1/rooms/6", (req, res) => res.json(rooms[5]));

export default iot;
