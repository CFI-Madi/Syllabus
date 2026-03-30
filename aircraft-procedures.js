const PROCEDURES_SOURCE_LABEL = 'Cherokee 140 Procedures';
const PROCEDURES_PDF_PATH = './Cherokee%20140%20Procedures.pdf';

const AIRCRAFT_TAG = 'Cherokee 140 / PA-28-140';

const PROCEDURE_CATEGORIES = [
  { id:'all', label:'All Procedures' },
  { id:'ground', label:'Ramp / Ground' },
  { id:'checks', label:'Checks' },
  { id:'maneuvers', label:'Maneuvers' },
  { id:'pattern', label:'Pattern / Takeoff / Landing' },
  { id:'emergency', label:'Emergency' }
];

function procedureSourceHref(page){
  return `${PROCEDURES_PDF_PATH}#page=${page}`;
}

const AIRCRAFT_PROCEDURES = [
  {
    id:'ramp-securing-notes',
    aircraft:AIRCRAFT_TAG,
    title:'Ramp, Startup, and Securing Notes',
    category:'ground',
    relatedLessonIds:['FL1','FL11','FL20'],
    summary:'School-specific Cherokee 140 operating notes for preflight coordination, ramp handling, taxi habits, parking, and securing the aircraft after the flight.',
    checklist:[
      'Check remaining time to the next 100-hour inspection and review any squawks before taking the airplane.',
      'Complete the preflight using the checklist and report fuel, oil, or maintenance discrepancies before engine start.',
      'Pull the airplane clear with the tow bar before start and stow the tow bar in the baggage area after use.',
      'Secure seat belt and shoulder harness, keep loose belt ends clear, and avoid riding the brakes during taxi.',
      'After landing, complete the after-landing checklist, keep the airplane parallel in the parking row, and use the tow bar to park.',
      'Finish the securing checklist, log Hobbs accurately, and report deficiencies on the squawk sheet.'
    ],
    callouts:[
      'Do not grab the glareshield to move the seat.',
      'Do not place loose items on the glare shield because they can scratch the windshield and affect compass indication.',
      'Never push on the tail to move the airplane.'
    ],
    warnings:[
      'Aircraft-specific school guidance only. Use the approved checklist and instructor direction for the assigned airplane.',
      'If aircraft paperwork, Hobbs, or maintenance status do not match expectations, stop and resolve it before departure.'
    ],
    sourcePage:1,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'before-maneuver-check',
    aircraft:AIRCRAFT_TAG,
    title:'Before Maneuver Check',
    category:'checks',
    relatedLessonIds:['FL4','FL5','FL6','FL21','FL22','FL23'],
    summary:'Compact setup and clearing-turn flow used before area maneuvers in the Cherokee 140.',
    checklist:[
      'Seat belt and harness fastened',
      'Fuel selector on the fullest tank',
      'Mixture rich',
      'Carburetor heat off',
      'Ignition switch both',
      'Master switch on',
      'Primer locked'
    ],
    execution:[
      'Complete a clearing turn 90 degrees left and 90 degrees right, or reverse the order if terrain or airspace makes that safer.',
      'Use 15 to 20 degrees of bank and clear left, right, behind, and below before beginning the maneuver.'
    ],
    callouts:[
      'Clear for traffic in the blind spots before every maneuver series.'
    ],
    warnings:[
      'This checklist supplements, but does not replace, normal checklist use and visual clearing responsibilities.'
    ],
    sourcePage:2,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'slow-flight',
    aircraft:AIRCRAFT_TAG,
    title:'Slow Flight',
    category:'maneuvers',
    relatedLessonIds:['FL4','FL21','FL22','FL23'],
    summary:'Cherokee 140 slow-flight entry, control-use notes, and recovery sequence, including flap and airspeed targets from the school procedure sheet.',
    targetSpeeds:[
      '85 KT: flap 10',
      '75 KT: flap 25',
      '65 KT: flap 40',
      '40 KT: set about 2000 RPM for minimum controllable airspeed work',
      '66 KT: begin flap retraction sequence during recovery',
      '70 KT: flaps up during recovery',
      '80 KT: return to cruise power'
    ],
    entry:[
      'Reduce to about 1500 RPM while maintaining altitude and anticipating pitch-down and right-yaw tendencies.',
      'Extend flaps in stages at 85, 75, and 65 KT while holding altitude and anticipating pitch changes with each flap movement.',
      'At about 40 KT, set about 2000 RPM, trim, and stabilize at minimum controllable airspeed.'
    ],
    execution:[
      'Use pitch primarily for airspeed and power primarily for altitude once established.',
      'Use only about 10 degrees of bank in turns and expect to hold extra right rudder in right turns.',
      'For climbs and descents in slow flight, change power first and then adjust pitch to keep the target airspeed.'
    ],
    recovery:[
      'Apply full power and add right rudder while maintaining altitude with a gradual pitch change.',
      'Carb heat off, retract to flap 25, then retract to flap 10 at 66 KT.',
      'Retract flaps fully at 70 KT, then return to cruise at about 80 KT and retrim.'
    ],
    warnings:[
      'Do not shove the nose down abruptly in recovery. Transition from slow-flight attitude to cruise attitude gradually.',
      'Use the POH and current instructor technique for exact limitations and configuration approvals.'
    ],
    sourcePage:3,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'power-off-stall',
    aircraft:AIRCRAFT_TAG,
    title:'Power-Off Stall',
    category:'maneuvers',
    relatedLessonIds:['FL4','FL21','FL22','FL23'],
    summary:'Landing-configuration stall entry and recovery sequence from the Cherokee 140 procedures sheet.',
    targetSpeeds:[
      '85 KT: flap 10',
      '75 KT: flap 25',
      '65 KT: flap 40',
      '60 KT: begin descent setup',
      '66 KT (Vx): establish climb after recovery',
      '75 KT (Vy): continue climb',
      '80 KT: return to cruise'
    ],
    entry:[
      'Reduce to 1500 RPM and maintain altitude.',
      'Configure the airplane the same way as the slow-flight entry: 10, 25, then 40 degrees of flap as airspeed decreases.',
      'Start the descent at about 60 KT, then close the throttle and increase back pressure to reach the stall.'
    ],
    recovery:[
      'Release back pressure enough to break the stall.',
      'Apply full power and establish level-flight attitude while keeping the scan outside.',
      'Retract to flap 25, then at 66 KT pitch for climb, confirm positive climb, retract to flap 10, and retract flaps fully at 75 KT.'
    ],
    warnings:[
      'Avoid forcing a flat touchdown attitude if the setup is wrong during approach-style practice. Go around if the setup is unstable.',
      'Follow the approved aircraft checklist and instructor direction for exact recovery priorities.'
    ],
    sourcePage:4,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'power-on-stall',
    aircraft:AIRCRAFT_TAG,
    title:'Power-On Stall',
    category:'maneuvers',
    relatedLessonIds:['FL4','FL21','FL22','FL23'],
    summary:'Departure-style power-on stall procedure with Cherokee-specific pitch, rudder, and altitude-protection notes.',
    targetSpeeds:[
      '66 KT: apply full power and pitch to a slightly higher-than-normal climb attitude',
      '66 KT (Vx): re-establish climb during recovery',
      '75 KT (Vy): continue climb',
      '80 KT: return to cruise'
    ],
    entry:[
      'Begin from straight-and-level at about 1500 RPM.',
      'At about 66 KT, apply full power and establish a slightly higher-than-normal climb attitude.',
      'Hold the attitude with coordinated rudder and back pressure as the airspeed decreases toward the stall.'
    ],
    recovery:[
      'Release back pressure smoothly to return to level pitch.',
      'Allow airspeed to build, then establish climb at 66 KT.',
      'Continue the climb at 75 KT and return to cruise at about 80 KT after level-off.'
    ],
    warnings:[
      'The source notes stress that this simulates a departure stall, so recovery should not descend below the starting altitude.',
      'This is an aircraft-specific training reference, not a substitute for the POH or ACS briefing.'
    ],
    sourcePage:5,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'traffic-pattern-operation',
    aircraft:AIRCRAFT_TAG,
    title:'Traffic Pattern Operation',
    category:'pattern',
    relatedLessonIds:['FL1','FL8','FL11','FL13','FL18'],
    summary:'Normal takeoff and landing pattern flow for the Cherokee 140, including local speed and flap targets used in the school procedure sheet.',
    targetSpeeds:[
      '55 KT rotate',
      '75 KT Vy on upwind',
      'Abeam numbers: about 1500 RPM and flap 10',
      'Base: flap 25 and descend at about 70 KT',
      'Final: flap 40 and about 65 KT'
    ],
    checklist:[
      'Enter the runway with no flap and apply full power.',
      'Rotate at 55 KT and climb upwind at 75 KT.',
      'Turn crosswind and downwind per airport procedure, level at TPA, and set about 2000 RPM.',
      'Complete the before-landing check before the abeam point.',
      'Abeam the numbers, reduce to about 1500 RPM, set flap 10, and begin descent.',
      'Turn base with flap 25, turn final with flap 40, and stabilize at about 65 KT.',
      'Keep toes clear of the brakes for landing, then close the throttle, flare, land, clear the runway, and complete the after-landing check.'
    ],
    callouts:[
      'Apply wind correction and fly a rectangular pattern.',
      'The aiming point in the source flow is the runway numbers.'
    ],
    warnings:[
      'Use published airport procedures, tower instructions, and aircraft limitations ahead of any school shorthand.',
      'If the approach is unstable, go around.'
    ],
    sourcePage:17,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'uncontrolled-airport-operation',
    aircraft:AIRCRAFT_TAG,
    title:'Uncontrolled Airport Operation',
    category:'pattern',
    relatedLessonIds:['GL3','FL17','FL20','FL20A'],
    summary:'Pattern-entry flow and CTAF call examples for non-towered airport arrivals in the Cherokee 140 training environment.',
    setup:[
      'Fly over the airport about 1000 feet above TPA.',
      'Circle to check wind, runway, and traffic flow.'
    ],
    execution:[
      'Depart the airport area perpendicular to the runway on the downwind side.',
      'After passing downwind, descend toward TPA at about 1500 RPM and complete the before-landing check.',
      'Fly parallel to the active runway, then turn to a 45-degree entry for midfield downwind.',
      'Level at TPA before entering downwind, then resume the normal traffic pattern.'
    ],
    callouts:[
      '10 miles out: request advisory if available.',
      '5 miles out and 3 miles out: inbound for landing position reports.',
      'Over the airport, 45 entry, downwind, base, final, and clear-of-runway CTAF calls are all shown in the source document.'
    ],
    warnings:[
      'Adapt CTAF phraseology and entry method to current AIM guidance, local procedures, wind, and traffic conditions.',
      'This is a training reference for pattern planning, not a universal non-towered procedure template.'
    ],
    sourcePage:24,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'short-field-takeoff',
    aircraft:AIRCRAFT_TAG,
    title:'Short-Field Takeoff',
    category:'pattern',
    relatedLessonIds:['FL14','FL21','FL22'],
    summary:'Cherokee 140 short-field takeoff quick-reference using the school procedure sheet.',
    setup:[
      'Compute weight and balance before flight and determine the planned liftoff speed and the target speed at 50 feet AGL.',
      'Use 25 degrees of flap and taxi to the start point appropriate for traffic and runway use.'
    ],
    execution:[
      'Set the brakes, apply full power, verify engine gauges, and release the brakes.',
      'Rotate at the selected speed and set pitch for the planned obstacle-clearance target speed.',
      'At 50 feet AGL, lower the nose slightly to accelerate without descending.',
      'At 66 KT, retract flaps gradually after confirming a positive rate of climb, then continue the climb at 75 KT Vy.'
    ],
    targetSpeeds:[
      'Computed rotation speed based on current weight',
      '66 KT: flap retraction point after positive climb',
      '75 KT Vy: resume normal climb'
    ],
    warnings:[
      'The source emphasizes pitch attitude control instead of chasing the airspeed needle.',
      'Use current POH performance data and instructor guidance for obstacle and runway planning.'
    ],
    sourcePage:19,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'soft-field-takeoff',
    aircraft:AIRCRAFT_TAG,
    title:'Soft-Field Takeoff',
    category:'pattern',
    relatedLessonIds:['FL14','FL21','FL22'],
    summary:'Cherokee 140 soft-field takeoff quick-reference focused on protecting the nosewheel and accelerating in ground effect.',
    checklist:[
      'Set 25 degrees of flap.',
      'Hold full aft elevator.',
      'Roll onto the runway with minimum braking and apply full power while joining centerline.',
      'Ease back pressure as airspeed increases so the cowling stays near the runway end reference.',
      'Lift off and remain in ground effect without pushing the nose down abruptly.',
      'At 66 KT, pitch for climb, then retract to flap 10 after positive climb and continue cleanup to Vy.'
    ],
    targetSpeeds:[
      '66 KT: climb transition',
      '75 KT Vy: resume normal climb'
    ],
    warnings:[
      'The source notes that the goal is to reduce weight on the nose gear, not to hold an excessively high pitch attitude.',
      'Flap retraction changes pitch, so anticipate it and correct smoothly.'
    ],
    sourcePage:20,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'short-field-landing',
    aircraft:AIRCRAFT_TAG,
    title:'Short-Field Landing',
    category:'pattern',
    relatedLessonIds:['FL14','FL21','FL22'],
    summary:'Cherokee 140 short-field landing quick-reference with stabilized final and touchdown-zone notes from the source procedure sheet.',
    checklist:[
      'Fly the normal approach profile.',
      'Select the touchdown point and plan to land within +200 / -0 feet of it.',
      'On short final, use full flap and maintain about 59 KT for at least the last quarter mile.',
      'Keep toes low on the rudder pedals to avoid riding the brakes.',
      'Reduce power, flare, and touch down without forcing the airplane onto the point if the approach is already unstable.',
      'After touchdown, maintain directional control, retract flaps, and brake as briefed.'
    ],
    warnings:[
      'If the touchdown point will be missed, go around instead of forcing the airplane down.',
      'The source specifically cautions against locking the brakes during training.'
    ],
    sourcePage:21,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'soft-field-landing',
    aircraft:AIRCRAFT_TAG,
    title:'Soft-Field Landing',
    category:'pattern',
    relatedLessonIds:['FL14','FL21','FL22'],
    summary:'Cherokee 140 soft-field landing quick-reference with a small power carry and nosewheel protection notes.',
    checklist:[
      'Fly the normal approach at about 65 KT on final with full flap.',
      'Keep toes low on the rudder pedals and clear of the brakes.',
      'Reduce power for the flare.',
      'Just before touchdown, add a small amount of power.',
      'After touchdown, hold back pressure to keep the nose off, then reduce power to idle.'
    ],
    warnings:[
      'The source procedure is designed for training technique and nosewheel protection, not for every runway condition.',
      'Use runway, surface, and aircraft limitations from the POH and instructor briefing.'
    ],
    sourcePage:22,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  },
  {
    id:'engine-failure',
    aircraft:AIRCRAFT_TAG,
    title:'Engine Failure',
    category:'emergency',
    relatedLessonIds:['FL5','FL17','FL21'],
    summary:'Cherokee 140 engine-failure quick-reference for best glide, restart flow, emergency call, and securing sequence from the source procedure sheet.',
    targetSpeeds:[
      'Best glide: 69 KT'
    ],
    checklist:[
      'Pitch for 69 KT best glide and trim for it.',
      'Select a landing area and turn toward it.',
      'Troubleshoot using the checklist or flow: seat belt secure, fuel selector to fullest tank, mixture rich, carb heat on, ignition both, master both, primer locked.',
      'Declare the emergency: squawk 7700, use 121.5 or current ATC frequency, and give aircraft, position, intended landing area, and souls on board.',
      'If landing is unavoidable, secure the engine: mixture idle cut-off, fuel selector off, ignition off, master off after flap use, door open.',
      'After touchdown, stop, assess occupants, evacuate, confirm there is no fire, and notify emergency services and the operator.'
    ],
    callouts:[
      'The sample call in the source is a Mayday call with aircraft type/callsign, position, landing spot, and persons on board.'
    ],
    warnings:[
      'Emergency memory items must match the approved checklist and current instructor briefing for the assigned aircraft.',
      'This page is a training quick-reference only and does not replace the POH/AFM emergency checklist.'
    ],
    sourcePage:26,
    sourceLabel:PROCEDURES_SOURCE_LABEL
  }
];

const PROCEDURES_BY_ID = Object.fromEntries(AIRCRAFT_PROCEDURES.map(item => [item.id, item]));

export {
  AIRCRAFT_TAG,
  PROCEDURES_SOURCE_LABEL,
  PROCEDURES_PDF_PATH,
  PROCEDURE_CATEGORIES,
  AIRCRAFT_PROCEDURES,
  PROCEDURES_BY_ID,
  procedureSourceHref
};
