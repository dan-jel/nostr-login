import { Component, h, State, Fragment, Event, EventEmitter } from '@stencil/core';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-signin-bunker-url',
  styleUrl: 'nl-signin-bunker-url.css',
  shadow: false,
})
export class NlSigninBunkerUrl {
  @State() isGood = false;
  @State() translations = {
    titleLogin: t('nlSigninBunkerUrl.titleLogin'),
    description: t('nlSigninBunkerUrl.description'),
    placeholder: t('nlSigninBunkerUrl.placeholder'),
    button: {
      connect: t('nlSigninBunkerUrl.button.connect')
    }
  };

  @Event() nlLogin: EventEmitter<string>;
  @Event() nlCheckLogin: EventEmitter<string>;

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        titleLogin: t('nlSigninBunkerUrl.titleLogin'),
        description: t('nlSigninBunkerUrl.description'),
        placeholder: t('nlSigninBunkerUrl.placeholder'),
        button: {
          connect: t('nlSigninBunkerUrl.button.connect')
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
    state.nlSigninBunkerUrl.loginName = (event.target as HTMLInputElement).value;
    this.nlCheckLogin.emit((event.target as HTMLInputElement).value);
  }

  handleLogin(e: MouseEvent) {
    e.preventDefault();
    this.nlLogin.emit(state.nlSigninBunkerUrl.loginName);
  }

  render() {
    return (
      <Fragment>
        <div class="p-4 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-2xl">{this.translations.titleLogin}</h1>
          <p class="nl-description font-light text-center text-sm pt-2 max-w-96 mx-auto">{this.translations.description}</p>
        </div>

        <div class="max-w-72 mx-auto">
          <div class="relative mb-2">
            <input
              onInput={e => this.handleInputChange(e)}
              type="text"
              class="nl-input peer py-3 px-4 ps-11 block w-full border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:border-transparent"
              placeholder={this.translations.placeholder}
              value={state.nlSigninBunkerUrl.loginName}
            />
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke={this.isGood ? '#00cc00' : 'currentColor'}
                class="flex-shrink-0 w-4 h-4 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                />
              </svg>
            </div>
          </div>

          <div class="ps-4 pe-4 overflow-y-auto">
            <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
          </div>

          <button-base titleBtn={this.translations.button.connect} disabled={state.isLoading} onClick={e => this.handleLogin(e)}>
            {state.isLoading ? (
              <span
                slot="icon-start"
                class="animate-spin-loading inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-slate-900 dark:text-gray-300 rounded-full"
                role="status"
                aria-label="loading"
              ></span>
            ) : (
              <svg style={{ display: 'none' }} slot="icon-start" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                />
              </svg>
            )}
          </button-base>
        </div>
      </Fragment>
    );
  }
}
