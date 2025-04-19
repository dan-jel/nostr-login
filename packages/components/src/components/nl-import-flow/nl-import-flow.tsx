import { Component, h, Fragment, State, Prop, Event, EventEmitter } from '@stencil/core';
import { state } from '@/store';
import { ConnectionString } from '@/types';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-import-flow',
  styleUrl: 'nl-import-flow.css',
  shadow: false,
})
export class NlImportFlow {
  @Prop() services: ConnectionString[] = [];

  @State() isContinued = false;
  @State() isKeyBackup = false;
  @State() isCopy = false;

  @Event() nlImportAccount: EventEmitter<ConnectionString>;
  @Event() nlExportKeys: EventEmitter<void>;

  @State() translations = {
    titleInfo: t('nlImportFlow.titleInfo'),
    titleImport: t('nlImportFlow.titleImport'),
    description: {
      intro: t('nlImportFlow.description.intro'),
      warning: t('nlImportFlow.description.warning'),
      backup: t('nlImportFlow.description.backup'),
      recommendation: t('nlImportFlow.description.recommendation')
    },
    buttons: {
      importToKeyStore: t('nlImportFlow.buttons.importToKeyStore'),
      exportKeys: t('nlImportFlow.buttons.exportKeys'),
      copyToClipboard: t('nlImportFlow.buttons.copyToClipboard'),
      copied: t('nlImportFlow.buttons.copied'),
      startImporting: t('nlImportFlow.buttons.startImporting')
    },
    keyExport: {
      title: t('nlImportFlow.keyExport.title'),
      description: {
        copy: t('nlImportFlow.keyExport.description.copy'),
        signIn: t('nlImportFlow.keyExport.description.signIn'),
        warning: t('nlImportFlow.keyExport.description.warning')
      }
    },
    serviceSelection: {
      description: t('nlImportFlow.serviceSelection.description'),
      defaultProvider: t('nlImportFlow.serviceSelection.defaultProvider')
    }
  };

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        titleInfo: t('nlImportFlow.titleInfo'),
        titleImport: t('nlImportFlow.titleImport'),
        description: {
          intro: t('nlImportFlow.description.intro'),
          warning: t('nlImportFlow.description.warning'),
          backup: t('nlImportFlow.description.backup'),
          recommendation: t('nlImportFlow.description.recommendation')
        },
        buttons: {
          importToKeyStore: t('nlImportFlow.buttons.importToKeyStore'),
          exportKeys: t('nlImportFlow.buttons.exportKeys'),
          copyToClipboard: t('nlImportFlow.buttons.copyToClipboard'),
          copied: t('nlImportFlow.buttons.copied'),
          startImporting: t('nlImportFlow.buttons.startImporting')
        },
        keyExport: {
          title: t('nlImportFlow.keyExport.title'),
          description: {
            copy: t('nlImportFlow.keyExport.description.copy'),
            signIn: t('nlImportFlow.keyExport.description.signIn'),
            warning: t('nlImportFlow.keyExport.description.warning')
          }
        },
        serviceSelection: {
          description: t('nlImportFlow.serviceSelection.description'),
          defaultProvider: t('nlImportFlow.serviceSelection.defaultProvider')
        }
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleDomainSelect(event: CustomEvent<string>) {
    const s = this.services.find(s => s.domain === event.detail);
    state.nlImport = s;
  }

  handleCreateAccount(e: MouseEvent) {
    e.preventDefault();
    this.nlImportAccount.emit(state.nlImport);
  }

  handleContinue() {
    this.isContinued = true;
  }

  handleContinueKeyBackup() {
    this.isKeyBackup = true;
  }

  async copyToClipboard() {
    this.nlExportKeys.emit();
    this.isCopy = true;

    setTimeout(() => {
      this.isCopy = false;
    }, 1500);
  }

  render() {
    if (!this.isContinued && !this.isKeyBackup) {
      return (
        <div class="p-4 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-2xl">{this.translations.titleInfo}</h1>
          <p class="nl-description font-light text-sm pt-2 pb-2 max-w-96 mx-auto">
            {this.translations.description.intro}
            <br />
            <br />
            {this.translations.description.warning}
            <br />
            <br />
            {this.translations.description.backup}
            <br />
            <br />
            {this.translations.description.recommendation}
          </p>
          <div class="ml-auto mr-auto mb-2 w-72">
            <button-base onClick={() => this.handleContinue()} titleBtn={this.translations.buttons.importToKeyStore} />
          </div>
          <div class="ml-auto mr-auto w-72">
            <button-base onClick={() => this.handleContinueKeyBackup()} titleBtn={this.translations.buttons.exportKeys} />
          </div>
        </div>
      );
    }

    if (this.isKeyBackup) {
      return (
        <div class="p-4 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-2xl">{this.translations.keyExport.title}</h1>
          <p class="nl-description font-light text-sm pt-2 pb-2 max-w-96 mx-auto">
            {this.translations.keyExport.description.copy}
            <br />
            <br />
            {this.translations.keyExport.description.signIn}
            <br />
            <br />
            {this.translations.keyExport.description.warning}
          </p>
          <div class="max-w-72 mx-auto">
            <div class="ml-auto mr-auto mb-2 w-72">
              <button-base onClick={() => this.copyToClipboard()} titleBtn={this.isCopy ? this.translations.buttons.copied : this.translations.buttons.copyToClipboard} />
            </div>
          </div>
        </div>
      );
    }

    const options = this.services.filter(s => s.canImport).map(s => ({ name: s.domain!, value: s.domain! }));

    return (
      <Fragment>
        <div class="p-4 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-2xl">{this.translations.titleImport}</h1>
          <p class="nl-description font-light text-center text-sm pt-2 max-w-96 mx-auto">
            {this.translations.serviceSelection.description}
          </p>
        </div>

        <div class="max-w-72 mx-auto mb-5">
          <div class="mb-0.5">
            <nl-select onSelectDomain={e => this.handleDomainSelect(e)} selected={0} options={options}></nl-select>
          </div>
          <p class="nl-title font-light text-sm mb-2">{this.translations.serviceSelection.defaultProvider}</p>

          <div class="ps-4 pe-4 overflow-y-auto">
            <p class="nl-error font-light text-center text-sm max-w-96 mx-auto">{state.error}</p>
          </div>

          <button-base disabled={state.isLoading} onClick={e => this.handleCreateAccount(e)} titleBtn={this.translations.buttons.startImporting}>
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

