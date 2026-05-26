"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildLineShareUrl,
  buildShareMessage,
  buildShareText,
  buildXShareUrl,
} from "@/lib/share";

type ShareButtonsProps = {
  resultTitle: string;
  typeCode: string;
};

function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=550,height=420");
}

export function ShareButtons({ resultTitle, typeCode }: ShareButtonsProps) {
  const [siteUrl, setSiteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSiteUrl(`${window.location.origin}/`);
  }, []);

  const shareText = buildShareText(resultTitle, typeCode);
  const shareMessage = siteUrl ? buildShareMessage(shareText, siteUrl) : shareText;

  const handleXShare = useCallback(() => {
    if (!siteUrl) return;
    openShareWindow(buildXShareUrl(shareText, siteUrl));
  }, [shareText, siteUrl]);

  const handleLineShare = useCallback(() => {
    if (!siteUrl) return;
    openShareWindow(buildLineShareUrl(shareText, siteUrl));
  }, [shareText, siteUrl]);

  const handleCopy = useCallback(async () => {
    if (!siteUrl) return;
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("以下をコピーしてください", shareMessage);
    }
  }, [shareMessage, siteUrl]);

  const handleNativeShare = useCallback(async () => {
    if (!siteUrl || !navigator.share) return;
    try {
      await navigator.share({
        title: "逃避診断",
        text: shareText,
        url: siteUrl,
      });
    } catch {
      // User cancelled or share failed — no action needed
    }
  }, [shareText, siteUrl]);

  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const disabled = !siteUrl;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-stone-800">結果をシェア</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <button
          type="button"
          onClick={handleXShare}
          disabled={disabled}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-stone-900 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          aria-label="Xでシェア"
        >
          <XIcon />
          <span>X</span>
        </button>
        <button
          type="button"
          onClick={handleLineShare}
          disabled={disabled}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#06C755] text-sm font-medium text-white transition hover:bg-[#05b34c] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#06C755]"
          aria-label="LINEでシェア"
        >
          <LineIcon />
          <span>LINE</span>
        </button>
        <button
          type="button"
          onClick={handleCopy}
          disabled={disabled}
          className="flex h-11 items-center justify-center rounded-xl border border-stone-300 bg-white text-sm font-medium text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          aria-label="リンクをコピー"
        >
          {copied ? "コピーしました" : "リンクをコピー"}
        </button>
        {canNativeShare ? (
          <button
            type="button"
            onClick={handleNativeShare}
            disabled={disabled}
            className="flex h-11 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 text-sm font-medium text-teal-800 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            aria-label="その他のアプリでシェア"
          >
            その他
          </button>
        ) : (
          <span className="hidden sm:block" aria-hidden />
        )}
      </div>
      <p className="text-xs text-stone-400">
        シェア先の友だちは診断トップから、自分のタイプを診断できます。
      </p>
    </div>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}
