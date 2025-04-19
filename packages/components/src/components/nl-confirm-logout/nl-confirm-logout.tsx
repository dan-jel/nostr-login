import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { CURRENT_MODULE, METHOD_MODULE } from '@/types';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-confirm-logout',
  styleUrl: 'nl-confirm-logout.css',
  shadow: false,
})
export class NlConfirmLogout {
  @Event() handleLogoutBanner: EventEmitter<string>;
  @Event() handleBackUpModal: EventEmitter<string>;
  @Event() nlCloseModal: EventEmitter;

  @State() translations = {
    title: t('nlConfirmLogout.title'),
    description: t('nlConfirmLogout.description'),
    cancel: t('nlConfirmLogout.cancel'),
    confirm: t('nlConfirmLogout.confirm'),
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        title: t('nlConfirmLogout.title'),
        description: t('nlConfirmLogout.description'),
        cancel: t('nlConfirmLogout.cancel'),
        confirm: t('nlConfirmLogout.confirm'),
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleLogout() {
    this.handleLogoutBanner.emit(METHOD_MODULE.LOGOUT);
    this.nlCloseModal.emit();
  }

  handleCancel() {
    this.nlCloseModal.emit();
  }

  handleBackUp() {
    state.path = [CURRENT_MODULE.IMPORT_FLOW];
  }

  render() {
    return (
      <div class="p-4 overflow-y-auto">
        <h1 class="nl-title font-bold text-center text-4xl">{this.translations.title}</h1>
        <p class="nl-description font-light text-center text-lg pt-2 max-w-96 mx-auto">{this.translations.description}</p>

        <div class="mt-3 ml-auto mr-auto w-60 flex flex-col gap-2">
          <button-base onClick={() => this.handleBackUp()} titleBtn={this.translations.cancel} theme="lemonade" />
          <button-base onClick={() => this.handleLogout()} theme="crab" titleBtn={this.translations.confirm} />
        </div>
      </div>
    );
  }
}
