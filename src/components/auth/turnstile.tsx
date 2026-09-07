"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        action: string;
        callback: (token: string) => void;
        "expired-callback": () => void;
        "error-callback": () => void;
      }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  action: "login" | "signup";
  onToken: (token: string | null) => void;
}

const SCRIPT_ID = "cloudflare-turnstile-script";

export function Turnstile({ action, onToken }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const enabled = process.env.NEXT_PUBLIC_TURNSTILE_ENABLED !== "false";
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!enabled || !siteKey || !containerRef.current) {
      onToken(null);
      return;
    }

    let cancelled = false;
    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: onToken,
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };

    const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (window.turnstile) {
      renderWidget();
    } else if (script) {
      script.addEventListener("load", renderWidget);
    } else {
      const newScript = document.createElement("script");
      newScript.id = SCRIPT_ID;
      newScript.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      newScript.async = true;
      newScript.defer = true;
      newScript.addEventListener("load", renderWidget);
      document.head.appendChild(newScript);
    }

    return () => {
      cancelled = true;
      if (script) script.removeEventListener("load", renderWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [action, enabled, onToken, siteKey]);

  if (!enabled) return null;

  if (!siteKey) {
    return <p className="text-sm text-red-400">La protección de seguridad no está configurada.</p>;
  }

  return <div ref={containerRef} className="min-h-[65px]" />;
}