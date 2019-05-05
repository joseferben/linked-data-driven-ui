import express from "express";

import { hydra } from "../hydra-context";
import { baseUrl } from "../config";

const b = `${baseUrl}/iot`;

const thermometers = [
  {
    "@id": `${b}/thermometers/0`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/0/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "23.0"
    },
    containedInPlace: `${b}/rooms/0`
  },
  {
    "@id": `${b}/thermometers/1`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/1/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "22.2"
    },
    containedInPlace: `${b}/rooms/1`
  },
  {
    "@id": `${b}/thermometers/2`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/2/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "22.8"
    },
    containedInPlace: `${b}/rooms/2`
  },
  {
    "@id": `${b}/thermometers/3`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/3/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "23.1"
    },
    containedInPlace: `${b}/rooms/3`
  },
  {
    "@id": `${b}/thermometers/4`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/4/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "23.5"
    },
    containedInPlace: `${b}/rooms/5`
  },
  {
    "@id": `${b}/thermometers/5`,
    "@type": ["Thermometer", "https://schema.org/Place"],
    additionalProperty: {
      "@id": `${b}/thermometers/5/temp`,
      "@type": "https://schema.org/PropertyValue",
      name: "Temperature",
      value: "21.8"
    },
    containedInPlace: `${b}/rooms/5`
  }
];

const rooms = [
  {
    "@id": `${b}/rooms/0`,
    "@type": "https://schema.org/Room",
    amenityFeature: "Kitchen",
    containsPlace: [thermometers[0], thermometers[1], thermometers[2]],
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 3,
      latitude: 3
    }
  },
  {
    "@id": `${b}/rooms/1`,
    "@type": "https://schema.org/Room",
    amenityFeature: "Laundry Storage",
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 2,
      latitude: 9
    }
  },
  {
    "@id": `${b}/rooms/2`,
    "@type": "https://schema.org/Room",
    amenityFeature: "1/2 Bath",
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 5,
      latitude: 11
    }
  },
  {
    "@id": `${b}/rooms/3`,
    "@type": "https://schema.org/Room",
    amenityFeature: "Formal Living",
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 12,
      latitude: 6
    }
  },
  {
    "@id": `${b}/rooms/4`,
    "@type": "https://schema.org/Room",
    amenityFeature: "Entrance",
    containsPlace: [thermometers[3]],
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 8,
      latitude: 10
    }
  },
  {
    "@id": `${b}/rooms/5`,
    "@type": "https://schema.org/Room",
    amenityFeature: "Family",
    containsPlace: [thermometers[4], thermometers[5]],
    containedInPlace: `${b}/apartments/0`,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 14,
      latitude: 10
    }
  }
];

const apartments = [
  {
    "@id": `${b}/apartments/0`,
    "@type": "https://schema.org/Apartment",
    hasMap: {
      "@type": "https://schema.org/URL",
      "@id": `${b}/floorplan.jpg`
    },
    containsPlace: rooms,
    numberOfRooms: 6,
    petsAllowed: false,
    geo: {
      "@type": "https://schema.org/GeoCoordinates",
      longitude: 10,
      latitude: 7
    }
  }
];

const contexts: { [key: string]: any } = {
  EntryPoint: {
    "@context": [
      hydra,
      {
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
    ]
  },
  iot: {
    "@context": [
      hydra,
      {
        containsPlace: "https://schema.org/containsPlace",
        hasMap: "https://schema.org/hasMap",
        image: "https://schema.org/image",
        numberOfRooms: "https://schema.org/numberOfRooms",
        petsAllowed: "https://schema.org/petsAllowed",
        amenityFeature: "https://schema.org/amenityFeature",
        containedInPlace: "https://schema.org/containedInPlace",
        additionalProperty: "https://schema.org/additionalProperty",
        name: "https://schema.org/name",
        value: "https://schema.org/value",
        geo: "https://schema.org/GeoCoordinates",
        longitude: "https://schema.org/longitude",
        latitude: "https://schema.org/latitude"
      }
    ]
  }
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

iot.get("/contexts/EntryPoint", jsonLdSetter, (_, res) => {
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

iot.get("/contexts/:id", jsonLdSetter, (req, res) => {
  res.send(contexts.iot);
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

iot.get("/thermometers/:id/temp", jsonLdSetter, (req, res) => {
  //TODO
  res.send({});
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
