import { Component, Event, EventEmitter, Prop, h, State } from '@stencil/core';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-iframe',
  styleUrl: 'nl-iframe.css',
  shadow: false,
})
export class NlConfirmLogout {
  @Prop() iframeUrl = '';
  @Event() nlCloseModal: EventEmitter;

  @State() translations = {
    titleModal: t('nlIframe.titleModal'),
    description: t('nlIframe.description'),
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        titleModal: t('nlIframe.titleModal'),
        description: t('nlIframe.description'),
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleCancel() {
    this.nlCloseModal.emit();
  }

  render() {
    return (
      <div class="p-4 overflow-y-auto">
        <h1 class="nl-title font-bold text-center text-4xl">{this.translations.titleModal}</h1>
        <p class="nl-description font-light text-center text-lg pt-2 max-w-96 mx-auto">{this.translations.description}</p>

        <div class="mt-3 flex flex-col gap-2">
          {this.iframeUrl && (
            <iframe
              src={this.iframeUrl}
              style={{
                width: '100%',
                height: '600px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            ></iframe>
          )}
        </div>
      </div>
    );
  }
}
