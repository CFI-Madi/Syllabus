const POH_SOURCE_LABEL = 'PA-28-140 Cherokee Owner\'s Handbook';
const POH_PDF_PATH = './PA-28-140-Cherokee-Owners-Handbook.pdf';
const POH_AIRCRAFT_TAG = 'Cherokee 140 / PA-28-140';

const POH_CATEGORIES = [
  { id:'all', label:'All References' },
  { id:'systems', label:'Systems' },
  { id:'operating', label:'Operating' },
  { id:'wb', label:'Weight & Balance' },
  { id:'performance', label:'Performance' }
];

function pohSourceHref(page){
  return `${POH_PDF_PATH}#page=${page}`;
}

const POH_REFERENCES = [
  {
    id:'poh-engine-propeller',
    aircraft:POH_AIRCRAFT_TAG,
    type:'systems',
    category:'systems',
    title:'Engine and Propeller Overview',
    summary:'Owner\'s Handbook overview of the Cherokee 140 powerplant, fixed-pitch propeller, and primary engine controls.',
    keyPoints:[
      'Lycoming O-320-E2A rated at 150 horsepower at 2450 RPM.',
      'Fixed-pitch propeller installation.',
      'Manual carburetor heat and manual mixture controls are part of the standard engine-control set.',
      'The handbook notes the throttle should be opened slightly before engine start and the mixture should remain full rich for normal flight conditions.'
    ],
    limitations:[
      'Use the original handbook and aircraft placards for full operating limits and exact engine-operating procedures.',
      'This is an aircraft-reference summary only, not a replacement for the POH section.'
    ],
    relatedProcedureIds:['engine-failure'],
    relatedLessonIds:['GL2','FL5'],
    sourcePage:9,
    sourceSection:'Section II - Engine and Propeller',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-fuel-system',
    aircraft:POH_AIRCRAFT_TAG,
    type:'systems',
    category:'systems',
    title:'Fuel System Summary',
    summary:'Selective fuel-system reference covering tank arrangement, usable fuel, fuel selector positions, and sump-drain guidance.',
    keyPoints:[
      'Two 25-gallon wing tanks are described, one in each wing.',
      'Total fuel is 50 gallons with 48 gallons usable at all flight attitudes.',
      'The selector positions shown are OFF, LEFT, RIGHT, and BOTH.',
      'The handbook emphasizes draining enough fuel from the quick drain and filter bowl to check for water, sediment, or proper fuel grade before each flight.'
    ],
    limitations:[
      'Always confirm the actual fuel quantity and selector configuration for the assigned aircraft during preflight.',
      'Use the source handbook and current checklist for the full fuel-system description.'
    ],
    relatedProcedureIds:['ramp-securing-notes','before-maneuver-check','engine-failure'],
    relatedLessonIds:['GL2','FL1','FL17'],
    sourcePage:11,
    sourceSection:'Section II - Fuel System (source p. 8)',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-electrical-system',
    aircraft:POH_AIRCRAFT_TAG,
    type:'systems',
    category:'systems',
    title:'Electrical System Summary',
    summary:'Selective electrical-system reference covering the battery/alternator arrangement and basic indication logic from the handbook.',
    keyPoints:[
      'The handbook describes a 12-volt electrical system with battery and alternator.',
      'Electrical switches and protective devices are grouped on the instrument panel.',
      'A loadmeter/ammeter indication is used to monitor the charging system and battery condition.',
      'The text notes that a discharged battery is usually shown by a zero or negative meter indication and that non-essential electrical load should be managed during a charging-system problem.'
    ],
    limitations:[
      'This is a study reference only. Use the handbook and aircraft-specific equipment list for exact electrical configuration and abnormal procedures.'
    ],
    relatedProcedureIds:['engine-failure'],
    relatedLessonIds:['GL2','FL3','FL5'],
    sourcePage:11,
    sourceSection:'Section II - Electrical System (source p. 9-10)',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-cabin-and-panel',
    aircraft:POH_AIRCRAFT_TAG,
    type:'systems',
    category:'systems',
    title:'Cabin and Instrument Panel Orientation',
    summary:'Handbook-based orientation reference for the Cherokee 140 cabin layout, instrument panel grouping, and front-seat adjustment features.',
    keyPoints:[
      'The handbook describes a cabin arranged for pilot and passenger with front-seat adjustment and an instrument panel grouped around flight, engine, and control functions.',
      'Standard instruments, switches, and circuit protection are located on the main panel.',
      'The handbook figures identify the key seat and panel features for cockpit orientation.'
    ],
    limitations:[
      'Use the actual aircraft cockpit and equipment list to confirm any avionics or panel differences.'
    ],
    relatedProcedureIds:['ramp-securing-notes'],
    relatedLessonIds:['GL2','FL1'],
    sourcePage:13,
    sourceSection:'Section II - Cabin Features',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-preflight-reference',
    aircraft:POH_AIRCRAFT_TAG,
    type:'operating',
    category:'operating',
    title:'Preflight Inspection Reference',
    summary:'Selective preflight-reference card based on the handbook walkaround sequence and setup notes.',
    keyPoints:[
      'The handbook directs a thorough visual inspection before each flight.',
      'The preflight figure is organized as a walkaround flow rather than a random item list.',
      'Fuel quantity, drains, control surfaces, tires, and required documents are part of the preflight sequence.'
    ],
    limitations:[
      'Follow the full approved checklist for the assigned aircraft. This card is a source-linked study summary, not the full checklist.'
    ],
    relatedProcedureIds:['ramp-securing-notes'],
    relatedLessonIds:['FL1','FL11'],
    sourcePage:15,
    sourceSection:'Section III - Preflight',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-starting-and-warmup',
    aircraft:POH_AIRCRAFT_TAG,
    type:'operating',
    category:'operating',
    title:'Starting and Warm-Up Reference',
    summary:'Selective operating reference for engine start, primer use, magneto use, oil-pressure check, and warm-up reminders.',
    keyPoints:[
      'The handbook calls for brakes locked, fuel selector on, mixture rich, and throttle slightly open before start.',
      'Primer use varies with engine temperature and condition.',
      'After start, oil pressure should be checked promptly.',
      'Warm-up guidance emphasizes avoiding high power until oil temperature and pressure are in the normal operating range.'
    ],
    limitations:[
      'Use the aircraft checklist and current instructor guidance for exact start technique, especially in cold weather or unusual conditions.'
    ],
    relatedProcedureIds:['ramp-securing-notes'],
    relatedLessonIds:['FL1','FL11'],
    sourcePage:16,
    sourceSection:'Section III - Starting Engine and Warm-Up',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-takeoff-and-climb',
    aircraft:POH_AIRCRAFT_TAG,
    type:'operating',
    category:'operating',
    title:'Takeoff and Climb Operating Reference',
    summary:'Selective operating reference for ground check, takeoff configuration, flap guidance, and handbook climb speeds.',
    keyPoints:[
      'The ground-check section includes magneto checks, carburetor heat check, engine-gauge review, and control checks before takeoff.',
      'The takeoff section includes full throttle and indicates flap use should follow the checklist/short-field technique as appropriate.',
      'The climb section lists best rate of climb as 85 MPH at 2150 pounds and 74 MPH at 1950 pounds.',
      'The handbook notes the best rate of climb speed varies with aircraft gross weight.'
    ],
    limitations:[
      'Takeoff and climb technique must be matched to weight, density altitude, and runway conditions using the source handbook and instructor briefing.'
    ],
    relatedProcedureIds:['traffic-pattern-operation','short-field-takeoff','soft-field-takeoff'],
    relatedLessonIds:['FL1','FL14','FL21'],
    sourcePage:17,
    sourceSection:'Section III - Ground Check, Takeoff, and Climb',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-cruise-and-landing',
    aircraft:POH_AIRCRAFT_TAG,
    type:'operating',
    category:'operating',
    title:'Cruise, Stalls, and Approach/Landing Reference',
    summary:'Selective operating-reference card for cruise setting reminders, stall remarks, and handbook approach/landing guidance.',
    keyPoints:[
      'The cruise discussion ties power selection to density altitude and percentage power charts.',
      'The handbook notes intentional spins are prohibited in the normal-category airplane.',
      'The approach-and-landing section indicates approximately 85 MPH should be trimmed on approach, with flap use matched to conditions and type of landing.',
      'The text notes carburetor heat should be applied unless there is an extremely rough engine at low power.'
    ],
    limitations:[
      'Use the source handbook and current training briefing for exact approach speeds, flap usage, and landing technique.'
    ],
    relatedProcedureIds:['traffic-pattern-operation','short-field-landing','soft-field-landing','power-off-stall','power-on-stall'],
    relatedLessonIds:['FL4','FL8','FL14','FL18','FL21'],
    sourcePage:18,
    sourceSection:'Section III - Cruise, Stalls, and Approach/Landing',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-weights-and-loading',
    aircraft:POH_AIRCRAFT_TAG,
    type:'wb',
    category:'wb',
    title:'Weights and Loading Snapshot',
    summary:'Quick handbook-backed snapshot of gross weight, fuel, baggage, and basic loading figures from the specification section.',
    keyPoints:[
      'Gross weight figures shown are 1950 and 2150 pounds depending on model configuration.',
      'Fuel capacity is 50 gallons total and 48 gallons usable.',
      'Maximum baggage listed is 200 pounds.',
      'The specification section also lists wheel-base and wing-area data useful for aircraft-familiarization study.'
    ],
    limitations:[
      'The specification pages are not a substitute for the individual aircraft\'s official weight-and-balance records.',
      'Use the actual aircraft paperwork and source handbook for dispatch decisions.'
    ],
    relatedLessonIds:['GL5','GL11'],
    relatedProcedureIds:['ramp-securing-notes'],
    sourcePage:7,
    sourceSection:'Section I - Weights / Fuel and Oil / Baggage',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-weight-balance-note',
    aircraft:POH_AIRCRAFT_TAG,
    type:'wb',
    category:'wb',
    title:'Weight and Balance Use Note',
    summary:'Handbook note that directs the owner/operator to determine the loading condition and verify it against the aircraft Weight and Balance form.',
    keyPoints:[
      'The handbook places responsibility on the owner/operator to determine that the loading condition is within allowable limits.',
      'The text directs the user to the aircraft Weight and Balance form supplied with the airplane.'
    ],
    limitations:[
      'If the exact aircraft loading form or current empty-weight data are missing, use the original handbook reference and aircraft paperwork before flight.'
    ],
    relatedLessonIds:['GL5','GL11'],
    sourcePage:19,
    sourceSection:'Section III - Weight and Balance (source p. 19a)',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-takeoff-distance-chart',
    aircraft:POH_AIRCRAFT_TAG,
    type:'performance',
    category:'performance',
    title:'Takeoff Distance Chart Reference',
    summary:'Source-linked reference to the handbook takeoff-distance versus density-altitude chart for performance planning study.',
    keyPoints:[
      'Chart is organized by density altitude and distance.',
      'The chart distinguishes obstacle-clearance and ground-roll considerations.',
      'The chart is intended for performance planning, not memorized fixed numbers.'
    ],
    limitations:[
      'Use the original chart directly for planning. This app summarizes what the chart is for, not the full plotted values.'
    ],
    relatedProcedureIds:['short-field-takeoff','soft-field-takeoff','traffic-pattern-operation'],
    relatedLessonIds:['GL5','GL11','FL14','FL17'],
    sourcePage:20,
    sourceSection:'Section IV - Takeoff Distance vs Density Altitude',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-climb-and-tas-charts',
    aircraft:POH_AIRCRAFT_TAG,
    type:'performance',
    category:'performance',
    title:'Climb and True Airspeed Chart Reference',
    summary:'Selective reference to the handbook climb-rate and true-airspeed charts for density-altitude and cruise-planning study.',
    keyPoints:[
      'Rate-of-climb chart is plotted against density altitude and gross weight.',
      'True-airspeed chart is plotted against density altitude, full-throttle power, and true airspeed.',
      'These figures are study/planning aids and should be read from the source chart under the actual conditions.'
    ],
    limitations:[
      'Do not use this summary alone to compute a performance value. Open the source chart for actual planning.'
    ],
    relatedLessonIds:['GL5','GL11','FL17'],
    sourcePage:21,
    sourceSection:'Section IV - Rate of Climb / True Airspeed vs Density Altitude',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-range-and-cruise-power',
    aircraft:POH_AIRCRAFT_TAG,
    type:'performance',
    category:'performance',
    title:'Range and Cruise Power Chart Reference',
    summary:'Selective handbook reference for range and power-versus-altitude chart use during cross-country and cruise-planning study.',
    keyPoints:[
      'Range charts vary by density altitude, gross weight, and available fuel assumptions.',
      'Power-versus-altitude charts tie engine RPM and percentage power to cruise planning.',
      'The chart family is most useful when paired with fuel planning, density altitude, and expected loading.'
    ],
    limitations:[
      'Use the source charts directly for actual range or cruise-performance planning.'
    ],
    relatedLessonIds:['GL11','FL17','FL20'],
    sourcePage:24,
    sourceSection:'Section IV - Range / Power vs Altitude',
    sourceLabel:POH_SOURCE_LABEL
  },
  {
    id:'poh-landing-and-glide',
    aircraft:POH_AIRCRAFT_TAG,
    type:'performance',
    category:'performance',
    title:'Landing Distance and Glide Reference',
    summary:'Selective reference to the handbook landing-distance chart and glide-distance guidance for approach planning and emergency study.',
    keyPoints:[
      'Landing-distance chart is organized by density altitude and braking assumption.',
      'Glide-distance chart gives a source reference for estimating distance available from altitude.',
      'These figures are planning references and should be interpreted directly from the original charts.'
    ],
    limitations:[
      'Do not use the summary as a substitute for reading the source chart under the actual wind, surface, and loading conditions.'
    ],
    relatedProcedureIds:['engine-failure','traffic-pattern-operation','short-field-landing','soft-field-landing'],
    relatedLessonIds:['GL5','FL5','FL14','FL21'],
    sourcePage:25,
    sourceSection:'Section IV - Landing Distance / Glide Distance Available',
    sourceLabel:POH_SOURCE_LABEL
  }
];

const POH_REFERENCES_BY_ID = Object.fromEntries(POH_REFERENCES.map(item => [item.id, item]));

export {
  POH_SOURCE_LABEL,
  POH_PDF_PATH,
  POH_AIRCRAFT_TAG,
  POH_CATEGORIES,
  POH_REFERENCES,
  POH_REFERENCES_BY_ID,
  pohSourceHref
};
