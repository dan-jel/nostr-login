export type TranslationKeys = {
  welcome: {
    title: string;
    description: string;
    signIn: string;
    signUp: string;
    advanced: string;
  };
  login: {
    title: string;
    npub: string;
    connect: string;
    extension: string;
    readOnly: string;
    otp: string;
  };
  signup: {
    title: string;
    description: string;
    local: string;
    bunker: string;
    extension: string;
  };
  common: {
    cancel: string;
    confirm: string;
    back: string;
    next: string;
    error: string;
    success: string;
  };
};

export type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`; 