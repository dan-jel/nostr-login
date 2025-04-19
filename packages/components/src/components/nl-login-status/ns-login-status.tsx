import { Info, RecentType } from '@/types';
import { Component, h, Prop, State } from '@stencil/core';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-login-status',
  // styleUrl: 'nl-login-status.css',
  shadow: false,
})
export class NlLoginStatus {
  @Prop() info: RecentType | Info | undefined;

  @State() translations = {
    extension: t('nlLoginStatus.extension'),
    readOnly: t('nlLoginStatus.readOnly'),
    connect: t('nlLoginStatus.connect'),
    local: t('nlLoginStatus.local'),
    otp: t('nlLoginStatus.otp')
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        extension: t('nlLoginStatus.extension'),
        readOnly: t('nlLoginStatus.readOnly'),
        connect: t('nlLoginStatus.connect'),
        local: t('nlLoginStatus.local'),
        otp: t('nlLoginStatus.otp')
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  render() {
    let text = '';
    let color = '';
    if (this.info.authMethod === 'extension') {
      text = this.translations.extension;
      color = 'border-yellow-300 text-yellow-500 bg-yellow-100';
    } else if (this.info.authMethod === 'readOnly') {
      text = this.translations.readOnly;
      color = 'border-gray-300 text-gray-400 bg-gray-100';
    } else if (this.info.authMethod === 'connect') {
      text = this.translations.connect;
      color = 'border-teal-300 text-teal-600 bg-teal-100';
    } else if (this.info.authMethod === 'local') {
      text = this.translations.local;
      color = 'border-red-300 text-red-600 bg-red-100';
    } else if (this.info.authMethod === 'otp') {
      text = this.translations.otp;
      color = 'border-orange-300 text-orange-600 bg-orange-100';
    } else {
      console.log('unknown auth method', this.info);
      throw new Error('Unknown auth method');
    }

    return (
      <div>
        <span class={`${color} rounded-xl border w-auto text-[10px] px-1 `}>{text}</span>
      </div>
    );
  }
}
