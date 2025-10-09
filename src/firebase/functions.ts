'use client';
import { getFunctions } from 'firebase/functions';
import { useFirebaseApp } from '@/firebase';

// Initialize and export functions
const app = useFirebaseApp();
export const functions = getFunctions(app);
