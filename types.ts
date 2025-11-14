export interface SunLayer {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly color: string;
  readonly radius: number;
  readonly filter?: string;
  readonly opacity?: number;
}
