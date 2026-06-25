/* =============================================================
   Place data + name matching shared by the student datalists and
   the instructor maps.
   - countries / usStates : friendly suggestion lists for the form
   - normalize()          : loose comparison key
   - COUNTRY_ALIASES      : maps common/abbreviated spellings to the
                            names used by the world map (world-atlas)
   - STATE_ALIASES        : maps abbreviations to full U.S. state names
   ============================================================= */
(function () {
  const usStates = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois",
    "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
    "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
    "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
    "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
    "West Virginia","Wisconsin","Wyoming","Puerto Rico"
  ];

  // Friendly suggestion list for the country field (students may type anything).
  const countries = [
    "United States","Afghanistan","Albania","Algeria","Argentina","Armenia","Australia",
    "Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium","Bolivia",
    "Bosnia and Herzegovina","Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile",
    "China","Colombia","Costa Rica","Croatia","Cuba","Czechia","Denmark","Dominican Republic",
    "Ecuador","Egypt","El Salvador","Estonia","Ethiopia","Finland","France","Georgia",
    "Germany","Ghana","Greece","Guatemala","Honduras","Hong Kong","Hungary","Iceland",
    "India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan",
    "Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Libya","Lithuania",
    "Luxembourg","Malaysia","Mexico","Mongolia","Morocco","Myanmar","Nepal","Netherlands",
    "New Zealand","Nicaragua","Nigeria","North Korea","North Macedonia","Norway","Oman",
    "Pakistan","Palestine","Panama","Paraguay","Peru","Philippines","Poland","Portugal",
    "Qatar","Romania","Russia","Rwanda","Saudi Arabia","Senegal","Serbia","Singapore",
    "Slovakia","Slovenia","Somalia","South Africa","South Korea","Spain","Sri Lanka","Sudan",
    "Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Tunisia",
    "Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom",
    "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
  ];

  const normalize = s => (s || "")
    .toString().trim().toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")  // strip accents
    .replace(/[^a-z0-9]+/g, " ").trim();

  // Maps a normalized input to the country name used by world-atlas (110m).
  // Only the tricky / abbreviated / alternately-spelled cases need an entry;
  // exact matches are resolved against the map's own names at render time.
  const A = {};
  const alias = (atlasName, variants) => variants.forEach(v => { A[normalize(v)] = atlasName; });

  alias("United States of America", ["united states","usa","us","u s a","u s","america",
    "the us","the usa","united states of america","murica","states"]);
  alias("United Kingdom", ["uk","u k","great britain","britain","england","scotland","wales",
    "northern ireland","united kingdom of great britain and northern ireland"]);
  alias("South Korea", ["korea","s korea","republic of korea","korea south","rok"]);
  alias("North Korea", ["n korea","korea north","dprk","democratic peoples republic of korea"]);
  alias("Russia", ["russian federation","ussr","russian"]);
  alias("China", ["prc","peoples republic of china","mainland china","china prc"]);
  alias("Taiwan", ["republic of china","chinese taipei","taiwan roc"]);
  alias("Hong Kong", ["hk","hong kong sar"]);
  alias("Vietnam", ["viet nam","socialist republic of vietnam"]);
  alias("Iran", ["islamic republic of iran","persia"]);
  alias("Syria", ["syrian arab republic"]);
  alias("Czechia", ["czech republic","czech"]);
  alias("Slovakia", ["slovak republic"]);
  alias("Bosnia and Herz.", ["bosnia and herzegovina","bosnia","herzegovina","bih"]);
  alias("North Macedonia", ["macedonia","fyrom","republic of north macedonia"]);
  alias("Dominican Rep.", ["dominican republic","dr"]);
  alias("Dem. Rep. Congo", ["democratic republic of the congo","dr congo","drc","congo kinshasa","congo drc"]);
  alias("Congo", ["republic of the congo","congo brazzaville"]);
  alias("Central African Rep.", ["central african republic","car"]);
  alias("S. Sudan", ["south sudan"]);
  alias("Eq. Guinea", ["equatorial guinea"]);
  alias("Solomon Is.", ["solomon islands"]);
  alias("Myanmar", ["burma"]);
  alias("Côte d'Ivoire", ["ivory coast","cote divoire","cote d ivoire"]);
  alias("eSwatini", ["eswatini","swaziland"]);
  alias("United Arab Emirates", ["uae","u a e","emirates"]);
  alias("Saudi Arabia", ["ksa","kingdom of saudi arabia"]);
  alias("Palestine", ["palestinian territories","west bank","gaza","state of palestine"]);
  alias("Tanzania", ["united republic of tanzania"]);
  alias("Cabo Verde", ["cape verde"]);
  alias("Timor-Leste", ["east timor"]);
  alias("Netherlands", ["holland","the netherlands"]);
  alias("Turkey", ["turkiye","republic of turkey"]);
  alias("Laos", ["lao pdr","lao peoples democratic republic"]);
  alias("Brunei", ["brunei darussalam"]);
  alias("Moldova", ["republic of moldova"]);
  alias("Venezuela", ["bolivarian republic of venezuela"]);
  alias("Bolivia", ["plurinational state of bolivia"]);

  // US state abbreviations and a couple of alternates → full names.
  const STATE_ALIASES = {};
  const sa = (full, abbr) => { STATE_ALIASES[normalize(abbr)] = full; };
  [["Alabama","AL"],["Alaska","AK"],["Arizona","AZ"],["Arkansas","AR"],["California","CA"],
   ["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["District of Columbia","DC"],
   ["District of Columbia","Washington DC"],["District of Columbia","Washington D C"],
   ["Florida","FL"],["Georgia","GA"],["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],
   ["Indiana","IN"],["Iowa","IA"],["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],
   ["Maine","ME"],["Maryland","MD"],["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],
   ["Mississippi","MS"],["Missouri","MO"],["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],
   ["New Hampshire","NH"],["New Jersey","NJ"],["New Mexico","NM"],["New York","NY"],
   ["North Carolina","NC"],["North Dakota","ND"],["Ohio","OH"],["Oklahoma","OK"],["Oregon","OR"],
   ["Pennsylvania","PA"],["Rhode Island","RI"],["South Carolina","SC"],["South Dakota","SD"],
   ["Tennessee","TN"],["Texas","TX"],["Utah","UT"],["Vermont","VT"],["Virginia","VA"],
   ["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"],
   ["Puerto Rico","PR"]
  ].forEach(([full,abbr]) => sa(full, abbr));

  window.PLACES = {
    countries, usStates, normalize,
    COUNTRY_ALIASES: A,
    STATE_ALIASES,
    // Resolve a free-text country to a map name, using aliases then a provided
    // index of {normalizedAtlasName: atlasName} built from the loaded map.
    matchCountry(input, atlasIndex) {
      const n = normalize(input);
      if (!n) return null;
      if (A[n]) return A[n];
      if (atlasIndex && atlasIndex[n]) return atlasIndex[n];
      return null;
    },
    // Resolve a free-text state to a full U.S. state name.
    matchState(input) {
      const n = normalize(input);
      if (!n) return null;
      if (STATE_ALIASES[n]) return STATE_ALIASES[n];
      const direct = usStates.find(s => normalize(s) === n);
      return direct || null;
    }
  };
})();
