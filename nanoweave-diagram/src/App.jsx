import { useState } from "react";

const C = {
  bg:      "#050e0a",
  panel:   "#091409",
  border:  "#143020",
  text:    "#b8dfc6",
  muted:   "#3a6050",
  accent:  "#39e87a",
  yellow:  "#f5c842",
  blue:    "#4db8ff",
  red:     "#f87171",
  purple:  "#c084fc",
  orange:  "#fb923c",
  teal:    "#2dd4bf",
  dim:     "#0c1a10",
};

const FLAG = {
  R: { col: "#f87171", label: "⚠ needs real data",   sym: "●" },
  Y: { col: "#f5c842", label: "~ moderate estimate", sym: "◑" },
  G: { col: "#39e87a", label: "✓ well-established",  sym: "●" },
};

const STEPS = [
  {
    id: "feedstock", label: "Feedstock\nPrep", step: "01", color: C.accent,
    x: 60, y: 100,
    equipment: ["EFB reception conveyor", "Fiber separator / decorticator", "Disc chipper", "Chip screens", "Covered chip storage"],
    conditions: ["EFB moisture in: 45–60%", "Target chip size: 20–30 mm", "No debarking required", "Throughput: 120 TPD EFB"],
    streams_in:  ["Raw EFB bales or loose fiber"],
    streams_out: ["Prepared chips → Fractionation", "Fines → Lignin valorization"],
    energy: {
      value: "20–30 kWh/t EFB",
      flag: "Y",
      note: "Dominated by conveying and chipping motors. Lower than kraft wood prep (no debarking drum).",
      kraft_equiv: "25–40 kWh/t — debarking + chipping combined.",
    },
    kraft: {
      step: "Wood Preparation (Step 01)",
      delta: "Simpler — no debarking drum needed. EFB fiber separates mechanically. Moisture management more critical due to higher EFB water content.",
      advantage: "Nanoweave",
    },
    opex: {
      nanoweave: "$5–8 / t EFB",
      kraft:     "$6–10 / t wood",
      flag: "Y",
      drivers: "Electricity (chipping), conveyor maintenance, labor. Lower than kraft due to eliminated debarking.",
      delta: "~20–30% lower OPEX vs kraft wood prep.",
    },
    capex: {
      nanoweave: "$1.5–3 M",
      kraft:     "$3–6 M",
      flag: "Y",
      drivers: "No debarking drum (largest cost item in kraft). Fiber separator is key new equipment.",
      delta: "~40–50% lower CAPEX. Debarking drum alone is $1–2M in kraft.",
    },
  },
  {
    id: "fractionation", label: "Plasma\nFractionation", step: "02", color: C.teal,
    x: 230, y: 100,
    equipment: ["Plasma hydrodynamic cavitation reactor (core unit)", "High-voltage plasma power supply", "Cavitation nozzle array", "Liquor recycle pump", "Heat exchanger / cooling loop", "Flash tank & degasser"],
    conditions: ["SED: 1.5 kWh/kg biomass d.b. (measured, lab scale)", "Medium: aqueous, atmospheric or low pressure", "No sulfur chemistry — sulfur-free process", "Plasma + cavitation synergy for lignin breakdown", "Residence time: TBD at pilot scale"],
    streams_in:  ["EFB chips or slurry", "Process water", "Electrical power (plasma)", "Optional: oxidant assist (H₂O₂ / O₃)"],
    streams_out: ["Cellulose fiber slurry → Washing", "Lignin-rich liquor → Valorization", "Hemicellulose stream → Energy / fermentation"],
    energy: {
      value: "~1.52 MWh/t cellulose (electrical) + 4.5 t steam/t cellulose",
      flag: "Y",
      note: "Scale-up from 50 TPD TEA to 120 TPD: TEA used 1.7 MWh/t at 50 TPD (scale penalty on 1.5 baseline). Applying six-tenths rule: 1.7 × (50/120)^0.4 = ~1.52 MWh/t at 120 TPD. Plasma kit config: 6 × 200 kW kits. Steam: 4.5 t/t cellulose. CHP on zero-cost palm mill waste biomass covers steam. Grid backup: $0.11/kWh (Colombia industrial).",
      kraft_equiv: "Kraft digester (electrical only): ~180–250 kWh/t pulp. Nanoweave at 1,520 kWh/t is ~6–8× higher electrically — but kraft total energy including recovery boiler fuel is much larger when full system boundary is applied.",
    },
    kraft: {
      step: "Digester / Cooking (Step 02)",
      delta: "Nanoweave MP+HC Venturi reactor replaces kraft digester entirely — no sulfur chemistry, no Na₂S, no TRS emissions, no recovery boiler or causticizing loop needed downstream. Plasma reactive species (NOx, OH•, O₃) + hydrodynamic cavitation achieve lignin disruption at atmospheric/low pressure vs 7–8 bar in kraft. Lignin exits as valorizable product stream.",
      advantage: "Nanoweave (chemistry + CAPEX) — Kraft (raw electrical intensity)",
    },
    opex: {
      nanoweave: "~$167/t cellulose (grid) → ~$30–50/t with CHP offset",
      kraft:     "$30–60 / t pulp",
      flag: "Y",
      drivers: "Electricity at 1.52 MWh/t × $0.11/kWh = ~$167/t at full grid price. CHP from zero-cost waste biomass covers majority of demand — net electricity OPEX estimated $30–50/t after self-generation. NaOH makeup: 0.06 t/t. H₂O₂: 0.03 t/t.",
      delta: "At grid price: 2–3× kraft. With CHP self-generation: approaches parity. CHP sizing and biomass availability are critical OPEX levers at 120 TPD.",
    },
    capex: {
      nanoweave: "$3.0–3.5 M (plasma venturi kits)",
      kraft:     "$15–25 M (Kamyr digester system)",
      flag: "G",
      drivers: "120 TPD requires ~6 × 200 kW kits at $500k each = $3.0M. Small alkaline pre-treatment tank ~$200k. No high-pressure feeder, no chip steaming vessel, no sulfur-rated metallurgy.",
      delta: "~$12–22M lower CAPEX vs kraft digester system. Single largest CAPEX saving in the process.",
    },
  },
  {
    id: "washing", label: "Fiber Washing\n& Screening", step: "03", color: C.blue,
    x: 400, y: 100,
    equipment: ["Wash press (2–3 stages)", "Pressure screens", "Hydrocyclone cleaners", "Screw press", "Filtrate recycle tank"],
    conditions: ["Consistency in: 3–5%", "Consistency out: 30–35%", "Washing efficiency: >95%", "Screen slot: 0.15–0.20 mm"],
    streams_in:  ["Cellulose slurry from fractionation", "Wash water (countercurrent)"],
    streams_out: ["Washed cellulose → Bleaching", "Weak liquor → Lignin valorization loop", "Screen rejects → Fines handling"],
    energy: {
      value: "30–50 kWh/t cellulose",
      flag: "Y",
      note: "Wash press and screen motors. No dissolved sulfur means simpler materials — lower maintenance energy.",
      kraft_equiv: "Kraft washing: 35–55 kWh/t — comparable but handles more chemically aggressive liquor.",
    },
    kraft: {
      step: "Brown Stock Washing (Step 03)",
      delta: "Nanoweave wash water contains no sulfide compounds — no H₂S risk, standard SS equipment acceptable. Kraft requires special alloys and sealed systems for TRS control.",
      advantage: "Nanoweave",
    },
    opex: {
      nanoweave: "$8–15 / t cellulose",
      kraft:     "$12–20 / t pulp",
      flag: "Y",
      drivers: "Electricity + wash water treatment. No sulfur management costs. Fewer specialty chemicals.",
      delta: "~25–35% lower OPEX. Sulfur handling is a major hidden cost in kraft washing.",
    },
    capex: {
      nanoweave: "$2–4 M",
      kraft:     "$4–7 M",
      flag: "Y",
      drivers: "Standard stainless wash presses. Kraft requires duplex SS and sealed hood systems for TRS containment.",
      delta: "~40% lower CAPEX. Materials of construction are simpler without sulfur chemistry.",
    },
  },
  {
    id: "bleaching", label: "Bleaching", step: "04", color: C.yellow,
    x: 570, y: 100,
    equipment: ["D₀ tower (ClO₂)", "E/O tower (NaOH + O₂)", "D₁ tower", "Interstage washers", "ClO₂ generator (if onsite)"],
    conditions: ["Sequence: D₀–E/O–D₁ (shortened ECF)", "ClO₂ charge: 3–5 kg/t (vs 5–8 in kraft)", "Target brightness: 85–92% ISO", "Final kappa: <1"],
    streams_in:  ["Washed cellulose", "ClO₂", "NaOH", "H₂O₂", "O₂"],
    streams_out: ["Bleached cellulose → Drying", "Bleach plant effluent → ETP"],
    energy: {
      value: "50–70 kWh/t cellulose",
      flag: "Y",
      note: "Lower than kraft equivalent due to lower incoming kappa number. Fewer bleaching stages needed.",
      kraft_equiv: "Kraft bleaching: 70–100 kWh/t — more stages, higher chemical heating loads.",
    },
    kraft: {
      step: "Bleaching (Step 05)",
      delta: "Nanoweave pulp enters bleaching with lower residual lignin (lower kappa) — D₀–E/O–D₁ sequence may suffice vs full D₀–E/O–D₁–E–D₂ in kraft. Reduced ClO₂ consumption by ~35–45%.",
      advantage: "Nanoweave",
    },
    opex: {
      nanoweave: "$25–45 / t cellulose",
      kraft:     "$50–80 / t pulp",
      flag: "Y",
      drivers: "ClO₂ is the dominant cost. Fewer stages = fewer chemical charges = lower OPEX.",
      delta: "~40–50% lower bleaching OPEX. ClO₂ reduction is the main lever.",
    },
    capex: {
      nanoweave: "$3–6 M",
      kraft:     "$6–10 M",
      flag: "Y",
      drivers: "Fewer tower stages (3 vs 5), smaller washers. ClO₂ generator may be shared or purchased externally.",
      delta: "~40% lower CAPEX from reduced number of bleaching stages.",
    },
  },
  {
    id: "lignin", label: "Lignin\nValorization", step: "05", color: C.purple,
    x: 400, y: 320,
    equipment: ["Oxidation / conditioning reactor", "pH adjustment tank", "Centrifuge or filter press", "Spray dryer (humic/fulvic)", "Product bagging line"],
    conditions: ["Lignin feed: oxidized liquor from fractionation", "pH adjustment: 2–4 (acid precipitation)", "Drying temp: 120–150 °C", "Target products: humic acids + fulvic acids"],
    streams_in:  ["Lignin-rich liquor from washing loop", "Acid (H₂SO₄ or CO₂)", "Process heat"],
    streams_out: ["Humic acid powder → Market", "Fulvic acid solution → Market", "Residual water → ETP"],
    energy: {
      value: "80–150 kWh/t lignin processed",
      flag: "R",
      note: "Spray drying is the dominant energy consumer. Exact split between humic vs fulvic fractions not yet characterized. LAB DATA NEEDED.",
      kraft_equiv: "No equivalent — kraft burns lignin in recovery boiler (energy recovery only, no product).",
    },
    kraft: {
      step: "Recovery Boiler (Step 07) — no equivalent",
      delta: "This step does not exist in kraft. Kraft burns lignin for energy recovery at ~$0 product value. Nanoweave converts lignin to humic/fulvic acids at $300–800/t market value — transforms a cost center into a revenue stream.",
      advantage: "Nanoweave (unique differentiator)",
    },
    opex: {
      nanoweave: "$20–45 / t product",
      kraft:     "N/A — lignin burned, no product",
      flag: "R",
      drivers: "Acid for precipitation, drying energy, packaging. Revenue from humic/fulvic ($300–800/t) should offset OPEX. Net OPEX likely negative (revenue-positive).",
      delta: "Revenue-generating step vs pure cost in kraft. Potential net positive contribution of $150–500/t product.",
    },
    capex: {
      nanoweave: "$3–7 M",
      kraft:     "$20–40 M (recovery boiler + ESP)",
      flag: "R",
      drivers: "Precipitation tank, filter press, spray dryer. No high-temperature combustion equipment needed.",
      delta: "~$15–35M CAPEX saving vs kraft recovery boiler. Most significant CAPEX differential in the process.",
    },
  },
  {
    id: "drying", label: "Cellulose\nDrying & Baling", step: "06", color: C.orange,
    x: 570, y: 320,
    equipment: ["Flash dryer or drum dryer", "Cyclone separator", "Bale press (hydraulic)", "Bale wrapper", "Warehouse conveyor"],
    conditions: ["Moisture in: 50–55%", "Moisture out: 8–10%", "Bale weight: 200–250 kg", "Output: market cellulose or textile-grade"],
    streams_in:  ["Bleached cellulose", "Process steam / hot air"],
    streams_out: ["Dried cellulose bales → Market", "Dryer exhaust → Scrubber"],
    energy: {
      value: "200–320 kWh/t cellulose",
      flag: "Y",
      note: "Evaporation of ~0.8–1.2 t water per t cellulose dominates. Steam supply from CHP integration opportunity.",
      kraft_equiv: "Kraft drying: 200–300 kWh/t — very similar, same unit operation.",
    },
    kraft: {
      step: "Pulp Drying (Step 09)",
      delta: "Essentially identical unit operation. Nanoweave may have slightly higher moisture content entering drying if wash press performance is lower — monitor at pilot scale.",
      advantage: "Neutral — same cost and technology.",
    },
    opex: {
      nanoweave: "$15–25 / t cellulose",
      kraft:     "$15–25 / t pulp",
      flag: "G",
      drivers: "Steam and electricity for drying dominate. Baling materials, labor. Essentially identical to kraft.",
      delta: "No significant difference. Parity with kraft.",
    },
    capex: {
      nanoweave: "$3–5 M",
      kraft:     "$3–5 M",
      flag: "G",
      drivers: "Flash dryer + bale press are commodity equipment. Same CAPEX regardless of upstream process.",
      delta: "No significant difference. Direct parity with kraft.",
    },
  },
];

