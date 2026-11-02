"use client";

import * as React from "react";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, Copy } from "lucide-react";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("surajyadav@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="flex flex-col gap-10 px-8 md:px-20 py-20 max-w-4xl mx-auto text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">
          Let&apos;s Build Together
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Have a project in mind? Let&apos;s create something memorable.
        </h2>
        <p className="text-base text-slate-400 max-w-xl">
          Currently taking on select product design advisory, design system architectures, and staff-level design engineering roles for {siteConfig.availability.period}.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Button size="lg" className="rounded-full gap-2 px-8 shadow-xl shadow-blue-500/20" asChild>
          <a href={siteConfig.links.email}>
            <Mail className="h-4 w-4" />
            Send an Email
          </a>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleCopyEmail}
          className="rounded-full gap-2 px-6"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Copied to Clipboard!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-400" />
              Copy Email Address
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
