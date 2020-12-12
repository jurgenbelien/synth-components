import { SynthComponent, Parameter, html, customElement, property, internalProperty } from './synth-component';
import './parameter-slider';

export enum Wave {
  SINE = 'sine',
  TRI = 'triangle',
  SQUARE = 'square',
  SAW = 'sawtooth',
}

const MIN_FREQUENCY = 10;
const MAX_FREQUENCY = 10000;
const INIT_FREQUENCY = 440;

const ELEMENT_NAME = 'synth-oscillator';
@customElement(ELEMENT_NAME)
export class SynthOscillator extends SynthComponent {
  @property({ attribute: false })
  destination: AudioNode | { audioNode: AudioNode } | undefined;

  @property({ type: Number })
  pitch = 0;

  init(context: AudioContext, destination: AudioDestinationNode | undefined): void {
    this.context = context;
    this.audioNode = new OscillatorNode(this.context, {
      frequency: SynthOscillator.vOctToFrequency(this.pitch, this.frequency.value),
      type: this.wave,
    });
    if (destination) {
      this.audioNode.connect(destination);
    }
    this.audioNode.start();
  }

  @property({ attribute: false })
  frequency: Parameter = new Parameter(INIT_FREQUENCY, MIN_FREQUENCY, MAX_FREQUENCY, Parameter.LOG);

  @property({ type: String })
  wave: Wave = Wave.SAW;

  @internalProperty()
  protected audioNode: OscillatorNode | undefined;

  @internalProperty()
  protected context: AudioContext | undefined;

  @internalProperty()
  protected waveOptions = Object.values(Wave);

  static vOctToFrequency (vOct: number, baseFrequency = 440): number {
    return baseFrequency * Math.pow(2, vOct);
  }

  updated(changedProperties: Map<string, number | string | Parameter | undefined>) {
    if (!!this.context && !!this.audioNode) {
      const updateDestination = changedProperties.has('destination') && !!this.destination;
      const updateFrequency = changedProperties.has('pitch') || changedProperties.has('frequency');
      const updateWave = changedProperties.has('wave');

      switch (true) {
        case updateDestination: {
          let destination;
          if (this.destination instanceof AudioNode) {
            destination = this.destination;
          } else if (this.destination && this.destination.audioNode instanceof AudioNode) {
            destination = this.destination.audioNode;
          }
          if (destination) {
            this.audioNode.connect(destination);
          }
          break;
        }
        case updateWave:
          this.audioNode.type = this.wave;
          break;
        case updateFrequency:
          this.audioNode.frequency.setValueAtTime(
            SynthOscillator.vOctToFrequency(this.pitch, this.frequency.value),
            this.context.currentTime as number
          );
          break;
      }
    }
  }

  render() {
    const FREQUENCY = 'frequency';
    const WAVE = 'wave';
    return html`
      <form>
        <parameter-slider
          name=${FREQUENCY}
          label="Frequency"
          min=${this[FREQUENCY].min}
          max=${this[FREQUENCY].max}
          value=${this[FREQUENCY].value}
          taper=${this[FREQUENCY].taper}
          @input=${this.changeProperty}
        ></parameter-slider>

        <fieldset>
          <legend>Wave</legend>
          ${this.waveOptions.map(waveOption => html`
            <label>
              <input
                type="radio"
                name=${WAVE}
                value=${waveOption}
                ?checked=${waveOption === this[WAVE]}
                @change=${this.changeProperty}
                >
              ${waveOption}
            </label>
          `)}
        </fieldset>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SynthOscillator;
  }
}
