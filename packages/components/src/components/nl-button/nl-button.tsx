import { Component, h, Prop, State } from '@stencil/core';
import { NlTheme } from '@/types';
import { IButton } from '@/types/button';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-button',
  shadow: true,
})
export class NlButton implements IButton {
  @Prop() theme: NlTheme = 'default';
  @Prop() darkMode: boolean = false;
  @Prop() titleBtn: string = '';
  @Prop() disabled = false;

  @State() defaultTitle = t('nlButton.defaultTitle');

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.defaultTitle = t('nlButton.defaultTitle');
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  render() {
    return <button-base theme={this.theme} darkMode={this.darkMode} titleBtn={this.titleBtn || this.defaultTitle} disabled={this.disabled} />;
  }
}
