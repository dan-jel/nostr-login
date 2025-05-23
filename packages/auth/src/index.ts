import 'nostr-login-components';
import { AuthNostrService, NostrExtensionService, Popup, NostrParams, Nostr, ProcessManager, BannerManager, ModalManager } from './modules';
import { NostrLoginAuthOptions, NostrLoginOptions, StartScreens } from './types';
import { localStorageGetAccounts, localStorageGetCurrent, localStorageGetRecents, localStorageSetItem } from './utils';
import { Info } from 'nostr-login-components/dist/types/types';
import { NostrObjectParams } from './modules/Nostr';

export class NostrLoginInitializer {
  public extensionService: NostrExtensionService;
  public params: NostrParams;
  public authNostrService: AuthNostrService;
  public nostr: Nostr;
  public processManager: ProcessManager;
  public popupManager: Popup;
  public bannerManager: BannerManager;
  public modalManager: ModalManager;

  private customLaunchCallback?: () => void;

  constructor() {
    this.params = new NostrParams();
    this.processManager = new ProcessManager();
    this.popupManager = new Popup();
    this.bannerManager = new BannerManager(this.params);
    this.authNostrService = new AuthNostrService(this.params);
    this.extensionService = new NostrExtensionService(this.params);
    this.modalManager = new ModalManager(this.params, this.authNostrService, this.extensionService);

    const nostrApi: NostrObjectParams = {
      waitReady: async () => {
        await this.authNostrService.waitReady();
        await this.modalManager.waitReady();
      },
      getUserInfo: () => this.params.userInfo,
      getSigner: () => {
        if (this.params.userInfo!.authMethod === 'readOnly') throw new Error('Read only');
        return this.params.userInfo!.authMethod === 'extension' ? this.extensionService.getExtension() : this.authNostrService;
      },
      launch: () => {
        return this.launch();
      },
      wait: cb => this.processManager.wait(cb),
    };

    this.nostr = new Nostr(nostrApi);

    this.processManager.on('onCallTimeout', () => {
      this.bannerManager.onCallTimeout();
    });

    this.processManager.on('onCallEnd', () => {
      this.bannerManager.onCallEnd();
      this.modalManager.onCallEnd();
    });

    this.processManager.on('onCallStart', () => {
      this.bannerManager.onCallStart();
    });

    this.authNostrService.on('onIframeUrl', url => {
      this.modalManager.onIframeUrl(url);
    });

    this.authNostrService.on('iframeRestart', ({ iframeUrl }) => {
      this.processManager.onIframeUrl();
      this.bannerManager.onIframeRestart(iframeUrl);
    });

    this.authNostrService.on('onAuthUrl', ({ url, iframeUrl, eventToAddAccount }) => {
      this.processManager.onAuthUrl();

      if (eventToAddAccount) {
        this.modalManager.onAuthUrl(url);
        return;
      }

      if (this.params.userInfo) {
        // show the 'Please confirm' banner
        this.bannerManager.onAuthUrl(url, iframeUrl);
      } else {
        // if it fails we will either return 'failed'
        // to the window.nostr caller, or show proper error
        // in our modal
        this.modalManager.onAuthUrl(url);
      }
    });

    this.authNostrService.on('updateAccounts', () => {
      this.updateAccounts();
    });

    this.authNostrService.on('onUserInfo', info => {
      this.bannerManager.onUserInfo(info);
    });

    this.modalManager.on('onAuthUrlClick', url => {
      this.openPopup(url);
    });

    this.bannerManager.on('onIframeAuthUrlClick', url => {
      this.modalManager.showIframeUrl(url);
    });

    this.modalManager.on('onSwitchAccount', async (info: Info) => {
      this.switchAccount(info);
    });

    this.modalManager.on('onLogoutBanner', async (info: Info) => {
      logout();
    });

    this.bannerManager.on('onConfirmLogout', async () => {
      // @ts-ignore
      this.launch('confirm-logout');
    });

    this.modalManager.on('updateAccounts', () => {
      this.updateAccounts();
    });

    this.bannerManager.on('logout', () => {
      logout();
    });

    this.bannerManager.on('onAuthUrlClick', url => {
      this.openPopup(url);
    });

    this.bannerManager.on('onSwitchAccount', async (info: Info) => {
      this.switchAccount(info);
    });

    this.bannerManager.on('import', () => {
      this.launch('import');
    });

    this.extensionService.on('extensionLogin', (pubkey: string) => {
      this.authNostrService.setExtension(pubkey);
    });

    this.extensionService.on('extensionLogout', () => {
      logout();
    });

    this.bannerManager.on('launch', (startScreen?: StartScreens) => {
      this.launch(startScreen);
    });
  }

  private openPopup(url: string) {
    this.popupManager.openPopup(url);
  }

  private async switchAccount(info: Info, signup = false) {
    console.log('nostr login switch to info', info);

    // make sure extension is unlinked
    this.extensionService.unsetExtension(this.nostr);

    if (info.authMethod === 'readOnly') {
      this.authNostrService.setReadOnly(info.pubkey);
    } else if (info.authMethod === 'otp') {
      this.authNostrService.setOTP(info.pubkey, info.otpData || '');
    } else if (info.authMethod === 'local' && info.sk) {
      this.authNostrService.setLocal(info, signup);
    } else if (info.authMethod === 'extension') {
      // trySetExtensionForPubkey will check if
      // we still have the extension and it's the same pubkey
      await this.extensionService.trySetExtensionForPubkey(info.pubkey);
    } else if (info.authMethod === 'connect' && info.sk && info.relays && info.relays[0]) {
      this.authNostrService.setConnect(info);
    } else {
      throw new Error('Bad auth info');
    }
  }

