import { Component, Event, EventEmitter, Fragment, h, Prop, Watch, State } from '@stencil/core';
import { AuthMethod, ConnectionString, CURRENT_MODULE, Info, NlTheme, RecentType } from '@/types';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-auth',
  styleUrl: 'nl-auth.css',
  shadow: true,
})
export class NlAuth {
  @Prop({ mutable: true }) theme: NlTheme = 'default';
  @Prop() bunkers: string = '';
  @Prop() startScreen: string = CURRENT_MODULE.WELCOME;
  @Prop() authMethods: AuthMethod[] = [];
  @Prop() hasExtension: boolean = false;
  @Prop() hasOTP: boolean = false;
  @Prop() isLoading: boolean = false;
  @Prop() isLoadingExtension: boolean = false;
  @Prop() isOTP: boolean = false;
  @Prop() authUrl: string = '';
  @Prop() iframeUrl: string = '';
  @Prop() error: string = '';
  @Prop() localSignup: boolean = false;
  @Prop() signupNjump: boolean = false;
  @Prop() njumpIframe: string = '';
  @Prop({ mutable: true }) accounts: Info[] = [];
  @Prop({ mutable: true }) recents: RecentType[] = [];
  @Prop({ mutable: true }) darkMode: boolean = false;
  @Prop() welcomeTitle: string = '';
  @Prop() welcomeDescription: string = '';
  @Prop() connectionString: string = '';
  @Prop() connectionStringServices: ConnectionString[] = [];

  @State() translations = {
    logo: {
      nostr: t('nlAuth.logo.nostr'),
      login: t('nlAuth.logo.login'),
    },
    buttons: {
      changeTheme: t('nlAuth.buttons.changeTheme'),
      info: t('nlAuth.buttons.info'),
      close: t('nlAuth.buttons.close'),
      back: t('nlAuth.buttons.back'),
    },
    footer: {
      existingProfile: {
        prefix: t('nlAuth.footer.existingProfile.prefix'),
        link: t('nlAuth.footer.existingProfile.link'),
        suffix: t('nlAuth.footer.existingProfile.suffix'),
      },
      noProfile: {
        prefix: t('nlAuth.footer.noProfile.prefix'),
        link: t('nlAuth.footer.noProfile.link'),
        suffix: t('nlAuth.footer.noProfile.suffix'),
      },
    },
  };

  private unsubscribeLanguageChange: () => void;

  @Event() nlCloseModal: EventEmitter;
  @Event() nlChangeDarkMode: EventEmitter<boolean>;
  @Event() nlNostrConnectDefaultCancel: EventEmitter<void>;

  prevPath: string = '';

  @Watch('isLoading')
  watchLoadingHandler(newValue: boolean) {
    state.isLoading = newValue;
  }

  @Watch('isLoadingExtension')
  watchLoadingExtensionHandler(newValue: boolean) {
    state.isLoadingExtension = newValue;
  }

  @Watch('isOTP')
  watchOTPHandler(newValue: boolean) {
    state.isOTP = newValue;
  }

  @Watch('authUrl')
  watchAuthUrlHandler(newValue: string) {
    state.authUrl = newValue;
  }

  @Watch('iframeUrl')
  watchIframeUrlHandler(newValue: string) {
    state.iframeUrl = newValue;
  }

  @Watch('njumpIframe')
  watchNjumpIframeHandler(newValue: string) {
    state.njumpIframe = newValue;
  }

  @Watch('error')
  watchErrorHandler(newValue: string) {
    state.error = newValue;
  }

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        logo: {
          nostr: t('nlAuth.logo.nostr'),
          login: t('nlAuth.logo.login'),
        },
        buttons: {
          changeTheme: t('nlAuth.buttons.changeTheme'),
          info: t('nlAuth.buttons.info'),
          close: t('nlAuth.buttons.close'),
          back: t('nlAuth.buttons.back'),
        },
        footer: {
          existingProfile: {
            prefix: t('nlAuth.footer.existingProfile.prefix'),
            link: t('nlAuth.footer.existingProfile.link'),
            suffix: t('nlAuth.footer.existingProfile.suffix'),
          },
          noProfile: {
            prefix: t('nlAuth.footer.noProfile.prefix'),
            link: t('nlAuth.footer.noProfile.link'),
            suffix: t('nlAuth.footer.noProfile.suffix'),
          },
        },
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleClose() {
    this.nlCloseModal.emit();
  }

  handleChangeDarkMode() {
    this.nlChangeDarkMode.emit(!this.darkMode);
  }

  componentWillLoad() {
    // init state
    state.path = [this.startScreen as CURRENT_MODULE];
    state.error = '';
    state.iframeUrl = '';
    state.authUrl = '';
    state.isLoading = false;
    state.isLoadingExtension = false;
    state.isOTP = false;

    console.log('path', state.path);
  }

