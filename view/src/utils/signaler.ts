export default class Signaler {
  private _notify: (value: unknown) => void = () => {}
  private _signal: Promise<unknown> = Promise.resolve()

  constructor() {
    this._resetSignal()
  }

  public notify() {
    this._notify(null)
    this._resetSignal()
  }

  public get signal(): Promise<unknown> {
    return this._signal
  }

  private _resetSignal() {
    this._signal = new Promise(resolve => this._notify = resolve)
  }
}
