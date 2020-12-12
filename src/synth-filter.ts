import { html, customElement, property, internalProperty, SynthComponent, Parameter } from './synth-component';

export enum FilterType {
  LP = 'lowpass',
  HP = 'highpass',
  BP = 'bandpass',
  NOTCH = 'notch',
}

const MIN_FREQUENCY = 10;
const MAX_FREQUENCY = 10000;
const INIT_FREQUENCY = 440;

const MIN_RESONANCE = 0.0001;
const MAX_RESONANCE = 1000;
const INIT_RESONANCE = 1;

const ELEMENT_NAME = 'synth-filter';
@customElement(ELEMENT_NAME)
export class SynthFilter extends SynthComponent {
  @property({ attribute: false })
  destination: AudioNode | undefined;

  @property({ type: Number })
  pitch = 0;

  init(context: AudioContext, destination: AudioDestinationNode | undefined) {
    this.context = context;
    this.audioNode = new BiquadFilterNode(this.context, {
      frequency: this.frequency.value,
      type: this.filterType,
    });
    if (destination) {
      this.audioNode.connect(destination);
    }
  }

  @property({ type: String })
  filterType: FilterType = FilterType.LP;

  @property({ attribute: false })
  frequency: Parameter = new Parameter(INIT_FREQUENCY, MIN_FREQUENCY, MAX_FREQUENCY, Parameter.LOG);

  @property({ attribute: false })
  resonance: Parameter = new Parameter(INIT_RESONANCE, MIN_RESONANCE, MAX_RESONANCE, Parameter.LOG);

  @internalProperty()
  protected audioNode: BiquadFilterNode | undefined;

  @internalProperty()
  protected context: AudioContext | undefined;

  @internalProperty()
  protected filterTypes = Object.values(FilterType);

  updated(changedProperties: Map<string, number | string | Parameter | undefined>) {
    if (!!this.context && !!this.audioNode) {
      const updateDestination = changedProperties.has('destination') && !!this.destination;
      const updateFilterType = changedProperties.has('filterType');
      const updateFrequency = changedProperties.has('pitch') || changedProperties.has('frequency');
      const updateResonance = changedProperties.has('resonance');

      switch (true) {
        case updateDestination:
          this.audioNode.connect(this.destination as AudioNode);
          break;
        case updateFilterType:
          this.audioNode.type = this.filterType;
          break;
        case updateFrequency:
          this.audioNode.frequency.setValueAtTime(
            SynthComponent.vOctToFrequency(this.pitch, this.frequency.value),
            this.context.currentTime as number
          );
          break;
        case updateResonance:
          this.audioNode.Q.setValueAtTime(
            this.resonance.value,
            this.context.currentTime as number
          );
          break;
      }
    }
  }

  render() {
    const FREQUENCY = 'frequency';
    const RESONANCE = 'resonance';
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

        <parameter-slider
          name=${RESONANCE}
          label="Resonance"
          min=${this[RESONANCE].min}
          max=${this[RESONANCE].max}
          value=${this[RESONANCE].value}
          taper=${this[RESONANCE].taper}
          @input=${this.changeProperty}
        ></parameter-slider>

        <fieldset>
          <legend>Filter type</legend>
          ${this.filterTypes.map(filterTypeOption => html`
            <label>
              <input
                type="radio"
                name="filterType"
                value=${filterTypeOption}
                ?checked=${filterTypeOption === this.filterType}
                @change=${this.changeProperty}
                >
              ${filterTypeOption}
            </label>
          `)}
        </fieldset>
      </form>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SynthFilter;
  }
}
