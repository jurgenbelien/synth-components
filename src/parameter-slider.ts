import { html, css, customElement, property, LitElement } from 'lit-element';
import { Taper } from './parameter';

const ELEMENT_NAME = 'parameter-slider';

@customElement(ELEMENT_NAME)
export class ParameterSlider extends LitElement {
  @property({ type: String })
  name: string = ELEMENT_NAME;

  @property({ type: String })
  label: string = 'Parameter';

  @property({ type: Number })
  min = 0;

  @property({ type: Number })
  max = 0;

  @property({ type: Number, reflect: true })
  value = 0;

  @property({ type: String })
  taper: Taper = Taper.LOG;

  @property({ type: Number })
  precision: number = 0.001;

  // Value to position
  get position() {
    let value = this.value;
    let min = this.min;
    let max = this.max;

    if (this.taper === Taper.LOG) {
      value = Math.log2(this.value);
      min = Math.log2(this.min);
      max = Math.log2(this.max);
    }
    return (value - min) / (max - min);
  }

  static get styles() {
    return css`
      :host {
        display: block;
       }
    `;
  }

  changePosition({ currentTarget }: { currentTarget: HTMLInputElement }) {
    const position = Number(currentTarget.value);
    let value;
    if (this.taper === Taper.LOG) {
      const min = Math.log2(this.min);
      const max = Math.log2(this.max);
      value = Math.pow(2, position * (max - min) + min);
    } else {
      const min = this.min;
      const max = this.max;
      value = position * (max - min) + min;
    }
    this.value = value;
  }

  render() {
    return html`
      <label for=${this.name}>
        ${this.label}
      </label>
      <small>
        ${this.min}
      </small>
      <input
        id=${this.name}
        type="range"
        min="0"
        max="1"
        step=${this.precision}
        value=${this.position}
        @input=${this.changePosition}
      >
      <small>
        ${this.max}
      </small>
      <output for=${this.name}>
        ${this.value}
      </output>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ParameterSlider;
  }
}
