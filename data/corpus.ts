import type {
  FormulaCard,
  QuizItem,
  SimulatorMeta,
  Topic,
} from '@/types/content';

import { LESSON_BLOCKS } from './lessonBlocks';

export const SIMULATORS: SimulatorMeta[] = [
  {
    id: 'spring-damper',
    title: 'Mass–spring–damper',
    description:
      'Exact analytic free vibration for mẍ + cẋ + kx = 0—sweep m, c, k and watch undamped, under-, critical, and overdamped shapes.',
    sectionIds: ['dynamics', 'mechanical-engineering'],
  },
  {
    id: 'second-order-step',
    title: '2nd-order step response',
    description:
      'Standard underdamped/overdamped step response with ζ and ωₙ — core controls intuition.',
    sectionIds: ['instrumentation-control', 'mechanical-engineering'],
  },
  {
    id: 'first-order-tau',
    title: 'First-order time constant',
    description: 'Step response 1 − e^(−t/τ) for thermal, RC, or mixing-lag intuition.',
    sectionIds: ['instrumentation-control', 'thermodynamics', 'electrical-computer'],
  },
  {
    id: 'moment-arm',
    title: 'Moment from a force',
    description: 'Drag force magnitude and moment arm; see M = F × d grow in real time.',
    sectionIds: ['statics'],
  },
  {
    id: 'ohms-law',
    title: 'Ohm’s law & DC power',
    description: 'Set source voltage and resistance; read current I = V/R and power P = V·I.',
    sectionIds: ['electrical-computer'],
  },
  {
    id: 'continuity-flow',
    title: 'Continuity (Q = A V)',
    description: 'Volumetric flow from area and average speed for incompressible 1-D thinking.',
    sectionIds: ['fluid-mechanics', 'chemical-engineering'],
  },
  {
    id: 'heat-conduction',
    title: '1-D wall conduction',
    description:
      'Fourier\u2019s law through a plane wall: q\u2033 = k \u0394T / L. Sweep conductivity, thickness, and boundary temperatures.',
    sectionIds: ['heat-transfer', 'mechanical-engineering'],
  },
];

