import { Component, h, Listen, State, Element, Event, EventEmitter, Prop } from '@stencil/core';
import { onLanguageChanged, changeLanguage, getLanguage } from '@/i18n/config';
import i18next from 'i18next';
import { NlTheme } from '@/types';

@Component({
  tag: 'nl-change-language',
  styleUrl: 'nl-change-language.css',
  shadow: false,
})
export class NlChangeLanguage {
  @State() isOpen: boolean = false;
  @State() currentLanguage: string = getLanguage();
  @Element() element: HTMLElement;
  @Prop() theme: NlTheme = 'default';
  @Prop() darkMode: boolean = false;

  @Event() handleLanguageChange: EventEmitter<string>;

  private unsubscribeLanguageChange: () => void;

  buttonRef: HTMLButtonElement;
  ulRef: HTMLUListElement;
  wrapperRef: HTMLDivElement;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.currentLanguage = getLanguage();
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

  calculateDropdownPosition() {
    if (this.isOpen && this.buttonRef) {
      const buttonRect = this.buttonRef.getBoundingClientRect();
      this.ulRef.style.top = `${buttonRect.height}px`;
    }
  }

  handleLanguageSelect(language: string) {
    changeLanguage(language);
    this.handleLanguageChange.emit(language);
    this.isOpen = false;
  }

  render() {
    const listClass = `${this.isOpen ? 'listClass flex flex-col gap-2' : 'hidden'} w-[50px] nl-select-list absolute z-10 left-0 shadow-md rounded-lg p-2 mt-1 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full`;

    return (
      <div class={`theme-${this.theme}`}>
        <div class={`relative w-[50px] ${this.darkMode ? 'dark' : ''}`} ref={el => (this.wrapperRef = el)}>
          <button
            ref={el => (this.buttonRef = el)}
            onClick={() => this.toggleDropdown()}
            type="button"
            class="nl-select peer py-1 px-4 flex items-center w-[50px] justify-center border-transparent rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:border-transparent"
          >
            <span class="text-gray-800 dark:text-white">{this.currentLanguage.toUpperCase()}</span>
          </button>

          <ul ref={el => (this.ulRef = el)} class={listClass}>
            {Object.keys(i18next.options.resources).map(code => (
              <li
                onClick={() => this.handleLanguageSelect(code)}
                class={`nl-select-option flex cursor-pointer items-center justify-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  this.currentLanguage === code ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                {code.toUpperCase()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
