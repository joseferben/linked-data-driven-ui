import express from "express";

import { baseUrl } from "../config";

const b = `${baseUrl}/iot`;

const thermometers = [
  {
    "@id": `${b}/thermometers/0`,
    "@type": ["Thermometer", "Place"],
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23.0
    },
    containedInPlace: `${b}/rooms/0`
  },
  {
    "@id": `${b}/thermometers/1`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23.5
    },
    containedInPlace: `${b}/rooms/1`
  },
  {
    "@id": `${b}/thermometers/2`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23.1
    },
    containedInPlace: `${b}/rooms/2`
  },
  {
    "@id": `${b}/thermometers/3`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 22.0
    },
    containedInPlace: `${b}/rooms/3`
  },
  {
    "@id": `${b}/thermometers/4`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 23.5
    },
    containedInPlace: `${b}/rooms/5`
  },
  {
    "@id": `${b}/thermometers/5`,
    "@type": "Thermometer",
    temperature: {
      "@type": "QuantitativeValue",
      unitText: "°C",
      value: 24.1
    },
    containedInPlace: `${b}/rooms/5`
  }
];

const rooms = [
  {
    "@id": `${b}/rooms/0`,
    "@type": "Room",
    amenityFeature: "Kitchen",
    containsPlace: [thermometers[0], thermometers[1], thermometers[2]],
    containedInPlace: `${b}/apartments/0`
  },
  {
    "@id": `${b}/rooms/1`,
    "@type": "Room",
    amenityFeature: "Laundry Storage",
    containedInPlace: `${b}/apartments/0`
  },
  {
    "@id": `${b}/rooms/2`,
    "@type": "Room",
    amenityFeature: "1/2 Bath",
    containedInPlace: `${b}/apartments/0`
  },
  {
    "@id": `${b}/rooms/3`,
    "@type": "Room",
    amenityFeature: "Formal Living",
    containedInPlace: `${b}/apartments/0`
  },
  {
    "@id": `${b}/rooms/4`,
    "@type": "Room",
    amenityFeature: "Entrance",
    containsPlace: [thermometers[3]],
    containedInPlace: `${b}/apartments/0`
  },
  {
    "@id": `${b}/rooms/5`,
    "@type": "Room",
    amenityFeature: "Family",
    containsPlace: [thermometers[4], thermometers[5]],
    containedInPlace: `${b}/apartments/0`
  }
];

const apartments = [
  {
    "@id": `${b}/apartments/0`,
    "@type": "Apartment",
    hasMap: {
      "@type": "URL",
      image: `${b}/floorplan.jpg`
    },
    containsPlace: rooms,
    numberOfRooms: 6,
    petsAllowed: false
  }
];

const contexts: { [key: string]: any } = {
  EntryPoint: {
    "@context": {
      hydra: "http://www.w3.org/ns/hydra/core#",
      apartments: {
        "@id": "hydra:EntryPoint/apartments",
        "@type": "@id"
      },
      rooms: {
        "@id": "hydra:EntryPoint/rooms",
        "@type": "@id"
      },
      thermometers: {
        "@id": "hydra:EntryPoint/thermometers",
        "@type": "@id"
      }
    }
  },
  Apartment: { "@context": "http://www.w3.org/ns/hydra/context.jsonld" },
  Room: { "@context": "http://www.w3.org/ns/hydra/context.jsonld" },
  Thermometer: { "@context": "http://www.w3.org/ns/hydra/context.jsonld" }
};

const iot = express.Router();

function jsonLdSetter(req: any, res: any, next: any) {
  res.set("Content-Type", "application/ld+json");
  next();
}

iot.get("/", jsonLdSetter, (_, res) => {
  res.send({
    "@context": `${b}/contexts/EntryPoint`,
    "@id": b,
    "@type": "EntryPoint",
    apartments: `${b}/apartments`,
    rooms: `${b}/rooms`,
    thermometers: `${b}/thermometers`
  });
});

iot.get("/contexts/:id", jsonLdSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send(contexts[id]);
});

iot.get("/contexts/entry-point", jsonLdSetter, (_, res) => {
  res.send({
    "@context": {
      hydra: "http://www.w3.org/ns/hydra/core#",
      apartments: {
        "@id": "hydra:EntryPoint/apartments",
        "@type": "@id"
      },
      rooms: {
        "@id": "hydra:EntryPoint/rooms",
        "@type": "@id"
      },
      thermometers: {
        "@id": "hydra:EntryPoint/thermometers",
        "@type": "@id"
      }
    }
  });
});

iot.get("/apartments/0", jsonLdSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Apartment`,
    ...apartments[0]
  });
});

iot.get("/rooms/:id", jsonLdSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send({
    "@context": `${b}/contexts/Room`,
    ...rooms[id]
  });
});

iot.get("/thermometers/:id", jsonLdSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send({
    "@context": `${b}/contexts/Thermometer`,
    ...thermometers[id]
  });
});

iot.get("/apartments", jsonLdSetter, (req, res) =>
  res.send({
    "@context": `${b}/contexts/Apartment`,
    "@id": `${b}/apartments`,
    "@type": "Collection",
    totalItems: 1,
    member: [{ "@id": `${b}/apartments/0` }]
  })
);

iot.get("/rooms", jsonLdSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Room`,
    "@id": `${b}/rooms`,
    "@type": "Collection",
    totalItems: 6,
    member: rooms
  });
});

iot.get("/thermometers", jsonLdSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Thermometer`,
    "@id": `${b}/thermometers`,
    "@type": "Collection",
    totalItems: 6,
    member: thermometers
  });
});

export default iot;
