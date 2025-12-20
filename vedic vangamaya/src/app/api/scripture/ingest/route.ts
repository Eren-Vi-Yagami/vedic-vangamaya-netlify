/**
 * Bhagavad Gita Ingestion API
 *
 * Security model:
 * - Protected by SCRIPTURE_ADMIN_SECRET environment variable
 * - Compares provided adminPassword to the secret on the server only
 * - Never exposes the secret value to clients or logs it
 *
 * Persistence:
 * - Writes raw JSON to src/modules/scripture/raw-data/<ISO>-bhagavad-gita-raw.json
 * - Writes normalized JSON to src/modules/scripture/data/normalized-bhagavad-gita.json
 * - Optionally, an ephemeral filesystem warning may be included in the response
 */

import { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { validateBhagavadGitaShastra } from "../../../../modules/scripture/validation/bhagavadGitaValidation";
import { normalizeBhagavadGita } from "../../../../modules/scripture/normalization/bhagavadGitaNormalization";

export async function POST(request: NextRequest) {
  const adminSecret = process.env.SCRIPTURE_ADMIN_SECRET;

  if (!adminSecret) {
    return Response.json(
      {
        ok: false,
        message:
          "Server is not configured for scripture ingestion (SCRIPTURE_ADMIN_SECRET is missing).",
      },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        ok: false,
        message: "Invalid JSON body.",
      },
      { status: 400 }
    );
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    !("adminPassword" in body) ||
    !("payload" in body)
  ) {
    return Response.json(
      {
        ok: false,
        message:
          "Request body must be an object with adminPassword and payload fields.",
      },
      { status: 400 }
    );
  }

  const { adminPassword, payload } = body as {
    adminPassword: unknown;
    payload: unknown;
  };

  if (typeof adminPassword !== "string") {
    return Response.json(
      {
        ok: false,
        message: "adminPassword must be a string.",
      },
      { status: 400 }
    );
  }

  if (adminPassword !== adminSecret) {
    return Response.json(
      {
        ok: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const validationResult = validateBhagavadGitaShastra(payload);

  if (!validationResult.ok || !validationResult.value) {
    return Response.json(
      {
        ok: false,
        message: "Validation failed",
        errors: validationResult.errors,
      },
      { status: 400 }
    );
  }

  const normalized = normalizeBhagavadGita(validationResult.value);

  const scriptureBaseDir = path.join(
    process.cwd(),
    "src",
    "modules",
    "scripture"
  );
  const rawDir = path.join(scriptureBaseDir, "raw-data");
  const normalizedDir = path.join(scriptureBaseDir, "data");

  const timestampSafe = new Date().toISOString().replace(/:/g, "-");
  const rawFilename = `${timestampSafe}-bhagavad-gita-raw.json`;
  const rawPath = path.join(rawDir, rawFilename);
  const normalizedPath = path.join(
    normalizedDir,
    "normalized-bhagavad-gita.json"
  );

  let ephemeralWarning: string | undefined;
  if (process.env.SCRIPTURE_FS_EPHEMERAL === "true") {
    ephemeralWarning =
      "Filesystem writes may be ephemeral in this environment. Data may not persist across restarts or deployments.";
  }

  try {
    await fs.mkdir(rawDir, { recursive: true });
    await fs.mkdir(normalizedDir, { recursive: true });

    await fs.writeFile(
      rawPath,
      JSON.stringify(validationResult.value, null, 2),
      "utf8"
    );

    await fs.writeFile(
      normalizedPath,
      JSON.stringify(normalized, null, 2),
      "utf8"
    );
  } catch (error: any) {
    return Response.json(
      {
        ok: false,
        message: "Failed to write scripture data to the filesystem.",
        details: error?.message ?? String(error),
      },
      { status: 500 }
    );
  }

  const chapterCount = Object.keys(normalized.chapters).length;
  const verseCount = Object.values(normalized.chapters).reduce(
    (sum, chapter) => sum + Object.keys(chapter.verses).length,
    0
  );

  return Response.json(
    {
      ok: true,
      message: "Ingest successful",
      normalizedSummary: {
        chapters: chapterCount,
        verses: verseCount,
      },
      rawPath,
      normalizedPath,
      ephemeralWarning,
    },
    { status: 200 }
  );
}

