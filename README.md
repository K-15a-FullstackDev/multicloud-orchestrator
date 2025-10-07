# MultiCloud Orchestrator

Deploy and manage workloads across AWS & Azure with Terraform, Node API, and a React dashboard.

## Cost Analyzer + Polish

- `/api/costs` → returns daily cost data from AWS Cost Explorer and Azure Consumption.
- Frontend charts auto-refresh every 60 s.
- To use: add valid credentials via Providers → open Costs page.
- Release v0.1.0 includes:
  - Secure provider registry
  - Terraform deploy/destroy
  - React dashboard + log viewer
  - Cloud cost visualization
