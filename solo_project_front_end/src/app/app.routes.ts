import { Routes } from '@angular/router';

// ?臬???閬?啁????Ｗ?隞嗚?
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PublicQuizListComponent } from './public-quiz-list/public-quiz-list.component';
import { PublicQuizViewComponent } from './public-quiz-view/public-quiz-view.component'; // [?Ｗ儔] ??閬?隞?
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizEditorComponent } from './quiz-editor/quiz-editor.component';
import { QuizPreviewComponent } from './quiz-preview/quiz-preview.component';
import { authGuard } from './guard/auth.guard';

import { QuizTakeComponent } from './quiz-take/quiz-take.component';

import { QuizStatsComponent } from './quiz-stats/quiz-stats.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  // ==================================================
  // 1. ?祇?頝舐 (??犖?賢隞亥赤??
  // ==================================================
  {
    path: '', // 蝬脩???桅? (靘?嚗ttp://localhost:4200/)
    component: QuizListComponent, // [靽格] 憿舐內?蝙?刻??瑕?銵具??粹???
    canActivate: [authGuard]
  },
  {
    path: 'public', // [?啣?] ?祇???”
    component: PublicQuizListComponent
  },
  { path: 'public/quiz/:id', component: PublicQuizViewComponent },
  {
    path: 'login', // ?餃??
    component: LoginComponent
  },
  {
    path: 'register', // 閮餃???
    component: RegistrationComponent
  },
  {
    path: 'quiz/take/:id', // 憛怠神?????
    component: QuizTakeComponent
  },

  // ==================================================
  // 2. 靽風頝舐 (?閬?交??質赤??
  // ==================================================
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'my-quizzes', component: QuizListComponent, canActivate: [authGuard] },
  {
    path: 'quiz-list', // (敺) ?蝞∠??”
    component: QuizListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'quiz/new', // ?啣??
    component: QuizEditorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'quiz/edit/:id', // 蝺刻摩?
    component: QuizEditorComponent,
    canActivate: [authGuard]
  },
  {
    path: 'quiz/preview/:id', // ?汗?
    component: QuizPreviewComponent,
    canActivate: [authGuard]
  },
  {
    path: 'quiz/stats/:id', // [?啣?] ?亦??蝯梯?
    component: QuizStatsComponent,
    canActivate: [authGuard]
  },

  // ==================================================
  // 3. ?祉頝舐 (敹??曉?銝)
  // ==================================================
  {
    path: '**', // ?寥?隞颱??嗡??芸?蝢拍?蝬脣?
    redirectTo: '/public' // ?撠??啣???瑕?銵?
  },
];




