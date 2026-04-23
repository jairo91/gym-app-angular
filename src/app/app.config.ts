import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, provideAppCheck } from '@angular/fire/app-check';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp(
    { projectId: "gym-app-a1964", 
      appId: "1:704224083199:web:bd2aa6b98f730dbc47a0ca", 
      storageBucket: "gym-app-a1964.firebasestorage.app", 
      apiKey: "AIzaSyAjTsqHYZG_xY2AGGGwLN4861G2iWavTTE", 
      authDomain: "gym-app-a1964.firebaseapp.com", 
      databaseURL: "https://gym-app-a1964-default-rtdb.europe-west1.firebasedatabase.app",
      messagingSenderId: "704224083199", 
      measurementId: "G-LK6BV5Z7HK"})), provideAuth(() => getAuth()), 
      provideAnalytics(() => getAnalytics()), 
      ScreenTrackingService, 
      UserTrackingService, 
      provideFirestore(() => getFirestore()), 
      provideDatabase(() => getDatabase())]
};