export const FORMULA_CARDS: FormulaCard[] = [
  {
    id: 'fc-msd-eom',
    topicId: 'dynamics-msd',
    title: 'MSD equation of motion',
    expression: 'm ẍ + c ẋ + k x = 0',
    latex: String.raw`m\ddot{x} + c\dot{x} + kx = 0`,
    variables: [
      { symbol: 'm', name: 'mass', units: 'kg' },
      { symbol: 'c', name: 'viscous damping', units: 'N·s/m' },
      { symbol: 'k', name: 'stiffness', units: 'N/m' },
      { symbol: 'x', name: 'displacement', units: 'm' },
    ],
    handbookSection: 'Dynamics',
  },
  {
    id: 'fc-msd-omega',
    topicId: 'dynamics-msd',
    title: 'Natural frequency & damping ratio',
    expression: 'ωₙ = √(k/m),  ζ = c / (2√(mk))',
    latex: String.raw`\omega_n = \sqrt{\frac{k}{m}}, \quad \zeta = \frac{c}{2\sqrt{mk}}`,
    variables: [
      { symbol: 'ωₙ', name: 'natural frequency', units: 'rad/s' },
      { symbol: 'ζ', name: 'damping ratio', units: '—' },
    ],
    handbookSection: 'Dynamics',
  },
  {
    id: 'fc-tf-second',
    topicId: 'control-second-order',
    title: 'Standard 2nd-order low-pass',
    expression: 'G(s) = ωₙ² / (s² + 2ζωₙ s + ωₙ²)',
    latex: String.raw`G(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}`,
    variables: [
      { symbol: 'ωₙ', name: 'natural frequency', units: 'rad/s' },
      { symbol: 'ζ', name: 'damping ratio', units: '—' },
    ],
    handbookSection: 'Instrumentation, Measurement, and Control',
  },
  {
    id: 'fc-first-order',
    topicId: 'first-order-tau',
    title: 'First-order step response',
    expression: 'y(t) = y∞ (1 − e^(−t/τ))',
    latex: String.raw`y(t) = y_\infty \bigl(1 - e^{-t/\tau}\bigr)`,
    variables: [
      { symbol: 'τ', name: 'time constant', units: 's' },
      { symbol: 'y∞', name: 'final value', units: '—' },
    ],
    handbookSection: 'Instrumentation, Measurement, and Control',
  },
  {
    id: 'fc-moment',
    topicId: 'statics-moment',
    title: 'Moment about a point',
    expression: 'M_O = F · d⊥',
    latex: String.raw`M_O = F\, d_\perp`,
    variables: [
      { symbol: 'F', name: 'force magnitude', units: 'N' },
      { symbol: 'd⊥', name: 'perpendicular distance', units: 'm' },
    ],
    handbookSection: 'Statics',
  },
  {
    id: 'fc-trig-id',
    topicId: 'math-trig',
    title: 'Useful identity',
    expression: 'sin²θ + cos²θ = 1',
    latex: String.raw`\sin^2\theta + \cos^2\theta = 1`,
    variables: [{ symbol: 'θ', name: 'angle', units: 'rad' }],
    handbookSection: 'Mathematics',
  },
  {
    id: 'fc-ideal-gas',
    topicId: 'thermo-ideal-gas',
    title: 'Ideal gas',
    expression: 'P V = n R_u T',
    latex: String.raw`PV = n R_{\mathrm u} T`,
    variables: [
      { symbol: 'P', name: 'pressure', units: 'Pa' },
      { symbol: 'V', name: 'volume', units: 'm³' },
      { symbol: 'n', name: 'moles', units: 'kmol' },
      { symbol: 'R_u', name: 'universal gas constant', units: 'J/(kmol·K)' },
    ],
    handbookSection: 'Thermodynamics',
  },
  {
    id: 'fc-bernoulli',
    topicId: 'fluids-bernoulli',
    title: 'Bernoulli (horizontal, no losses)',
    expression: 'P + ½ρV² = const',
    latex: String.raw`P + \tfrac{1}{2}\rho V^2 = \mathrm{const}`,
    variables: [
      { symbol: 'P', name: 'pressure', units: 'Pa' },
      { symbol: 'ρ', name: 'density', units: 'kg/m³' },
      { symbol: 'V', name: 'speed', units: 'm/s' },
    ],
    handbookSection: 'Fluid Mechanics',
  },
  {
    id: 'fc-ohm',
    topicId: 'ee-ohms',
    title: 'Ohm’s law',
    expression: 'V = I R',
    latex: String.raw`V = IR`,
    variables: [
      { symbol: 'V', name: 'voltage', units: 'V' },
      { symbol: 'I', name: 'current', units: 'A' },
      { symbol: 'R', name: 'resistance', units: 'Ω' },
    ],
    handbookSection: 'Electrical and Computer Engineering',
  },
  {
    id: 'fc-power-dc',
    topicId: 'ee-ohms',
    title: 'DC power',
    expression: 'P = V I = I² R = V² / R',
    latex: String.raw`P = VI = I^2 R = \frac{V^2}{R}`,
    variables: [{ symbol: 'P', name: 'power', units: 'W' }],
    handbookSection: 'Electrical and Computer Engineering',
  },
  {
    id: 'fc-continuity',
    topicId: 'fluids-continuity',
    title: 'Continuity (incompressible)',
    expression: 'Q = A V',
    latex: String.raw`Q = AV`,
    variables: [
      { symbol: 'Q', name: 'volumetric flow rate', units: 'm³/s' },
      { symbol: 'A', name: 'cross-sectional area', units: 'm²' },
      { symbol: 'V', name: 'average speed', units: 'm/s' },
    ],
    handbookSection: 'Fluid Mechanics',
  },
  {
    id: 'fc-work-energy',
    topicId: 'dynamics-work-energy',
    title: 'Kinetic energy',
    expression: 'KE = ½ m v²',
    latex: String.raw`\mathrm{KE} = \tfrac{1}{2} m v^2`,
    variables: [
      { symbol: 'm', name: 'mass', units: 'kg' },
      { symbol: 'v', name: 'speed', units: 'm/s' },
    ],
    handbookSection: 'Dynamics',
  },
  {
    id: 'fc-equilibrium',
    topicId: 'statics-equilibrium',
    title: 'Particle equilibrium',
    expression: 'ΣF = 0',
    latex: String.raw`\sum \mathbf{F} = \mathbf{0}`,
    variables: [],
    handbookSection: 'Statics',
  },
  {
    id: 'fc-stress-normal',
    topicId: 'mom-normal-stress',
    title: 'Average normal stress',
    expression: 'σ = F / A',
    latex: String.raw`\sigma = \frac{F}{A}`,
    variables: [
      { symbol: 'F', name: 'axial force', units: 'N' },
      { symbol: 'A', name: 'area', units: 'm²' },
    ],
    handbookSection: 'Mechanics of Materials',
  },
  {
    id: 'fc-heat-flux',
    topicId: 'heat-fourier-wall',
    title: 'Fourier’s law (1-D)',
    expression: 'q″ = −k dT/dx',
    latex: String.raw`q'' = -k \frac{dT}{dx}`,
    variables: [
      { symbol: 'k', name: 'thermal conductivity', units: 'W/(m·K)' },
      { symbol: 'q″', name: 'heat flux', units: 'W/m²' },
    ],
    handbookSection: 'Heat Transfer',
  },
  {
    id: 'fc-thermal-resistance',
    topicId: 'heat-fourier-wall',
    title: 'Plane wall thermal resistance',
    expression: 'R/A = L / k',
    latex: String.raw`\frac{R}{A} = \frac{L}{k}`,
    variables: [
      { symbol: 'L', name: 'wall thickness', units: 'm' },
      { symbol: 'k', name: 'thermal conductivity', units: 'W/(m\u00b7K)' },
    ],
    handbookSection: 'Heat Transfer',
  },
  {
    id: 'fc-mean-var',
    topicId: 'stats-mean-variance',
    title: 'Sample variance',
    expression: 's² = Σ(xᵢ − x̄)² / (n − 1)',
    latex: String.raw`s^2 = \frac{\sum (x_i - \bar{x})^2}{n - 1}`,
    variables: [
      { symbol: 'x̄', name: 'sample mean', units: '—' },
      { symbol: 'n', name: 'count', units: '—' },
    ],
    handbookSection: 'Engineering Probability and Statistics',
  },
];

