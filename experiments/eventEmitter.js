class EventEmitter {
  constructor() {
    this.callbacks = {}
  }

  on(event, cb) {
    if (!this.callbacks[event]) this.callbacks[event] = [];
    this.callbacks[event].push(cb)
  }

  emit(event, ...data) {
    let cbs = this.callbacks[event]
    let d;
    if (cbs) {
      cbs.forEach(cb => {
        const ret = cb(...data);

        if (ret)
          d = ret;
      })
    }

    return d;
  }

  removeListener(event, cb) {
    this.callbacks[event] = this.callbacks[event].filter((listener) => listener !== cb);
  }
}