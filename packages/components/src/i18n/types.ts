export type TranslationKeys = {
  buttonBase: {
    openModal: string;
  };
  nlAuth: {
    logo: {
      nostr: string;
      login: string;
    };
    buttons: {
      changeTheme: string;
      info: string;
      close: string;
      back: string;
    };
    footer: {
      existingProfile: {
        prefix: string;
        link: string;
        suffix: string;
      };
      noProfile: {
        prefix: string;
        link: string;
        suffix: string;
      };
    };
  };
};

export type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`; 