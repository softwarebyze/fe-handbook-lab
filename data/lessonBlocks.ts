import type { LessonBlock } from '@/types/content';

/** Rich lessons: KaTeX in `math` blocks; `lab` callouts link to simulators. */
export const LESSON_BLOCKS: Record<string, LessonBlock[]> = {
  'dynamics-msd': [
    {
      type: 'lead',
      text: 'One particle, one spring, one dashpot—that single-degree-of-freedom model is the Rosetta stone for vibrations on the FE exam.',
    },
    {
      type: 'heading',
      text: 'Governing equation',
    },
    {
      type: 'paragraph',
      text: 'Newton’s second law plus linear spring and viscous damping gives a second-order ODE. Dots denote time derivatives. This is the same structure that reappears in controls as a transfer function.',
    },
    {
      type: 'math',
      latex: String.raw`m\ddot{x} + c\dot{x} + kx = 0`,
      caption: 'SDOF free vibration (no external forcing)',
    },
    {
      type: 'heading',
      text: 'Natural frequency & damping ratio',
    },
    {
      type: 'math',
      latex: String.raw`\omega_n = \sqrt{\frac{k}{m}}, \qquad \zeta = \frac{c}{2\sqrt{mk}}`,
      caption: 'Use these to classify the response before you integrate anything.',
    },
    {
      type: 'bullet',
      items: [
        'ζ = 0: pure harmonic motion at ωₙ (energy sloshes between spring and mass).',
        '0 < ζ < 1: decaying oscillation—what you feel as “ringing.”',
        'ζ = 1: critical—fastest return without overshoot for this model.',
        'ζ > 1: overdamped—creeps home with two decaying exponentials.',
      ],
    },
    {
      type: 'callout',
      variant: 'insight',
      title: 'Why ζ is dimensionless',
      body: 'Both c and √(mk) carry the same units (N·s/m), so their ratio has no units. That makes ζ a universal knob you can compare across different m, k pairs.',
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Shape the response yourself',
      body: 'Open the lab: the curve is the exact analytic solution—slide m, c, and k and watch undamped, under-, critical, and overdamped shapes instantly.',
      simId: 'spring-damper',
    },
    {
      type: 'checkpoint',
      title: 'Quick self-check',
      body: 'If you double k alone, ωₙ multiplies by √2. If you double c alone, ζ rises (holding m and k fixed). Say it out loud while dragging sliders—the pattern sticks.',
    },
    {
      type: 'callout',
      variant: 'exam',
      title: 'Handbook pairing',
      body: 'Keep your licensed NCEES PDF open: use this app for intuition, then cross-reference any additional forms or tables the exam expects you to recognize verbatim.',
    },
  ],

  'control-second-order': [
    {
      type: 'lead',
      text: 'Most “complicated” loops still behave like a dominant second-order chunk for step tests. Learn the standard form once; reuse it everywhere.',
    },
    {
      type: 'math',
      latex: String.raw`G(s) = \frac{\omega_n^2}{s^2 + 2\zeta\omega_n s + \omega_n^2}`,
      caption: 'Unity DC gain; poles carry all transient character.',
    },
    {
      type: 'paragraph',
      text: 'ζ decides overshoot and ringing; ωₙ sets how fast the transient clock ticks. Together they are the fastest mental model for sketching a step response.',
    },
    {
      type: 'bullet',
      items: [
        'Small ζ → tall overshoot, visible oscillation.',
        'Large ζ → sluggish, monotone approach to 1.',
        'ωₙ doubles → transient compresses in time (roughly 2× faster).',
      ],
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Sweep ζ and ωₙ live',
      body: 'The step-response lab plots the exact unit-step output. Park ζ just below and above 1 to internalize the overshoot cliff.',
      simId: 'second-order-step',
    },
    {
      type: 'checkpoint',
      title: 'Poles in your head',
      body: 'Underdamped poles are complex conjugates at −ζωₙ ± jωₙ√(1−ζ²). Closer to the imaginary axis means slower decay; larger magnitude means higher ωₙ.',
    },
  ],

  'first-order-tau': [
    {
      type: 'lead',
      text: 'A single real pole is the simplest story in engineering: you approach a new steady value along an exponential that never quite finishes.',
    },
    {
      type: 'math',
      latex: String.raw`y(t) = y_\infty \bigl(1 - e^{-t/\tau}\bigr)`,
      caption: 'Step toward y∞ with time constant τ.',
    },
    {
      type: 'paragraph',
      text: 'After one time constant τ you are ≈63% of the way; after 3τ you are in the mid‑90% range for back-of-envelope work. RC circuits, thermal lumps, and instrument filters all rhyme.',
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Stretch and squeeze the exponential',
      body: 'Watch the curve sharpen or soften as τ changes—this is the same “how patient is the system?” question on many FE items.',
      simId: 'first-order-tau',
    },
  ],

  'statics-moment': [
    {
      type: 'lead',
      text: 'Moments quantify the twist a force tries to produce about a point. Start perpendicular, then generalize with vector cross products when the FE stem demands it.',
    },
    {
      type: 'math',
      latex: String.raw`M_O = F\, d_\perp`,
      caption: 'Perpendicular distance from O to the line of action of F.',
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Feel linear scaling',
      body: 'Double the force or double the arm—moment doubles. The lab makes that proportionality obvious before you juggle components.',
      simId: 'moment-arm',
    },
  ],

  'ee-ohms': [
    {
      type: 'lead',
      text: 'Ohm’s law is the grammar of lumped DC circuits. Power is where many careless mistakes hide—always ask whether you are holding V, I, or R constant.',
    },
    {
      type: 'math',
      latex: String.raw`V = IR, \qquad P = VI = I^2R = \frac{V^2}{R}`,
    },
    {
      type: 'bullet',
      items: [
        'Series resistors split voltage; identical Rs share voltage evenly.',
        'Parallel resistors split current; think conductance G = 1/R for intuition.',
        'If I doubles with fixed R, power quadruples—heat scales with I².',
      ],
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Dial V and R',
      body: 'See I and P update instantly—use it to sanity-check homework before you commit to a long reduction.',
      simId: 'ohms-law',
    },
  ],

  'fluids-continuity': [
    {
      type: 'lead',
      text: 'For steady, incompressible flow along a streamtube, volume in equals volume out. That single sentence unlocks a huge share of conceptual FE fluids questions.',
    },
    {
      type: 'math',
      latex: String.raw`Q = A v`,
      caption: 'Q = volumetric flow (m³/s), A = area (m²), v = average speed (m/s).',
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Shrink the duct mentally',
      body: 'Shrink A with fixed Q and watch v rise—this is the nozzle intuition without touching Bernoulli yet.',
      simId: 'continuity-flow',
    },
  ],

  'dynamics-work-energy': [
    {
      type: 'lead',
      text: 'Energy methods buy you speed when kinematics looks messy but you only care about speeds at two configurations.',
    },
    {
      type: 'math',
      latex: String.raw`KE = \tfrac{1}{2}mv^2`,
    },
    {
      type: 'paragraph',
      text: 'Kinetic energy is quadratic in speed: small changes in v near high speeds move KE dramatically. That nonlinearity shows up in braking distances, belt drives, and rotating machinery.',
    },
    {
      type: 'callout',
      variant: 'insight',
      title: 'Work–energy shortcut',
      body: 'Net work on a particle equals its change in kinetic energy—ideal when forces are known only at endpoints.',
    },
  ],

  'thermo-ideal-gas': [
    {
      type: 'lead',
      text: 'The ideal gas model is a bookkeeping device: relate P, V, n, and T before you add heat capacities or flow work.',
    },
    {
      type: 'math',
      latex: String.raw`PV = n R_u T`,
    },
    {
      type: 'paragraph',
      text: 'Watch units for n and Rᵤ (kmol vs mol). Ask every time: is this a closed system or a control volume? The same PV=nRT relation can appear in both, but the work/heat terms differ.',
    },
  ],

  'mom-normal-stress': [
    {
      type: 'lead',
      text: 'Stress is not force—it is force distributed over area. That single ratio, σ = F/A, is your entry point to all of mechanics of materials on the FE.',
    },
    {
      type: 'heading',
      text: 'Average normal stress',
    },
    {
      type: 'math',
      latex: String.raw`\sigma = \frac{F}{A}`,
      caption: 'Axial force F over cross-sectional area A, normal to the cut.',
    },
    {
      type: 'paragraph',
      text: 'When a prismatic bar carries a centric axial load, every cross-section away from the grips sees the same average normal stress. Positive σ is tension; negative is compression—match the sign convention in your NCEES handbook figure.',
    },
    {
      type: 'bullet',
      items: [
        'Double the area at fixed force → stress halves. The bar "feels" less intensity.',
        'Double the force at fixed area → stress doubles. Material limits decide failure.',
        'SI stress lands in Pa (N/m²); USCS in psi or ksi after conversions.',
      ],
    },
    {
      type: 'callout',
      variant: 'insight',
      title: 'Why area matters more than force alone',
      body: 'A 10 kN wire and a 10 kN column carry the same load, but wildly different stresses. Design and failure are about intensity, not totals—σ captures that.',
    },
    {
      type: 'callout',
      variant: 'lab',
      title: 'Drag F and A to feel σ',
      body: 'Watch the cross-section shrink as A drops, and stress climb as force increases. The stress gauge turns red above 250 MPa to flag high-stress regimes.',
      simId: 'normal-stress',
    },
    {
      type: 'checkpoint',
      title: 'Quick self-check',
      body: 'If you halve A while keeping F fixed, σ doubles. Say it while sliding—"half the area, double the stress." This proportionality appears in almost every MoM FE item.',
    },
    {
      type: 'callout',
      variant: 'exam',
      title: 'Handbook pairing',
      body: "Cross-reference the Mechanics of Materials section (~p. 130) for shear stress, beam bending, and Mohr's circle extensions that build on σ = F/A.",
    },
  ],

  'fluids-bernoulli': [
    {
      type: 'lead',
      text: 'Bernoulli is not magic—it is an energy line along a streamline when losses and shaft work are absent or handled separately.',
    },
    {
      type: 'math',
      latex: String.raw`P + \tfrac{1}{2}\rho v^2 = \text{const}`,
      caption: 'Horizontal streamline, no losses, no pumps between points.',
    },
    {
      type: 'callout',
      variant: 'exam',
      title: 'Assumption audit',
      body: 'Before applying, ask: steady? inviscid along the streamline? incompressible? no shaft work between points? If any “no,” reach for a richer form from your handbook.',
    },
  ],
};
