// ACS PDF Deep Links (FAA-S-ACS-6C)
const ACS_URL = 'https://www.faa.gov/training_testing/testing/acs/private_airplane_acs_6.pdf'; // FAA-S-ACS-6C (Nov 2023)
const ACS_PAGES = {
  'I.A':9,'I.B':9,'I.C':10,'I.D':11,'I.E':12,'I.F':13,'I.G':14,'I.H':15,
  'II.A':18,'II.B':18,'II.C':19,'II.D':20,'II.E':21,'II.F':22,
  'III.A':23,'III.B':23,
  'IV.A':25,'IV.B':26,'IV.C':27,'IV.D':29,'IV.E':30,'IV.F':31,'IV.G':33,'IV.H':34,
  'V.A':43,'V.B':43,
  'VI.A':45,'VI.B':46,'VI.C':46,'VI.D':47,
  'VII.A':49,'VII.B':49,'VII.C':51,'VII.D':52,
  'VIII.A':53,'VIII.B':53,'VIII.C':54,'VIII.D':55,'VIII.E':56,'VIII.F':57,
  'IX.A':58,'IX.B':58,'IX.C':59,'IX.D':60,
  'X.A':65,'XI.A':70,'XII.A':71
};
// FAA Free Handbook URLs (for text ref links)
const REF_URLS = {
  'PHAK': 'https://www.faa.gov/sites/faa.gov/files/pilots/pilot_handbook.pdf',
  'AFH':  'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook',
  'AIM':  'https://www.faa.gov/air_traffic/publications/atpubs/aim_html/',
  'ACS':  ACS_URL
};
function acsLink(ref){
  const base=ref.split('.').slice(0,2).join('.');
  const pg=ACS_PAGES[base]||1;
  return `${ACS_URL}#page=${pg}`;
}

// ─── GRADES / STATUSES ────────────────────────────────────────────────
const GRADES=['U','M','S','G','E'];
const TASK_STATUSES=[
  {v:'not_started',l:'Not Started'},{v:'introduced',l:'Introduced'},
  {v:'practiced',l:'Practiced'},{v:'proficient',l:'Proficient'},
  {v:'needs_review',l:'Needs Review'},{v:'signed_off',l:'Signed Off'}
];

