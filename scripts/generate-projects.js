#!/usr/bin/env node

"use strict";
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

function getImageSettings(quality) {
  switch (quality) {
    case "low":
      return { width: 800, jpegQuality: 55 };
    case "medium":
      return { width: 1200, jpegQuality: 70 };
    case "high":
    default:
      return { width: 1800, jpegQuality: 85 };
  }
}

async function processImage(imagePath, quality) {
  const settings = getImageSettings(quality);

  return await sharp(imagePath)
    .resize({
      width: settings.width,
      withoutEnlargement: true,
    })
    .jpeg({ quality: settings.jpegQuality })
    .toBuffer();
}

const ROOT_DIR = path.resolve(__dirname, "..");
const PROJECTS_DIR = path.join(ROOT_DIR, "assets", "projects");
const PROJECT_METADATA_FILE = path.join(
  ROOT_DIR,
  "data",
  "project-metadata.json",
);
const VALID_IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const ALLOW_DOWNLOAD = false

const VALID_DOWNLOAD_EXTENSIONS = ALLOW_DOWNLOAD? new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".dwg",
  ".zip",
]):new Set([]);
const VALID_IMAGE_QUALITY = new Set(["low", "medium", "high"]);
const VALID_COLOR_SCHEMES = new Set(["modern", "minimal"]);
const MM_TO_PT = 72 / 25.4;
const PAGE_SIZES_MM = {
  A4: { width: 210, height: 297 },
};

const DEFAULT_CONFIG = {
  outputPath: "public",
  imagePath: "img",
  pdfPageSize: "A4",
  pdfMargin: 20,
  imageQuality: "high",
  imagesPerRow: 3,
  gridSpacing: 10,
  portfolioTitle: "Professional Portfolio",
  portfolioDescription: "Selected works and process visuals.",
  colorScheme: "modern",
};

function mmToPt(mm) {
  return mm * MM_TO_PT;
}

function hexToRgb(hex) {
  const sanitized = String(hex || "")
    .trim()
    .replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(sanitized)) return rgb(0, 0, 0);
  const value = Number.parseInt(sanitized, 16);
  return rgb(
    ((value >> 16) & 0xff) / 255,
    ((value >> 8) & 0xff) / 255,
    (value & 0xff) / 255,
  );
}

function parsePageSizeMm(raw) {
  const value = String(raw || "")
    .trim()
    .toUpperCase();
  const named = PAGE_SIZES_MM[value];
  if (named) return named;

  const match = value.match(/^(\d+(?:\.\d+)?)X(\d+(?:\.\d+)?)$/);
  if (!match) {
    throw new Error(
      `Invalid pdfPageSize "${raw}". Use "A4" or "<width>x<height>" in mm (example: "210x297").`,
    );
  }

  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    throw new Error(
      `Invalid pdfPageSize "${raw}". Width and height must be numbers > 0.`,
    );
  }

  return { width, height };
}

function normalizeText(raw) {
  if (Array.isArray(raw)) {
    return raw
      .map((line) => String(line || "").trim())
      .filter(Boolean)
      .join(" ");
  }
  return String(raw || "").trim();
}

