export enum Taper {
  LIN = 'lin',
  LOG = 'lin',
}

export class Parameter {
  value: number;
  static LIN = Taper.LIN;
  static LOG = Taper.LOG;
  protected _min: number;
  protected _max: number;
  protected _taper: Taper;

  constructor(initial: number, min = 0, max: number, taper: Taper = Taper.LOG) {
    this.value = initial;
    this._max = max;
    this._min = min;
    this._taper = taper;
  }

  get min() {
    return this._min;
  }

  get max() {
    return this._max;
  }

  get taper() {
    return this._taper;
  }
}
