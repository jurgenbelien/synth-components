import { Taper } from './parameter';
import { html, customElement, property, internalProperty, SynthComponent, Parameter, SynthDestination } from './synth-component';

const MIN_GAIN = 0;
const MAX_GAIN = 2;
const INIT_GAIN = 0;

const ELEMENT_NAME = 'synth-amplifier';
@customElement(ELEMENT_NAME)
export class SynthAmplifier extends SynthComponent {
  @property({ attribute: false })
  destination: SynthDestination | undefined;

  @property({ attribute: false })
  gain: Parameter = new Parameter(INIT_GAIN, MIN_GAIN, MAX_GAIN, Taper.LIN);

  init(context: AudioContext, destination: SynthDestination | undefined) {
    this.context = context;
    this.audioNode = this.context.createGain();
    this.audioNode.gain.setValueAtTime(this.gain.value, this.context.currentTime);
    this.connectDestination(destination);
  }

  @internalProperty()
  protected audioNode: GainNode | undefined;

  @internalProperty()
  protected context: AudioContext | undefined;

  updated(changedProperties: Map<string, number | string | Parameter | undefined>) {
    if (!!this.context && !!this.audioNode) {
      const updateDestination = changedProperties.has('destination') && !!this.destination;
      const updateGain = changedProperties.has('gain');

      switch (true) {
        case updateDestination:
          this.connectDestination(this.destination);
          break;
        case updateGain:
          this.audioNode.gain.setValueAtTime(
            this.gain.value,
            this.context.currentTime as number
          );
          break;
      }
    }
  }

  render() {
    const GAIN = 'gain';
    return html`
      <form>
        <parameter-slider
          name=${GAIN}
          label="Gain"
          min=${this[GAIN].min}
          max=${this[GAIN].max}
          value=${this[GAIN].value}
          taper=${this[GAIN].taper}
          @input=${this.changeProperty}
        ></parameter-slider>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SynthAmplifier;
  }
}
