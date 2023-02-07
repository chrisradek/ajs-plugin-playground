class SegmentEventReference {
  private _listeners: Function[] = []

  emit(type: 'http', reference: any) {
    this._listeners.forEach(cb => cb.call(this, reference));
  }

  on(type: 'http', cb: (ref: any) => void) {
    this._listeners.push(cb);
    return this;
  }

  off(type: 'http', cb: (ref: any) => void) {
    const idx = this._listeners.indexOf(cb);
    if (idx >= 0) {
      this._listeners.splice(idx, 1);
    }
    return this;
  }
}

export const segmentEventReference = new SegmentEventReference()

// Late night hacky ideas...
const spyFetch = new Proxy(fetch, {
  apply(target, thisArg, args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('api.segment.io/v1')) {
      segmentEventReference.emit('http', JSON.stringify(JSON.parse(args[1].body), null, 2));
    }
    return Reflect.apply(target, thisArg, args);
  },
});

window.fetch = spyFetch