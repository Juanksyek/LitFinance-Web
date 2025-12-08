// 🌐 Traducciones - Español
export const es = {
  // Navegación
  nav: {
    home: 'Inicio',
    features: 'Características',
    gallery: 'Galería',
    specs: 'Especificaciones',
    testimonials: 'Testimonios',
    download: 'Descargar',
    downloadApp: 'Descargar App',
  },

  // Autenticación
  auth: {
    // Comunes
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    logout: 'Cerrar Sesión',
    
    // Login
    welcomeBack: 'Bienvenido de Nuevo',
    loginSubtitle: 'Inicia sesión en tu cuenta de LitFinance',
    email: 'Email',
    emailPlaceholder: 'tu@email.com',
    password: 'Contraseña',
    passwordPlaceholder: '••••••••',
    forgotPassword: '¿Olvidaste tu contraseña?',
    loginButton: 'Iniciar Sesión',
    loggingIn: 'Iniciando sesión...',
    noAccount: '¿No tienes cuenta?',
    
    // Register
    createAccount: 'Crear Cuenta',
    registerSubtitle: 'Únete a LitFinance y gestiona tus finanzas',
    fullName: 'Nombre Completo',
    fullNamePlaceholder: 'Juan Pérez',
    age: 'Edad',
    occupation: 'Ocupación',
    occupationPlaceholder: 'Desarrollador, Diseñador, etc.',
    confirmPassword: 'Confirmar Contraseña',
    registerButton: 'Crear Cuenta',
    registering: 'Registrando...',
    haveAccount: '¿Ya tienes cuenta?',
    
    // Forgot Password
    forgotPasswordTitle: '¿Olvidaste tu Contraseña?',
    forgotPasswordSubtitle: 'Ingresa tu email y te enviaremos un código de verificación',
    sendCode: 'Enviar Código',
    sendingCode: 'Enviando código...',
    codeSent: '¡Código Enviado!',
    codeSentMessage: 'Hemos enviado un código de verificación a tu correo electrónico.',
    redirecting: 'Redirigiendo...',
    backToLogin: 'Volver al Login',
    
    // Reset Password
    resetPasswordTitle: 'Restablecer Contraseña',
    resetPasswordSubtitle: 'Ingresa el código y tu nueva contraseña',
    verificationCode: 'Código de Verificación',
    verificationCodePlaceholder: 'Ej: 1234',
    checkEmail: 'Revisa tu correo para obtener el código',
    newPassword: 'Nueva Contraseña',
    confirmNewPassword: 'Confirmar Nueva Contraseña',
    resetButton: 'Restablecer Contraseña',
    resetting: 'Restableciendo...',
    passwordReset: '¡Contraseña Restablecida!',
    passwordResetMessage: 'Tu contraseña ha sido actualizada exitosamente.',
    redirectingLogin: 'Redirigiendo al login...',
    
    // Errores comunes
    fillAllFields: 'Por favor completa todos los campos',
    invalidEmail: 'El email no es válido',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
    passwordsDontMatch: 'Las contraseñas no coinciden',
    mustBe18: 'Debes ser mayor de 18 años',
    allFieldsRequired: 'Todos los campos obligatorios deben estar completos',
    invalidCredentials: 'Credenciales incorrectas',
    codeTooShort: 'El código debe tener al menos 4 dígitos',
  },

  // General
  common: {
    loading: 'Cargando...',
    welcome: 'Bienvenido',
    welcome_name: 'Bienvenido, {{name}}',
    language: 'Idioma',
    theme: 'Tema',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Sistema',
  },
};

export type Translations = typeof es;
