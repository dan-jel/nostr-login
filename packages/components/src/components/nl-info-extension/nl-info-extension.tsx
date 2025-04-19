import { Component, h, State } from '@stencil/core';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-info-extension',
  styleUrl: 'nl-info-extension.css',
  shadow: false,
})
export class NlInfoExtension {
  @State() translations = {
    signingIn: t('nlInfoExtension.signingIn'),
    loading: t('nlInfoExtension.loading'),
    installExtension: {
      title: t('nlInfoExtension.installExtension.title'),
      description: t('nlInfoExtension.installExtension.description'),
    },
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        signingIn: t('nlInfoExtension.signingIn'),
        loading: t('nlInfoExtension.loading'),
        installExtension: {
          title: t('nlInfoExtension.installExtension.title'),
          description: t('nlInfoExtension.installExtension.description'),
        },
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  private renderTextWithLinks(text: string, urls: string[]) {
    const parts = text.split(/(<a>.*?<\/a>)/);
    let urlIndex = 0;

    return parts.map(part => {
      if (part.startsWith('<a>') && part.endsWith('</a>')) {
        const linkText = part.slice(3, -4);
        return (
          <a target="_blank" href={urls[urlIndex++]}>
            {linkText}
          </a>
        );
      }
      return part;
    });
  }

  render() {
    return (
      <div class="p-4 overflow-y-auto">
        {state.isLoadingExtension ? (
          <div>
            <h1 class="nl-title font-bold text-center text-4xl">{this.translations.signingIn}</h1>
            <div class="mt-10 mb-10 ml-auto mr-auto w-20">
              <span
                slot="icon-start"
                class="animate-spin-loading ml-auto mr-auto inline-block w-20 h-20 border-[4px] border-current border-t-transparent text-slate-900 dark:text-gray-300 rounded-full"
                role="status"
                aria-label={this.translations.loading}
              ></span>
            </div>
            <div class="ps-4 pe-4 overflow-y-auto">
              <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
            </div>
          </div>
        ) : (
          <div>
            <h1 class="nl-title font-bold text-center text-4xl">{this.translations.installExtension.title}</h1>
            <p class="nl-description font-light text-center text-lg pt-2 max-w-96 mx-auto">
              {this.renderTextWithLinks(this.translations.installExtension.description, [
                'https://getalby.com',
                'https://chromewebstore.google.com/detail/nos2x/kpgefcfmnafjgpblomihpgmejjdanjjp',
                'https://apps.apple.com/us/app/nostore/id1666553677',
              ])}
            </p>
          </div>
        )}
      </div>
    );
  }
}
