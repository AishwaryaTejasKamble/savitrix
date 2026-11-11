import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Check, Copy, Languages, RotateCcw, SlidersHorizontal } from 'lucide-react';
import {
  buildTranslationPrompt,
  getChatGPTUrl,
  getClaudeUrl,
  getGeminiUrl,
} from '../data/prompts';
import { PromptItem } from '../data/types';

interface PromptCardProps {
  item: PromptItem;
  displayIndex: number;
  selectedLanguage: string;
  onNotify: (message: string) => void;
}

function extractPlaceholders(text: string): string[] {
  const matches = text.match(/\[[^\]]+\]/g) || [];
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const m of matches) {
    if (!seen.has(m)) {
      seen.add(m);
      unique.push(m);
    }
  }
  return unique;
}

function applyPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\[[^\]]+\]/g, (match) => {
    const val = values[match]?.trim();
    return val ? val : match;
  });
}

function renderHighlightedPrompt(
  text: string,
  values: Record<string, string>
): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\])/g);
  return parts.map((part, idx) => {
    if (part.startsWith('[') && part.endsWith(']')) {
      const customVal = values[part]?.trim();
      if (customVal) {
        return (
          <span
            key={idx}
            className="text-emerald-800 font-semibold bg-emerald-100/80 px-1 rounded"
          >
            {customVal}
          </span>
        );
      }
      return (
        <span key={idx} className="text-indigo-700 font-medium bg-indigo-50/80 px-1 rounded">
          {part}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  displayIndex,
  selectedLanguage,
  onNotify,
}) => {
  const [copied, setCopied] = useState(false);
  const [showTranslateBar, setShowTranslateBar] = useState(false);
  const [showCustomizeBar, setShowCustomizeBar] = useState(false);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});

  const placeholders = useMemo(() => extractPlaceholders(item.prompt), [item.prompt]);

  const effectivePrompt = useMemo(
    () => applyPlaceholders(item.prompt, placeholderValues),
    [item.prompt, placeholderValues]
  );

  const hasCustomValues = useMemo(
    () => Object.values(placeholderValues).some((v) => v.trim().length > 0),
    [placeholderValues]
  );

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onNotify(label);
    } catch {
      onNotify('Prompt ready — select and copy if clipboard is blocked.');
    }
  };

  const handleCopyPrompt = async () => {
    await copyText(
      effectivePrompt,
      hasCustomValues
        ? `Customized prompt #${displayIndex} copied to clipboard`
        : `Prompt #${displayIndex} copied to clipboard`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAgentLaunch = (agentName: string, textToCopy: string) => {
    navigator.clipboard?.writeText(textToCopy).catch(() => {});
    onNotify(`Opening ${agentName} with prompt ready (also copied to clipboard).`);
  };

  const handlePlaceholderChange = (token: string, value: string) => {
    setPlaceholderValues((prev) => ({ ...prev, [token]: value }));
  };

  const handleResetCustom = () => {
    setPlaceholderValues({});
  };

  const translationPayload = buildTranslationPrompt(effectivePrompt, selectedLanguage);

  return (
    <article className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-colors">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold px-2.5 py-1 rounded-md tabular-nums shrink-0 mt-0.5">
          #{displayIndex}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-slate-900 leading-snug">
            {item.title}
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mt-0.5">
            <span>{item.sectionLabel}</span>
            <span aria-hidden="true">·</span>
            <span>{item.sourceLabel}</span>
          </div>
        </div>
      </div>

      {/* Problem statement (if present) */}
      {item.problem && (
        <p className="mt-3.5 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Problem: </span>
          {item.problem}
        </p>
      )}

      {/* Prompt well */}
      <div className="mt-3.5 bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-[13.5px] leading-relaxed text-slate-800">
        {renderHighlightedPrompt(item.prompt, placeholderValues)}
      </div>

      {/* Solution Method (if present) */}
      {item.solutionMethod && (
        <div className="mt-3 bg-emerald-50/70 border border-emerald-200 rounded-lg px-3.5 py-2.5 text-sm text-emerald-950">
          <span className="font-semibold text-emerald-900">Solution Method: </span>
          {item.solutionMethod}
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleCopyPrompt}
          className="inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy prompt'}</span>
        </button>

        {placeholders.length > 0 && (
          <button
            type="button"
            onClick={() => setShowCustomizeBar((prev) => !prev)}
            aria-expanded={showCustomizeBar}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
              showCustomizeBar || hasCustomValues
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{hasCustomValues ? 'Customize prompt (Active)' : 'Customize prompt'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowTranslateBar((prev) => !prev)}
          aria-expanded={showTranslateBar}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border transition-colors whitespace-nowrap shrink-0 min-h-[38px] ${
            showTranslateBar
              ? 'bg-indigo-100 border-indigo-300 text-indigo-900'
              : 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100'
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>Ask AI to translate</span>
        </button>

        <a
          href={getChatGPTUrl(effectivePrompt)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAgentLaunch('ChatGPT', effectivePrompt)}
          className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
        >
          <span>Open ChatGPT</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </a>

        <a
          href={getClaudeUrl(effectivePrompt)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAgentLaunch('Claude', effectivePrompt)}
          className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
        >
          <span>Claude</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </a>

        <a
          href={getGeminiUrl(effectivePrompt)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleAgentLaunch('Gemini', effectivePrompt)}
          className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px]"
        >
          <span>Gemini</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
        </a>
      </div>

      {/* Inline Customize Prompt Panel */}
      {showCustomizeBar && placeholders.length > 0 && (
        <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-slate-800">
              Fill in the placeholders below to customize this prompt. All buttons above will use your updated prompt.
            </p>
            {hasCustomValues && (
              <button
                type="button"
                onClick={handleResetCustom}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {placeholders.map((token) => {
              const label = token.slice(1, -1);
              return (
                <div key={token}>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    value={placeholderValues[token] ?? ''}
                    onChange={(e) => handlePlaceholderChange(token, e.target.value)}
                    placeholder={`Enter ${label}...`}
                    className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-900"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline Translation Action Strip */}
      {showTranslateBar && (
        <div className="mt-3 rounded-lg bg-indigo-50/70 border border-indigo-200 p-3 flex flex-wrap items-center justify-between gap-2.5">
          <p className="text-xs text-indigo-950">
            Translate into <strong className="font-semibold">{selectedLanguage}</strong> (preserves{' '}
            <code className="font-mono text-indigo-800">[brackets]</code>):
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                copyText(translationPayload, `Translation request (${selectedLanguage}) copied`)
              }
              className="inline-flex items-center gap-1 bg-white hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <Copy className="w-3 h-3" />
              <span>Copy translation request</span>
            </button>
            <a
              href={getChatGPTUrl(translationPayload)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAgentLaunch(`ChatGPT (${selectedLanguage})`, translationPayload)}
              className="inline-flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <span>ChatGPT</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={getClaudeUrl(translationPayload)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAgentLaunch(`Claude (${selectedLanguage})`, translationPayload)}
              className="inline-flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <span>Claude</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <a
              href={getGeminiUrl(translationPayload)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleAgentLaunch(`Gemini (${selectedLanguage})`, translationPayload)}
              className="inline-flex items-center gap-1 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap"
            >
              <span>Gemini</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </article>
  );
};