function parseConfig(portfolioMeta = {}) {
  const config = { ...DEFAULT_CONFIG };
  const cliOverrideKeys = new Set();

  if (portfolioMeta && typeof portfolioMeta === "object") {
    const merged = {
      pdfMargin: portfolioMeta.pdfMargin,
      imagesPerRow: portfolioMeta.imagesPerRow,
      gridSpacing: portfolioMeta.gridSpacing,
      portfolioTitle: portfolioMeta.portfolioTitle || portfolioMeta.title,
      portfolioDescription:
        portfolioMeta.portfolioDescription || portfolioMeta.description,
      colorScheme: portfolioMeta.colorScheme,
    };

    for (const [key, value] of Object.entries(merged)) {
      if (value === undefined || value === null || value === "") continue;
      config[key] = value;
    }
  }

  for (const arg of process.argv.slice(2)) {
    if (!arg.startsWith("--")) continue;
    const [rawKey, rawValue = ""] = arg.slice(2).split("=");
    const key = rawKey.trim();
    const value = rawValue.trim();
    cliOverrideKeys.add(key);

    if (key === "outputPath" && value) config.outputPath = value;
    if (key === "imagePath" && value) config.imagePath = value;
    if (key === "pdfPageSize" && value)
      config.pdfPageSize = value.toUpperCase();
    if (key === "pdfMargin" && value) config.pdfMargin = Number(value);
    if (key === "imageQuality" && value)
      config.imageQuality = value.toLowerCase();
    if (key === "imagesPerRow" && value) config.imagesPerRow = Number(value);
    if (key === "gridSpacing" && value) config.gridSpacing = Number(value);
    if (key === "portfolioTitle" && value) config.portfolioTitle = value;
    if (key === "portfolioDescription" && value)
      config.portfolioDescription = value;
    if (key === "colorScheme" && value)
      config.colorScheme = value.toLowerCase();
  }

  if (cliOverrideKeys.has("title") && !cliOverrideKeys.has("portfolioTitle")) {
    const titleArg = process.argv
      .slice(2)
      .find((arg) => arg.startsWith("--title="));
    if (titleArg)
      config.portfolioTitle = titleArg.slice("--title=".length).trim();
  }

  if (
    cliOverrideKeys.has("description") &&
    !cliOverrideKeys.has("portfolioDescription")
  ) {
    const descriptionArg = process.argv
      .slice(2)
      .find((arg) => arg.startsWith("--description="));
    if (descriptionArg)
      config.portfolioDescription = descriptionArg
        .slice("--description=".length)
        .trim();
  }

  if (!Number.isFinite(config.pdfMargin) || config.pdfMargin < 0) {
    throw new Error(
      `Invalid pdfMargin "${config.pdfMargin}". It must be a number >= 0.`,
    );
  }

  if (!VALID_IMAGE_QUALITY.has(config.imageQuality)) {
    throw new Error(
      `Invalid imageQuality "${config.imageQuality}". Use: low, medium, or high.`,
    );
  }

  if (
    !Number.isFinite(config.imagesPerRow) ||
    config.imagesPerRow < 2 ||
    config.imagesPerRow > 3
  ) {
    throw new Error(
      `Invalid imagesPerRow "${config.imagesPerRow}". Use 2 or 3.`,
    );
  }

  if (!Number.isFinite(config.gridSpacing) || config.gridSpacing < 0) {
    throw new Error(
      `Invalid gridSpacing "${config.gridSpacing}". It must be a number >= 0.`,
    );
  }

  if (!VALID_COLOR_SCHEMES.has(config.colorScheme)) {
    throw new Error(
      `Invalid colorScheme "${config.colorScheme}". Use "modern" or "minimal".`,
    );
  }

  const pageSizeMm = parsePageSizeMm(config.pdfPageSize);
  const maxAllowedMargin = Math.min(pageSizeMm.width, pageSizeMm.height) / 2;
  if (config.pdfMargin >= maxAllowedMargin) {
    throw new Error(
      `Invalid pdfMargin "${config.pdfMargin}". It must be smaller than half of the page's shortest side (${maxAllowedMargin}mm).`,
    );
  }

  config.pageSizeMm = pageSizeMm;
  config.portfolioTitle =
    normalizeText(config.portfolioTitle) || DEFAULT_CONFIG.portfolioTitle;
  config.portfolioDescription =
    normalizeText(config.portfolioDescription) ||
    DEFAULT_CONFIG.portfolioDescription;
  return config;
}

