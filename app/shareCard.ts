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
    ctx.font = `400 ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

export async function buildPhotoGridShareCard(
  photoUrls: string[],
  opts: { kicker?: string; title: string; subtitle?: string; cols?: number; rows?: number }
): Promise<Blob | null> {
  const W = 1080, H = 1920;
  const cols = opts.cols ?? 2, rows = opts.rows ?? 3;
  const cellW = W / cols, cellH = H / rows;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  try {
    const urls = pickRandom(photoUrls, cols * rows);
    const imgs = await Promise.all(urls.map(loadImage));
    imgs.forEach((img, i) => {
      const x = (i % cols) * cellW, y = Math.floor(i / cols) * cellH;
      const scale = Math.max(cellW / img.width, cellH / img.height);
      const sw = cellW / scale, sh = cellH / scale;
      const sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, x, y, cellW, cellH);
    });
  } catch {
    return null;
  }

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "rgba(10,10,10,0.55)");
  grad.addColorStop(0.45, "rgba(10,10,10,0.2)");
  grad.addColorStop(1, "rgba(10,10,10,0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const pad = 64;
  const maxTextWidth = W - pad * 2;
  let ty = 130;

  if (opts.kicker) {
    ctx.fillStyle = "#c4a882";
    ctx.font = "600 28px -apple-system, sans-serif";
    ctx.fillText(opts.kicker, pad, ty);
    ty += 102;
  } else {
    ty += 40;
  }

  const titleSize = fitFontSize(ctx, opts.title, maxTextWidth, 100, 40, "Georgia, serif");
  ctx.font = `400 ${titleSize}px Georgia, serif`;
  ctx.fillStyle = "#f0ece4";
  ctx.fillText(opts.title, pad, ty);

  if (opts.subtitle) {
    ty += titleSize * 0.55 + 30;
    const subtitleSize = fitFontSize(ctx, opts.subtitle, maxTextWidth, 40, 22, "Georgia, serif");
    ctx.font = `400 ${subtitleSize}px Georgia, serif`;
    ctx.fillStyle = "rgba(240,236,228,0.65)";
    ctx.fillText(opts.subtitle, pad, ty);
  }

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
