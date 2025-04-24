import { Component, h, Listen, Prop, State, Watch, Element, Event, EventEmitter } from '@stencil/core';
import { Info } from '@/types';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-change-account',
  styleUrl: 'nl-change-account.css',
  shadow: false,
})
export class NLChangeAccount {
  @State() isOpen: boolean = false;
  @State() options: Info[] = [];
  @Prop() accounts: Info[] = [];
  @Prop() currentAccount: Info = null;

  @Element() element: HTMLElement;
  @Event() handleOpenWelcomeModal: EventEmitter<string>;
  @Event() handleSwitchAccount: EventEmitter<Info>;

  @State() translations = {
    switchProfile: t('nlChangeAccount.switchProfile'),
    addProfile: t('nlChangeAccount.addProfile'),
  };

  private unsubscribeLanguageChange: () => void;

  buttonRef: HTMLButtonElement;
  ulRef: HTMLUListElement;
  wrapperRef: HTMLDivElement;

  connectedCallback() {
    this.themeState = this.theme;
    this.mode = this.darkMode;
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        switchProfile: t('nlChangeAccount.switchProfile'),
        addProfile: t('nlChangeAccount.addProfile'),
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  @Listen('click', { target: 'window' })
  handleWindowClick() {
    if (this.wrapperRef.querySelector('.listClass')) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    this.calculateDropdownPosition();
  }

  @State() mode: boolean = false;
  @Prop() darkMode: boolean = false;
  @State() themeState: 'default' | 'ocean' | 'lemonade' | 'purple' = 'default';
  @Prop() theme: 'default' | 'ocean' | 'lemonade' | 'purple' = 'default';
  @Watch('theme')
  watchPropHandler(newValue: 'default' | 'ocean' | 'lemonade' | 'purple') {
    this.themeState = newValue;
  }

  @Watch('darkMode')
  watchModeHandler(newValue: boolean) {
    this.mode = newValue;
  }

  @Watch('accounts')
  watchAccountsHandler(newValue: Info[]) {
    this.options = newValue;
  }

  calculateDropdownPosition() {
    if (this.isOpen && this.buttonRef) {
      const buttonRect = this.buttonRef.getBoundingClientRect();
      this.ulRef.style.top = `${buttonRect.height}px`;
    }
  }

  handleChange(el: Info) {
    this.handleSwitchAccount.emit(el);
  }

  handleOpenModal() {
    this.handleOpenWelcomeModal.emit();
  }

  render() {
    const listClass = `${this.isOpen ? 'listClass flex flex-col gap-2' : 'hidden'} w-full nl-select-list absolute z-10 left-0 shadow-md rounded-lg p-2 mt-1 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full`;
    const arrowClass = `${this.isOpen ? 'rotate-180' : 'rotate-0'} duration-300 flex-shrink-0 w-4 h-4 text-gray-500`;
    const filteredOptions =
      this.options && this.currentAccount ? this.options.filter(el => el.pubkey !== this.currentAccount.pubkey || el.authMethod !== this.currentAccount.authMethod) : [];

    return (
      <div class={`theme-${this.themeState}`}>
        <div class="relative" ref={el => (this.wrapperRef = el)}>
          <button
            ref={el => (this.buttonRef = el)}
            onClick={() => this.toggleDropdown()}
            type="button"
            class="nl-select peer py-3 px-4 flex items-center w-full justify-between border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:border-transparent"
          >
            <span class="text-gray-500">{this.translations.switchProfile}</span>
            <svg
              class={arrowClass}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <ul ref={el => (this.ulRef = el)} class={listClass}>
            {this.options &&
              filteredOptions.map(el => {
                const isShowImg = Boolean(el?.picture);
                const userName = el.name || el.nip05 || el.pubkey;
                const isShowUserName = Boolean(userName);

                return (
                  <li onClick={() => this.handleChange(el)} class="nl-select-option flex cursor-pointer items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm">
                    <div class="uppercase font-bold w-full max-w-6 h-6 rounded-full border border-gray-400 flex justify-center items-center">
                      {isShowImg ? (
                        <img class="w-full rounded-full" src={el.picture} alt="Logo" />
                      ) : isShowUserName ? (
                        userName[0]
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      )}
                    </div>
                    {/*<div class="truncate overflow-hidden w-full">{userName}</div>*/}

                    <div class="overflow-hidden flex flex-col w-full">
                      <div class="truncate overflow-hidden">{userName}</div>
                      <nl-login-status info={el} />
                    </div>
                  </li>
                );
              })}
            <li class="first:pt-0 pt-2 border-t-[1px] first:border-none border-gray-300">
              <div onClick={() => this.handleOpenModal()} class="nl-select-option flex cursor-pointer items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm">
                <div class="uppercase font-bold w-6 h-6 rounded-full border border-gray-400 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                {this.translations.addProfile}
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
