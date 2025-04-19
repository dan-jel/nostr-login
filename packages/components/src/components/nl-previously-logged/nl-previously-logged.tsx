import { Component, h, Fragment, Prop, Event, EventEmitter, Watch, State } from '@stencil/core';
import { CURRENT_MODULE, Info, RecentType } from '@/types';
import { state } from '@/store';
import { t, onLanguageChanged } from '@/i18n/config';

@Component({
  tag: 'nl-previously-logged',
  styleUrl: 'nl-previously-logged.css',
  shadow: false,
})
export class NlPreviouslyLogged {
  @State() translations = {
    title: t('nlPreviouslyLogged.title'),
    description: t('nlPreviouslyLogged.description'),
    activeProfiles: t('nlPreviouslyLogged.activeProfiles'),
    recentProfiles: t('nlPreviouslyLogged.recentProfiles'),
    addAnotherProfile: t('nlPreviouslyLogged.addAnotherProfile'),
  };

  @Prop() accounts: Info[] = [];
  @Prop() recents: RecentType[] = [];

  @Event() nlSwitchAccount: EventEmitter<Info>;
  @Event() nlLoginRecentAccount: EventEmitter<RecentType>;
  @Event() nlRemoveRecent: EventEmitter<RecentType>;

  private unsubscribeLanguageChange: () => void;

  connectedCallback() {
    this.unsubscribeLanguageChange = onLanguageChanged(() => {
      this.translations = {
        title: t('nlPreviouslyLogged.title'),
        description: t('nlPreviouslyLogged.description'),
        activeProfiles: t('nlPreviouslyLogged.activeProfiles'),
        recentProfiles: t('nlPreviouslyLogged.recentProfiles'),
        addAnotherProfile: t('nlPreviouslyLogged.addAnotherProfile'),
      };
    });
  }

  disconnectedCallback() {
    if (this.unsubscribeLanguageChange) {
      this.unsubscribeLanguageChange();
    }
  }

  handleGoToWelcome() {
    state.path = [CURRENT_MODULE.WELCOME];
  }

  switchToWelcomeIfEmpty() {
    if (!this.recents.length && !this.accounts.length) {
      state.path = [CURRENT_MODULE.WELCOME];
    }
  }

  @Watch('accounts')
  watchAccounts() {
    this.switchToWelcomeIfEmpty();
  }

  @Watch('recents')
  watchRecents() {
    this.switchToWelcomeIfEmpty();
  }

  handleRemoveRecent(user: Info) {
    this.nlRemoveRecent.emit(user);
  }

  handleSwitch(el: Info) {
    this.nlSwitchAccount.emit(el);
  }

  handleLoginRecentAccount(el: RecentType) {
    this.nlLoginRecentAccount.emit(el);
  }

  render() {
    return (
      <Fragment>
        <div class="p-4 pt-0 overflow-y-auto">
          <h1 class="nl-title font-bold text-center text-4xl">{this.translations.title}</h1>
          <p class="nl-description font-light text-center text-lg pt-2 max-w-96 mx-auto">{this.translations.description}</p>
        </div>
        <div class="p-4">
          {Boolean(this.accounts.length) && (
            <div class="max-w-96 mx-auto">
              <p class="nl-description font-medium text-sm pb-1.5">{this.translations.activeProfiles}</p>
              <ul class="p-2 rounded-lg border border-blue-200 flex flex-col w-full gap-0.5">
                {this.accounts.map(el => {
                  const isShowImg = Boolean(el?.picture);
                  const userName = el.name || el.nip05 || el.pubkey;
                  const isShowUserName = Boolean(userName);

                  return (
                    <li
                      onClick={() => this.handleSwitch(el)}
                      class="group hover:bg-gray-400 flex cursor-pointer gap-x-3.5 py-2 px-3 rounded-lg text-sm items-center justify-between"
                    >
                      <div class="flex items-center gap-x-3.5 w-full">
                        <div class="w-full max-w-7 h-7 flex relative">
                          <div class="absolute top-[-2px] right-[-2px] bg-white border-2 border-white rounded-xl">
                            <div class="active h-1.5 w-1.5 bg-green-500 rounded-xl"></div>
                          </div>
                          <div class="group-hover:border-blue-400 uppercase font-bold w-full h-full rounded-full border border-gray-400 flex justify-center items-center">
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
                        </div>

                        <div class="overflow-hidden flex flex-col w-full">
                          <div class="nl-title truncate overflow-hidden">{userName}</div>
                          <nl-login-status info={el} />
                        </div>
                      </div>
                      {/* <div class="w-full max-w-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full hover:text-blue-600">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                        />
                      </svg>
                    </div> */}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {Boolean(this.recents.length) && (
            <div class="max-w-96 mx-auto pt-5">
              <p class="nl-description font-medium text-sm pb-1.5">{this.translations.recentProfiles}</p>
              <ul class="p-2 rounded-lg border border-gray-200 flex flex-col w-full gap-0.5">
                {this.recents.map(el => {
                  const isShowImg = Boolean(el?.picture);
                  const userName = el.name || el.nip05 || el.pubkey;
                  const isShowUserName = Boolean(userName);

                  return (
                    <li
                      onClick={() => this.handleLoginRecentAccount(el)}
                      class="flex items-center gap-x-3.5 w-full hover:bg-gray-400 flex cursor-pointer items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm justify-between"
                    >
                      <div class="w-full max-w-7 h-7 flex relative">
                        <div class="absolute top-[-3px] right-[-3px] bg-white border border-white rounded-xl">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3 h-3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                          </svg>
                        </div>
                        <div class="uppercase font-bold w-full h-full rounded-full border border-gray-400 flex justify-center items-center">
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
                      </div>
                      <div class="overflow-hidden flex flex-col w-full">
                        <div class="nl-title truncate overflow-hidden">{userName}</div>
                        <nl-login-status info={el} />
                      </div>
                      <svg
                        onClick={e => {
                          e.stopPropagation();
                          this.handleRemoveRecent(el);
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-full max-w-6 h-6 text-red-500 hover:text-red-600 ml-auto"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div class="p-4 overflow-y-auto">
          <p class="nl-footer font-light text-center text-sm max-w-96 mx-auto">
            You can also{' '}
            <span onClick={() => this.handleGoToWelcome()} class="cursor-pointer pb-3 text-blue-500">
              {this.translations.addAnotherProfile}
            </span>
          </p>
        </div>
      </Fragment>
    );
  }
}
