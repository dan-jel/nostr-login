import { Component, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import { state } from '@/store';
import { CURRENT_MODULE } from '@/types';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-loading',
  styleUrl: 'nl-loading.css',
  shadow: false,
})
export class NlLoading {
  @Event() stopFetchHandler: EventEmitter<boolean>;
  @Event() handleContinue: EventEmitter<boolean>;
  @Prop() path: string;
  @State() translations = {
    connecting: {
      title: t('nlLoading.connecting.title'),
      text: t('nlLoading.connecting.text')
    },
    creating: {
      title: t('nlLoading.creating.title'),
      text: t('nlLoading.creating.text')
    },
    confirming: {
      title: t('nlLoading.confirming.title'),
      text: t('nlLoading.confirming.text')
    },
    ready: {
      title: t('nlLoading.ready.title'),
      text: t('nlLoading.ready.text')
    },
    buttons: {
      continue: t('nlLoading.buttons.continue'),
      cancel: t('nlLoading.buttons.cancel')
    }
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        connecting: {
          title: t('nlLoading.connecting.title'),
          text: t('nlLoading.connecting.text')
        },
        creating: {
          title: t('nlLoading.creating.title'),
          text: t('nlLoading.creating.text')
        },
        confirming: {
          title: t('nlLoading.confirming.title'),
          text: t('nlLoading.confirming.text')
        },
        ready: {
          title: t('nlLoading.ready.title'),
          text: t('nlLoading.ready.text')
        },
        buttons: {
          continue: t('nlLoading.buttons.continue'),
          cancel: t('nlLoading.buttons.cancel')
        }
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleStop(e) {
    e.preventDefault();
    this.stopFetchHandler.emit();
  }

  handleContinueClick(e) {
    e.preventDefault();
    // reset();
    this.handleContinue.emit();
  }

  render() {
    let title = this.translations.connecting.title;
    let text = this.translations.connecting.text;
    
    if (state.njumpIframe) {
      title = '';
      text = '';
    } else if (this.path === CURRENT_MODULE.LOCAL_SIGNUP) {
      title = this.translations.creating.title;
      text = this.translations.creating.text;
    } else if (state.authUrl) {
      if (state.isLoading) {
        title = this.translations.confirming.title;
        text = this.translations.confirming.text;
      } else {
        title = this.translations.ready.title;
        text = this.translations.ready.text;
      }
    }

    const showButton = this.path !== CURRENT_MODULE.LOCAL_SIGNUP;
    const showIframe = !state.isLoading && state.iframeUrl && state.authUrl;
    const iframeUrl = state.iframeUrl ? `${state.iframeUrl}?connect=${encodeURIComponent(state.authUrl)}` : '';

    return (
      <div class="p-4 overflow-y-auto">
        {title && (<h1 class="nl-title font-bold text-center text-4xl">{title}</h1>)}
        {text && (<p class="nl-description font-light text-center text-lg pt-2 max-w-96 mx-auto">{text}</p>)}
        {!state.njumpIframe && !state.authUrl && state.isLoading && (
          <div class="mt-10 mb-10 ml-auto mr-auto w-20">
            <span
              slot="icon-start"
              class="animate-spin-loading ml-auto mr-auto inline-block w-20 h-20 border-[4px] border-current border-t-transparent text-slate-900 dark:text-gray-300 rounded-full"
              role="status"
              aria-label="loading"
            ></span>
          </div>
        )}
        <div class="ps-4 pe-4 overflow-y-auto">
          <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
        </div>
        {iframeUrl && (
          <div class="mt-3 ml-auto mr-auto w-72 flex justify-center">
            <iframe src={iframeUrl} width="180px" height="80px" style={{ display: showIframe ? 'block' : 'none', border: '0' }}></iframe>
          </div>
        )}
        {state.njumpIframe && (
          <div class="mt-3 ml-auto mr-auto flex justify-center">
            <iframe srcdoc={state.njumpIframe} width="600px" style={{ border: '0', height: "80vh", borderRadius: "8px" }}></iframe>
          </div>
        )}
        {!showIframe && showButton && (
          <div class="mt-3 ml-auto mr-auto w-72">
            <button-base
              onClick={e => {
                if (state.authUrl && !state.isLoading) {
                  this.handleContinueClick(e);
                } else {
                  this.handleStop(e);
                }
              }}
              titleBtn={!state.isLoading ? this.translations.buttons.continue : this.translations.buttons.cancel}
            />
          </div>
        )}
      </div>
    );
  }
}
