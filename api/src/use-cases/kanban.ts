import express from "express";

import { baseUrl } from "../config";

const b = `${baseUrl}/kanban`;

const kanban = express.Router();

type Project = { name: string; issues: string[] };
type Issue = { status: IssueStatus; title: string; belongsTo: string };
enum IssueStatus {
  BACKLOG = "Backlog",
  READY = "Ready",
  IN_PROCESS = "In process",
  DONE = "Done"
}

const projects: { [key: string]: Project } = {
  "0": {
    name: "Accounting tool for Company X",
    issues: ["0", "1", "2", "3", "4"]
  }
};

const issues: { [key: string]: Issue } = {
  "0": {
    title: "Setup initial continuous delivery pipeline",
    status: IssueStatus.DONE,
    belongsTo: "0"
  },
  "1": {
    title: "Create spike to estimate integration with existing HR tool",
    status: IssueStatus.IN_PROCESS,
    belongsTo: "0"
  },
  "2": {
    title: "Evaluate orchestration tools",
    status: IssueStatus.IN_PROCESS,
    belongsTo: "0"
  },
  "3": {
    title: "Implement data exporter for current accounting tool",
    status: IssueStatus.READY,
    belongsTo: "0"
  },
  "4": {
    title: "Develop concept for migration of accounting data",
    status: IssueStatus.DONE,
    belongsTo: "0"
  }
};

function jsonLdSetter(req: any, res: any, next: any) {
  res.set("Content-Type", "application/ld+json");
  next();
}

function serializeProject(project: Project, id: string | number) {
  return {
    "@id": `${b}/projects/${id}`,
    "@type": ["Project", "Collection"],
    name: project.name,
    member: project.issues.map(i => ({ "@id": `${b}/issues/${i}` }))
  };
}

function serializeIssue(issue: Issue, id: string | number) {
  return {
    "@id": `${b}/issues/${id}`,
    "@type": "Issue",
    title: issue.title,
    status: issue.status,
    memberOf: { "@id": `${b}/projects/${issue.belongsTo}` },
    operation: [{ "@type": "Operation", method: "DELETE" }]
  };
}

const contexts: { [key: string]: any } = {
  EntryPoint: {
    "@context": {
      hydra: "http://www.w3.org/ns/hydra/core#",
      projects: {
        "@id": "hydra:EntryPoint/projects",
        "@type": "@id"
      },
      issues: {
        "@id": "hydra:EntryPoint/issues",
        "@type": "@id"
      }
    }
  },
  kanban: {
    "@context": [
      "http://www.w3.org/ns/hydra/context.jsonld",
      {
        title: "https://schema.org/title",
        name: "https://schema.org/name",
        status: "https://schema.org/status",
        memberOf: "https://schema.org/memberOf"
      }
    ],
    "@type": "ApiDocumentation",
    supportedClass: [{ "@type": "Issue" }]
  }
};

kanban.get("/", jsonLdSetter, (_, res) => {
  res.send({
    "@context": `${b}/contexts/EntryPoint`,
    "@id": b,
    "@type": "EntryPoint",
    projects: `${b}/projects`,
    issues: `${b}/issues`
  });
});

kanban.get("/contexts/EntryPoint", jsonLdSetter, (req, res) => {
  res.send(contexts.EntryPoint);
});

kanban.get("/contexts/:id", jsonLdSetter, (req, res) => {
  res.send(contexts.kanban);
});

kanban.get("/projects", jsonLdSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Project`,
    "@id": `${b}/projects`,
    "@type": "Collection",
    totalItems: projects.length,
    member: Object.keys(projects).map(k => serializeProject(projects[k], k))
  });
});

kanban.get("/projects/:id", jsonLdSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send({
    "@context": `${b}/contexts/Projects`,
    ...serializeProject(projects[id], id)
  });
});

kanban.get("/issues", jsonLdSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Issue`,
    "@id": `${b}/issues`,
    "@type": "Collection",
    totalItems: issues.length,
    member: Object.keys(issues).map(k => serializeIssue(issues[k], k))
  });
});

kanban.get("/issues/:id", jsonLdSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send({
    "@context": `${b}/contexts/Issues`,
    ...serializeIssue(issues[id], id)
  });
});

export default kanban;
