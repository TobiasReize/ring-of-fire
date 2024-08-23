import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-6cdf6',
        appId: '1:872427192739:web:df61cd14205670ef885a16',
        storageBucket: 'ring-of-fire-6cdf6.appspot.com',
        apiKey: 'AIzaSyDEMWTaIedacIR3hZQfruwypkP6ZgIl-kg',
        authDomain: 'ring-of-fire-6cdf6.firebaseapp.com',
        messagingSenderId: '872427192739',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
