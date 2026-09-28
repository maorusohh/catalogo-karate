import path from "node:path";
import { readFile, realpath } from "node:fs/promises";

export interface ServiceAccountCredentials {
  client_email: string;
  private_key: string;
}

function isPathInsideProject(filePath: string, projectRoot: string): boolean {
  const absoluteFilePath = path.resolve(filePath);

  const absoluteProjectRoot = path.resolve(projectRoot);

  const relativePath = path.relative(absoluteProjectRoot, absoluteFilePath);

  return (
    relativePath === "" ||
    (relativePath !== ".." &&
      !relativePath.startsWith(`..${path.sep}`) &&
      !path.isAbsolute(relativePath))
  );
}

export function assertPathOutsideProject(filePath: string, projectRoot: string): void {
  if (isPathInsideProject(filePath, projectRoot)) {
    throw new Error(
      "Google service account credential file must be stored outside the project directory.",
    );
  }
}

export function parseServiceAccountCredentials(value: string): ServiceAccountCredentials {
  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("Google service account credential file does not contain valid JSON.");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Google service account credential file must contain a JSON object.");
  }

  const record = parsed as Record<string, unknown>;

  if (record.type !== "service_account") {
    throw new Error('Google credential JSON must have type "service_account".');
  }

  if (typeof record.client_email !== "string" || !record.client_email) {
    throw new Error('Google service account credential is missing a valid "client_email".');
  }

  if (typeof record.private_key !== "string" || !record.private_key) {
    throw new Error('Google service account credential is missing a valid "private_key".');
  }

  return {
    client_email: record.client_email,
    private_key: record.private_key,
  };
}

export async function loadServiceAccountCredentials(
  filePath: string,
  projectRoot: string,
): Promise<ServiceAccountCredentials> {
  const candidatePath = path.resolve(filePath);

  assertPathOutsideProject(candidatePath, projectRoot);

  let realCredentialPath: string;

  try {
    realCredentialPath = await realpath(candidatePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Google service account credential file was not found: ${candidatePath}`);
    }

    throw error;
  }

  const realProjectRoot = await realpath(projectRoot);

  assertPathOutsideProject(realCredentialPath, realProjectRoot);

  const rawCredentials = await readFile(realCredentialPath, "utf8");

  return parseServiceAccountCredentials(rawCredentials);
}