function readMetadata() {
  if (!fs.existsSync(PROJECT_METADATA_FILE)) return {};

  try {
    const parsed = JSON.parse(fs.readFileSync(PROJECT_METADATA_FILE, "utf-8"));
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) =>
      VALID_IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()),
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function getFilesByExtensions(dir, validExtensionsSet) {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => validExtensionsSet.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

function validatePortfolioJson(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;

  return Object.values(data).every(
    (project) =>
      project &&
      typeof project === "object" &&
      typeof project.title === "string" &&
      Array.isArray(project.images) &&
      project.images.every(
        (image) =>
          image &&
          typeof image.src === "string" &&
          typeof image.caption === "string",
      ),
  );
}

function getPalette(colorScheme) {
  if (colorScheme === "minimal") {
    return {
      pageBg: hexToRgb("FFFFFF"),
      coverBg: hexToRgb("F6F7F8"),
      cardBg: hexToRgb("FFFFFF"),
      border: hexToRgb("D9DEE3"),
      shadow: hexToRgb("CED4DA"),
      title: hexToRgb("111827"),
      text: hexToRgb("1F2937"),
      muted: hexToRgb("6B7280"),
      accent: hexToRgb("334155"),
      accentSoft: hexToRgb("E2E8F0"),
    };
  }

  return {
    pageBg: hexToRgb("F8FAFC"),
    coverBg: hexToRgb("EEF2FF"),
    cardBg: hexToRgb("FFFFFF"),
    border: hexToRgb("CBD5E1"),
    shadow: hexToRgb("BFDBFE"),
    title: hexToRgb("0F172A"),
    text: hexToRgb("1E293B"),
    muted: hexToRgb("64748B"),
    accent: hexToRgb("2563EB"),
    accentSoft: hexToRgb("DBEAFE"),
  };
}

function drawPageBackground(page, pageWidth, pageHeight, palette) {
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: palette.pageBg,
  });
}

function drawWrappedText(page, text, options) {
  const { font, size, color, x, yTop, maxWidth, lineHeight } = options;

  const words = String(text || "")
    .split(/\s+/)
    .filter(Boolean);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, size);
    if (candidateWidth <= maxWidth || !currentLine) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  let drawYTop = yTop;
  for (const line of lines) {
    const baselineY = drawYTop - size;
    page.drawText(line, {
      x,
      y: baselineY,
      font,
      size,
      color,
    });
    drawYTop -= lineHeight;
  }

  return {
    lines,
    height: lines.length * lineHeight,
    yBottom: yTop - lines.length * lineHeight,
  };
}

function pickRowCount(
  imageAssets,
  cursor,
  maxPerRow,
  availableWidth,
  targetHeight,
) {
  const remaining = imageAssets.length - cursor;
  if (remaining <= 0) return 0;
  if (remaining === 1) return 1;

  const maxCandidate = Math.min(maxPerRow, remaining);
  const minCandidate = Math.min(2, maxCandidate);

  let bestCount = maxCandidate;
  let bestScore = Number.POSITIVE_INFINITY;

  for (let count = minCandidate; count <= maxCandidate; count += 1) {
    let ratioSum = 0;
    for (let i = 0; i < count; i += 1) {
      const asset = imageAssets[cursor + i];
      ratioSum += asset.width / asset.height;
    }

    const predictedRowHeight = availableWidth / ratioSum;
    const score = Math.abs(predictedRowHeight - targetHeight);
    if (score < bestScore) {
      bestScore = score;
      bestCount = count;
    }
  }

  return bestCount;
}

function drawFooter(
  page,
  pageWidth,
  footerY,
  pageNumber,
  totalPages,
  fonts,
  palette,
) {
  const label = `${pageNumber} / ${totalPages}`;
  const size = 9;
  const width = fonts.regular.widthOfTextAtSize(label, size);
  page.drawText(label, {
    x: pageWidth - width - mmToPt(20),
    y: footerY,
    font: fonts.regular,
    size,
    color: palette.muted,
  });
}

