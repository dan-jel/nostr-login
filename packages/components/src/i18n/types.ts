export type TranslationKeys = {
  buttonBase: {
    defaultTitle: string;
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
  nlChangeAccount: {
    switchProfile: string;
    addProfile: string;
  };
  nlConfirmLogout: {
    title: string;
    description: string;
    cancel: string;
    confirm: string;
  };
  nlConnect: {
    titleWelcome: string;
    selectKeyStore: string;
    advanced: string;
    userName: string;
    connectionString: string;
    bunkerUrl: string;
  };
  nlIframe: {
    titleModal: string;
    description: string;
  };
  nlImportFlow: {
    titleInfo: string;
    titleImport: string;
    description: {
      intro: string;
      warning: string;
      backup: string;
      recommendation: string;
    };
    buttons: {
      importToKeyStore: string;
      exportKeys: string;
      copyToClipboard: string;
      copied: string;
      startImporting: string;
    };
    keyExport: {
      title: string;
      description: {
        copy: string;
        signIn: string;
        warning: string;
      };
    };
    serviceSelection: {
      description: string;
      defaultProvider: string;
    };
  };
  nlInfo: {
    title: {
      nostr: string;
      login: string;
    };
    version: string;
    description: {
      learnMore: string;
      openSource: string;
    };
  };
  nlInfoExtension: {
    signingIn: string;
    loading: string;
    installExtension: {
      title: string;
      description: string;
    };
  };
  nlLoading: {
    connecting: {
      title: string;
      text: string;
    };
    creating: {
      title: string;
      text: string;
    };
    confirming: {
      title: string;
      text: string;
    };
    ready: {
      title: string;
      text: string;
    };
    buttons: {
      continue: string;
      cancel: string;
    };
  };
  nlLocalSignup: {
    titleSignup: string;
    description: string;
    descriptionNjump: string;
    placeholder: string;
    button: {
      getStarted: string;
      createProfile: string;
    };
  };
  nlLoginStatus: {
    extension: string;
    readOnly: string;
    connect: string;
    local: string;
    otp: string;
  };
  nlOtpMigrate: {
    titleInfo: string;
    titleImport: string;
    textImport: string;
    defaultProvider: string;
    startImporting: string;
  };
  nlPreviouslyLogged: {
    title: string;
    description: string;
    activeProfiles: string;
    recentProfiles: string;
    addAnotherProfile: string;
  };
  nlSignin: {
    titleLogin: string;
    description: string;
    placeholder: string;
    button: {
      connect: string;
    };
  };
  nlSigninBunkerUrl: {
    titleLogin: string;
    description: string;
    placeholder: string;
    button: {
      connect: string;
    };
  };
  nlSigninConnectionString: {
    titleLogin: string;
    description: string;
    waitingForConnection: string;
  };
  nlSigninOtp: {
    titleLogin: string;
    description: string;
    titleLoginOTP: string;
    descriptionOTP: string;
    placeholder: {
      code: string;
      username: string;
    };
  };
  nlSigninReadOnly: {
    titleLogin: string;
    description: string;
    placeholder: string;
  };
  nlSignup: {
    titleSignup: string;
    description: string;
    placeholder: string;
    button: {
      createProfile: string;
    };
  };
  welcome: {
    title: string;
    description: string;
    signIn: string;
    signUp: string;
  };
  nlWelcomeSignin: {
    titleWelcome: string;
    buttons: {
      withExtension: string;
      connect: string;
      readOnly: string;
      oneTimeCode: string;
    };
    messages: {
      noExtension: string;
      useAdvanced: string;
    };
  };
  nlWelcomeSignup: {
    titleWelcome: string;
    description: string;
    buttons: {
      createKeys: string;
      withKeyStore: string;
    };
  };
};

export type TranslationKey = keyof TranslationKeys | `${keyof TranslationKeys}.${string}`;
