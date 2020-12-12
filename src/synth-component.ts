import { LitElement, property, internalProperty } from 'lit-element';
import { Parameter } from './parameter';
import { ParameterSlider } from './parameter-slider';
export * from './parameter';
export * from 'lit-element';

// Support string index for properties
export interface SynthComponent {
  [key: string]: any; //eslint-disable-line
}

export type PropertyInputElement = HTMLInputElement | HTMLTextAreaElement | ParameterSlider;
export type SynthDestination =  AudioNode | { audioNode: AudioNode };
export class SynthComponent extends LitElement {
  @property({ attribute: false })
  destination: SynthDestination | undefined;

  @internalProperty()
  protected audioNode: AudioNode | undefined;

  @internalProperty()
  protected context: AudioContext | undefined;

  static vOctToFrequency (vOct: number, base = 0): number {
    return base * Math.pow(2, vOct);
  }

  connectDestination(destination?: SynthDestination) {
    let audioDestinationNode;
    if (destination instanceof AudioNode) {
      audioDestinationNode = destination;
    } else if (destination && destination.audioNode instanceof AudioNode) {
      audioDestinationNode = destination.audioNode;
    }
    if (audioDestinationNode && this.audioNode) {
      this.destination = destination;
      this.audioNode.connect(audioDestinationNode);
    }
  }

  init(context: AudioContext, destination?: SynthDestination) {
    this.context = context;
    this.audioNode = new AudioNode();
    this.connectDestination(destination);
  }

  changeProperty({ currentTarget }: { currentTarget: PropertyInputElement }) {
    const property = currentTarget.name;
    const value = currentTarget.value;
    const isParameter = this[property] instanceof Parameter;
    const type = (isParameter)
      ? Parameter
      : typeof this[property];

    switch (type) {
      case 'boolean':
        this[property] = Boolean(value);
        break;
      case 'number':
        this[property] = Number(value);
        break;
      case 'string':
        this[property] = value;
        break;
      case Parameter: {
        const { min, max, taper } = this[property] as Parameter;
        this[property] = new Parameter(Number(value), min, max, taper);
        break;
      }
    }

  }

}
