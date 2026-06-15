import * as k8s from "@kubernetes/client-node";

// kind uses self-signed certs — disable TLS verification for local dev
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

export const coreApi = kc.makeApiClient(k8s.CoreV1Api);
export const coordinationApi = kc.makeApiClient(k8s.CoordinationV1Api);