export const QUIZ_ITEMS: QuizItem[] = [
  {
    id: 'q-msd-1',
    topicId: 'dynamics-msd',
    question: 'Increasing only stiffness k (m and c fixed) tends to:',
    choices: [
      'Increase natural frequency ωₙ',
      'Decrease natural frequency ωₙ',
      'Leave ωₙ unchanged',
      'Eliminate all damping',
    ],
    correctIndex: 0,
    explanation: 'ωₙ = √(k/m), so larger k raises natural frequency.',
  },
  {
    id: 'q-msd-2',
    topicId: 'dynamics-msd',
    question: 'For ζ < 1, the free response is best described as:',
    choices: ['Overdamped', 'Underdamped', 'Critically damped', 'Unstable exponential'],
    correctIndex: 1,
    explanation: 'Below critical damping the system oscillates while decaying.',
  },
  {
    id: 'q-msd-3',
    topicId: 'dynamics-msd',
    question: 'Critical damping occurs when ζ equals:',
    choices: ['0', '0.5', '1', '2'],
    correctIndex: 2,
    explanation: 'ζ = 1 separates oscillatory (under) from non-oscillatory (over) decay.',
  },
  {
    id: 'q-msd-4',
    topicId: 'dynamics-msd',
    question: 'Doubling mass m (k,c fixed) will:',
    choices: [
      'Double ωₙ',
      'Halve ωₙ',
      'Multiply ωₙ by √2',
      'Divide ωₙ by √2',
    ],
    correctIndex: 3,
    explanation: 'ωₙ = √(k/m) ∝ 1/√m.',
  },
  {
    id: 'q-msd-5',
    topicId: 'dynamics-msd',
    question: 'Energy dissipation in the linear damper is associated with:',
    choices: ['k x', 'c ẋ', 'm ẍ', 'ẍ only'],
    correctIndex: 1,
    explanation: 'Damping force ∝ velocity; power ∝ F·v.',
  },
  {
    id: 'q-ctrl-1',
    topicId: 'control-second-order',
    question: 'For the standard 2nd-order G(s), ζ in (0,1) gives a step response that:',
    choices: [
      'Never overshoots',
      'Overshoots then settles',
      'Is fastest possible without overshoot',
      'Always diverges',
    ],
    correctIndex: 1,
    explanation: 'Underdamped modes ring before settling.',
  },
  {
    id: 'q-ctrl-2',
    topicId: 'control-second-order',
    question: 'Raising ζ while holding ωₙ fixed generally:',
    choices: [
      'Increases overshoot',
      'Reduces overshoot',
      'Forces instability',
      'Removes steady-state value',
    ],
    correctIndex: 1,
    explanation: 'More damping reduces oscillation and overshoot.',
  },
  {
    id: 'q-ctrl-3',
    topicId: 'control-second-order',
    question: 'The DC gain of G(s)=ωₙ²/(s²+2ζωₙs+ωₙ²) is:',
    choices: ['0', '1', 'ωₙ', '2ζ'],
    correctIndex: 1,
    explanation: 'Set s→0: output/input = ωₙ²/ωₙ² = 1.',
  },
  {
    id: 'q-ctrl-4',
    topicId: 'control-second-order',
    question: 'ωₙ primarily sets:',
    choices: [
      'Steady-state error only',
      'How fast the transient unfolds (time scale)',
      'Whether the system is stable',
      'Sensor noise gain',
    ],
    correctIndex: 1,
    explanation: 'Natural frequency scales the speed of the transient.',
  },
  {
    id: 'q-tau-1',
    topicId: 'first-order-tau',
    question: 'After one time constant τ, a first-order step reaches about:',
    choices: ['50%', '63%', '95%', '99%'],
    correctIndex: 1,
    explanation: '1 − e^(−1) ≈ 0.632.',
  },
  {
    id: 'q-moment-1',
    topicId: 'statics-moment',
    question: 'Moment magnitude about a point for perpendicular F and d is:',
    choices: ['F + d', 'F − d', 'F · d', 'F / d'],
    correctIndex: 2,
    explanation: 'M = F d when the line of action is perpendicular to the lever arm.',
  },
  {
    id: 'q-math-1',
    topicId: 'math-trig',
    question: 'If sin θ = 0.6 in the first quadrant, cos θ is:',
    choices: ['0.8', '0.36', '1.0', '0.4'],
    correctIndex: 0,
    explanation: 'cos²θ = 1 − sin²θ → cos θ = 0.8.',
  },
  {
    id: 'q-thermo-1',
    topicId: 'thermo-ideal-gas',
    question: 'For fixed n and T, if V is halved, ideal gas P:',
    choices: ['Halves', 'Doubles', 'Unchanged', 'Quarters'],
    correctIndex: 1,
    explanation: 'P ∝ 1/V for isothermal ideal gas.',
  },
  {
    id: 'q-fluid-1',
    topicId: 'fluids-bernoulli',
    question: 'Along a streamline with no shaft work, if speed increases, pressure tends to:',
    choices: ['Increase', 'Decrease', 'Stay fixed', 'Become zero'],
    correctIndex: 1,
    explanation: 'Trade between kinetic and pressure terms in Bernoulli.',
  },
  {
    id: 'q-ohm-1',
    topicId: 'ee-ohms',
    question: 'If voltage doubles and resistance is unchanged, DC current:',
    choices: ['Halves', 'Unchanged', 'Doubles', 'Quadruples'],
    correctIndex: 2,
    explanation: 'I = V/R is linear in V for fixed R.',
  },
  {
    id: 'q-ohm-2',
    topicId: 'ee-ohms',
    question: 'Power dissipated in a resistor with fixed R when current doubles:',
    choices: ['Same', 'Doubles', 'Quadruples', 'Halves'],
    correctIndex: 2,
    explanation: 'P = I²R scales with I².',
  },
  {
    id: 'q-ohm-3',
    topicId: 'ee-ohms',
    question: 'For fixed voltage, if resistance is cut in half, current:',
    choices: ['Halves', 'Doubles', 'Unchanged', 'Becomes zero'],
    correctIndex: 1,
    explanation: 'I = V/R is inversely proportional to R.',
  },
  {
    id: 'q-cont-1',
    topicId: 'fluids-continuity',
    question: 'For steady incompressible flow in a narrowing duct, average speed tends to:',
    choices: ['Decrease', 'Increase', 'Stay fixed', 'Become zero'],
    correctIndex: 1,
    explanation: 'Smaller A for the same Q forces larger V in Q = A V.',
  },
  {
    id: 'q-cont-2',
    topicId: 'fluids-continuity',
    question: 'Doubling area A while holding average speed V fixed multiplies volumetric flow Q by:',
    choices: ['0.5', '1', '2', '4'],
    correctIndex: 2,
    explanation: 'Q = A V is linear in A.',
  },
  {
    id: 'q-we-1',
    topicId: 'dynamics-work-energy',
    question: 'Doubling speed v multiplies kinetic energy KE = ½mv² by:',
    choices: ['2', '3', '4', '√2'],
    correctIndex: 2,
    explanation: 'KE ∝ v².',
  },
  {
    id: 'q-we-2',
    topicId: 'dynamics-work-energy',
    question: 'Work–energy idea: net work on a particle equals change in:',
    choices: ['Potential energy only', 'Kinetic energy', 'Temperature', 'Pressure'],
    correctIndex: 1,
    explanation: 'Work–energy principle ties net work to ΔKE for a particle model.',
  },
  {
    id: 'q-eq-1',
    topicId: 'statics-equilibrium',
    question: 'A particle in equilibrium must satisfy:',
    choices: ['ΣF ≠ 0', 'ΣF = 0', 'ΣM = 0 only', 'ΣF = mg'],
    correctIndex: 1,
    explanation: 'Particle static equilibrium: resultant force is zero.',
  },
  {
    id: 'q-eq-2',
    topicId: 'statics-equilibrium',
    question: 'Two equal opposing collinear forces on a particle:',
    choices: ['Always cause rotation', 'Produce equilibrium', 'Always accelerate', 'Cannot exist'],
    correctIndex: 1,
    explanation: 'Equal and opposite collinear forces cancel on the particle.',
  },
  {
    id: 'q-stress-1',
    topicId: 'mom-normal-stress',
    question: 'Axial stress σ = F/A; doubling the area while F is fixed:',
    choices: ['Doubles σ', 'Halves σ', 'Unchanged σ', 'Eliminates σ'],
    correctIndex: 1,
    explanation: 'Stress is force per area.',
  },
  {
    id: 'q-stress-2',
    topicId: 'mom-normal-stress',
    question: 'Tensile axial force F on a bar produces average normal stress that is:',
    choices: ['Always shear', 'Normal to the cut', 'Always zero', 'Only thermal'],
    correctIndex: 1,
    explanation: 'Axial load gives normal stress on a cross-section.',
  },
  {
    id: 'q-heat-1',
    topicId: 'heat-fourier-wall',
    question: 'In 1-D conduction, larger thermal conductivity k (same temperature gradient) implies:',
    choices: ['Lower heat flux', 'Higher heat flux', 'Zero flux', 'Negative temperature'],
    correctIndex: 1,
    explanation: 'Fourier’s law: flux magnitude scales with k for a given |dT/dx|.',
  },
  {
    id: 'q-heat-2',
    topicId: 'heat-fourier-wall',
    question: 'Doubling wall thickness L (all else equal) changes steady-state heat flux by a factor of:',
    choices: ['2', '0.5', '4', '1 (unchanged)'],
    correctIndex: 1,
    explanation: 'q″ = kΔT/L — doubling L halves q″.',
  },
  {
    id: 'q-heat-3',
    topicId: 'heat-fourier-wall',
    question: 'Thermal resistance per unit area for a plane wall (thickness L, conductivity k) is:',
    choices: ['k / L', 'L / k', 'k · L', '1 / (k · L)'],
    correctIndex: 1,
    explanation: 'R/A = L/k, analogous to electrical resistance.',
  },
  {
    id: 'q-heat-4',
    topicId: 'heat-fourier-wall',
    question: 'Steady conduction through a constant-k plane wall has a temperature profile that is:',
    choices: ['Exponential', 'Linear', 'Parabolic', 'Logarithmic'],
    correctIndex: 1,
    explanation: 'With constant k and no generation, d²T/dx² = 0 — a straight line.',
  },
  {
    id: 'q-stat-1',
    topicId: 'stats-mean-variance',
    question: 'Sample variance with divisor (n − 1) is standard when estimating population variance from:',
    choices: ['Census of entire population', 'A random sample', 'A single data point', 'Sorted data only'],
    correctIndex: 1,
    explanation: 'Bessel’s correction (n−1) is for unbiased sample variance.',
  },
  {
    id: 'q-stat-2',
    topicId: 'stats-mean-variance',
    question: 'Adding the same constant to every data point changes the sample mean by:',
    choices: ['Zero', 'That constant', 'Twice that constant', 'The variance'],
    correctIndex: 1,
    explanation: 'Shifting data shifts the mean by the same amount.',
  },
  {
    id: 'q-ctrl-5',
    topicId: 'control-second-order',
    question: 'For ζ > 1, the standard 2nd-order step response typically:',
    choices: ['Rings above 1', 'Approaches 1 without oscillation', 'Diverges', 'Sticks at 0'],
    correctIndex: 1,
    explanation: 'Overdamped step response creeps toward 1 with no overshoot.',
  },
];

