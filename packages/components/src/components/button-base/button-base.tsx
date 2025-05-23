import { Component, h, Prop, Element, State } from '@stencil/core';
import { NlTheme } from '@/types';
import { IButton } from '@/types/button';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'button-base',
  styleUrl: 'button-base.css',
  shadow: false,
})
export class ButtonBase implements IButton {
  @Element() element: HTMLElement;
  @Prop({ mutable: true }) theme: NlTheme = 'default';
  @Prop({ mutable: true }) darkMode: boolean = false;
  @Prop() titleBtn = '';
  @Prop() disabled = false;

  @State() defaultTitle = t('buttonBase.defaultTitle');

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.defaultTitle = t('buttonBase.defaultTitle');
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  componentDidRender() {
    const svgElement = this.element.querySelector('svg');

    if (svgElement) {
      svgElement.classList.add('flex-shrink-0', 'w-4', 'h-4', 'block');
      svgElement.removeAttribute('style'); // hack frieze svg
    }
  }

  render() {
    return (
      <div class={`theme-${this.theme}`}>
        <div class="animate-spin-loading active"></div>
        <button
          disabled={this.disabled}
          type="button"
          class="nl-button py-2.5 px-3 w-full inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg  disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          <slot name="icon-start" />
          {this.titleBtn || this.defaultTitle}
        </button>
      </div>
    );
  }
}
