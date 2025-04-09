export type TranslationKeys = {
  buttonBase: {
    openModal: string;
  };
};

export type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`; 