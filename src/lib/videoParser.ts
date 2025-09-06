export interface ParseResult {
  cleanUrl: string;
  videoId: string | null;
  platform: string;
}

export function parseVideoLink(raw: string): ParseResult | null {
  if (!raw) return null;
  const url = raw.trim();

  // Instagram
  if (/instagram\.com/i.test(url)) {
    const m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    if (m) {
      return {
        platform: "instagram",
        videoId: m[1],
        cleanUrl: `https://www.instagram.com/reel/${m[1]}/`,
      };
    }
    return { platform: "instagram", videoId: null, cleanUrl: url.split("?")[0] };
  }

  // Facebook / fb.watch
  if (/facebook\.com|fb\.watch/i.test(url)) {
    const patterns = [
      /facebook\.com\/.*\/videos\/(\d+)/,
      /facebook\.com\/watch\/\?v=(\d+)/,
      /fb\.watch\/([A-Za-z0-9_-]+)/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) {
        return {
          platform: "facebook",
          videoId: m[1],
          cleanUrl: `https://www.facebook.com/watch/?v=${m[1]}`,
        };
      }
    }
    return { platform: "facebook", videoId: null, cleanUrl: url.split("?")[0] };
  }

  // 小紅書
  if (/xhslink\.com/i.test(url)) {
    return { platform: "xiaohongshu", videoId: null, cleanUrl: url.split("?")[0] };
  }

  return { platform: "unsupported", videoId: null, cleanUrl: url.split("?")[0] };
}