async function loadProjectAssets(pdfDoc, project, config) {
  const assets = [];

  for (const image of project.images) {
    const webImagePath = String(image.src || "").replace(/^\.\.\//, "");
    const imageAbsolutePath = path.resolve(ROOT_DIR, webImagePath);

    try {
      // 🔥 Process image (resize + compress + convert to JPEG)
      const processedBytes = await processImage(
        imageAbsolutePath,
        config.imageQuality,
      );

      // Always embed as JPEG (best compression)
      const embedded = await pdfDoc.embedJpg(processedBytes);

      assets.push({
        ...image,
        embedded,
        width: embedded.width,
        height: embedded.height,
      });
    } catch (error) {
      console.warn(`Skipped image: ${image.src} (${error.message})`);
    }
  }

  return assets;
}

function drawCoverPage(
  pdfDoc,
  config,
  pageWidth,
  pageHeight,
  margin,
  palette,
  fonts,
) {
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: palette.coverBg,
  });

  const accentBarHeight = mmToPt(4);
  page.drawRectangle({
    x: margin,
    y: pageHeight - margin - accentBarHeight,
    width: pageWidth - margin * 2,
    height: accentBarHeight,
    color: palette.accent,
  });

  const titleY = pageHeight - margin - mmToPt(28);
  drawWrappedText(page, config.portfolioTitle, {
    font: fonts.bold,
    size: 34,
    color: palette.title,
    x: margin,
    yTop: titleY,
    maxWidth: pageWidth - margin * 2,
    lineHeight: 38,
  });

  drawWrappedText(page, config.portfolioDescription, {
    font: fonts.regular,
    size: 13,
    color: palette.text,
    x: margin,
    yTop: titleY - 80,
    maxWidth: pageWidth - margin * 2,
    lineHeight: 18,
  });

  const dateLabel = `Generated ${new Date().toISOString().slice(0, 10)}`;
  page.drawText(dateLabel, {
    x: margin,
    y: margin + 6,
    font: fonts.regular,
    size: 10,
    color: palette.muted,
  });
}

function drawProjectHeader(
  page,
  project,
  layout,
  fonts,
  palette,
  isContinuation,
) {
  const {
    margin,
    pageWidth,
    pageHeight,
    contentWidth,
    headerTop,
    footerReserved,
  } = layout;
  drawPageBackground(page, pageWidth, pageHeight, palette);

  const accentBlockHeight = mmToPt(3);
  page.drawRectangle({
    x: margin,
    y: headerTop - accentBlockHeight,
    width: contentWidth,
    height: accentBlockHeight,
    color: palette.accent,
  });

  let cursorTop = headerTop - accentBlockHeight - 14;
  const titleText = isContinuation
    ? `${project.title} (continued)`
    : project.title;
  const titleResult = drawWrappedText(page, titleText, {
    font: fonts.bold,
    size: 21,
    color: palette.title,
    x: margin,
    yTop: cursorTop,
    maxWidth: contentWidth,
    lineHeight: 24,
  });
  cursorTop = titleResult.yBottom - 8;

  const description = normalizeText(project.description);
  if (description) {
    const descriptionResult = drawWrappedText(page, description, {
      font: fonts.regular,
      size: 11,
      color: palette.text,
      x: margin,
      yTop: cursorTop,
      maxWidth: contentWidth,
      lineHeight: 15,
    });
    cursorTop = descriptionResult.yBottom - 8;
  }

  const metadataLabels = [
    project.date ? `Date: ${project.date}` : "",
    project.tools ? `Tools: ${project.tools}` : "",
    project.link ? `Link: ${project.link}` : "",
  ].filter(Boolean);

  if (metadataLabels.length > 0) {
    const metadataResult = drawWrappedText(page, metadataLabels.join("  |  "), {
      font: fonts.regular,
      size: 9,
      color: palette.muted,
      x: margin,
      yTop: cursorTop,
      maxWidth: contentWidth,
      lineHeight: 13,
    });
    cursorTop = metadataResult.yBottom - 10;
  }

  const separatorY = cursorTop;
  page.drawLine({
    start: { x: margin, y: separatorY },
    end: { x: margin + contentWidth, y: separatorY },
    thickness: 0.8,
    color: palette.border,
  });

  const contentTopY = separatorY - 10;
  const contentBottomY = margin + footerReserved;
  return { contentTopY, contentBottomY };
}

function drawImageCard(page, asset, rect, fonts, palette) {
  const shadowOffset = 1.6;
  page.drawRectangle({
    x: rect.x + shadowOffset,
    y: rect.y - shadowOffset,
    width: rect.width,
    height: rect.height,
    color: palette.shadow,
    opacity: 0.18,
  });

  page.drawRectangle({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    color: palette.cardBg,
    borderColor: palette.border,
    borderWidth: 0.8,
  });

  const innerPad = 7;
  const captionHeight = 12;
  const availableWidth = rect.width - innerPad * 2;
  const availableHeight = rect.height - innerPad * 2 - captionHeight;
  const scale = Math.min(
    availableWidth / asset.width,
    availableHeight / asset.height,
  );
  const drawWidth = asset.width * scale;
  const drawHeight = asset.height * scale;
  const drawX = rect.x + innerPad + (availableWidth - drawWidth) / 2;
  const drawY =
    rect.y + innerPad + captionHeight + (availableHeight - drawHeight) / 2;

  page.drawImage(asset.embedded, {
    x: drawX,
    y: drawY,
    width: drawWidth,
    height: drawHeight,
  });

  if (asset.caption) {
    const captionText =
      asset.caption.length > 50
        ? `${asset.caption.slice(0, 47)}...`
        : asset.caption;
    page.drawText(captionText, {
      x: rect.x + innerPad,
      y: rect.y + 3,
      font: fonts.regular,
      size: 8,
      color: palette.muted,
    });
  }
}

