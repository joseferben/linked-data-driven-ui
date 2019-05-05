export const hydra = {
  hydra: "http://www.w3.org/ns/hydra/core#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  owl: "http://www.w3.org/2002/07/owl#",
  vs: "http://www.w3.org/2003/06/sw-vocab-status/ns#",
  dc: "http://purl.org/dc/terms/",
  cc: "http://creativecommons.org/ns#",
  schema: "http://schema.org/",
  apiDocumentation: "hydra:apiDocumentation",
  ApiDocumentation: "hydra:ApiDocumentation",
  title: "hydra:title",
  description: "hydra:description",
  entrypoint: {
    "@id": "hydra:entrypoint",
    "@type": "@id"
  },
  supportedClass: {
    "@id": "hydra:supportedClass",
    "@type": "@vocab"
  },
  Class: "hydra:Class",
  supportedProperty: {
    "@id": "hydra:supportedProperty",
    "@type": "@id"
  },
  SupportedProperty: "hydra:SupportedProperty",
  property: {
    "@id": "hydra:property",
    "@type": "@vocab"
  },
  required: "hydra:required",
  readable: "hydra:readable",
  writeable: "hydra:writeable",
  supportedOperation: {
    "@id": "hydra:supportedOperation",
    "@type": "@id"
  },
  Operation: "hydra:Operation",
  method: "hydra:method",
  expects: {
    "@id": "hydra:expects",
    "@type": "@vocab"
  },
  returns: {
    "@id": "hydra:returns",
    "@type": "@vocab"
  },
  possibleStatus: {
    "@id": "hydra:possibleStatus",
    "@type": "@id"
  },
  Status: "hydra:Status",
  statusCode: "hydra:statusCode",
  Error: "hydra:Error",
  Resource: "hydra:Resource",
  operation: "hydra:operation",
  Collection: "hydra:Collection",
  collection: "hydra:collection",
  member: {
    "@id": "hydra:member",
    "@type": "@id"
  },
  manages: "hydra:manages",
  subject: {
    "@id": "hydra:subject",
    "@type": "@vocab"
  },
  object: {
    "@id": "hydra:object",
    "@type": "@vocab"
  },
  search: "hydra:search",
  freetextQuery: "hydra:freetextQuery",
  view: {
    "@id": "hydra:view",
    "@type": "@id"
  },
  PartialCollectionView: "hydra:PartialCollectionView",
  totalItems: "hydra:totalItems",
  first: {
    "@id": "hydra:first",
    "@type": "@id"
  },
  last: {
    "@id": "hydra:last",
    "@type": "@id"
  },
  next: {
    "@id": "hydra:next",
    "@type": "@id"
  },
  previous: {
    "@id": "hydra:previous",
    "@type": "@id"
  },
  Link: "hydra:Link",
  TemplatedLink: "hydra:TemplatedLink",
  IriTemplate: "hydra:IriTemplate",
  template: "hydra:template",
  Rfc6570Template: "hydra:Rfc6570Template",
  variableRepresentation: {
    "@id": "hydra:variableRepresentation",
    "@type": "@vocab"
  },
  VariableRepresentation: "hydra:VariableRepresentation",
  BasicRepresentation: "hydra:BasicRepresentation",
  ExplicitRepresentation: "hydra:ExplicitRepresentation",
  mapping: "hydra:mapping",
  IriTemplateMapping: "hydra:IriTemplateMapping",
  variable: "hydra:variable",
  offset: {
    "@id": "hydra:offset",
    "@type": "xsd:nonNegativeInteger"
  },
  limit: {
    "@id": "hydra:limit",
    "@type": "xsd:nonNegativeInteger"
  },
  pageIndex: {
    "@id": "hydra:pageIndex",
    "@type": "xsd:nonNegativeInteger"
  },
  pageReference: {
    "@id": "hydra:pageReference"
  },
  defines: {
    "@reverse": "rdfs:isDefinedBy"
  },
  comment: "rdfs:comment",
  label: "rdfs:label",
  preferredPrefix: "http://purl.org/vocab/vann/preferredNamespacePrefix",
  "cc:license": {
    "@type": "@id"
  },
  "cc:attributionURL": {
    "@type": "@id"
  },
  domain: {
    "@id": "rdfs:domain",
    "@type": "@vocab"
  },
  range: {
    "@id": "rdfs:range",
    "@type": "@vocab"
  },
  subClassOf: {
    "@id": "rdfs:subClassOf",
    "@type": "@vocab"
  },
  subPropertyOf: {
    "@id": "rdfs:subPropertyOf",
    "@type": "@vocab"
  },
  seeAlso: {
    "@id": "rdfs:seeAlso",
    "@type": "@id"
  },
  domainIncludes: {
    "@id": "schema:domainIncludes",
    "@type": "@id"
  }
};
