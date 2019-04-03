import express from "express";

import { baseUrl } from "../config";

const b = `${baseUrl}/iot`;

const rooms = [
  {
    "@id": `${b}/apartments/1/rooms/1`,
    "@type": ["Room", "Collection"],
    amenityFeature: "Kitchen",
    member: [
      {
        "@id": `${b}/apartments/1/rooms/1/thermometers/1`,
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 23
        }
      },
      {
        "@id": `${b}/apartments/1/rooms/1/thermostats/1`,
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
    "@id": `${b}/apartments/1/rooms/2`,
    "@type": "Room",
    amenityFeature: "Laundry Storage"
  },
  {
    "@id": `${b}/apartments/1/rooms/3`,
    "@type": "Room",
    amenityFeature: "1/2 Bath"
  },
  {
    "@id": `${b}/apartments/1/rooms/4`,
    "@type": "Room",
    amenityFeature: "Formal Living"
  },
  {
    "@id": `${b}/apartments/1/rooms/5`,
    "@type": ["Room", "Collection"],
    amenityFeature: "Entrance",
    member: {
      "@id": `${b}/apartments/1/rooms/5/thermometers/1`,
      "@type": "Thermometer",
      temperature: {
        "@type": "QuantitativeValue",
        unitText: "°C",
        value: 22.2
      }
    }
  },
  {
    "@id": `${b}/apartments/1/rooms/6`,
    "@type": ["Room", "Collection"],
    amenityFeature: "Family",
    member: [
      {
        "@id": `${b}/apartments/1/rooms/6/thermometers/1`,
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 22.2
        }
      },
      {
        "@id": `${b}/apartments/1/rooms/6/thermometers/1`,
        "@type": "Thermometer",
        temperature: {
          "@type": "QuantitativeValue",
          unitText: "°C",
          value: 22.3
        }
      },
      {
        "@id": `${b}/apartments/1/rooms/6/thermometers/1`,
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
    "@id": `${b}/apartments/1`,
    "@type": ["Apartment", "Collection"],
    hasMap: {
      "@type": "URL",
      image: `${b}/floorplan.jpg`
    },
    member: rooms,
    numberOfRooms: 6,
    petsAllowed: false,
    totalItems: "42"
  }
];

const iot = express.Router();

function jsonLdSetter(req: any, res: any, next: any) {
  res.set("Content-Type", "application/ld+json");
  next();
}

iot.get("/", jsonLdSetter, (_, res) => {
  res.send({
    "@context": `${b}/contexts/entry-point`,
    "@id": b,
    "@type": "EntryPoint",
    apartments: `${b}/apartments`
  });
});

iot.get("/contexts/global", jsonLdSetter, (_, res) => {
  res.send({ "@context": "http://www.w3.org/ns/hydra/context.jsonld" });
});

iot.get("/contexts/entry-point", jsonLdSetter, (_, res) => {
  res.send({
    "@context": {
      hydra: "http://www.w3.org/ns/hydra/core#",
      vocab: "http://www.markus-lanthaler.com/hydra/event-api/vocab#",
      EntryPoint: "vocab:EntryPoint",
      apartments: {
        "@id": "vocab:EntryPoint/apartments",
        "@type": "@id"
      }
    }
  });
});

iot.get("/apartments", jsonLdSetter, (req, res) =>
  res.send({
    "@context": `${b}/contexts/global`,
    "@id": `${b}/apartments`,
    "@type": "Collection",
    member: { "@id": `${b}/apartments/1` }
  })
);

iot.get("/apartments/1", jsonLdSetter, (req, res) => {
  res.send(apartments[0]);
});

iot.get("/apartments/1/rooms/1", jsonLdSetter, (req, res) =>
  res.send(rooms[0])
);
iot.get("/apartments/1/rooms/1/thermometers/1", jsonLdSetter, (req, res) =>
  res.send({
    "@id": `${b}/apartments/1/rooms/1/thermometers/1`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23
    }
  })
);
iot.get("/apartments/1/rooms/1/thermostats/1", jsonLdSetter, (req, res) =>
  res.send({
    "@id": `${b}/apartments/1/rooms/1/thermostats/1`,
    "@type": "Thermostat",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23
    }
  })
);
iot.get("/apartments/1/rooms/2", jsonLdSetter, (req, res) =>
  res.send(rooms[1])
);
iot.get("/apartments/1/rooms/3", jsonLdSetter, (req, res) =>
  res.send(rooms[2])
);
iot.get("/apartments/1/rooms/4", jsonLdSetter, (req, res) =>
  res.send(rooms[3])
);
iot.get("/apartments/1/rooms/5", jsonLdSetter, (req, res) =>
  res.send(rooms[4])
);
iot.get("/apartments/1/rooms/6", jsonLdSetter, (req, res) =>
  res.send(rooms[5])
);

export default iot;