  handleClickToBack() {
    state.path.pop();
    state.path = [...state.path];

    // reset
    state.isLoading = false;
    state.isLoadingExtension = false;
    state.authUrl = '';
    state.isOTP = false;
  }

  switchSignSignUpStrategy(str: CURRENT_MODULE) {
    if (CURRENT_MODULE.LOCAL_SIGNUP === str) {
      state.path = [CURRENT_MODULE.WELCOME, CURRENT_MODULE.WELCOME_SIGNUP, str];

      return;
    }

    state.path = [CURRENT_MODULE.WELCOME, str];
  }

  render() {
    const classWrapper = `w-full h-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto flex items-center ${this.darkMode ? 'dark' : ''}`;
    const currentModule = state.path.at(-1);

    if (currentModule !== this.prevPath && this.prevPath === CURRENT_MODULE.CONNECTION_STRING) {
      this.nlNostrConnectDefaultCancel.emit();
    }
    this.prevPath = currentModule;

    const renderModule = () => {
      if (state.isOTP) return <nl-signin-otp />;

      // @ts-ignore
      // const t: CURRENT_MODULE = 'import' // lastValuePath

      switch (currentModule) {
        case CURRENT_MODULE.WELCOME:
          return <nl-welcome titleWelcome={this.welcomeTitle || undefined} description={this.welcomeDescription || undefined} />;
        case CURRENT_MODULE.LOGIN:
          return <nl-signin />;
        case CURRENT_MODULE.SIGNUP:
          return <nl-signup bunkers={this.bunkers} />;
        case CURRENT_MODULE.LOCAL_SIGNUP:
          return <nl-local-signup signupNjump={this.signupNjump} />;
        case CURRENT_MODULE.CONFIRM_LOGOUT:
          return <nl-confirm-logout />;
        case CURRENT_MODULE.IMPORT_FLOW:
          return <nl-import-flow services={this.connectionStringServices} />;
        case CURRENT_MODULE.IMPORT_OTP:
          return <nl-otp-migrate services={this.connectionStringServices} />;
        case CURRENT_MODULE.INFO:
          return <nl-info />;
        case CURRENT_MODULE.EXTENSION:
          return <nl-info-extension />;
        case CURRENT_MODULE.LOGIN_READ_ONLY:
          return <nl-signin-read-only />;
        case CURRENT_MODULE.LOGIN_BUNKER_URL:
          return <nl-signin-bunker-url />;
        case CURRENT_MODULE.LOGIN_OTP:
          return <nl-signin-otp />;
        case CURRENT_MODULE.WELCOME_LOGIN:
          return <nl-welcome-signin hasOTP={this.hasOTP} authMethods={this.authMethods} hasExtension={this.hasExtension} />;
        case CURRENT_MODULE.WELCOME_SIGNUP:
          return <nl-welcome-signup />;
        case CURRENT_MODULE.CONNECTION_STRING:
          return <nl-signin-connection-string connectionString={this.connectionString} />;
        case CURRENT_MODULE.CONNECT:
          return <nl-connect connectionStringServices={this.connectionStringServices} authMethods={this.authMethods} />;
        case CURRENT_MODULE.PREVIOUSLY_LOGGED:
          return <nl-previously-logged accounts={this.accounts} recents={this.recents} />;
        case CURRENT_MODULE.IFRAME:
          return <nl-iframe iframeUrl={this.authUrl} />;
        default:
          return <nl-welcome />;
      }
    };

    const showLogin =
      state.isOTP ||
      (currentModule !== CURRENT_MODULE.INFO &&
        currentModule !== CURRENT_MODULE.CONFIRM_LOGOUT &&
        currentModule !== CURRENT_MODULE.IMPORT_FLOW &&
        currentModule !== CURRENT_MODULE.WELCOME &&
        currentModule !== CURRENT_MODULE.EXTENSION &&
        currentModule !== CURRENT_MODULE.IFRAME &&
        currentModule !== CURRENT_MODULE.PREVIOUSLY_LOGGED);

    const showSignup =
      currentModule !== CURRENT_MODULE.IFRAME &&
      (!this.authMethods.length || (!this.localSignup && this.authMethods.includes('connect')) || (this.localSignup && this.authMethods.includes('local')));

    return (
      <div class={`theme-${this.theme}`} dir="ltr">
        <div class={classWrapper}>
          <div onClick={() => this.handleClose()} class="absolute top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 z-[80]" />

          <div class="nl-bg relative z-[81] w-full flex flex-col rounded-xl sm:max-w-lg sm:w-full sm:mx-auto">
            <div class={`flex justify-between items-center py-3 px-4`}>
              <div class="flex gap-2 items-center">
                <svg class="w-7 h-7" width="225" height="224" viewBox="0 0 225 224" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="224.047" height="224" rx="64" fill="#6951FA" />
                  <path
                    d="M162.441 135.941V88.0593C170.359 85.1674 176 77.5348 176 68.6696C176 57.2919 166.708 48 155.33 48C143.953 48 134.661 57.2444 134.661 68.6696C134.661 77.5822 140.302 85.1674 148.219 88.0593V135.941C147.698 136.13 147.176 136.367 146.655 136.604L87.3956 77.3452C88.6282 74.6904 89.2919 71.7511 89.2919 68.6696C89.2919 57.2444 80.0474 48 68.6696 48C57.2919 48 48 57.2444 48 68.6696C48 77.5822 53.6415 85.1674 61.5585 88.0593V135.941C53.6415 138.833 48 146.465 48 155.33C48 166.708 57.2444 176 68.6696 176C80.0948 176 89.3393 166.708 89.3393 155.33C89.3393 146.418 83.6978 138.833 75.7807 135.941V88.0593C76.3022 87.8696 76.8237 87.6326 77.3452 87.3956L136.604 146.655C135.372 149.31 134.708 152.249 134.708 155.33C134.708 166.708 143.953 176 155.378 176C166.803 176 176.047 166.708 176.047 155.33C176.047 146.418 170.406 138.833 162.489 135.941H162.441Z"
                    fill="white"
                  />
                </svg>
                <p class="font-bold nl-logo text-base">
                  {this.translations.logo.nostr} <span class="font-light">{this.translations.logo.login}</span>
                </p>
              </div>

              <div class="flex gap-1">
                <button
                  onClick={() => this.handleChangeDarkMode()}
                  type="button"
                  class="nl-action-button flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent"
                >
                  <span class="sr-only">{this.translations.buttons.changeTheme}</span>
                  {this.darkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                      />
                    </svg>
                  )}
                </button>
                {!state.isLoading && (
                  <button
                    onClick={() => (state.path = [...state.path, CURRENT_MODULE.INFO])}
                    type="button"
                    class="nl-action-button flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent"
                  >
                    <span class="sr-only">{this.translations.buttons.info}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                      />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => this.handleClose()}
                  type="button"
                  class="nl-action-button flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent"
                >
                  <span class="sr-only">{this.translations.buttons.close}</span>
                  <svg
                    class="flex-shrink-0 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {state.path.length > 1 && !state.isLoading && (
              <div class="p-4">
                <button
                  onClick={() => this.handleClickToBack()}
                  type="button"
                  class="nl-action-button flex justify-center items-center w-7 h-7 text-sm font-semibold rounded-full border border-transparent  dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
                  data-hs-overlay="#hs-vertically-centered-modal"
                >
                  <span class="sr-only">{this.translations.buttons.back}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="flex-shrink-0 w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                </button>
              </div>
            )}
            {state.isLoading || state.authUrl ? (
              <nl-loading path={currentModule} />
            ) : (
              <Fragment>
                {renderModule()}
                {showLogin && (
                  <Fragment>
                    {currentModule === CURRENT_MODULE.WELCOME_SIGNUP || currentModule === CURRENT_MODULE.SIGNUP || currentModule === CURRENT_MODULE.LOCAL_SIGNUP ? (
                      <div class="p-4 overflow-y-auto">
                        <p class="nl-footer font-light text-center text-sm pt-3 max-w-96 mx-auto">
                          {this.translations.footer.existingProfile.prefix}{' '}
                          <span onClick={() => this.switchSignSignUpStrategy(CURRENT_MODULE.WELCOME_LOGIN)} class="cursor-pointer text-blue-400">
                            {this.translations.footer.existingProfile.link}
                          </span>
                          {this.translations.footer.existingProfile.suffix}
                        </p>
                      </div>
                    ) : (
                      showSignup && (
                        <div class="p-4 overflow-y-auto">
                          <p class="nl-footer font-light text-center text-sm pt-3 max-w-96 mx-auto">
                            {this.translations.footer.noProfile.prefix}{' '}
                            <span
                              onClick={() =>
                                this.localSignup ? this.switchSignSignUpStrategy(CURRENT_MODULE.LOCAL_SIGNUP) : this.switchSignSignUpStrategy(CURRENT_MODULE.WELCOME_SIGNUP)
                              }
                              class="cursor-pointer text-blue-400"
                            >
                              {this.translations.footer.noProfile.link}
                            </span>
                            {this.translations.footer.noProfile.suffix}
                          </p>
                        </div>
                      )
                    )}
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}
