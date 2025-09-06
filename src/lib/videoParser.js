"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVideoLink = parseVideoLink;
function parseVideoLink(raw) {
    if (!raw)
        return null;
    var url = raw.trim();
    // Instagram
    if (/instagram\.com/i.test(url)) {
        var m = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
        if (m) {
            return {
                platform: "instagram",
                videoId: m[1],
                cleanUrl: "https://www.instagram.com/reel/".concat(m[1], "/"),
            };
        }
        return { platform: "instagram", videoId: null, cleanUrl: url.split("?")[0] };
    }
    // Facebook / fb.watch
    if (/facebook\.com|fb\.watch/i.test(url)) {
        var patterns = [
            /facebook\.com\/.*\/videos\/(\d+)/,
            /facebook\.com\/watch\/\?v=(\d+)/,
            /fb\.watch\/([A-Za-z0-9_-]+)/,
        ];
        for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
            var p = patterns_1[_i];
            var m = url.match(p);
            if (m) {
                return {
                    platform: "facebook",
                    videoId: m[1],
                    cleanUrl: "https://www.facebook.com/watch/?v=".concat(m[1]),
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