async function buildPortfolioPdf(projects, config, outputPdfPath) {
  const pdfDoc = await PDFDocument.create();
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };
  const palette = getPalette(config.colorScheme);

  const pageWidth = mmToPt(config.pageSizeMm.width);
  const pageHeight = mmToPt(config.pageSizeMm.height);
  const margin = mmToPt(config.pdfMargin);
  const spacing = mmToPt(config.gridSpacing);
  const footerReserved = mmToPt(8);
  const targetRowHeight = mmToPt(58);

  drawCoverPage(pdfDoc, config, pageWidth, pageHeight, margin, palette, fonts);

  for (const project of Object.values(projects)) {
    const imageAssets = await loadProjectAssets(pdfDoc, project, config);
    let cursor = 0;
    let isContinuation = false;

    while (
      cursor < imageAssets.length ||
      (cursor === 0 && imageAssets.length === 0)
    ) {
      const page = pdfDoc.addPage([pageWidth, pageHeight]);
      const layout = {
        margin,
        pageWidth,
        pageHeight,
        contentWidth: pageWidth - margin * 2,
        headerTop: pageHeight - margin,
        footerReserved,
      };
      const bounds = drawProjectHeader(
        page,
        project,
        layout,
        fonts,
        palette,
        isContinuation,
      );
      isContinuation = true;

      if (imageAssets.length === 0) {
        page.drawText("No images available for this project.", {
          x: margin,
          y: bounds.contentTopY - 18,
          font: fonts.regular,
          size: 10,
          color: palette.muted,
        });
        break;
      }

      let yTop = bounds.contentTopY;
      const minRowHeight = mmToPt(36);

      while (cursor < imageAssets.length) {
        const maxWidthForCards = layout.contentWidth;
        const candidateRowCount = pickRowCount(
          imageAssets,
          cursor,
          config.imagesPerRow,
          maxWidthForCards - spacing * (config.imagesPerRow - 1),
          targetRowHeight,
        );
        const rowCount = Math.max(
          1,
          Math.min(candidateRowCount, imageAssets.length - cursor),
        );
        const rowAssets = imageAssets.slice(cursor, cursor + rowCount);
        const totalGap = spacing * (rowCount - 1);
        const usableWidth = layout.contentWidth - totalGap;
        const sumRatios = rowAssets.reduce(
          (sum, asset) => sum + asset.width / asset.height,
          0,
        );
        let rowHeight = usableWidth / sumRatios;
        rowHeight = Math.max(minRowHeight, rowHeight);

        const cardHeight = rowHeight + 20;
        const nextBottom = yTop - cardHeight;
        if (nextBottom < bounds.contentBottomY) {
          break;
        }

        let x = margin;
        for (const asset of rowAssets) {
          const cellWidth = rowHeight * (asset.width / asset.height);
          drawImageCard(
            page,
            asset,
            {
              x,
              y: yTop - cardHeight,
              width: cellWidth,
              height: cardHeight,
            },
            fonts,
            palette,
          );
          x += cellWidth + spacing;
        }

        yTop -= cardHeight + spacing;
        cursor += rowAssets.length;
      }

      if (cursor >= imageAssets.length) break;
    }
  }

  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    drawFooter(
      page,
      pageWidth,
      margin - 2,
      i + 1,
      pages.length,
      fonts,
      palette,
    );
  }

const pdfBytes = await pdfDoc.save({
  useObjectStreams: true,
  addDefaultPage: false
});

  fs.writeFileSync(outputPdfPath, pdfBytes);
  return pages.length;
}

