import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import fsSync from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawn } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const require = createRequire(import.meta.url);

const outputDir = path.join(projectRoot, "public", "downloads");
const pdfPath = path.join(outputDir, "AMO_Company_Profile_Deck.pdf");
const keynotePath = path.join(outputDir, "AMO_Company_Profile_Deck.key");
const qrPath = path.join(outputDir, "amo-whatsapp-qr.png");
const keynoteScriptPath = path.join(projectRoot, "scripts", "convert-company-deck-to-keynote.applescript");
const builderModulePath = path.join(projectRoot, "scripts", "company-profile-keynote-builder.mjs");

const runtimeNodeModules = path.join(
  os.homedir(),
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "node",
  "node_modules",
);
const runtimePython = path.join(
  os.homedir(),
  ".cache",
  "codex-runtimes",
  "codex-primary-runtime",
  "dependencies",
  "python",
  "bin",
  "python3",
);

function runProcess(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      ...options,
      stdio: options.stdio ?? ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk.toString();
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        stderr += chunk.toString();
      });
    }

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function resolvePackageEntry(packageName, searchPaths) {
  for (const basePath of searchPaths) {
    try {
      return require.resolve(packageName, { paths: [basePath] });
    } catch {
      continue;
    }
  }

  throw new Error(`Could not resolve ${packageName}. Checked: ${searchPaths.join(", ")}`);
}

function findPackageRoot(entryPath) {
  let currentPath = path.dirname(entryPath);

  while (currentPath !== path.dirname(currentPath)) {
    if (fsSync.existsSync(path.join(currentPath, "package.json"))) {
      return currentPath;
    }

    currentPath = path.dirname(currentPath);
  }

  throw new Error(`Could not locate package root for ${entryPath}`);
}

async function ensureArtifactToolWorkspace() {
  const workspaceDir = await mkdtemp(path.join(os.tmpdir(), "amo-company-deck-artifact-"));
  const nodeModulesDir = path.join(workspaceDir, "node_modules", "@oai");
  await mkdir(nodeModulesDir, { recursive: true });
  await writeFile(
    path.join(workspaceDir, "package.json"),
    `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`,
    "utf8",
  );

  const entryPath = resolvePackageEntry("@oai/artifact-tool", [
    process.env.ARTIFACT_TOOL_NODE_MODULES,
    runtimeNodeModules,
    projectRoot,
  ].filter(Boolean));
  const packageDir = findPackageRoot(entryPath);
  const targetDir = path.join(nodeModulesDir, "artifact-tool");

  await rm(targetDir, { force: true, recursive: true });
  await fsSync.promises.symlink(packageDir, targetDir, process.platform === "win32" ? "junction" : "dir");

  return workspaceDir;
}

async function importArtifactTool(workspaceDir) {
  const entryPath = resolvePackageEntry("@oai/artifact-tool", [workspaceDir]);
  return import(pathToFileURL(entryPath).href);
}

function resolvePythonExecutable() {
  if (process.env.PYTHON_BIN) {
    return process.env.PYTHON_BIN;
  }

  if (fsSync.existsSync(runtimePython)) {
    return runtimePython;
  }

  return "python3";
}

async function writeBlob(filePath, blob) {
  await writeFile(filePath, new Uint8Array(await blob.arrayBuffer()));
}

async function renderSlidesToPng(presentation, renderDir) {
  const outputPaths = [];

  for (const [index, slide] of presentation.slides.items.entries()) {
    const filePath = path.join(renderDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
    const png = await presentation.export({ slide, format: "png", scale: 2 });
    await writeBlob(filePath, png);
    outputPaths.push(filePath);
  }

  return outputPaths;
}

async function buildPdfFromPngs(slideImagePaths) {
  const pythonScript = `
from PIL import Image
import PIL.JpegImagePlugin
import sys

output_path = sys.argv[1]
image_paths = sys.argv[2:]

if not image_paths:
    raise SystemExit("No slide images were provided.")

images = []
for image_path in image_paths:
    image = Image.open(image_path)
    if image.mode != "RGB":
        image = image.convert("RGB")
    images.append(image)

images[0].save(output_path, save_all=True, append_images=images[1:], resolution=144.0)
`;

  const result = await runProcess(resolvePythonExecutable(), ["-c", pythonScript, pdfPath, ...slideImagePaths], {
    cwd: projectRoot,
  });

  if (result.code !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || "Failed to create PDF from slide renders.");
  }
}

async function convertToKeynote(pptxPath) {
  const keynoteApp = await runProcess("osascript", ["-e", 'id of application "Keynote"']);

  if (keynoteApp.code !== 0) {
    throw new Error("Keynote is not available on this macOS environment. Cannot generate a native .key file.");
  }

  await rm(keynotePath, { force: true, recursive: true });
  const result = await runProcess("osascript", [keynoteScriptPath, pptxPath, keynotePath], {
    cwd: projectRoot,
  });

  if (result.code !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || "Keynote conversion failed.");
  }

  try {
    await access(keynotePath);
    return;
  } catch {
    throw new Error("Keynote export did not produce the expected .key file.");
  }
}

async function logOutput(filePath, label) {
  const fileStats = await stat(filePath);
  console.log(`${label}: ${filePath} (${Math.round(fileStats.size / 1024)} KB)`);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  await access(qrPath);

  const artifactWorkspace = await ensureArtifactToolWorkspace();
  const renderDir = await mkdtemp(path.join(os.tmpdir(), "amo-company-deck-renders-"));
  const tempPptxPath = path.join(os.tmpdir(), `amo-company-profile-${Date.now()}.pptx`);

  try {
    const [{ PresentationFile, Presentation }, builderModule] = await Promise.all([
      importArtifactTool(artifactWorkspace),
      import(pathToFileURL(builderModulePath).href),
    ]);
    const { createCompanyDeckPresentation } = builderModule;

    const presentation = await createCompanyDeckPresentation({
      Presentation,
      projectRoot,
    });
    const pptx = await PresentationFile.exportPptx(presentation);
    await pptx.save(tempPptxPath);

    const slideImagePaths = await renderSlidesToPng(presentation, renderDir);
    await buildPdfFromPngs(slideImagePaths);

    await convertToKeynote(tempPptxPath);
    await logOutput(pdfPath, "Saved PDF");
    await logOutput(keynotePath, "Saved Keynote deck");
  } finally {
    await rm(renderDir, { force: true, recursive: true });
    await rm(artifactWorkspace, { force: true, recursive: true });
    await rm(tempPptxPath, { force: true });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
