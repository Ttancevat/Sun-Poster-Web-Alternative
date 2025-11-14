

import React, { useState, useEffect, useMemo } from 'react';
import { SUN_LAYERS } from './constants';
import { SunLayer } from './types';

const StarryBackground: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 400 }).map((_, i) => ({
      key: `star-${i}`,
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: Math.random() * 0.8 + 0.2,
      animationDuration: `${Math.random() * 5 + 3}s`,
      animationDelay: `${Math.random() * 5}s`,
    }));
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.9; }
          }
          .star-twinkle {
            animation: twinkle infinite alternate;
          }
        `}
      </style>
      <div className="fixed top-0 left-0 w-full h-full -z-10" aria-hidden="true">
        <svg className="w-full h-full">
          <rect width="100%" height="100%" fill="black" />
          {stars.map(star => (
            <circle
              key={star.key}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              className="star-twinkle"
              style={{
                animationDuration: star.animationDuration,
                animationDelay: star.animationDelay,
              }}
            />
          ))}
        </svg>
      </div>
    </>
  );
};


type RotationMode = 'sidereal' | 'synodic';

interface SunDiagramProps {
  onLayerHover: (layer: SunLayer | null) => void;
  hoveredLayer: SunLayer | null;
  rotationAngle: number;
  earthAngle: number;
  mode: RotationMode;
}

const SunDiagram: React.FC<SunDiagramProps> = ({ onLayerHover, hoveredLayer, rotationAngle, earthAngle, mode }) => {
  const sortedLayers = [...SUN_LAYERS].reverse();

  return (
    <div className="relative w-full max-w-md lg:max-w-lg aspect-square">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background elements based on mode */}
        {mode === 'sidereal' && (
          <g id="sidereal-background">
            {/* Fixed reference point for sidereal rotation */}
            <path d="M 100 0 L 98 5 L 102 5 Z" fill="white" />
            <line x1="100" y1="5" x2="100" y2="10" stroke="white" strokeWidth="0.5" />
          </g>
        )}

        {mode === 'synodic' && (
          <g id="synodic-background">
            {/* Earth's orbit path */}
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" strokeDasharray="2 2" />
             {/* Earth's group for rotation */}
            <g transform={`rotate(${earthAngle} 100 100)`}>
              <circle cx="100" cy="15" r="3.5" fill="#3b82f6" />
               {/* Earth's vector */}
              <line x1="100" y1="15" x2="100" y2="7" stroke="white" strokeWidth="0.75" />
              <polygon points="100,6 98.5,9 101.5,9" fill="white" />
            </g>
          </g>
        )}

        <g transform="translate(30, 30) scale(0.7)">
          {sortedLayers.map((layer) => (
            <circle
              key={layer.id}
              cx="100"
              cy="100"
              r={layer.radius}
              className={`
                cursor-pointer
                origin-center
                transition-all duration-200
                ${hoveredLayer?.id === layer.id ? 'stroke-white stroke-[3px]' : 'stroke-none'}
              `}
              style={{
                fill: layer.color,
                fillOpacity: layer.opacity ?? 1,
              }}
              onMouseEnter={() => onLayerHover(layer)}
              onMouseLeave={() => onLayerHover(null)}
              filter={layer.filter || 'none'}
            />
          ))}

          {/* Sunspots on the Photosphere */}
          <g transform={`rotate(${rotationAngle} 100 100)`}>
              <circle cx="150" cy="145" r="4" fill="black" opacity="0.6" />
              <circle cx="40" cy="70" r="5" fill="black" opacity="0.5" />
              <circle cx="100" cy="32" r="3.5" fill="black" opacity="0.7" />
              {/* Sun's rotation vector */}
              <line x1="100" y1="100" x2="100" y2="25" stroke="black" strokeWidth="1" />
              <polygon points="100,23 98,27 102,27" fill="black" />
          </g>
        </g>
      </svg>
    </div>
  );
};

interface RotationControlsProps {
    mode: RotationMode;
    setMode: (mode: RotationMode) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    speed: number;
    setSpeed: (speed: number) => void;
    elapsedDays: number;
    onReset: () => void;
}

const RotationControls: React.FC<RotationControlsProps> = ({ mode, setMode, isPlaying, togglePlay, speed, setSpeed, elapsedDays, onReset }) => {
  return (
    <div className="w-full max-w-md lg:max-w-lg p-4 border-2 border-white bg-black bg-opacity-70 text-white space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Solar Rotation</h3>
        <div className="flex space-x-2">
            <button 
                onClick={() => setMode('sidereal')}
                className={`px-3 py-1 text-sm border-2 ${mode === 'sidereal' ? 'bg-white text-black' : 'border-white text-white'} transition-colors`}
            >
                Sidereal
            </button>
            <button 
                onClick={() => setMode('synodic')}
                className={`px-3 py-1 text-sm border-2 ${mode === 'synodic' ? 'bg-white text-black' : 'border-white text-white'} transition-colors`}
            >
                Synodic
            </button>
        </div>
      </div>
       <div className="flex justify-between items-center text-sm text-gray-300 h-12">
        <p>
            {mode === 'sidereal' 
              ? "Sidereal Period (25.38 days): Rotation vs distant stars."
              : "Synodic Period (26.24 days): Rotation vs moving Earth."
            }
        </p>
        <p className="font-mono text-lg whitespace-nowrap">
            {elapsedDays.toFixed(2)} days
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
            <button onClick={togglePlay} className="px-4 py-2 border-2 border-white w-24">
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button onClick={onReset} className="px-4 py-2 border-2 border-white">
              Reset
            </button>
        </div>
        <div className="flex-grow flex items-center space-x-2">
          <span className="text-sm">Speed</span>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};


interface InfoBoxProps {
  layer: SunLayer;
}

const InfoBox: React.FC<InfoBoxProps> = ({ layer }) => {
  return (
    <div className="w-64 p-4 bg-black border-2 border-white">
      <h2 className="text-2xl font-bold mb-3 text-white">{layer.name}</h2>
      <p className="text-white leading-relaxed">{layer.description}</p>
    </div>
  );
};

const ProtonProtonChainDiagram: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col md:flex-row items-start text-white space-y-4 md:space-y-0 md:space-x-4">
      {/* Left Section: Explanation */}
      <div className="w-full md:w-1/2">
        <h3 className="text-lg font-bold mb-2 underline">What is Nuclear Fusion?</h3>
        <p className="text-sm leading-relaxed">
          Nuclear fusion is a reaction in which two or more atomic nuclei are combined to form one or more different atomic nuclei and subatomic particles (neutrons or protons). The process releases an immense amount of energy.
        </p>
        <br/>
        <p className="text-sm leading-relaxed">
          Inside the Sun's core, extreme pressure and temperatures of 15 million °C cause hydrogen nuclei to collide with enough speed to overcome their mutual repulsion and fuse. This ongoing reaction is what powers the Sun, releasing the energy that sustains our solar system.
        </p>
      </div>

      {/* Right Section: Diagram */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
         <h3 className="text-lg font-bold mb-4 underline">Proton-Proton Chain Reaction</h3>
      
        {/* Step 1 */}
        <div className="mb-3">
          <p className="mb-1 text-sm">Step 1: Two Protons Fuse</p>
          <div className="flex items-center justify-center space-x-2 text-base">
            <span>(¹H) + (¹H)</span>
            <span className="text-lg">→</span>
            <span>(²H) + e⁺ + ν</span>
          </div>
          <p className="text-xs italic">(Forms Deuterium, a Positron, and a Neutrino)</p>
        </div>

        {/* Step 2 */}
        <div className="mb-3">
          <p className="mb-1 text-sm">Step 2: Deuterium Fuses with a Proton</p>
          <div className="flex items-center justify-center space-x-2 text-base">
            <span>(²H) + (¹H)</span>
            <span className="text-lg">→</span>
            <span>(³He) + γ</span>
          </div>
          <p className="text-xs italic">(Forms Helium-3 and a Gamma Ray)</p>
        </div>

        {/* Step 3 */}
        <div>
          <p className="mb-1 text-sm">Step 3: Two Helium-3 Nuclei Fuse</p>
          <div className="flex items-center justify-center space-x-2 text-base">
            <span>(³He) + (³He)</span>
            <span className="text-lg">→</span>
            <span>(⁴He) + (¹H) + (¹H)</span>
          </div>
          <p className="text-xs italic">(Forms Helium-4 and releases two Protons)</p>
        </div>
      </div>
    </div>
  );
};

const TravelTimeDiagram: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col text-white">
      <h3 className="text-lg font-bold mb-2 text-center underline">Journey from the Sun to Earth</h3>
      <p className="text-sm text-center mb-4 italic">Average Distance: 149.6 million km (93 million miles)</p>
      
      <div className="flex-grow flex items-center justify-between px-2 sm:px-4">
        {/* Sun representation */}
        <span className="text-2xl sm:text-4xl font-bold">SUN</span>

        {/* Path representations */}
        <div className="flex-grow flex flex-col justify-center items-center text-center mx-2 sm:mx-4">
          
          {/* Path 1: Light */}
          <div className="w-full mb-6">
            <p className="text-sm relative bottom-1 right-4">Photons (Light)</p>
            <div className="w-full h-px bg-white relative mt-1">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 px-2 text-xs whitespace-nowrap">8 min, 20 sec</span>
            </div>
          </div>
          
          {/* Path 2: Neutrinos */}
          <div className="w-full mb-6">
            <p className="text-sm">Neutrinos</p>
            <div className="w-full border-t-2 border-dashed border-white relative mt-1">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 px-2 text-xs whitespace-nowrap">8 min, 20 sec</span>
            </div>
          </div>
          
          {/* Path 3: Solar Wind */}
          <div className="w-full">
            <p className="text-sm">Solar Wind</p>
             <div className="w-full border-t-2 border-dotted border-white relative mt-1">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 px-2 text-xs">1-4 Days</span>
            </div>
          </div>

        </div>

        {/* Earth representation */}
        <span className="text-2xl sm:text-4xl font-bold">EARTH</span>
      </div>

      <p className="text-xs italic text-center mt-2 px-4">
        Fun Fact: While light takes ~8 minutes to reach us from the Sun's surface, the energy can take over 100,000 years to escape the core!
      </p>
    </div>
  );
};

const SOLAR_DATA = {
    'Spectral Type': 'G2V',
    'Radius': '696,340 km',
    'Volume': '1.41 × 10¹⁸ km³',
    'Surface Area': '6.09 × 10¹² km²',
    'Mass': '1.989 × 10³⁰ kg',
    'Mean Density': '1.41 g/cm³',
    'Surface Gravity': '274 m/s² (28 g)',
    'Escape Velocity': '617.7 km/s',
    'Age': '≈4.6 Billion Years',
    'Velocity': '≈20 km/s relative to nearby stars',
};

const SunFactsPanel: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    return (
        <div className={`
            fixed top-0 left-0 h-full w-72 bg-black bg-opacity-80 border-r-2 border-white z-20
            transition-transform duration-300 ease-in-out p-6
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <h2 className="text-2xl font-bold mb-6 text-center">About Our Sun</h2>
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
                <ul className="space-y-3 text-sm">
                    {Object.entries(SOLAR_DATA).map(([key, value]) => (
                        <li key={key} className="flex justify-between items-start border-b border-gray-600 pb-2">
                            <span className="font-semibold mr-4">{key}:</span>
                            <span className="text-right">{value}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const FactsToggleButton: React.FC<{ isOpen: boolean; onToggle: () => void; }> = ({ isOpen, onToggle }) => {
    return (
        <button 
            onClick={onToggle}
            className={`
                fixed top-1/2 -translate-y-1/2 z-30
                w-12 h-32 bg-black bg-opacity-80 border-2 border-l-0 border-white
                flex items-center justify-center
                transition-all duration-300 ease-in-out
                ${isOpen ? 'left-72' : 'left-0'}
            `}
            aria-label={isOpen ? 'Collapse sun facts panel' : 'Expand sun facts panel'}
            aria-expanded={isOpen}
        >
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <span className="[writing-mode:vertical-rl] rotate-180 font-bold tracking-widest uppercase">
                  About Our Sun
              </span>
            </div>
        </button>
    );
};


export default function App() {
  const [hoveredLayer, setHoveredLayer] = useState<SunLayer | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isFactsPanelOpen, setIsFactsPanelOpen] = useState(false);

  // State for solar rotation animation
  const [mode, setMode] = useState<RotationMode>('sidereal');
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [elapsedDays, setElapsedDays] = useState(0);

  // Animation clock
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
        if (isPlaying) {
            // This increment is scaled by the speed slider to control animation speed
            const DAY_INCREMENT = 0.05 * speed; 
            setElapsedDays(prev => prev + DAY_INCREMENT);
        }
        animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, speed]);

  const handleReset = () => {
    setIsPlaying(false); // Pause on reset for better control
    setElapsedDays(0);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };
  
  // Constants for accurate rotation periods
  const SIDEREAL_PERIOD = 25.38; // days
  const SYNODIC_PERIOD = 26.24; // days

  // This is the sun's true rotational speed in degrees per day
  const sunSiderealDegreesPerDay = 360 / SIDEREAL_PERIOD;

  // This is the implied orbital speed for Earth in degrees per day to match the desired synodic period
  const earthImpliedDegreesPerDay = 360 * (1 / SIDEREAL_PERIOD - 1 / SYNODIC_PERIOD);

  // Calculate current angles based on elapsed time
  const rotationAngle = (elapsedDays * sunSiderealDegreesPerDay) % 360;
  const earthAngle = mode === 'synodic' ? (elapsedDays * earthImpliedDegreesPerDay) % 360 : 0;
  
  const mainContentClasses = `
    flex-grow
    transition-all duration-300 ease-in-out
    ${isFactsPanelOpen ? 'lg:ml-72' : 'lg:ml-12'}
  `;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <StarryBackground />
      <SunFactsPanel isOpen={isFactsPanelOpen} />
      <FactsToggleButton isOpen={isFactsPanelOpen} onToggle={() => setIsFactsPanelOpen(!isFactsPanelOpen)} />
      
      <main 
        onMouseMove={handleMouseMove}
        className={`text-white min-h-screen flex flex-col lg:flex-row antialiased relative ${mainContentClasses}`}
      >
        {hoveredLayer && (
          <div
            className="fixed pointer-events-none z-10"
            style={{
              left: mousePosition.x + 15,
              top: mousePosition.y + 15,
            }}
          >
            <InfoBox layer={hoveredLayer} />
          </div>
        )}

        {/* Left Side: Sun Diagram */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 space-y-4">
          <SunDiagram 
              onLayerHover={setHoveredLayer} 
              hoveredLayer={hoveredLayer}
              rotationAngle={rotationAngle}
              earthAngle={earthAngle}
              mode={mode}
          />
          <RotationControls
              mode={mode}
              setMode={setMode}
              isPlaying={isPlaying}
              togglePlay={() => setIsPlaying(!isPlaying)}
              speed={speed}
              setSpeed={setSpeed}
              elapsedDays={elapsedDays}
              onReset={handleReset}
          />
        </div>

        {/* Right Side: Info Panels */}
        <div className="w-full lg:w-1/2 flex flex-col p-4 lg:p-8 space-y-4 lg:space-y-8">
          {/* Top Panel */}
          <div className="flex-1 min-h-[15rem] bg-black bg-opacity-70 border-2 border-white">
            <ProtonProtonChainDiagram />
          </div>
          
          {/* Bottom Panel */}
          <div className="flex-1 min-h-[15rem] bg-black bg-opacity-70 border-2 border-white">
            <TravelTimeDiagram />
          </div>
        </div>
      </main>
    </div>
  );
}