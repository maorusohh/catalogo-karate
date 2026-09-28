import path from "node:path";

import { expect, test } from "vitest";

import {
  assertPathOutsideProject,
  parseServiceAccountCredentials,
} from "@/lib/catalog/source/google-credentials";

test("acepta credenciales válidas de una service account", () => {
  const credentials = parseServiceAccountCredentials(
    JSON.stringify({
      type: "service_account",
      client_email: "catalogo-karate-sync@example.iam.gserviceaccount.com",
      private_key: "-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----\n",
    }),
  );

  expect(credentials).toEqual({
    client_email: "catalogo-karate-sync@example.iam.gserviceaccount.com",
    private_key: "-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----\n",
  });
});

test("rechaza JSON de credenciales que no corresponde a una service account", () => {
  expect(() =>
    parseServiceAccountCredentials(
      JSON.stringify({
        type: "authorized_user",
        client_email: "example@example.com",
        private_key: "not-a-service-account-key",
      }),
    ),
  ).toThrow('Google credential JSON must have type "service_account".');
});

test("rechaza credenciales sin client_email", () => {
  expect(() =>
    parseServiceAccountCredentials(
      JSON.stringify({
        type: "service_account",
        private_key: "-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----\n",
      }),
    ),
  ).toThrow('Google service account credential is missing a valid "client_email".');
});

test("rechaza credenciales sin private_key", () => {
  expect(() =>
    parseServiceAccountCredentials(
      JSON.stringify({
        type: "service_account",
        client_email: "catalogo-karate-sync@example.iam.gserviceaccount.com",
      }),
    ),
  ).toThrow('Google service account credential is missing a valid "private_key".');
});

test("rechaza una clave guardada dentro del proyecto", () => {
  const projectRoot = path.resolve("catalogo-karate");

  const credentialPath = path.join(projectRoot, ".secrets", "service-account.json");

  expect(() => assertPathOutsideProject(credentialPath, projectRoot)).toThrow(
    "Google service account credential file must be stored outside the project directory.",
  );
});

test("acepta una ruta de credenciales fuera del proyecto", () => {
  const projectRoot = path.resolve("catalogo-karate");

  const credentialPath = path.resolve(projectRoot, "..", "google-secrets", "service-account.json");

  expect(() => assertPathOutsideProject(credentialPath, projectRoot)).not.toThrow();
});
