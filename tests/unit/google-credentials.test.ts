import os from "node:os";
import path from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";

import { expect, test } from "vitest";

import {
  assertPathOutsideProject,
  loadServiceAccountCredentialsFromEnvironment,
  parseServiceAccountCredentials,
} from "@/lib/catalog/source/google-credentials";

const VALID_CREDENTIALS = JSON.stringify({
  type: "service_account",
  client_email: "catalogo-karate-sync@example.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nexample\n-----END PRIVATE KEY-----\n",
});

test("acepta credenciales válidas de una service account", () => {
  const credentials = parseServiceAccountCredentials(VALID_CREDENTIALS);

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
  const projectRoot = path.resolve();

  const credentialPath = path.join(projectRoot, ".secrets", "service-account.json");

  expect(() => assertPathOutsideProject(credentialPath, projectRoot)).toThrow(
    "Google service account credential file must be stored outside the project directory.",
  );
});

test("acepta una ruta de credenciales fuera del proyecto", () => {
  const projectRoot = path.resolve();

  const credentialPath = path.resolve(projectRoot, "..", "google-secrets", "service-account.json");

  expect(() => assertPathOutsideProject(credentialPath, projectRoot)).not.toThrow();
});

test("usa correctamente un archivo externo de credenciales", async () => {
  const projectRoot = path.resolve();

  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "catalogo-karate-google-"));

  const credentialPath = path.join(temporaryDirectory, "service-account.json");

  try {
    await writeFile(credentialPath, VALID_CREDENTIALS, "utf8");

    const credentials = await loadServiceAccountCredentialsFromEnvironment(
      credentialPath,
      undefined,
      projectRoot,
    );

    expect(credentials).toEqual(parseServiceAccountCredentials(VALID_CREDENTIALS));
  } finally {
    await rm(temporaryDirectory, {
      recursive: true,
      force: true,
    });
  }
});

test("usa JSON de entorno cuando no existe archivo configurado", async () => {
  const projectRoot = path.resolve();

  expect(
    await loadServiceAccountCredentialsFromEnvironment(undefined, VALID_CREDENTIALS, projectRoot),
  ).toEqual(parseServiceAccountCredentials(VALID_CREDENTIALS));
});

test("rechaza ausencia de ambas fuentes de credenciales", async () => {
  const projectRoot = path.resolve();

  await expect(
    loadServiceAccountCredentialsFromEnvironment(undefined, undefined, projectRoot),
  ).rejects.toThrow(
    "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON_FILE or GOOGLE_SERVICE_ACCOUNT_JSON.",
  );
});
