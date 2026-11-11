import React from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { PLAYBOOK_BEST_PRACTICES } from '../data/playbookPrompts';

interface BestPracticesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BestPracticesModal: React.FC<BestPracticesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="best-practices-title"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-indigo-700" />
            <h2 id="best-practices-title" className="font-display text-lg font-bold text-slate-900">
              Teacher Best Practices & AI Safety
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Teacher Prompt Formula */}
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
            <p className="text-xs font-semibold text-indigo-800 mb-1">The Teacher Prompt Formula</p>
            <p className="font-mono text-sm font-semibold text-indigo-950">
              ROLE + TASK + CONTEXT + STUDENTS + REQUIREMENTS + FORMAT
            </p>
            <p className="text-xs text-indigo-800/90 mt-1.5">
              Workflow: Teacher &rarr; AI Draft &rarr; Teacher Review &rarr; Classroom-Ready Final Work
            </p>
          </div>

          {/* 5 Best Practices */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-slate-900">
              5 Core Best Practices for Teachers
            </h3>
            {PLAYBOOK_BEST_PRACTICES.map((item) => (
              <div
                key={item.number}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {item.number}. {item.title}
                </p>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Safety Checklist */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
            <h3 className="font-display text-sm font-bold text-amber-950 mb-2">
              Personal AI Safety Checklist
            </h3>
            <ul className="space-y-1.5 text-sm text-amber-900">
              <li>• Is the information factually accurate and age-appropriate?</li>
              <li>• Did I remove all student names, grades linked to names, and private records?</li>
              <li>• Did I verify important facts, math answers, and references myself?</li>
              <li>• Did I adapt the tone and difficulty for my actual classroom?</li>
            </ul>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
