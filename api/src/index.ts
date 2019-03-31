import express from "express";
const app = express();

const context = {
  "@context": [
    "http://schema.org/",
    "http://www.w3.org/ns/hydra/context.jsonld"
  ]
};

app.get("/iot/", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments", (req, res) =>
  res.json({
    "@context": context,
    "@id": "https://lddui.erben.sh/apartments",
    "@type": ["Apartment", "Collection"],
    hasMap: {
      "@type": "URL",
      image: "https://lddui.erben.sh/apartments/assets/floorplan.jpg"
    },
    member: [
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/1"
      },
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/2"
      },
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/3"
      },
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/4"
      },
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/5"
      },
      {
        "@id": "https://lddui.erben.sh/apartments/rooms/6"
      }
    ]
  })
);

app.get("/iot/apartments/1", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/1", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/1/thermometers", (req, res) =>
  res.send("Hello World!")
);
app.get("/iot/apartments/1/rooms/1/thermometers/1", (req, res) =>
  res.send("Hello World!")
);
app.get("/iot/apartments/1/rooms/1/thermostats", (req, res) =>
  res.send("Hello World!")
);
app.get("/iot/apartments/1/rooms/1/thermostats/1", (req, res) =>
  res.send("Hello World!")
);
app.get("/iot/apartments/1/rooms/2", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/3", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/4", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/5", (req, res) => res.send("Hello World!"));
app.get("/iot/apartments/1/rooms/6", (req, res) => res.send("Hello World!"));

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(3000, () => console.log("Example app listening on port 3000!"));