const lessonMsd = `Free vibration of a single degree of freedom: visualize m, c, and k as knobs. The lab plots the exact closed-form solution (undamped through overdamped), not a numerical approximation.

Start with the undamped mental model: energy swaps between spring potential and kinetic mass motion. Add damping c to remove energy each cycle.

Use ωₙ = √(k/m) to predict how "snappy" the oscillation is. Use ζ to predict whether you ring (underdamped), creep (overdamped), or just barely avoid overshoot (critical).

Open your official FE Reference Handbook PDF from NCEES and skim the Dynamics pages for any additional forms you are expected to recognize on exam day.`;

const lessonCtrl = `Second-order systems appear everywhere: mechanical structures, motor/load pairs, and instrument loops reduced to dominant poles.

The standard form G(s) = ωₙ²/(s² + 2ζωₙ s + ωₙ²) is your compass. ζ controls overshoot and oscillation; ωₙ controls how quickly transients run.

Use the playground to watch the step response morph as you sweep ζ through under-, critical, and overdamped regions.`;

export const TOPICS: Topic[] = [
  {
    id: 'dynamics-msd',
    sectionId: 'dynamics',
    title: 'Mass–spring–damper intuition',
    handbookSection: 'Dynamics',
    pageHint: 114,
    learningObjectives: [
      'Relate m, c, k to ωₙ and ζ',
      'Predict under vs overdamped free response',
    ],
    lesson: lessonMsd,
    formulaCardIds: ['fc-msd-eom', 'fc-msd-omega'],
    quizItemIds: ['q-msd-1', 'q-msd-2', 'q-msd-3', 'q-msd-4', 'q-msd-5'],
    simulatorIds: ['spring-damper'],
  },
  {
    id: 'control-second-order',
    sectionId: 'instrumentation-control',
    title: 'Second-order step response',
    handbookSection: 'Instrumentation, Measurement, and Control',
    pageHint: 220,
    learningObjectives: [
      'Interpret ζ and ωₙ in the standard 2nd-order form',
      'Connect pole locations to overshoot and speed',
    ],
    lesson: lessonCtrl,
    formulaCardIds: ['fc-tf-second'],
    quizItemIds: ['q-ctrl-1', 'q-ctrl-2', 'q-ctrl-3', 'q-ctrl-4', 'q-ctrl-5'],
    simulatorIds: ['second-order-step'],
  },
  {
    id: 'first-order-tau',
    sectionId: 'instrumentation-control',
    title: 'First-order lag & time constant',
    handbookSection: 'Instrumentation, Measurement, and Control',
    pageHint: 220,
    learningObjectives: ['Estimate 63% rise time from τ', 'Scale response with τ'],
    lesson: `Many sensors, RC circuits, and lumped thermal models look like a single pole: slow exponential approach to a new steady value.

The time constant τ is the time to reach ~63% of the final change. After 3–5τ the response is usually "close enough" for quick engineering estimates.`,
    formulaCardIds: ['fc-first-order'],
    quizItemIds: ['q-tau-1'],
    simulatorIds: ['first-order-tau'],
  },
  {
    id: 'statics-moment',
    sectionId: 'statics',
    title: 'Moments from forces',
    handbookSection: 'Statics',
    pageHint: 107,
    learningObjectives: ['Compute moment magnitude for perpendicular lever arm'],
    lesson: `Moment about a point captures the tendency of a force to rotate a body about that point. For a perpendicular distance, M = F·d.

Use the playground to see how scaling force or arm length scales torque linearly.`,
    formulaCardIds: ['fc-moment'],
    quizItemIds: ['q-moment-1'],
    simulatorIds: ['moment-arm'],
  },
  {
    id: 'math-trig',
    sectionId: 'mathematics',
    title: 'Trigonometry refresher',
    handbookSection: 'Mathematics',
    pageHint: 34,
    learningObjectives: ['Use Pythagorean identity on right triangles'],
    lesson: `FE problems constantly mix geometry, projections, and phasor-style thinking. Keep sin²θ + cos²θ = 1 and basic special triangles handy.

Add your own notes here as you study; keep handbook tables for exact forms.`,
    formulaCardIds: ['fc-trig-id'],
    quizItemIds: ['q-math-1'],
    simulatorIds: [],
  },
  {
    id: 'thermo-ideal-gas',
    sectionId: 'thermodynamics',
    title: 'Ideal gas law framing',
    handbookSection: 'Thermodynamics',
    pageHint: 143,
    learningObjectives: ['Relate P, V, n, T for ideal gas'],
    lesson: `PV = nR_uT ties state variables for an ideal gas. Watch units (especially for n and R_u) and whether the problem is closed-system vs control-volume.

Cross-check constants and conversions in your official handbook PDF.`,
    formulaCardIds: ['fc-ideal-gas'],
    quizItemIds: ['q-thermo-1'],
    simulatorIds: [],
  },
  {
    id: 'fluids-bernoulli',
    sectionId: 'fluid-mechanics',
    title: 'Bernoulli along a streamline',
    handbookSection: 'Fluid Mechanics',
    pageHint: 177,
    learningObjectives: ['Trade pressure and velocity in inviscid models'],
    lesson: `Bernoulli is a energy-per-unit-volume picture along a streamline when losses and pump work are absent or handled separately.

Always ask: are assumptions valid for this FE item?`,
    formulaCardIds: ['fc-bernoulli'],
    quizItemIds: ['q-fluid-1'],
    simulatorIds: [],
  },
  {
    id: 'ee-ohms',
    sectionId: 'electrical-computer',
    title: 'Ohm’s law & DC power',
    handbookSection: 'Electrical and Computer Engineering',
    pageHint: 355,
    learningObjectives: ['Relate V, I, R', 'Scale power with I²R'],
    lesson: `Direct-current resistive circuits are the backbone of many FE items. Ohm’s law V = I R ties the three quantities you can almost always trust on a lumped resistor.

Power enters three equivalent forms: P = V I = I²R = V²/R. When you change one variable, ask which form makes the scaling obvious before you reach for the calculator.

Use your handbook for network reduction methods and AC/phasor extensions when the problem statement moves beyond pure DC.`,
    formulaCardIds: ['fc-ohm', 'fc-power-dc'],
    quizItemIds: ['q-ohm-1', 'q-ohm-2', 'q-ohm-3'],
    simulatorIds: ['ohms-law'],
  },
  {
    id: 'fluids-continuity',
    sectionId: 'fluid-mechanics',
    title: 'Continuity — area and speed',
    handbookSection: 'Fluid Mechanics',
    pageHint: 177,
    learningObjectives: ['Use Q = A V for incompressible flow', 'Predict speed changes in area changes'],
    lesson: `For steady, incompressible flow along a streamtube, what goes in per second must come out: Q = A V with consistent units (m³/s = m²· m/s).

When a nozzle shrinks, speed rises if Q is fixed—this is the same “conservation of volume flow” idea behind many FE conceptual traps.

Losses, compressibility, and multi-path networks need extra relations; use the handbook figures for those cases.`,
    formulaCardIds: ['fc-continuity'],
    quizItemIds: ['q-cont-1', 'q-cont-2'],
    simulatorIds: ['continuity-flow'],
  },
  {
    id: 'dynamics-work-energy',
    sectionId: 'dynamics',
    title: 'Work & kinetic energy',
    handbookSection: 'Dynamics',
    pageHint: 114,
    learningObjectives: ['Scale kinetic energy with speed squared', 'State work–energy for a particle'],
    lesson: `Kinetic energy KE = ½ m v² explodes when speed rises—doubling v quadruples KE. That nonlinear dependence shows up in impact, braking, and rotating-machine questions.

The work–energy principle for a particle says the net work equals the change in kinetic energy. Pair that with conservative potential energy ideas when problems involve gravity or springs.

Cross-check integral forms and rigid-body extensions in your NCEES PDF when the prompt goes beyond particles.`,
    formulaCardIds: ['fc-work-energy'],
    quizItemIds: ['q-we-1', 'q-we-2'],
    simulatorIds: [],
  },
  {
    id: 'statics-equilibrium',
    sectionId: 'statics',
    title: 'Particle equilibrium',
    handbookSection: 'Statics',
    pageHint: 107,
    learningObjectives: ['Write ΣF = 0 for concurrent forces', 'Recognize a free-body starting point'],
    lesson: `Before moments and rigid bodies, particle equilibrium is the grammar: if forces meet at a point and the particle stays put, ΣF = 0 in each component direction.

Draw the free body carefully—replace contacts with the forces they exert on the particle you isolated. Only after the model is consistent should you plug numbers.

Rigid-body statics adds ΣM = 0; use handbook frames and notation when problems include distributed loads or trusses.`,
    formulaCardIds: ['fc-equilibrium'],
    quizItemIds: ['q-eq-1', 'q-eq-2'],
    simulatorIds: [],
  },
  {
    id: 'mom-normal-stress',
    sectionId: 'mechanics-materials',
    title: 'Axial stress introduction',
    handbookSection: 'Mechanics of Materials',
    pageHint: 130,
    learningObjectives: ['Compute average normal stress σ = F/A', 'Track units for stress'],
    lesson: `Average normal stress on a cross-section carrying axial force is σ = F/A. Tension vs compression is carried by the sign convention you choose—stay consistent with the handbook figure you are emulating.

Stress is not force: halving the area doubles stress for the same load. Watch SI vs USCS units; stress often ends up in Pa or ksi after conversions.

Advanced items add shear, bending, and stress transformations—grow into those from this axial base.`,
    formulaCardIds: ['fc-stress-normal'],
    quizItemIds: ['q-stress-1', 'q-stress-2'],
    simulatorIds: [],
  },
  {
    id: 'heat-fourier-wall',
    sectionId: 'heat-transfer',
    title: 'Fourier conduction preview',
    handbookSection: 'Heat Transfer',
    pageHint: 204,
    learningObjectives: ['Read heat flux from temperature gradient and k'],
    lesson: `Fourier’s law in one dimension, q″ = −k dT/dx, says heat flows down a temperature gradient, scaled by conductivity k. Better conductors move more energy for the same gradient.

The minus sign reminds you that heat flows from hot to cold in the coordinate sense your problem defines.

Plane walls, cylinders, and convection resistances layer on top—use your licensed handbook for the full catalog of thermal resistance networks.`,
    formulaCardIds: ['fc-heat-flux', 'fc-thermal-resistance'],
    quizItemIds: ['q-heat-1', 'q-heat-2', 'q-heat-3', 'q-heat-4'],
    simulatorIds: ['heat-conduction'],
  },
  {
    id: 'stats-mean-variance',
    sectionId: 'probability-stats',
    title: 'Mean & sample variance',
    handbookSection: 'Engineering Probability and Statistics',
    pageHint: 63,
    learningObjectives: ['Interpret sample mean and (n−1) variance'],
    lesson: `The sample mean x̄ locates the center of your data. Sample variance with divisor (n − 1) corrects bias when estimating spread from a sample rather than a full population.

Expect FE items on combining means, interpreting standard deviation s = √s², and simple probability—always tie definitions back to the handbook table you are given.

Add practice generators later for normal probabilities once you have table access in your PDF.`,
    formulaCardIds: ['fc-mean-var'],
    quizItemIds: ['q-stat-1', 'q-stat-2'],
    simulatorIds: [],
  },
  {
    id: 'units-preview',
    sectionId: 'units',
    title: 'Units & gc awareness',
    handbookSection: 'Units and Conversion Factors',
    pageHint: 1,
    learningObjectives: ['Distinguish lbf vs lbm when using USCS'],
    lesson: `The handbook opens with USCS mass–force distinctions and gc. When a problem mixes pounds as mass and force, insert gc deliberately for consistent units.

Use your NCEES PDF for the exact conversion blocks.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'ethics-preview',
    sectionId: 'ethics',
    title: 'Ethics study placeholder',
    handbookSection: 'Ethics and Professional Practice',
    pageHint: 4,
    learningObjectives: ['Read NCEES handbook ethics excerpts'],
    lesson: `Add original scenario-based questions later. For now, read the handbook section in your licensed PDF and summarize rules in your own words.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'safety-preview',
    sectionId: 'safety',
    title: 'Safety topics placeholder',
    handbookSection: 'Safety',
    pageHint: 13,
    learningObjectives: ['Map handbook safety tables to problem types'],
    lesson: `Placeholder topic: expand with your own flashcards on MSDS, hazard classes, or PPE as you study the handbook pages.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'stats-preview',
    sectionId: 'probability-stats',
    title: 'Probability & statistics placeholder',
    handbookSection: 'Engineering Probability and Statistics',
    pageHint: 63,
    learningObjectives: ['Use handbook PDF for distributions'],
    lesson: `Placeholder: add quiz items on mean/variance, normal approximations, and confidence intervals as you author them.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'chem-preview',
    sectionId: 'chemistry-biology',
    title: 'Chemistry & biology placeholder',
    handbookSection: 'Chemistry and Biology',
    pageHint: 85,
    learningObjectives: ['Cross-reference stoichiometry and periodic trends in PDF'],
    lesson: `Placeholder topic for handbook-aligned study. Build formula cards from your own summaries.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'materials-preview',
    sectionId: 'materials',
    title: 'Materials science placeholder',
    handbookSection: 'Materials Science/Structure of Matter',
    pageHint: 94,
    learningObjectives: ['Relate crystal defects and phase diagrams to handbook figures'],
    lesson: `Placeholder: tie lessons to figures you view in your personal NCEES PDF.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'mom-preview',
    sectionId: 'mechanics-materials',
    title: 'Mechanics of materials placeholder',
    handbookSection: 'Mechanics of Materials',
    pageHint: 130,
    learningObjectives: ['Stress, strain, and beam formulas from handbook'],
    lesson: `Placeholder: add topics on axial, torsion, and bending with your own practice items.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'heat-preview',
    sectionId: 'heat-transfer',
    title: 'Heat transfer placeholder',
    handbookSection: 'Heat Transfer',
    pageHint: 204,
    learningObjectives: ['Conduction, convection, radiation modes'],
    lesson: `Placeholder: link to first-order thermal lag intuition and handbook correlations.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: ['heat-conduction'],
  },
  {
    id: 'econ-preview',
    sectionId: 'economics',
    title: 'Engineering economics placeholder',
    handbookSection: 'Engineering Economics',
    pageHint: 230,
    learningObjectives: ['Present worth and annual worth patterns'],
    lesson: `Placeholder: author original factor problems; use handbook interest factors in your PDF.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'chemeng-preview',
    sectionId: 'chemical-engineering',
    title: 'Chemical engineering placeholder',
    handbookSection: 'Chemical Engineering',
    pageHint: 238,
    learningObjectives: ['Unit ops and mass/energy balances'],
    lesson: `Placeholder for ChE FE track topics.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'civil-preview',
    sectionId: 'civil-engineering',
    title: 'Civil engineering placeholder',
    handbookSection: 'Civil Engineering',
    pageHint: 259,
    learningObjectives: ['Structures, transportation, geotech — per handbook'],
    lesson: `Placeholder: split into subtopics as you study.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'env-preview',
    sectionId: 'environmental-engineering',
    title: 'Environmental engineering placeholder',
    handbookSection: 'Environmental Engineering',
    pageHint: 310,
    learningObjectives: ['Water/wastewater and air quality frameworks'],
    lesson: `Placeholder topic.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'ee-preview',
    sectionId: 'electrical-computer',
    title: 'Electrical & computer placeholder',
    handbookSection: 'Electrical and Computer Engineering',
    pageHint: 355,
    learningObjectives: ['Circuits, machines, digital — per handbook'],
    lesson: `Placeholder: pair with first-order τ playground for RC circuits.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'industrial-preview',
    sectionId: 'industrial-systems',
    title: 'Industrial & systems placeholder',
    handbookSection: 'Industrial and Systems Engineering',
    pageHint: 417,
    learningObjectives: ['Queueing, scheduling, inventory basics'],
    lesson: `Placeholder topic.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
  {
    id: 'mech-preview',
    sectionId: 'mechanical-engineering',
    title: 'Mechanical engineering placeholder',
    handbookSection: 'Mechanical Engineering',
    pageHint: 431,
    learningObjectives: ['Thermo/fluids/machine elements cross-links'],
    lesson: `Placeholder: use MSD and 2nd-order playgrounds alongside handbook mechanical pages.`,
    formulaCardIds: [],
    quizItemIds: [],
    simulatorIds: [],
  },
];

const topicById = new Map(TOPICS.map((t) => [t.id, t]));
const quizById = new Map(QUIZ_ITEMS.map((q) => [q.id, q]));
const formulaById = new Map(FORMULA_CARDS.map((f) => [f.id, f]));

export function getTopic(id: string): Topic | undefined {
  const base = topicById.get(id);
  if (!base) return undefined;
  const blocks = LESSON_BLOCKS[id];
  return blocks ? { ...base, lessonBlocks: blocks } : base;
}

export function getTopicsForSection(sectionId: string) {
  return TOPICS.filter((t) => t.sectionId === sectionId);
}

export function getQuizItem(id: string) {
  return quizById.get(id);
}

export function getFormulaCard(id: string) {
  return formulaById.get(id);
}

export function getAllFormulaCards() {
  return FORMULA_CARDS;
}

export function searchFormulaCards(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return FORMULA_CARDS;
  return FORMULA_CARDS.filter(
    (f) =>
      f.title.toLowerCase().includes(q) ||
      f.expression.toLowerCase().includes(q) ||
      f.handbookSection.toLowerCase().includes(q)
  );
}

export function getSimulatorMeta(id: string) {
  return SIMULATORS.find((s) => s.id === id);
}

export function allQuizItems() {
  return QUIZ_ITEMS;
}

export function getContentStats() {
  const topicsWithQuizzes = TOPICS.filter((t) => t.quizItemIds.length > 0).length;
  return {
    topicCount: TOPICS.length,
    questionCount: QUIZ_ITEMS.length,
    simulatorCount: SIMULATORS.length,
    formulaCount: FORMULA_CARDS.length,
    topicsWithQuizzes,
  };
}
