'use client';
import { getFunctions } from 'firebase/functions';
import { getApp } from 'firebase/app';

// This is a simplified getter for the functions instance.
// It assumes the app is already initialized.
export function getFirebaseFunctions() {
    return getFunctions(getApp());
}
