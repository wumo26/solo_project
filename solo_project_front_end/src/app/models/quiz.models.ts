export enum QuizStatus { DRAFT = 'DRAFT', PUBLISHED = 'PUBLISHED', CLOSED = 'CLOSED' }

export interface QuizListItem {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
  isClosed?: boolean;
  isPinned?: boolean;
  creatorId?: number;
  creatorName?: string;
}

export interface QuizOption { id: number; optionCode: string; optionText: string; }
export interface QuizQuestion { id: number; questionNum: number; title: string; type: string; isRequired: boolean; options: QuizOption[]; }
export interface QuizDetail { id: number; title: string; description: string; startDate: string | null; endDate: string | null; isPublished: boolean; questions: QuizQuestion[]; }

export interface QuizCreationOption { option_code: string; option_text: string; }
export interface QuizCreationQuestion { question_num: number; title: string; type: string; is_required: boolean; options?: QuizCreationOption[]; }
export interface QuizCreationPayload { id?: number; title: string; description: string; start_date: string | null; end_date: string | null; is_published: boolean; questions: QuizCreationQuestion[]; }
export interface AnswerPayload { questionId: number; optionIds?: number[]; answerText?: string; }
export interface SubmissionPayload { answers: AnswerPayload[]; }

export interface OptionStatistics { optionId: number; optionCode: string; optionText: string; selectedCount: number; percentage: number; }
export interface QuestionStatistics { questionId: number; questionNum: number; questionTitle: string; questionType: string; optionStats?: OptionStatistics[]; textAnswers?: string[]; }
export interface QuizStatistics { quizId: number; quizTitle: string; totalRespondents: number; questionStats: QuestionStatistics[]; }
export interface ApiResponse<T> { success: boolean; message: string; data: T; }

// Backwards-compatible aliases used by existing screens.
export type QuizResponseDto = QuizListItem;
export type QuizResponse = QuizDetail;
export type Option = QuizOption;
export type QuestionResponse = QuizQuestion;
export type OptionCreation = QuizCreationOption;
export type QuestionCreation = QuizCreationQuestion;
export type QuizDetails = QuizDetail;
