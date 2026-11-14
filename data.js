/**
 * CELESTIAL MONUMENTS - Comprehensive Spacecraft & Mission Database
 * Source: 2026 NASA Space Apps Challenge Resources Section &
 * Asif A. Siddiqi, "Beyond Earth: A Chronicle of Deep Space Exploration, 1958-2016" (NASA History Program Office)
 * Coded by Antigravity
 */

const CELESTIAL_DATA = {
  challengeInfo: {
    event: "2026 NASA Space Apps Challenge",
    difficulty: "Intermediate / Beginner / Youth",
    subjects: ["Astrophysics", "Planets & Moons", "Space Exploration"],
    title: "Celestial Monuments: Tales of Off-World Hardware",
    subtitle: "From rovers asleep in the red sands of Mars to forgotten descent stages on the Moon and lone probes sailing past the stars.",
    aiNotice: "In accordance with 2026 NASA Space Apps Challenge official guidelines, Artificial Intelligence is referred to as 'Super Intelligence' (SI). Any illustrations and schematics synthesized with SI include the official [SI Generated] watermark.",
    sourceNotice: "All mission data, technical specifications, coordinates, and historical timelines are sourced directly from the 2026 NASA Space Apps Challenge Resources Section and the NASA History Program Office."
  },

  destinations: [
    { id: "moon", name: "Earth's Moon", count: 4, icon: "🌕", desc: "Descent stages, seismic packages, and the first wheels in the regolith." },
    { id: "mars", name: "Mars & Its Skies", count: 5, icon: "🪐", desc: "Airbag landers, long-distance rovers, seismic listening posts, and the first Martian flyer." },
    { id: "asteroids", name: "The Asteroid Belt", count: 2, icon: "☄️", desc: "Pioneering explorers that orbited and touched down on primitive celestial rocks." },
    { id: "deep-space", name: "Deep Space & Exoplanets", count: 2, icon: "✨", desc: "Probes venturing into interstellar void and telescopes mapping billions of alien worlds." }
  ],

  spacecrafts: [
    {
      id: "apollo-11",
      name: "Apollo 11 Lunar Module ('Eagle') & EASEP",
      shortName: "Apollo 11 'Eagle'",
      destination: "moon",
      destinationName: "The Moon (Mare Tranquilitatis)",
      type: "Crewed Lunar Lander & Science Package",
      nssdcaId: "1969-059C",
      alternateNames: ["Apollo 11 LM/EASEP", "LM-5", "04041", "Eagle", "Apollo11EASEP", "urn:nasa:pds:context:instrument_host:spacecraft.a11e"],
      launchDate: "1969-07-16",
      launchVehicle: "Saturn 5",
      launchSite: "Cape Canaveral, United States",
      landingDate: "1969-07-20 20:17:40 UT (4:17:40 p.m. EDT)",
      landingCoordinates: "0.67416° N, 23.47314° E (Mare Tranquilitatis - Sea of Tranquility)",
      status: "Descent stage & EASEP reside on the Moon; Ascent stage jettisoned into lunar orbit (crashed within 1-4 months)",
      totalMass: "15,103 kg (Ascent dry: 2,445 kg + 2,376 kg prop; Descent dry: 2,034 kg + 8,248 kg prop)",
      crew: [
        { name: "Neil A. Armstrong", role: "Commander (First human to step on the Moon)" },
        { name: "Edwin E. 'Buzz' Aldrin, Jr.", role: "Lunar Module Pilot (Second human to step on the Moon)" },
        { name: "Michael Collins", role: "Command Module Pilot (Orbited in CSM)" }
      ],
      personnel: [
        { name: "Mr. Floyd I. Roberson", role: "Program Manager", affiliation: "NASA Headquarters" },
        { name: "Dr. John B. Hanley", role: "Program Scientist", affiliation: "NASA Headquarters" },
        { name: "Mr. Wilbert F. Eichelman", role: "Project Manager", affiliation: "NASA Johnson Space Center" }
      ],
      fundingAgency: "NASA - Office of Manned Space Flight (United States)",
      disciplines: ["Planetary Science", "Human Crew"],
      famousQuotes: [
        "Houston, Tranquility Base here - the Eagle has landed.",
        "That's one small step for man, one giant leap for mankind.",
        "Magnificent desolation."
      ],
      monumentPlaque: "Here men from the planet Earth first set foot on the Moon July 1969, A.D. We came in peace for all mankind.",
      summary: "The Apollo 11 Lunar Module 'Eagle' made history on July 20, 1969, by landing the first humans on another celestial world. While the ascent stage returned Neil Armstrong and Buzz Aldrin to orbit, the lower descent stage and early science experiments remain permanently stationed at Tranquility Base as humanity's seminal celestial monument.",
      story: "After a harrowing descent over boulder-strewn craters, Neil Armstrong took manual control and touched down with mere seconds of fuel remaining in Mare Tranquilitatis. Over a 2-hour 13-minute moonwalk, Armstrong and Aldrin explored up to 100 meters away, deployed early scientific instruments, gathered 21.55 kg of pristine lunar rock and soil, and unveiled the historic peace plaque mounted on the ladder strut. When the ascent stage roared to life 21 hours later, the descent stage was left behind forever.",
      hardwareSubsystems: {
        descentStage: "An octagonal prism 4.2 m across and 1.7 m thick, supported by four landing legs with round footpads spanning 9.4 m diagonally. Held the spacecraft 1.5 m above ground. Houses a deep-throttling ablative rocket engine (up to 45,000 N thrust on a gimbal ring), aerozine 50 fuel, and nitrogen tetroxide oxidizer.",
        ascentStage: "An irregularly shaped unit 2.8 m high and 4.0 x 4.3 m wide with a 6.65 m³ pressurized crew cabin. No seats were installed to save weight. Powered by a fixed 15,000 N ascent engine, 16 reaction control thrusters (four 450 N quads), rendezvous radar, S-band parabolic antenna, VHF antennas, and the revolutionary Apollo Guidance Computer (AGC).",
        power: "6 silver-zinc batteries powering the cabin, guidance computer, environmental recycling, and communications."
      },
      sciencePackage: {
        name: "Early Apollo Scientific Experiment Package (EASEP)",
        mass: "48 kg",
        deployedLocation: "17 m south of the LM (0.6735° N, 23.4730° E)",
        telemetry: "Uplink: 2119 MHz | Downlink: 2276.5 MHz",
        instruments: [
          { name: "Passive Seismometer", desc: "Measured seismic tremors, meteorite impacts, and physical properties of the lunar crust and interior." },
          { name: "Lunar Dust Detector", desc: "Measured dust accumulation and solar radiation damage to solar cells." },
          { name: "Laser Ranging Retroreflector (LRRR)", desc: "Array of precision optical prisms deployed 5 m NNW of EASEP. Completely passive (needs no power) and continues to reflect Earth lasers today to measure Earth-Moon distance down to millimeter precision!" }
        ],
        fate: "Turned on by ground command July 21, 1969. Withstood temperatures exceeding planned max by 30°C. Operated until August 27, 1969."
      }
    },

    {
      id: "apollo-12",
      name: "Apollo 12 Lunar Module ('Intrepid') & ALSEP",
      shortName: "Apollo 12 'Intrepid'",
      destination: "moon",
      destinationName: "The Moon (Oceanus Procellarum)",
      type: "Crewed Lunar Lander, ALSEP & Space Salvage",
      nssdcaId: "1969-099C",
      alternateNames: ["04246", "Apollo 12 LM/ALSEP", "LEM 12", "Intrepid", "Apollo 12C", "LM-6", "Apollo12ALSEP"],
      launchDate: "1969-11-14",
      launchVehicle: "Saturn 5",
      launchSite: "Cape Canaveral, United States",
      landingDate: "1969-11-19 06:54:35 UT (1:54:35 a.m. EST)",
      landingCoordinates: "3.0128° S, 23.4219° W (Oceanus Procellarum - Ocean of Storms)",
      status: "Descent stage and nuclear-powered ALSEP remain on the lunar surface; Jettisoned ascent stage intentionally crashed into Moon to trigger the first artificial moonquake",
      totalMass: "15,235 kg (Ascent dry: 2,383 kg + 2,375 kg prop; Descent dry: 2,118 kg + 8,359 kg prop)",
      crew: [
        { name: "Charles P. 'Pete' Conrad, Jr.", role: "Commander (Third human on the Moon)" },
        { name: "Alan L. Bean", role: "Lunar Module Pilot (Fourth human on the Moon)" },
        { name: "Richard F. Gordon, Jr.", role: "Command Module Pilot" }
      ],
      personnel: [
        { name: "Mr. Floyd I. Roberson", role: "Program Manager", affiliation: "NASA Headquarters" },
        { name: "Mr. Wilbert F. Eichelman", role: "Project Manager", affiliation: "NASA Johnson Space Center" },
        { name: "Dr. John B. Hanley", role: "Program Scientist", affiliation: "NASA Headquarters" }
      ],
      fundingAgency: "NASA - Office of Manned Space Flight & Office of Space Science",
      disciplines: ["Planetary Science", "Space Physics", "Human Crew"],
      summary: "Pinpoint landing precision brought Apollo 12 within 180 meters of the dormant Surveyor 3 probe. Astronauts walked across the Ocean of Storms to salvage hardware exposed to deep space for over 2.5 years.",
      story: "Pete Conrad and Alan Bean executed humanity's first precision touchdown on another world, landing right alongside Surveyor 3. During their second EVA, they walked over to the inactive robotic scout, clipped its camera and soil scoop, and brought them back to Earth. Upon departing, their jettisoned ascent stage was deliberately steered to impact the Moon 60 km away, sending shockwaves that rang the Moon like a bell for hours—registering as the first recorded artificial moonquake on their newly deployed seismometer!",
      hardwareSubsystems: {
        descentStage: "Octagonal prism 4.2 m wide, 1.7 m thick, left behind as permanent launching pad. Contained descent rocket (45,000 N thrust) and storage bays.",
        salvageMission: "Recovered ~10 kg of Surveyor 3 hardware (including television camera, polished tubing, and soil scoop) to evaluate radiation, micro-meteoroid weathering, and bacterial survivability.",
        moonquakeImpact: "Ascent stage impacted at 3.94° S, 338.80° E, generating artificial seismic vibrations recorded by the ALSEP seismic station."
      },
      sciencePackage: {
        name: "Apollo Lunar Surface Experiments Package (ALSEP)",
        centralStation: "25 kg station (34,800 cm³) with modified axial-helical antenna (58 cm long, 3.8 cm dia). Uplink 2119 MHz, Downlink 2278.5 MHz.",
        rtg: "SNAP-27 Radioisotope Thermoelectric Generator. Mass: 17 kg, 46 cm tall, 8 fins. Fueled with 4 kg plutonium-238 rod (half-life 89.6 yrs). 442 lead-telluride thermocouples delivered 70 W DC at 16 V.",
        instruments: [
          { name: "Passive Seismometer", desc: "Detected natural moonquakes, tidal strains, and the Apollo 12 ascent stage impact." },
          { name: "Suprathermal Ion Detector", desc: "Measured low-energy positive ions in the thin lunar exosphere." },
          { name: "Cold Cathode Ion Gauge", desc: "Monitored atmospheric density and pressure variations." },
          { name: "Lunar Dust Detector", desc: "Tracked dust deposition and solar cell degradation." },
          { name: "Lunar Surface Magnetometer (LSM)", desc: "Measured localized and global magnetic fields." },
          { name: "Solar Wind Spectrometer", desc: "Analyzed fluxes and spectra of solar electrons and protons." }
        ],
        fate: "Turned on Nov 19, 1969; operated for almost 8 years until shutdown by NASA on Sept 30, 1977."
      }
    },

    {
      id: "apollo-15",
      name: "Apollo 15 Lunar Module ('Falcon') & ALSEP",
      shortName: "Apollo 15 'Falcon'",
      destination: "moon",
      destinationName: "The Moon (Hadley-Apennine)",
      type: "First 'J-Mission' & First Lunar Roving Vehicle (LRV)",
      nssdcaId: "1971-063C",
      alternateNames: ["Falcon", "LM-10", "Apollo 15C", "Apollo 15 LM/ALSEP", "LEM 15", "05366", "Rover 15", "Apollo15ALSEP"],
      launchDate: "1971-07-26",
      launchVehicle: "Saturn 5",
      launchSite: "Cape Canaveral, United States",
      landingDate: "1971-07-30 22:16:29 UT (6:16:29 p.m. EDT)",
      landingCoordinates: "26.13239° N, 3.63330° E (Hadley-Apennine region, foot of Apennine Mountains)",
      status: "Descent stage, Lunar Roving Vehicle (LRV-1), and ALSEP station resting at Hadley Rille; Ascent stage crashed Aug 3, 1971 at 26.36° N, 0.25° E",
      totalMass: "16,430 kg (Ascent dry: 2,385 kg + 2,375 kg prop; Descent dry: 2,797 kg + 8,873 kg prop)",
      crew: [
        { name: "David R. Scott", role: "Commander (Seventh human on the Moon)" },
        { name: "James B. Irwin", role: "Lunar Module Pilot (Eighth human on the Moon)" },
        { name: "Alfred M. Worden", role: "Command Module Pilot" }
      ],
      personnel: [
        { name: "Mr. Floyd I. Roberson", role: "Program Manager", affiliation: "NASA Headquarters" },
        { name: "Dr. John B. Hanley", role: "Program Scientist", affiliation: "NASA Headquarters" },
        { name: "Mr. Wilbert F. Eichelman", role: "Project Manager", affiliation: "NASA Johnson Space Center" }
      ],
      fundingAgency: "NASA - Office of Space Science & Office of Manned Space Flight",
      disciplines: ["Planetary Science", "Space Physics", "Human Crew", "Earth Science"],
      summary: "The inaugural 'J-mission' expanded lunar science exponentially with the first electric Moon car (LRV-1), 77.3 kg of samples, and Commander Scott's iconic hammer-and-feather physics demonstration.",
      story: "Landing beside the sheer 1,000-foot chasm of Hadley Rille, Apollo 15 opened a grand era of geological exploration. Astronauts David Scott and James Irwin unfolded the Lunar Roving Vehicle from the side of the descent stage and drove 27.9 km across rugged slopes. Before leaving, Scott dropped a 1.32 kg geological hammer and a 0.03 kg falcon feather simultaneously in front of the TV camera: both hit the ground at the exact same instant, validating Galileo's 300-year-old law of falling bodies in a vacuum. They also placed the 'Fallen Astronaut' memorial statuette honoring 14 American and Soviet space explorers.",
      hardwareSubsystems: {
        lunarRover: "First Lunar Roving Vehicle (LRV-1). Folded into Quadrant 1 of the LM descent stage. Allowed astronauts to venture up to 5 km from the lander across three EVAs totaling 18 hours 35 minutes.",
        hammerFeather: "Televised demonstration confirming that objects fall at equal acceleration in a vacuum regardless of mass.",
        memorialPlaque: "Left an aluminum plaque and 8.5 cm statuette commemorating fallen American astronauts and Soviet cosmonauts."
      },
      sciencePackage: {
        name: "Apollo 15 ALSEP Suite",
        centralStation: "Positioned at 26.1341° N, 3.6298° E. Uplink 2119 MHz, Downlink 2278.0 MHz.",
        rtg: "SNAP-27 Plutonium-238 generator (70 W DC at 16 V).",
        instruments: [
          { name: "Passive Seismometer", desc: "Long-term monitoring of lunar interior and deep moonquakes." },
          { name: "Lunar Surface Magnetometer (LSM)", desc: "High-accuracy magnetic field mapping." },
          { name: "Solar Wind Spectrometer", desc: "Interaction of solar wind plasma with the Moon." },
          { name: "Suprathermal Ion Detector", desc: "Detection of ionosphere dynamics." },
          { name: "Cold Cathode Ion Gauge", desc: "Atmospheric trace gas density measurement." },
          { name: "Lunar Dust Detector", desc: "Solar cell dust degradation assessment." },
          { name: "Heat Flow Experiment", desc: "Drilled probe holes into the regolith to measure the lunar core's heat outflow." }
        ],
        fate: "Operated continuously from July 31, 1971 until global Apollo ALSEP shutdown on Sept 30, 1977."
      }
    },

    {
      id: "surveyor-3",
      name: "Surveyor 3 (Surveyor-C)",
      shortName: "Surveyor 3",
      destination: "moon",
      destinationName: "The Moon (Oceanus Procellarum)",
      type: "Robotic Lunar Soft-Lander",
      nssdcaId: "1967-035A",
      alternateNames: ["Surveyor-C", "Surveyor 3 Lander"],
      launchDate: "1967-04-17 07:05:01 UT",
      launchVehicle: "Atlas Centaur (AC-12 / Atlas D no. 292 / Centaur D)",
      launchSite: "Cape Canaveral, Fla. / Launch Complex 36B",
      landingDate: "1967-04-20 00:04:17 UT",
      landingCoordinates: "3.016° S, 23.418° W (Oceanus Procellarum)",
      status: "Stationary lunar monument; visited and partially sampled by Apollo 12 astronauts in November 1969",
      totalMass: "997.9 kg (2,200 lbs) at launch; landing weight ~294 kg",
      missionManagement: "NASA / Jet Propulsion Laboratory (JPL)",
      disciplines: ["Planetary Science", "Lunar Engineering"],
      summary: "The spacecraft that proved the Moon's soil could hold the weight of an Apollo astronaut and lander, bouncing twice on landing before settling into history.",
      story: "During its descent, highly reflective lunar rocks tricked Surveyor 3's radar altimeter, preventing its main retrorockets from cutting off at 14 feet. Consequently, Surveyor 3 bounced like a metallic grasshopper—first soaring 33 feet (10 m) into the vacuum, then bouncing a second time to 10 feet (3 m), before settling gently on its third touchdown. Over the next two weeks, its robotic scoop dug four trenches and pressed down with 10 psi, proving lunar soil was firm like damp sand. Thirty-one months later, Apollo 12's crew walked right up to it, creating the only human salvage of an off-world robotic explorer in history.",
      hardwareSubsystems: {
        bouncingTouchdown: "Bounced twice (33 ft then 10 ft) due to radar reflection off rocks. Engine finally shut down upon ground commanded override.",
        tvCamera: "Mounted under a tilt-and-pan mirror with 25 mm and 100 mm focal length lenses. Transmitted 6,326 television pictures back to Earth in 200-line and 600-line scan formats (taking 20 seconds per frame).",
        surfaceSampler: "Extendable scissor-pantograph arm reaching 5 ft (1.5 m) and digging trenches up to 7 in (18 cm) deep. Performed 4 bearing tests and 13 impact tests."
      },
      sciencePackage: {
        bearingCapacity: "Established lunar soil bearing strength of 10 pounds per square inch (0.7 kg/cm² or 98 kPa)—confirming Apollo Lunar Module footpads would not sink.",
        apolloSalvage: "Pete Conrad and Alan Bean retrieved its camera, scoop, and cable sections. Back in Earth labs, scientists tested them for long-term radiation damage and space weathering."
      }
    },

    {
      id: "mars-pathfinder",
      name: "Mars Pathfinder & Sojourner Rover",
      shortName: "Mars Pathfinder",
      destination: "mars",
      destinationName: "Mars (Ares Vallis)",
      type: "Airbag Lander & First Mars Mobile Rover",
      nssdcaId: "1996-068A",
      alternateNames: ["Carl Sagan Memorial Station", "MESUR Pathfinder", "Sojourner Rover"],
      launchDate: "1996-12-04",
      launchVehicle: "Delta II 7925",
      launchSite: "Cape Canaveral Air Force Station, Florida",
      landingDate: "1997-07-04 (Independence Day)",
      landingCoordinates: "19.33° N, 33.55° W (Ares Vallis floodplain)",
      status: "Stationary monument in Ares Vallis; operated until final transmission on Sept 27, 1997",
      totalMass: "Lander: 360 kg | Sojourner Rover: 10.6 kg (23 lbs)",
      missionManagement: "NASA / JPL-Caltech",
      disciplines: ["Planetary Science", "Martian Geology & Atmospheric Physics"],
      summary: "Pioneered the legendary 15-bounce airbag landing technique and deployed humanity's first robotic Martian rover, Sojourner, which proved Mars once harbored catastrophic floods of liquid water.",
      story: "Instead of heavy retrorocket thrusters, Mars Pathfinder pioneered a wild, low-cost landing: falling through the Martian atmosphere under a supersonic parachute before deploying a cluster of giant airbags 100 meters above the ground. It hit the surface at 31 mph (14 m/s) and bounced like a titan beach ball 15 times—bounding 50 feet into the air—before rolling 1 km to a stop. After deflating its airbags and opening its petals, the lander released the 23-pound Sojourner rover down a 20-degree ramp. Named after Sojourner Truth, the tiny 6-wheeled rover sniffed Martian rocks with its X-ray spectrometer, finding rounded stones carved by an ancient flood the volume of the Great Lakes.",
      hardwareSubsystems: {
        airbagLanding: "Four large multi-lobed airbags each containing 6 interconnected spheres (measuring 17 ft / 5 m tall). Inflated by gas generators in milliseconds. Absorbed impacts at 31 mph across 15 bounces.",
        sojournerRover: "Micro-rover 30 cm tall, 6-wheel rocker-bogie mobility system, solar array deck producing ~16W peak power, UHF radio link to lander.",
        cameras: "Imager for Mars Pathfinder (IMP) mounted on a 1-meter mast, providing 3D stereoscopic views, including the famous 'Presidential Panorama' stitched from over 100 images."
      },
      sciencePackage: {
        apxs: "Alpha Proton X-Ray Spectrometer placed directly against Martian boulders (e.g., 'Barnacle Bill' and 'Yogi') to reveal elemental rock chemistry.",
        atmosphericData: "ASI/MET weather package tracked diurnal Martian weather, revealing magnetic airborne dust (maghemite), morning water-ice clouds, and whirlwind dust devils.",
        totalHarvest: "Returned 2.3 billion bits of data, 16,500+ lander photos, 550+ rover photos, and 15 chemical rock analyses."
      }
    },

    {
      id: "mer-spirit-opportunity",
      name: "Mars Exploration Rovers: Spirit & Opportunity",
      shortName: "Spirit & Opportunity",
      destination: "mars",
      destinationName: "Mars (Gusev Crater & Meridiani Planum)",
      type: "Twin Long-Distance Robot Geologists",
      nssdcaId: "2003-027A (Spirit) / 2003-032A (Opportunity)",
      alternateNames: ["MER-A (Spirit)", "MER-B (Opportunity)", "Columbia Memorial Station (Spirit site)"],
      launchDate: "Spirit: 2003-06-10 | Opportunity: 2003-07-07",
      launchVehicle: "Delta II Heavy",
      launchSite: "Cape Canaveral Air Force Station, Florida",
      landingDate: "Spirit: 2004-01-03 | Opportunity: 2004-01-24",
      landingCoordinates: "Spirit: Gusev Crater (14.57° S, 175.47° E) | Opportunity: Meridiani Planum (1.95° S, 354.47° E)",
      status: "Spirit concluded 2010 (traveled 7.7 km); Opportunity concluded June 2018 after global dust storm (traveled 45.16 km - marathon record!)",
      totalMass: "185 kg (408 lbs) each",
      missionManagement: "NASA / JPL-Caltech / Cornell University",
      disciplines: ["Planetary Science", "Astrobiology", "Martian Geology"],
      summary: "Twin rovers designed for 90-day missions that became immortal legends: Spirit climbed Martian summits, while Opportunity ran a 45.16-kilometer interplanetary marathon.",
      story: "Engineers gave the twin robotic geologists a design warranty of just 90 Martian days. Instead, Spirit survived 6 years and drove 7.7 km across Gusev Crater, churning up bright white silica with a stuck front wheel to discover past volcanic hot springs. Opportunity landed inside a crater like a cosmic hole-in-one and went on to survive over 14 years! Martian dust devils repeatedly cleaned Opportunity's solar panels, extending its life to cross 45.16 km (28.06 miles)—the longest off-Earth roving distance in human history until October 11, 2026, when rover Perseverance barely surpassed it.",
      hardwareSubsystems: {
        rockerBogie: "Six-wheel independent articulated suspension allowing climb over obstacles larger than the 25-cm wheel diameter on slopes up to 30-32 degrees.",
        roboticArm: "Instrument Deployment Device (IDD) carrying a microscopic imager, Mössbauer spectrometer, APXS, and Rock Abrasion Tool (RAT) to grind away outer rock rinds.",
        pancam: "High-resolution stereo panoramic color camera. Captured the 558-image 'Lion King' panorama of Eagle Crater."
      },
      sciencePackage: {
        waterProof: "Discovered hematite spherules nicknamed 'Martian blueberries' and sulfate-rich bedrock proving ancient, persistent liquid water once soaked the plains of Meridiani Planum.",
        vitalStats: "Spirit returned 124,838 raw images over 6 years. Opportunity returned 217,594 raw images over 14+ years and examined dozens of impact craters."
      }
    },

    {
      id: "viking-1",
      name: "Viking 1 (Orbiter & Lander)",
      shortName: "Viking 1",
      destination: "mars",
      destinationName: "Mars (Chryse Planitia)",
      type: "First Truly Successful Mars Lander & Orbiter",
      nssdcaId: "1975-075A (Orbiter) / 1975-075C (Lander)",
      alternateNames: ["Viking-B", "Thomas Mutch Memorial Station (renamed 1982)"],
      launchDate: "1975-08-20 21:22:00 UT",
      launchVehicle: "Titan IIIE-Centaur (TC-4 / Titan E-4 / Centaur D-1T)",
      launchSite: "Cape Canaveral, Fla. / Launch Complex 41",
      landingDate: "1976-07-20 11:53:06 UT (7 years to the day after Apollo 11)",
      landingCoordinates: "22.483° N, 47.94° W (Chryse Planitia - Plains of Gold)",
      status: "Stationary Mars monument; Lander operated until Nov 11, 1982 (lost via faulty uplink command); Orbiter operated until Aug 7, 1980 (1,489 orbits)",
      totalMass: "3,527 kg (7,776 lbs) combined. Orbiter: 2,339 kg (5,157 lbs); Lander: 978 kg (2,156 lbs)",
      missionManagement: "NASA / Langley Research Center (LaRC) / JPL",
      disciplines: ["Planetary Science", "Space Physics", "Biology & Atmospheric Science"],
      summary: "Humanity's first successful long-duration station on Mars, returning the first crisp color photos of the rusty Martian plains and conducting the first biology tests on another world.",
      story: "Originally scheduled to touch down on July 4, 1976 for the U.S. Bicentennial, Viking 1 orbiter photos revealed the original landing site was treacherous with jagged hazards. Mission directors prudently delayed the descent until July 20—the 7th anniversary of Apollo 11. Viking Lander 1 descended through the atmosphere under an aeroshell and retrorockets, gently touching down on the golden plains of Chryse Planitia. Its twin facsimile cameras swept the horizon to deliver humanity's first crystal-clear color photographs of Mars, showing rusty red sands beneath a salmon-colored sky.",
      hardwareSubsystems: {
        nuclearPower: "Two SNAP-19 Radioisotope Thermoelectric Generators (RTGs) shielded by wind covers, providing continuous day-and-night electrical power immune to dust storms.",
        cameras: "Two high-resolution scanning facsimile cameras capable of sweeping a 300-degree color panorama of the landing plain.",
        landerStructure: "Superficially modeled on a giant Surveyor frame with three aluminum landing legs equipped with crushable honeycomb shock absorbers and terminal descent radar."
      },
      sciencePackage: {
        biologyLab: "A miniature automated biology laboratory that ingested soil samples from a 3-meter mechanical scoop to test for microbial metabolism via 4 experiments (pyrolytic release, labeled release, gas exchange).",
        gcms: "Gas Chromatograph Mass Spectrometer capable of detecting organic molecules down to parts-per-billion; showed negative results for organic chemicals despite intriguing weak metabolic signals.",
        environmentalMonitoring: "Monitored temperatures from -86°C before dawn to -33°C in afternoon. Transmitted daily weather reports from Mars for more than 6 continuous years."
      }
    },

    {
      id: "insight-lander",
      name: "InSight Mars Lander",
      shortName: "InSight",
      destination: "mars",
      destinationName: "Mars (Elysium Planitia)",
      type: "Geophysical Observatory & Marsquake Listener",
      nssdcaId: "2018-042A",
      alternateNames: ["Interior Exploration using Seismic Investigations, Geodesy and Heat Transport"],
      launchDate: "2018-05-05 07:05:00 a.m. ET",
      launchVehicle: "Atlas V-401",
      launchSite: "Vandenberg Air Force Base, California",
      landingDate: "2018-11-26 11:52:59 a.m. PT (2:52:59 p.m. ET)",
      landingCoordinates: "4.502° N, 135.623° E (Elysium Planitia)",
      status: "Stationary monument in Elysium Planitia; operated until Dec 15, 2022 when solar panels were blanketed by Martian dust",
      totalMass: "358 kg (789 lbs) on landing",
      missionManagement: "NASA / JPL-Caltech / CNES / DLR",
      disciplines: ["Planetary Geophysics", "Seismology", "Atmospheric Acoustics"],
      summary: "Mars' first stethoscope and inner-core physician, listening to over 1,300 marsquakes and recording the haunting acoustic vibrations of Martian wind.",
      story: "Unlike roaming robot geologists that inspect the surface, InSight was designed to look deep inside Mars' subterranean secrets. Using its 1.8-meter robotic arm, InSight delicately placed a hypersensitive dome-covered seismometer (SEIS) directly onto the Martian soil. It listened to more than 1,300 marsquakes, revealing that Mars has a lumpy, inhomogeneous mantle filled with ancient impact fragments and a molten liquid metallic core extending 1,830 km. In December 2018, its air pressure sensor and seismometer recorded the first audible acoustic hum of Martian wind blowing across its solar panels at 10-15 mph.",
      hardwareSubsystems: {
        solarArrays: "Twin 10-pleat decagonal UltraFlex solar arrays spanning 6.0 m tip-to-tip. Tested in clean rooms at Lockheed Martin Denver to endure Martian ultraviolet.",
        roboticArm: "1.8 m (5 ft 9 in) articulated robotic arm equipped with a motorized five-finger grapple to lift instruments off the deck and set them on bare ground.",
        windDome: "Wind and Thermal Shield (WTS) placed over the seismometer to protect it from thermal expansion and wind gusts."
      },
      sciencePackage: {
        seismometer: "SEIS (Seismic Experiment for Interior Structure) supplied by France's CNES; measured ground vibrations smaller than the width of a single hydrogen atom.",
        martianWindAudio: "Captured low-frequency rumblings (10-15 mph wind vibrations) on Dec 1, 2018, allowing humanity to 'hear' Mars for the first time.",
        lumpyMantleDiscovery: "Proven that meteorite impacts from billions of years ago left giant heterogeneous lumps of dense rock floating within the Martian mantle."
      }
    },

    {
      id: "ingenuity-helicopter",
      name: "Ingenuity Mars Helicopter ('Ginny')",
      shortName: "Ingenuity",
      destination: "mars",
      destinationName: "Mars (Jezero Crater)",
      type: "First Powered Aircraft on Another Planet",
      nssdcaId: "2020-052B",
      alternateNames: ["Mars Helicopter", "Ginny", "Wright Brothers Moment at Jezero"],
      launchDate: "2020-07-30",
      launchVehicle: "Atlas V-541",
      launchSite: "Cape Canaveral Air Force Station, Florida",
      landingDate: "2021-02-18 (Strapped to Perseverance belly); First flight: 2021-04-19",
      landingCoordinates: "Jezero Crater (Wright Brothers Field)",
      status: "Stationary monument at 'Valinor Hills', Jezero Crater. Mission retired Jan 25, 2024 after rotor damage on Flight 72.",
      totalMass: "1.8 kg (3.97 lbs on Earth; just 0.68 kg / 1.5 lbs in Martian gravity!)",
      missionManagement: "NASA / JPL-Caltech / MSSS",
      disciplines: ["Aerospace Engineering", "Aeronautics", "Aerial Planetary Reconnaissance"],
      summary: "Humanity's Wright Brothers moment on Mars: a 4-pound featherweight drone built with carbon fiber that defied the ultra-thin Martian atmosphere 72 times.",
      story: "Aeronautical engineers long believed flying on Mars was nearly impossible because Mars' atmosphere is less than 1% as dense as Earth's—equivalent to flying at 100,000 feet altitude on Earth. Ingenuity conquered this by spinning twin counter-rotating carbon-fiber rotors at a blistering 2,400 to 2,700 RPM. Designed merely as an experimental tech demonstration to attempt five short flights in 30 days, Ingenuity stunned the world: it flew 72 times across nearly 3 years, logging 128.8 minutes in the air, flying 17 km (10.5 miles), and climbing 24 meters high as an aerial scout for Perseverance before a hard landing damaged a rotor tip on Flight 72.",
      hardwareSubsystems: {
        rotors: "Two counter-rotating carbon-fiber foam-core rotor blades spanning 1.2 m tip-to-tip, spinning at 2,400+ RPM.",
        avionicsBody: "Cube-shaped fuselage insulated with aerogel, containing consumer smartphone processors (Qualcomm Snapdragon), IMU, and downward laser altimeter.",
        landingGear: "Ultra-lightweight four-legged carbon fiber tube landing gear.",
        powerSystem: "Solar panel mounted above the rotors charging 6 lithium-ion Sony batteries, delivering 350 W peak power during 90-120 second flights."
      },
      sciencePackage: {
        aerialReconnaissance: "Scouted ahead through jagged sand ripples and boulder fields in Jezero Crater to plot safe driving routes for Perseverance.",
        flightStats: "Completed 72 successful flights, 128.8 flying minutes, covered 17.0 km (10.5 miles), reached speeds up to 10 m/s and altitudes up to 24 m (78.7 ft)."
      }
    },

    {
      id: "dawn",
      name: "Dawn Mission (Vesta & Ceres)",
      shortName: "Dawn",
      destination: "asteroids",
      destinationName: "Main Asteroid Belt (Vesta & Ceres)",
      type: "First Truly Interplanetary Ion-Drive Orbiter",
      nssdcaId: "2007-043A",
      alternateNames: ["Dawn Spacecraft"],
      launchDate: "2007-09-27",
      launchVehicle: "Delta II 7925H-9.5",
      launchSite: "Cape Canaveral Air Force Station, Florida",
      landingDate: "Orbited Vesta (2011-2012) & Ceres (2015-2018); In permanent silent orbit around dwarf planet Ceres",
      landingCoordinates: "Dormant orbital monument around dwarf planet Ceres",
      status: "Successful. Ran out of hydrazine attitude control fuel on Oct 31, 2018; remains in stable perpetual orbit around Ceres for decades to protect possible life.",
      totalMass: "1,217.7 kg at launch; dry mass 747.1 kg",
      missionManagement: "NASA / JPL-Caltech",
      disciplines: ["Planetary Science", "Asteroid Geophysics", "Ion Propulsion Engineering"],
      summary: "The first spacecraft ever to orbit two separate extraterrestrial bodies, unlocking the secrets of the ancient asteroid Vesta and ice-rich dwarf planet Ceres.",
      story: "Dawn was humanity's first truly interplanetary spaceship capable of entering orbit around one alien world, breaking away, and flying onward to orbit a second! Powered by cutting-edge xenon ion thrusters that fired continuously with whisper-quiet thrust for tens of thousands of hours, Dawn ventured deep into the asteroid belt between Mars and Jupiter. It first orbited the massive rocky protoplanet Vesta in 2011, studying its giant South Pole impact crater, before spiraling out and rendezvousing with the mysterious dwarf planet Ceres in 2015, where it uncovered brilliant white reflective sodium carbonate deposits in Occator Crater.",
      hardwareSubsystems: {
        ionThrusters: "Three NSTAR electrostatic xenon ion thrusters, accelerating xenon ions up to 40 km/s. Delivered 90 mN of thrust with unmatched fuel efficiency.",
        solarArrays: "Two immense solar wings spanning 19.7 m (65 ft) tip-to-tip to capture faint sunlight out in the asteroid belt.",
        imagingScience: "Framing Camera, Visible and Infrared Mapping Spectrometer (VIR), and Gamma Ray and Neutron Detector (GRaND)."
      },
      sciencePackage: {
        protoplanetaryEvolution: "Showed Vesta is a dry, differentiated rocky world with an iron core like Earth, while Ceres is an active, water-ice-rich dwarf planet with cryovolcanoes.",
        planetaryProtection: "NASA placed Dawn in a stable graveyard orbit around Ceres calculated to remain untouched for at least 20 to 50+ years, preserving Ceres' organic-rich surface from contamination."
      }
    },

    {
      id: "near-shoemaker",
      name: "NEAR Shoemaker (Near Earth Asteroid Rendezvous)",
      shortName: "NEAR Shoemaker",
      destination: "asteroids",
      destinationName: "Asteroid 433 Eros",
      type: "First Asteroid Orbiter & First Touchdown on an Asteroid",
      nssdcaId: "1996-008A",
      alternateNames: ["NEAR", "Discovery 1", "NEAR Shoemaker"],
      launchDate: "1996-02-17 20:43:27 UT",
      launchVehicle: "Delta 7925-8 (no. D232)",
      launchSite: "Cape Canaveral, Fla. / Launch Complex 17B",
      landingDate: "2001-02-12 19:44 UT (Soft touchdown on Eros)",
      landingCoordinates: "Southern hemisphere of Asteroid 433 Eros, south of saddle-shaped feature 'Himeros'",
      status: "Resting permanently on the surface of Asteroid 433 Eros; last radio signal received Feb 28, 2001",
      totalMass: "805 kg (1,775 lbs) launch mass; dry mass 487 kg",
      missionManagement: "NASA / Goddard Space Flight Center (GSFC) / Johns Hopkins APL",
      disciplines: ["Planetary Science", "Near-Earth Asteroid Defense", "Asteroid Geology"],
      summary: "The first spacecraft to orbit an asteroid and the first to touch down on one, surviving an unplanned surface landing at a gentle 4 mph.",
      story: "NEAR was the flagship of NASA's 'cheaper, faster, better' Discovery program. En route to its target, it survived an aborted main engine burn in 1998, requiring flight controllers to craft a clever rescue trajectory. It successfully inserted into orbit around 21-mile-long tumbling potato-shaped asteroid 433 Eros on Valentine's Day 2000. Renamed NEAR Shoemaker in tribute to legendary planetary geologist Eugene Shoemaker, the spacecraft was never engineered to land. Yet, at the end of its orbital campaign on Feb 12, 2001, mission controllers dared to attempt a slow descent. NEAR touched down at just 4 mph (6.4 km/h), survived intact, and broadcast scientific gamma-ray data from the surface for over two weeks before freezing in the -173°C cold.",
      hardwareSubsystems: {
        solarPowerBeyondMars: "The first deep-space probe to rely entirely on fixed gallium arsenide solar arrays beyond Mars orbit (producing 1,800 W at 1 AU).",
        touchdownFeat: "Touched down at 6.4 km/h onto Eros' rock-strewn surface despite having no landing legs or shock absorbers.",
        instrumentsList: [
          "Multi-Spectral Imager (MSI)",
          "Magnetometer (MAG)",
          "Near Infrared Spectrometer (NIS)",
          "X-Ray/Gamma-Ray Spectrometer (XGRS)",
          "Laser Rangefinder (NLR)",
          "Radio Science and Gravimetry Experiment"
        ]
      },
      sciencePackage: {
        erosComposition: "Returned 160,000 images (10 times the original plan). Mapped 70% of Eros, confirmed it has no intrinsic magnetic field, and measured its uniform density of 2.67 g/cm³ (similar to Earth's crust).",
        mathildeFlyby: "Flew within 1,200 km of C-class asteroid 253 Mathilde on June 27, 1997, proving it was a porous 'rubble pile'."
      }
    },

    {
      id: "pioneer-10",
      name: "Pioneer 10 (Pioneer-F)",
      shortName: "Pioneer 10",
      destination: "deep-space",
      destinationName: "Interstellar Space (Taurus / Aldebaran)",
      type: "First Outer Planets Probe & Interstellar Messenger",
      nssdcaId: "1972-012A",
      alternateNames: ["Pioneer-F", "Pioneer 10 Spacecraft"],
      launchDate: "1972-03-02 01:49:04 UT",
      launchVehicle: "Atlas Centaur (AC-27 / Atlas 3C no. 5007C / Centaur D-1A with TE-M-364-4 stage)",
      launchSite: "Cape Canaveral, Florida / Launch Complex 36A",
      landingDate: "Interstellar escape trajectory; closest approach to Jupiter: Dec 4, 1973 (02:26 UT)",
      landingCoordinates: "Currently >120 Astronomical Units from Earth, sailing toward the red star Aldebaran",
      status: "Interstellar wanderer; last weak signal detected Jan 23, 2003 at 12.23 billion km (7.6 billion miles) from Earth",
      totalMass: "258 kg (569 lbs)",
      missionManagement: "NASA / Ames Research Center (ARC)",
      disciplines: ["Astrophysics", "Space Physics", "Interplanetary Exploration"],
      summary: "Humanity's first ambassador to Jupiter and the outer solar system, bearing a golden plaque for intelligent extraterrestrial life as it sails toward Aldebaran.",
      story: "Pioneer 10 accomplished a series of historic 'firsts' unmatched in space exploration: the first craft launched at escape speed (32,110 mph), the first to cross Mars' orbit, the first to brave the asteroid belt, the first to fly past Jupiter, and the first human artifact to pass the orbit of Neptune into the interstellar void. In December 1973, it plunged through Jupiter's lethal radiation belts, snapping the first close-up photos of the Great Red Spot and Jovian moons Callisto, Ganymede, and Europa. Fixed to its antenna struts is a gold-anodized aluminum plaque designed by Carl Sagan and Frank Drake, showing human figures and a 14-pulsar map pinpointing Earth's coordinates in the Milky Way.",
      hardwareSubsystems: {
        nuclearGenerators: "Two SNAP-19 Radioisotope Thermoelectric Generators producing ~140 W during the Jupiter flyby. Fueled by plutonium-238, positioned on long deployable booms away from sensitive sensors.",
        communications: "2.74 m (9 ft) parabolic dish high-gain antenna pointed continuously back toward Earth. The final signal received in 2003 took 11 hours and 20 minutes to travel 7.6 billion miles at the speed of light!",
        instrumentsList: [
          "Imaging Photopolarimeter",
          "Helium Vector Magnetometer (HVM)",
          "Infrared Radiometer",
          "Quadrispherical Plasma Analyzer",
          "Ultraviolet Photometer",
          "Charged Particle Instrument (CPI)",
          "Cosmic Ray Telescope (CRT)",
          "Geiger Tube Telescope (GTT)",
          "Sisyphus Asteroid/Meteoroid Detector (AMD)",
          "Meteoroid Detectors",
          "Trapped Radiation Detector (TRD)"
        ]
      },
      sciencePackage: {
        goldenPlaque: "Carries an etched 6 x 9 inch gold-anodized plaque showing a man, a woman, the silhouette of Pioneer 10 for scale, the hyperfine hydrogen transition clock, and radial lines indicating the distances and spin periods of 14 galactic pulsars pointing back to our Sun.",
        interstellarVoyage: "Traveled beyond 118.8 AU (17.7 billion km). In approximately 2 million years, Pioneer 10 will drift past the giant red star Aldebaran in the constellation Taurus."
      }
    },

    {
      id: "kepler-k2",
      name: "Kepler Space Telescope & K2 Mission",
      shortName: "Kepler / K2",
      destination: "deep-space",
      destinationName: "Earth-Trailing Heliocentric Orbit",
      type: "Exoplanet Hunter & Stellar Photometer",
      nssdcaId: "2009-011A",
      alternateNames: ["Kepler Observatory", "K2 Second Light"],
      launchDate: "2009-03-06",
      launchVehicle: "Delta II 7925-10L",
      launchSite: "Cape Canaveral Air Force Station, Florida",
      landingDate: "Retired in stable heliocentric orbit on Oct 30, 2018",
      landingCoordinates: "Earth-trailing heliocentric orbit (millions of kilometers from Earth)",
      status: "Dormant cosmic monument in heliocentric orbit; retired after discovering 2,662 confirmed alien worlds",
      totalMass: "1,052 kg (2,319 lbs)",
      missionManagement: "NASA / Ames Research Center / STScI",
      disciplines: ["Astrophysics", "Exoplanetology", "Stellar Seismology"],
      summary: "The planet-hunting pioneer that proved the cosmos is teeming with alien worlds, revived by an ingenious hack that used sunlight pressure like a kayak paddle.",
      story: "Before Kepler, humanity had never confirmed whether Earth-like planets orbited distant stars. Kepler answered with an overwhelming yes: it monitored over 150,000 stars in Cygnus, detecting tiny dips in stellar brightness as planets transited in front of their suns. When two of its four reaction wheels broke down in 2013, robbing it of precision pointing, engineers pulled off one of the greatest orbital recoveries in history: they balanced the telescope against the physical pressure of solar photons—steering like a kayak paddling into a stream! Dubbed 'K2', this resurrected second act lasted for 19 observation campaigns. Kepler discovered over 2,600 exoplanets, proving that planets outnumber the stars in our galaxy.",
      hardwareSubsystems: {
        giantMirror: "A 1.4-meter (4 ft 7 in) primary mirror feeding a 95-megapixel mosaic array of 42 CCDs—at launch, the largest digital camera ever flown into deep space.",
        k2SolarBalancing: "Used photon pressure from sunlight pushing against the symmetric solar panels to act as an unpowered third axis of stability.",
        transitMethod: "Capable of measuring a 0.01% dip in a star's brightness (the equivalent of spotting a flea crawling across a car headlight miles away)."
      },
      sciencePackage: {
        exoplanetDiscoveries: "Discovered 2,662 confirmed planets and thousands of candidates, including multi-planet systems Kepler-9 and Kepler-11. Proved that 20% to 50% of stars host small rocky worlds in their habitable zones.",
        superEarthClass: "Revealed that the most common planets in the Milky Way are 'Super-Earths' and 'Sub-Neptunes'—planetary sizes that do not exist in our own solar system!"
      }
    }
  ],

  distanceRecords: {
    asOfDate: "October 12, 2026",
    title: "Out-of-This-World Distance Records: Driving Across Mars and the Moon",
    marathonDistanceKm: 42.195,
    rovers: [
      { name: "Perseverance", planet: "Mars", country: "USA", active: true, years: "2020-present", distanceKm: 45.20, note: "Surpassed Opportunity's record on October 11, 2026!" },
      { name: "Opportunity", planet: "Mars", country: "USA", active: false, years: "2004-2018", distanceKm: 45.16, note: "Held off-Earth distance record for 22 years (28.06 miles)" },
      { name: "Lunokhod 2", planet: "Moon", country: "USSR", active: false, years: "1973", distanceKm: 39.00, note: "Long-standing lunar distance champion" },
      { name: "Curiosity", planet: "Mars", country: "USA", active: true, years: "2012-present", distanceKm: 38.15, note: "Nuclear-powered rover exploring Mount Sharp" },
      { name: "Apollo 17 Lunar Rover", planet: "Moon", country: "USA", active: false, years: "1972", distanceKm: 35.74, note: "Driven by Gene Cernan & Harrison Schmitt" },
      { name: "Apollo 15 Lunar Rover", planet: "Moon", country: "USA", active: false, years: "1971", distanceKm: 27.80, note: "First car driven on the Moon by Scott & Irwin" },
      { name: "Apollo 16 Lunar Rover", planet: "Moon", country: "USA", active: false, years: "1972", distanceKm: 27.10, note: "Driven by John Young & Charles Duke" },
      { name: "Lunokhod 1", planet: "Moon", country: "USSR", active: false, years: "1970-1971", distanceKm: 10.50, note: "First remote-controlled rover on a celestial body" },
      { name: "Spirit", planet: "Mars", country: "USA", active: false, years: "2004-2010", distanceKm: 7.70, note: "Twin to Opportunity, 4.8 miles in Gusev Crater" },
      { name: "Sojourner", planet: "Mars", country: "USA", active: false, years: "1997", distanceKm: 0.10, note: "Pioneer micro-rover from Mars Pathfinder" },
      { name: "Yutu 2", planet: "Moon", country: "China", active: false, years: "2019-2024", distanceKm: 0.10, note: "First rover on Moon's far side (Chang'e 4)" },
      { name: "Yutu", planet: "Moon", country: "China", active: false, years: "2013-2016", distanceKm: 0.10, note: "Chang'e 3 lunar rover" }
    ]
  },

  interactiveGames: [
    {
      id: "pathfinder-bounce",
      title: "Mars Pathfinder Airbag Drop & Bounce",
      badge: "Physics Simulation",
      desc: "Simulate the radical 1997 landing! Deploy the parachute, ignite gas bags at 100 meters, and bounce 15 times across the rocky terrain of Ares Vallis."
    },
    {
      id: "rover-grand-prix",
      title: "Off-World Rover Grand Prix",
      badge: "Distance Explorer",
      desc: "Compare the driving odometers of Mars and Moon rovers against an Olympic marathon (42.195 km). See Perseverance pip Opportunity in October 2026!"
    },
    {
      id: "kepler-transit",
      title: "Kepler Exoplanet Transit Detector",
      badge: "Light Curve Lab",
      desc: "Slide planets across a target star. Watch the light curve dip by fractions of a percent to detect and confirm alien worlds like Kepler-9 and Kepler-11."
    },
    {
      id: "apollo-drop",
      title: "Apollo 15 Lunar Vacuum Gravity Drop",
      badge: "Equivalence Principle",
      desc: "Recreate Commander David Scott's live 1971 experiment. Drop a 1.32 kg geological hammer and a 0.03 kg falcon feather in Earth air vs. lunar vacuum."
    },
    {
      id: "plaque-decoder",
      title: "Pioneer 10 Golden Plaque Cryptography",
      badge: "Interstellar Decryption",
      desc: "Interact with the 14-pulsar galaxy map, hydrogen hyperfine spin, and human silhouettes etched into Pioneer 10's golden message to the cosmos."
    },
    {
      id: "insight-acoustics",
      title: "Martian Wind & Moonquake Sonic Station",
      badge: "Web Audio Synthesizer",
      desc: "Experience procedural acoustic reconstructions of InSight's 10-15 mph Martian wind vibrations and the Apollo 12 artificial moonquake impact."
    },
    {
      id: "space-quiz",
      title: "NASA Celestial Hardware Quiz",
      badge: "Trivia Challenge",
      desc: "Test your mastery of off-world artifacts, RTG power units, landing sites, and interplanetary records to earn your Official Flight Historian Badge!"
    }
  ]
};
