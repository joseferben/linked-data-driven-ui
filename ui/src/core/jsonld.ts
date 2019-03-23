import * as jsonld from "jsonld";
import schemaOrgContext from "./context-cache/schemaorgcontext.json";
import hydraContext from "./context-cache/hydracontext.json";
import { PreProcessedData } from "./types";

const CONTEXTS: { [key: string]: any } = {
  "http://schema.org": {
    "@context": schemaOrgContext
  },
  "http://www.w3.org/ns/hydra/context.jsonld": {
    "@context": hydraContext
  }
};

const nodeDocumentLoader = jsonld.documentLoaders.node();

const customLoader = (url: any, callback: any) => {
  console.log("Resolving url ", url)
  if (url in CONTEXTS) {
    return callback(
      null, {
        contextUrl: null,
        document: CONTEXTS[url],
        documentUrl: url
      });
  }
  nodeDocumentLoader(url, callback);
};

jsonld.documentLoader = customLoader;

export const frame = (
  data: any,
  frame?: any,
  opts?: object
): Promise<PreProcessedData> => {
  const frameToUse = frame ? frame : {
    "@context": data["@context"],
    "@type": "Apartment"
  };
  // { explicit: true } use that to only get selection
  const optsToUse = opts ? opts : { embed: true }
  return jsonld
    .frame(
      data,
      frameToUse,
      optsToUse
    )
    .catch((err: any) => {
      console.error("Failed to frame data: " + err.message);
    });
}

export const expand = (
  data: any
): Promise<object[]> => {
  return jsonld
    .expand(
      data
    )
    .catch((err: any) => {
      console.error("Failed to expand data: " + err.message);
    });
}