const ARROWS = [
  ["feedstock",     "fractionation", "EFB chips",     C.accent],
  ["fractionation", "washing",       "fiber slurry",  C.teal],
  ["washing",       "bleaching",     "washed fiber",  C.blue],
  ["bleaching",     "drying",        "bleached",      C.yellow],
  ["fractionation", "lignin",        "lignin liquor", C.purple],
  ["washing",       "lignin",        "weak liquor",   C.muted],
];

const TABS = ["overview", "energy", "kraft", "costs"];
const TAB_LABELS = { overview:"Overview", energy:"Energy", kraft:"vs Kraft", costs:"OPEX / CAPEX" };

function FlagBadge({ flag }) {
  const f = FLAG[flag];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"4px",
      background:f.col+"22", border:`1px solid ${f.col}55`,
      borderRadius:"3px", padding:"1px 6px", fontSize:"8px",
      color:f.col, fontFamily:"monospace", whiteSpace:"nowrap" }}>
      {f.sym} {f.label}
    </span>
  );
}

function Row({ label, value, col }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      gap:"10px", marginBottom:"5px", paddingBottom:"5px", borderBottom:`1px solid ${C.border}` }}>
      <span style={{ fontSize:"9px", color:C.muted, fontFamily:"monospace", flexShrink:0 }}>{label}</span>
      <span style={{ fontSize:"10px", color:col||C.text, fontFamily:"monospace", textAlign:"right" }}>{value}</span>
    </div>
  );
}

