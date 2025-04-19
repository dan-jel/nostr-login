import { Component, h, Fragment, State, Prop, Event, EventEmitter } from '@stencil/core';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-local-signup',
  styleUrl: 'nl-local-signup.css',
  shadow: false,
})
export class NlLocalSignup {
  @Prop() signupNjump = false;

  @State() isAvailable = false;
  @State() translations = {
    titleSignup: t('nlLocalSignup.titleSignup'),
    description: t('nlLocalSignup.description'),
    descriptionNjump: t('nlLocalSignup.descriptionNjump'),
    placeholder: t('nlLocalSignup.placeholder'),
    button: {
      getStarted: t('nlLocalSignup.button.getStarted'),
      createProfile: t('nlLocalSignup.button.createProfile')
    }
  };

  @Event() nlLocalSignup: EventEmitter<string>;
  @Event() nlSignupNjump: EventEmitter<void>;
  // @Event() nlCheckSignup: EventEmitter<string>;
  @Event() fetchHandler: EventEmitter<boolean>;

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        titleSignup: t('nlLocalSignup.titleSignup'),
        description: t('nlLocalSignup.description'),
        descriptionNjump: t('nlLocalSignup.descriptionNjump'),
        placeholder: t('nlLocalSignup.placeholder'),
        button: {
          getStarted: t('nlLocalSignup.button.getStarted'),
          createProfile: t('nlLocalSignup.button.createProfile')
        }
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleInputChange(event: Event) {
    state.nlSignup.signupName = (event.target as HTMLInputElement).value;
    // this.nlCheckSignup.emit(`${(event.target as HTMLInputElement).value}@${state.nlSignup.domain}`);
  }

  handleCreateAccount(e: MouseEvent) {
    e.preventDefault();

    if (this.signupNjump) {
      this.nlSignupNjump.emit();
    } else {
      this.nlLocalSignup.emit(`${state.nlSignup.signupName}`);
    }
  }

  render() {
    return (
      <Fragment>
        <div class="p-4 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-2xl">{this.translations.titleSignup}</h1>
          <p class="nl-description font-light text-center text-sm pt-2 max-w-96 mx-auto">{this.signupNjump ? this.translations.descriptionNjump : this.translations.description}</p>
        </div>

        <div class="max-w-72 mx-auto">
          {!this.signupNjump && (
            <div class="relative mb-2">
              <input
                onInput={e => this.handleInputChange(e)}
                type="text"
                class="nl-input peer py-3 px-4 ps-11 block w-full border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:border-transparent"
                placeholder={this.translations.placeholder}
                value={state.nlSignup.signupName}
              />
              <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke={this.isAvailable ? '#00cc00' : 'currentColor'}
                  class="flex-shrink-0 w-4 h-4 text-gray-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </div>
            </div>
          )}

          <div class="ps-4 pe-4 overflow-y-auto">
            <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
          </div>

          <button-base disabled={state.isLoading} onClick={e => this.handleCreateAccount(e)} titleBtn={this.signupNjump ? this.translations.button.getStarted : this.translations.button.createProfile}>
            {state.isLoading ? (
              <span
                slot="icon-start"
                class="animate-spin-loading inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-slate-900 dark:text-gray-300 rounded-full"
                role="status"
                aria-label="loading"
              ></span>
            ) : (
              <svg slot="icon-start" style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
            )}
          </button-base>
        </div>
      </Fragment>
    );
  }
}
