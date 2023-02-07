import { Analytics, Context, Plugin as AjsPlugin } from '@segment/analytics-next'

export type MutatorEvents = 'register' | 'deregister';
export type OnCallback = (ajs: Analytics) => void

export class MutatorPlugin implements AjsPlugin {
  private _originalRegister?: Analytics['register'];
  private _originalDeregister?: Analytics['deregister'];
  private _deregisterListeners: OnCallback[] = [];
  private _registerListeners: OnCallback[] = [];

  name: string = 'Mutator Plugin';
  type: AjsPlugin['type'] = 'utility';
  version: string = '1.0.0';
  isLoaded = () => true;
  async load(ctx: Context, analytics: Analytics) {
    const self = this;
    const register = this._originalRegister = analytics.register;
    const deregister = this._originalDeregister = analytics.deregister;

    analytics.register = async function(...args) {
      const result = await register.call(this, ...args);
      self._emit('register', this);
      return result;
    }

    analytics.deregister = async function(...args) {
      const result = await deregister.call(this, ...args);
      self._emit('deregister', this);
      return result;
    }
  }
  
  unload(ctx: Context, analytics: Analytics) {
    this._deregisterListeners = [];
    this._registerListeners = [];

    analytics.register = this._originalRegister ?? analytics.register;
    analytics.deregister = this._originalDeregister ?? analytics.deregister;
  }

  private _getListeners(type: MutatorEvents) {
    switch (type) {
      case 'deregister':
        return this._deregisterListeners;
      case 'register':
        return this._registerListeners;
      default:
        return []
    }
  }

  private _emit(event: MutatorEvents, analytics: Analytics) {
    this._getListeners(event).forEach((cb) => cb(analytics))
  }

  on(event: MutatorEvents, cb: OnCallback) {
    this._getListeners(event).push(cb)
    return this;
  }

  off(event: MutatorEvents, cb: OnCallback) {
    const listeners = this._getListeners(event);
    const foundIndex = listeners.indexOf(cb);
    if (foundIndex >= 0) {
      listeners.splice(foundIndex, 1)
    }
    return this;
  }


}