// ─── GROUND SYLLABUS ──────────────────────────────────────────────────
const GL = {
GL1:{id:'GL1',type:'ground',stage:1,title:'Airplanes and Aerodynamics',hrs:3.0,
  acsItems:['I.G Operation of Systems'],
  tolerance:null,
  coaching:'Emphasize that stalls are AOA-dependent, not speed-dependent. Draw force diagrams on the whiteboard. Left-turning tendencies are heavily tested on the written. Use actual aircraft diagrams. Local note: high-DA summer days at KJQF make P-factor and torque effects more pronounced on takeoff.',
  errors:['Believing stalls only occur at low airspeed','Confusing torque with P-factor','Not understanding VA decreases with weight'],
  debrief:['At what angle of attack does the wing always stall?','Why does the airplane yaw left at high power/low airspeed?','How does load factor affect stall speed in a 60° bank?'],
  scenario:null,
  whatIf:[
     {q:'What if a student says stalls only happen at low speed — how do you demonstrate they\'re wrong?',a:'Demonstrate an accelerated stall: enter a steep turn at cruise speed and pull. The wing stalls well above normal stall speed because load factor raises the stall speed (Vs × √n). In a 60° bank the load factor is 2G and stall speed rises 41%. The wing doesn\'t care what the airspeed indicator reads — it only cares about angle of attack.'},
     {q:'What if your aircraft has an asymmetric fuel load on preflight — is it safe to fly? What do you do?',a:'Check the POH fuel imbalance limits. If within limits, begin the flight on the heavy tank and switch periodically to equalize. If beyond the published limit, fuel to an acceptable balance before departure. Never fly with fuel in a tank you\'re uncertain about — a full-tank/empty-tank imbalance can exceed structural limits.'},
     {q:'What if VA is 111 kt at max gross but you\'re 200 lbs under — why can\'t you still do full control deflections at 111?',a:'Maneuvering speed decreases with weight because at lower weight the aircraft stalls at a lower speed, meaning full deflection can exceed the G-limit before the wing stalls. The published VA assumes max gross weight — lighter aircraft have a lower actual VA. Use the weight-adjusted values in the POH or err on the side of caution in turbulence.'},
     {q:'What if a student confuses P-factor with torque — how do you clarify each one with a simple drawing?',a:'Torque is Newton\'s third law: the engine/prop spins clockwise (from pilot\'s view) so the fuselage reacts by rolling left. Draw a front view. P-factor is an AOA effect: at high AOA the descending blade (right side) has a higher effective AOA and generates more thrust, yawing the nose left. Draw a side view showing the blade path angles. Both peak at high power and low airspeed.'},
     {q:'What if you\'re in a 60° banked level turn and feel the onset of a stall — what is your stall speed right now vs. straight flight?',a:'Load factor at 60° bank is 2G, so stall speed is Vs × √2 — about 41% higher than wings-level. If Vs is 50 kt, you\'re now stalling around 70 kt. The correct recovery is to roll to reduce bank angle, which reduces load factor and immediately lowers the stall speed. Do not add back pressure.'}
  ],
  tasks:[
    {id:'GL1-1',text:'Airframe components and control surfaces',acsRef:'I.G',textRef:'PHAK Ch.2',
     subtasks:['Identify fuselage, wings, empennage, and undercarriage on training aircraft','Name all primary control surfaces: ailerons, elevator/stabilator, rudder','Name secondary surfaces: flaps, trim tabs, spoilers (if applicable)','Explain which axis each control surface commands (roll/pitch/yaw)','Locate all inspection access panels, drain points, and sumps','Read and explain all cockpit and exterior limitation placards']},
    {id:'GL1-2',text:'Four forces of flight: lift, weight, thrust, drag',acsRef:'I.G',textRef:'PHAK Ch.4',
     subtasks:['Draw the four force vectors acting on the aircraft in straight-and-level flight','State the equilibrium condition: L=W and T=D for unaccelerated flight','Explain what excess thrust produces (acceleration/climb) vs. excess drag','Describe how the force balance changes in a climb, descent, and turn','Explain the difference between weight (constant) and lift (variable with AOA/V)']},
    {id:'GL1-3',text:'Lift production: airfoil, Bernoulli, angle of attack',acsRef:'I.G',textRef:'PHAK Ch.4',
     subtasks:['Define chord line, mean camber line, relative wind, and angle of attack','Explain Bernoulli: faster airflow over curved upper surface creates lower pressure','Describe Newton\'s 3rd law contribution: airflow deflected downward, reaction is up','Explain what happens to lift as AOA increases toward critical angle','State that the wing always stalls at the same critical AOA regardless of airspeed','Correctly use the lift equation: L = CL × ½ρV² × S']},
    {id:'GL1-4',text:'Stalls and spins: critical AOA, load factor, spin entry',acsRef:'I.G',textRef:'PHAK Ch.4',
     subtasks:['State that stall occurs at critical AOA, NOT at a specific airspeed','Explain how load factor increases stall speed: Vs(load) = Vs × √n','Calculate stall speed in a 60° bank (load factor = 2, speed increases 41%)','Identify the three entry conditions for a spin: stall + yaw + continuation','Describe the four spin phases: incipient, developed, flat spin, recovery','State the POH spin recovery procedure (PARE: Power off, Ailerons neutral, Rudder opposite, Elevator forward)']},
    {id:'GL1-5',text:'Drag: parasite, induced, L/D ratio, ground effect',acsRef:'I.G',textRef:'PHAK Ch.4',
     subtasks:['Define parasite drag and explain it increases with V² (doubles with 2× speed)','Define induced drag and explain it decreases as airspeed increases','Identify L/Dmax on the drag curve — significance for best glide','Explain ground effect: within one wingspan, induced drag reduced up to 48%','Describe how flap extension changes drag characteristics and the stall speed']},
    {id:'GL1-6',text:'Airplane stability: longitudinal, lateral, directional',acsRef:'I.G',textRef:'PHAK Ch.5',
     subtasks:['Define positive static stability and positive dynamic stability','Explain longitudinal stability: CG ahead of CP, horizontal stab provides nose-down restoring moment','Explain lateral stability: dihedral angle produces roll-restoring moment when banked','Explain directional stability: vertical stabilizer acts as weathervane','Define spiral instability vs. Dutch roll and which is more common in GA aircraft']},
    {id:'GL1-7',text:'Left-turning tendencies: torque, P-factor, slipstream, gyroscopic precession',acsRef:'I.G',textRef:'PHAK Ch.5',
     subtasks:['Explain torque reaction: prop spins clockwise (pilot\'s view), fuselage rolls left','Explain P-factor: at high AOA the descending blade (right side) has greater AOA → more thrust → yaws left','Explain slipstream: spiral airflow from prop strikes LEFT side of vertical stab → yaws left','Explain gyroscopic precession: prop as gyroscope, applied force appears 90° ahead in rotation','State when each tendency is most pronounced (high power, low airspeed, high AOA on takeoff)','Describe correct rudder correction for each tendency']},
    {id:'GL1-8',text:'Load factors: V-G diagram, maneuvering speed VA',acsRef:'I.G',textRef:'PHAK Ch.4',
     subtasks:['Define load factor (n = Lift ÷ Weight) and state 1G in level flight','State normal category structural limits: +3.8G and −1.52G','Read the V-G diagram: normal envelope, caution range, structural damage range','Explain maneuvering speed VA and what maneuvers are prohibited above it','Explain why VA decreases as aircraft weight decreases','Calculate the load factor in a 30°, 45°, and 60° banked level turn']}
  ]},

GL2:{id:'GL2',type:'ground',stage:1,title:'Airplane Instruments, Engines, and Systems',hrs:3.0,
  acsItems:['I.G Operation of Systems','II.A Preflight Assessment'],
  tolerance:null,
  coaching:'Walk through the actual aircraft cockpit. Students retain instrument knowledge far better when pointing at real instruments. Emphasize ARROW. Carb ice is a real concern at KJQF on humid mornings — NC humidity is high year-round.',
  errors:['Confusing indicated vs. true airspeed','Not knowing how to check oil','Unfamiliar with carb heat purpose','Confusing pitot blockage vs. static port blockage'],
  debrief:['What happens to the ASI if the pitot tube is blocked but static is open?','What grade of fuel does our aircraft use, and how do you verify it?','If the alternator fails, what power do you have remaining and for how long?'],
  scenario:null,
  whatIf:[
     {q:'What if the altimeter reads 500 ft high after you set the current altimeter setting — what does that tell you?',a:'Either the altimeter is malfunctioning or the setting received was wrong. On the ground, a reading more than 75 ft from field elevation with the correct setting indicates an instrument out of tolerance (§91.411). Write it up for maintenance. For VFR flight the aircraft is legal but the error must be noted — it is a safety issue if flying near terrain or in busy airspace.'},
     {q:'What if the vacuum pump fails in IMC — which instruments do you lose and which do you keep?',a:'You lose the attitude indicator and heading indicator — both vacuum-driven in most trainers. You retain the airspeed indicator, altimeter, and VSI (pitot-static) and the turn coordinator (electric). Immediately transition to partial-panel: use the TC for bank control, altimeter and VSI for pitch. Declare an emergency, reduce workload, and request vectors to VMC or an ILS.'},
     {q:'What if you sump the fuel and get a clear sample but the fuel smells wrong — do you fly?',a:'No. Clear color means no visible water, but odor is also a valid check. 100LL has a distinct aromatic smell; mogas, Jet-A, or contaminated fuel smells noticeably different. If anything is off, have the fuel tested or drain and refuel from a verified source. Fuel contamination is not recoverable in the air.'},
     {q:'What if the ammeter shows a discharge in flight — what are your immediate actions and how long do you have?',a:'The alternator has failed and the battery is your only power. Immediately shed non-essential electrical load: avionics you don\'t need, lights (except nav at night), pitot heat if VMC. Most GA batteries provide 20–30 minutes. Squawk 7600, navigate to the nearest suitable airport, and land without delay. Do not prioritize fuel checks over landing.'},
     {q:'What if the heading indicator precesses 15° in 10 minutes — is the aircraft airworthy? What\'s acceptable?',a:'Normal precession is up to 3° per 15 minutes. 15° in 10 minutes indicates a failing vacuum system or worn gyro bearings. The aircraft is not airworthy for IFR; for VFR it is technically legal but you should write it up for maintenance. Use the magnetic compass as the primary heading reference and note the discrepancy in the aircraft logs.'}
  ],
  tasks:[
    {id:'GL2-1',text:'Pitot-static system and instruments',acsRef:'I.G',textRef:'PHAK Ch.8',
     subtasks:['Trace the pitot-static system plumbing from source to each instrument','Explain what the altimeter measures and how it differs from true altitude','Explain VSI lag and the rapid movement during climbs/descents','Explain airspeed indicator: IAS, CAS, TAS, and Mach relationships','Describe effects of blocked pitot tube vs. blocked static port on each instrument','Identify the colored arcs on the ASI: white (flap), green (normal), yellow (caution), red (never exceed)']},
    {id:'GL2-2',text:'Gyroscopic instruments',acsRef:'I.G',textRef:'PHAK Ch.8',
     subtasks:['Explain gyroscopic rigidity and precession — how gyros work','Explain attitude indicator: horizon bar, bank angle markings, limitation (±60° pitch/180° bank)','Explain heading indicator: must be aligned to compass; precesses ~3° per 15 min','Explain turn coordinator: rate, coordination ball, inclinometer (slip/skid)','Identify which instruments are vacuum-powered vs. electrically-powered in training aircraft','Describe effects of vacuum system failure on gyroscopic instruments']},
    {id:'GL2-3',text:'Magnetic compass: construction and errors',acsRef:'I.G',textRef:'PHAK Ch.8',
     subtasks:['Explain magnetic dip and how it causes errors','Describe acceleration error: ANDS — Accelerate North, Decelerate South (in N. hemisphere)','Describe northerly turning error: leads on south headings, lags on north headings','Explain variation (magnetic vs. true north) and how to apply it using isogonic lines','Explain deviation and the compass correction card','Read the compass correction card in the training aircraft for several headings']},
    {id:'GL2-4',text:'Engine: four-stroke cycle, ignition, carburetor, fuel injection',acsRef:'I.G',textRef:'PHAK Ch.7',
     subtasks:['Name the four strokes: intake, compression, power, exhaust — describe each','Explain the dual magneto ignition system: why two mags, what happens if one fails','Describe carburetor icing: conditions (high humidity, 20–70°F), symptoms, treatment with carb heat','Explain mixture control: rich for takeoff/landing, lean for cruise to save fuel','Describe fuel injection advantages over carburetor (no carb ice, better fuel distribution)','Explain pre-ignition vs. detonation and how to prevent each']},
    {id:'GL2-5',text:'Fuel system: grades, sumping, contamination',acsRef:'I.G',textRef:'PHAK Ch.7',
     subtasks:['State the fuel grade for the training aircraft (100LL, blue) and why it matters','Demonstrate proper sump sample procedure: location of all sump drains, procedure, color check','Describe water contamination: sinks to bottom, found in sumps, clear/blue vs. fuel color','Explain fuel system configuration: tanks, selector, vents, fuel strainer','State how much fuel is unusable and where it is in the training aircraft\'s fuel system','Calculate endurance and range using fuel burn rate from the POH']},
    {id:'GL2-6',text:'Electrical system: alternator, battery, circuit breakers',acsRef:'I.G',textRef:'PHAK Ch.7',
     subtasks:['Trace the electrical system: alternator → bus → avionics/lights → ground','Explain the battery\'s role: starting power and backup if alternator fails','Explain the ammeter/loadmeter: what a negative/zero indication means','Identify all circuit breakers in the training aircraft and their labeled loads','Describe proper procedure if an electrical fire occurs in flight','State how long battery-only power lasts in typical training aircraft (est. 20–30 min)']},
    {id:'GL2-7',text:'Preflight inspection and ARROW documents',acsRef:'II.A',textRef:'PHAK Ch.2; POH §4',
     subtasks:['State what ARROW stands for: Airworthiness cert, Registration, Radio license, Operating handbook, Weight & balance','Verify ARROW documents are present and current in training aircraft','Explain what the airworthiness certificate means and that it is permanent unless revoked','Complete the exterior preflight inspection per POH checklist without omissions','Check oil quantity to proper level and explain acceptable range','Verify fuel quantity visually AND verify caps are secure; check for water/contamination']}
  ]},

GL3:{id:'GL3',type:'ground',stage:1,title:'Airports, ATC, and Airspace',hrs:3.0,
  acsItems:['I.E National Airspace System','III.A Communications'],
  tolerance:null,
  coaching:'Use the KJQF/KCLT area sectional for every example. KJQF is inside the KCLT Class B Mode C veil — students must understand Mode C veil and shelf dimensions. Practice KJQF ground/tower radio calls.',
  errors:['Confusing Class E/G floor boundaries','Not knowing VFR minimums differ by class AND day/night','Forgetting Class B requires explicit clearance','Misreading VASI 2W/2R vs 2R/2W'],
  debrief:['What equipment is required to enter KCLT Class B?','What does 2W/2R PAPI mean: above, on, or below glidepath?','A steady red light from the tower while airborne means what?'],
  scenario:null,
  whatIf:[
     {q:'What if ATC clears you into Class B and you don\'t hear the full clearance — can you enter?',a:'No. Class B requires an explicit ATC clearance — the phrase \'cleared into the Bravo\' must be heard. If the transmission was garbled, ask ATC to say again before proceeding. Entering Class B without a clearance is a deviation that can result in a certificate action. When in doubt, hold outside and query ATC.'},
     {q:'What if you\'re inbound to KJQF and the tower gives you a steady red light — what do you do?',a:'Give way to all other aircraft and continue circling. Do not land until a steady green light is received. A steady red in the air means the airport is unsafe or you are not cleared — the tower is telling you to keep flying without specifying why. Switch to the guard frequency (121.5) if you have a radio issue and try to communicate.'},
     {q:'What if a TFR appeared over KJQF after you departed and you had no datalink — how would you know?',a:'You probably wouldn\'t know unless you\'re monitoring ATC frequencies. This is why checking NOTAMs within 1–2 hours of departure is critical — TFRs can appear with short notice. In flight, monitor the appropriate ATC frequency; they often broadcast TFR advisories. If uncertain, call Charlotte Approach on 121.5 and ask for TFR information.'},
     {q:'What if you land at an uncontrolled airport and a wrong-way aircraft is on the runway — what\'s your go-around procedure?',a:'Immediately go around using full power, carb heat off, positive climb established, flaps retracted per schedule. Broadcast your intentions on the CTAF including your position and that you are going around. Remain in the pattern and make all position calls. After landing, document the wrong-way traffic incident — it may be reportable.'},
     {q:'What if wake turbulence from a departing heavy is your biggest hazard on climbout — what\'s your exact avoidance technique?',a:'Depart prior to the heavy\'s rotation point and turn to avoid flying through its climbout path. Wake vortices settle and spread outward below the flight path, so climb above and upwind of the heavy\'s track. If departing behind a heavy, wait at least 2 minutes. At KJQF, KCLT departure traffic can produce vortices that drift toward the field — always be aware of wind direction and heavy traffic.'}
  ],
  tasks:[
    {id:'GL3-1',text:'Airspace classification A through G',acsRef:'I.E',textRef:'PHAK Ch.15; AIM Ch.3',
     subtasks:['State the floor and ceiling of Class A airspace and the required equipment','State Class B dimensions, equipment requirements (ADS-B out, Mode C, two-way radio), and clearance requirement','State Class C dimensions (5/10 NM circles), equipment, and communication establishment requirement','State Class D dimensions and requirements — communication establishment sufficient','Explain Class E floors: 700 AGL (magenta vignette), 1,200 AGL (no depiction), 14,500 MSL default','Explain Class G characteristics: uncontrolled, VFR day 1-1-1 minimums at or below 1,200 AGL','State VFR cloud clearance and visibility for each class: day and night']},
    {id:'GL3-2',text:'Special-use airspace: MOAs, restricted, prohibited, TFRs',acsRef:'I.E',textRef:'PHAK Ch.15; AIM 3-4',
     subtasks:['Identify MOA on sectional: what activity occurs, how to check active status (ARTCC or FSS)','Identify restricted areas: entry requires ATC permission; explain how to request','Identify prohibited areas: no entry under any circumstances (e.g., P-40 Washington DC)','Explain SFRA/FRZ around Washington DC and why it exists','Explain TFRs: how to check (NOTAM, 1800WXBRIEF, ForeFlight), types (§91.137, §91.145, §99.7)','Locate any active special-use airspace on today\'s sectional within 50 NM of KJQF']},
    {id:'GL3-3',text:'Airport runway markings, signs, and lighting',acsRef:'III.A',textRef:'PHAK Ch.14; AFH Ch.2',
     subtasks:['Identify all runway markings: threshold, aiming point, touchdown zone, centerline, edge, displaced threshold','Explain the significance of a displaced threshold vs. a blast pad/stopway','Identify all taxiway signs: location, direction, destination, runway hold short (red), information (yellow)','Explain the runway hold-short marking: two solid lines + two dashed lines, significance of each','Identify all runway lighting: REILS, PAPI/VASI, MALSR/ALSF, in-pavement lights','Read a VASI/PAPI: all white = high, all red = low, white/red = on glidepath (remember: red over white, you\'re alright)']},
    {id:'GL3-4',text:'Radio communications: phraseology and procedures',acsRef:'III.A',textRef:'AIM Ch.4',
     subtasks:['State the format of a standard initial radio call: who you\'re calling, who you are, where, what you want','Practice KJQF ATIS acquisition and phonetic reading','Practice KJQF Ground radio call: request taxi with information identifier','Practice KJQF Tower radio call: announce ready for departure, runway, VFR intentions','Explain difference between UNICOM (FBO advisory), CTAF (uncontrolled airport), and MULTICOM','Describe lost communication procedures: squawk 7600, light signals, attempt on guard (121.5)']},
    {id:'GL3-5',text:'ATC radar services and transponder',acsRef:'III.A',textRef:'PHAK Ch.14; AIM Ch.4',
     subtasks:['Explain transponder Mode A (code only), Mode C (code + altitude), Mode S (selective address)','State ADS-B Out requirements: Class A/B/C and above 10,000 MSL (§91.225)','Explain squawk codes: 1200 VFR, 7500 hijack, 7600 lost comm, 7700 emergency','Describe how to request VFR flight following from Charlotte Approach after KJQF departure','Explain Traffic Information Service (TIS) and how to interpret traffic advisories','Describe TRSA service and how it differs from Class C requirements']},
    {id:'GL3-6',text:'Wake turbulence: categories, avoidance, timing',acsRef:'I.H',textRef:'AIM 7-3',
     subtasks:['State the four wake turbulence weight categories: super, heavy (750k+ lbs), large, small','Explain wake vortex characteristics: rotate outward, descend, spread 500–1,000 ft below flight path','Describe when wake turbulence is most dangerous: light wind, clean aircraft configuration','State the 2-minute (3 minutes for Class I) wait after heavy departure for wake turbulence avoidance','Explain proper positioning behind a landing heavy aircraft: touch down past its touchdown point','Describe caution situation at KJQF: KCLT departure corridors can produce wake turbulence over KJQF']},
    {id:'GL3-7',text:'ATC light signals: all combinations',acsRef:'III.A',textRef:'AIM 4-2-13',
     subtasks:['State steady GREEN (airborne) = cleared to land; steady GREEN (ground) = cleared for takeoff','State flashing GREEN (airborne) = return for landing; flashing GREEN (ground) = cleared to taxi','State steady RED (airborne) = give way, continue circling; steady RED (ground) = stop','State flashing RED (airborne) = airport unsafe, do not land; flashing RED (ground) = taxi clear','State flashing WHITE (ground only) = return to starting point','State alternating red/green = general warning, exercise extreme caution']}
  ]},

GL4:{id:'GL4',type:'ground',stage:1,title:'Federal Aviation Regulations',hrs:3.0,
  acsItems:['I.A Pilot Qualifications','I.B Airworthiness Requirements'],
  tolerance:null,
  coaching:'Teach the intent behind each regulation. §91.3 (PIC responsibility) is the foundation of everything. Help students understand that regulations are minimum standards, not optimal standards.',
  errors:['Mixing up 90-day T&G currency with medical requirement','Thinking registration is permanent','Not knowing 100-hr is only for hire','Confusing annual (calendar) with 100-hr (hours)'],
  debrief:['You receive an ATC clearance requiring a FAR violation. Who is responsible?','What four documents must be in the aircraft before flight?','A friend asks you to fly him home 7 hours after you had two beers. Can you go?'],
  scenario:null,
  whatIf:[
     {q:'What if ATC issues a clearance that would require you to violate an FAR — what do you say and do?',a:'Under §91.3, the PIC is the final authority and responsible for safe operation. If an ATC instruction would require an FAR violation, you must refuse it. Say \'Unable\' and explain briefly. ATC cannot override the FARs. After the flight, consider filing an ASRS report if it was a significant incident. You are legally protected if you can demonstrate the deviation was necessary for safety.'},
     {q:'What if the aircraft\'s annual expired yesterday and you just landed away from home — can you fly it home?',a:'No. A lapsed annual inspection means the aircraft is not airworthy under §91.409. You cannot legally fly it, including back to home base. Your options: arrange for an A&P to perform the inspection where you are, have the aircraft trailered home, or apply to the FSDO for a ferry permit for a specific flight to a maintenance facility.'},
     {q:'What if a passenger hands you a beer 30 minutes before the flight — what\'s your exact legal exposure?',a:'You cannot legally act as crewmember within 8 hours of consuming alcohol (§91.17). Even if 30 minutes pass, you are still within the 8-hour window from any consumption. The .04% BAC limit is a separate requirement — both must be satisfied. Decline the flight. There is no emergency exception for alcohol violations.'},
     {q:'What if you land without receiving a clearance because of radio failure — what paperwork might follow?',a:'Lost comm procedures (§91.185 for IFR; squawk 7600 for VFR) cover the in-flight protocol. After landing with no clearance in controlled airspace, you may receive a call from the FSDO or a Letter of Investigation. Cooperate fully, explain the radio failure, and submit an ASRS report promptly — NASA immunity applies if submitted within 10 days and the violation was inadvertent.'},
     {q:'What if you find the aircraft registration expired mid-flight — is the aircraft airworthy? Does the flight need to stop?',a:'Registration must be on board and current (§91.9, §91.203). An expired registration does not make the aircraft mechanically unairworthy, but it is an illegal operation. Complete the flight to the destination and renew registration before flying again. Technically you should land at the nearest suitable airport — practically, contact your FBO and arrange renewal before the next departure.'}
  ],
  tasks:[
    {id:'GL4-1',text:'PIC responsibility and emergency authority (§91.3)',acsRef:'I.A',textRef:'PHAK Ch.1; 14 CFR §91.3',
     subtasks:['Quote or paraphrase §91.3(a): PIC is directly responsible for and is the final authority as to the operation of the aircraft','Explain §91.3(b): in an emergency, the PIC may deviate from any rule to meet the emergency','Describe what "final authority" means when ATC issues an instruction that conflicts with safety','Explain the post-emergency deviation report requirement if requested by the FAA','State that being PIC does not require being the sole manipulator — passengers do not remove PIC status from the CFI']},
    {id:'GL4-2',text:'VFR weather minimums by airspace class (§91.155)',acsRef:'I.A',textRef:'PHAK Ch.15; 14 CFR §91.155',
     subtasks:['State VFR minimums for Class B: 3 SM visibility, clear of clouds','State VFR minimums for Class C and D: 3 SM, 500 below / 1000 above / 2000 horizontal','State VFR minimums for Class E at or above 10,000 MSL: 5 SM, 1000/1000/1 mile','State VFR minimums for Class E below 10,000 MSL: 3 SM, 500/1000/2000','State VFR minimums for Class G day at or below 1,200 AGL: 1 SM, clear of clouds','State VFR minimums for Class G night: 3 SM, 500/1000/2000 (same as Class E)','Explain Special VFR: allows ≥1 SM and clear of clouds in Class B/C/D/E surface areas by clearance']},
    {id:'GL4-3',text:'Recent flight experience and currency (§61.57)',acsRef:'I.A',textRef:'14 CFR §61.57',
     subtasks:['State day passenger currency: 3 T&Gs within 90 days in same category/class/type','State night passenger currency: 3 T&Gs between 1 hour after sunset and 1 hour before sunrise within 90 days','Explain the difference between currency (legally defined) and proficiency (operationally safe)','State IFR currency: 6 approaches + holding + intercepting/tracking within 6 months','Explain what happens when currency lapses: proficiency check or Instrument Proficiency Check required']},
    {id:'GL4-4',text:'Alcohol regulations (§91.17) and IMSAFE',acsRef:'I.A',textRef:'14 CFR §91.17',
     subtasks:['State the 8-hour rule: no alcohol within 8 hours of acting as crewmember','State the .04% BAC rule: blood/breath alcohol content may not exceed .04%','Explain that BOTH rules apply simultaneously — you must satisfy BOTH','State that §91.17 also prohibits flying while under the influence regardless of time elapsed','Discuss drug regulations: prescription drugs that impair performance are prohibited','Apply IMSAFE checklist: Illness, Medication, Stress, Alcohol, Fatigue, Eating/Emotion']},
    {id:'GL4-5',text:'Airworthiness: required inspections and documents',acsRef:'I.B',textRef:'PHAK Ch.2; 14 CFR §91.409',
     subtasks:['State the annual inspection requirement: every 12 calendar months (§91.409(a))','State the 100-hour inspection: only required when aircraft is operated FOR HIRE (§91.409(b))','State ELT battery/inspection requirement: 12 calendar months or after 1 hr cumulative use (§91.207)','State transponder inspection: every 24 calendar months (§91.413)','State VOR accuracy check: required only for IFR operations, within 30 days (§91.171)','State ADS-B Out: not an inspection item, but equipment must meet standards of §91.227']},
    {id:'GL4-6',text:'ARROW required documents',acsRef:'I.B',textRef:'PHAK Ch.2',
     subtasks:['State what ARROW stands for: Airworthiness certificate, Registration, Radio station license, Operating handbook/AFM, Weight and balance','Explain airworthiness certificate: permanent, must be displayed, becomes invalid if aircraft not maintained','Explain registration: must be renewed every 3 years; must be current to be legal','Explain radio station license: required for international flights and KJQF is close enough to require awareness','Verify ARROW in the training aircraft — locate each document physically','Explain that POH/AFM must be the specific aircraft\'s copy, not a generic one']},
    {id:'GL4-7',text:'NTSB Part 830 — accident/incident notification',acsRef:'I.A',textRef:'49 CFR Part 830',
     subtasks:['Define "accident" under Part 830: death, serious injury, or substantial damage','Define "incident" under Part 830: occurrence other than an accident which affects safety','State immediate notification requirement for accidents: immediately by fastest means','State that incidents require notification only for specific types listed in §830.5','Explain 10-day written accident report requirement to nearest NTSB regional office','Explain requirement to preserve wreckage until NTSB releases it']},
    {id:'GL4-8',text:'Student pilot and presolo endorsement requirements',acsRef:'I.A',textRef:'14 CFR §61.87',
     subtasks:['State minimum age for solo: 16 years old for powered aircraft','State minimum age for private pilot certificate: 17 years old','List §61.87(b) aeronautical knowledge areas required for presolo knowledge test','List §61.87(c) flight training areas required before solo — minimum maneuvers','State the 90-day endorsement requirement: each solo endorsement valid 90 days only','Explain Class B, C, and D solo endorsement requirements (§61.95)']}
  ]},

GL5:{id:'GL5',type:'ground',stage:1,title:'Airplane Performance and Weight & Balance',hrs:3.0,
  acsItems:['I.F Performance and Limitations'],
  tolerance:null,
  coaching:'Use the actual POH for ALL calculations — not textbook examples. Complete a real W&B for dual instruction configuration at KJQF. KJQF summer afternoons with 35°C OAT and high humidity produce significant density altitude — calculate it.',
  errors:['Forgetting fuel weight in W&B','Using sea-level charts without DA correction','Not accounting for non-standard temp','Forgetting unusable fuel counts as weight'],
  debrief:['Airport: 133 ft MSL, OAT 38°C, altimeter 29.85 — what is density altitude?','How does forward CG affect stall speed and landing?','Max gross weight 2,300 lb, loaded 2,380 lb — how many gallons to drain?'],
  scenario:null,
  whatIf:[
     {q:'What if your W&B shows the CG is 0.3 inches aft of the limit with full fuel — what are your options?',a:'The aircraft cannot legally fly in that configuration. Options: reduce fuel (removing weight from the aft fuselage improves the CG — wait, check the fuel tank location relative to the CG), move ballast to a forward location, reduce rear-seat passenger weight, or change seat positions if the POH permits. Always verify the corrected CG is within the envelope before engine start.'},
     {q:'What if the POH takeoff chart shows you need 1,800 ft but the runway is 2,200 ft — is that enough margin at KJQF on a 38°C afternoon?',a:'Barely, and probably not acceptable for a student solo. POH charts are based on a new aircraft, smooth hard surface, and standard technique — real-world performance is often 10–25% worse. On a hot day with any crosswind or rough pavement, 400 ft of margin can disappear. A 50% safety factor is good practice: if you need 1,800 ft, you want at least 2,700 ft available.'},
     {q:'What if you burn down to 10 gallons en route and your CG shifts forward past the forward limit — what happened and what do you feel?',a:'In most aircraft, the main fuel tanks are near the CG, but if the aft tank empties the CG shifts forward. A forward-of-limits CG increases stick forces, makes the nose heavy, reduces elevator authority, and increases stall speed. The aircraft will feel nose-heavy and difficult to flare. Immediately plan to land — do not continue flight outside the envelope.'},
     {q:'What if density altitude is 4,500 ft at a sea-level field — what does that do to your climb rate and landing distance?',a:'Climb rate decreases significantly — a normally aspirated engine loses about 3% power per 1,000 ft of density altitude, so at 4,500 ft DA you have roughly 85% of sea-level power. Takeoff roll and obstacle clearance distance increase substantially. Landing distance also increases because true airspeed is higher at the same IAS. Recalculate performance using POH DA charts, not standard conditions.'},
     {q:'What if the landing distance chart says 1,400 ft but you\'ve never landed this short — what factors would make you choose a longer runway?',a:'POH charts assume ideal conditions and standard technique — an unfamiliar runway, displaced threshold, obstacles, surface condition, or pilot currency all justify more margin. For training purposes, always use the longest runway available until short-field technique is demonstrated to ACS standards. Never treat POH numbers as guaranteed minimums.'}
  ],
  tasks:[
    {id:'GL5-1',text:'Density altitude and its effects',acsRef:'I.F',textRef:'PHAK Ch.10',
     subtasks:['Define pressure altitude: altitude corrected for non-standard pressure (set altimeter to 29.92)','Define density altitude: pressure altitude corrected for non-standard temperature','Calculate pressure altitude: field elevation ± (29.92 − altimeter setting) × 1,000','Calculate density altitude using the flight computer or DA formula','State effects on engine: less dense air = less O2 = less power (non-turbocharged loses ~3% per 1,000 ft DA)','State effects on wings: less dense air = longer takeoff roll, higher true airspeed for same IAS']},
    {id:'GL5-2',text:'Takeoff performance charts',acsRef:'I.F',textRef:'POH §5',
     subtasks:['Locate and use the takeoff ground roll chart in the POH for a given weight/DA','Locate and use the takeoff distance over 50-ft obstacle chart for the same conditions','Apply headwind and crosswind correction factors to computed takeoff distance','State the effect of uphill/downhill slope on takeoff performance','Calculate the actual vs. standard takeoff roll for a representative KJQF summer day','State the maximum demonstrated crosswind component from the POH']},
    {id:'GL5-3',text:'Landing performance charts',acsRef:'I.F',textRef:'POH §5',
     subtasks:['Locate and use the landing distance chart in the POH','Apply density altitude, wind, and slope corrections to landing distance','Calculate approach speed (VREF) at the planned landing weight','Explain why landing distance increases with tailwind and downslope runway','State the landing distance at KJQF elevation on a standard day with the training aircraft','Compare computed landing distance to actual available runway distance at KJQF']},
    {id:'GL5-4',text:'Crosswind component calculation',acsRef:'I.F',textRef:'PHAK Ch.10',
     subtasks:['Use the crosswind component chart: identify wind angle and total wind speed','Compute headwind and crosswind components graphically','Compute crosswind component mathematically: crosswind = Vwind × sin(angle)','State the maximum demonstrated crosswind component for the training aircraft','Determine whether a given wind condition exceeds student pilot demonstrated crosswind','Practice calculating crosswind for runway 20 at KJQF with various wind scenarios']},
    {id:'GL5-5',text:'Weight and balance calculations',acsRef:'I.F',textRef:'PHAK Ch.9; POH §6',
     subtasks:['Define weight, arm, moment, center of gravity, and CG limits','Locate the CG envelope diagram in the POH: forward and aft limits','Calculate moment for each load station using Weight × Arm = Moment','Sum all weights and moments; calculate CG = Total Moment ÷ Total Weight','Determine if the calculated CG falls within the CG envelope','Complete a W&B form for a dual training flight: pilot (your weight), instructor, and fuel','Determine effect on performance and handling: forward CG (stable, higher stall), aft CG (unstable, lower stall)']},
    {id:'GL5-6',text:'Fuel consumption and range planning',acsRef:'I.F',textRef:'POH §5; 14 CFR §91.151',
     subtasks:['Find fuel consumption rate (GPH) for cruise power settings in the POH','Calculate total fuel required: (flight time + reserve) × GPH','State day VFR fuel reserve: enough to fly 30 minutes beyond destination at cruise power (§91.151(a)(1))','State night VFR fuel reserve: enough to fly 45 minutes beyond destination (§91.151(a)(2))','Calculate range and endurance for a sample cross-country flight at 75% power','Explain the difference between range (distance) and endurance (time)']}
  ]},

GL6:{id:'GL6',type:'ground',stage:2,title:'Aeromedical Factors and ADM',hrs:2.0,
  acsItems:['I.H Human Factors'],
  tolerance:null,
  coaching:'Go beyond textbook — pull NTSB briefs from the Piedmont area. Anti-authority and invulnerability are the most common hazardous attitudes in student pilots. The 5P check is used in every flight lesson pre-brief in this syllabus.',
  errors:['Treating IMSAFE as a checkbox rather than genuine self-assessment','Not understanding hyperventilation treatment','Thinking ADM is only relevant for complex flights'],
  debrief:['Your friend wants you to fly even though you had 2 beers 5 hours ago. IMSAFE?','What is the antidote for the "macho" hazardous attitude?','What does PAVE stand for and how do you apply it before a cross-country?'],
  scenario:null,
  whatIf:[
     {q:'What if a student insists they\'re fine to fly but slept 4 hours and is on antihistamines — how do you handle that conversation?',a:'Frame it as a safety standard, not a personal judgment: \'I can\'t sign off on a flight when IMSAFE has two red flags — fatigue and medication.\' Antihistamines cause cognitive impairment and drowsiness; that alone is grounds to cancel. Sleep deprivation compounds the effect. Offer to reschedule and use the opportunity to teach that canceling is a professional decision, not a failure.'},
     {q:'What if you\'re en route and notice your student seems euphoric, slightly confused, and their fingernails look blue — what do you suspect and do?',a:'Hypoxia. The symptoms — euphoria, confusion, cyanosis (blue nails/lips) — are classic. The insidious part is the student probably feels fine. Take the controls immediately, descend to lower altitude, apply supplemental oxygen if available, and divert to the nearest airport. Do not wait for confirmation — treat it as hypoxia and act.'},
     {q:'What if a student\'s spouse calls the FBO to say the student had a fight and is emotionally unfit to fly — what do you do?',a:'Take it seriously. Emotional distress is the E in IMSAFE. You don\'t need objective evidence — if the student is distracted, emotional, or you have any reason to doubt their mental state, cancel. A brief conversation with the student using non-confrontational questions (How are you feeling today? Anything on your mind?) can reveal the reality. Canceling a lesson for this reason is the right call and a teachable moment.'},
     {q:'What if external pressure (paid vacation trip, passengers waiting) is pushing you toward a go — how do you use PAVE to push back?',a:'External pressures are the P in PAVE. Name the pressure explicitly: \'I\'m feeling pressure to go because of the passengers.\' Then evaluate each P independently as if there were no pressure. If any P is marginal or red, the go/no-go decision should not change because of the external P. The DECIDE model adds structure: Detect the pressure, Estimate the actual risk, Choose based on data not emotion.'},
     {q:'What if you recognize the macho hazardous attitude in yourself mid-flight — what\'s the antidote and how do you apply it right now?',a:'The antidote is \'Taking chances is foolish.\' Saying it aloud or internally is the first step — it breaks the cognitive pattern. Then apply the DECIDE model: step back, reassess the situation objectively, and ask what you would advise another pilot to do. Macho is most dangerous in response to unexpected events — the urge to press on rather than divert or cancel.'}
  ],
  tasks:[
    {id:'GL6-1',text:'IMSAFE checklist — genuine self-assessment',acsRef:'I.H',textRef:'PHAK Ch.17',
     subtasks:['State what IMSAFE stands for: Illness, Medication, Stress, Alcohol, Fatigue, Eating/Emotion','Explain how to honestly apply each element (not just check boxes)','Discuss how stress and fatigue interact and compound decision-making errors','Apply IMSAFE to a realistic scenario involving a student who had a bad day at work','Explain the concept of "get-there-itis" and how it overrides IMSAFE self-assessment']},
    {id:'GL6-2',text:'Hypoxia: types, symptoms, treatment',acsRef:'I.H',textRef:'PHAK Ch.17',
     subtasks:['Name the four types of hypoxia: hypoxic, hypemic, stagnant, histotoxic','State the altitude where supplemental oxygen is required: above 12,500 for 30+ min; above 14,000 always','Describe the insidious symptoms of hypoxia: euphoria, blue lips/fingernails, impaired judgment','Explain why hypoxia is dangerous: impairs the judgment needed to recognize it','Describe treatment: descend and apply 100% oxygen if available']},
    {id:'GL6-3',text:'Hyperventilation vs. hypoxia; spatial disorientation',acsRef:'I.H',textRef:'PHAK Ch.17',
     subtasks:['Describe hyperventilation symptoms: tingling, lightheadedness, visual impairment — similar to hypoxia','Explain the treatment: slow breathing, breathe into paper bag, or talk/sing aloud','Explain why the "paper bag" myth is dangerous for hypoxia vs. hyperventilation — must diagnose correctly','Define spatial disorientation: vestibular illusions when visual references are lost','Describe the leans: vestibular system detects one bank, returns to wings-level, now feels banked the other way','Explain the graveyard spiral and why pilots increase back pressure instead of rolling wings level']},
    {id:'GL6-4',text:'Hazardous attitudes and their antidotes',acsRef:'I.H',textRef:'PHAK Ch.17',
     subtasks:['Name and describe the 5 hazardous attitudes: anti-authority, impulsivity, invulnerability, macho, resignation','State the antidote for each: "Follow the rules / Not so fast / It can happen to me / Taking chances is foolish / I\'m not helpless"','Apply the correct antidote to a scenario for each hazardous attitude type','Discuss which hazardous attitude is most prevalent in student pilots and why','Analyze a real NTSB accident brief and identify the hazardous attitude that contributed']},
    {id:'GL6-5',text:'ADM: PAVE and DECIDE frameworks',acsRef:'I.H',textRef:'PHAK Ch.17',
     subtasks:['State PAVE: Pilot, Aircraft, enVironment, External pressures — describe each element','Apply PAVE to a sample cross-country scenario with one marginal element in each category','State DECIDE: Detect, Estimate, Choose, Identify, Do, Evaluate — describe each step','Apply DECIDE to an in-flight scenario (unexpected weather deterioration)','Explain the 5P SRM check: Plan, Plane, Pilot, Passengers, Programming','Describe when during a flight each P should be updated (departure, en route, arrival, approach)']}
  ]},

GL7:{id:'GL7',type:'ground',stage:2,title:'Aviation Weather',hrs:3.0,
  acsItems:['I.C Weather Information'],
  tolerance:null,
  coaching:'Use real weather products for every class. Pull up today\'s KJQF METAR. The Piedmont afternoon thunderstorms are a genuine local VFR trap. Convective activity builds rapidly from noon onward — discuss these specifically.',
  errors:['Confusing cold vs. warm front weather characteristics','Not knowing thunderstorm avoidance is 20 NM','Underestimating how fast fog forms at KJQF','Not understanding temperature/dew point spread for fog prediction'],
  debrief:['What is the temp/dew point spread rule of thumb for fog formation?','What are the three required ingredients for a thunderstorm?','Flying VFR toward the hills west of KJQF (Blue Ridge foothills) on a summer afternoon — what weather hazard?'],
  scenario:null,
  whatIf:[
     {q:'What if temp and dew point are both 12°C at KJQF at 6am — what do you brief your student before the flight?',a:'A spread of 0°C means the air is saturated — fog is either present or imminent. Check the METAR and look outside. Even if current visibility is acceptable, radiation fog can form rapidly after sunrise warms the air briefly, then cools again. Brief the student on the diversion plan: if visibility drops below 3 SM at any point, you return or divert immediately. Do not plan a solo flight in these conditions.'},
     {q:'What if a SIGMET for severe turbulence is active 30 miles east but your route is west — do you go?',a:'Review the SIGMET boundaries carefully — they cover large areas and may extend closer than 30 miles in practice. SIGMETs apply to all aircraft. If your route has any reasonable chance of encountering the SIGMET area, divert around it or delay. Severe turbulence can cause structural damage and loss of control. No training objective is worth entering a SIGMET area.'},
     {q:'What if you\'re 20 miles from a cell and the tops are building rapidly — what is your minimum lateral distance and why?',a:'20 NM is the minimum distance from any severe thunderstorm. A rapidly building cell is not yet at its maximum hazard — it\'s still developing. Hail can be ejected 20+ NM from the cell. Severe turbulence and embedded cells make radar painting unreliable. Turn around or divert. \'Building rapidly\' means the cell is in its most energetic phase — this is not the time to estimate distance.'},
     {q:'What if your student decoded the winds aloft wrong and planned a 2-hour fuel burn that\'s actually 2.5 hours — how do you catch that?',a:'Always back-calculate: planned fuel × burn rate = planned endurance. Then compare to flight time + 30-minute reserve. A 25% underestimate is a significant planning error and a ground lesson in itself. Teach the student to check winds aloft by comparing planned vs. actual groundspeed in the first 15 minutes of flight and recomputing fuel state en route.'},
     {q:'What if you encounter unexpected icing on a VFR flight — what are your immediate actions and legal exposure?',a:'Immediately turn back or descend to escape the icing conditions — do not continue into known icing without the equipment and certification for it. A non-IFR rated aircraft is almost certainly not certified for icing. Declare an emergency if necessary. Legally, flying VFR into IMC with icing is a §91.9 violation. File an ASRS report after landing.'}
  ],
  tasks:[
    {id:'GL7-1',text:'Atmosphere structure and standard conditions',acsRef:'I.C',textRef:'PHAK Ch.11',
     subtasks:['State ISA standard conditions: 15°C (59°F) at sea level, 29.92 inHg','State standard lapse rate: 2°C per 1,000 ft (dry adiabatic 3°C per 1,000 ft)','Name the atmospheric layers: troposphere, stratosphere, etc. and where weather occurs','Explain dew point and relative humidity and how they relate to cloud formation','Explain temperature/dew point spread: clouds form when spread reaches 2–3°C','State the frost point relationship to dew point and its relevance to carburetor ice']},
    {id:'GL7-2',text:'Air masses and frontal systems',acsRef:'I.C',textRef:'PHAK Ch.12',
     subtasks:['Define air mass and explain how source regions determine their characteristics (cP, cT, mP, mT)','Describe cold front weather: narrow band, heavy precipitation, turbulence, rapid clearing','Describe warm front weather: gradual deterioration, extensive low clouds/fog/drizzle, poor visibility','Describe stationary front: prolonged bad weather, slow-moving or stalled','Identify surface analysis chart symbols for cold, warm, stationary, and occluded fronts','Explain prefrontal squall line and why it can be more dangerous than the front itself']},
    {id:'GL7-3',text:'Thunderstorms: stages, hazards, avoidance',acsRef:'I.C',textRef:'PHAK Ch.12',
     subtasks:['State the three requirements for thunderstorm development: moisture, lifting mechanism, instability','Describe the cumulus stage: updrafts only, building cumulonimbus','Describe the mature stage: updrafts AND downdrafts, most hazardous phase','Describe the dissipating stage: downdrafts dominate, anvil top, still dangerous','List thunderstorm hazards: hail (up to 20 NM from storm), severe turbulence, icing, microburst, lightning','State the minimum avoidance distance: 20 NM from any severe thunderstorm cell','Explain that embedded thunderstorms cannot be seen and must be avoided with onboard WX radar or datalink']},
    {id:'GL7-4',text:'Structural and carburetor icing',acsRef:'I.C',textRef:'PHAK Ch.12',
     subtasks:['Describe clear ice: heavy rain/drizzle, 0 to −10°C, clear, heavy, adheres firmly','Describe rime ice: light/freezing drizzle, −10 to −20°C, opaque, brittle','Describe mixed ice: combination; most dangerous because hardest to remove','State carburetor icing conditions: temperatures 20–70°F, relative humidity above 50%','Describe symptoms of carb ice: unexplained RPM loss (fixed pitch) or manifold pressure drop (constant speed)','Explain proper carb heat application: full on, wait for RPM drop then recovery, then return to cold']},
    {id:'GL7-5',text:'Turbulence, wind shear, and fog types',acsRef:'I.C',textRef:'PHAK Ch.12',
     subtasks:['Describe mechanical turbulence: caused by surface friction and obstacles; strongest near ground','Describe convective turbulence: thermals over heated surfaces; worst in summer afternoons at KJQF','Describe mountain wave turbulence: standing waves on lee side of terrain; extends up to 100,000 ft','Define wind shear: rapid change in wind speed and/or direction over short distance','Explain low-level wind shear (LLWS) hazard on approach: airspeed loss on final = undershoot','Describe radiation fog (most common at KJQF): clear sky, light wind, high humidity, cools to dew point overnight','Describe advection fog (Piedmont area): warm moist Pacific air moves over cool Bay water; valley fog']}
  ]},

GL8:{id:'GL8',type:'ground',stage:2,title:'Aviation Weather Services',hrs:2.5,
  acsItems:['I.C Weather Information'],
  tolerance:null,
  coaching:'Decode real METARs and TAFs together every class — NOT textbook examples. Practice calling 1-800-WX-BRIEF. Focus on Piedmont area scenarios. TAF valid times are Zulu — this always confuses students.',
  errors:['Not understanding TAF valid times are Zulu','Missing VC modifier in METARs','Confusing SIGMET vs AIRMET applicability','Not knowing standard vs. abbreviated vs. outlook briefing differences'],
  debrief:['Decode METAR: KJQF 151755Z 21012KT 10SM FEW040 BKN250 29/21 A2998','Winds aloft 230/22G35 at 3,000 ft — what does this mean for your KJQF departure?','What AIRMET Sierra describes at KJQF today?'],
  scenario:null,
  whatIf:[
     {q:'What if the METAR shows BKN008 and the TAF says VFR by your departure time — how do you reconcile these?',a:'The METAR is current reality; the TAF is a forecast. Forecasts are wrong. Call for an updated standard briefing and check the trend: is the ceiling rising, falling, or holding? A BKN008 ceiling is 800 ft — below VFR minimums in Class D airspace. Do not depart until current conditions (not TAF) are acceptable. Consider delaying and re-checking every 30 minutes.'},
     {q:'What if you call FSS and they say VFR flight not recommended — are you legally prohibited from going?',a:'No — \'VFR not recommended\' is an advisory, not a legal prohibition. You can still go. But the briefer has professional judgment and is providing important information. Document that you received the advisory. If you go anyway and something happens, the \'VFR not recommended\' call will be in the record. The advisory should significantly raise your go/no-go threshold.'},
     {q:'What if there\'s an AIRMET Sierra for your route but the METARs all show 10SM and clear — what\'s going on?',a:'AIRMETs may cover large geographic areas and the conditions may not have arrived yet, may be localized along terrain, or may have been issued based on model forecasts. Get a pilot report (PIREP) for your route. The discrepancy means you need more data, not that you can ignore the AIRMET. Mountain obscuration AIRMETs are common in the Carolinas even when piedmont conditions look fine.'},
     {q:'What if you got an abbreviated briefing instead of a standard one — what information might you be missing?',a:'An abbreviated briefing fills in gaps from a prior standard briefing — it assumes you already have the full picture. If you didn\'t get a standard briefing first, you may be missing: adverse conditions, synopsis, en route forecast details, destination TAF analysis, full NOTAM review, and ATC delays. Always start with a standard briefing and abbreviate for updates only.'},
     {q:'What if you find out after landing that there was a SIGMET active on your route that the briefer didn\'t mention?',a:'First, determine whether the briefer actually missed it or whether it was issued after your briefing. Check the issuance time. If it was active at briefing time, file a complaint with the FSS supervisor and note it in your logbook. If issued after your briefing, it\'s a lesson to monitor inflight weather via 122.0 or ATC. Either way, it\'s a safety system failure worth documenting.'}
  ],
  tasks:[
    {id:'GL8-1',text:'METAR and SPECI decoding',acsRef:'I.C',textRef:'PHAK Ch.13; AIM 7-1',
     subtasks:['Decode the station identifier, date/time (UTC), and modifier (AUTO/COR)','Decode wind: direction (true), speed, gusts, variable wind reporting','Decode visibility: statute miles, RVR, prevailing vs. direction-specific','Decode sky condition: sky cover (FEW/SCT/BKN/OVC) and cloud heights in hundreds of feet','Decode temperature/dew point (Celsius) and altimeter setting','Decode significant RMK section: sea level pressure, precipitation, CIG/VIS modifiers','Identify SPECI criteria: conditions that trigger a special observation']},
    {id:'GL8-2',text:'TAF terminal forecast decoding',acsRef:'I.C',textRef:'PHAK Ch.13',
     subtasks:['State TAF issuance schedule: every 6 hours, covers 24 or 30 hours (major airports)','Decode TAF header: station, issuance time (Zulu), valid period (Zulu)','Decode FM group: indicates a definite change at a specific time','Decode TEMPO: temporary fluctuations lasting less than 1 hour, occurring less than half the period','Decode BECMG: gradual change occurring over 2-hour transition period','Decode PROB30/PROB40: probability groups — 30% or 40% chance of conditions','Convert TAF valid times from Zulu to local Pacific time (UTC−7/8)']},
    {id:'GL8-3',text:'PIREPs, SIGMETs, and AIRMETs',acsRef:'I.C',textRef:'PHAK Ch.13; AIM 7-1',
     subtasks:['Decode a routine PIREP (UA) format: /OV (location), /TM (time), /FL (altitude), /TP (aircraft), /SK (sky), /WX, /TA (temp), /WV (wind), /TB (turbulence), /IC (icing)','Explain urgent PIREP (UUA) and when to file one','Explain SIGMET (WS): significant meteorological info — severe turbulence, icing, ash, tropical cyclones — applies to ALL aircraft','Explain AIRMET Sierra: IFR conditions (ceiling <1,000/3 SM) and/or mountain obscuration','Explain AIRMET Tango: moderate turbulence, strong surface winds','Explain AIRMET Zulu: moderate icing, freezing level information','Identify current AIRMETs and SIGMETs applicable to the KJQF area from today\'s briefing']},
    {id:'GL8-4',text:'Winds aloft forecast and graphical weather products',acsRef:'I.C',textRef:'PHAK Ch.13',
     subtasks:['Decode a winds aloft forecast (FB): direction (true), speed, temperature at each altitude','Identify most favorable altitude for a given route using winds aloft','Explain the 3,000/6,000/9,000 ft winds aloft relationship to terrain along a route from KJQF','Identify surface analysis chart symbols and frontal positions','Explain the prog chart: 12-hour and 24-hour forecast positions, pressure systems, fronts','Explain how to use the graphical AIRMET product (G-AIRMET) to view hazardous areas spatially']},
    {id:'GL8-5',text:'Weather briefing and go/no-go decision',acsRef:'I.C',textRef:'AIM 7-1',
     subtasks:['State the three types of briefings: standard, abbreviated, and outlook — when to use each','Describe what a standard briefing includes in order: adverse conditions, VFR flight not recommended, synopsis, current conditions, en route forecast, destination forecast, winds aloft, NOTAMs, ATC delays','Request a standard briefing by phone (1-800-WX-BRIEF) with correct format: type, departure airport, route, destination, cruise altitude, departure time, ETE','Apply weather information to a sample go/no-go decision with marginal VFR conditions','Explain the legal significance of obtaining a weather briefing (documentation of pilot\'s awareness)']}
  ]},

GL9:{id:'GL9',type:'ground',stage:2,title:'Navigation: Charts, Publications, and Flight Computers',hrs:3.0,
  acsItems:['I.D Cross-Country Flight Planning','VI.D Lost Procedures'],
  tolerance:null,
  coaching:'Plan an actual route using KJQF→KRUQ or KJQF→KGSO. Students must complete a full navlog by hand, then verify with ForeFlight. The E6-B is required knowledge for the written even if GPS is used in flight.',
  errors:['Forgetting to correct for both variation AND deviation','Using TC directly as MH without corrections','Not updating ETA as groundspeed changes in flight','Confusing "to" vs. "from" when computing magnetic course'],
  debrief:['True course 135°, variation 14°E, deviation −2°. What is compass heading?','WCA is 8° right, wind from 270° at 20 kt, heading 045°. Does this make sense?'],
  scenario:null,
  whatIf:[
     {q:'What if your E6-B calculation shows a groundspeed of 180 kt but your GPS shows 95 kt — which do you trust and why?',a:'Trust the GPS for actual groundspeed — it measures Doppler-based ground track. Your E6-B calculation was likely an error: wrong wind entry, wrong TAS, or arithmetic mistake. Recalculate the navlog immediately using the actual groundspeed. A 2× groundspeed error means your fuel burn assumptions are completely wrong — reassess your fuel state and divert if necessary.'},
     {q:'What if you apply variation the wrong way and your magnetic course is 28° off — how far off course are you after 60 NM?',a:'60 NM × sin(28°) ≈ 28 NM off course. That\'s enough to miss any landmark and potentially bust airspace. The TVMDC mnemonic prevents this: True Variation Magnetic Deviation Compass. East variation is subtracted going toward compass, added going toward true. If you suspect an error, cross-check your heading with a known landmark or GPS track.'},
     {q:'What if a NOTAM closes your planned alternate but you didn\'t check NOTAMs — what\'s your exposure?',a:'You\'d have no alternate and potentially be legally non-compliant if IFR. For VFR, a closed airport at your alternate means you need to have enough fuel to reach the next option. This is exactly why NOTAMs are part of every preflight — a runway closure, fuel unavailability, or tower outage at an alternate is critical information. Always check NOTAMs for departure, en route, and alternate airports.'},
     {q:'What if a checkpoint you planned on passes 5 minutes late — what does that tell you about your groundspeed and fuel?',a:'Your groundspeed is less than planned. Use the actual elapsed time and known distance to compute actual groundspeed: GS = distance / actual time × 60. Recalculate the remaining ETE and fuel required. If groundspeed is 10% lower than planned, fuel burn is 10% higher per mile. Update your fuel state estimate and decide whether diverting for fuel is prudent.'},
     {q:'What if the sectional you\'re using expired 4 months ago — what might have changed that affects your flight?',a:'Sectionals update every 6 months. In 4 months: new or altered airspace (temporary restricted areas, airspace reclassifications), new obstructions (towers), closed airports, changed frequencies, or new NOTAMs. For VFR there\'s no explicit prohibition on using an expired chart, but it\'s poor practice. Cross-check critical items with current NOTAMs and the Chart Supplement.'}
  ],
  tasks:[
    {id:'GL9-1',text:'Sectional chart interpretation',acsRef:'I.D',textRef:'PHAK Ch.16',
     subtasks:['Identify sectional chart scale (1:500,000) and measure distances using the mileage scale','Read latitude/longitude grid and identify the coordinates of KJQF','Identify all airport symbols: controlled (blue), uncontrolled (magenta), private, seaplane, helipad','Identify maximum elevation figures (MEF) in each quadrant and explain their significance','Identify Class B, C, D, and E airspace depictions and read the altitude floors/ceilings','Identify NAVAID symbols: VOR, VOR-DME, VORTAC, NDB, and compass roses','Identify chart expiration date and explain consequences of using an out-of-date chart']},
    {id:'GL9-2',text:'Dead reckoning: TC to CH conversion',acsRef:'I.D',textRef:'PHAK Ch.16',
     subtasks:['Define true course (TC): bearing from departure to destination relative to true north','Apply magnetic variation: TC ± variation = magnetic course (E variation subtract, W add — or TVMDC)','Apply magnetic deviation: MC ± deviation = compass heading (from compass correction card)','Define wind correction angle (WCA) and explain how it is incorporated into true heading','Use the E6-B wind side to calculate: given TC, wind, TAS → find TH and GS','Complete TC→TV→TH→MH→CH conversion for a KJQF departure segment']},
    {id:'GL9-3',text:'E6-B flight computer operations',acsRef:'I.D',textRef:'PHAK Ch.16',
     subtasks:['Use the calculator side: solve time-speed-distance problems (T = D/GS × 60)','Use the calculator side: compute fuel burn (fuel = burn rate × time / 60)','Use the calculator side: convert between statute and nautical miles','Use the calculator side: compute TAS from IAS, pressure altitude, and temperature','Use the wind side: enter wind and solve for WCA and groundspeed','Calculate density altitude using the E6-B calculator side']},
    {id:'GL9-4',text:'Chart Supplement, NOTAMs, and publications',acsRef:'I.D',textRef:'AIM; Chart Supplement',
     subtasks:['Use the Chart Supplement to find KJQF: runway data, services, frequencies, IAP note','Find communication frequencies: ATIS, Ground, Tower, Approach, Departure','Identify airport elevation, runway lengths, lighting, and obstructions from Chart Supplement','Explain NOTAM types: Domestic (D), FDC (regulatory), TFR, POINTER, SAA, International','Obtain current NOTAMs for KJQF using 1800WXbrief or ForeFlight before a sample flight','Explain how to interpret a runway NOTAM (e.g., RWY 20 CLSD for maintenance)']},
    {id:'GL9-5',text:'Cross-country navlog preparation',acsRef:'I.D',textRef:'PHAK Ch.16',
     subtasks:['Select appropriate checkpoints along the route: distinctive, identifiable, well-spaced (15–20 NM)','Plot and measure each leg: true course and distance from chart','Complete the full TC→CH conversion for each leg accounting for wind','Calculate estimated groundspeed and ETE for each leg','Calculate fuel required for each leg plus reserve','Compile the completed navlog and prepare the flight plan form for KJQF→KRUQ']}
  ]},

GL10:{id:'GL10',type:'ground',stage:2,title:'Navigation Systems',hrs:2.5,
  acsItems:['VI.B Navigation Systems','I.G Operation of Systems'],
  tolerance:null,
  coaching:'Spend time on CDI interpretation — students consistently misread "fly toward the needle," especially TO vs. FROM. Use actual avionics in the training aircraft.',
  errors:['Flying away from CDI needle (common reversal error)','Not identifying VOR with morse code','Forgetting GPS RAIM must be confirmed before IFR use'],
  debrief:['CDI deflects full right, TO indication — which way do you turn to intercept?','How do you determine if you\'re on the correct radial vs. the reciprocal?'],
  scenario:null,
  whatIf:[
     {q:'What if the CDI shows a full-scale deflection TO with the OBS set to 360 — where are you relative to the VOR?',a:'A full-scale deflection with TO flag means you are 10° or more off the selected course. With OBS 360 (north radial inbound), a right deflection means you\'re east of the 360 radial and need to fly left to intercept. The TO flag confirms you\'re heading toward the station. Remember: fly toward the needle when heading toward the station (TO flag).'},
     {q:'What if the GPS database is 35 days old and you\'re flying VFR — is that a problem?',a:'For VFR navigation only, a 35-day-old database is legal — the 28-day requirement applies to IFR approaches. However, the database may have outdated frequencies, airspace boundaries, or airport information. Use it for situational awareness and cross-check critical items with current charts. For any IFR operation, an expired database is not legal for approaches.'},
     {q:'What if you\'re tracking a VOR radial and the TO/FROM flag suddenly flips — what happened?',a:'You passed the station. The flag flip at station passage is a normal indication — now you\'re on the FROM side. If you\'re tracking inbound, immediately reset the OBS to the outbound course and continue tracking. If tracking the 180° radial inbound, after passage set OBS to 180 and track outbound. The CDI deflection meaning reverses after station passage.'},
     {q:'What if the autopilot disconnects in IMC at 500 ft AGL on approach — what\'s your immediate priority?',a:'Take the controls immediately and maintain aircraft control — attitude first, then altitude, then navigate. At 500 ft AGL on an approach, you are close to the ground and any deviation is serious. Fly the approach manually, call out your actions if crew coordination applies, and execute the missed approach if not stabilized. Autopilot failures demand immediate manual takeover without hesitation.'},
     {q:'What if Charlotte Approach gives you traffic at 2 o\'clock, 5 miles, same altitude and you can\'t find it — what do you do?',a:'Acknowledge the traffic call (\'Looking\'), continue scanning aggressively, and ask Approach for an update if it\'s a factor. If still not in sight as the separation closes, tell Approach \'Traffic not in sight\' and ask if a turn is required. ATC may issue an avoidance vector. Never assume the traffic has moved away — if you can\'t see it, treat it as a threat.'}
  ],
  tasks:[
    {id:'GL10-1',text:'VOR navigation: tuning, identification, CDI interpretation',acsRef:'VI.B',textRef:'PHAK Ch.16',
     subtasks:['Tune a VOR frequency and verify the morse code identifier before use','Set the OBS to the desired course and read the CDI and TO/FROM flag','Interpret a CDI deflection: each dot ≈ 2° off course; 5 dots = 10° off','Apply the "fly toward the needle" rule and explain why it only works with a TO indication','Demonstrate VOR orientation: determine which radial you are on from a given CDI/OBS setting','Track a VOR radial inbound and outbound, making bracketing corrections']},
    {id:'GL10-2',text:'VOR position fix and accuracy check',acsRef:'VI.B',textRef:'14 CFR §91.171',
     subtasks:['Determine aircraft position using two VOR radials (cross-radial fix)','Explain the VOR receiver accuracy check requirement: within 30 days for IFR','Describe VOT check: tune 108.0 MHz, OBS to 180° = centered/FROM, 360° = centered/TO, ±4°','Describe airborne check: over known checkpoint, set OBS to match airway/radial, within ±6°','Log a VOR check: date, place, bearing error, and signature','Explain why VOR checks are NOT required for VFR operations']},
    {id:'GL10-3',text:'GPS navigation: direct-to, flight plan, RAIM',acsRef:'VI.B',textRef:'PHAK Ch.16',
     subtasks:['Enter a direct-to waypoint in the training aircraft\'s GPS and verify CDI coupling','Enter a multi-waypoint flight plan and sequence through waypoints','Interpret GPS CDI deflection scale and understand it may differ from VOR scale','Explain RAIM: Receiver Autonomous Integrity Monitoring — required for IFR GPS approaches','Explain database currency: must be within 28-day cycle for IFR approaches','Describe GPS NOTAM requirement before IFR flight using GPS approach']},
    {id:'GL10-4',text:'Autopilot and flight director operations',acsRef:'I.G',textRef:'POH §7',
     subtasks:['Identify autopilot modes available in training aircraft: HDG, NAV, ALT, VS','Engage and disengage autopilot and understand the disconnect alert','Explain the requirement to monitor autopilot closely — it can fail or mis-track','Describe flight director operation and how to follow the command bars','State POH limitations on autopilot use: minimum engagement altitude, turbulence','Explain automation bias risk and the importance of maintaining manual flying skills']}
  ]},

GL11:{id:'GL11',type:'ground',stage:2,title:'Cross-Country Flight Planning',hrs:2.5,
  acsItems:['I.C Weather Information','I.D Cross-Country Flight Planning','VI.C Diversion'],
  tolerance:null,
  coaching:'This lesson should result in the actual flight plan used for FL17. The planning is not academic — it must be real. Common route: KJQF→KGSO→KFAY→KJQF (~240 NM triangle).',
  errors:['Not closing VFR flight plan after landing','Under-fueling by not including VFR reserve','Requesting abbreviated briefing when they need standard','Planning diversion without accounting for revised fuel state'],
  debrief:['You arrive at destination but weather is now below VFR — what are your options?','How long after your filed ETA does SAR begin if you don\'t close your flight plan?','You\'re 45 NM from destination and fuel is lower than planned — what do you do?'],
  scenario:null,
  whatIf:[
     {q:'What if your navlog shows exactly 45 minutes of fuel reserve but winds are 20 kt stronger than forecast — do you continue?',a:'Stop and recalculate. A 20 kt headwind increase at cruise altitude can reduce groundspeed by 20 kt, increasing flight time and fuel burn significantly. Recompute ETE with actual groundspeed and verify the reserve is still sufficient. If the revised reserve drops below 30 minutes (day VFR) or 45 minutes (night VFR), divert for fuel — do not push on with inadequate reserves.'},
     {q:'What if you arrive at your destination and weather has gone below VFR minimums — walk me through your decision tree.',a:'First: do not descend into IMC. Assess fuel state. If sufficient, divert to your filed alternate or the nearest airport with acceptable weather — you planned this in GL11. If fuel is marginal, declare minimum fuel (not an emergency yet, but ATC will prioritize you). If a VFR arrival is truly impossible and fuel is critical, declare an emergency. Never continue toward an airport you can\'t see.'},
     {q:'What if you forget to close your VFR flight plan and land safely — what happens next and at what time?',a:'FSS begins overdue inquiries 30 minutes after your ETA. If you don\'t respond, they escalate through contacts and eventually activate Search and Rescue (typically 1 hour after ETA). SAR is expensive and dangerous for the crews. Always close your flight plan immediately after landing, even before tying down the aircraft. If you forget and realize later, call FSS immediately.'},
     {q:'What if you\'re 30 NM from your destination, fuel is lower than planned, and weather is deteriorating — what\'s your exact decision framework?',a:'Two threats simultaneously — fuel and weather — makes this urgent. First: calculate actual fuel state and minimum divert fuel needed. Second: identify the nearest suitable airport regardless of original destination. Third: declare minimum fuel if appropriate and request priority handling. The original destination is no longer the goal — getting the airplane and occupants on the ground safely is. Divert now.'},
     {q:'What if your filed route takes you through a MOA that just became active — what are your options?',a:'Call the controlling agency (listed in the Chart Supplement) and ask for VFR transition. They can often clear you through or give you a recommended route. Alternatively, divert around the MOA — add the extra miles to your fuel calculation. You are not prohibited from flying through an active MOA VFR, but you should know the activity type and make an informed decision about the risk.'}
  ],
  tasks:[
    {id:'GL11-1',text:'Complete cross-country flight plan for FL17',acsRef:'I.D',textRef:'PHAK Ch.16',
     subtasks:['Select route: KJQF→KGSO→KFAY→KJQF; plot and measure each leg on sectional','Complete full navlog: TC, wind correction, TH, MH, CH, distance, GS, ETE, fuel for each leg','Compute total fuel required including VFR day 30-minute reserve','Verify aircraft W&B for planned fuel load and occupants — confirm within limits','Check for airspace along the route: any Class B shelves, MOAs, or special-use airspace','Complete FAA Form 7233-1 VFR flight plan for the first leg']},
    {id:'GL11-2',text:'Standard weather briefing for planned XC',acsRef:'I.C',textRef:'AIM 7-1',
     subtasks:['Obtain a full standard weather briefing by phone or online for the KJQF→KGSO→KFAY route','Decode current METARs for departure, intermediate, and destination airports','Decode TAFs for each airport — identify any TEMPO or BECMG groups that affect the trip','Check winds aloft for the planned cruise altitude: select best altitude for wind and terrain','Check for SIGMETs and AIRMETs along the route: Sierra, Tango, Zulu applicability','Make a documented go/no-go decision based on weather analysis']},
    {id:'GL11-3',text:'VFR flight plan filing and SAR procedures',acsRef:'I.D',textRef:'AIM 5-1',
     subtasks:['File a VFR flight plan with Leidos/1800WXbrief for the planned route','Explain the correct procedure to activate the flight plan after takeoff (call FSS or through radio)','State the search and rescue timeline: FSS begins inquiries 30 min after ETA; SAR activation at 1 hr overdue','Explain the correct procedure to close the flight plan after landing (phone or radio)','Describe the consequences of not closing a flight plan: full SAR activation, embarrassment, waste of resources']},
    {id:'GL11-4',text:'Diversion planning and lost procedure',acsRef:'VI.C,VI.D',textRef:'PHAK Ch.16',
     subtasks:['Explain the diversion technique: select alternate on sectional, estimate heading using top-of-chart true north, estimate distance','Use E6-B or mental math to estimate new ETE and fuel remaining at alternate','Describe the 5 Cs lost procedure: Climb (better reception/visibility), Circle (maintain position), Confess (call ATC/FSS), Communicate (squawk 7700, call guard 121.5), Comply (follow ATC instructions)','Practice a diversion scenario: given current position and an instructor-selected alternate, compute heading and ETA in under 2 minutes','Identify the nearest airport to KJQF in each cardinal direction for emergency diversion use']}
  ]}
};

