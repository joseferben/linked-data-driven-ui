import express, { Request, Response } from "express";

import { hydra } from "../hydra-context";
import { baseUrl } from "../config";
import { NextFunction } from "express-serve-static-core";

const b = `${baseUrl}/kanban`;

const kanban = express.Router();

type Project = { name: string; issues: string[] };
type Issue = {
  status: IssueStatus;
  title: string;
  belongsTo: string;
  description: string;
};
enum IssueStatus {
  BACKLOG = "Backlog",
  READY = "Ready",
  IN_PROCESS = "In process",
  DONE = "Done"
}

const operationToStatus: { [index: string]: IssueStatus } = {
  IssueToReadyUpdate: IssueStatus.READY,
  IssueToInProcessUpdate: IssueStatus.IN_PROCESS,
  IssueToDoneUpdate: IssueStatus.DONE
};

const projects: { [key: string]: Project } = {
  "0": {
    name: "Accounting tool for Company X",
    issues: ["0", "1", "2", "3", "4"]
  }
};

const issues: { [key: string]: Issue } = {
  "0": {
    title: "Setup CD",
    description: "Setup initial continuous delivery pipeline.",
    status: IssueStatus.BACKLOG,
    belongsTo: "0"
  },
  "1": {
    title: "Integrate HR tool",
    description: "Create spike to estimate integration with existing HR tool.",
    status: IssueStatus.IN_PROCESS,
    belongsTo: "0"
  },
  "2": {
    title: "Container orchestration",
    description: "Evaluate orchestration tools.",
    status: IssueStatus.IN_PROCESS,
    belongsTo: "0"
  },
  "3": {
    title: "Export accounting data",
    description: "Implement data exporter for current accounting tool.",
    status: IssueStatus.READY,
    belongsTo: "0"
  },
  "4": {
    title: "Migrate accounting data",
    description: "Develop concept for migration of accounting data.",
    status: IssueStatus.DONE,
    belongsTo: "0"
  }
};

function jsonldSetter(req: Request, res: Response, next: NextFunction) {
  res.set("Content-Type", "application/ld+json");
  next();
}

const apiDocSetter = (req: Request, res: Response, next: NextFunction) => {
  res.set("Access-Control-Expose-Headers", "Link");
  res.set(
    "Link",
    `<${b}/doc>; rel="http://www.w3.org/ns/hydra/core#apiDocumentation"`
  );
  next();
};

function serializeProject(project: Project, id: string | number) {
  return {
    "@id": `${b}/projects/${id}`,
    "@type": ["Project", "Collection"],
    name: project.name,
    member: project.issues.map(i => ({ "@id": `${b}/issues/${i}` }))
  };
}

function serializeIssue(issue: Issue, id: string | number) {
  const types = [`${b}/issues/Issue`];
  if (issue.status === IssueStatus.BACKLOG) {
    types.push(`${b}/issues/BacklogIssue`);
  } else if (issue.status === IssueStatus.READY) {
    types.push(`${b}/issues/ReadyIssue`);
  } else if (issue.status === IssueStatus.IN_PROCESS) {
    types.push(`${b}/issues/InProcessIssue`);
  } else if (issue.status === IssueStatus.DONE) {
    types.push(`${b}/issues/DoneIssue`);
  }

  return {
    "@id": `${b}/issues/${id}`,
    "@type": types,
    title: issue.title,
    description: issue.description,
    status: issue.status,
    memberOf: { "@id": `${b}/projects/${issue.belongsTo}` }
  };
}

const contexts: { [key: string]: any } = {
  EntryPoint: {
    "@context": [
      hydra,
      {
        projects: {
          "@id": "hydra:EntryPoint/projects",
          "@type": "@id"
        },
        issues: {
          "@id": "hydra:EntryPoint/issues",
          "@type": "@id"
        }
      }
    ]
  },
  kanban: {
    "@context": [
      hydra,
      {
        title: "https://schema.org/title",
        name: "https://schema.org/name",
        description: "https://schema.org/description",
        status: "https://schema.org/status",
        memberOf: "https://schema.org/memberOf"
      }
    ]
  }
};

kanban.get("/", apiDocSetter, jsonldSetter, (_, res) => {
  res.send({
    "@context": `${b}/contexts/EntryPoint`,
    "@id": b,
    "@type": "EntryPoint",
    projects: `${b}/projects`,
    issues: `${b}/issues`
  });
});

