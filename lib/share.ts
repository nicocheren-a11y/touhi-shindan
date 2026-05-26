export function buildShareText(resultTitle: string, typeCode: string): string {
  return `逃避診断の結果は「${resultTitle}」(${typeCode})でした！あなたも16タイプから自分の逃げ方をチェックしてみて`;
}

export function buildXShareUrl(text: string, url: string): string {
  const params = new URLSearchParams({
    text,
    url,
    hashtags: "逃避診断",
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export function buildLineShareUrl(text: string, url: string): string {
  const message = `${text}\n${url}`;
  return `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
}

export function buildShareMessage(text: string, url: string): string {
  return `${text}\n${url}`;
}