// ─── FLIGHT SYLLABUS DATA WITH SUBTASKS ──────────────────────────────
const FL = {
FL1:{id:'FL1',type:'flight',stage:1,title:'Introduction to Flight',
  hrs:{dual:1.0,solo:0,instrument:0,night:0},
  acsItems:['II.A Preflight Assessment','II.B Flight Deck Management','IV.A Normal Takeoff','XI.A Postflight'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'Demonstrated'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'You\'re visiting Charlotte Aviation for the first time to see if flying is for you. The CFI introduces you to the airplane — you\'ll discover what controlled flight feels like.',
  whatIf:[
     {q:'What if the student freezes on the controls and won\'t let go during a maneuver — how do you take control?',a:'Use the standard positive exchange: \'I have the controls\' stated clearly. If the student doesn\'t respond, physically take the controls and simultaneously say \'I have the controls\' a second time. After the situation is stabilized, debrief calmly — freezing is a startle response, not defiance. Explain the transfer protocol and practice it explicitly before the next flight.'},
     {q:'What if the student feels sick halfway through the first flight — what do you do?',a:'Return to KJQF immediately. Airsickness is common on early flights and is not a predictor of long-term outcome. Keep altitude and bank angle moderate on the return. Have the student focus on a fixed point on the horizon, not the instruments. After landing, normalize it: many pilots got sick on early flights. Reschedule in 3–5 days; consider shorter initial lessons with less maneuvering.'},
     {q:'What if the tower issues a sequence you\'ve never briefed the student on — how do you handle the radio?',a:'You handle the radio and manage ATC — the student\'s job on lesson 1 is to feel the controls and observe. Brief this before engine start: \'If ATC says something unexpected, I\'ll handle it.\' The student learning radios comes in FL2 — don\'t overload them on lesson 1. Fly the airplane first, teach radio procedures second.'},
     {q:'What if the student overcorrects and puts the aircraft in a 60° bank — what\'s your response as CFI?',a:'Take the controls immediately and smoothly if the situation is unsafe. If it\'s recoverable and not a safety of flight issue, coach: \'Gentle pressure, let\'s come back to level.\' The teachable moment is more valuable than taking over. After recovery, explain: small inputs, feel the response, then the next input. Don\'t let overcorrection become a pattern without addressing it.'},
     {q:'What if the first lesson goes perfectly but the student says they hated it and want to quit — how do you respond?',a:'Respect their honesty and don\'t push. Ask what specifically felt bad — the motion, the noise, the loss of control feeling? Some students need more time to develop comfort. Offer one more lesson focused only on what they enjoyed (straight and level, views from altitude) before deciding. But if they genuinely want to stop, that\'s a valid choice. Flying is not for everyone and that\'s okay.'}
  ],
  coaching:'Keep this fun and confidence-building. The student has never done this before — they will be overwhelmed. Share controls lightly. Focus on big-picture: "see how the nose relates to the horizon." End on a high note.',
  errors:['Overcorrecting — tense on controls','Fixating inside cockpit instead of outside','Expecting the airplane to hold position without input'],
  debrief:['What surprised you most about actually flying?','Which control input felt most natural?','What do you want to practice first next time?'],
  tasks:[
    {id:'FL1-1',text:'Preflight inspection',acsRef:'II.A',textRef:'AFH Ch.2; POH §4',
     subtasks:['Completes preflight using POH checklist without skipping items','Verifies all ARROW documents are present and current','Checks fuel quantity visually AND with dipstick; checks for water in sump samples','Checks oil to correct level; identifies correct grade and acceptable range','Inspects flight control surfaces for full range of motion and no damage','Checks tires, brakes, and landing gear for condition']},
    {id:'FL1-2',text:'Engine start and taxi',acsRef:'II.C,II.D',textRef:'AFH Ch.2; POH §4',
     subtasks:['Completes engine start checklist in correct sequence','Demonstrates proper brake control during taxi','Maintains correct taxi speed (slow walking pace on ramp; brisk walking on taxiway)','Positions flight controls correctly for wind conditions during taxi','Performs runup checks in correct sequence per POH','Holds short of runway — confirms clearance before any runway crossing']},
    {id:'FL1-3',text:'Normal takeoff and initial climb',acsRef:'IV.A',textRef:'AFH Ch.5; POH §4',
     subtasks:['Completes before-takeoff checklist; obtains tower clearance','Aligns on centerline; smoothly applies full power','Tracks centerline during takeoff roll with rudder','Rotates at Vr; establishes Vy climb attitude','Maintains wings level in initial climb; clears traffic pattern correctly','Does not fixate on instruments during initial climb']},
    {id:'FL1-4',text:'Four fundamentals with instructor assistance',acsRef:'App.C',textRef:'AFH Ch.3',
     subtasks:['Demonstrates straight-and-level flight: pitch + power + trim','Demonstrates medium banked turns (20–30°) both directions','Demonstrates climbs at Vy: correct attitude, power, trim','Demonstrates descents at cruise power: correct attitude, trim']},
    {id:'FL1-5',text:'Normal approach and landing (instructor-assisted)',acsRef:'IV.B',textRef:'AFH Ch.8; POH §4',
     subtasks:['Configures aircraft on downwind: speed, flaps, power reduction sequence','Establishes and maintains approach attitude and airspeed on final','Completes before-landing checklist','Instructor lands or assists through flare as appropriate for lesson 1','Completes after-landing checklist and taxi to parking']},
    {id:'FL1-6',text:'After-landing, parking and securing',acsRef:'XII.A',textRef:'AFH Ch.2; POH §4',
     subtasks:['Completes after-landing checklist in sequence','Taxis to correct parking area per ground control instructions','Completes engine shutdown checklist','Completes parking/securing checklist: chocks, tie-downs, control lock, hobbs entry']}
  ]},

FL2:{id:'FL2',type:'flight',stage:1,title:'Four Fundamentals of Flight',
  hrs:{dual:1.0,solo:0,instrument:0,night:0},
  acsItems:['III.A Communications','III.B Traffic Patterns','II.B Flight Deck Management'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±20 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Flying to the practice area east of KJQF, you handle all radio calls from startup. The CFI coaches but you transmit.',
  whatIf:[
     {q:'What if the student skids every turn — what\'s the root cause and your teaching fix?',a:'Skidding (outside of coordinated flight) means not enough rudder with aileron input, or delayed rudder. Root cause is usually fixating on aileron and forgetting the rudder. Teaching fix: have the student press lightly on the ball first, then add aileron. The call is \'step on the ball\' — if the ball goes left, push left rudder. Practice clearing turns with exaggerated rudder to build the habit.'},
     {q:'What if KJQF tower tells you to extend downwind for spacing and the student has never heard that — who flies?',a:'You fly (or take the radio) and acknowledge the instruction. Extended downwind changes the timing of every subsequent call and adjustment — the student isn\'t ready to manage that deviation and fly simultaneously. Use it as a learning moment: brief the student afterward on what happened and why. Pattern management under ATC is a FL2–FL3 skill, not FL1.'},
     {q:'What if the student is flying straight and level perfectly but only by gripping the yoke hard — what\'s the problem?',a:'Muscle tension instead of trim is a fundamental technique error that compounds over time — it fatigues the student, masks control feedback, and makes transitions to other aircraft harder. Stop the lesson briefly: \'Loosen your grip. Now use the trim wheel until you feel zero pressure.\' Demonstrate hands-off flight. The ability to release the controls and have the aircraft hold altitude is the benchmark for proper trim.'},
     {q:'What if you\'re on downwind and spot traffic at your altitude on a collision course — what\'s your call?',a:'Traffic avoidance first — take the controls if needed, turn to avoid (right-of-way rules aside, avoid the collision). Radio KJQF Tower immediately: \'KJQF Tower, [callsign], traffic conflict, turning [direction]\'. After separation, resume normal pattern flow with ATC coordination. Debrief the student on traffic scanning and the see-and-avoid responsibility.'},
     {q:'What if the student rolls out 30° past the target heading every time — what\'s the cure?',a:'They\'re not anticipating the rollout lead — banks require lead equal to roughly half the bank angle. Teach the rule: for a 30° bank, begin rollout 15° before the target heading. Have the student call out the target heading as they enter the turn, then call out the rollout point. Visual cue training: find a landmark on the ground at the rollout heading and roll toward it.'}
  ],
  coaching:'Correct bad habits NOW — especially crossed controls and not using trim. A student who relies on muscle tension instead of trim will struggle for months. Emphasis on outside reference.',
  errors:['Using elevator instead of trim to hold altitude','Skidding turns (check the ball)','Fixating on altimeter instead of attitude','Not rolling out on target heading'],
  debrief:['Why did the nose drop when you rolled into the bank?','How do you know your turns are coordinated?','What does "trimmed" feel like?'],
  tasks:[
    {id:'FL2-1',text:'Radio communications',acsRef:'III.A',textRef:'AFH Ch.2; AIM Ch.4',
     subtasks:['Obtains KJQF ATIS: reads back information code correctly','Calls KJQF Ground with correct format: callsign, aircraft type, location, request, information','Reads back all taxi and runway assignments correctly','Calls KJQF Tower with correct initial contact: position and intentions','Reads back all clearances including any conditional clearances','Demonstrates correct CTAF procedure when practice area UNICOM is used']},
    {id:'FL2-2',text:'Traffic pattern procedures',acsRef:'III.B',textRef:'AFH Ch.7',
     subtasks:['Identifies all five traffic pattern legs by name: upwind, crosswind, downwind, base, final','Maintains pattern altitude ±100 ft on downwind','Begins descent/base turn at correct abeam point','Rolls out on final aligned with runway centerline','Calls all position reports at correct pattern points: downwind, base, final']},
    {id:'FL2-3',text:'Straight-and-level flight with trim',acsRef:'App.C',textRef:'AFH Ch.3',
     subtasks:['Establishes cruise power setting and desired altitude','Trims aircraft for hands-off level flight at cruise speed','Demonstrates that aircraft holds altitude without constant control pressure','Maintains altitude ±200 ft for at least 2 minutes without prompting','Makes coordinated course corrections using aileron + rudder together']},
    {id:'FL2-4',text:'Climbs and descents',acsRef:'App.C',textRef:'AFH Ch.3',
     subtasks:['Establishes Vy climb: correct pitch attitude, full power, carb heat off, trim','Levels off from climb: lead level-off by 10% of climb rate','Establishes cruise descent: power reduction, pitch attitude, trim','Levels off from descent at target altitude ±200 ft','Demonstrates power-off glide at best glide speed and explains when it\'s used']},
    {id:'FL2-5',text:'Coordinated turns to headings',acsRef:'App.C',textRef:'AFH Ch.3',
     subtasks:['Enters turn with coordinated aileron and rudder (ball centered)','Maintains 30° bank ±5° throughout the turn','Maintains altitude ±200 ft in the turn','Begins rollout to anticipate desired heading by ½ the bank angle','Rolls out on heading ±20°','Demonstrates both left and right turns to instructor-called headings']}
  ]},

FL3:{id:'FL3',type:'flight',stage:1,title:'Basic Instrument Maneuvers',
  hrs:{dual:1.5,solo:0,instrument:0.5,night:0},
  acsItems:['VIII.A Straight-and-Level (IR)','VIII.B Climbs (IR)','VIII.C Descents (IR)','VIII.D Turns to Headings (IR)'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±20 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Flying back from the practice area, haze thickens. No horizon visible. You must navigate home using instruments only.',
  whatIf:[
     {q:'What if the student inadvertently enters actual IMC on this lesson — what are your immediate actions?',a:'Take the controls immediately. Execute a 180° standard-rate turn to exit IMC — the fastest way out of inadvertent IMC. Declare emergency on current frequency. As you turn, climb or descend to known obstacle clearance altitude. Do not attempt VFR into IMC procedures with a student — this is an emergency and you fly it. After VMC is restored, debrief thoroughly.'},
     {q:'What if under the hood the student begins a graveyard spiral and doesn\'t notice — when do you intervene?',a:'Intervene as soon as airspeed begins increasing and altitude is decreasing with increasing bank — those are the signature parameters. Don\'t wait for a full spiral to develop. Say \'I have the controls\' and demonstrate the correct recovery: power off, wings level, then gently pull. If you wait for \'dramatic\' deviation, you\'ve waited too long. Teach the intervention threshold, not the limit.'},
     {q:'What if the student\'s instrument scan locks onto the altimeter and ignores the AI — what\'s your coaching technique?',a:'Cover the altimeter with your hand and say \'Fly the AI.\' The student must learn that the AI is the control instrument — everything else is a performance instrument that confirms what the AI is doing. Fixation on one instrument is broken by physically blocking it. After a few minutes, uncover it and point out how the altitude held when the AI was used correctly.'},
     {q:'What if the vacuum pump fails while the student is under the hood — what do you tell them to do right now?',a:'Tell the student to remove the hood immediately — this is now an actual partial-panel situation. Do not continue the exercise. Brief them on which instruments they\'ve lost (AI and HI) and which they\'ve kept. If VMC, use visual references to fly back to KJQF. If not in VMC, declare emergency and get vectors. Partial-panel training is valuable but this is not the time for it.'},
     {q:'What if the student recovers from a nose-low UA by pulling before rolling wings level — what happens and why do you correct it?',a:'Pulling before wings level in a nose-low spiral increases the load factor and airspeed simultaneously — structural failure and accelerated spiral is the result. The correct sequence is ALWAYS: power off, WINGS LEVEL, THEN pull. Drill this sequence verbally before every UA exercise: \'Power, wings, then pull.\' It must be an automatic habit because the wrong instinct (pull first) is strong.'}
  ],
  coaching:'This is a safety lesson above all else. Drill the scan pattern. The student must learn to trust instruments over body sensations. Log the 0.5 IR time.',
  errors:['Trusting body sensations over instruments','Fixating on one instrument instead of scanning','Making large over-corrections','Not trimming before going under the hood'],
  debrief:['You accidentally enter clouds on a VFR flight — what are your immediate actions?','How often should you check the magnetic compass vs. heading indicator?','What is the graveyard spiral and how does it develop?'],
  tasks:[
    {id:'FL3-1',text:'Instrument scan pattern establishment',acsRef:'VIII.A',textRef:'AFH Ch.9',
     subtasks:['Demonstrates proper primary and supporting instrument scan before going under hood','Explains the control-performance concept: control instruments set attitude, performance instruments verify','Trims aircraft for hands-free flight before donning view-limiting device','Demonstrates the basic "T" scan: AI center, then scan ASI/ALT/VSI/DI/TC','Does not fixate on any single instrument for more than 2–3 seconds']},
    {id:'FL3-2',text:'Straight-and-level flight (instrument reference)',acsRef:'VIII.A',textRef:'AFH Ch.9',
     subtasks:['Maintains altitude ±200 ft using AI + altimeter cross-check','Maintains heading ±20° using AI + heading indicator','Maintains airspeed ±20 kt using AI + ASI','Makes smooth, coordinated corrections (ball centered at all times under hood)','Trims to minimize control force under hood']},
    {id:'FL3-3',text:'Constant airspeed climbs and descents (IR)',acsRef:'VIII.B,VIII.C',textRef:'AFH Ch.9',
     subtasks:['Establishes climb attitude on AI; sets climb power; trims','Maintains climb airspeed ±20 kt using AI + ASI cross-check','Levels off from climb within ±100 ft of assigned altitude (lead by 10% climb rate)','Establishes descent attitude and power; maintains descent airspeed ±20 kt','Levels off from descent within ±100 ft of assigned altitude','Demonstrates smooth transition between climbs and level flight under the hood']},
    {id:'FL3-4',text:'Turns to headings (instrument reference)',acsRef:'VIII.D',textRef:'AFH Ch.9',
     subtasks:['Establishes standard rate turn (3°/sec) using turn coordinator','Maintains altitude ±200 ft during turns under hood','Rolls out on assigned heading ±20°','Makes standard rate turns without exceeding ±200 ft altitude deviation','Demonstrates both left and right turns to instructor-called headings under hood']}
  ]},

FL4:{id:'FL4',type:'flight',stage:1,title:'Slow Flight and Stalls',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['VII.A Slow Flight','VII.B Power-Off Stalls','VII.C Power-On Stalls','VII.D Spin Awareness'],
  tolerance:{alt:'±250 ft',hdg:'±20°',spd:'±20 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Practicing airwork over the open fields east of KJQF. ATC asks you to reduce speed for traffic. You slow to minimum controllable airspeed, then practice recognizing the limits of the flight envelope.',
  whatIf:[
     {q:'What if the student yanks back to recover and causes a secondary stall — how do you break that habit?',a:'The fix is teaching AOA management, not elevator management. At the break, the recovery is \'push to reduce AOA\' — not \'level the nose.\' If the student yanks back, they\'re reacting to the nose drop, not understanding the cause. Have them say aloud: \'Reduce AOA\' at the break rather than \'pull up.\' Practice slow, deliberate recoveries with minimal altitude loss — rushing is the cause of secondary stalls.'},
     {q:'What if a student enters a power-on stall and the nose yaws hard left — what happens next if uncorrected?',a:'Uncorrected left yaw in a power-on stall leads to incipient spin entry — the low (left) wing stalls more deeply and the nose rotates. Recovery at incipient requires aggressive right rudder to stop the yaw, then forward elevator to reduce AOA. Drill the habit: right rudder at the break of every power-on stall. This is why §61.87 requires stall training before solo.'},
     {q:'What if you\'re at 3,500 ft AGL and the student accidentally stalls in a 45° bank turn — what\'s the correct recovery?',a:'Roll wings level first while simultaneously reducing AOA (forward elevator pressure). The bank is causing the elevated stall speed — reducing bank reduces load factor and lowers the stall speed. Then add power and climb away. This is the turning power-off stall exercise. If altitude is above 1,500 AGL you have room to recover cleanly; below that, take the controls.'},
     {q:'What if a student says they\'re not afraid of stalls but tenses up and closes their eyes at the break — what do you proceed?',a:'Acknowledge it without judgment: \'That\'s a normal startle response — it doesn\'t mean anything is wrong.\' Reduce the intensity: approach the stall more slowly, announce \'here comes the buffet... and the break\' so there\'s no surprise. Have the student keep their hand light on the yoke at the break. Desensitization through repetition — 10 stalls reduces anxiety more than any verbal reassurance.'},
     {q:'What if the entry altitude for stalls is too low and you realize it mid-maneuver — what\'s your minimum recovery altitude abort point?',a:'The ACS calls for recovering by 1,500 ft AGL. Your abort trigger as CFI should be at 2,000 ft AGL — if you\'re below that altitude before the stall occurs, take the controls and level off. Brief this before every stall exercise: \'If we\'re below 2,000 ft when I call for the maneuver, I\'ll say abort and we\'ll climb back up.\' Altitude awareness is a discipline, not an afterthought.'}
  ],
  coaching:'Build confidence through gradual exposure. AOA concept is critical. Watch for tendency to yank back during recovery (secondary stall). Clearing turns are MANDATORY before every stall.',
  errors:['Using power to recover BEFORE reducing AOA','Pushing too aggressively to negative G','Not coordinating through recovery (spin risk)','Letting nose yaw during power-on stall recovery'],
  debrief:['What is the FIRST action at stall break?','Can the airplane stall at cruise airspeed? Explain how.','Why must you coordinate through stall recovery?'],
  tasks:[
    {id:'FL4-1',text:'Maneuvering during slow flight',acsRef:'VII.A',textRef:'AFH Ch.4',
     subtasks:['Performs clearing turns before entry','Establishes slow flight: decelerates to Vs0+5–10 kt, maintains altitude ±100 ft','Demonstrates all aircraft controls remain responsive at slow flight speed','Performs coordinated turns, climbs, and descents in slow flight','Recognizes and describes all physiological and instrument stall warning cues','Returns to cruise flight using correct power-then-pitch sequence']},
    {id:'FL4-2',text:'Power-off stalls',acsRef:'VII.B',textRef:'AFH Ch.4',
     subtasks:['Performs clearing turns; configures to approach configuration','Decelerates smoothly to simulate approach situation','Recovers at FIRST indication of stall: reduces AOA, adds full power, retracts flaps in stages','Maintains directional control during recovery (ball centered, heading ±20°)','Demonstrates no secondary stall — smooth recovery, not aggressive pull','Achieves minimum altitude loss consistent with stall recovery']},
    {id:'FL4-3',text:'Power-on stalls',acsRef:'VII.C',textRef:'AFH Ch.4',
     subtasks:['Establishes takeoff/departure configuration; sets climb power','Pitches to departure attitude and holds until stall occurs','Maintains directional control with rudder throughout — no uncorrected yaw','Recovers: reduces AOA, full power already set, retracts flaps per schedule','Demonstrates turning power-on stall (15–20° bank) with correct recovery','Does not allow nose to rotate below horizon before recovery is complete']},
    {id:'FL4-4',text:'Spin awareness',acsRef:'VII.D',textRef:'AFH Ch.4; POH §3',
     subtasks:['States the three entry conditions for a spin: stall + yaw + continuation','Describes the four spin phases: incipient, developed, flat spin, recovery','States POH spin recovery: PARE — Power off, Ailerons neutral, Rudder opposite, Elevator forward','Explains why opposite rudder must precede forward elevator in spin recovery','Identifies why turns in the traffic pattern are most common spin accident location','Demonstrates recognition of imminent spin entry conditions and immediate recovery']}
  ]},

FL5:{id:'FL5',type:'flight',stage:1,title:'Emergency Operations',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['IX.A Emergency Descent','IX.B Emergency Approach and Landing','IX.C Systems Malfunctions','IX.D Emergency Equipment'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±15 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Departing KJQF northbound, the engine begins running rough and loses power. Select a field, set up for a forced landing, execute emergency procedures — all while maintaining aircraft control.',
  whatIf:[
     {q:'What if the engine quits at 300 ft AGL on departure from KJQF — what field or road do you target right now?',a:'Below 300 ft AGL there is no time to turn back — the \'impossible turn\' at this altitude at typical climb speed will kill you. Land straight ahead or with a slight heading change to avoid obstacles. KJQF has farm fields and open areas to the departure end of each runway — brief these before every takeoff. The answer must be pre-briefed and automatic. Slow to best glide instantly.'},
     {q:'What if the student freezes when you pull the throttle — how many seconds before you take over?',a:'If the aircraft\'s nose is not pitching to best glide attitude within 2–3 seconds, take the controls. Freezing during a simulated engine failure is a training failure — it means the student hasn\'t internalized the response. Debrief it non-punitively, drill the response verbally on the ground (\'throttle to idle, best glide, ABCDE\'), then retry. Never let a frozen student fly toward terrain.'},
     {q:'What if the student selects a great field but approaches too high and too fast — do you continue the simulated forced landing?',a:'Abort at 500 ft AGL if not on a realistic approach to the field. A good field selection with poor energy management teaches the wrong habit — that field selection is success. It isn\'t. The complete skill is: correct field, correct altitude key, correct energy management, correct approach angle. Below 500 ft AGL abort the simulated approach and go around to try again.'},
     {q:'What if smoke enters the cockpit on downwind — walk through your exact immediate action sequence.',a:'Declare emergency on tower frequency. Close vents and shut off the heater/defroster to reduce airflow to the fire source. Don oxygen if available. If electrical fire suspected: MASTER OFF to kill the electrical system. If engine fire: mixture idle cutoff, fuel OFF, throttle closed. Land immediately on any suitable surface — not necessarily the runway. Do not attempt to troubleshoot a fire in the air.'},
     {q:'What if the ELT activates accidentally on the ground — what\'s your procedure to prevent an unnecessary SAR response?',a:'Turn the ELT off immediately using its manual switch (typically in the aft cabin or mounted on the avionics stack). Call KJQF tower to notify them, then contact Charlotte Approach on 121.5 or call the appropriate FSS. If 406 MHz, the signal may already have been received by satellite — call the AFRCC (1-800-851-3051) to prevent SAR activation. Document the incident and have the ELT inspected.'}
  ],
  coaching:'Drill ABCDE until it is automatic and calm. Best glide is the most important number the student knows. Never go below 500 AGL during practice simulated forced landings.',
  errors:['Pitching up instead of establishing best glide immediately','Selecting a field too far away','Not squawking 7700 in the scenario','Forgetting to brief the passenger in the scenario'],
  debrief:['You\'re at 2,800 ft AGL when the engine quits — what is your immediate first action?','How do you judge where to aim on final without engine power?','What does squawk 7700 do for you?'],
  tasks:[
    {id:'FL5-1',text:'Emergency descent procedure',acsRef:'IX.A',textRef:'AFH Ch.17; POH §3',
     subtasks:['Recognizes simulated engine failure at altitude: identifies symptoms (RPM loss, rough running)','Immediately establishes best glide speed from POH — does NOT pitch up','Selects best available landing area within gliding distance','Applies carb heat; checks fuel selector, mixture rich, magnetos BOTH, primer in and locked','Advises passengers to prepare for emergency landing','Completes emergency checklist from POH in correct sequence']},
    {id:'FL5-2',text:'Emergency approach and landing',acsRef:'IX.B',textRef:'AFH Ch.17; POH §3',
     subtasks:['Uses ABCDE: Airspeed (best glide), Best field, Checklist, Declare (7700/Mayday), Execute','Sets up a realistic high key/low key pattern over selected field','Manages energy to arrive at approach end of field from correct angle','Applies flaps at appropriate point to control approach path','Does not overshoot or undershoot the intended touchdown area by more than the field length','Calls simulated Mayday on 121.5 or appropriate frequency']},
    {id:'FL5-3',text:'Systems and equipment malfunctions',acsRef:'IX.C',textRef:'POH §3',
     subtasks:['Identifies and responds correctly to simulated electrical fire: MASTER OFF, LAND ASAP','Identifies and responds to simulated engine fire in flight per POH','Responds to partial power loss: maintain control, identify cause using checklist, declare','Responds to pitot-static failure: recognize symptoms, apply alt-static per POH','Demonstrates lost communication procedure: squawk 7600, attempt on guard, light signals']},
    {id:'FL5-4',text:'Emergency equipment knowledge',acsRef:'IX.D',textRef:'AFH Ch.17',
     subtasks:['Locates ELT in training aircraft; explains when it activates and how to manually activate','States ELT frequency: 406 MHz (digital), 121.5 MHz (homing)','Demonstrates how to squawk 7700 on the transponder','Briefs simulated passenger on brace position and exit procedures','States survival priorities post-landing: signal, shelter, water, food (in that order)']}
  ]},

FL6:{id:'FL6',type:'flight',stage:1,title:'Performance Maneuvers',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['V.A Steep Turns','V.B Ground Reference Maneuvers'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±15 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Flying south toward the ag fields east of Concord near Cabarrus County, practicing precision airwork. Steep turns demonstrate the true limits of coordinated flight. GRMs show how wind affects everything.',
  whatIf:[
     {q:'What if the student loses 300 ft in a steep turn — do you continue the maneuver or level off?',a:'Call \'level off\' and have the student recover to the entry altitude before continuing. The ACS tolerance is ±100 ft for steep turns — 300 ft is three times the standard. Allowing a student to continue a steep turn while significantly off altitude reinforces imprecision. Recover, identify the cause (insufficient back pressure, not enough power, distraction), and re-enter.'},
     {q:'What if during turns around a point the student maintains constant bank instead of varying it — where do they drift and why?',a:'They\'ll drift outward on the tailwind and inward on the headwind. With a tailwind, groundspeed is highest — a constant bank produces a larger radius. With a headwind, groundspeed is lowest — the same bank produces a smaller radius. The fix is to steepen the bank as groundspeed increases (tailwind) and shallow it as groundspeed decreases (headwind). This is a groundspeed/bank angle relationship, not an intuitive concept.'},
     {q:'What if a power line bisects your planned S-turn road at mid-field — how do you adapt the maneuver?',a:'Select a different road. Power lines are serious obstacles — they\'re hard to see, especially at low altitudes, and the wires extend beyond the towers. Never plan maneuvers that require crossing or flying near power lines at low altitude. Brief this in every ground reference maneuver lesson: always check for towers, wires, and obstacles along your reference line before entry.'},
     {q:'What if convective turbulence is moderate in the practice area — do you continue steep turns or divert the lesson plan?',a:'Divert the lesson plan. Moderate turbulence makes steep turns difficult to evaluate and potentially dangerous — you can\'t distinguish student error from turbulence-induced deviation. Use the day for traffic pattern work (where altitude deviations are smaller) or ground reference maneuvers at lower altitude where turbulence is typically less. Document the weather limitation in the lesson record.'},
     {q:'What if the student\'s rectangular course drifts outside ½ mile on the crosswind leg — what\'s the specific correction?',a:'On the crosswind leg with a headwind, the bank on the turn from downwind must be shallower to account for the reduced groundspeed going into the wind. If the student is using the same bank as the downwind-to-base turn, they\'ll overshoot the crosswind leg. The cue: as you slow down approaching a headwind, use less bank on the turn to avoid overturning.'}
  ],
  coaching:'The flat farmland east of KJQF near Cabarrus County farmland is ideal for ground reference maneuvers. Steep turns are often rushed — feel the G-load and add back pressure smoothly as bank increases.',
  errors:['Inconsistent bank angle in turns around a point','Drifting off reference road in S-turns','Altitude deviations in steep turns when focused on bank angle','Not correcting for wind on rectangular course crosswind legs'],
  debrief:['Why is your bank steepest with a tailwind in turns around a point?','What happens on a rectangular course without crosswind correction?','During steep turns, why does back pressure increase with bank angle?'],
  tasks:[
    {id:'FL6-1',text:'Steep turns',acsRef:'V.A',textRef:'AFH Ch.10',
     subtasks:['Clears area; establishes entry altitude and airspeed','Rolls into 45° bank; adds back pressure and power to maintain altitude','Maintains ±100 ft altitude, ±5° bank, ±10 kt airspeed throughout','Completes 360° turn and rolls out within ±5° of entry heading','Demonstrates both left and right steep turns in sequence','Explains: increasing bank = more induced drag = more power and back pressure needed']},
    {id:'FL6-2',text:'Rectangular course',acsRef:'V.B',textRef:'AFH Ch.6',
     subtasks:['Selects a rectangular field; establishes entry on downwind leg','Maintains uniform distance from field (approximately ½ mile)','Corrects for wind: steeper bank on downwind turn, shallower on upwind turn','Maintains pattern altitude ±100 ft on all legs','Completes at least 2 circuits showing consistent wind correction technique','Explains the relationship between groundspeed and required bank angle']},
    {id:'FL6-3',text:'S-turns across a road',acsRef:'V.B',textRef:'AFH Ch.6',
     subtasks:['Selects a straight road; enters on downwind side perpendicular to road','Starts with steepest bank (highest groundspeed with tailwind)','Produces symmetrical semi-circles of equal size on each side','Crosses road wings-level each time','Rolls out heading directly perpendicular to road after each crossing','Maintains altitude ±100 ft throughout']},
    {id:'FL6-4',text:'Turns around a point',acsRef:'V.B',textRef:'AFH Ch.6',
     subtasks:['Selects a prominent ground reference point; establishes entry downwind','Maintains constant radius from point using varying bank angle','Steepest bank when groundspeed highest (tailwind), shallowest with headwind','Maintains altitude ±100 ft throughout complete circle','Completes at least 2 circles demonstrating consistent radius control','Explains why radius drifts if bank angle is held constant throughout']}
  ]},

FL7:{id:'FL7',type:'flight',stage:1,title:'Review',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['VII.A,B,C Stalls','V.A Steep Turns','V.B Ground Reference Maneuvers'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±15 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Full airwork flight — CFI evaluates where the student stands and identifies the weakest areas for focused work in FL8.',
  whatIf:[
     {q:'What if during the review the student is inconsistent — good one repetition, poor the next — what does that tell you about readiness?',a:'Inconsistency indicates that the skill is at the \'conscious competence\' stage — the student can do it when focused but hasn\'t internalized it. This is not solo-ready. Solo requires \'unconscious competence\' — the student does it correctly without concentrating on it. More dual time and targeted practice is the answer, not lowering the standard. Document specific inconsistencies.'},
     {q:'What if the student nails stalls but falls apart at landings — how do you prioritize the remaining presolo flights?',a:'Landings are the gatekeeping skill for solo — you can\'t solo if you can\'t land. Prioritize traffic pattern work and dedicate the bulk of remaining presolo flight time to approaches and landings. Stalls can be reviewed in single sessions. Use FL8 (go-around and slip) to build approach confidence, then FL9/FL10 as pure landing evaluation sessions.'},
     {q:'What if a student performs all maneuvers acceptably but makes poor decisions (e.g., starts a maneuver too low) — are they solo-ready?',a:'No. §61.87(c) requires adequate aeronautical decision making, not just stick-and-rudder skill. A student who starts maneuvers at unsafe altitudes or makes poor judgment calls has not demonstrated the independent decision-making required for solo. The endorsement certifies judgment, not just technique. Address ADM deficiencies directly before any solo endorsement.'},
     {q:'What if an unexpected go-around at KJQF puts you in a non-standard traffic pattern — how do you manage that with a student?',a:'Take the radio and fly the aircraft. A non-standard departure from the pattern requires clear communication with tower. Advise tower of your position and intentions: \'KJQF Tower, [callsign], going around, request [instructions]\'. If the student is flying, have them maintain a safe altitude and heading while you handle ATC. Debrief the scenario thoroughly afterward.'},
     {q:'What if the student lands well but admits they were lucky and felt out of control — what does that mean for solo?',a:'This is actually a positive sign of self-awareness, and it tells you accurately: not ready. \'Lucky\' is not a skill. A student who cannot explain what they did correctly and why has not internalized the skill. Continue training with focused debrief after each landing: \'Walk me through that approach. What was your airspeed on final? Where did you flare?\' Understanding must precede solo.'}
  ],
  coaching:'Informal evaluation flight. Note which maneuvers need the most work before presolo. Stalls from turns are new — rolling tendency during recovery is the key teaching point.',
  errors:['Sloppy coordination during turning stalls','Altitude deviations in steep turns when distracted','Inconsistency — maneuver looks different every time'],
  debrief:['Rank your three maneuvers from best to worst today.','When you stalled in the turn, what happened to the nose?','What is your biggest area to improve before solo?'],
  tasks:[
    {id:'FL7-1',text:'All T/O and landing types review',acsRef:'IV.A,B',textRef:'AFH Ch.5,8',
     subtasks:['Normal T/O: smooth application, correct Vr rotation, Vy climb maintained','Normal landing: stabilized approach, correct flare height, centered touchdown','Demonstrates 3 acceptable unassisted T&Gs without instructor input','Power-off approach: engine to idle on downwind, manages energy to touchdown','Go-around: initiated within 1 second of instructor call or own decision']},
    {id:'FL7-2',text:'Slow flight and stall review',acsRef:'VII.A,B,C',textRef:'AFH Ch.4',
     subtasks:['Performs clearing turns before all stall work','Slow flight: established within ±100 ft of entry altitude; demonstrates turns both directions','Power-off stalls: straight and turning; immediate recovery at first indication','Power-on stalls: maintains directional control; correct recovery sequence','Demonstrates no secondary stall in either stall type']},
    {id:'FL7-3',text:'Steep turns and GRMs review',acsRef:'V.A,V.B',textRef:'AFH Ch.6,10',
     subtasks:['Steep turns: ±100 ft altitude, rollout within ±5° entry heading','Rectangular course: uniform spacing, proper wind correction all four legs','S-turns: symmetrical arcs, wings-level crossing of road each time','Turns around a point: constant radius, varying bank with groundspeed correctly']}
  ]},

FL8:{id:'FL8',type:'flight',stage:1,title:'Go-Around and Forward Slip',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['IV.G Forward Slip to Landing','IV.H Go-Around/Rejected Landing','III.A Communications'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'±15 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Tower calls on 2-mile final: "Cessna 7RV, go around, traffic on runway." The go-around must be immediate. Practice multiple times until the response is automatic.',
  whatIf:[
     {q:'What if the student hesitates 3 seconds before initiating the go-around — is that acceptable? What do you do?',a:'Three seconds is too long — in those 3 seconds at approach speed the aircraft descends 30–50 ft and covers significant ground. A safe go-around initiation should be within 1 second of the decision. After the hesitation, take the controls and demonstrate. In debrief: \'The go-around decision is commit or go-around — there\'s no hesitation phase.\' Drill the immediate power application response until it\'s automatic.'},
     {q:'What if a student retracts all flaps at once on go-around — what happens and how do you brief against it?',a:'Sudden full flap retraction on go-around at low altitude can cause the aircraft to settle rapidly — the sudden loss of lift is not compensated for if airspeed isn\'t above flap-retract speed. The aircraft may not have sufficient climb rate to recover. Brief this explicitly: \'Flaps come up in stages — first notch to 20°, wait for positive climb and acceleration, then retract fully.\''},
     {q:'What if you\'re in a forward slip and the student accidentally applies flaps beyond the POH limitation — what\'s the risk?',a:'Most POHs prohibit slips with flaps beyond a certain setting (commonly beyond 20° or 10°). Exceeding this creates aerodynamic interference between the wing and tail in some aircraft designs, potentially causing a pitch or control anomaly. The fix is to raise flaps to the permitted setting immediately. Brief the limitation before every slip exercise.'},
     {q:'What if tower says go around and the student doesn\'t hear it — who acts and how fast?',a:'You act immediately — either by transmitting the readback yourself or by initiating the go-around physically if safety of flight demands it. If the student heard a partial transmission, tell them: \'Tower said go around — full power now.\' The PIC (you) is responsible for compliance with ATC instructions even if the student is at the controls. Never wait for the student to process an instruction when urgency is involved.'},
     {q:'What if after 5 go-around drills the student is getting complacent and sloppy — how do you reset the urgency?',a:'Make the trigger unpredictable. Don\'t call it at the same point every time — vary the call to actual short final, to the flare, to just after touchdown. Also vary the reason: \'Go around — runway incursion,\' \'Go around — unstable approach.\'  When the student doesn\'t know when to expect it, the urgency stays real. Sloppy go-arounds from predictable triggers are worthless training.'}
  ],
  coaching:'The go-around must become a reflex. Train early commitment. Full power on go-around produces significant left-turning tendency. Forward slip allows high descent angles without speed increase.',
  errors:['Hesitating on go-around decision','Retracting all flaps at once on go-around (sudden sink)','Wrong foot in forward slip (use upwind rudder)','Not clearing traffic before re-entering pattern after go-around'],
  debrief:['When is the last safe opportunity to initiate a go-around from the flare?','In a forward slip — which rudder, which aileron?','Tower gives steady red light while airborne — what do you do?'],
  tasks:[
    {id:'FL8-1',text:'Go-around/rejected landing procedure',acsRef:'IV.H',textRef:'AFH Ch.8',
     subtasks:['Initiates go-around within 1 second of decision — no hesitation','Applies FULL power smoothly; simultaneously applies right rudder to counteract torque','Pitches to go-around attitude — does not pull nose excessively high','Retracts flaps in stages (not all at once) as aircraft accelerates past flap limit speeds','Establishes Vy climb; clears traffic before turning crosswind','Advises ATC of go-around with correct callsign and runway','Demonstrates at least 3 go-arounds from various points: final, flare, rollout']},
    {id:'FL8-2',text:'Forward slip to a landing',acsRef:'IV.G',textRef:'AFH Ch.8',
     subtasks:['Identifies when a forward slip is appropriate: high on final without sufficient runway remaining','Establishes forward slip: bank INTO the wind with aileron, apply OPPOSITE rudder','Maintains runway alignment while in the crossed-control configuration','Increases sink rate without increasing airspeed in the slip','Removes slip prior to flare — returns to coordinated flight for touchdown','Does not use forward slip with flaps extended beyond POH limitation']},
    {id:'FL8-3',text:'ATC light signals all combinations',acsRef:'III.A',textRef:'AIM 4-2-13',
     subtasks:['Demonstrates correct response to steady green (airborne): land','Demonstrates correct response to flashing green (airborne): return to land','Demonstrates correct response to steady red (airborne): give way and circle','Demonstrates correct response to flashing red (airborne): airport unsafe, do not land','Demonstrates correct response to flashing white (ground): return to starting point','Demonstrates correct response to alternating red/green: extreme caution']}
  ]},

FL9:{id:'FL9',type:'flight',stage:1,title:'Presolo Review',
  hrs:{dual:1.5,solo:0,instrument:0.3,night:0},
  isPresolo:true,
  acsItems:['All Stage 1 ACS Tasks — to solo standard'],
  tolerance:{alt:'Solo standard',hdg:'No instructor interventions required',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isEndOfCourse:false,
  scenario:'CFI evaluates the student as if they were about to solo. The question: "Would I feel comfortable watching this student fly the pattern alone right now?"',
  whatIf:[
     {q:'What if the student scores 85% on the presolo written but misses all questions about emergency procedures — can you endorse them?',a:'No — not yet. §61.87(b) requires the student to demonstrate knowledge in all the listed areas, including emergency procedures. The regulation says the instructor must review all incorrect answers with the student until they understand. You can endorse after that review, but a pattern of missed emergency questions means the knowledge is not solid. Conduct additional ground instruction and re-test before solo.'},
     {q:'What if during the presolo evaluation you intervene twice in the pattern — what\'s your decision about solo?',a:'Two interventions in the same evaluation session means the student is not ready. An intervention means the aircraft was not being operated safely without your input — that is the definition of not solo-ready. Be direct and respectful: \'We\'re not there yet, and that\'s okay. Here\'s exactly what I need to see.\'  Document the specific interventions and schedule FL10.'},
     {q:'What if weather is perfect but you\'re not completely comfortable with the student\'s landings — what do you do?',a:'Wait. Perfect weather does not create solo readiness — consistent technique does. The endorsement says you believe the student can fly safely without your presence. If you have doubt, that doubt is data. There is no regulatory deadline for solo — a student who solos at 20 hours with solid skills is better prepared than one who solos at 12 hours with marginal landings. Your professional judgment protects both the student and the public.'},
     {q:'What if the student asks why they need the presolo written test — how do you explain its purpose beyond compliance?',a:'The test is a structured way to verify that the student understands the regulations, emergency procedures, and local airspace before they\'re alone in the airplane. It\'s not a formality — it\'s the ground half of the presolo evaluation. Ask them: \'If you had an engine failure on takeoff today, what would you do?\' The answer to that question is what the test is ensuring they know.'},
     {q:'What if the student performs well on every maneuver but rushes the checklist every time — is that a solo stopper?',a:'Yes — until corrected. Rushing checklists creates the habit of missed items, which is how airworthy aircraft depart with the mixture at idle cutoff or carb heat applied at full power. Address it directly: \'The checklist is not a suggestion. Find your place, read each item, confirm it, move to the next.\' Demonstrate proper pacing. Do not endorse a solo when checklist discipline is poor.'}
  ],
  coaching:'Critical assessment flight. Be honest. Three consecutive acceptable landings without instructor intervention before solo. The presolo written must be complete and reviewed.',
  errors:[],
  debrief:['How did you feel flying without my hands on the controls?','What was the hardest moment today?','Walk me through what you would do if the engine quit on takeoff at 200 ft AGL.'],
  tasks:[
    {id:'FL9-1',text:'All presolo maneuvers — unassisted evaluation',acsRef:'All Stage 1',textRef:'14 CFR §61.87',
     subtasks:['Performs preflight inspection independently without prompting','Performs all runup checks in correct sequence independently','Makes all radio calls correctly without coaching','Executes normal T/O and departure without instructor input','Performs steep turns, slow flight, and stalls without prompting','Executes simulated engine failure and ABCDE checklist without assistance','Flies traffic pattern, approach, and landing without input — 3 consecutive acceptable landings']},
    {id:'FL9-2',text:'Presolo knowledge test (§61.87(b))',acsRef:'§61.87(b)',textRef:'14 CFR §61.87',
     subtasks:['Achieves 100% on presolo written knowledge test (or all errors corrected and understood)','Correctly answers questions on aircraft V-speeds from the POH','Correctly answers questions on local KJQF airspace and procedures','Correctly answers questions on emergency procedures from memory','Correctly answers questions on solo flight limitations (area, weather minimums, pattern altitude)']},
    {id:'FL9-3',text:'Presolo endorsements',acsRef:'§61.87',textRef:'14 CFR §61.87',
     subtasks:['Instructor issues §61.87(b) knowledge exam endorsement: signed with cert number and date','Instructor issues §61.87(c)(1) presolo flight training endorsement','Logbook entries completed correctly for all presolo hours','Student logbook reviewed for correct hour totals','Solo endorsement reviewed and understood by student: aircraft make/model, area, limitations']}
  ]},

FL10:{id:'FL10',type:'flight',stage:1,title:'Presolo Review (Second)',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  isPresolo:true,
  acsItems:['All Stage 1 Tasks — to solo standard'],
  tolerance:{alt:'Solo standard',hdg:'No instructor input',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isEndOfCourse:false,
  scenario:'The CFI says nothing for most of the flight. The student flies as if alone. Any intervention means the student is not ready for solo.',
  whatIf:[
     {q:'What if during the final presolo review the student makes one significant error — how do you weigh that against everything else?',a:'Context matters. A significant error in an area previously solid may be a bad day, not a pattern — one data point is not a trend. But if the error was in landing (the primary solo skill) or emergency procedures, it carries more weight. Ask yourself: if that error happened solo and I wasn\'t there, could the student have recovered safely? If the honest answer is no, it\'s not solo time yet.'},
     {q:'What if the student is technically ready but the weather is marginal (10kt crosswind) — do you solo them today or wait?',a:'Wait for better weather for first solo. §61.87(n) allows you to specify conditions — and for a first solo, benign conditions are appropriate. The first solo has enough psychological load without adding a challenging crosswind. A calm-wind day, low traffic, good visibility is the right environment. \'Technically ready\' plus \'challenging conditions\' equals unnecessary risk. There will be another good day.'},
     {q:'What if the student has been waiting 3 lessons to solo and is visibly frustrated — how does that affect your evaluation?',a:'Acknowledge the frustration honestly: \'I know you\'re ready and I know this is hard to hear.\' But never lower the standard because of a student\'s emotional state or frustration — that would be a disservice. Use the frustration productively: \'Here\'s exactly what I need to see today.\' A specific, achievable target redirects frustration into focus. If frustration is affecting performance, address that too.'},
     {q:'What if you\'re about to step out of the airplane and you notice the student\'s hands are shaking — what do you do?',a:'Get back in. Assess: is this normal excitement or something more? Ask directly: \'How are you feeling right now?\' A brief conversation — 60 seconds — tells you what you need to know. Mild pre-solo nerves are normal and often improve after the first circuit. Severe anxiety that the student can\'t manage is a reason to delay. Trust your read of the situation — you know this student.'},
     {q:'What if the student handles every scenario perfectly but can\'t explain why — intuition vs. understanding, does it matter for solo?',a:'It matters. A student who acts correctly but can\'t explain it may be mirroring you rather than understanding the principle — and in a novel situation solo, they won\'t have the principle to fall back on. Ask \'why\' after each maneuver. If the answer is \'I don\'t know, it just felt right,\' that\'s not sufficient for endorsement. Understanding drives correct action in the situations you haven\'t practiced together.'}
  ],
  coaching:'Do not prompt. If you must intervene, note the specific instance. The student must demonstrate autonomous decision-making in the traffic pattern.',
  errors:[],
  debrief:['On which specific tasks am I not yet comfortable letting you solo?','What would you do if tower said "Unable, say again your call sign"?'],
  tasks:[
    {id:'FL10-1',text:'Complete unassisted flight — final presolo evaluation',acsRef:'All Stage 1',textRef:'14 CFR §61.87',
     subtasks:['Completes preflight with zero prompting — opens and closes inspection panels correctly','Performs engine start, taxi, and runup independently using checklist','All radio calls made correctly and confidently (no hesitation, proper phraseology)','No instructor interventions required during any maneuver in the practice area','No instructor interventions required during traffic pattern, approach, or landing','At least 3 consecutive landings demonstrating consistent, safe technique','Student correctly handles one simulated emergency introduced by instructor without prompting']}
  ]},

FL11:{id:'FL11',type:'flight',stage:1,title:'First Solo',
  hrs:{dual:0.5,solo:0.5,instrument:0,night:0},
  isSolo:true,
  acsItems:['§61.87 Solo Requirements'],
  tolerance:{alt:'Solo standard',hdg:'Solo standard',spd:'Solo standard'},
  isStageCheck:false,isEndOfCourse:false,
  scenario:'The most memorable flight of the student\'s life. The CFI steps out. The airplane feels lighter. Three laps. History made.',
  whatIf:[
     {q:'What if the student\'s first solo landing is hard but safe — do you call them back in or let them continue?',a:'Let them continue if it was safe — the definition of \'safe\' is: on the runway, on centerline, stopped without drama, aircraft undamaged. A hard landing that is otherwise controlled is within the range of normal student performance. Calling them back would undermine confidence at the worst possible moment. Debrief it after the full solo, not between circuits.'},
     {q:'What if the student goes around on their second solo circuit without being told to — is that good or bad?',a:'That\'s excellent. An unsolicited go-around means the student recognized that the approach was not acceptable and made an independent safety decision — exactly what solo is testing. This is a sign of strong ADM. Celebrate it in the debrief: \'That go-around on circuit two was one of the best decisions you made today.\''},
     {q:'What if the ATIS changes to a crosswind beyond the student\'s demonstrated limit mid-solo — what do you do from the ramp?',a:'Transmit on the KJQF frequency: \'[Callsign], I have a message for you, contact [phone] on completion.\' Do not transmit ATC-style instructions that could confuse the student. If the winds are within the aircraft\'s demonstrated crosswind component (even if beyond the student\'s comfort), continue monitoring. If they are truly dangerous, coordinate with tower to issue guidance. Have a direct line to tower before the solo.'},
     {q:'What if you lose radio contact with the student on their first solo — what\'s your procedure?',a:'Attempt contact on ground frequency, tower frequency, and 121.5. Alert KJQF Tower immediately — they can attempt contact and see the aircraft on radar. If the student is in the pattern and visible, coordinate with tower for light gun signals. A radio failure does not mean the student can\'t fly — monitor their position and trust the training. Coordinate with ATC and stay calm.'},
     {q:'What if the student lands safely but taxis to the wrong area — how do you handle it without undermining the celebration?',a:'First — they\'re safe, the airplane is intact, and the solo is complete. Radio them with gentle guidance to the correct parking area before they go too far. In the debrief after the celebration, mention it briefly: \'One thing to note — after landing, hold short and confirm with ground before taxiing.\'  Keep it factual, brief, and clearly separated from the celebration of the solo achievement.'}
  ],
  coaching:'Trust your assessment. Brief thoroughly. Confirm ideal weather: calm winds, good VFR, low traffic. Stand on the ramp, monitor every circuit on Unicom. Celebrate. Document everything precisely.',
  errors:[],
  debrief:['How did it feel different from when I was in the right seat?','Which landing was your best? Your worst? Why?','What would you do differently?'],
  tasks:[
    {id:'FL11-1',text:'Dual warm-up and solo endorsement issuance',acsRef:'§61.87',textRef:'14 CFR §61.87',
     subtasks:['Dual warm-up: minimum 2 circuits with acceptable landings each','Weather confirmed: wind ≤ 7 kt, clear/few, VFR, no unusual hazards','Solo endorsement issued: §61.87(n) — specific aircraft, solo only, KJQF pattern','Student reads and acknowledges all limitations in the endorsement','Instructor confirms student medical/student certificate in student\'s possession','Instructor briefs emergency procedures, lost comm, go-around criteria']},
    {id:'FL11-2',text:'First solo — minimum 3 full-stop T&Gs',acsRef:'§61.87(d)(1)',textRef:'14 CFR §61.87',
     subtasks:['Student completes preflight independently and taxis to runway solo','Circuit 1: safe takeoff, acceptable pattern, safe landing — instructor observes and documents','Circuit 2: safe takeoff, acceptable pattern, safe landing — independent go-around if needed','Circuit 3: safe takeoff, acceptable pattern, safe landing — taxi back to ramp independently','All radio calls made correctly without assistance on all three circuits','Logbook entry: date, aircraft, dual + solo time, "First Solo" notation, instructor signature']}
  ]},

FL12:{id:'FL12',type:'flight',stage:1,title:'Stage One Check ★',
  hrs:{dual:1.0,solo:0,instrument:0.2,night:0},
  isStageCheck:true,
  acsItems:['All Stage 1 ACS Areas and Tasks'],
  tolerance:{alt:'±150 ft',hdg:'±20°',spd:'±10 kt'},
  isSolo:false,isEndOfCourse:false,
  scenario:'Stage check with the Chief CFI or designated check instructor — evaluating competence for unsupervised solo operations.',
  whatIf:[
     {q:'What if the check instructor finds a significant deficiency in an area the primary CFI thought was signed off — what\'s the process?',a:'The stage check exists precisely to catch this. The check instructor documents the deficiency with specifics: what task, what error, what standard was not met. The primary CFI provides additional instruction until the deficiency is corrected, documented, and the student returns for a re-check in that specific area. Neither CFI should be defensive — the system is working as designed.'},
     {q:'What if the student passes everything except emergency procedures — can the stage check be partially passed?',a:'Stage checks are typically all-or-nothing for advancement — the student must demonstrate all required areas before Stage 2 flight privileges are authorized. The check instructor documents the specific deficiency, the primary CFI provides additional instruction in emergency procedures, and the student returns for a re-check in that area. Partial credit is not standard practice in a formal stage check structure.'},
     {q:'What if the student performs better with the check instructor than with you — what does that tell you?',a:'It likely means the student has been performing to your expectations rather than their actual ability — they\'ve learned what you notice and what you don\'t. This is valuable feedback for your instruction: raise standards, vary the evaluation criteria, and ensure you\'re seeing full performance across all tasks. It may also reflect test-day performance elevation — some students genuinely perform better under evaluation.'},
     {q:'What if the check reveals the student doesn\'t truly understand wake turbulence avoidance despite checking the box — who is responsible?',a:'Both — the primary CFI for signing off a task that wasn\'t fully understood, and the training system for allowing surface-level completion. The constructive response is to acknowledge the gap, provide thorough instruction on wake turbulence avoidance (including why the rules exist), and re-evaluate. This is a teaching moment for the CFI as much as the student.'},
     {q:'What if the student argues with the check instructor\'s assessment — what should the check instructor respond?',a:'Stay professional and specific: \'Here\'s what I observed and here\'s the ACS standard. Can you show me where my assessment doesn\'t match?\'  If the student has a valid point, acknowledge it. If not, the standard stands. Disagreement should be documented. This behavior is itself data about the student\'s ADM — a pilot who argues with authority figures without basis is demonstrating an anti-authority attitude.'}
  ],
  coaching:'STAGE CHECK — Must be conducted by check instructor other than primary CFI. Document results in student record. Any unsatisfactory area requires additional instruction before re-check.',
  errors:[],debrief:[],
  tasks:[
    {id:'FL12-1',text:'Stage 1 oral examination',acsRef:'ACS I',textRef:'FAA-S-ACS-6C',
     subtasks:['Correctly answers all §61.87(b) presolo knowledge areas','Correctly explains aircraft systems (engine, electrical, fuel, instruments)','Correctly explains local KJQF airspace and procedures','Correctly explains all VFR weather minimums for KJQF operating environment','Correctly explains emergency procedures from memory']},
    {id:'FL12-2',text:'Stage 1 flight evaluation - all maneuvers',acsRef:'All Stage 1',textRef:'FAA-S-ACS-6C',
     subtasks:['Preflight, engine start, taxi, runup: all to ACS standard with no prompting','Normal T/O and departure: to ACS standard (within tolerance)','Slow flight: altitude ±150 ft, heading ±20°, no stall warning inadvertently','Power-off and power-on stalls: correct recovery, directional control maintained','Steep turns: ±150 ft altitude, rollout ±5° entry heading','Emergency approach and landing: ABCDE without prompting, realistic field selection','Traffic pattern: 3 unassisted landings, all within ACS tolerances']}
  ]},

FL13:{id:'FL13',type:'flight',stage:2,title:'Second Solo',
  hrs:{dual:1.0,solo:0.5,instrument:0,night:0},
  isSolo:true,
  acsItems:['III.B Traffic Patterns','IV.A,B Normal T/O and Landing'],
  tolerance:{alt:'±150 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'You are the pilot — plan the flight, check weather, brief yourself, fly it. The CFI watches.',
  whatIf:[
     {q:'What if the student\'s self-brief misses a NOTAM that closes a taxiway at KJQF — how do you handle the debrief?',a:'Use it as a learning opportunity, not a judgment moment. Ask: \'Walk me through where you checked NOTAMs and how you read them.\' Determine whether it was a process failure (didn\'t check) or a reading failure (checked but missed). Then work through the NOTAM together. The FITS debrief model focuses on learning: \'What happened? Why? What would you do differently?\' Not: \'You messed up.\''},
     {q:'What if the student\'s FITS self-grade is much higher than yours on every maneuver — what do you address the gap?',a:'This is one of the most important debrief conversations you\'ll have. Start with specific observations: \'On your first steep turn you had a 200 ft altitude deviation. You graded that S. I graded it M. Tell me what you were thinking at that moment.\' The goal is calibrating the student\'s self-assessment — overconfidence is a risk factor. A student who can\'t accurately evaluate their own performance can\'t improve.'},
     {q:'What if the student makes a radio call error that causes confusion with another aircraft — what\'s your debrief approach?',a:'Acknowledge, explain, and practice. First: what was the error and what confusion did it cause? Second: what is the correct phraseology and why? Third: have the student write out and verbally practice the correct call before the next flight. Radio errors are not embarrassing — they\'re common. What matters is learning the correct form and understanding why standard phraseology exists.'},
     {q:'What if during the solo portion the student extends downwind significantly — do you intervene by radio?',a:'Only if there\'s a safety issue — for example, if they\'re about to enter KCLT Class B airspace or there\'s conflicting traffic. Otherwise, let them work through it. An extended downwind is a learning experience — the student will self-correct or ask tower for guidance. Intervening on every deviation teaches them to wait for direction rather than think independently. Trust the training.'},
     {q:'What if the student lands long and exits at the last taxiway — good outcome but poor judgment — how do you frame the debrief?',a:'Separate the outcome from the decision quality: \'You landed safely, which is good. But landing long means you accepted more runway than you needed and left less room for stopping. On a short runway or with an obstacle, that decision changes the outcome significantly.\' Outcome-based thinking (\'it worked out\') is the foundation of risk homeostasis. Teach decision-quality thinking instead.'}
  ],
  coaching:'Allow student to self-brief this flight. Observe their weather check and go/no-go reasoning. After solo, use FITS learner-centered debriefing: student rates themselves first.',
  errors:[],
  debrief:['How did your self-assessment compare to my assessment?','What do you want to work on in solo practice flights?'],
  tasks:[
    {id:'FL13-1',text:'Student self-brief and weather check',acsRef:'I.C,I.D',textRef:'FITS LCG',
     subtasks:['Student independently checks weather: KJQF METAR, wind, VFR flight conditions','Student briefs CFI on go/no-go decision with reasoning','Student completes solo endorsement check: §61.87(n) current, medical/cert in possession','Student completes preflight independently before CFI dual review portion']},
    {id:'FL13-2',text:'Dual review then solo',acsRef:'IV.A,B',textRef:'AFH Ch.5,8',
     subtasks:['Dual review: 2 T&Gs with acceptable landings, radio work, emergency review','Solo: 3 full-stop T&Gs observed by instructor','All radio calls made correctly and confidently during solo circuits','No unauthorized deviations from the solo area or altitude limits','FITS self-assessment after solo: student rates each circuit U/M/S/G/E with written notes']}
  ]},

FL14:{id:'FL14',type:'flight',stage:2,title:'Short-Field and Soft-Field Operations',
  hrs:{dual:1.5,solo:0,instrument:0,night:0},
  acsItems:['IV.C Soft-Field T/O','IV.D Soft-Field Landing','IV.E Short-Field T/O','IV.F Short-Field Landing'],
  tolerance:{alt:'±150 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Departing from a grass strip near Kannapolis — short, soft, and upslope. Every technique from today is required for the actual scenario.',
  whatIf:[
     {q:'What if the student touches down on the soft-field and immediately brakes hard — what happens and how do you brief against it?',a:'Hard braking on a soft surface (grass, mud, turf) can cause the main gear to dig in, resulting in a nose-over — the most dangerous outcome of a soft-field landing. Brief explicitly: \'After soft-field touchdown, hold elevator back pressure, do not brake, use only throttle to manage deceleration. Let the soft surface slow the aircraft.\'  The risk is not just theoretical — it causes accidents.'},
     {q:'What if the short-field landing spot is 400 ft long with obstacles — at what point do you call it off?',a:'On this training aircraft you\'re dealing with a real-world scenario. Compute the landing distance for the day\'s conditions — if the computed distance plus a 50% safety factor exceeds 400 ft, the landing is not appropriate. From the air: if you\'re high on final and can\'t make the spot, go around. If the approach is stabilized and on target, commit. The decision must be made before crossing the obstacle threshold.'},
     {q:'What if the student is consistently 10 kt fast on final — what is causing that and how do you fix it?',a:'Ten knots fast is almost always fear of the stall, not a technique error — the student is unconsciously padding the airspeed. Identify the root cause: \'Are you worried about stalling on final?\' If yes, more stall practice at a safe altitude will fix it. In the meantime, emphasize: \'Vref is already 30% above stall. You have built-in margin.\'  Also check that the student knows Vref — they may be using the wrong number.'},
     {q:'What if a real soft-field (wet grass) is available for practice — what additional risks do you brief?',a:'Brief: soft-field runway condition (depth, standing water, ruts), animal/wildlife on or near runway, loss of directional control on rollout in soft conditions, and the nose-over risk on landing. Verify the aircraft\'s gross weight is appropriate for the surface. Check the airport\'s NOTAMs and call ahead to the FBO if the strip is private. Ensure the student has demonstrated the technique in dry conditions first.'},
     {q:'What if there\'s a 12 kt direct crosswind today — do you continue short/soft field practice or change the lesson plan?',a:'Assess student currency and demonstrated crosswind skill. If the student has recently demonstrated crosswind landings to an acceptable standard, 12 kt may be workable as an additional challenge. If crosswind landings are not yet solid, change the plan — short/soft field adds technique complexity, and combining that with a significant crosswind is too much load for a developing student. Normal landings in the crosswind first, then special techniques another day.'}
  ],
  coaching:'Short-field landings require precision — measure touchdown point. Students tend to be too fast. Use displaced threshold on 20 at KJQF as the target.',
  errors:['Too fast on short-field final (extra speed = extra float)','Dropping nose too fast on soft-field landing','Not clearing imaginary obstacle before reducing power on short-field T/O','Lifting off too abruptly on soft-field (bouncing)'],
  debrief:['Why is airspeed control more critical on short-field than normal approach?','In a true soft-field (mud), why NOT use brakes after landing?','How does obstacle clearance affect Vx vs. Vy choice after T/O?'],
  tasks:[
    {id:'FL14-1',text:'Soft-field takeoff and climb',acsRef:'IV.C',textRef:'AFH Ch.5',
     subtasks:['Taxi onto runway without stopping; continuous rolling motion to avoid sinking into soft surface','Sets pitch attitude to lift nose wheel off ground immediately on application of power','Accelerates in ground effect (10–20 ft AGL) until reaching Vy','Establishes Vy climb and clears imaginary obstacle','Does not over-rotate and cause excessive drag in ground effect']},
    {id:'FL14-2',text:'Soft-field landing',acsRef:'IV.D',textRef:'AFH Ch.8',
     subtasks:['Establishes normal stabilized approach at correct Vref','Flares to minimum sink rate — main gear touches first','Holds nose wheel off as long as possible to minimize load on soft surface','Does not apply brakes or abrupt nose-down input after touchdown','Maintains directional control while decelerating on soft surface']},
    {id:'FL14-3',text:'Short-field takeoff and climb',acsRef:'IV.E',textRef:'AFH Ch.5',
     subtasks:['Positions at beginning of runway; holds brakes; applies full power; checks instruments','Releases brakes; accelerates to Vr (not Vy) for minimum distance','Establishes Vx climb immediately to clear imaginary 50-ft obstacle','Transitions to Vy after obstacle clearance is assured','Lands within ±200 ft of a pre-selected point during practice']},
    {id:'FL14-4',text:'Short-field landing to target point',acsRef:'IV.F',textRef:'AFH Ch.8',
     subtasks:['Establishes approach at Vref (1.3 × Vso) ± 5 kt','Crosses threshold at correct height (50 ft) at Vref','Touches down within 200 ft beyond the pre-selected target point','Applies maximum braking after all wheels are on ground','Does not float beyond the target due to excess airspeed']}
  ]},

FL15:{id:'FL15',type:'flight',stage:2,title:'Solo Maneuvers Review',
  hrs:{dual:0,solo:1.0,instrument:0,night:0},
  isSolo:true,
  acsItems:['V.A,B Performance Maneuvers','VII.A,B,C Stalls'],
  tolerance:{alt:'±150 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'You are completely alone in the practice area east of KJQF. No safety net. Your plan, your execution, your judgment.',
  whatIf:[
     {q:'What if the student encounters another aircraft in the practice area while solo — what should they do?',a:'Maneuver to maintain visual separation — turn to increase distance, climb or descend to ensure vertical separation, and advise on the appropriate CTAF or practice area frequency if available. Do not continue the assigned maneuver while traffic is a factor. After landing, report the encounter to the instructor. The briefing for every solo should include: practice area traffic procedures, MCA (minimum safe altitude), and emergency contact.'},
     {q:'What if the student\'s self-assessment rates everything S/G but you saw them practicing from a distance and they looked shaky — how do you reconcile?',a:'Bring specific observations to the debrief: \'I observed your first two steep turns from the ramp. Walk me through what you felt on those. How did the altitude hold?\'  The goal is not to \'catch\' the student but to calibrate. If their internal feel doesn\'t match external observation, that\'s important data. Ask them to demonstrate the same maneuver in the next dual session.'},
     {q:'What if the student cancels the solo because the winds picked up to 12 kt on their own — how do you respond?',a:'Affirm the decision completely. A solo student who exercises conservative go/no-go judgment is demonstrating exactly what the training is designed to produce. Say: \'That\'s a great call. You identified a condition outside your comfort zone and made the safe decision. That judgment protects you for the rest of your flying career.\'  Then debrief the decision-making process — which factor triggered the no-go?'},
     {q:'What if the student\'s FITS self-grade says G on steep turns but they write that altitude deviation was 250 ft — what does that tell you?',a:'The student doesn\'t know the ACS standard for steep turns (±100 ft) or is using personal satisfaction rather than objective criteria. Use this in the debrief: \'A G rating means exceeded the standard significantly. The ACS standard is ±100 ft. 250 ft is two and a half times the standard — that\'s an M at best. Self-grading means measuring against the published standard, not against how it felt.\''},
     {q:'What if bad habits appear in solo that never appeared in dual — what does that indicate and how do you address it?',a:'It indicates the student was performing for your presence, not flying correctly. Common examples: skipping clearing turns, sloppy checklists, unnecessary low passes. In debrief, normalize honesty: \'Tell me exactly what you did, not what you think I want to hear.\'  Then address each habit specifically. Introduce regular spot observations from the ground — a student who knows they might be watched maintains standards.'}
  ],
  coaching:'Assign specific maneuvers and a minimum quantity of each. Have the student submit their own written assessment before you debrief.',
  errors:[],
  debrief:['How did your self-grades compare to your typical dual performance?','What happened when you were alone that you didn\'t expect?'],
  tasks:[
    {id:'FL15-1',text:'Solo airwork and self-assessment',acsRef:'V.A,B,VII',textRef:'FITS LCG',
     subtasks:['Completes assigned solo flight in practice area per instructor briefing','Performs minimum 2 steep turns each direction solo','Performs minimum 2 S-turns across a road solo','Performs minimum 3 power-off stalls solo (straight flight)','Performs minimum 2 power-on stalls solo','Completes written FITS self-assessment: rates each maneuver type U/M/S/G/E with specific notes','Identifies 2 areas for improvement in own written self-assessment']}
  ]},

FL16:{id:'FL16',type:'flight',stage:2,title:'Navigation Systems',
  hrs:{dual:1.5,solo:0,instrument:0.5,night:0},
  acsItems:['VI.B Nav Systems','VIII.E Unusual Attitudes','VIII.F Radio/Nav/Radar (IR)'],
  tolerance:{alt:'±200 ft',hdg:'±20°',spd:'+10/−5 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Flying from KJQF to practice area using VOR navigation, you inadvertently enter haze. Continue using nav systems and instruments; recover from unusual attitudes the instructor induces.',
  whatIf:[
     {q:'What if the student intercepts the wrong radial (180° reciprocal) and doesn\'t notice for 5 minutes — how do you teach VOR orientation to prevent this?',a:'Drill the orientation test before every VOR track: OBS set to desired course, CDI deflection tells you which side of the course you\'re on, TO/FROM tells you which direction to fly. A common mistake is flying toward the needle with a FROM indication — that\'s flying away from the course. Practice the orientation question: \'If I\'m on this radial and this flag, which way do I turn to intercept?\'  It must become instinctive.'},
     {q:'What if the autopilot holds altitude perfectly but the student stops scanning instruments — how do you intervene?',a:'Tap the panel: \'Keep scanning — tell me what each instrument shows right now.\'  Automation bias is a genuine risk — pilots who delegate to the autopilot stop monitoring the situation. The airspeed can drift, a frequency can be wrong, or traffic can appear. The autopilot flies the aircraft; the pilot manages the flight. Brief this distinction before every flight with automation: \'The AP flies, you manage.\''},
     {q:'What if during an unusual attitude recovery the student pulls before rolling wings level — what happens and why is it dangerous?',a:'In a nose-low spiral, pulling before wings level increases the load factor, which tightens the spiral and increases airspeed simultaneously. The correct recovery is: power OFF, WINGS LEVEL, then gently pull. If the nose is very low and airspeed is increasing rapidly, exceeding VA is a risk. Drill the verbal sequence as a checklist before every UA exercise and debrief any deviation immediately.'},
     {q:'What if the GPS shows the destination ahead but the VOR radial says you\'re 10° off — which do you trust and why?',a:'Identify the discrepancy and investigate before concluding. The GPS is almost always more accurate for position — but check: is the VOR correctly tuned and identified? Is the OBS set correctly? Is the CDI mode set to VOR? If the VOR checks are correct and the discrepancy persists, report it as a possible NOTAM-worthy VOR accuracy issue. In VFR flight, cross-check both with visual landmarks.'},
     {q:'What if haze reduces visibility to 3 SM and you\'re 15 NM from KJQF under the hood — what\'s your decision?',a:'Remove the hood immediately — hood work requires that the safety pilot (CFI) has clear visual references for traffic and obstruction avoidance. At 3 SM visibility, continuing under the hood is not acceptable. Navigate by VOR and GPS, request flight following for traffic advisories, and return to KJQF directly. Brief this contingency before every hood flight: \'If visibility drops below 5 SM, hood work stops.\''}
  ],
  coaching:'Unusual attitude recovery must be fast and correct. The nose-low case (incipient spiral) is most dangerous — power off first, wings level, THEN pull. Students often forget the power step.',
  errors:['Wrong recovery sequence for nose-low UA (should be power-off, wings level, pull)','Not trusting instruments vs. vestibular sense','Chasing CDI needle instead of deliberate corrections'],
  debrief:['Describe the correct nose-low unusual attitude recovery in order.','CDI 1 dot left of course with TO flag — which way do you turn?'],
  tasks:[
    {id:'FL16-1',text:'VOR navigation: interception and tracking',acsRef:'VI.B',textRef:'AFH Ch.9; PHAK Ch.16',
     subtasks:['Tunes and identifies VOR using morse code before trusting the CDI','Sets OBS to intercept course and determines which side of the course the aircraft is on','Intercepts the selected radial within ±2 dots at a reasonable crossing angle (45°)','Tracks the radial: makes corrections proportional to CDI deflection (not chase needle)','Identifies station passage correctly (TO/FROM flag flip)','Tracks the radial outbound after station passage']},
    {id:'FL16-2',text:'GPS navigation: flight plan and tracking',acsRef:'VI.B',textRef:'PHAK Ch.16',
     subtasks:['Enters destination as direct-to and activates in the GPS unit','Correctly interprets GPS CDI and course deviation bar','Enters a multi-waypoint flight plan and correctly sequences waypoints','Monitors GPS groundspeed and updates ETE estimates during flight','Correctly identifies GPS database currency and RAIM status']},
    {id:'FL16-3',text:'Recovery from unusual attitudes (IR)',acsRef:'VIII.E',textRef:'AFH Ch.9',
     subtasks:['Demonstrates nose-high UA recovery (under hood): REDUCE power, LEVEL wings, increase airspeed','Demonstrates nose-low UA recovery (under hood): REDUCE power FIRST, LEVEL wings, THEN pull gently','Does not apply back pressure before wings are level in nose-low recovery','Recovers to straight-and-level within ±300 ft of original altitude','States why nose-low recovery requires power reduction first (prevent overspeeding and structural damage)']}
  ]},

FL17:{id:'FL17',type:'flight',stage:2,title:'Dual Cross-Country',
  hrs:{dual:1.7,solo:0,instrument:0,night:0},
  acsItems:['VI.A Pilotage/DR','VI.B Nav Systems','VI.C Diversion','VI.D Lost Procedures'],
  tolerance:{alt:'±200 ft',hdg:'±15°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'KJQF→KGSO→KFAY→KJQF. ~240 NM triangle. Real flight following. Instructor inserts diversion 30 min into flight: "engine running rough — pick the nearest suitable airport."',
  whatIf:[
     {q:'What if actual groundspeed is 20 kt less than planned — how does that affect fuel and what do you do?',a:'Recalculate immediately. If planned GS was 100 kt and actual is 80 kt, flight time increases 25% and fuel burn per mile increases proportionally. Check fuel state against revised ETE. If the reserve drops below 30 minutes (day VFR), divert to an intermediate airport. Log the actual groundspeed over each checkpoint — don\'t wait until you\'re low on fuel to notice the deviation.'},
     {q:'What if Charlotte Approach gives you a vector that takes you toward a restricted area — what do you say?',a:'\'Charlotte Approach, [callsign], verify — that vector appears to take us toward [area]. Request confirmation.\' ATC can make errors. You\'re not being insubordinate — you\'re practicing good CRM. If ATC confirms and you\'re in Class E or G airspace, you can accept. If it genuinely enters restricted airspace, say \'Unable\' and request an alternate vector. Document the incident after landing.'},
     {q:'What if weather at KGSO is 1,500 OVC when the TAF said VFR — walk through your decision.',a:'1,500 OVC is technically VFR (above 1,000 ft ceiling in Class D/E) but marginal. First: is the ceiling trending up or down? Check current METAR and PIREP. Second: what is your alternate if KGSO goes below minimums? Third: do you have enough fuel for the alternate? Fourth: is the training objective worth accepting marginal conditions? If any answer is unsatisfying, divert or return. TAFs are forecasts — METARs are facts.'},
     {q:'What if you\'re at KFAY and the self-serve pump is out of order — what are your options for getting home?',a:'Check for full-service fueling at the FBO — it may cost more but will get you home. Call ahead to other nearby airports on your route that have fuel. If KJQF is within safe range on current fuel (plus reserve), continue. If not, this becomes a fuel planning emergency — contact FSS, check for alternatives, and do not depart with less than legal reserve. Fuel is non-negotiable.'},
     {q:'What if the student completely loses situational awareness and can\'t find KJQF on the sectional — how do you coach without giving the answer?',a:'Use the Socratic method: \'What was our last confirmed checkpoint? How long ago? What was our heading and groundspeed? Put yourself on the chart based on that.\'  Give them the clues — last known position, heading, time, speed — and let them work the dead reckoning. This is more valuable than pointing to KJQF. If they genuinely cannot determine position in 2–3 minutes, use GPS to verify and debrief the process.'}
  ],
  coaching:'Student uses the flight plan prepared in GL11. Throw in the diversion early. At the unfamiliar airport, have the student taxi without asking for progressive taxi.',
  errors:['Fixating on GPS instead of looking for visual checkpoints','Not logging checkpoint times (how do you know your GS?)','Forgetting to close flight plan','Not requesting flight following early enough'],
  debrief:['How did actual checkpoint times compare to your planned ETEs?','On the diversion, how did you determine the heading without recalculating from scratch?','What was the hardest part of talking to Charlotte Approach?'],
  tasks:[
    {id:'FL17-1',text:'Preflight planning and weather brief',acsRef:'I.C,I.D',textRef:'PHAK Ch.16',
     subtasks:['Student presents completed navlog prepared in GL11 — instructor reviews before flight','Student has obtained standard weather briefing: summarizes findings and go/no-go decision','W&B confirmed within limits for planned fuel and occupants','VFR flight plan form completed and ready to file','NOTAMs checked for all three airports and along route','Student briefs instructor on emergency alternates along the route']},
    {id:'FL17-2',text:'Departure, flight following, and pilotage',acsRef:'VI.A,VI.B',textRef:'PHAK Ch.16',
     subtasks:['Opens VFR flight plan after takeoff by calling Charlotte Approach for flight following','Correctly requests flight following: callsign, aircraft type, position, altitude, destination','Logs time over first checkpoint; computes actual groundspeed vs. planned','Identifies visual checkpoints on the sectional as they appear — describes them aloud','Cross-checks GPS groundspeed with E6-B computed groundspeed from logged checkpoints','Updates ETA estimates based on actual groundspeed']},
    {id:'FL17-3',text:'Diversion execution',acsRef:'VI.C',textRef:'PHAK Ch.16',
     subtasks:['When instructor calls the diversion, student immediately identifies closest suitable airport on sectional','Estimates magnetic heading to divert airport using top-of-chart reference — within 15°','Estimates distance and ETE using the ½ inch per 10 NM rule or finger-span method','Revises fuel state: computes fuel remaining and whether diversion airport is within range','Advises Charlotte Approach of diversion: revised destination and reason','Lands at unfamiliar airport safely; taxis without progressive taxi assistance']},
    {id:'FL17-4',text:'Lost procedure and flight plan closure',acsRef:'VI.D',textRef:'PHAK Ch.16',
     subtasks:['When instructor simulates "lost" scenario: climbs for better reception and visibility','Attempts to identify position from sectional using dead reckoning and landmarks','Calls Charlotte Approach: admits uncertainty, requests radar identification and vector','Correctly squawks 7700 when instructor simulates communication failure scenario','Closes VFR flight plan by phone or radio after landing at final destination','Documents the flight: updates navlog with actual times, notes on diversions']}
  ]},

FL18:{id:'FL18',type:'flight',stage:2,title:'Night Flight — Local',
  hrs:{dual:1.3,solo:0,instrument:0.3,night:1.3},
  acsItems:['XI.A Night Operations','IV.A,B Night T/O and Landing'],
  tolerance:{alt:'±150 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Departing KJQF at dusk, transitioning to full night. Complete 10 takeoffs and 10 full-stop landings at KJQF before tower closes. VASI is your lifeline on final.',
  whatIf:[
     {q:'What if the student flares too high on a night landing and balloons — what\'s your call as CFI?',a:'Call \'go around\' immediately. A balloon at night over a dark approach environment is one of the highest-risk moments in student training — there\'s no reliable visual reference for height and the tendency to continue increases the stall risk. The go-around call should be immediate and non-negotiable. Debrief: the PAPI is more important at night than during the day precisely because of the black-hole illusion.'},
     {q:'What if after 5 T&Gs the student develops a pattern of landing left of centerline — root cause and fix?',a:'Left-of-centerline drift on landing is almost always a failure to use right rudder to counteract left-turning tendencies at low airspeed/high power during the flare. It can also be fixation on the left side of the runway rather than looking down the centerline. Fix: \'Look at the far end of the runway, not the numbers. Add right rudder as you flare.\'  The pattern will correct immediately with the right visual reference.'},
     {q:'What if a NOTAM closes KJQF\'s PAPI on runway 20 for tonight\'s flight — how do you adjust the lesson?',a:'Use the VGSI on the other runway if available, or plan to use the glideslope guidance from a GPS approach overlay as a reference if the aircraft is equipped. If no electronic glidepath reference is available, delay the night lesson — flying night approaches without glidepath guidance as a student is not consistent with a safe training environment. PAPI is critical for night approaches.'},
     {q:'What if the student reports feeling disoriented on the base-to-final turn — what do you suspect and do?',a:'Suspect the leans or spatial disorientation — the vestibular system is unreliable at night when visual references are limited. Take the controls, re-establish visual contact with the airport lights, and stabilize on final. Discuss the phenomenon: the inner ear says the bank is gone, but the instruments say otherwise. Trust instruments, trust the PAPI, and fly the visual glidepath.'},
     {q:'What if radiation fog begins to form over the valley floor during the lesson — at what visibility do you call it and land?',a:'Brief this threshold before the flight: \'If visibility drops below 5 SM or the runway environment becomes unclear from 3 miles out, we land immediately.\'  Night radiation fog forms rapidly — what starts as haze at 8 SM can become 1 SM in 20 minutes. Monitor the ATIS throughout the lesson. When in doubt, land. At night, always err on the side of landing early.'}
  ],
  coaching:'KJQF runway lights and PAPI are ideal for night training. The black hole illusion on dark approaches is very real — trust the VASI completely.',
  errors:['Fixating on runway lights and losing glidepath','Flaring too high (black hole illusion)','Not turning on all aircraft lighting and strobes','Not allowing 30 min for dark adaptation before first takeoff'],
  debrief:['Why is VASI more important at night than during the day?','What is the "black hole" approach illusion?','Engine failure at 1,500 ft AGL at night over the valley — how do you select a landing area?'],
  tasks:[
    {id:'FL18-1',text:'Night preflight and equipment check',acsRef:'XI.A',textRef:'AFH Ch.10',
     subtasks:['Performs preflight using flashlight — inspects all surfaces and control surfaces','Verifies all navigation lights: red (left), green (right), white (tail)','Verifies anti-collision lights (strobe and/or rotating beacon) operational','Checks cockpit lighting: instrument backlighting, map light, adjustable to preserve night vision','Verifies flashlight (two preferred) and extra batteries','Reviews night emergency procedures before flight: engine failure field identification']},
    {id:'FL18-2',text:'Night pattern, full-stop landings, and towered airport requirement',acsRef:'XI.A,III.B',textRef:'14 CFR ?61.109',
     subtasks:['Performs 10 takeoffs and 10 landings to a full stop at KJQF (towered airport, satisfies ?61.109(a)(2)(ii))','Logs each full-stop landing cycle; verifies they occur between 1 hr after sunset and 1 hr before sunrise','Maintains proper pattern altitude ?100 ft using altimeter and visual references','Uses VASI/PAPI as primary glidepath reference on all approaches ? does not disregard it','Demonstrates correct night landing flare: does not over-flare or under-flare due to black hole illusion','All radio calls made correctly on tower frequency; reads back all clearances']}
  ]},

FL19:{id:'FL19',type:'flight',stage:2,title:'Night Cross-Country',
  hrs:{dual:1.7,solo:0,instrument:0.4,night:1.7},
  acsItems:['XI.A Night Operations','VI.A Pilotage/DR','VIII.A-F Instrument Maneuvers'],
  tolerance:{alt:'±200 ft',hdg:'±15°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Night XC: KJQF→KHKY→KGSO→KJQF. ~150 NM. Total darkness over the piedmont below. Navigate by the lights of Salisbury and Greensboro.',
  whatIf:[
     {q:'What if the temp/dew point spread at KJQF collapses to 2°C while you\'re en route on the night XC — what\'s your action?',a:'Two degrees spread means fog is possible within the hour. Check the current METAR for KJQF, get a PIREP, and request a weather update from Charlotte Approach. If the trend is toward zero spread, divert to an alternate that is above the fog layer or away from the low-lying piedmont valleys where fog forms first. Do not continue toward an airport that may be IFR on arrival.'},
     {q:'What if the student can\'t find KHKY\'s runway environment from 10 miles out at night — what do you tell them to do?',a:'Check the chart for the beacon (alternating white/green for lighted airport) and call 5 NM out on CTAF to activate PCL (Pilot Controlled Lighting) if available. Activate PCL by clicking the mic 7 times on CTAF. If the airport has an AWOS, tune it and listen for the station identifier to confirm you\'re looking in the right area. As a last resort, use GPS final approach course overlay to align with the runway axis.'},
     {q:'What if KHKY tower closes at 10pm and you planned to land there — what changes?',a:'KHKY becomes a non-towered airport after hours — use the published CTAF frequency for position calls. Check the Chart Supplement for after-hours hours and CTAF. Night CTAF operations require extra vigilance — make position calls early and often: 10 miles out, 5 miles, entering downwind, base, final. If runway lighting is PCL, know the frequency and activation sequence in advance.'},
     {q:'What if you\'re 40 NM from KJQF on the return leg and a thin overcast develops below you — you\'re VFR on top at night — what now?',a:'This is a serious emergency. You cannot descend through the overcast VFR at night, and you are not IFR rated. Declare an emergency immediately. Tell Charlotte Approach your situation: VFR on top at night, unable to descend through clouds. They will vector you to an area where you can descend VMC, or provide an IFR clearance if necessary. Do not attempt to find a hole at night — clouds and terrain look identical.'},
     {q:'What if the student is exhausted after 1.5 hours of night flying and still has 30 minutes to go — how do you manage the flight?',a:'Take the controls for the demanding portions (approach and landing) if fatigue is affecting safety. Fatigue impairs judgment, reaction time, and motor skills significantly. Document the situation and address it before the next night flight with a discussion of fatigue management. Consider ending the lesson early if an acceptable landing field is nearby — there is no training objective worth a fatigued student attempting a night approach.'}
  ],
  coaching:'Satisfies ?61.109(a)(2)(i): one dual night cross-country of more than 100 NM total distance. Continue solo XC preparation separately under ?61.93.',
  errors:['Using city lights for attitude reference (dangerous)','Getting disoriented over dark terrain','Forgetting night fuel reserve adds 45 min vs. day 30 min'],
  debrief:['How was navigation different at night than daytime?','What dangers does dark terrain present that daytime doesn\'t?','You now have your XC endorsement — what does that authorize you to do?'],
  tasks:[
    {id:'FL19-1',text:'Night XC planning (?100 NM, satisfies ?61.109)',acsRef:'XI.A,I.D',textRef:'14 CFR ?61.109',
     subtasks:['Plans route: KJQF→KHKY→KGSO→KJQF — total distance exceeds 100 NM as required','Calculates night VFR fuel: 45-minute reserve (§91.151(a)(2)) — not the 30-minute day requirement','Identifies en-route alternates with night lighting: rotating beacon, runway lights','Reviews night weather: potential for radiation fog formation (check temp/dew point spread)','Briefs emergency field identification over dark terrain: dark areas surrounded by lights = fields','Files VFR flight plan; opens after departure with Charlotte Approach for flight following']},
    {id:'FL19-2',text:'Night navigation and operations at unfamiliar airport',acsRef:'XI.A,VI.A',textRef:'AFH Ch.10',
     subtasks:['Navigates by city lights, VOR, and GPS — cross-checks all three methods','Identifies each en-route checkpoint using sectional and actual lights below','Communicates correctly with KHKY and KGSO: Tower (KGSO) and CTAF (KHKY if uncontrolled after hours)','Requests runway lighting adjustment (PCL) if applicable at uncontrolled airport','Lands at each unfamiliar night airport safely with VASI/PAPI use']},
    {id:'FL19-3',text:'Solo XC endorsement readiness review',acsRef:'?61.93',textRef:'14 CFR ?61.93',
     subtasks:['Instructor reviews solo XC readiness after the dual night XC but does not issue a route endorsement solely because this lesson was completed','Student understands ?61.93 solo XC endorsements are route-specific and require instructor review for each solo XC flight','Student knows solo XC endorsements include route, airport, and limitation review as applicable','Logbook entries for dual night XC completed: date, route, night time, total time, instructor signature']}
  ]},

FL20:{id:'FL20',type:'flight',stage:2,title:'Solo Cross-Country (Part 61/141)',
  hrs:{dual:0,solo:2.0,instrument:0,night:0},
  isSolo:true,
  acsItems:['§61.109(a)(5) Solo XC Requirements'],
  tolerance:{alt:'Solo PIC',hdg:'No instructor',spd:'Solo PIC'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Your first solo XC. You planned it, you briefed it, you fly it alone. No safety net. Pure PIC.',
  whatIf:[
     {q:'What if the weather at your destination deteriorates below VFR minimums while you\'re en route solo — what is your exact decision process?',a:'Immediately: assess fuel state and identify the nearest alternate. Do not continue toward an airport you know is IFR. Declare minimum fuel early if applicable. Divert to the alternate — you have a filed plan, you have fuel (with reserve), and you have a sectional. Call Charlotte Approach for weather updates and flight following. Land at the alternate, call your CFI, and wait out the weather. This is the right decision — not a failure.'},
     {q:'What if you\'re halfway through the solo XC and your fuel is lower than your navlog predicted — what do you do?',a:'Stop and assess: compute actual fuel state and remaining flight time at actual groundspeed. If reserve will be less than 30 minutes on arrival, divert to fuel now. Do not rationalize — \'probably fine\' is not acceptable. Call Charlotte Approach for a weather check at your intended fuel stop. Land, fuel, call your CFI to update them, then continue if fuel and weather are acceptable.'},
     {q:'What if you get lost — truly unsure of your position — what are the 5 Cs and which do you do first?',a:'First: Climb — more altitude gives better radio reception, better visibility of landmarks, and more glide distance if the engine fails. Then Circle to maintain position while you think. Then Confess — call ATC or FSS and admit you\'re uncertain: \'Uncertain of my position, request radar identification.\' Then Communicate — squawk 7700 if appropriate, provide all available information. Then Comply with ATC vectors. Climbing is first because everything else depends on it.'},
     {q:'What if an unfamiliar controller gives you an instruction you don\'t understand — what exactly do you say?',a:'\'[Your callsign], say again.\' If still unclear: \'[Your callsign], unable to understand last clearance, please say again slowly.\' If a clearance would require you to do something unsafe: \'Unable.\' Never read back a clearance you didn\'t understand — that\'s how controlled flight into terrain happens. ATC expects read-backs — a read-back means you understood. Only read it back when you did.'},
     {q:'What if you land at an unfamiliar airport and can\'t figure out how to exit the runway — what\'s your priority?',a:'Stop on the runway (safely, past the touchdown zone) and call ground or tower: \'[Callsign], request progressive taxi — unfamiliar with the airport.\' Any controller will provide progressive taxi instructions — it is not embarrassing, it is the safe thing to do. Never taxi to an unknown area. A wrong turn can put you on an active runway, on a taxiway under construction, or in a grass area.'}
  ],
  coaching:'Review the student\'s plan before endorsing. KJQF→KGSO→KRWI→KJQF (~240 NM, exceeds both Part 61 and 141). Set a radio check schedule.',
  errors:[],
  debrief:['Walk me through your trip — moment by moment, best decisions and toughest moments.','How did planned vs. actual groundspeed compare?','Did you request flight following? What was that like solo?'],
  tasks:[
    {id:'FL20-1',text:'Solo XC: ≥150 NM, 3 airports, 1 leg ≥50 NM, 1 towered',acsRef:'§61.109(a)(5)',textRef:'14 CFR §61.109',
     subtasks:['Student independently completes full navlog, weather brief, W&B, and NOTAMs','Instructor reviews and endorses specific route per §61.93(c)(3)','Solo XC: total distance ≥150 NM (Part 61); lands at minimum 3 airports','One leg ≥50 NM straight-line distance from departure','Minimum 3 solo T/O and full-stop landings at a towered airport','Closes VFR flight plan at completion; calls instructor upon safe landing','Completes post-flight: fuel, tie-down, hobbs entry, written self-assessment']}
  ]},

FL20A:{id:'FL20A',type:'flight',stage:2,title:'Solo XC #2 (Part 61)',
  hrs:{dual:0,solo:3.0,instrument:0,night:0},
  isSolo:true,
  acsItems:['§61.109(a)(5) Solo XC'],
  tolerance:{alt:'Solo PIC',hdg:'No instructor',spd:'Solo PIC'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Different destination, same autonomy. KJQF→KGSO via the coast, or KJQF→KRUQ (Rowan County).',
  whatIf:[
     {q:'What if the routing you planned overflies a restricted area you didn\'t notice — how do you catch that in planning?',a:'Use ForeFlight\'s airspace briefing or manually trace your route on a current sectional for every leg. Restricted areas appear as blue hash-marked borders on sectionals. Also check the TFR summary in your weather briefing — TFRs can overlay restricted areas. During flight, monitor the GPS flight plan for airspace alerts. If you\'re unsure, call Charlotte Approach and ask for advisories along your route.'},
     {q:'What if your alternator shows discharge 30 NM from the destination on the solo XC — what\'s your plan?',a:'Shed non-essential electrical load immediately. Communicate your situation to ATC and advise them you may lose radio. Navigate to the nearest suitable airport — not necessarily your destination. A 30 NM battery-only flight is close to the limit for most GA aircraft (20–30 min battery endurance). Squawk 7600 preemptively so ATC knows if you go silent. Land without delay.'},
     {q:'What if the FBO at your destination is closed and you need fuel to get home — what are your options?',a:'Check for a self-serve fuel station on the field (common at GA airports). Call the FBO number posted — some have after-hours fuel. Check for an alternative airport within gliding distance that has fuel. If stuck, call your CFI for guidance and document the situation. Departing with less than legal fuel reserve is not an option regardless of schedule pressure.'},
     {q:'What if a VFR pilot calls on CTAF going the wrong direction at an uncontrolled airport — what do you do?',a:'Transmit on CTAF: \'[Your callsign], [position] — advise traffic in the area the standard pattern is [left/right] traffic for runway [XX]. Please confirm your intentions.\' If they don\'t respond, maneuver to avoid them. Increase spacing, extend downwind, or break off the approach. Your safety does not depend on the other pilot complying — it depends on your avoidance.'},
     {q:'What if you arrive back at KJQF and tower is closed (equipment failure) — how do you enter the pattern?',a:'KJQF becomes a non-towered airport. Use CTAF (published in Chart Supplement) and make standard position calls. Enter on a 45° to the downwind, follow standard pattern geometry, and look for light gun signals in case partial tower function is still available. Check TFR status — a tower failure may cause a TFR or NOTAM to be issued. Land and file a report with the FSDO if appropriate.'}
  ],
  coaching:'Part 61 only. Different destination than FL20. KFAY or KPVF (Placerville) are good options.',
  errors:[],debrief:[],
  tasks:[{id:'FL20A-1',text:'Second solo XC to different destination',acsRef:'§61.109',textRef:'14 CFR §61.109',
    subtasks:['Plans and briefs different route than FL20 — instructor reviews and endorses','Lands at airport ≥50 NM from KJQF','Files and closes VFR flight plan independently','Written self-assessment completed and shared with instructor before debrief']}]},

FL20B:{id:'FL20B',type:'flight',stage:2,title:'Solo XC or Local (Part 61)',
  hrs:{dual:0,solo:2.0,instrument:0,night:0},
  isSolo:true,
  acsItems:['§61.109 Requirements'],
  tolerance:{alt:'Solo PIC',hdg:'No instructor',spd:'Solo PIC'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Final solo XC or local solo to complete Part 61 time requirements.',
  whatIf:[
     {q:'What if this is the last solo before your stage check and you still feel unprepared on short-fields — do you practice them solo or wait for dual?',a:'Wait for dual. Practicing a technique you\'re uncertain about, alone, at low altitude, without an instructor, is not the appropriate training environment. Ask your CFI for an additional dual lesson focused on short-field precision before the stage check. There is no deadline — an adequately prepared stage check is more valuable than a rushed one.'},
     {q:'What if a solo practice stall gets closer to a spin entry than intended — what do you do and report to your CFI?',a:'Recover using PARE immediately — Power off, Ailerons neutral, Rudder opposite, Elevator briskly forward. Do not continue stall practice after an inadvertent spin entry — climb back to altitude and return to the airport. Report it to your CFI fully and honestly, including altitude, configuration, and what you think happened. The CFI needs to know. Concealing it is dangerous and would prevent corrective training.'},
     {q:'What if you notice an oil streak on the cowl during your preflight that wasn\'t there before — do you fly?',a:'No — not without CFI review. A new oil streak indicates an active oil leak. Oil leaks can worsen, cause engine fire, or lead to rapid oil loss and engine failure. Write it up and have an A&P inspect it. If the streak is old and static (same size, dry, not growing), document it and consult maintenance. When in doubt, do not fly — an oil leak that grows from streak to stream happens fast.'},
     {q:'What if you land with 2 gallons more than expected — what does that tell you about your navlog fuel burn estimate?',a:'Your burn rate was lower than planned, your groundspeed was higher, or your flight time was shorter. This is actually useful data — update your fuel burn estimate for future flights and note the conditions that produced it. Also check: did you lean the mixture as planned? Did you fly at the planned power setting? Accurate fuel planning requires accurate burn rate data — track it every flight.'},
     {q:'What if you\'re cleared to land number 2 and traffic ahead goes around — what\'s your responsibility now?',a:'Immediately advise tower: \'[Callsign], traffic ahead is going around.\' Do not continue your approach and assume the runway will be clear. Tower will sequence you — expect a go-around clearance, extended final, or a hold. Begin a go-around on your own if closure rate to the other aircraft is increasing. The separation responsibility is yours as much as ATC\'s — do not assume ATC will catch everything.'}
  ],
  coaching:'Part 61 only. May substitute local solo if 40-hr total is primary objective.',
  errors:[],debrief:[],
  tasks:[{id:'FL20B-1',text:'Final solo XC or local to meet Part 61 totals',acsRef:'§61.109',textRef:'14 CFR §61.109',
    subtasks:['Plans and briefs flight; instructor reviews and endorses for XC route if applicable','Completes flight within solo authorization area and limitations','Closes flight plan and logs time correctly','Totals to date reviewed: dual XC, solo, instrument, night, T&Gs — all on track']}]},

FL21:{id:'FL21',type:'flight',stage:2,title:'Maneuvers Review',
  hrs:{dual:1.2,solo:0,instrument:0,night:0},
  acsItems:['All ACS Areas'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Full ACS profile flight — simulated checkride from start to end. Debrief identifies remaining gaps.',
  whatIf:[
     {q:'What if every maneuver is technically within tolerance but there\'s no confidence or precision — is the student ready?',a:'This is a judgment call that requires honesty. \'Technically within tolerance\' means the maneuver passed — but if it was barely within tolerance every time with no margin, the student is performing at the lower edge of the standard. The practical test will add evaluator pressure, wind, and unfamiliar conditions. Margin matters. More practice to build consistency is appropriate.'},
     {q:'What if the simulated engine failure puts you over downtown Concord at 1,500 AGL — what do you do?',a:'Best glide immediately. Identify the highest, flattest, clearest area reachable — a school athletic field, a parking lot, a golf course. Roads are options but power lines and traffic make them worse than open fields. Set up a realistic approach to that field. Transmit Mayday on 121.5. Brief the simulated passenger. After the simulated landing, explain: \'There are always fields in the Concord area within gliding distance if you have altitude.\''},
     {q:'What if the student passes all maneuvers but can\'t describe what they\'re going to do before they do it — what does that indicate?',a:'The student is performing by feel, not by principle. For a checkride, the DPE will ask \'What are you going to do and why?\' before each maneuver. If the student can\'t describe it, they won\'t be able to answer. This is a flag for oral preparation and conceptual understanding. Add structured verbal briefings before each practice maneuver: \'Tell me your plan for this steep turn before you start.\''},
     {q:'What if the student\'s short-field touchdown is within 200 ft but they used heavy braking that would have ground-looped on a real soft field — what do you say?',a:'Credit the short-field technique (within 200 ft) and address the braking separately as a teachable note: \'That touchdown and rollout distance were perfect. On a real soft field, that braking would have dug in and flipped the aircraft. Let\'s talk about how you would modify the technique for a soft surface.\'  Don\'t conflate the two skills — short-field and soft-field are different techniques.'},
     {q:'What if this mock ride reveals the student is not ready for the stage check — how do you have that conversation?',a:'Be direct, specific, and constructive. \'Based on today, I don\'t think we should schedule the stage check yet. Here are the three areas that need work: [list them precisely]. Here\'s what I want to see before we proceed: [specific standards]. Let\'s schedule two more lessons focused on these areas.\'  Avoid vague feedback like \'you just need more practice.\' The student needs to know exactly what the target is.'}
  ],
  coaching:'Fly this as a dry run for Stage 2 check. Debrief professionally. Student must leave knowing exactly what to work on in FL22 and FL24 solo practice.',
  errors:[],
  debrief:['Based on today, rank your top 3 areas to improve before Stage 2 check.'],
  tasks:[
    {id:'FL21-1',text:'All takeoff and landing types — ACS standard',acsRef:'IV.A-H',textRef:'AFH Ch.5,8',
     subtasks:['Normal T/O and landing: smooth technique, centered, within tolerance','Soft-field T/O: continuous motion onto runway; accelerates in ground effect','Soft-field landing: minimum sink rate, nose held off until groundspeed allows','Short-field T/O: max braking, Vr, Vx climb to clear obstacle ±10 ft','Short-field landing: touchdown within 200 ft of target at Vref ±5 kt','Forward slip: correct crossed-control technique, removed before flare','Go-around: immediate on call, FULL power, correct flap retraction sequence']},
    {id:'FL21-2',text:'Stalls and slow flight — ACS standard',acsRef:'VII.A,B,C,D',textRef:'AFH Ch.4',
     subtasks:['Slow flight: established within ±100 ft, maintained for 60 seconds with turns','Power-off stall (straight): correct recovery, ±100 ft altitude loss from entry altitude','Power-off stall (turning): correct recovery, directional control maintained','Power-on stall: directional control throughout; recovers at first indication','Demonstrates spin awareness: states entry conditions and PARE recovery']},
    {id:'FL21-3',text:'Navigation, emergency, and instruments',acsRef:'VI,VIII,IX',textRef:'AFH Ch.9,17',
     subtasks:['Simulated emergency approach: ABCDE complete, realistic field selection, correct energy management','Instrument maneuvers: S&L ±200 ft, climbs/descents ±100 ft lead, turns ±20° rollout','Unusual attitude recovery: both nose-high and nose-low correctly and promptly','Diversion: correctly identifies alternate on sectional within 30 seconds','Lost procedure: 5 Cs performed in correct sequence without prompting']}
  ]},

FL22:{id:'FL22',type:'flight',stage:2,title:'Solo Practice',
  hrs:{dual:0,solo:0.8,instrument:0,night:0},
  isSolo:true,
  acsItems:['As assigned from FL21'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Targeted solo practice based on FL21 debrief.',
  whatIf:[
     {q:'What if the student\'s solo self-grade says they\'ve improved but your notes from FL21 show the same errors — what do you do in the debrief?',a:'Bring the FL21 debrief notes to FL22\'s debrief. Ask: \'In FL21 we noted X. How did X go today?\'  If the student didn\'t specifically work on X, ask why not. If they worked on it but the error persists, identify whether it\'s a knowledge gap, technique gap, or both. Self-assessment that doesn\'t reference prior debrief items is not using the FITS framework correctly — the whole point is identifying and closing gaps.'},
     {q:'What if the student practices the wrong maneuvers (not what you assigned) — what does that tell you?',a:'It tells you that either the assignment wasn\'t clear, the student didn\'t retain the brief, or they chose what they were comfortable with rather than what they needed. In debrief, find out which: \'Walk me through what you practiced and why.\'  For future solos, use a written assignment card that the student reads back to you before departure. \'I\'m assigning [specific maneuvers]. What did I just assign you?\''},
     {q:'What if a solo circuit goes wrong and the student goes around for the right reason — how do you affirm that decision in the debrief?',a:'Lead with it: \'The most important thing that happened in that flight was your go-around on circuit 2. That was the right decision, made for the right reason, at the right time. That\'s what good pilots do.\' Reinforce self-initiated go-arounds specifically and enthusiastically — it\'s one of the best judgment behaviors a student can demonstrate and it should be explicitly celebrated.'},
     {q:'What if the student lands with full flaps when you assigned no-flap practice — did they read the brief?',a:'Ask, don\'t assume: \'I assigned no-flap landings. Walk me through what you flew.\'  If they forgot: use written briefing cards for future solos. If they chose to change it: discuss why — was it weather, traffic, or a judgment call? An appropriate deviation (unexpected strong wind requiring flaps) is actually good ADM. An inappropriate one (forgot) is a process issue. The debrief question reveals the cause.'},
     {q:'What if the student\'s self-assessment on this solo is identical to FL15\'s self-assessment despite being 12 lessons later — what does that suggest?',a:'It suggests the student is filing out the assessment form as an obligation rather than as a genuine self-evaluation. They may not remember FL15\'s assessment, or they may be using the same language out of habit. Ask them to compare: \'What was your biggest weakness in FL15? How has that changed?\' If they can\'t answer, the self-assessment process hasn\'t been internalized. Spend time teaching how to evaluate oneself, not just how to fill out the form.'}
  ],
  coaching:'Assign specific maneuvers identified as weak in FL21.',
  errors:[],debrief:[],
  tasks:[{id:'FL22-1',text:'Targeted solo practice per FL21 debrief',acsRef:'Per FL21',textRef:'AFH',
    subtasks:['Performs minimum 3 short-field landings solo to ACS standard','Performs minimum 3 soft-field T/Os solo to ACS standard','Practices 2 specific maneuvers assigned by CFI based on FL21 debrief','FITS self-assessment: rates each maneuver U/M/S/G/E, identifies improvement from FL21']}]},

FL23:{id:'FL23',type:'flight',stage:2,title:'Maneuvers Review (with IR)',
  hrs:{dual:1.2,solo:0,instrument:0.3,night:0},
  acsItems:['VIII.A-F Instrument Maneuvers','All ACS Areas'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isSolo:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Final dual session before Stage 2. Everything on the table.',
  whatIf:[
     {q:'What if the student passes all flight tasks but can\'t answer the mock oral questions — what does that mean for stage check readiness?',a:'Not ready for the stage check. The stage check includes an oral evaluation — if the student can\'t pass a mock oral, they won\'t pass the real one. Knowledge and skill must both meet the standard. Schedule additional ground instruction focused on weak knowledge areas. A pilot who can fly but doesn\'t understand what they\'re doing is a safety risk — the practical test evaluates both for this reason.'},
     {q:'What if the student describes the W&B as OK but made a math error that puts them 15 lbs over gross — catch it before or after the flight?',a:'Before — always. Make it a habit to independently check the W&B math before every instructed flight. If you find the error before engine start: use it as a teaching moment without drama. If you found it after: use it as a serious debrief about why W&B is checked and not assumed. Over-gross operation could invalidate insurance, void the airworthiness certificate, and in a real scenario affect performance calculations.'},
     {q:'What if the student correctly recovers from an unusual attitude but admits they guessed — acceptable or not?',a:'Not acceptable as a final standard, but it\'s honest and instructive. Find out what they guessed about: \'You said you guessed — what did you do and what were you uncertain about?\' If they performed the correct physical recovery despite uncertainty, the instinct is good. But understanding must accompany skill before a practical test — the DPE may ask them to explain the recovery.'},
     {q:'What if you\'re confident the student is ready but they say they don\'t feel ready — how do you handle that?',a:'Take it seriously and explore: \'Tell me what specifically doesn\'t feel ready.\' Sometimes students identify genuine gaps that weren\'t visible to you — this is valuable. Other times it\'s anxiety rather than skill deficit — which also matters. If you can identify a specific technical area, address it. If it\'s anxiety, discuss strategies (mock ride simulation, talking through the process) and ultimately remind them: your endorsement reflects your assessment, and you believe they\'re ready.'},
     {q:'What if this lesson reveals the student has forgotten soft-field techniques entirely — do you delay the stage check?',a:'Yes — soft-field takeoff and landing are ACS requirements. A student who can\'t demonstrate them cannot pass the stage check. Schedule a focused lesson (like FL14 review) and then re-evaluate. Communicate this clearly: \'I need to see soft-field T/O and landing to ACS standard before the stage check. Let\'s schedule an additional lesson focused on exactly that.\''}
  ],
  coaching:'Final assessment before Stage 2. Student must be performing all maneuvers to ACS standard consistently. Any remaining weakness must be specifically noted.',
  errors:[],
  debrief:['Are you ready for the Stage 2 check?','What are your remaining weak areas?'],
  tasks:[
    {id:'FL23-1',text:'All ACS maneuvers to standard plus full IR suite',acsRef:'All ACS',textRef:'AFH',
     subtasks:['All T/O and landing types demonstrated within ACS tolerances','Slow flight and all stall types demonstrated within ACS tolerances','Steep turns: ±100 ft altitude, rollout within ±5° entry heading','All instrument maneuvers (VIII.A-F) under hood to ACS tolerances','Unusual attitude recovery: both types, immediate and correct','Emergency approach: realistic, ABCDE complete, no prompting']},
    {id:'FL23-2',text:'Mock checkride oral review',acsRef:'ACS I',textRef:'FAA-S-ACS-6C',
     subtasks:['Student correctly explains all weather service products: METAR, TAF, SIGMET, AIRMET','Student correctly completes W&B calculation for checkride load configuration','Student correctly answers §61.109 hour requirements and confirms personal compliance','Student correctly explains all required endorsements for the practical test','Student identifies their own remaining weak areas honestly — self-awareness confirmed']}
  ]},

FL24:{id:'FL24',type:'flight',stage:2,title:'Solo Practice',
  hrs:{dual:0,solo:0.8,instrument:0,night:0},
  isSolo:true,
  acsItems:['As assigned'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isStageCheck:false,isPresolo:false,isEndOfCourse:false,
  scenario:'Last solo flight before the mock checkride.',
  whatIf:[
     {q:'What if after this solo the student texts you that they made an error but handled it fine — what\'s your response?',a:'First: affirm that they told you. \'I\'m glad you told me — that\'s exactly right.\' Then: \'Tell me exactly what happened.\'  A self-reported error that was handled correctly is excellent ADM data. Don\'t punish honesty — it\'s one of the most important habits to reinforce. Then evaluate: was the handling actually correct? Is there a lesson? Is it a pattern? This conversation is as valuable as any flight.'},
     {q:'What if the student lands 300 ft past their target during solo practice — is that something to debrief or move on?',a:'Debrief it specifically, not punitively. Ask: \'Your target was the displaced threshold. You touched down 300 ft past it. Walk me through your approach — what was your airspeed at the threshold?\'  The ACS standard is within 200 ft. 300 ft is beyond the standard. Understanding why — was it fast, high, or late flare — is the debrief goal. Document it in the lesson record.'},
     {q:'What if the student calls you from the FBO saying the aircraft had an unusual vibration on climbout — what do you tell them to do?',a:'Tell them not to fly the aircraft again until it\'s been inspected. Vibration in climbout at high power can indicate prop damage, engine issue, or airframe problem. Do not diagnose by phone. Have them secure the aircraft, document the observation (vibration onset, RPM, duration), and call the FBO maintenance. You\'ll need to review the aircraft logs and squawk the discrepancy before any further flights.'},
     {q:'What if the student feels ready for the check after this solo — what\'s your process for confirming or challenging that?',a:'Ask them to demonstrate — not tell. \'Walk me through a simulated oral on W&B, weather, and emergency procedures right now.\'  Then schedule a final dual session (FL23 or a repeat) and observe them flying all required tasks. Your endorsement is the final confirmation, not their self-assessment. But student confidence is a positive sign — a student who feels ready usually performs better under evaluation.'},
     {q:'What if this is the last flight before the stage check and you realize a maneuver still isn\'t solid — what do you add to the stage check brief?',a:'Be transparent with the student and the check instructor. The check instructor needs to know what areas need focus. Brief: \'The student has shown inconsistency in [specific maneuver]. I\'d like the check to specifically evaluate this to standard.\'  Do not send a student to a stage check with known deficiencies unexplained — it wastes everyone\'s time and may damage the student\'s confidence unnecessarily.'}
  ],
  coaching:'Assign specific maneuvers from FL23 debrief.',
  errors:[],debrief:[],
  tasks:[{id:'FL24-1',text:'Final solo practice session per FL23 debrief',acsRef:'Per FL23',textRef:'AFH',
    subtasks:['Performs maneuvers assigned by CFI from FL23 debrief','Focuses on top 2 weakness areas identified in FL23','FITS self-assessment completed with honest ratings and specific notes','Compares today\'s self-assessment to FL22\'s assessment — notes improvement or regression']}]},

FL25:{id:'FL25',type:'flight',stage:2,title:'Stage Two Check ★',
  hrs:{dual:1.3,solo:0,instrument:0.2,night:0},
  isStageCheck:true,
  acsItems:['All Private Pilot ACS Areas and Tasks'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isSolo:false,isEndOfCourse:false,
  scenario:'STAGE CHECK — Full mock practical test with check instructor. If satisfactory: endorsements issued. Schedule the DPE.',
  whatIf:[
     {q:'What if the stage check reveals a deficiency the primary CFI missed throughout training — what does that mean for the training program?',a:'It\'s feedback for the CFI as much as the student. Review your lesson records: was the task signed off? Was it actually demonstrated to ACS standard, or were you lenient? Use the deficiency to recalibrate your standards across all students. The stage check system exists exactly for this — it provides an independent evaluation that catches instructor blind spots. Respond professionally, not defensively.'},
     {q:'What if the student passes the flight but clearly guessed on two oral questions — does the check instructor pass them?',a:'Two guesses is not automatically a fail if the answers were correct and the reasoning was eventually sound. But if the guesses indicated a lack of understanding (lucky answer, not knowledge-based), the check instructor should probe deeper. The standard is knowledge and understanding, not just correct answers. The check instructor should follow up: \'How did you arrive at that answer?\' A guess that can\'t be explained is not knowledge.'},
     {q:'What if the student becomes visibly anxious during the check and performance degrades — is that a fail?',a:'Anxiety alone is not a fail — the evaluation is of knowledge and skill, not composure. If performance degrades below ACS tolerances, that\'s a fail regardless of the cause. But if the student recovers and meets the standard despite early anxiety, pass the task. Some pilots perform at lower proficiency under evaluation than in training — the check is designed to evaluate in a higher-pressure environment to provide safety margin.'},
     {q:'What if the check instructor and primary CFI disagree on readiness — who decides and how is it resolved?',a:'The check instructor\'s evaluation stands — they conducted the check under ACS standards and their professional judgment governs the outcome. The primary CFI can discuss the specific deficiencies and provide their perspective, but the check result is not subject to override. If there\'s a genuine methodological dispute, involve the Chief Instructor. Document everything. The student\'s interests are best served by honest evaluation.'},
     {q:'What if the student requests to retake just the oral portion — is that how stage checks work?',a:'In a formal stage check structure, the check is typically either passed or failed in whole. However, if the check instructor determines the flight was satisfactory and only the oral was deficient, it is within their discretion to pass the flight tasks and require only an oral re-evaluation. The Chief Instructor should establish a standard policy. Document the specific oral areas that need re-evaluation clearly.'}
  ],
  coaching:'STAGE CHECK — Must be conducted by check instructor other than primary CFI. Any unsatisfactory area requires additional instruction before re-check.',
  errors:[],debrief:[],
  tasks:[
    {id:'FL25-1',text:'Stage 2 oral examination',acsRef:'ACS I',textRef:'FAA-S-ACS-6C',
     subtasks:['Correctly answers weather questions: decode METAR/TAF/SIGMET/AIRMET for planned flight','Correctly answers navigation questions: W&C, navlog preparation, diversion estimate','Correctly answers regulations questions: §61.109 requirements, currency, endorsements','Correctly answers aircraft performance questions: W&B, DA, T/O and landing distances','Correctly answers human factors questions: IMSAFE, hazardous attitudes, ADM']},
    {id:'FL25-2',text:'Stage 2 full ACS flight evaluation',acsRef:'All ACS',textRef:'FAA-S-ACS-6C',
     subtasks:['All preflight, engine start, taxi, runup: to ACS standard with no prompting','All T/O and landing types: to ACS tolerances','All airwork: slow flight, stalls, steep turns — to ACS tolerances','All navigation maneuvers: pilotage, systems, diversion, lost — to ACS standard','All instrument maneuvers (VIII.A-F) under hood: to ACS tolerances','Emergency approach and landing: correct ABCDE, realistic field, no prompting','§61.39 and §61.103 endorsements issued upon satisfactory completion']}
  ]},

FL26:{id:'FL26',type:'flight',stage:3,title:'FAA Private Pilot Practical Test',
  hrs:{dual:1.5,solo:0,instrument:0.3,night:0},
  isStageCheck:true,isEndOfCourse:true,
  acsItems:['All Private Pilot ACS Areas and Tasks'],
  tolerance:{alt:'±100 ft',hdg:'±10°',spd:'±10 kt'},
  isSolo:false,isPresolo:false,
  scenario:'The real thing. Trust your training. The DPE wants you to pass. If something goes wrong, acknowledge it, correct it, move on.',
  whatIf:[
     {q:'What if the DPE asks about an ACS area you haven\'t reviewed in weeks — what\'s your strategy in the oral?',a:'Take a breath and be methodical. The DPE wants to see you think, not recite. State what you know: \'I know the answer involves [framework]. Let me work through it.\'  Structured thinking about a topic is more impressive than a rehearsed answer. If you genuinely don\'t know: \'I\'m not certain of the exact regulation, but I know where to find it and how to apply it.\'  Honesty plus resourcefulness is better than a wrong confident answer.'},
     {q:'What if you make an error during the checkride flight but catch and correct it yourself — does that fail the task?',a:'Not automatically. The ACS standards include self-correction and recognition as part of the evaluation. The DPE is looking for safe pilots, not perfect ones. A prompt, correct self-correction that brings performance back within standards often demonstrates better ADM than flawless performance. The DPE will note it, and it may come up in the debrief — be ready to explain what happened and what you did.'},
     {q:'What if the DPE says \'I have the controls\' during a maneuver — what does that mean?',a:'It means either the DPE is taking over for safety or demonstrating something. Respond immediately: \'You have the controls.\' Confirm verbally and release the controls — do not resist or assume it\'s a test. If the DPE corrects a deviation, observe and learn. After the flight, you may ask what triggered it — but do not challenge the intervention during the test. Safety is always the first priority.'},
     {q:'What if weather deteriorates during the checkride flight and the DPE asks for your go/no-go decision — what factors drive your answer?',a:'Apply PAVE in real time: current conditions vs. VFR minimums, aircraft capabilities, your personal minimums, external pressure. State your reasoning out loud — the DPE is evaluating your ADM, not just the decision itself. If conditions are below VFR minimums, the correct answer is to land at the nearest suitable airport regardless of completing the checkride. A DPE who asks this question wants to hear a safety-first answer.'},
     {q:'What if you get a notice of disapproval — what are the exact steps to reschedule and what does the CFI need to do?',a:'First: accept it professionally. A disapproval is a specific, documented evaluation — not a judgment on your value as a pilot. Review the notice of disapproval with your CFI: it specifies exactly which ACS areas were unsatisfactory. The CFI provides additional instruction in only those areas, documents it, and issues a new §61.39 endorsement. You re-take only the unsatisfactory portions. The DPE or a different DPE administers the re-test.'}
  ],
  coaching:'Meet the student at the airport. Brief them one final time. Send them off with confidence.',
  errors:[],debrief:[],
  tasks:[
    {id:'FL26-1',text:'Pre-practical: verify all endorsements and requirements',acsRef:'§61.39',textRef:'14 CFR §61.39',
      subtasks:['Verify ?61.109(a) all hour requirements met: total 40, dual 20, solo 10, instrument 3, night 3, etc.','Verify knowledge test passed: score ?70%, within 24 calendar months','Verify ?61.39 endorsements: received training within 2 calendar months preceding the month of application and reviewed deficiencies','Verify ?61.103 endorsements: ready for practical test in specific make/model','Verify aircraft documents: ARROW current, airworthy, within weight limits','Verify student pilot certificate and medical certificate current and in possession']},
    {id:'FL26-2',text:'Oral examination with DPE',acsRef:'ACS I',textRef:'FAA-S-ACS-6C',
     subtasks:['Completes oral examination with DPE covering all ACS knowledge areas','Presents completed cross-country flight plan as directed by DPE','Correctly answers weather, navigation, regulations, aircraft, and human factors questions','Demonstrates go/no-go decision making for the planned cross-country','Does not give up when questioned — "I don\'t know, but I know how to find out" is acceptable']},
    {id:'FL26-3',text:'Flight examination with DPE',acsRef:'All ACS',textRef:'FAA-S-ACS-6C',
     subtasks:['Performs complete flight examination to ACS standards in all areas','Demonstrates cross-country planning and navigation en route','Demonstrates all required maneuvers in flight to ACS tolerances','Demonstrates emergency procedures if called for by DPE','Receives Temporary Airman Certificate upon satisfactory completion']}
  ]}
};


// ─── STAGE DEFINITIONS ────────────────────────────────────────────────
const GL_STAGES=[
  {id:1,title:'Stage One',subtitle:'Aviation Foundations',lessons:['GL1','GL2','GL3','GL4','GL5'],testNote:'Stage 1 Knowledge Test — minimum 80%'},
  {id:2,title:'Stage Two',subtitle:'Weather, Navigation & Planning',lessons:['GL6','GL7','GL8','GL9','GL10','GL11'],testNote:'Stage 2 Knowledge Test + End-of-Course — minimum 80%'}
];
const FL_STAGES=[
  {id:1,title:'Stage One',subtitle:'Pre-Solo',lessons:['FL1','FL2','FL3','FL4','FL5','FL6','FL7','FL8','FL9','FL10','FL11','FL12']},
  {id:2,title:'Stage Two',subtitle:'Cross-Country and Night',lessons:['FL13','FL14','FL15','FL16','FL17','FL18','FL19','FL20','FL20A','FL20B','FL21','FL22','FL23','FL24','FL25']},
  {id:3,title:'Stage Three',subtitle:'Practical Test',lessons:['FL26']}
];

// ─── PROGRAM PHASES ──────────────────────────────────────────────────
const PHASES=[
  {
    id:'presolo',
    icon:'✈',
    title:'Pre-Solo / Solo',
    subtitle:'Foundations, first flight to solo sign-off',
    color:'var(--amber)',
    lessons:['GL1','FL1','FL2','GL2','FL3','GL3','FL4','GL4','FL5','FL6','GL5','FL7','FL8','FL9','FL10','FL11','FL12','FL13','FL14','FL15'],
    desc:'Master the fundamentals of flight, airspace, regulations, and aircraft systems — then fly solo for the first time.'
  },
  {
    id:'xc',
    icon:'🗺',
    title:'Cross-Country',
    subtitle:'Navigation, weather, night, and solo XC flights',
    color:'var(--blue)',
    lessons:['GL6','GL7','GL8','FL16','GL9','GL10','GL11','FL17','FL18','FL19','FL20','FL20A','FL20B'],
    desc:'Plan and fly cross-country routes, navigate by pilotage and GPS, fly at night, and complete the solo cross-country requirement.'
  },
  {
    id:'oral',
    icon:'📖',
    title:'Oral Prep',
    subtitle:'All ground knowledge — ACS knowledge areas',
    color:'var(--green)',
    lessons:['GL1','GL2','GL3','GL4','GL5','GL6','GL7','GL8','GL9','GL10','GL11'],
    desc:'Review all ground knowledge topics organized by ACS area of operation. Use the What If? SRM scenarios as oral discussion starters with your DPE.'
  },
  {
    id:'checkride',
    icon:'🏆',
    title:'Flight Test',
    subtitle:'Final maneuvers review, stage checks, and practical test',
    color:'var(--red)',
    lessons:['FL21','FL22','FL23','FL24','FL25','FL26'],
    desc:'Polish all ACS maneuvers to checkride standard, pass the Stage 2 check, and complete the FAA Private Pilot Practical Test.'
  }
];

// ─── REQUIREMENTS ─────────────────────────────────────────────────────
const REQS=[
  {id:'total',label:'Total Flight Time',reg:'14 CFR §61.109(a)',min:40,unit:'hrs'},
  {id:'dual',label:'Dual Instruction',reg:'§61.109(a)',min:20,unit:'hrs'},
  {id:'solo',label:'Total Solo Time',reg:'§61.109(a)(5)',min:10,unit:'hrs'},
  {id:'xc_dual',label:'Dual XC Flight',reg:'§61.109(a)(1)',min:3,unit:'hrs'},
  {id:'instrument',label:'Instrument Reference',reg:'§61.109(a)(3)',min:3,unit:'hrs'},
  {id:'night_dual',label:'Night Dual',reg:'§61.109(a)(2)',min:3,unit:'hrs'},
  {id:'night_xc',label:'Night XC ≥100 NM',reg:'§61.109(a)(2)(i)',min:1,unit:'flight'},
  {id:'night_tgl',label:'Night Takeoffs/Landings (Full Stop, Towered)',reg:'?61.109(a)(2)(ii)',min:10,unit:'cycles'},
  {id:'test_prep',label:'Practical Test Prep (2 calendar months)',reg:'?61.109(a)(4)',min:3,unit:'hrs'},
  {id:'solo_xc',label:'Solo XC Total',reg:'§61.109(a)(5)(i)',min:5,unit:'hrs'},
  {id:'long_xc',label:'Long Solo XC (150 NM)',reg:'§61.109(a)(5)(ii)',min:1,unit:'flight'},
  {id:'solo_tower',label:'Solo Takeoffs/Landings (Full Stop, Towered)',reg:'?61.109(a)(5)(iii)',min:3,unit:'cycles'}
];


export { ACS_URL, ACS_PAGES, REF_URLS, acsLink, GRADES, TASK_STATUSES, GL, FL, GL_STAGES, FL_STAGES, PHASES, REQS };
