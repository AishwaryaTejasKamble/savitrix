import { PROMPT_CATALOGUE } from './promptCatalogue';
import type { PromptCategory, PromptItem } from './types';
export const ALL_PROMPTS: PromptItem[] = PROMPT_CATALOGUE.map(meta => ({...meta,prompt:''}));

export const PROMPT_CATEGORIES: PromptCategory[] = [
  'Lesson Planning',
  'Classroom Teaching',
  'Student Engagement',
  'Assessment and Quiz',
  'Feedback and Student Support',
  'Parent Communication',
  'Exam Preparation',
  'Content Creation',
  'Classroom Management',
  'Teacher Productivity',
  'Teaching Materials',
  'Worksheets',
  'Activities',
  'Presentations',
  'Personalized Learning',
  'Administration',
  'Research',
  'Creative Teaching',
];

export const TRANSLATION_LANGUAGES = [
  'Marathi',
  'Hindi',
  'English',
  'Spanish',
  'French',
  'German',
  'Arabic',
  'Tamil',
  'Telugu',
  'Bengali',
  'Gujarati',
  'Kannada',
  'Urdu',
] as const;

export type TranslationLanguage = (typeof TRANSLATION_LANGUAGES)[number];

export function buildTranslationPrompt(promptText: string, language: string): string {
  return `Translate the following teaching prompt into ${language}. Preserve all bracketed placeholders (such as [Grade/Class], [Topic], [grade], [topic]) exactly in English, keep the formatting clear, and return only the translated prompt:\n\n${promptText}`;
}

export function getChatGPTUrl(text: string): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(text)}`;
}

export function getClaudeUrl(text: string): string {
  return `https://claude.ai/new?q=${encodeURIComponent(text)}`;
}

export function getGeminiUrl(text: string): string {
  return `https://gemini.google.com/app?q=${encodeURIComponent(text)}`;
}
