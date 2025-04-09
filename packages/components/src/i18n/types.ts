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
  nlBanner: {
    logo: {
      nostr: string;
      login: string;
    };
    buttons: {
      close: string;
      confirm: string;
      backupProfile: string;
      login: string;
      signup: string;
      logout: string;
    };
    messages: {
      timeout: string;
      confirmation: string;
      goTo: string;
      profileWarning: string;
    };
  };
  nlButton: {
    defaultTitle: string;
  };
};

export type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`; 