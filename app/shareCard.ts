function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxSize: number, minSize: number, fontFamily: string): number {
  let size = maxSize;
  while (size > minSize) {
    ctx.font = `700 ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export async function buildPhotoGridShareCard(
  photoUrls: string[],
  opts: { kicker?: string; title: string; subtitle?: string; cols?: number; rows?: number; backdropUrl?: string; backdropColor?: string }
): Promise<Blob | null> {
  const W = 1080, H = 1920;
  const cols = opts.cols ?? 3, rows = opts.rows ?? 3;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let imgs: HTMLImageElement[];
  let bg: HTMLImageElement | null = null;
  try {
    const urls = pickRandom(photoUrls, cols * rows);
    imgs = await Promise.all(urls.map(loadImage));
    if (!opts.backdropColor) {
      bg = opts.backdropUrl ? await loadImage(opts.backdropUrl) : imgs[0];
    }
  } catch {
    return null;
  }

  if (opts.backdropColor) {
    // Flat backdrop in the trip's own theme color, no photo.
    ctx.fillStyle = opts.backdropColor;
    ctx.fillRect(0, 0, W, H);
  } else if (bg) {
    // Blurred backdrop — the page's hero photo when given, otherwise one of the grid photos.
    ctx.save();
    ctx.filter = "blur(70px) brightness(0.55)";
    const bgScale = Math.max(W / bg.width, H / bg.height) * 1.2;
    const bgW = bg.width * bgScale, bgH = bg.height * bgScale;
    ctx.drawImage(bg, (W - bgW) / 2, (H - bgH) / 2, bgW, bgH);
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, W, H);
  }

  // White card
  const cardX = 48, cardY = 160, cardW = W - cardX * 2, cardH = H - cardY * 2;
  const radius = 32;

  ctx.save();
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.clip();
  ctx.fillStyle = "#fdfcfa";
  ctx.fillRect(cardX, cardY, cardW, cardH);

  const innerPad = 18;
  const footerH = 140;
  const gridX = cardX + innerPad, gridY = cardY + innerPad;
  const gridW = cardW - innerPad * 2;
  const gridH = cardH - innerPad * 2 - footerH;
  const gap = 5;
  const cellW = (gridW - gap * (cols - 1)) / cols;
  const cellH = (gridH - gap * (rows - 1)) / rows;

  imgs.forEach((img, i) => {
    const x = gridX + (i % cols) * (cellW + gap);
    const y = gridY + Math.floor(i / cols) * (cellH + gap);
    const scale = Math.max(cellW / img.width, cellH / img.height);
    const sw = cellW / scale, sh = cellH / scale;
    const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
  });

  const footerBaseline = gridY + gridH + footerH - 40;
  const rightEdge = gridX + gridW;

  const title = opts.subtitle ? `${opts.title} · ${opts.subtitle}` : opts.title;
  const titleSize = fitFontSize(ctx, title, gridW * 0.62, 54, 28, "Georgia, serif");

  if (opts.kicker) {
    ctx.textAlign = "left";
    ctx.fillStyle = "#9a9490";
    ctx.font = "600 18px -apple-system, sans-serif";
    ctx.fillText(opts.kicker.toUpperCase(), gridX, footerBaseline - titleSize - 8);
  }

  ctx.textAlign = "left";
  ctx.fillStyle = "#161616";
  ctx.font = `700 ${titleSize}px Georgia, serif`;
  ctx.fillText(title, gridX, footerBaseline);

  ctx.textAlign = "right";
  ctx.fillStyle = "#4a4a4a";
  ctx.font = "600 24px -apple-system, sans-serif";
  ctx.fillText("mattravels.com", rightEdge, footerBaseline);

  ctx.restore();

  // Thin card border for definition against the blurred backdrop.
  roundRectPath(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.strokeStyle = "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png", 0.92));
}

export async function shareOrCopyLink(opts: {
  title: string;
  text: string;
  url: string;
  fileBlob: Blob | null;
  filename: string;
  fallbackImgUrl?: string;
  onFallbackMessage?: (msg: string) => void;
}) {
  const { title, text, url, fileBlob, filename, fallbackImgUrl, onFallbackMessage } = opts;
  let file: File | null = fileBlob ? new File([fileBlob], filename, { type: fileBlob.type || "image/png" }) : null;

  if (!file && fallbackImgUrl) {
    try {
      const res = await fetch(fallbackImgUrl);
      const blob = await res.blob();
      file = new File([blob], "share.jpg", { type: blob.type || "image/jpeg" });
    } catch {}
  }

  const shareData = { title, text, url };
  const canShareFiles = !!file && !!navigator.canShare?.({ files: [file] });

  if (canShareFiles) {
    // Many share targets (Messages, Instagram) drop the url when files are attached,
    // so copy it as a guaranteed fallback before handing off to the OS share sheet.
    try {
      await navigator.clipboard.writeText(url);
      onFallbackMessage?.("連結已複製，貼上分享");
    } catch {}
  }

  try {
    if (canShareFiles) {
      await navigator.share({ ...shareData, files: [file!] });
    } else if (navigator.share) {
      await navigator.share(shareData);
    } else {
      throw new Error("no share api");
    }
  } catch (err) {
    if ((err as Error)?.name === "AbortError") return;
    try {
      await navigator.clipboard.writeText(url);
      onFallbackMessage?.("連結已複製");
    } catch {}
  }
}
