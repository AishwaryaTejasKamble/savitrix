export type PromptSource = 'playbook' | 'workbook-bonus' | 'workbook-chapter';

export type PromptCategory =
  | 'Lesson Planning'
  | 'Classroom Teaching'
  | 'Student Engagement'
  | 'Assessment and Quiz'
  | 'Feedback and Student Support'
  | 'Parent Communication'
  | 'Exam Preparation'
  | 'Content Creation'
  | 'Classroom Management'
  | 'Teacher Productivity'
  | 'Teaching Materials'
  | 'Worksheets'
  | 'Activities'
  | 'Presentations'
  | 'Personalized Learning'
  | 'Administration'
  | 'Research'
  | 'Creative Teaching';

export interface PromptItem {
  id: string;
  number: number;
  title: string;
  category: PromptCategory;
  source: PromptSource;
  sourceLabel: string;
  sectionLabel: string;
  problem?: string;
  prompt: string;
  solutionMethod?: string;
}

export interface BestPractice {
  number: number;
  title: string;
  description: string;
}

export interface TeacherUser {
  userId: string;
  fullName: string;
  email: string;
  schoolOrSubject?: string;
}
