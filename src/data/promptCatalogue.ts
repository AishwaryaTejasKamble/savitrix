import type { PromptItem } from "./types";
// Public catalogue only. Prompt bodies are loaded from Supabase after RLS checks.
export const PROMPT_CATALOGUE: Omit<PromptItem,"prompt"|"problem"|"solutionMethod">[] = [
  {
    "id": "pb-1",
    "number": 1,
    "title": "Complete Lesson Plan Generator",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-2",
    "number": 2,
    "title": "5E Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-3",
    "number": 3,
    "title": "Beginner-Friendly Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-4",
    "number": 4,
    "title": "Advanced Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-5",
    "number": 5,
    "title": "One-Page Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-6",
    "number": 6,
    "title": "Weekly Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-7",
    "number": 7,
    "title": "Monthly Academic Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-8",
    "number": 8,
    "title": "Substitute Teacher Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-9",
    "number": 9,
    "title": "Lesson Plan With Real-Life Examples",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-10",
    "number": 10,
    "title": "Revision Lesson Plan",
    "category": "Lesson Planning",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Lesson Planning Prompts"
  },
  {
    "id": "pb-11",
    "number": 11,
    "title": "Simple Explanation Generator",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-12",
    "number": 12,
    "title": "Concept Explanation With Analogy",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-13",
    "number": 13,
    "title": "Story-Based Teaching",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-14",
    "number": 14,
    "title": "Board Explanation Script",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-15",
    "number": 15,
    "title": "Question-Based Teaching",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-16",
    "number": 16,
    "title": "Misconception Finder",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-17",
    "number": 17,
    "title": "Difficult Topic Simplifier",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-18",
    "number": 18,
    "title": "Interactive Class Discussion",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-19",
    "number": 19,
    "title": "Quick Class Starter",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-20",
    "number": 20,
    "title": "Exit Ticket Questions",
    "category": "Classroom Teaching",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Teaching Prompts"
  },
  {
    "id": "pb-21",
    "number": 21,
    "title": "Fun Classroom Activity",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-22",
    "number": 22,
    "title": "Group Activity",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-23",
    "number": 23,
    "title": "Role Play Activity",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-24",
    "number": 24,
    "title": "Debate Topic Generator",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-25",
    "number": 25,
    "title": "Classroom Game",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-26",
    "number": 26,
    "title": "Think-Pair-Share Activity",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-27",
    "number": 27,
    "title": "Project-Based Learning Idea",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-28",
    "number": 28,
    "title": "Creative Assignment",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-29",
    "number": 29,
    "title": "Student Presentation Task",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-30",
    "number": 30,
    "title": "Low-Resource Activity",
    "category": "Student Engagement",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Student Engagement Prompts"
  },
  {
    "id": "pb-31",
    "number": 31,
    "title": "Multiple Choice Questions",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-32",
    "number": 32,
    "title": "Short Answer Questions",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-33",
    "number": 33,
    "title": "Long Answer Questions",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-34",
    "number": 34,
    "title": "Higher-Order Thinking Questions",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-35",
    "number": 35,
    "title": "Quiz With Difficulty Levels",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-36",
    "number": 36,
    "title": "Worksheet Generator",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-37",
    "number": 37,
    "title": "Answer Key Generator",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-38",
    "number": 38,
    "title": "Rubric Generator",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-39",
    "number": 39,
    "title": "Diagnostic Test",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-40",
    "number": 40,
    "title": "Remedial Test",
    "category": "Assessment and Quiz",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Assessment and Quiz Prompts"
  },
  {
    "id": "pb-41",
    "number": 41,
    "title": "Personalized Student Feedback",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-42",
    "number": 42,
    "title": "Positive Feedback Comments",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-43",
    "number": 43,
    "title": "Constructive Feedback",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-44",
    "number": 44,
    "title": "Feedback for Homework",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-45",
    "number": 45,
    "title": "Student Improvement Plan",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-46",
    "number": 46,
    "title": "Support for Slow Learners",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-47",
    "number": 47,
    "title": "Support for Advanced Learners",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-48",
    "number": 48,
    "title": "Student Motivation Message",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-49",
    "number": 49,
    "title": "Study Plan for Students",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-50",
    "number": 50,
    "title": "Parent-Friendly Student Progress Summary",
    "category": "Feedback and Student Support",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Feedback and Student Support Prompts"
  },
  {
    "id": "pb-51",
    "number": 51,
    "title": "Parent Meeting Message",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-52",
    "number": 52,
    "title": "Homework Reminder to Parents",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-53",
    "number": 53,
    "title": "Exam Preparation Message",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-54",
    "number": 54,
    "title": "Low Performance Communication",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-55",
    "number": 55,
    "title": "Appreciation Message to Parents",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-56",
    "number": 56,
    "title": "Attendance Concern Message",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-57",
    "number": 57,
    "title": "Behaviour Concern Message",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-58",
    "number": 58,
    "title": "Event Announcement",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-59",
    "number": 59,
    "title": "Project Submission Reminder",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-60",
    "number": 60,
    "title": "Parent-Teacher Meeting Summary",
    "category": "Parent Communication",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Parent Communication Prompts"
  },
  {
    "id": "pb-61",
    "number": 61,
    "title": "Exam Revision Notes",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-62",
    "number": 62,
    "title": "Important Questions List",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-63",
    "number": 63,
    "title": "Model Question Paper",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-64",
    "number": 64,
    "title": "Marking Scheme",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-65",
    "number": 65,
    "title": "Last-Minute Revision Plan",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-66",
    "number": 66,
    "title": "Formula Sheet",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-67",
    "number": 67,
    "title": "Memory Techniques",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-68",
    "number": 68,
    "title": "Exam Writing Tips",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-69",
    "number": 69,
    "title": "Practice Test With Answers",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-70",
    "number": 70,
    "title": "Weak Area Revision",
    "category": "Exam Preparation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Exam Preparation Prompts"
  },
  {
    "id": "pb-71",
    "number": 71,
    "title": "Classroom Notes",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-72",
    "number": 72,
    "title": "PowerPoint Slide Content",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-73",
    "number": 73,
    "title": "Infographic Content",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-74",
    "number": 74,
    "title": "Flashcards",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-75",
    "number": 75,
    "title": "Summary Generator",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-76",
    "number": 76,
    "title": "Vocabulary List",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-77",
    "number": 77,
    "title": "Reading Passage",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-78",
    "number": 78,
    "title": "Case Study",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-79",
    "number": 79,
    "title": "Classroom Poster Text",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-80",
    "number": 80,
    "title": "Student Handout",
    "category": "Content Creation",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Content Creation for Teachers"
  },
  {
    "id": "pb-81",
    "number": 81,
    "title": "Classroom Rules",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-82",
    "number": 82,
    "title": "Behaviour Management Plan",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-83",
    "number": 83,
    "title": "Handling Disruptive Students",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-84",
    "number": 84,
    "title": "Classroom Routine",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-85",
    "number": 85,
    "title": "Noise Control Strategies",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-86",
    "number": 86,
    "title": "Managing Group Work",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-87",
    "number": 87,
    "title": "Positive Reinforcement Ideas",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-88",
    "number": 88,
    "title": "Conflict Resolution",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-89",
    "number": 89,
    "title": "First Day of Class Plan",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-90",
    "number": 90,
    "title": "Classroom Reflection",
    "category": "Classroom Management",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Classroom Management Prompts"
  },
  {
    "id": "pb-91",
    "number": 91,
    "title": "Daily Teacher Planner",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-92",
    "number": 92,
    "title": "Weekly Teacher Planner",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-93",
    "number": 93,
    "title": "To-Do List Organizer",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-94",
    "number": 94,
    "title": "Report Writing Assistant",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-95",
    "number": 95,
    "title": "Meeting Agenda",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-96",
    "number": 96,
    "title": "Meeting Minutes",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-97",
    "number": 97,
    "title": "Email to Principal or Coordinator",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-98",
    "number": 98,
    "title": "Time-Saving Teaching Workflow",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-99",
    "number": 99,
    "title": "Teacher Self-Improvement Plan",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-100",
    "number": 100,
    "title": "End-of-Term Review",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Teacher Productivity Prompts"
  },
  {
    "id": "pb-master",
    "number": 101,
    "title": "Master Prompt Template for Teachers",
    "category": "Teacher Productivity",
    "source": "playbook",
    "sourceLabel": "Practical Prompt Playbook",
    "sectionLabel": "Final Note · Master Prompt Template"
  },
  {
    "id": "wb-1",
    "number": 1,
    "title": "Clear Learning Objectives",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-2",
    "number": 2,
    "title": "45-Minute Lesson Plan Table",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-3",
    "number": 3,
    "title": "5-Minute Curiosity Starter",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-4",
    "number": 4,
    "title": "Step-by-Step Explanation With Examples",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-5",
    "number": 5,
    "title": "Common Student Mistakes & Corrections",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-6",
    "number": 6,
    "title": "Syllabus to Weekly Plan",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-7",
    "number": 7,
    "title": "Monthly Subject Plan",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-8",
    "number": 8,
    "title": "Project-Based Lesson Converter",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-9",
    "number": 9,
    "title": "Inquiry Lesson Converter",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-10",
    "number": 10,
    "title": "Teacher Notes & Key Ideas",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-11",
    "number": 11,
    "title": "Anticipated Student Questions",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-12",
    "number": 12,
    "title": "Revision Lesson With Quick Quiz",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-13",
    "number": 13,
    "title": "No-Prep Substitute Teacher Plan",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-14",
    "number": 14,
    "title": "Half-Class 20-Minute Lesson",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-15",
    "number": 15,
    "title": "Understanding Check Closing Activity",
    "category": "Lesson Planning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Lesson Planning (15)"
  },
  {
    "id": "wb-16",
    "number": 16,
    "title": "10-Bullet Chapter Summary",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-17",
    "number": 17,
    "title": "Age-Tailored Story Explanation",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-18",
    "number": 18,
    "title": "Local Daily-Life Examples",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-19",
    "number": 19,
    "title": "15-Word Topic Glossary",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-20",
    "number": 20,
    "title": "One-Page Study Guide",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-21",
    "number": 21,
    "title": "Concept Comparison Table",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-22",
    "number": 22,
    "title": "Leveled Reading Passage",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-23",
    "number": 23,
    "title": "One-Line Event Timeline",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-24",
    "number": 24,
    "title": "Three-Way Concept Explanation",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-25",
    "number": 25,
    "title": "Mnemonic & Memory Trick",
    "category": "Teaching Materials",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Teaching Materials (10)"
  },
  {
    "id": "wb-26",
    "number": 26,
    "title": "Tiered One-Page Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-27",
    "number": 27,
    "title": "Fill-in-the-Blanks Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-28",
    "number": 28,
    "title": "Term Matching Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-29",
    "number": 29,
    "title": "Vocabulary Worksheet & Quiz",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-30",
    "number": 30,
    "title": "Real-Situation Word Problems",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-31",
    "number": 31,
    "title": "Reading Comprehension Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-32",
    "number": 32,
    "title": "Find the Mistake Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-33",
    "number": 33,
    "title": "20-Minute Homework Sheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-34",
    "number": 34,
    "title": "Mixed-Topic Revision Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-35",
    "number": 35,
    "title": "Role-Based Group Worksheet",
    "category": "Worksheets",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Worksheets (10)"
  },
  {
    "id": "wb-36",
    "number": 36,
    "title": "5-Minute Class Icebreakers",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-37",
    "number": 37,
    "title": "4-Student Group Activity",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-38",
    "number": 38,
    "title": "4-Character Role Play",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-39",
    "number": 39,
    "title": "Structured Classroom Debate",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-40",
    "number": 40,
    "title": "Paper-and-Pen Classroom Game",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-41",
    "number": 41,
    "title": "Simple Everyday Experiment",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-42",
    "number": 42,
    "title": "8-Clue Classroom Scavenger Hunt",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-43",
    "number": 43,
    "title": "5-Puzzle Escape-Room Activity",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-44",
    "number": 44,
    "title": "6 Think-Pair-Share Questions",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-45",
    "number": 45,
    "title": "10-Minute Revision Energizer",
    "category": "Activities",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Activities (10)"
  },
  {
    "id": "wb-46",
    "number": 46,
    "title": "10-Slide Lesson Outline",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-47",
    "number": 47,
    "title": "Slide Speaker Notes Generator",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-48",
    "number": 48,
    "title": "5-Slide Chapter Summary",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-49",
    "number": 49,
    "title": "Strong Opening Slide & Hook",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-50",
    "number": 50,
    "title": "Visual & Diagram Ideas for Slides",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-51",
    "number": 51,
    "title": "8-Question Quiz Slide Set",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-52",
    "number": 52,
    "title": "Notes to Concise Slide Bullets",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-53",
    "number": 53,
    "title": "Parent Event Presentation",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-54",
    "number": 54,
    "title": "Staff Meeting Presentation",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-55",
    "number": 55,
    "title": "Clean Classroom Slide Design Plan",
    "category": "Presentations",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Presentations (10)"
  },
  {
    "id": "wb-56",
    "number": 56,
    "title": "10 Marked MCQs",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-57",
    "number": 57,
    "title": "True/False With Corrections",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-58",
    "number": 58,
    "title": "30-Mark Test & Marking Scheme",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-59",
    "number": 59,
    "title": "5 Real-Life Case-Study Questions",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-60",
    "number": 60,
    "title": "Student-Friendly 4x4 Rubric",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-61",
    "number": 61,
    "title": "Test Answer Key With Explanations",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-62",
    "number": 62,
    "title": "3 Quick Exit-Ticket Questions",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-63",
    "number": 63,
    "title": "80-Mark 90-Minute Mock Exam",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-64",
    "number": 64,
    "title": "Novel Problem Application Questions",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-65",
    "number": 65,
    "title": "Peer-Assessment Checklist",
    "category": "Assessment and Quiz",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Assessments (10)"
  },
  {
    "id": "wb-66",
    "number": 66,
    "title": "Rubric-Based Anonymous Feedback",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-67",
    "number": 67,
    "title": "Weekly Improvement Praise",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-68",
    "number": 68,
    "title": "Rough Notes to Report Comment",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-69",
    "number": 69,
    "title": "Non-Rewriting Paragraph Feedback",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-70",
    "number": 70,
    "title": "Class Error Pattern Analysis",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-71",
    "number": 71,
    "title": "15 Reusable Feedback Stems",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-72",
    "number": 72,
    "title": "Structured Student Feedback Sheet",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-73",
    "number": 73,
    "title": "Kind & Honest Comment Polisher",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-74",
    "number": 74,
    "title": "Warm Note for Discouraged Student",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-75",
    "number": 75,
    "title": "5-Skill Term Progress Tracker",
    "category": "Feedback and Student Support",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Feedback and Grading (10)"
  },
  {
    "id": "wb-76",
    "number": 76,
    "title": "Short-Sentence Explanation Rewrite",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-77",
    "number": 77,
    "title": "Three-Tier Lesson Differentiator",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-78",
    "number": 78,
    "title": "Scaffolded Practice Questions",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-79",
    "number": 79,
    "title": "5 Advanced Challenge Questions",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-80",
    "number": 80,
    "title": "Step-by-Step Problem Solving Guide",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-81",
    "number": 81,
    "title": "Worksheet Translator (Simple Instructions)",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-82",
    "number": 82,
    "title": "Reading-Level Simplifier",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-83",
    "number": 83,
    "title": "Visual-Style Topic Breakdown",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-84",
    "number": 84,
    "title": "5-Day Absentee Catch-Up Plan",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-85",
    "number": 85,
    "title": "1-Week Solo Enrichment Project",
    "category": "Personalized Learning",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Personalized Learning (10)"
  },
  {
    "id": "wb-86",
    "number": 86,
    "title": "30-Minute Staff Meeting Agenda",
    "category": "Administration",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Administration (5)"
  },
  {
    "id": "wb-87",
    "number": 87,
    "title": "Meeting Notes to Action Items",
    "category": "Administration",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Administration (5)"
  },
  {
    "id": "wb-88",
    "number": 88,
    "title": "Short School Event Notice",
    "category": "Administration",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Administration (5)"
  },
  {
    "id": "wb-89",
    "number": 89,
    "title": "Event & Trip Organizing Checklist",
    "category": "Administration",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Administration (5)"
  },
  {
    "id": "wb-90",
    "number": 90,
    "title": "Simple Subject Term Calendar",
    "category": "Administration",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Administration (5)"
  },
  {
    "id": "wb-91",
    "number": 91,
    "title": "Friendly Parent Meeting Invite",
    "category": "Parent Communication",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Parent Communication (5)"
  },
  {
    "id": "wb-92",
    "number": 92,
    "title": "Supportive Missing Homework Email",
    "category": "Parent Communication",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Parent Communication (5)"
  },
  {
    "id": "wb-93",
    "number": 93,
    "title": "Positive Progress Email",
    "category": "Parent Communication",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Parent Communication (5)"
  },
  {
    "id": "wb-94",
    "number": 94,
    "title": "Clear Exam / Event / Fees Reminder",
    "category": "Parent Communication",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Parent Communication (5)"
  },
  {
    "id": "wb-95",
    "number": 95,
    "title": "Calm Reply to Upset Parent",
    "category": "Parent Communication",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Parent Communication (5)"
  },
  {
    "id": "wb-96",
    "number": 96,
    "title": "8 Education Research Questions",
    "category": "Research",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Research (5)"
  },
  {
    "id": "wb-97",
    "number": 97,
    "title": "Research Paper Key Findings",
    "category": "Research",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Research (5)"
  },
  {
    "id": "wb-98",
    "number": 98,
    "title": "Compare Two Education Theories",
    "category": "Research",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Research (5)"
  },
  {
    "id": "wb-99",
    "number": 99,
    "title": "Literature-Review Outline",
    "category": "Research",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Research (5)"
  },
  {
    "id": "wb-100",
    "number": 100,
    "title": "10 Study Interview Questions",
    "category": "Research",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Research (5)"
  },
  {
    "id": "wb-101",
    "number": 101,
    "title": "Memory Poem or Rap",
    "category": "Creative Teaching",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Creative Teaching (5)"
  },
  {
    "id": "wb-102",
    "number": 102,
    "title": "300-Word Character Learning Story",
    "category": "Creative Teaching",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Creative Teaching (5)"
  },
  {
    "id": "wb-103",
    "number": 103,
    "title": "News Report / Interview / Letter Format",
    "category": "Creative Teaching",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Creative Teaching (5)"
  },
  {
    "id": "wb-104",
    "number": 104,
    "title": "5 Fun Class Opening Hooks",
    "category": "Creative Teaching",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Creative Teaching (5)"
  },
  {
    "id": "wb-105",
    "number": 105,
    "title": "Monthly Class Challenge",
    "category": "Creative Teaching",
    "source": "workbook-bonus",
    "sourceLabel": "Practical AI Workbook · 105 Prompts",
    "sectionLabel": "Creative Teaching (5)"
  },
  {
    "id": "wb-ch-1",
    "number": 106,
    "title": "Teaching Profile Setup Prompt",
    "category": "Teacher Productivity",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 1 · Set Up Your AI Workspace"
  },
  {
    "id": "wb-ch-2",
    "number": 107,
    "title": "Step-by-Step Table Explanation Prompt",
    "category": "Classroom Teaching",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 2 · Control the Output"
  },
  {
    "id": "wb-ch-3",
    "number": 108,
    "title": "Reusable Formula Lesson Prompt",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 2 · Build Reusable Prompts"
  },
  {
    "id": "wb-ch-4",
    "number": 109,
    "title": "Syllabus Topic to Action Objectives",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 3 · From Curriculum to Lesson Plan"
  },
  {
    "id": "wb-ch-5",
    "number": 110,
    "title": "40-Minute Table Lesson Plan",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 3 · Daily Lesson Plans"
  },
  {
    "id": "wb-ch-6",
    "number": 111,
    "title": "Weekly Periods & Revision Plan",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 3 · Weekly Planning"
  },
  {
    "id": "wb-ch-7",
    "number": 112,
    "title": "Month-by-Month Term Syllabus Plan",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 3 · Monthly and Unit Planning"
  },
  {
    "id": "wb-ch-8",
    "number": 113,
    "title": "Top 5 Student Misunderstandings",
    "category": "Classroom Teaching",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 3 · Prepare Before Class"
  },
  {
    "id": "wb-ch-9",
    "number": 114,
    "title": "One-Page Differentiated Worksheet",
    "category": "Worksheets",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 4 · Worksheets"
  },
  {
    "id": "wb-ch-10",
    "number": 115,
    "title": "Lesson to One-Page Study Guide",
    "category": "Teaching Materials",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 4 · Notes and Study Guides"
  },
  {
    "id": "wb-ch-11",
    "number": 116,
    "title": "15 Flashcards Two-Column Table",
    "category": "Teaching Materials",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 4 · Flashcards"
  },
  {
    "id": "wb-ch-12",
    "number": 117,
    "title": "10-Slide Presentation With Speaker Notes",
    "category": "Presentations",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 4 · Presentations"
  },
  {
    "id": "wb-ch-13",
    "number": 118,
    "title": "Classroom Poster Visual Prompt",
    "category": "Content Creation",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 4 · Classroom Posters and Visuals"
  },
  {
    "id": "wb-ch-14",
    "number": 119,
    "title": "10 MCQs With Believable Distractors",
    "category": "Assessment and Quiz",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 5 · Generate Questions"
  },
  {
    "id": "wb-ch-15",
    "number": 120,
    "title": "50-Mark Multi-Section Question Paper",
    "category": "Assessment and Quiz",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 5 · Create Full Question Papers"
  },
  {
    "id": "wb-ch-16",
    "number": 121,
    "title": "Question Paper Answer Key & Mark Breakdown",
    "category": "Assessment and Quiz",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 5 · Generate Answer Keys"
  },
  {
    "id": "wb-ch-17",
    "number": 122,
    "title": "4-Level Student-Friendly Rubric Table",
    "category": "Assessment and Quiz",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 5 · Create Rubrics"
  },
  {
    "id": "wb-ch-18",
    "number": 123,
    "title": "3-Minute Exit Ticket Check",
    "category": "Assessment and Quiz",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 5 · Create Exit Tickets"
  },
  {
    "id": "wb-ch-19",
    "number": 124,
    "title": "Under-80-Word Personalized Feedback",
    "category": "Feedback and Student Support",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 6 · Personalized Feedback"
  },
  {
    "id": "wb-ch-20",
    "number": 125,
    "title": "Three-Level Lesson Rewriter",
    "category": "Personalized Learning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 6 · Teach at Three Levels"
  },
  {
    "id": "wb-ch-21",
    "number": 126,
    "title": "Supportive Concept & Gradual Practice",
    "category": "Personalized Learning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 6 · Support Students Who Struggle"
  },
  {
    "id": "wb-ch-22",
    "number": 127,
    "title": "5 Fast-Learner Challenge Tasks",
    "category": "Personalized Learning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 6 · Challenge Advanced Students"
  },
  {
    "id": "wb-ch-23",
    "number": 128,
    "title": "5 No-Material Pair Activities",
    "category": "Activities",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 7 · Generate Activities"
  },
  {
    "id": "wb-ch-24",
    "number": 129,
    "title": "30-Minute Detective Mystery Lesson",
    "category": "Activities",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 7 · Interactive Lessons"
  },
  {
    "id": "wb-ch-25",
    "number": 130,
    "title": "8 Tiered Class Discussion Questions",
    "category": "Classroom Teaching",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 7 · Questions During Class"
  },
  {
    "id": "wb-ch-26",
    "number": 131,
    "title": "Jeopardy-Style 4-Team Classroom Game",
    "category": "Activities",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 7 · Classroom Games"
  },
  {
    "id": "wb-ch-27",
    "number": 132,
    "title": "3-Minute Educational Video Script",
    "category": "Content Creation",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 8 · Educational Video Scripts"
  },
  {
    "id": "wb-ch-28",
    "number": 133,
    "title": "Under-120-Word Parent Email",
    "category": "Parent Communication",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 9 · Emails"
  },
  {
    "id": "wb-ch-29",
    "number": 134,
    "title": "50-Word Anonymous Student Report Comment",
    "category": "Feedback and Student Support",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 9 · Reports"
  },
  {
    "id": "wb-ch-30",
    "number": 135,
    "title": "Meeting Notes Summary & Action Table",
    "category": "Administration",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 9 · Meetings"
  },
  {
    "id": "wb-ch-31",
    "number": 136,
    "title": "School/College Research Questions",
    "category": "Research",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 10 · Research Help"
  },
  {
    "id": "wb-ch-32",
    "number": 137,
    "title": "4-Week Teacher Skill Learning Plan",
    "category": "Teacher Productivity",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 10 · Professional Development"
  },
  {
    "id": "wb-ch-33",
    "number": 138,
    "title": "Personal AI Teaching Assistant Master Prompt",
    "category": "Teacher Productivity",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Chapters",
    "sectionLabel": "Chapter 12 · Complete AI Teacher Workflow"
  },
  {
    "id": "wb-ch-34",
    "number": 139,
    "title": "Personal AI Assistant Prompt (Multilingual)",
    "category": "Teacher Productivity",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Bonus 2",
    "sectionLabel": "Bonus 2 · Template 14"
  },
  {
    "id": "wb-ch-35",
    "number": 140,
    "title": "Complete 12-Step AI Lesson Workflow",
    "category": "Lesson Planning",
    "source": "workbook-chapter",
    "sourceLabel": "Practical AI Workbook · Bonus 2",
    "sectionLabel": "Bonus 2 · Template 15"
  }
];
