// 🌐 Translations - English
import type { Translations } from './es';

export const en: Translations = {
  // Navigation
  nav: {
    home: 'Home',
    features: 'Features',
    gallery: 'Gallery',
    specs: 'Specifications',
    testimonials: 'Testimonials',
    download: 'Download',
    downloadApp: 'Download App',
  },

  // Authentication
  auth: {
    // Common
    login: 'Login',
    register: 'Sign Up',
    logout: 'Logout',
    
    // Login
    welcomeBack: 'Welcome Back',
    loginSubtitle: 'Sign in to your LitFinance account',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: '••••••••',
    forgotPassword: 'Forgot your password?',
    loginButton: 'Sign In',
    loggingIn: 'Signing in...',
    noAccount: "Don't have an account?",
    
    // Register
    createAccount: 'Create Account',
    registerSubtitle: 'Join LitFinance and manage your finances',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    age: 'Age',
    occupation: 'Occupation',
    occupationPlaceholder: 'Developer, Designer, etc.',
    confirmPassword: 'Confirm Password',
    registerButton: 'Create Account',
    registering: 'Registering...',
    haveAccount: 'Already have an account?',
    
    // Forgot Password
    forgotPasswordTitle: 'Forgot Your Password?',
    forgotPasswordSubtitle: 'Enter your email and we will send you a verification code',
    sendCode: 'Send Code',
    sendingCode: 'Sending code...',
    codeSent: 'Code Sent!',
    codeSentMessage: 'We have sent a verification code to your email.',
    redirecting: 'Redirecting...',
    backToLogin: 'Back to Login',
    
    // Reset Password
    resetPasswordTitle: 'Reset Password',
    resetPasswordSubtitle: 'Enter the code and your new password',
    verificationCode: 'Verification Code',
    verificationCodePlaceholder: 'Ex: 1234',
    checkEmail: 'Check your email for the code',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    resetButton: 'Reset Password',
    resetting: 'Resetting...',
    passwordReset: 'Password Reset!',
    passwordResetMessage: 'Your password has been successfully updated.',
    redirectingLogin: 'Redirecting to login...',
    
    // Common errors
    fillAllFields: 'Please fill in all fields',
    invalidEmail: 'The email is not valid',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    mustBe18: 'You must be at least 18 years old',
    allFieldsRequired: 'All required fields must be completed',
    invalidCredentials: 'Invalid credentials',
    codeTooShort: 'Code must be at least 4 digits',
  },

  // General
  common: {
    loading: 'Loading...',
    welcome: 'Welcome',
    welcome_name: 'Welcome, {{name}}',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },
};