  private updateAccounts() {
    const accounts = localStorageGetAccounts();
    const recents = localStorageGetRecents();
    this.bannerManager.onUpdateAccounts(accounts);
    this.modalManager.onUpdateAccounts(accounts, recents);
  }

  public async launchCustomNostrConnect() {
    try {
      if (this.authNostrService.isAuthing()) this.authNostrService.cancelNostrConnect();

      const customLaunchPromise = new Promise<void>(ok => (this.customLaunchCallback = ok));
      await this.authNostrService.startAuth();
      await this.authNostrService.sendNeedAuth();

      try {
        await this.authNostrService.nostrConnect();
        await this.authNostrService.endAuth();
      } catch (e) {
        // if client manually launches the UI we'll
        // have cancelled error from the nostrConnect call,
        // and that's when we should block on the customLaunchPromise
        if (e === 'cancelled') await customLaunchPromise;
      }
    } catch (e) {
      console.error('launchCustomNostrConnect', e);
    }
  }

  private fulfillCustomLaunchPromise() {
    if (this.customLaunchCallback) {
      const cb = this.customLaunchCallback;
      this.customLaunchCallback = undefined;
      cb();
    }
  }

  public launch = async (startScreen?: StartScreens | 'default') => {
    if (!startScreen) {
      if (this.params.optionsModal.customNostrConnect) {
        return this.launchCustomNostrConnect();
      }
    }

    const recent = localStorageGetRecents();
    const accounts = localStorageGetAccounts();

    const options = { ...this.params.optionsModal };
    if (startScreen && startScreen !== 'default') options.startScreen = startScreen;
    else if (Boolean(recent?.length) || Boolean(accounts?.length)) {
      options.startScreen = 'switch-account';
    }

    // if we're being manually called in the middle of customNostrConnect
    // flow then we'll reset the current auth session and launch
    // our manual flow and then release the customNostrConnect session
    // as if it finished properly
    if (this.customLaunchCallback) this.authNostrService.cancelNostrConnect();
    try {
      await this.modalManager.launch(options);

      // if custom launch was interrupted by manual
      // launch then we unlock the custom launch to make
      // it proceed
      this.fulfillCustomLaunchPromise();
    } catch (e) {
      // don't throw if cancelled
      console.log('nostr-login failed', e);
    }
  };

  public init = async (opt: NostrLoginOptions) => {
    // watch for extension trying to overwrite our window.nostr
    this.extensionService.startCheckingExtension(this.nostr);

    // set ourselves as nostr

    // @ts-ignore
    window.nostr = this.nostr;

    // connect launching of our modals to nl-button elements
    this.modalManager.connectModals(opt);

    // launch
    this.bannerManager.launchAuthBanner(opt);

    // store options
    if (opt) {
      this.params.optionsModal = { ...opt };
    }

    try {
      // read conf from localstore
      const info = localStorageGetCurrent();

      // have current session?
      if (info) {
        // wtf?
        if (!info.pubkey) throw new Error('Bad stored info');

        // switch to it
        await this.switchAccount(info);
      }
    } catch (e) {
      console.log('nostr login init error', e);

      await logout();
    }

    // ensure current state
    this.updateAccounts();
  };

  public logout = async () => {
    // replace back
    this.extensionService.unsetExtension(this.nostr);

    await this.authNostrService.logout();
  };

  public setDarkMode = (dark: boolean) => {
    localStorageSetItem('nl-dark-mode', `${dark}`);
    this.bannerManager.onDarkMode(dark);
    this.modalManager.onDarkMode(dark);
  };

  public setAuth = async (o: NostrLoginAuthOptions) => {
    if (!o.type) throw new Error('Invalid auth event');
    if (o.type !== 'login' && o.type !== 'logout' && o.type !== 'signup') throw new Error('Invalid auth event');
    if (o.method && o.method !== 'connect' && o.method !== 'extension' && o.method !== 'local' && o.method !== 'otp' && o.method !== 'readOnly')
      throw new Error('Invalid auth event');

    if (o.type === 'logout') return this.logout();

    if (!o.method || !o.pubkey) throw new Error('Invalid pubkey');

    const info: Info = {
      authMethod: o.method,
      pubkey: o.pubkey,
      relays: o.relays,
      sk: o.localNsec,
      otpData: o.otpData,
      name: o.name,
    };
    await this.switchAccount(info, o.type === 'signup');
  };

  public cancelNeedAuth = () => {
    console.log("cancelNeedAuth");
    this.fulfillCustomLaunchPromise();
    this.authNostrService.cancelNostrConnect();
  };
}

const initializer = new NostrLoginInitializer();

export const { init, launch, logout, setDarkMode, setAuth, cancelNeedAuth } = initializer;

document.addEventListener('nlLogout', logout);
document.addEventListener('nlLaunch', (event: any) => {
  launch(event.detail || '');
});
document.addEventListener('nlNeedAuthCancel', () => {
  cancelNeedAuth();
});
document.addEventListener('nlDarkMode', (event: any) => {
  setDarkMode(!!event.detail);
});
document.addEventListener('nlSetAuth', (event: any) => {
  setAuth(event.detail as NostrLoginAuthOptions);
});