function NodeBox({ node, selected, onClick }) {
  const isSel = selected === node.id;
  return (
    <div onClick={() => onClick(node.id)} style={{
      position:"absolute", left:node.x, top:node.y, width:115, height:74,
      background:isSel ? node.color+"1a" : C.panel,
      border:`1.5px solid ${isSel ? node.color : C.border}`,
      borderRadius:"7px", cursor:"pointer", transition:"all 0.15s ease",
      boxShadow:isSel ? `0 0 18px ${node.color}33` : "none",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", gap:"3px", zIndex:2,
    }}>
      <div style={{ fontSize:"8px", color:node.color, fontFamily:"monospace",
        letterSpacing:"0.15em", opacity:0.85 }}>STEP {node.step}</div>
      <div style={{ fontSize:"11px", fontWeight:700, color:isSel ? node.color : C.text,
        fontFamily:"monospace", textAlign:"center", lineHeight:1.3, whiteSpace:"pre-line" }}>
        {node.label}
      </div>
    </div>
  );
}

function ArrowSVG({ arrows, nodes }) {
  const nc = id => { const n = nodes.find(n => n.id === id); return { x:n.x+57, y:n.y+37 }; };
  const colorKey = col =>
    col===C.accent?"accent":col===C.muted?"muted":col===C.blue?"blue":
    col===C.yellow?"yellow":col===C.purple?"purple":col===C.teal?"teal":
    col===C.orange?"orange":"red";
  const colors = { accent:C.accent, muted:C.muted, blue:C.blue, yellow:C.yellow,
    purple:C.purple, teal:C.teal, orange:C.orange, red:C.red };
  return (
    <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%",
      pointerEvents:"none", overflow:"visible" }}>
      <defs>
        {Object.entries(colors).map(([k,v]) => (
          <marker key={k} id={`nw-${k}`} markerWidth="7" markerHeight="7"
            refX="5" refY="3.5" orient="auto">
            <polygon points="0 0,7 3.5,0 7" fill={v} opacity="0.75" />
          </marker>
        ))}
      </defs>
      {arrows.map(([from, to, label, col], i) => {
        const a = nc(from), b = nc(to);
        const dx = b.x-a.x, dy = b.y-a.y, len = Math.sqrt(dx*dx+dy*dy);
        const ux = dx/len, uy = dy/len, pad = 40;
        const x1 = a.x+ux*pad, y1 = a.y+uy*pad, x2 = b.x-ux*pad, y2 = b.y-uy*pad;
        const isDiag = Math.abs(dy) > 30;
        const cx = isDiag ? x1 : (x1+x2)/2, cy = isDiag ? y2 : (y1+y2)/2;
        const ck = colorKey(col);
        return (
          <g key={i}>
            <path d={`M${x1},${y1}Q${cx},${cy} ${x2},${y2}`}
              stroke={col} strokeWidth="1.5" fill="none" opacity="0.6"
              markerEnd={`url(#nw-${ck})`}
              strokeDasharray={col===C.muted ? "4 3" : "none"} />
            <text x={(x1+x2)/2} y={(y1+y2)/2-6} textAnchor="middle"
              fontSize="7.5" fill={col} opacity="0.75" fontFamily="monospace">{label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DetailPanel({ node, onClose }) {
  const [tab, setTab] = useState("overview");
  if (!node) return null;

  const Bullet = ({ items, col }) => (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ display:"flex", gap:"7px", marginBottom:"4px", alignItems:"flex-start" }}>
          <span style={{ color:col, fontSize:"9px", marginTop:"1px", flexShrink:0 }}>▸</span>
          <span style={{ fontSize:"10px", color:C.text, fontFamily:"monospace", lineHeight:1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );

  const STitle = ({ children, col }) => (
    <div style={{ fontSize:"8px", color:col||C.muted, fontFamily:"monospace",
      textTransform:"uppercase", letterSpacing:"0.12em",
      borderBottom:`1px solid ${C.border}`, paddingBottom:"4px", marginBottom:"8px" }}>
      {children}
    </div>
  );

  const Block = ({ children, style={} }) => (
    <div style={{ background:C.dim, borderRadius:"5px", padding:"10px 12px",
      marginBottom:"12px", border:`1px solid ${C.border}`, ...style }}>
      {children}
    </div>
  );

  return (
    <div style={{ position:"fixed", right:0, top:0, bottom:0, width:"330px",
      background:C.panel, borderLeft:`1px solid ${node.color}55`,
      display:"flex", flexDirection:"column", zIndex:100,
      boxShadow:`-8px 0 40px ${node.color}10` }}>

      <div style={{ padding:"16px 16px 10px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
          <div>
            <div style={{ fontSize:"8px", color:node.color, fontFamily:"monospace",
              letterSpacing:"0.15em", marginBottom:"3px" }}>STEP {node.step}</div>
            <div style={{ fontSize:"15px", fontWeight:700, color:node.color,
              fontFamily:"monospace", whiteSpace:"pre-line", lineHeight:1.3 }}>
              {node.label}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:node.color+"22", border:`1.5px solid ${node.color}`,
              borderRadius:"5px", color:node.color, cursor:"pointer",
              padding:"5px 11px", fontFamily:"monospace", fontSize:"12px",
              fontWeight:700, lineHeight:1, flexShrink:0 }}>
            ✕ close
          </button>
        </div>
        <div style={{ display:"flex", gap:"4px" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background:tab===t ? node.color+"22" : "transparent",
                border:`1px solid ${tab===t ? node.color : C.border}`,
                borderRadius:"4px", padding:"4px 8px", cursor:"pointer",
                color:tab===t ? node.color : C.muted,
                fontSize:"8px", fontFamily:"monospace", transition:"all 0.1s",
                letterSpacing:"0.05em" }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowY:"auto", padding:"14px 16px", flex:1 }}>
        {tab === "overview" && (
          <div>
            <STitle col={node.color}>Main Equipment</STitle>
            <Bullet items={node.equipment} col={node.color} />
            <div style={{ marginTop:"12px" }}>
              <STitle col={C.blue}>Operating Conditions</STitle>
              <Bullet items={node.conditions} col={C.blue} />
            </div>
            <div style={{ marginTop:"12px" }}>
              <STitle col={C.accent}>Streams In</STitle>
              <Bullet items={node.streams_in} col={C.accent} />
            </div>
            <div style={{ marginTop:"12px" }}>
              <STitle col={C.yellow}>Streams Out</STitle>
              <Bullet items={node.streams_out} col={C.yellow} />
            </div>
          </div>
        )}
        {tab === "energy" && (
          <div>
            <Block>
              <STitle col={C.yellow}>Energy Consumption</STitle>
              <div style={{ fontSize:"16px", fontWeight:700, color:C.yellow,
                fontFamily:"monospace", marginBottom:"6px" }}>{node.energy.value}</div>
              <FlagBadge flag={node.energy.flag} />
              <div style={{ fontSize:"10px", color:C.text, fontFamily:"monospace",
                lineHeight:1.6, marginTop:"8px" }}>{node.energy.note}</div>
            </Block>
            <Block>
              <STitle col={C.muted}>Kraft Reference</STitle>
              <div style={{ fontSize:"10px", color:"#7ab0c0", fontFamily:"monospace",
                lineHeight:1.6 }}>{node.energy.kraft_equiv}</div>
            </Block>
          </div>
        )}
        {tab === "kraft" && (
          <div>
            <Block>
              <STitle col={C.muted}>Kraft Equivalent Step</STitle>
              <div style={{ fontSize:"10px", color:"#7ab0c0", fontFamily:"monospace",
                marginBottom:"8px" }}>{node.kraft.step}</div>
              <STitle col={C.text}>Key Differences</STitle>
              <div style={{ fontSize:"10px", color:C.text, fontFamily:"monospace",
                lineHeight:1.6 }}>{node.kraft.delta}</div>
            </Block>
            <Block style={{ border:`1px solid ${C.accent}44`, background:"#081a0e" }}>
              <div style={{ fontSize:"8px", color:C.accent, fontFamily:"monospace",
                textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"5px" }}>
                ⬡ ADVANTAGE
              </div>
              <div style={{ fontSize:"11px", fontWeight:700, color:C.accent,
                fontFamily:"monospace" }}>{node.kraft.advantage}</div>
            </Block>
          </div>
        )}
        {tab === "costs" && (
          <div>
            <Block>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:"8px" }}>
                <STitle col={C.orange}>OPEX</STitle>
                <FlagBadge flag={node.opex.flag} />
              </div>
              <Row label="Nanoweave" value={node.opex.nanoweave} col={C.accent} />
              <Row label="Kraft"     value={node.opex.kraft}     col={C.red} />
              <div style={{ marginTop:"8px", fontSize:"10px", color:C.text,
                fontFamily:"monospace", lineHeight:1.6 }}>
                <span style={{ color:C.orange, fontSize:"8px" }}>DRIVERS: </span>
                {node.opex.drivers}
              </div>
              <div style={{ marginTop:"6px", padding:"5px 8px", background:C.bg,
                borderRadius:"3px", fontSize:"10px", color:C.yellow,
                fontFamily:"monospace", borderLeft:`2px solid ${C.yellow}` }}>
                Δ {node.opex.delta}
              </div>
            </Block>
            <Block>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:"8px" }}>
                <STitle col={C.purple}>CAPEX</STitle>
                <FlagBadge flag={node.capex.flag} />
              </div>
              <Row label="Nanoweave" value={node.capex.nanoweave} col={C.accent} />
              <Row label="Kraft"     value={node.capex.kraft}     col={C.red} />
              <div style={{ marginTop:"8px", fontSize:"10px", color:C.text,
                fontFamily:"monospace", lineHeight:1.6 }}>
                <span style={{ color:C.purple, fontSize:"8px" }}>DRIVERS: </span>
                {node.capex.drivers}
              </div>
              <div style={{ marginTop:"6px", padding:"5px 8px", background:C.bg,
                borderRadius:"3px", fontSize:"10px", color:C.yellow,
                fontFamily:"monospace", borderLeft:`2px solid ${C.yellow}` }}>
                Δ {node.capex.delta}
              </div>
            </Block>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const handleClick = id => setSelected(prev => prev===id ? null : id);
  const selectedNode = STEPS.find(s => s.id === selected);

  const legend = [
    { col:C.accent, label:"Fiber / feedstock" },
    { col:C.teal,   label:"Process stream" },
    { col:C.purple, label:"Lignin / valorization" },
    { col:C.muted,  label:"Recycle loop", dashed:true },
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"monospace",
      color:C.text, overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:#050e0a; }
        ::-webkit-scrollbar-thumb { background:#143020; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:#3a6050; }
      `}</style>

      <div style={{ padding:"14px 20px 12px", borderBottom:`1px solid ${C.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <div style={{ fontSize:"8px", color:C.muted, letterSpacing:"0.2em",
            textTransform:"uppercase" }}>NANOWEAVE BIOREFINERY · PROCESS REFERENCE</div>
          <div style={{ fontSize:"18px", fontWeight:700, color:C.accent, marginTop:"2px" }}>
            Nanoweave — Process Flow & Cost Map
          </div>
          <div style={{ fontSize:"9px", color:C.muted, marginTop:"3px" }}>
            EFB → Cellulose + Humic/Fulvic Acids · 120 TPD basis
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:"8px", color:C.muted, marginBottom:"4px" }}>TOTAL CAPEX ESTIMATE</div>
          <div style={{ fontSize:"14px", fontWeight:700, color:C.accent }}>$20–40 M</div>
          <div style={{ fontSize:"9px", color:C.muted }}>vs Kraft $51–93 M</div>
        </div>
      </div>

      <div style={{ padding:"6px 20px", background:C.dim, borderBottom:`1px solid ${C.border}`,
        display:"flex", gap:"16px", alignItems:"center", flexWrap:"wrap" }}>
        <span style={{ fontSize:"8px", color:C.muted, fontFamily:"monospace",
          textTransform:"uppercase", letterSpacing:"0.1em" }}>Data confidence:</span>
        {Object.entries(FLAG).map(([k, f]) => (
          <span key={k} style={{ display:"flex", alignItems:"center", gap:"4px",
            fontSize:"9px", color:f.col, fontFamily:"monospace" }}>
            {f.sym} {f.label}
          </span>
        ))}
      </div>

      <div style={{ padding:"18px 20px", paddingRight:selected ? "350px" : "20px",
        transition:"padding-right 0.2s ease" }}>

        <div style={{ overflowX:"auto", paddingBottom:"10px",
          scrollbarWidth:"thin", scrollbarColor:`${C.border} ${C.bg}` }}>
          <div style={{ position:"relative", width:"760px", height:"460px", minWidth:"760px" }}>
            <ArrowSVG arrows={ARROWS} nodes={STEPS} />
            <div style={{ position:"absolute", left:0, top:106, fontSize:"8px",
              color:C.muted, letterSpacing:"0.1em" }}>FIBER LINE →</div>
            <div style={{ position:"absolute", left:320, top:326, fontSize:"8px",
              color:C.muted, letterSpacing:"0.1em" }}>VALORIZATION →</div>
            <div style={{ position:"absolute", left:0, top:230, right:0,
              height:"1px", background:C.border, opacity:0.6 }} />
            <div style={{ position:"absolute", left:0, top:235, fontSize:"8px",
              color:C.border, fontFamily:"monospace" }}>
              ── ── ── ── ── ── ── ── ── ── ── ── ── ──
            </div>
            {STEPS.map(node => (
              <NodeBox key={node.id} node={node} selected={selected} onClick={handleClick} />
            ))}
          </div>
        </div>

        <div style={{ display:"flex", gap:"18px", marginTop:"8px", paddingTop:"8px",
          borderTop:`1px solid ${C.border}`, flexWrap:"wrap", alignItems:"center" }}>
          {legend.map(l => (
            <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <svg width="24" height="10">
                <line x1="0" y1="5" x2="24" y2="5" stroke={l.col} strokeWidth="1.5"
                  strokeDasharray={l.dashed ? "4 3" : "none"} />
              </svg>
              <span style={{ fontSize:"9px", color:C.muted }}>{l.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:"6px", marginTop:"12px", flexWrap:"wrap" }}>
          {STEPS.map(s => (
            <button key={s.id} onClick={() => handleClick(s.id)}
              style={{ background:selected===s.id ? s.color+"22" : C.dim,
                border:`1px solid ${selected===s.id ? s.color : C.border}`,
                borderRadius:"4px", padding:"5px 10px", cursor:"pointer",
                color:selected===s.id ? s.color : C.muted,
                fontSize:"9px", fontFamily:"monospace", transition:"all 0.12s ease" }}>
              {s.step} {s.label.replace("\n", " ")}
            </button>
          ))}
        </div>
      </div>

      <DetailPanel node={selectedNode} onClose={() => setSelected(null)} />
    </div>
  );
}
