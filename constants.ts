import { SunLayer } from './types';

export const SUN_LAYERS: Readonly<SunLayer[]> = [
  {
    id: 'core',
    name: 'Core',
    description: "The Sun's dense central region where nuclear fusion produces immense energy. Temperatures soar to 15 million °C.",
    color: '#FFFFFF',
    radius: 18,
  },
  {
    id: 'radiative_zone',
    name: 'Radiative Zone',
    description: 'Energy from the core travels through this layer as electromagnetic radiation. This journey can take up to 170,000 years.',
    color: '#FF0000',
    radius: 40,
  },
  {
    id: 'convective_zone',
    name: 'Convective Zone',
    description: 'The outermost layer of the solar interior. Hot plasma rises, cools at the surface, and sinks, creating convection currents that transport heat.',
    color: '#FFA500',
    radius: 65,
  },
  {
    id: 'photosphere',
    name: 'Photosphere',
    description: "The visible surface of the Sun that we see. It's a 500 km-thick region where most of the Sun's light is emitted.",
    color: '#FFFF00',
    radius: 70,
  },
  {
    id: 'chromosphere',
    name: 'Chromosphere',
    description: 'An irregular layer of gas above the photosphere. It appears as a reddish glow during a solar eclipse.',
    color: '#FF4500',
    radius: 75,
  },
  {
    id: 'corona',
    name: 'Corona',
    description: "The Sun's tenuous outer atmosphere, extending millions of kilometers into space. It's only visible during a total solar eclipse.",
    color: '#FFFFE0',
    radius: 95,
    filter: 'url(#glow)',
    opacity: 0.5,
  },
];