kanban.get("/doc", jsonldSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/kanban`,
    "@id": `${b}/doc`,
    "@type": "ApiDocumentation",
    title: "Kanban issue board",
    description: "Kanban issue board showing projects with its issues",
    entrypoint: `${b}/`,
    supportedClass: [
      {
        "@id": `${b}/issues/IssueToReadyUpdate`,
        "@type": "Class",
        title: "IssueToReadyUpdate",
        description: "Sets issue to status ready."
      },
      {
        "@id": `${b}/issues/IssueToInProcessUpdate`,
        "@type": "Class",
        title: "IssueToInProcessUpdate",
        description: "Sets issue to status in process."
      },
      {
        "@id": `${b}/issues/IssueToDoneUpdate`,
        "@type": "Class",
        title: "IssueToDoneUpdate",
        description: "Sets issue to status done."
      },
      {
        "@id": `${b}/issues/Issue`,
        "@type": "Class",
        title: "Issue",
        description: "Represents a unit of work that can be done.",
        supportedOperation: [{ "@type": "Operation", method: "DELETE" }]
      },
      {
        "@id": `${b}/issues/BacklogIssue`,
        "@type": "Class",
        title: "Issue in Backlog",
        description: "An issue which is in the backlog.",
        supportedOperation: [
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Plan",
            expects: `${b}/issues/IssueToReadyUpdate`,
            returns: null
          },
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Start",
            expects: `${b}/issues/IssueToInProcessUpdate`,
            returns: null
          },
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Already Done",
            expects: `${b}/issues/IssueToDoneUpdate`,
            returns: null
          }
        ]
      },
      {
        "@id": `${b}/issues/ReadyIssue`,
        "@type": "Class",
        title: "Issue that is ready",
        description: "An issue which is ready and can be started.",
        supportedOperation: [
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Start",
            expects: `${b}/issues/IssueToInProcessUpdate`,
            returns: null
          },
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Already Done",
            expects: `${b}/issues/IssueToDoneUpdate`,
            returns: null
          }
        ]
      },
      {
        "@id": `${b}/issues/InProcessIssue`,
        "@type": "Class",
        title: "Issue in process",
        description: "An issue which is being worked on.",
        supportedOperation: [
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Stop",
            expects: `${b}/issues/IssueToReadyUpdate`,
            returns: null
          },
          {
            "@type": "http://schema.org/UpdateAction",
            method: "POST",
            label: "Finish",
            expects: `${b}/issues/IssueToDoneUpdate`,
            returns: null
          }
        ]
      }
    ]
  });
});

kanban.get("/contexts/EntryPoint", jsonldSetter, (req, res) => {
  res.send(contexts.EntryPoint);
});

kanban.get("/contexts/:id", jsonldSetter, (req, res) => {
  res.send(contexts.kanban);
});

kanban.get("/projects", jsonldSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Project`,
    "@id": `${b}/projects`,
    "@type": "Collection",
    totalItems: projects.length,
    member: Object.keys(projects).map(k => serializeProject(projects[k], k))
  });
});

kanban.get("/projects/:id", jsonldSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  res.send({
    "@context": `${b}/contexts/Projects`,
    ...serializeProject(projects[id], id)
  });
});

kanban.get("/issues", apiDocSetter, jsonldSetter, (req, res) => {
  res.send({
    "@context": `${b}/contexts/Issue`,
    "@id": `${b}/issues`,
    "@type": ["Collection", `${b}/Kanban`],
    totalItems: issues.length,
    member: Object.keys(issues).map(k => serializeIssue(issues[k], k))
  });
});

kanban.get("/issues/:id", apiDocSetter, jsonldSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  if (issues[id]) {
    res.send({
      "@context": `${b}/contexts/Issues`,
      ...serializeIssue(issues[id], id)
    });
  } else {
    res.status(404).send({ message: "Issue not found" });
  }
});

kanban.delete("/issues/:id", jsonldSetter, (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    delete issues[id];
    res.status(200).send({ message: "Successfully deleted issue" });
  } catch (e) {
    res.status(500).send({ message: "Failed to delete issue" });
  }
});

kanban.post("/issues/:id", jsonldSetter, (req: Request, res) => {
  const {
    params: { id },
    body: { "@id": statusOperationUrl }
  } = req;
  try {
    const statusOperation = statusOperationUrl.split("/").pop();
    const targetStatus = operationToStatus[statusOperation];
    issues[id].status = targetStatus;
    console.log(`Issue with id ${id} update with ${targetStatus}`);
    res.status(200).send({ message: "Successfully updated issue status" });
  } catch (e) {
    res.status(500).send({ message: "Failed to update issue status" });
  }
});

export default kanban;