async function generate() {
  const metadata = readMetadata();
  const config = parseConfig(metadata.portfolio || {});
  const outputDir = path.join(ROOT_DIR, config.outputPath);
  const outputJsonPath = path.join(outputDir, "portfolio.json");
  const outputPdfPath = path.join(outputDir, "portfolio.pdf");

  if (!fs.existsSync(PROJECTS_DIR)) {
    throw new Error(`Projects folder not found: ${PROJECTS_DIR}`);
  }

  const projectFolders = fs
    .readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const projects = {};

  for (const projectId of projectFolders) {
    const projectDir = path.join(PROJECTS_DIR, projectId);

    if (!fs.existsSync(projectDir)) {
      console.warn(
        `Skipped ${projectId}: project folder not found (${projectDir})`,
      );
      continue;
    }

    const files = getImageFiles(projectDir);
    const downloadFiles = getFilesByExtensions(
      projectDir,
      VALID_DOWNLOAD_EXTENSIONS,
    );
    const projectMeta = (metadata && metadata[projectId]) || {};

    const images = files.map((file) => ({
      src: `../assets/projects/${projectId}/${encodeURIComponent(file)}`,
      caption: path.parse(file).name.replace(/[_-]+/g, " ").trim(),
    }));

    const descriptionLines = Array.isArray(projectMeta.description)
      ? projectMeta.description
          .map((line) => String(line || "").trim())
          .filter(Boolean)
      : normalizeText(projectMeta.description)
        ? [normalizeText(projectMeta.description)]
        : [];
    const normalizedDescription = descriptionLines.join(" ");
    const normalizedTools = normalizeText(projectMeta.tools);
    const normalizedDate = normalizeText(projectMeta.date || projectMeta.year);
    const normalizedLink = normalizeText(projectMeta.link);
    const legacyType = normalizeText(projectMeta.type) || "Project";
    const legacyLocation = normalizeText(projectMeta.location) || "India";
    const legacyArea = normalizeText(projectMeta.area) || "Various";
    const legacyCategory = normalizeText(projectMeta.category) || "public";
    const legacyHeroGradient =
      normalizeText(projectMeta.heroGradient) ||
      "linear-gradient(135deg, #4f46e5 0%, #1e3a8a 100%)";
    const details = Array.isArray(projectMeta.details)
      ? projectMeta.details.filter((item) => item && item.label && item.value)
      : [];
    const heroSrc = images.length > 0 ? images[0].src : "";
    const downloads = downloadFiles.map((file) => {
      const ext = path.extname(file).toLowerCase().slice(1).toUpperCase();
      return {
        name: path.parse(file).name.replace(/[_-]+/g, " ").trim(),
        file: `../assets/projects/${projectId}/${encodeURIComponent(file)}`,
        size: ext,
      };
    });

    projects[projectId] = {
      title: normalizeText(projectMeta.title) || projectId,
      subtitle: normalizeText(projectMeta.subtitle) || "Project",
      year: normalizeText(projectMeta.year) || String(new Date().getFullYear()),
      type: legacyType,
      location: legacyLocation,
      area: legacyArea,
      category: legacyCategory,
      heroGradient: legacyHeroGradient,
      details,
      heroSrc,
      date: normalizedDate,
      tools: normalizedTools || "AutoCAD, SketchUp",
      link: normalizedLink,
      description:
        descriptionLines.length > 0
          ? descriptionLines
          : [normalizedDescription || "Project showcase."],
      images,
      downloads,
      metadata: projectMeta,
    };
  }

  if (!validatePortfolioJson(projects)) {
    throw new Error("JSON format validation failed for portfolio.json");
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(
    outputJsonPath,
    `${JSON.stringify(projects, null, 2)}\n`,
    "utf-8",
  );
  console.log(`portfolio.json created: ${outputJsonPath}`);

  const pageCount = await buildPortfolioPdf(projects, config, outputPdfPath);
  console.log(`portfolio.pdf created: ${outputPdfPath} (${pageCount} pages)`);
}

generate().catch((error) => {
  console.error(`Generation failed: ${error.message}`);
  process.exit(1);
});
