import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-signin-otp',
  styleUrl: 'nl-signin-otp.css',
  shadow: false,
})
export class NlSigninOtp {
  @State() isGood = false;
  @State() translations = {
    titleLogin: t('nlSigninOtp.titleLogin'),
    description: t('nlSigninOtp.description'),
    titleLoginOTP: t('nlSigninOtp.titleLoginOTP'),
    descriptionOTP: t('nlSigninOtp.descriptionOTP'),
    placeholder: {
      code: t('nlSigninOtp.placeholder.code'),
      username: t('nlSigninOtp.placeholder.username'),
    },
  };

  @Event() nlLoginOTPUser: EventEmitter<string>;
  @Event() nlLoginOTPCode: EventEmitter<string>;
  @Event() nlCheckLogin: EventEmitter<string>;

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        titleLogin: t('nlSigninOtp.titleLogin'),
        description: t('nlSigninOtp.description'),
        titleLoginOTP: t('nlSigninOtp.titleLoginOTP'),
        descriptionOTP: t('nlSigninOtp.descriptionOTP'),
        placeholder: {
          code: t('nlSigninOtp.placeholder.code'),
          username: t('nlSigninOtp.placeholder.username'),
        },
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleInputChange(event: Event) {
    if (!state.isOTP) {
      state.nlSigninOTP.loginName = (event.target as HTMLInputElement).value;
      this.nlCheckLogin.emit(state.nlSigninOTP.loginName);
    } else {
      state.nlSigninOTP.code = (event.target as HTMLInputElement).value;
    }
  }

  handleLogin(e: MouseEvent) {
    e.preventDefault();
    if (state.isOTP) this.nlLoginOTPCode.emit(state.nlSigninOTP.code);
    else this.nlLoginOTPUser.emit(state.nlSigninOTP.loginName);
  }

  render() {
    return (
      <div class="p-4 overflow-y-auto">
        <h1 class="nl-title font-bold text-center text-2xl">{state.isOTP ? this.translations.titleLoginOTP : this.translations.titleLogin}</h1>
        <p class="nl-description font-light text-center text-sm pt-2 max-w-96 mx-auto">{state.isOTP ? this.translations.descriptionOTP : this.translations.description}</p>

        <div class="max-w-72 mx-auto">
          <div class="relative mb-2">
            <input
              onInput={e => this.handleInputChange(e)}
              type="text"
              class="nl-input peer py-3 px-4 ps-11 block w-full border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:border-transparent"
              placeholder={state.isOTP ? this.translations.placeholder.code : this.translations.placeholder.username}
              value={state.isOTP ? state.nlSigninOTP.code : state.nlSigninOTP.loginName}
            />
            <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke={this.isGood ? '#00cc00' : 'currentColor'}
                class="flex-shrink-0 w-4 h-4 text-gray-500"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
          </div>

          <div class="ps-4 pe-4 overflow-y-auto">
            <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
          </div>

          <button-base titleBtn="Log in" disabled={state.isLoading} onClick={e => this.handleLogin(e)}>
            {state.isLoading && (
              <span
                slot="icon-start"
                class="animate-spin-loading inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-slate-900 dark:text-gray-300 rounded-full"
                role="status"
                aria-label="loading"
              ></span>
            )}
          </button-base>
        </div>
      </div>
    );
  }
}
