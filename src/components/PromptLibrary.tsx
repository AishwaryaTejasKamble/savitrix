import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';
import {
  ALL_PROMPTS,
  PROMPT_CATEGORIES,
  TRANSLATION_LANGUAGES,
} from '../data/prompts';
import { PromptCategory, PromptSource, TeacherUser } from '../data/types';
import { BestPracticesModal } from './BestPracticesModal';
import { PromptCard } from './PromptCard';
import { useTeacherWorkspace } from '../utils/useTeacherWorkspace';
import type { PromptDraft } from '../utils/personalPrompts';
import { FirstUseGuide } from './FirstUseGuide';
import { SavedPromptEditor } from './SavedPromptEditor';
import { SavedPrompts } from './SavedPrompts';

interface PromptLibraryProps {
  user?: TeacherUser;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ user, onLogout, onOpenAdmin }) => {
  const workspace = useTeacherWorkspace();
  const [view, setView] = useState<'library' | 'favourites' | 'saved'>('library');
  const [draft, setDraft] = useState<PromptDraft | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | PromptCategory>('all');
  const [selectedSource, setSelectedSource] = useState<'all' | PromptSource>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Marathi');
  const [showBestPractices, setShowBestPractices] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const libraryTopRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);

  const handleNotify = (msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredPrompts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ALL_PROMPTS.filter((item) => {
      if (view === 'favourites' && !workspace.favourites.has(item.id)) return false;
      if (selectedSource !== 'all' && item.source !== selectedSource) {
        return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.prompt.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q) ||
        (item.problem && item.problem.toLowerCase().includes(q)) ||
        (item.solutionMethod && item.solutionMethod.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory, selectedSource, view, workspace.favourites]);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (!categoryScrollRef.current) return;
    const offset = direction === 'left' ? -280 : 280;
    categoryScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSource('all');
    libraryTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Indigo Hero Banner */}
      <header className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-8">
          {/* Top Account Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-indigo-700/50">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
              <BookOpen className="w-4 h-4 text-indigo-300" />
              <span>SAVITRIX</span>
            </div>
            {user && onLogout && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex flex-col items-start gap-2">
                <span className="text-indigo-100 truncate max-w-[240px]">
                  {user.fullName}{' '}
                  <span className="text-indigo-300 font-mono text-xs">(@{user.userId})</span>
                </span>
                {onOpenAdmin && <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5" />
                  <span>Admin dashboard</span>
                </button>}
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>

          {/* Hero Title & Subtitle */}
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            AI for Teachers
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            The Practical Prompt Playbook &amp; Practical AI Workbook — browse all{' '}
            <span className="font-semibold text-white tabular-nums">{ALL_PROMPTS.length}</span>{' '}
            ready-to-use classroom prompts, copy them for your lessons, ask an AI tool to translate
            a prompt, or open directly in ChatGPT, Claude, or Gemini.
          </p>

          {/* Header Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <span>Browse all prompts</span>
              <span className="font-mono text-xs text-indigo-200 tabular-nums">
                {ALL_PROMPTS.length}
              </span>
            </button>

            <button type="button" onClick={() => workspace.setGuideOpen(true)} disabled={workspace.loading || Boolean(workspace.error)} className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">Quick start guide</button>
            <button
              type="button"
              onClick={() => setShowBestPractices(true)}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Teacher best practices</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <nav aria-label="Prompt collections" className="flex flex-wrap gap-2">
          {([['library', 'All prompts'], ['favourites', `Favourites (${workspace.favourites.size})`], ['saved', `My saved prompts (${workspace.saved.filter(r => !r.removed_at).length})`]] as const).map(([tab,label]) => <button key={tab} type="button" aria-current={view === tab ? 'page' : undefined} onClick={() => {setView(tab);setSearchQuery('');setSelectedCategory('all');setSelectedSource('all');}} className={`rounded-lg px-4 py-2.5 text-sm font-semibold border ${view === tab ? 'bg-indigo-700 border-indigo-700 text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'}`}>{label}</button>)}
          <button type="button" onClick={workspace.reload} disabled={workspace.loading || workspace.busy || workspace.favouriteBusy.size > 0} className="rounded-lg px-3 py-2 text-xs text-slate-600 border border-slate-200 bg-white disabled:opacity-40">Refresh my workspace</button>
        </nav>
        {workspace.loading && <p role="status" className="text-sm text-slate-600">Syncing your favourites and saved prompts…</p>}
        {workspace.error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{workspace.error} <button type="button" onClick={workspace.reload} className="font-semibold underline">Retry</button></div>}
        {view === 'saved' ? (!workspace.loading && !workspace.error && <SavedPrompts rows={workspace.saved} busy={workspace.busy} onEdit={setDraft} onArchive={workspace.archivePrompt} onNotify={handleNotify} />) : <>
        {view === 'favourites' && <div><h2 className="text-xl font-bold">Favourites</h2><p className="mt-1 text-sm text-slate-600">Your starred library prompts, synced with your account.</p></div>}
        {/* Two Info Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                How to use this library
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                1. Search or choose a category. 2. Copy a prompt and replace placeholders such as{' '}
                <code className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">
                  [Grade/Class]
                </code>{' '}
                and{' '}
                <code className="font-mono text-xs font-semibold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">
                  [Topic]
                </code>
                . 3. Click <strong className="text-slate-800">Open ChatGPT</strong>,{' '}
                <strong className="text-slate-800">Claude</strong>, or{' '}
                <strong className="text-slate-800">Gemini</strong> to launch with the prompt ready.
              </p>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                For translation, choose your target language in the dropdown below and click{' '}
                <strong className="text-slate-800">Ask AI to translate</strong> on any card.
              </p>
            </div>

            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs sm:text-sm text-amber-950">
              <span className="font-semibold">Privacy reminder:</span> Do not enter personal student
              data, private records, medical information, or sensitive family details into AI tools.
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                Complete 2-Guide Coverage
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Every prompt from both uploaded teacher guides is indexed here with original wording,
                problem context, and classroom guidance:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
                <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span>Practical Prompt Playbook</span>
                  <span className="font-mono text-xs font-semibold text-indigo-700 tabular-nums">
                    101 prompts
                  </span>
                </li>
                <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                  <span>Workbook · 105 Bonus Prompts</span>
                  <span className="font-mono text-xs font-semibold text-indigo-700 tabular-nums">
                    105 prompts
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Workbook · Chapter &amp; Master Prompts</span>
                  <span className="font-mono text-xs font-semibold text-indigo-700 tabular-nums">
                    35 prompts
                  </span>
                </li>
              </ul>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Use the source filter below to view all prompts together or focus on one guide.
            </p>
          </div>
        </section>

        {/* Search & Filter Controls */}
        <section ref={libraryTopRef} className="space-y-3.5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts, topics, or wording..."
                aria-label="Search prompts"
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Source Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value as 'all' | PromptSource)}
                aria-label="Filter by source guide"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-800"
              >
                <option value="all">All guides (241)</option>
                <option value="playbook">Playbook (101)</option>
                <option value="workbook-bonus">Workbook: 105 Prompts</option>
                <option value="workbook-chapter">Workbook: Chapters (35)</option>
              </select>
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as 'all' | PromptCategory)}
                aria-label="Filter by category"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-800"
              >
                <option value="all">All {PROMPT_CATEGORIES.length} categories</option>
                {PROMPT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Translation Language Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                aria-label="Target translation language"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-slate-800"
              >
                {TRANSLATION_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    Translate to {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Horizontal Category Filter Strip */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCategories('left')}
              aria-label="Scroll categories left"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={categoryScrollRef}
              className="category-scroll flex items-center gap-2 overflow-x-auto py-1 flex-1"
            >
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-indigo-700 border-indigo-700 text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                All Prompts
              </button>
              {PROMPT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-indigo-700 border-indigo-700 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollCategories('right')}
              aria-label="Scroll categories right"
              className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Count & Hint Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-1">
            <span className="tabular-nums font-medium">
              {filteredPrompts.length} of {ALL_PROMPTS.length} prompts
            </span>
            <span>Choose &ldquo;Ask AI to translate&rdquo; on any card.</span>
          </div>
        </section>

        {/* Prompt Cards List */}
        {view === 'favourites' && (workspace.loading || workspace.error) ? null : filteredPrompts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p className="font-display text-base font-bold text-slate-900">
              {view === 'favourites' && !workspace.favourites.size ? 'Your favourites will appear here' : 'No prompts match your current search or filter'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {view === 'favourites' && !workspace.favourites.size ? 'Choose All prompts and tap the star on any prompt you want to keep handy.' : 'Try clearing your search term or switching back to all categories.'}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <section className="space-y-4">
            {filteredPrompts.map((item, idx) => (
              <PromptCard
                key={item.id}
                item={item}
                displayIndex={idx + 1}
                selectedLanguage={selectedLanguage}
                onNotify={handleNotify}
                isFavourite={workspace.favourites.has(item.id)}
                favouriteBusy={workspace.favouriteBusy.has(item.id)}
                personalReady={!workspace.loading && !workspace.error}
                onToggleFavourite={() => workspace.toggleFavourite(item.id)}
                onSavePrompt={setDraft}
              />
            ))}
          </section>
        )}

        {/* Back to Top */}
        {filteredPrompts.length > 8 && (
          <div className="flex justify-center pt-4 pb-8">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to top</span>
            </button>
          </div>
        )}
        </>}
      </main>
      {draft && <SavedPromptEditor draft={draft} onClose={() => setDraft(null)} onSave={async value => {await workspace.savePrompt(value);handleNotify(value.id ? 'Saved prompt updated.' : 'Saved to My saved prompts.');}} />}
      {workspace.guideOpen && !workspace.loading && !workspace.error && <FirstUseGuide onComplete={workspace.completeGuide} />}

      {/* Best Practices Modal */}
      <BestPracticesModal
        isOpen={showBestPractices}
        onClose={() => setShowBestPractices(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 max-w-sm"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
