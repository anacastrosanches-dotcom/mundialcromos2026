import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── PALETA ──────────────────────────────────────────
const C = {
  bg: "#090d16", surf: "#111827", surf2: "#1a2540", surf3: "#253058",
  green: "#00C853", red: "#FF1744", gold: "#FFD600", rare: "#FF6D00", legend: "#CE93D8",
  border: "rgba(255,255,255,0.08)", border2: "rgba(255,255,255,0.13)",
  text: "#e8eaf0", muted: "#7b85a0",
};

// ── SUPABASE ─────────────────────────────────────────
// ⚠️  Substitui pelos teus valores do Supabase Dashboard → Settings → API
const SUPABASE_URL  = "https://kvizmljhfzyysntipatl.supabase.co  ";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2aXptbGpoZnp5eXNudGlwYXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2Nzg2NzEsImV4cCI6MjA5MzI1NDY3MX0.z1c10X79rG9pTzMYrxo3pc2f-0AZty82IlteYwRlX60";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── DADOS ────────────────────────────────────────────
const SECTIONS = [
  {id:"FWC",name:"Introdução/Museu",flag:"🏆",count:20},
  {id:"COC",name:"Coca-Cola",flag:"🥤",count:12},
  {id:"POR",name:"Portugal",flag:"🇵🇹",count:20},
  {id:"ESP",name:"Espanha",flag:"🇪🇸",count:20},
  {id:"ARG",name:"Argentina",flag:"🇦🇷",count:20},
  {id:"BRA",name:"Brasil",flag:"🇧🇷",count:20},
  {id:"FRA",name:"França",flag:"🇫🇷",count:20},
  {id:"ENG",name:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",count:20},
  {id:"GER",name:"Alemanha",flag:"🇩🇪",count:20},
  {id:"NED",name:"Holanda",flag:"🇳🇱",count:20},
  {id:"ITA",name:"Itália",flag:"🇮🇹",count:20},
  {id:"BEL",name:"Bélgica",flag:"🇧🇪",count:20},
  {id:"CRO",name:"Croácia",flag:"🇭🇷",count:20},
  {id:"URU",name:"Uruguai",flag:"🇺🇾",count:20},
  {id:"COL",name:"Colômbia",flag:"🇨🇴",count:20},
  {id:"MEX",name:"México",flag:"🇲🇽",count:20},
  {id:"USA",name:"EUA",flag:"🇺🇸",count:20},
  {id:"CAN",name:"Canadá",flag:"🇨🇦",count:20},
  {id:"MAR",name:"Marrocos",flag:"🇲🇦",count:20},
  {id:"SEN",name:"Senegal",flag:"🇸🇳",count:20},
  {id:"KOR",name:"Coreia do Sul",flag:"🇰🇷",count:20},
  {id:"JPN",name:"Japão",flag:"🇯🇵",count:20},
  {id:"POL",name:"Polónia",flag:"🇵🇱",count:20},
  {id:"SCO",name:"Escócia",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",count:20},
  {id:"SUI",name:"Suíça",flag:"🇨🇭",count:20},
  {id:"ECU",name:"Equador",flag:"🇪🇨",count:20},
  {id:"GHA",name:"Gana",flag:"🇬🇭",count:20},
  {id:"NGA",name:"Nigéria",flag:"🇳🇬",count:20},
  {id:"AUS",name:"Austrália",flag:"🇦🇺",count:20},
  {id:"KSA",name:"Arábia Saudita",flag:"🇸🇦",count:20},
];

const PLAYERS = {
  POR1:"Emblema ⭐",POR2:"D.Costa",POR3:"José Sá",POR4:"R.Patrício",POR5:"Rúben Dias",
  POR6:"Pepe",POR7:"A.Silva",POR8:"N.Mendes",POR9:"J.Cancelo",POR10:"Vitinha",
  POR11:"B.Fernandes",POR12:"Bernardo",POR13:"Foto",POR14:"J.Neves",
  POR15:"R.Leão",POR16:"P.Neto",POR17:"G.Ramos",POR18:"C.Ronaldo 💎",POR19:"D.Jota",POR20:"J.Félix",
  ESP1:"Emblema ⭐",ESP2:"U.Simón",ESP3:"Le Normand",ESP4:"Laporte",ESP5:"Huijsen",
  ESP6:"Porro",ESP7:"Carvajal",ESP8:"Cucurella",ESP9:"Zubimendi",ESP10:"Rodri",
  ESP11:"Pedri",ESP12:"Fabián",ESP13:"Foto",ESP14:"Merino",ESP15:"Yamal 💎",
  ESP16:"N.Williams",ESP17:"Morata",ESP18:"Oyarzabal",ESP19:"Joselu",ESP20:"Torres",
  ARG1:"Emblema ⭐",ARG2:"E.Martínez",ARG3:"Romero",ARG4:"C.Romero",ARG5:"L.Martínez",
  ARG6:"Tagliafico",ARG7:"Molina",ARG8:"De Paul",ARG9:"E.Fernández",ARG10:"Mac Allister",
  ARG11:"Paredes",ARG12:"Di María",ARG13:"Foto",ARG14:"N.González",ARG15:"Dybala",
  ARG16:"L.Martínez",ARG17:"J.Álvarez",ARG18:"Messi 💎",ARG19:"Garnacho",ARG20:"Almada",
  BRA1:"Emblema ⭐",BRA2:"Alisson",BRA3:"Ederson",BRA4:"Danilo",BRA5:"Marquinhos",
  BRA6:"G.Magalhães",BRA7:"Wendell",BRA8:"Casemiro",BRA9:"Paquetá",BRA10:"B.Guimarães",
  BRA11:"Gerson",BRA12:"Raphinha",BRA13:"Foto",BRA14:"Rodrygo",BRA15:"Vinícius 💎",
  BRA16:"Endrick",BRA17:"Martinelli",BRA18:"Estêvão",BRA19:"L.Henrique",BRA20:"G.Jesus",
  FRA1:"Emblema ⭐",FRA17:"Mbappé 💎",
  ENG1:"Emblema ⭐",ENG9:"Bellingham 💎",ENG15:"H.Kane 💎",
  GER1:"Emblema ⭐",GER7:"Kimmich 💎",GER9:"Wirtz 💎",
  NED1:"Emblema ⭐",NED4:"Van Dijk",
  FWC9:"Itália 1934 ⭐",FWC10:"Uruguai 1950 ⭐",FWC11:"Alemanha 1954 ⭐",
  FWC12:"Brasil 1962 ⭐",FWC13:"Alemanha 1974 ⭐",FWC14:"Argentina 1986 ⭐",
  FWC15:"Brasil 1994 ⭐",FWC16:"Brasil 2002 ⭐",FWC17:"Itália 2006 ⭐",
  FWC18:"Alemanha 2014 ⭐",FWC19:"Argentina 2022 ⭐",FWC20:"França 1998 ⭐",
};

const LEGENDS = new Set(["ARG18","ESP15","POR18","BRA15","FRA17","ENG9","ENG15","GER7","GER9"]);

function getRarity(secId, num) {
  const key = secId + num;
  if (LEGENDS.has(key)) return "legendary";
  if (num === 1) return "special";
  if (secId === "FWC" && num >= 9) return "special";
  if (secId === "COC") return "coca";
  return "normal";
}

// ⚠️ Define aqui a tua password secreta de admin — não partilhes com ninguém!
const ADMIN_PASSWORD = "muda-esta-password-secreta-2026";

// ── ESTILOS PARTILHADOS ──────────────────────────────
const s = {
  page: {background:C.bg, minHeight:"100vh", fontFamily:"system-ui,sans-serif", color:C.text, overflowX:"hidden"},
  card: {background:C.surf, border:`1px solid ${C.border2}`, borderRadius:14, padding:"1rem"},
  btn: (bg,color="#000") => ({background:bg,color,border:"none",borderRadius:10,padding:".8rem 1.2rem",fontWeight:700,fontSize:"1rem",cursor:"pointer",width:"100%",fontFamily:"inherit"}),
  btnSm: (bg,color=C.text) => ({background:bg,color,border:`1px solid ${C.border2}`,borderRadius:8,padding:".35rem .75rem",fontWeight:600,fontSize:".8rem",cursor:"pointer",fontFamily:"inherit"}),
  input: {background:C.surf2,border:`1px solid ${C.border2}`,borderRadius:10,color:C.text,fontSize:".95rem",padding:".75rem 1rem",width:"100%",fontFamily:"inherit",outline:"none"},
  label: {fontSize:".72rem",fontWeight:700,color:C.muted,letterSpacing:".06em",textTransform:"uppercase",display:"block",marginBottom:".3rem"},
  topbar: {background:C.bg,borderBottom:`1px solid ${C.border}`,padding:".7rem 1rem",display:"flex",alignItems:"center",gap:".65rem",position:"sticky",top:0,zIndex:100},
};

// ════════════════════════════════════════════════════
// APP ROOT  — com Supabase Auth
// ════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen]           = useState("auth"); // auth | mode | grid | search | group | match | market | events
  const [authUser, setAuthUser]       = useState(null);   // Supabase auth user
  const [me, setMe]                   = useState(null);   // member profile
  const [members, setMembers]         = useState([]);
  const [market, setMarket]           = useState([]);
  const [events, setEvents]           = useState([]);
  const [gridMode, setGridMode]       = useState("have");
  const [matchTarget, setMatchTarget] = useState(null);
  const [toast, setToast]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [isAdmin, setIsAdmin]         = useState(false);
  const pendingCount = events.filter(e=>e.status==="pendente").length;

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(""),2400); };
  const go = (sc) => { setScreen(sc); window.scrollTo(0,0); };
  const openGrid = (mode) => { setGridMode(mode); go("grid"); };
  const openMatch = (name) => { setMatchTarget(name); go("match"); };

  // ── Fetch all shared data ────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    const [{ data: mems }, { data: mkt }, { data: evs }] = await Promise.all([
      sb.from("members").select("*").order("created_at"),
      sb.from("market").select("*").order("created_at",{ascending:false}),
      sb.from("events").select("*").order("created_at"),
    ]);
    if (mems) setMembers(mems.map(m=>({...m,have:m.have||{},need:m.need||{}})));
    if (mkt)  setMarket(mkt);
    if (evs)  setEvents(evs.map(e=>({...e,rsvps:e.rsvps||[]})));
  }, []);

  // ── Check Supabase session on mount ─────────────────────────────
  useEffect(() => {
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setAuthUser(session.user);
        await loadMemberProfile(session.user);
      }
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange(async (event, session) => {
      if (session) { setAuthUser(session.user); await loadMemberProfile(session.user); }
      else { setAuthUser(null); setMe(null); setIsAdmin(false); go("auth"); }
    });
    fetchAll();
    const ch = sb.channel("realtime-all")
      .on("postgres_changes",{event:"*",schema:"public",table:"members"},fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"market"}, fetchAll)
      .on("postgres_changes",{event:"*",schema:"public",table:"events"}, fetchAll)
      .subscribe();
    return () => { subscription.unsubscribe(); sb.removeChannel(ch); };
  }, [fetchAll]);

  // ── Load member profile from DB ──────────────────────────────────
  const loadMemberProfile = async (user) => {
    const { data } = await sb.from("members").select("*").eq("auth_id", user.id).single();
    if (data) {
      setMe({...data, have:data.have||{}, need:data.need||{}});
      const savedAdmin = localStorage.getItem("wc26_admin");
      if (savedAdmin==="1") setIsAdmin(true);
      go("mode");
    } else {
      // New user — needs to complete profile
      go("profile");
    }
    await fetchAll();
  };

  // ── Auth helpers ─────────────────────────────────────────────────
  const signUp = async (email, password) => {
    setLoading(true);
    const { error } = await sb.auth.signUp({ email, password });
    setLoading(false);
    if (error) return error.message;
    return null;
  };

  const signIn = async (email, password) => {
    setLoading(true);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return error.message;
    return null;
  };

  const signOut = async () => {
    setIsAdmin(false);
    localStorage.removeItem("wc26_admin");
    await sb.auth.signOut();
  };

  // ── Save profile after first sign-up ────────────────────────────
  const saveProfile = async (profile) => {
    setLoading(true);
    const { data } = await sb.from("members")
      .insert({...profile, auth_id: authUser.id, have:{}, need:{}})
      .select().single();
    if (data) { setMe({...data,have:{},need:{}}); await fetchAll(); go("mode"); }
    setLoading(false);
  };

  // ── Stickers ─────────────────────────────────────────────────────
  const saveStickers = async (updated) => {
    setLoading(true);
    await sb.from("members").update({have:updated.have,need:updated.need}).eq("auth_id",authUser.id);
    setMe(updated);
    await fetchAll();
    setLoading(false);
    showToast("Guardado ✓");
    go("mode");
  };

  // ── Market ───────────────────────────────────────────────────────
  const addMarket    = async (l) => { await sb.from("market").insert(l); await fetchAll(); };
  const deleteMarket = async (id) => { await sb.from("market").delete().eq("id",id); await fetchAll(); };

  // ── Events ───────────────────────────────────────────────────────
  const addEvent = async (ev) => {
    await sb.from("events").insert({...ev,status:"pendente",rsvps:[]});
    await fetchAll();
    showToast("Proposta enviada! Aguarda aprovação ✓");
    go("mode");
  };
  const approveEvent = async (id) => { await sb.from("events").update({status:"aprovado"}).eq("id",id); await fetchAll(); showToast("Encontro aprovado! ✓"); };
  const rejectEvent  = async (id) => { await sb.from("events").delete().eq("id",id); await fetchAll(); showToast("Proposta rejeitada."); };
  const rsvpEvent    = async (id) => {
    const ev = events.find(e=>e.id===id); if(!ev||!me) return;
    const has = ev.rsvps.includes(me.name);
    const rsvps = has ? ev.rsvps.filter(r=>r!==me.name) : [...ev.rsvps,me.name];
    await sb.from("events").update({rsvps}).eq("id",id); await fetchAll();
  };

  if (loading) return (
    <div style={{...s.page,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"1rem"}}>
      <div style={{fontSize:"2.5rem",animation:"spin 1s linear infinite"}}>⚽</div>
      <div style={{color:C.muted}}>A carregar…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={s.page}>
      {screen==="auth"    && <Auth onSignIn={signIn} onSignUp={signUp} showToast={showToast}/>}
      {screen==="profile" && <Profile onSave={saveProfile} showToast={showToast}/>}
      {screen==="mode"    && <Mode me={me} pendingCount={pendingCount} isAdmin={isAdmin}
        onAdminLogin={(pw)=>{ if(pw===ADMIN_PASSWORD){ setIsAdmin(true); localStorage.setItem("wc26_admin","1"); return true; } return false; }}
        onGo={(sc)=>{ if(sc==="grid-have") openGrid("have"); else if(sc==="grid-need") openGrid("need"); else go(sc); }}
        onLogout={signOut}/>}
      {screen==="grid"    && <Grid me={me} mode={gridMode} onBack={()=>go("mode")} onSave={saveStickers} showToast={showToast}/>}
      {screen==="search"  && <Search members={members} me={me} onBack={()=>go("mode")}/>}
      {screen==="group"   && <Group me={me} members={members} onBack={()=>go("mode")} onOpenMatch={openMatch}/>}
      {screen==="match"   && <MatchDetail me={me} members={members} target={matchTarget} onBack={()=>go("group")}/>}
      {screen==="market"  && <Market me={me} market={market} members={members} onBack={()=>go("mode")} onAdd={addMarket} onDelete={deleteMarket} showToast={showToast}/>}
      {screen==="events"  && <Events me={me} events={events} isAdmin={isAdmin} onBack={()=>go("mode")} onAdd={addEvent} onApprove={approveEvent} onReject={rejectEvent} onRsvp={rsvpEvent} showToast={showToast}/>}
      {toast && <Toast msg={toast}/>}
    </div>
  );
}
// ════════════════════════════════════════════════════
// AUTH — Login / Registo
// ════════════════════════════════════════════════════
function Auth({onSignIn, onSignUp, showToast}) {
  const [tab, setTab]         = useState("login"); // login | register
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if(!email.trim()||!email.includes("@")){showToast("Email inválido!");return}
    if(password.length<6){showToast("Password mínimo 6 caracteres!");return}
    setLoading(true);
    const err = tab==="login" ? await onSignIn(email,password) : await onSignUp(email,password);
    setLoading(false);
    if(err){
      if(err.includes("Invalid login")) showToast("Email ou password incorrectos.");
      else if(err.includes("already registered")) showToast("Este email já está registado. Faz login!");
      else showToast(err);
    } else if(tab==="register") {
      showToast("Conta criada! Completa o teu perfil.");
    }
  };

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".65rem",border:"none",cursor:"pointer",fontFamily:"inherit",
      fontWeight:700,fontSize:".9rem",
      background:tab===id?C.surf3:C.surf2,
      color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.green}`:"2px solid transparent",
    }}>{label}</button>
  );

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",gap:"1.5rem",background:C.bg}}>
      <div style={{width:90,height:115,borderRadius:12,background:"linear-gradient(160deg,#0a3d1f,#1565c0)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,boxShadow:"0 8px 40px #00000099"}}>
        <span style={{fontSize:"2.2rem"}}>⚽</span>
        <span style={{fontWeight:900,fontSize:".8rem",color:C.gold,letterSpacing:3}}>2026</span>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontWeight:900,fontSize:"2.5rem",lineHeight:.95}}>Trocas<br/><span style={{color:C.gold}}>Mundial</span><br/>2026</div>
        <p style={{color:C.muted,fontSize:".85rem",marginTop:".75rem"}}>Regista cromos, encontra matches e troca!</p>
      </div>
      <div style={{width:"100%",maxWidth:340,background:C.surf,borderRadius:16,overflow:"hidden",border:`1px solid ${C.border2}`}}>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
          <Tab id="login"    label="Entrar"/>
          <Tab id="register" label="Criar conta"/>
        </div>
        <div style={{padding:"1.25rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div>
            <label style={s.label}>Email</label>
            <input style={s.input} type="email" placeholder="o-teu@email.com"
              value={email} onChange={e=>setEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <div>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="mínimo 6 caracteres"
              value={password} onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <button style={s.btn(loading?"#555":C.green)} onClick={submit} disabled={loading}>
            {loading?"A processar…":tab==="login"?"Entrar →":"Criar conta →"}
          </button>
          {tab==="login"&&<p style={{fontSize:".72rem",color:C.muted,textAlign:"center",lineHeight:1.5}}>
            Ainda não tens conta? Clica em "Criar conta" acima.
          </p>}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// PROFILE — Completar perfil após registo
// ════════════════════════════════════════════════════
function Profile({onSave, showToast}) {
  const [name,  setName]  = useState("");
  const [local, setLocal] = useState("");
  const [mail,  setMail]  = useState("sim");
  const [rgpd,  setRgpd]  = useState(false);
  const [loading,setLoading]=useState(false);

  const submit = async () => {
    if(!name.trim()) {showToast("Escreve o teu nome!");return}
    if(!local.trim()){showToast("Indica a tua localidade!");return}
    if(!rgpd)        {showToast("Aceita os termos RGPD para continuar.");return}
    setLoading(true);
    await onSave({name:name.trim(), local:local.trim(), mail});
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem 1.5rem",gap:"1.25rem",background:C.bg}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontWeight:900,fontSize:"1.6rem"}}>Completa o teu perfil</div>
        <p style={{color:C.muted,fontSize:".85rem",marginTop:".3rem"}}>Só precisamos de mais alguns dados</p>
      </div>
      <div style={{width:"100%",maxWidth:340,display:"flex",flexDirection:"column",gap:".85rem"}}>
        <div>
          <label style={s.label}>O teu nome</label>
          <input style={s.input} placeholder="ex: João Silva" value={name} onChange={e=>setName(e.target.value)} maxLength={30}/>
        </div>
        <div>
          <label style={s.label}>Localidade</label>
          <input style={s.input} placeholder="ex: Lisboa, Porto, Braga…" value={local} onChange={e=>setLocal(e.target.value)} maxLength={40}/>
        </div>
        <div>
          <label style={s.label}>Envio por correio?</label>
          <select style={s.input} value={mail} onChange={e=>setMail(e.target.value)}>
            <option value="sim">✅ Sim, aceito envio CTT</option>
            <option value="nao">❌ Só presencial</option>
          </select>
        </div>
        <label style={{display:"flex",alignItems:"flex-start",gap:".65rem",cursor:"pointer",padding:".8rem",background:C.surf2,borderRadius:10,border:`1px solid ${C.border2}`}}>
          <input type="checkbox" checked={rgpd} onChange={e=>setRgpd(e.target.checked)} style={{width:16,height:16,marginTop:2,flexShrink:0,accentColor:C.green}}/>
          <span style={{fontSize:".72rem",color:C.muted,lineHeight:1.55}}>
            Concordo que o meu nome e localidade sejam partilhados com os membros deste grupo para fins de organização de trocas. Os dados podem ser removidos a qualquer momento.{" "}
            <strong style={{color:C.text}}>RGPD · art. 6.º(1)(a)</strong>
          </span>
        </label>
        <button style={s.btn(loading?"#555":C.green)} onClick={submit} disabled={loading}>
          {loading?"A guardar…":"Entrar na app →"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// MODE (menu principal)
// ════════════════════════════════════════════════════
function Mode({me, onGo, pendingCount, isAdmin, onLogout, onAdminLogin}) {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminPwErr, setAdminPwErr] = useState(false);

  const cards = [
    {icon:"✅",title:"Registar repetidos",desc:"Marca os cromos que tens a mais",sc:"grid-have"},
    {icon:"❌",title:"Registar em falta",desc:"Marca os cromos que precisas",sc:"grid-need"},
    {icon:"🔍",title:"Pesquisar cromo",desc:"Procura pelo nome, código ou raridade",sc:"search"},
    {icon:"🔄",title:"Matches no grupo",desc:"Vê quem tem o que precisas",sc:"group"},
    {icon:"💎",title:"Mercado de Raros",desc:"Propostas de troca para especiais e lendários",sc:"market"},
    {icon:"📅",title:"Encontros Presenciais",desc:"Propõe ou consulta encontros para trocar em mão",sc:"events",badge:pendingCount>0&&isAdmin?pendingCount:null},
  ];
  return (
    <div style={{minHeight:"100vh",background:C.bg,padding:"1.5rem"}}>
      <div style={{marginBottom:"1.25rem"}}>
        <div style={{fontWeight:900,fontSize:"1.7rem"}}>Olá, {me?.name.split(" ")[0]}! 👋</div>
        <div style={{color:C.muted,fontSize:".85rem",marginTop:".2rem"}}>📍 {me?.local} · {me?.mail==="sim"?"📬 Aceita envio":"🤝 Só presencial"}</div>
        {isAdmin
          ? <div style={{marginTop:".35rem",fontSize:".72rem",color:C.gold,fontWeight:700}}>⚙️ Modo Admin activo · <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>{setShowAdminLogin(false);}}>OK</span></div>
          : <button onClick={()=>setShowAdminLogin(v=>!v)} style={{marginTop:".35rem",background:"none",border:"none",color:C.muted,fontSize:".72rem",cursor:"pointer",padding:0,fontFamily:"inherit",textDecoration:"underline"}}>Entrar como admin</button>
        }
        {showAdminLogin && !isAdmin && (
          <div style={{marginTop:".5rem",display:"flex",gap:".5rem",alignItems:"center"}}>
            <input type="password" placeholder="Password de admin"
              style={{...s.input,fontSize:".8rem",padding:".45rem .75rem",flex:1}}
              value={adminPw} onChange={e=>setAdminPw(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"){ if(onAdminLogin(adminPw)){ setShowAdminLogin(false); setAdminPw(""); } else { setAdminPwErr(true); setTimeout(()=>setAdminPwErr(false),1500); } } }}
            />
            <button style={s.btn(C.green)} onClick={()=>{ if(onAdminLogin(adminPw)){ setShowAdminLogin(false); setAdminPw(""); } else { setAdminPwErr(true); setTimeout(()=>setAdminPwErr(false),1500); } }}>OK</button>
          </div>
        )}
        {adminPwErr && <div style={{fontSize:".72rem",color:C.red,marginTop:".25rem"}}>Password incorrecta</div>}
        <button onClick={onLogout} style={{marginTop:".35rem",background:"none",border:"none",color:C.muted,fontSize:".72rem",cursor:"pointer",padding:0,fontFamily:"inherit",textDecoration:"underline"}}>Sair / trocar de utilizador</button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:".75rem"}}>
        {cards.map(c=>(
          <button key={c.sc} onClick={()=>onGo(c.sc)} style={{background:C.surf,border:`1px solid ${C.border}`,borderRadius:14,padding:"1rem 1.1rem",cursor:"pointer",display:"flex",alignItems:"center",gap:"1rem",textAlign:"left",color:C.text,width:"100%",fontFamily:"inherit"}}>
            <span style={{fontSize:"1.7rem",flexShrink:0}}>{c.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:".5rem"}}>
                <span style={{fontWeight:700,fontSize:".95rem"}}>{c.title}</span>
                {c.badge && <span style={{background:C.red,color:"#fff",borderRadius:20,padding:".1rem .45rem",fontSize:".68rem",fontWeight:700}}>{c.badge} pendente{c.badge>1?"s":""}</span>}
              </div>
              <div style={{fontSize:".78rem",color:C.muted,marginTop:".15rem"}}>{c.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// GRID — registar cromos
// ════════════════════════════════════════════════════
function Grid({me, mode, onBack, onSave, showToast}) {
  const [data, setData] = useState(()=>({
    ...me,
    have: me.have ? JSON.parse(JSON.stringify(me.have)) : {},
    need: me.need ? JSON.parse(JSON.stringify(me.need)) : {},
  }));
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const isHave = mode==="have";

  const toggle = (secId, num) => {
    setData(prev => {
      const d = {...prev, have:{...prev.have}, need:{...prev.need}};
      if(!d.have[secId]) d.have[secId]={};
      if(!d.need[secId]) d.need[secId]={};
      d.have = {...d.have, [secId]:{...d.have[secId]}};
      d.need = {...d.need, [secId]:{...d.need[secId]}};
      if(isHave){
        d.have[secId][num] = d.have[secId][num] ? 0 : 1;
        if(d.have[secId][num]) d.need[secId][num]=0;
      } else {
        d.need[secId][num] = d.need[secId][num] ? 0 : 1;
        if(d.need[secId][num]) d.have[secId][num]=0;
      }
      return d;
    });
  };

  const toggleAll = (secId, val) => {
    const sec = SECTIONS.find(s=>s.id===secId);
    setData(prev=>{
      const d={...prev,have:{...prev.have,[secId]:{}},need:{...prev.need,[secId]:{}}};
      for(let i=1;i<=sec.count;i++){
        if(isHave) d.have[secId][i]=val?1:0;
        else d.need[secId][i]=val?1:0;
      }
      return d;
    });
  };

  const visibleSections = useMemo(()=>{
    const q = search.toLowerCase();
    return SECTIONS.filter(sec=>{
      if(filter==="RARE") return true;
      if(filter!=="ALL" && filter!==sec.id) return false;
      if(q) return sec.name.toLowerCase().includes(q)||sec.id.toLowerCase().includes(q)||
        Object.entries(PLAYERS).some(([k,v])=>k.startsWith(sec.id)&&v.toLowerCase().includes(q));
      return true;
    });
  },[filter,search]);

  const countHave = Object.values(data.have).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
  const countNeed = Object.values(data.need).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"5rem"}}>
      {/* Topbar */}
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{flex:1,fontWeight:700,fontSize:".9rem"}}>{isHave?"✅ Registar repetidos":"❌ Registar em falta"}</div>
        <span style={{fontSize:".75rem",color:C.green,fontWeight:700}}>✅{countHave}</span>
        <span style={{fontSize:".75rem",color:C.red,fontWeight:700,marginLeft:4}}>❌{countNeed}</span>
      </div>

      {/* Search */}
      <div style={{padding:".6rem 1rem"}}>
        <input style={{...s.input,fontSize:".85rem"}} placeholder="🔍 Filtrar seleção…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>

      {/* Filter chips */}
      <div style={{display:"flex",gap:".4rem",overflowX:"auto",padding:".4rem 1rem .6rem",scrollbarWidth:"none"}}>
        {["ALL","RARE",...SECTIONS.map(s=>s.id)].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{
            background:filter===f?(f==="RARE"?C.rare:C.green):C.surf,
            color:filter===f?"#000":C.text,
            border:`1px solid ${C.border}`,borderRadius:20,
            padding:".25rem .8rem",fontSize:".75rem",fontWeight:filter===f?700:500,
            cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,fontFamily:"inherit"
          }}>
            {f==="ALL"?"Todas":f==="RARE"?"⭐ Raros":f}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:".85rem",padding:".4rem 1rem .6rem",borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {[["#fff2",C.border,"Normal"],["#00c85318",C.green,"Tenho"],["#ff174418",C.red,"Falta"],["#ffd60015",C.gold,"⭐ Especial"],["#9c27b015","#CE93D8","💎 Lendário"]].map(([bg,bc,lbl])=>(
          <div key={lbl} style={{display:"flex",alignItems:"center",gap:".3rem",fontSize:".72rem",color:C.muted}}>
            <div style={{width:11,height:11,borderRadius:3,background:bg,border:`2px solid ${bc}`}}/>
            {lbl}
          </div>
        ))}
      </div>

      {/* Sections */}
      {visibleSections.map(sec=>{
        const haveCount=Object.values(data.have[sec.id]||{}).filter(Boolean).length;
        const pct=Math.round(haveCount/sec.count*100);
        const nums=[];
        for(let i=1;i<=sec.count;i++){
          const r=getRarity(sec.id,i);
          if(filter==="RARE"&&r==="normal") continue;
          nums.push(i);
        }
        if(!nums.length) return null;
        return (
          <div key={sec.id} style={{padding:".85rem 1rem .5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:".6rem",marginBottom:".6rem"}}>
              <span style={{fontSize:"1.4rem"}}>{sec.flag}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.name} <span style={{color:C.muted,fontWeight:400,fontSize:".75rem"}}>{sec.id}</span></div>
                <div style={{height:3,background:C.border,borderRadius:2,marginTop:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:C.green,borderRadius:2,transition:"width .3s"}}/>
                </div>
              </div>
              <button onClick={()=>toggleAll(sec.id,true)} style={s.btnSm(C.surf3)}>All</button>
              <button onClick={()=>toggleAll(sec.id,false)} style={s.btnSm(C.surf3)}>✕</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(52px,1fr))",gap:".35rem"}}>
              {nums.map(i=>{
                const r=getRarity(sec.id,i);
                const hasIt=(data.have[sec.id]||{})[i];
                const needIt=(data.need[sec.id]||{})[i];
                const isLeg=r==="legendary", isSp=r==="special"||r==="coca";
                let bg=C.surf, bc=C.border, numColor=C.muted;
                if(hasIt){bg="#00c85318";bc=C.green;numColor=C.green;}
                else if(needIt){bg="#ff174418";bc=C.red;numColor=C.red;}
                else if(isLeg){bg="#9c27b015";bc="#9c27b060";}
                else if(isSp){bg="#ffd60015";bc="#ffd60060";}
                const shortName=(PLAYERS[sec.id+i]||"").replace("💎","").replace("⭐","").trim().split(" ").slice(-1)[0];
                return (
                  <button key={i} onClick={()=>toggle(sec.id,i)} style={{
                    aspectRatio:"1",background:bg,border:`2px solid ${bc}`,borderRadius:8,
                    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                    cursor:"pointer",position:"relative",padding:2,fontFamily:"inherit"
                  }}>
                    {(isLeg||isSp||r==="coca")&&<span style={{position:"absolute",top:2,left:3,fontSize:".5rem"}}>{isLeg?"💎":r==="coca"?"🥤":"⭐"}</span>}
                    <span style={{fontSize:".55rem",color:C.muted,lineHeight:1}}>{sec.id}</span>
                    <span style={{fontSize:".72rem",fontWeight:700,color:numColor}}>{i}</span>
                    {shortName&&<span style={{fontSize:".42rem",color:C.muted,lineHeight:1,maxWidth:"100%",overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",paddingInline:2}}>{shortName}</span>}
                    {hasIt&&<span style={{position:"absolute",top:1,right:3,fontSize:".5rem",color:C.green,fontWeight:700}}>✓</span>}
                    {needIt&&<span style={{position:"absolute",top:1,right:3,fontSize:".5rem",color:C.red,fontWeight:700}}>✕</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Save bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.bg,borderTop:`1px solid ${C.border}`,padding:".85rem 1rem",display:"flex",gap:".65rem",zIndex:200}}>
        <button style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={onBack}>Cancelar</button>
        <button style={{...s.btn(C.green),flex:2}} onClick={()=>onSave(data)}>Guardar ✓</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// SEARCH
// ════════════════════════════════════════════════════
function Search({members, me, onBack}) {
  const [q,setQ]=useState("");

  const results = useMemo(()=>{
    if(!q.trim()) return [];
    const t=q.toLowerCase();
    const out=[];
    SECTIONS.forEach(sec=>{
      for(let i=1;i<=sec.count;i++){
        const name=(PLAYERS[sec.id+i]||"").toLowerCase();
        const code=(sec.id+i).toLowerCase();
        const r=getRarity(sec.id,i);
        const rl=r==="legendary"?"lendário":r==="special"?"especial":r==="coca"?"coca-cola":"normal";
        if(name.includes(t)||code.includes(t)||sec.name.toLowerCase().includes(t)||rl.includes(t)){
          const hasIt=members.filter(m=>(m.have[sec.id]||{})[i]).map(m=>m.name);
          const needsIt=members.filter(m=>(m.need[sec.id]||{})[i]).map(m=>m.name);
          out.push({sec,i,r,name:PLAYERS[sec.id+i]||sec.id+i,hasIt,needsIt});
        }
      }
    });
    return out.slice(0,50);
  },[q,members]);

  const rLabel={normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
  const rColor={normal:C.muted,special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,fontSize:".9rem",flex:1}}>🔍 Pesquisar cromo</div>
      </div>
      <div style={{padding:".75rem 1rem"}}>
        <input autoFocus style={s.input} placeholder="Nome, código (ex: POR18), seleção, raridade…" value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      {!q && <div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
        <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>🔍</div>
        <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Pesquisa qualquer cromo</div>
        <div style={{fontSize:".85rem",lineHeight:1.6}}>Ex: "Messi", "POR18", "especial", "Portugal"…<br/>Vês quem tem e quem precisa no grupo.</div>
      </div>}
      {results.map(({sec,i,r,name,hasIt,needsIt})=>(
        <div key={sec.id+i} style={{display:"flex",gap:".85rem",padding:".85rem 1rem",borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:44,height:44,borderRadius:8,background:C.surf2,border:`1px solid ${C.border2}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:".58rem",color:C.muted}}>{sec.id}</span>
            <span style={{fontSize:".85rem",fontWeight:700}}>{i}</span>
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.flag} {name}</div>
            <div style={{display:"flex",alignItems:"center",gap:".4rem",marginTop:".2rem"}}>
              <span style={{fontSize:".7rem",fontWeight:700,color:rColor[r],background:rColor[r]+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${rColor[r]}40`}}>{rLabel[r]}</span>
            </div>
            {(hasIt.length||needsIt.length)?<div style={{display:"flex",gap:".3rem",flexWrap:"wrap",marginTop:".35rem"}}>
              {hasIt.map(n=><span key={n} style={{fontSize:".7rem",background:"#00c85312",color:C.green,borderRadius:20,padding:".15rem .5rem"}}>✅ {n}</span>)}
              {needsIt.map(n=><span key={n} style={{fontSize:".7rem",background:C.surf2,color:C.muted,borderRadius:20,padding:".15rem .5rem"}}>❌ {n}</span>)}
            </div>:<div style={{fontSize:".72rem",color:C.muted,marginTop:".3rem"}}>Ninguém marcou ainda</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════
// GROUP
// ════════════════════════════════════════════════════
function computeMatches(a,b){
  const give=[],get=[];
  SECTIONS.forEach(sec=>{
    for(let i=1;i<=sec.count;i++){
      if((a.have[sec.id]||{})[i]&&(b.need[sec.id]||{})[i]) give.push({code:sec.id+i,r:getRarity(sec.id,i)});
      if((b.have[sec.id]||{})[i]&&(a.need[sec.id]||{})[i]) get.push({code:sec.id+i,r:getRarity(sec.id,i)});
    }
  });
  return{give,get};
}

function Group({me, members, onBack, onOpenMatch}) {
  const [cityFilter, setCityFilter] = useState("ALL");
  const [mailFilter, setMailFilter] = useState("ALL"); // ALL | sim | nao
  const [matchOnly, setMatchOnly]   = useState(false);

  // All unique cities in the group
  const cities = useMemo(() => {
    const all = [...new Set(members.map(m => m.local).filter(Boolean))].sort();
    return all;
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter(m => {
      if (cityFilter !== "ALL" && (m.local||"").toLowerCase() !== cityFilter.toLowerCase()) return false;
      if (mailFilter !== "ALL" && m.mail !== mailFilter) return false;
      if (matchOnly) {
        if (!me || m.name === me.name) return false;
        const {give,get} = computeMatches(me, m);
        if (give.length + get.length === 0) return false;
      }
      return true;
    });
  }, [members, cityFilter, mailFilter, matchOnly, me]);

  const FilterChip = ({label, active, onClick, color}) => (
    <button onClick={onClick} style={{
      background: active ? (color||C.green) : C.surf2,
      color: active ? "#000" : C.text,
      border: `1px solid ${active ? (color||C.green) : C.border2}`,
      borderRadius: 20, padding: ".28rem .85rem",
      fontSize: ".78rem", fontWeight: active ? 700 : 500,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: "inherit",
    }}>{label}</button>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,fontSize:".9rem",flex:1}}>🔄 Matches no grupo</div>
        <span style={{fontSize:".75rem",color:C.muted}}>{filtered.length}/{members.length}</span>
      </div>

      {/* ── FILTROS ── */}
      <div style={{padding:".75rem 1rem .5rem",display:"flex",flexDirection:"column",gap:".6rem",borderBottom:`1px solid ${C.border}`}}>

        {/* Só com matches */}
        <label style={{display:"flex",alignItems:"center",gap:".6rem",cursor:"pointer"}}>
          <div onClick={()=>setMatchOnly(v=>!v)} style={{
            width:40,height:22,borderRadius:11,
            background: matchOnly ? C.green : C.surf3,
            border:`1px solid ${matchOnly?C.green:C.border2}`,
            position:"relative",transition:"background .2s",cursor:"pointer",flexShrink:0,
          }}>
            <div style={{
              width:16,height:16,borderRadius:"50%",background:"#fff",
              position:"absolute",top:2,
              left: matchOnly ? 20 : 2,
              transition:"left .2s",
            }}/>
          </div>
          <span style={{fontSize:".82rem",fontWeight:600}}>Só membros com matches comigo</span>
        </label>

        {/* Cidade */}
        {cities.length > 1 && (
          <div>
            <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:".35rem"}}>📍 Cidade</div>
            <div style={{display:"flex",gap:".4rem",overflowX:"auto",scrollbarWidth:"none"}}>
              <FilterChip label="Todas" active={cityFilter==="ALL"} onClick={()=>setCityFilter("ALL")}/>
              {cities.map(c=>(
                <FilterChip key={c} label={c} active={cityFilter===c} onClick={()=>setCityFilter(cityFilter===c?"ALL":c)}/>
              ))}
            </div>
          </div>
        )}

        {/* Modo de troca */}
        <div>
          <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase",marginBottom:".35rem"}}>📦 Modo de troca</div>
          <div style={{display:"flex",gap:".4rem"}}>
            <FilterChip label="Todos" active={mailFilter==="ALL"} onClick={()=>setMailFilter("ALL")}/>
            <FilterChip label="📬 Aceita envio" active={mailFilter==="sim"} onClick={()=>setMailFilter(mailFilter==="sim"?"ALL":"sim")}/>
            <FilterChip label="🤝 Só presencial" active={mailFilter==="nao"} onClick={()=>setMailFilter(mailFilter==="nao"?"ALL":"nao")} color={C.rare}/>
          </div>
        </div>
      </div>

      {/* ── RESULTADOS ── */}
      {filtered.length === 0 && (
        <div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
          <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>🔍</div>
          <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Sem resultados</div>
          <div style={{fontSize:".85rem"}}>Tenta ajustar os filtros.</div>
        </div>
      )}

      <div style={{padding:".75rem"}}>
        {filtered.map(m=>{
          const isSelf=me&&m.name===me.name;
          const matches=me&&!isSelf?computeMatches(me,m):{give:[],get:[]};
          const total=matches.give.length+matches.get.length;
          const h=Object.values(m.have).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
          const n=Object.values(m.need).reduce((a,o)=>a+Object.values(o).filter(Boolean).length,0);
          return (
            <div key={m.name} onClick={()=>!isSelf&&onOpenMatch(m.name)}
              style={{...s.card,marginBottom:".75rem",cursor:isSelf?"default":"pointer",border:total>0?`1px solid ${C.gold}30`:s.card.border}}>
              <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".5rem"}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#1565c0,#00c853)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:".95rem",flexShrink:0}}>
                  {m.name[0].toUpperCase()}
                </div>
                <div style={{fontWeight:700,flex:1}}>{m.name}{isSelf?" (tu)":""}</div>
                {total>0&&!isSelf&&<span style={{background:C.gold,color:"#000",borderRadius:20,padding:".18rem .65rem",fontSize:".72rem",fontWeight:700}}>🔄 {total}</span>}
              </div>
              <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
                {[["Repet.",h],["Falta",n]].map(([l,v])=>(
                  <span key={l} style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>{l}: <strong style={{color:C.text}}>{v}</strong></span>
                ))}
                {m.local&&<span style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>📍 <strong style={{color:C.text}}>{m.local}</strong></span>}
                <span style={{fontSize:".72rem",color:C.muted,background:C.surf2,borderRadius:20,padding:".18rem .55rem"}}>{m.mail==="sim"?"📬 Envio":"🤝 Presencial"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// MATCH DETAIL
// ════════════════════════════════════════════════════
function MatchDetail({me, members, target, onBack}) {
  const member = members.find(m=>m.name===target);
  const matches = me&&member ? computeMatches(me,member) : {give:[],get:[]};
  const total = matches.give.length+matches.get.length;
  const rColor={normal:C.muted,special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  const Pill=({item,cls})=>{
    const isRare=item.r!=="normal";
    return <span style={{borderRadius:6,padding:".22rem .55rem",fontSize:".78rem",fontWeight:700,
      border:`1px solid ${cls==="give"?C.green+"55":C.red+"55"}`,
      color:isRare?rColor[item.r]:cls==="give"?C.green:C.red,
      background:cls==="give"?"#00c85310":"#ff174410"}}>
      {isRare?(item.r==="legendary"?"💎":"⭐"):""}{item.code}
    </span>;
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>Tu ↔ {target}</div>
      </div>

      {total===0?<div style={{textAlign:"center",padding:"3rem 1.5rem",color:C.muted}}>
        <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>😕</div>
        <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Sem matches ainda</div>
        <div style={{fontSize:".85rem"}}>Nenhum cromo complementar com {target} de momento.</div>
      </div>:<>
        <div style={{background:"linear-gradient(135deg,#00c85312,#1565c012)",border:`1px solid #00c85330`,borderRadius:14,margin:"1rem",padding:"1.2rem",textAlign:"center"}}>
          <div style={{fontWeight:900,fontSize:"2.8rem",color:C.gold,lineHeight:1}}>{total}</div>
          <div style={{fontSize:".82rem",color:C.muted,marginTop:".25rem"}}>{matches.give.length} que tu dás · {matches.get.length} que recebes</div>
        </div>

        {matches.give.length>0&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>✅ Tu dás a {target} ({matches.give.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:".35rem"}}>{matches.give.map(x=><Pill key={x.code} item={x} cls="give"/>)}</div>
        </div>}

        {matches.get.length>0&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>❌ Recebes de {target} ({matches.get.length})</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:".35rem"}}>{matches.get.map(x=><Pill key={x.code} item={x} cls="get"/>)}</div>
        </div>}

        {member&&<div style={{margin:"0 1rem 1.25rem"}}>
          <div style={{fontSize:".72rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:C.muted,marginBottom:".6rem",paddingBottom:".35rem",borderBottom:`1px solid ${C.border}`}}>📦 Contacto</div>
          <p style={{fontSize:".85rem",color:C.muted,lineHeight:1.6}}>
            {target} {member.mail==="sim"?<strong style={{color:C.text}}>aceita envio CTT 📬</strong>:<><strong style={{color:C.text}}>só presencial 🤝</strong></>}.
            {member.local&&<> Está em <strong style={{color:C.text}}>{member.local}</strong>.</>}
            {" "}Envia mensagem no WhatsApp para combinar!
          </p>
        </div>}

        {[...matches.give,...matches.get].some(x=>x.r!=="normal")&&<div style={{margin:"0 1rem 1.25rem",background:"#ffd60010",border:`1px solid #ffd60030`,borderRadius:12,padding:"1rem"}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:C.gold,marginBottom:".35rem"}}>💎 Cromos raros envolvidos</div>
          <p style={{fontSize:".82rem",color:C.muted,lineHeight:1.5}}>Esta troca tem especiais ou lendários. Usa o <strong style={{color:C.text}}>Mercado de Raros</strong> para publicar condições específicas.</p>
        </div>}
      </>}
    </div>
  );
}

// ════════════════════════════════════════════════════
// MARKET — Mercado de Raros (com pesquisa de matches)
// ════════════════════════════════════════════════════
function Market({me, market, members, onBack, onAdd, onDelete, showToast}) {
  const [tab, setTab]         = useState("mercado"); // mercado | pesquisa
  const [code, setCode]       = useState("");
  const [want, setWant]       = useState("");
  const [rarity, setRarity]   = useState("special");
  const [reply, setReply]     = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchQ, setSearchQ] = useState("");

  const rLabel = {normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
  const rColor = {special:C.gold,legendary:C.legend,coca:"#ff6b6b"};

  const submit = () => {
    if(!code.trim()||!want.trim()){showToast("Preenche o código e o que pedes!");return}
    const c = code.trim().toUpperCase();
    if(!SECTIONS.some(s=>c.startsWith(s.id))){showToast("Código inválido — ex: ARG18, ESP15");return}
    onAdd({id:Date.now(),code:c,player:PLAYERS[c]||"",rarity,by:me.name,want});
    setCode("");setWant("");
    showToast("Proposta publicada! ✓");
  };

  // ── Pesquisa: quem TEM o cromo que pesquiso (e eu preciso), quem PRECISA do que tenho ──
  const searchResults = useMemo(()=>{
    const q = searchQ.trim().toUpperCase();
    if(!q) return null;
    // Find matching stickers
    const matches = [];
    SECTIONS.forEach(sec=>{
      for(let i=1;i<=sec.count;i++){
        const code = sec.id+i;
        const name = (PLAYERS[code]||"").toUpperCase();
        if(!code.includes(q) && !name.includes(q.toLowerCase().toUpperCase()) && !sec.name.toUpperCase().includes(q)) continue;
        const r = getRarity(sec.id,i);
        const iNeedIt  = me && (me.need[sec.id]||{})[i];
        const iHaveIt  = me && (me.have[sec.id]||{})[i];
        const whoHasIt = members.filter(m=>m.name!==me?.name&&(m.have[sec.id]||{})[i]).map(m=>({name:m.name,email:m.email||"",mail:m.mail}));
        const whoNeedsIt = members.filter(m=>m.name!==me?.name&&(m.need[sec.id]||{})[i]).map(m=>({name:m.name,email:m.email||"",mail:m.mail}));
        matches.push({code,sec,i,r,name:PLAYERS[code]||code,iNeedIt,iHaveIt,whoHasIt,whoNeedsIt});
      }
    });
    return matches.slice(0,30);
  },[searchQ,members,me]);

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".6rem",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:".82rem",
      background:tab===id?C.surf3:C.surf2,color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.rare}`:"2px solid transparent",transition:"all .15s",
    }}>{label}</button>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"2rem"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>💎 Mercado de Raros</div>
      </div>

      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <Tab id="mercado"  label="💎 Propostas"/>
        <Tab id="pesquisa" label="🔍 Pesquisar match"/>
      </div>

      {/* ══ TAB: MERCADO ══ */}
      {tab==="mercado" && <>
        {/* New listing form */}
        <div style={{...s.card,margin:"1rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{fontWeight:700}}>➕ Nova proposta</div>
          <div>
            <label style={s.label}>Cromo que ofereces (código)</label>
            <input style={s.input} placeholder="ex: ARG18" value={code}
              onChange={e=>setCode(e.target.value.toUpperCase())}/>
            {PLAYERS[code.toUpperCase()]&&<div style={{fontSize:".75rem",color:C.gold,marginTop:".3rem",fontWeight:600}}>
              → {PLAYERS[code.toUpperCase()]} ({getRarity(code.replace(/\d+/g,""),parseInt(code.replace(/\D/g,""))) !== "normal" ? "⭐ raro" : "normal"})
            </div>}
          </div>
          <div>
            <label style={s.label}>O que pedes em troca</label>
            <textarea style={{...s.input,minHeight:70,resize:"vertical"}}
              placeholder="ex: Troco por ESP15 (Yamal) OU por 4 cromos normais à minha escolha"
              value={want} onChange={e=>setWant(e.target.value)}/>
          </div>
          <div>
            <label style={s.label}>Raridade</label>
            <select style={s.input} value={rarity} onChange={e=>setRarity(e.target.value)}>
              <option value="special">⭐ Especial (foil/brilhante)</option>
              <option value="legendary">💎 Lendário (Messi, CR7…)</option>
              <option value="coca">🥤 Coca-Cola exclusivo</option>
            </select>
          </div>
          <button style={s.btn("linear-gradient(135deg,#FF6D00,#ff9800)")} onClick={submit}>Publicar proposta</button>
        </div>

        {!market.length&&<div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
          <div style={{fontSize:"2rem",marginBottom:".5rem"}}>💎</div>
          <div>Sem propostas ainda. Sê o primeiro!</div>
        </div>}

        {market.map(l=>(
          <div key={l.id} style={{...s.card,margin:"0 1rem .75rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".75rem"}}>
              <div style={{width:48,height:48,borderRadius:10,background:"linear-gradient(135deg,#ffd60020,#ff980020)",border:`2px solid #ffd60060`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:".58rem",fontWeight:700,color:C.muted}}>{l.code.replace(/\d+/g,"")}</span>
                <span style={{fontSize:".85rem",fontWeight:700}}>{l.code.replace(/[A-Z]+/g,"")}</span>
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:".9rem"}}>{l.code} {l.player&&`· ${l.player}`}</div>
                <span style={{fontSize:".7rem",fontWeight:700,color:rColor[l.rarity]||C.gold,background:(rColor[l.rarity]||C.gold)+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${(rColor[l.rarity]||C.gold)}40`}}>{rLabel[l.rarity]}</span>
              </div>
            </div>
            <div style={{fontSize:".75rem",color:C.muted,marginBottom:".35rem"}}>Proposta de <strong style={{color:C.text}}>{l.by}</strong></div>
            <div style={{fontSize:".9rem",lineHeight:1.5,marginBottom:".85rem"}}>{l.want}</div>
            {reply===l.id?(
              <div style={{background:C.surf2,borderRadius:10,padding:".85rem",marginBottom:".75rem"}}>
                <div style={{fontWeight:700,fontSize:".85rem",marginBottom:".5rem"}}>A tua resposta a {l.by}</div>
                <textarea style={{...s.input,minHeight:65,marginBottom:".5rem"}}
                  placeholder="ex: Aceito! Tenho o que precisas…"
                  value={replyText} onChange={e=>setReplyText(e.target.value)}/>
                <div style={{display:"flex",gap:".5rem"}}>
                  <button style={{...s.btn(C.surf3,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={()=>setReply(null)}>Cancelar</button>
                  <button style={{...s.btn(C.green),flex:2}} onClick={()=>{showToast(`Proposta enviada a ${l.by}! 🤝`);setReply(null);setReplyText("");}}>Enviar 🤝</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",gap:".5rem"}}>
                {l.by!==me?.name&&<button style={{...s.btn(C.green),flex:2}} onClick={()=>setReply(l.id)}>💬 Responder</button>}
                {l.by===me?.name&&<button style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}} onClick={()=>onDelete(l.id)}>🗑 Remover</button>}
              </div>
            )}
          </div>
        ))}
      </>}

      {/* ══ TAB: PESQUISA DE MATCHES ══ */}
      {tab==="pesquisa" && (
        <div style={{paddingBottom:"1rem"}}>
          <div style={{padding:".85rem 1rem .5rem"}}>
            <input style={s.input} autoFocus
              placeholder="🔍 Código (ex: ARG18), nome (ex: Messi) ou seleção (ex: Portugal)…"
              value={searchQ} onChange={e=>setSearchQ(e.target.value)}/>
            <div style={{fontSize:".72rem",color:C.muted,marginTop:".4rem",lineHeight:1.5}}>
              Vê quem tem o cromo que procuras e quem precisa do que tens — perfeito para matches de raros.
            </div>
          </div>

          {!searchQ && <div style={{textAlign:"center",padding:"2.5rem 1rem",color:C.muted}}>
            <div style={{fontSize:"2.5rem",marginBottom:".6rem"}}>🔍</div>
            <div style={{fontWeight:700,color:C.text,marginBottom:".35rem"}}>Pesquisa um cromo raro</div>
            <div style={{fontSize:".83rem",lineHeight:1.6}}>Ex: "ARG18" para o Messi, "ESP15" para o Yamal,<br/>"FWC9" para os especiais do Museu FIFA</div>
          </div>}

          {searchResults && searchResults.length===0 && searchQ && (
            <div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
              <div style={{fontSize:"1.5rem",marginBottom:".5rem"}}>😕</div>
              <div>Sem resultados para "{searchQ}"</div>
            </div>
          )}

          {searchResults && searchResults.map(({code,sec,i,r,name,iNeedIt,iHaveIt,whoHasIt,whoNeedsIt})=>{
            const rLabel2={normal:"Normal",special:"⭐ Especial",legendary:"💎 Lendário",coca:"🥤 Coca-Cola"};
            const rCol={special:C.gold,legendary:C.legend,coca:"#ff6b6b",normal:C.muted}[r];
            const perfectMatch = whoHasIt.filter(m=>me&&(me.need[sec.id]||{})[i]).length > 0
                               || whoNeedsIt.filter(m=>me&&(me.have[sec.id]||{})[i]).length > 0;
            return (
              <div key={code} style={{...s.card,margin:"0 1rem .75rem",border:`1px solid ${perfectMatch?"#00c85340":C.border}`}}>
                <div style={{display:"flex",alignItems:"center",gap:".75rem",marginBottom:".65rem"}}>
                  <div style={{width:44,height:44,borderRadius:8,background:C.surf2,border:`2px solid ${rCol}60`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:".55rem",color:C.muted}}>{sec.id}</span>
                    <span style={{fontSize:".82rem",fontWeight:700}}>{i}</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:".9rem"}}>{sec.flag} {name}</div>
                    <span style={{fontSize:".7rem",fontWeight:700,color:rCol,background:rCol+"20",borderRadius:6,padding:".12rem .4rem",border:`1px solid ${rCol}40`}}>{rLabel2[r]}</span>
                    {perfectMatch && <span style={{fontSize:".7rem",fontWeight:700,color:C.green,background:"#00c85318",borderRadius:6,padding:".12rem .4rem",border:`1px solid #00c85340`,marginLeft:".35rem"}}>✓ Match perfeito!</span>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:".2rem"}}>
                    {iNeedIt&&<span style={{fontSize:".68rem",color:C.red,fontWeight:700,background:"#ff174415",borderRadius:20,padding:".1rem .45rem"}}>❌ Precisas</span>}
                    {iHaveIt&&<span style={{fontSize:".68rem",color:C.green,fontWeight:700,background:"#00c85315",borderRadius:20,padding:".1rem .45rem"}}>✅ Tens</span>}
                  </div>
                </div>

                {whoHasIt.length>0&&(
                  <div style={{marginBottom:".5rem"}}>
                    <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:".3rem"}}>Têm repetido:</div>
                    <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                      {whoHasIt.map(m=>(
                        <span key={m.name} style={{fontSize:".75rem",background:"#00c85312",color:C.green,borderRadius:20,padding:".2rem .6rem",border:"1px solid #00c85330",display:"flex",alignItems:"center",gap:".3rem"}}>
                          ✅ {m.name}
                          {m.mail==="nao"&&<span style={{fontSize:".62rem",color:C.muted}}>🤝</span>}
                          {m.mail==="sim"&&<span style={{fontSize:".62rem",color:C.muted}}>📬</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {whoNeedsIt.length>0&&(
                  <div style={{marginBottom:".5rem"}}>
                    <div style={{fontSize:".7rem",color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".05em",marginBottom:".3rem"}}>Precisam:</div>
                    <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                      {whoNeedsIt.map(m=>(
                        <span key={m.name} style={{fontSize:".75rem",background:"#ff174412",color:C.red,borderRadius:20,padding:".2rem .6rem",border:"1px solid #ff174330"}}>
                          ❌ {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!whoHasIt.length&&!whoNeedsIt.length&&(
                  <div style={{fontSize:".78rem",color:C.muted,fontStyle:"italic"}}>Ninguém no grupo marcou este cromo ainda.</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════
// EVENTS — Encontros Presenciais
// ════════════════════════════════════════════════════
function Events({me, events, isAdmin, onBack, onAdd, onApprove, onReject, onRsvp, showToast}) {
  const [tab, setTab] = useState("lista"); // lista | propor | admin
  const [form, setForm] = useState({title:"",local:"",morada:"",date:"",time:"",desc:""});

  const approved = events.filter(e=>e.status==="aprovado");
  const pending  = events.filter(e=>e.status==="pendente");

  const fmt = (d,t) => {
    if(!d) return "";
    const [y,m,day] = d.split("-");
    return `${day}/${m}/${y}${t?" às "+t:""}`;
  };

  const submit = () => {
    if(!form.title.trim()||!form.local.trim()||!form.date){
      showToast("Preenche título, localidade e data!"); return;
    }
    onAdd({...form, by:me.name});
    setForm({title:"",local:"",morada:"",date:"",time:"",desc:""});
    setTab("lista");
  };

  const Tab = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      flex:1,padding:".6rem",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:".82rem",
      background:tab===id?C.surf3:C.surf2,
      color:tab===id?C.text:C.muted,
      borderBottom:tab===id?`2px solid ${C.green}`:"2px solid transparent",
      transition:"all .15s",
    }}>{label}</button>
  );

  const EventCard = ({ev}) => {
    const going = me && ev.rsvps.includes(me.name);
    const isOwn = me && ev.by === me.name;
    const isPast = ev.date && new Date(ev.date) < new Date();

    return (
      <div style={{...s.card, marginBottom:".75rem", border:`1px solid ${ev.status==="pendente"?"#ffd60030":s.card.border}`}}>
        {/* Status badge */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:".6rem"}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:".95rem",marginBottom:".2rem"}}>{ev.title}</div>
            <div style={{display:"flex",gap:".4rem",flexWrap:"wrap"}}>
              <span style={{fontSize:".7rem",background:ev.status==="aprovado"?"#00c85318":C.surf3,color:ev.status==="aprovado"?C.green:C.gold,border:`1px solid ${ev.status==="aprovado"?"#00c85340":"#ffd60040"}`,borderRadius:20,padding:".15rem .55rem",fontWeight:700}}>
                {ev.status==="aprovado"?"✅ Confirmado":"⏳ Aguarda aprovação"}
              </span>
              {isPast && <span style={{fontSize:".7rem",background:C.surf2,color:C.muted,borderRadius:20,padding:".15rem .55rem"}}>Já passou</span>}
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{display:"flex",flexDirection:"column",gap:".35rem",marginBottom:".75rem"}}>
          <div style={{fontSize:".82rem",color:C.muted}}>📅 <strong style={{color:C.text}}>{fmt(ev.date,ev.time)}</strong></div>
          <div style={{fontSize:".82rem",color:C.muted}}>📍 <strong style={{color:C.text}}>{ev.local}</strong>{ev.morada&&` · ${ev.morada}`}</div>
          {ev.desc && <div style={{fontSize:".82rem",color:C.muted,fontStyle:"italic",lineHeight:1.5}}>"{ev.desc}"</div>}
          <div style={{fontSize:".75rem",color:C.muted}}>Proposto por <strong style={{color:C.text}}>{ev.by}</strong></div>
        </div>

        {/* RSVPs */}
        {ev.status==="aprovado" && (
          <div style={{marginBottom:".75rem"}}>
            <div style={{fontSize:".72rem",color:C.muted,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase",marginBottom:".4rem"}}>
              👥 Vão comparecer ({ev.rsvps.length})
            </div>
            {ev.rsvps.length>0
              ? <div style={{display:"flex",gap:".3rem",flexWrap:"wrap"}}>
                  {ev.rsvps.map(r=><span key={r} style={{fontSize:".72rem",background:r===me?.name?"#00c85318":C.surf2,color:r===me?.name?C.green:C.muted,borderRadius:20,padding:".18rem .55rem",border:r===me?.name?`1px solid #00c85340`:"none"}}>{r===me?.name?"✓ Tu":r}</span>)}
                </div>
              : <div style={{fontSize:".75rem",color:C.muted}}>Ninguém confirmou ainda. Sê o primeiro!</div>
            }
          </div>
        )}

        {/* Actions */}
        {ev.status==="aprovado" && me && !isOwn && !isPast && (
          <button onClick={()=>onRsvp(ev.id)} style={s.btn(going?"#00c85330":C.green, going?"#fff":"#000")}>
            {going ? "✓ Vou comparecer — Cancelar" : "✋ Confirmar presença"}
          </button>
        )}
        {isAdmin && ev.status==="pendente" && (
          <div style={{display:"flex",gap:".5rem"}}>
            <button onClick={()=>onReject(ev.id)} style={{...s.btn(C.surf2,C.text),flex:1,border:`1px solid ${C.border2}`}}>✕ Rejeitar</button>
            <button onClick={()=>onApprove(ev.id)} style={{...s.btn(C.green),flex:2}}>✅ Aprovar</button>
          </div>
        )}
        {!isAdmin && ev.status==="pendente" && isOwn && (
          <div style={{fontSize:".78rem",color:C.muted,padding:".5rem .75rem",background:C.surf2,borderRadius:8,textAlign:"center"}}>
            ⏳ A tua proposta está a aguardar validação pelos admins
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:"2rem"}}>
      <div style={s.topbar}>
        <button onClick={onBack} style={s.btnSm(C.surf2)}>← Voltar</button>
        <div style={{fontWeight:700,flex:1}}>📅 Encontros Presenciais</div>
        {pending.length>0&&isAdmin&&<span style={{background:C.red,color:"#fff",borderRadius:20,padding:".18rem .6rem",fontSize:".72rem",fontWeight:700}}>{pending.length} pendente{pending.length>1?"s":""}</span>}
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <Tab id="lista" label={`📋 Encontros (${approved.length})`}/>
        <Tab id="propor" label="➕ Propor"/>
        <Tab id="lojas"  label="🏪 Lojas"/>
        {isAdmin && <Tab id="admin" label={`⚙️${pending.length>0?" ("+pending.length+")":""}`}/>}
      </div>

      {/* ── LISTA ── */}
      {tab==="lista" && (
        <div style={{padding:".85rem"}}>
          {approved.length===0
            ? <div style={{textAlign:"center",padding:"3rem 1rem",color:C.muted}}>
                <div style={{fontSize:"2.5rem",marginBottom:".75rem"}}>📅</div>
                <div style={{fontWeight:700,color:C.text,marginBottom:".4rem"}}>Nenhum encontro confirmado</div>
                <div style={{fontSize:".85rem"}}>Propõe um encontro no teu grupo!</div>
              </div>
            : approved.map(ev=><EventCard key={ev.id} ev={ev}/>)
          }
        </div>
      )}

      {/* ── PROPOR ── */}
      {tab==="propor" && (
        <div style={{padding:".85rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{...s.card,background:"#ffd60010",border:`1px solid #ffd60030`}}>
            <div style={{fontSize:".8rem",color:C.gold,fontWeight:700,marginBottom:".3rem"}}>ℹ️ Como funciona</div>
            <div style={{fontSize:".78rem",color:C.muted,lineHeight:1.6}}>A tua proposta é enviada aos admins para aprovação. Depois de aprovada, todos os membros podem confirmar presença.</div>
          </div>
          {[
            ["Título do encontro","text","title","ex: Troca de Cromos — Lisboa"],
            ["Cidade","text","local","ex: Lisboa"],
            ["Morada / ponto de encontro","text","morada","ex: Jardim do Príncipe Real"],
            ["Data","date","date",""],
            ["Hora","time","time",""],
          ].map(([lbl,type,key,ph])=>(
            <div key={key}>
              <label style={s.label}>{lbl}</label>
              <input type={type} style={s.input} placeholder={ph} value={form[key]}
                onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>
            </div>
          ))}
          <div>
            <label style={s.label}>Descrição (opcional)</label>
            <textarea style={{...s.input,minHeight:75,resize:"vertical"}}
              placeholder="ex: Tragam os vossos repetidos. Especiais bem-vindos!"
              value={form.desc} onChange={e=>setForm(f=>({...f,desc:e.target.value}))}/>
          </div>
          <button style={s.btn(C.green)} onClick={submit}>Enviar proposta →</button>
        </div>
      )}


      {/* ── LOJAS NACIONAIS ── */}
      {tab==="lojas" && (
        <div style={{padding:".85rem",display:"flex",flexDirection:"column",gap:".85rem"}}>
          <div style={{...s.card,background:"#1565c020",border:`1px solid #1565c040`}}>
            <div style={{fontSize:".8rem",color:"#90caf9",fontWeight:700,marginBottom:".3rem"}}>ℹ️ Pontos de venda e troca</div>
            <div style={{fontSize:".78rem",color:C.muted,lineHeight:1.6}}>Lista de locais onde podes comprar saquetas e encontrar outros colecionadores em Portugal. Atualizada manualmente — sugere um local ao admin!</div>
          </div>

          {[
            {cidade:"Lisboa",nome:"Livraria Bertrand Chiado",morada:"R. Garrett 73",tipo:"venda",nota:"Stock habitual de saquetas e álbuns"},
            {cidade:"Lisboa",nome:"Tabacaria Rossio",morada:"Praça Dom Pedro IV",tipo:"venda",nota:"Abre cedo, bom stock ao início"},
            {cidade:"Lisboa",nome:"Jardim do Príncipe Real",morada:"Praça do Príncipe Real",tipo:"troca",nota:"Encontro informal às Sábados de manhã"},
            {cidade:"Porto",nome:"Livraria Lello",morada:"R. das Carmelitas 144",tipo:"venda",nota:"Álbuns e saquetas disponíveis"},
            {cidade:"Porto",nome:"Mercado do Bolhão",morada:"R. Formosa",tipo:"troca",nota:"Ponto de encontro informal Domingos 10h"},
            {cidade:"Porto",nome:"Tabacaria Aliados",morada:"Av. dos Aliados",tipo:"venda",nota:"Bom stock de saquetas"},
            {cidade:"Braga",nome:"Fnac Braga",morada:"Braga Parque",tipo:"venda",nota:"Álbuns e packs disponíveis"},
            {cidade:"Coimbra",nome:"Livraria Almedina",morada:"R. Ferreira Borges",tipo:"venda",nota:"Stock de álbuns"},
            {cidade:"Faro",nome:"Forum Algarve",morada:"Sítio das Figuras",tipo:"venda",nota:"Tabacaria interior do centro comercial"},
            {cidade:"Setúbal",nome:"Tabacaria Central",morada:"Praça de Bocage",tipo:"venda",nota:"Saquetas avulsas e álbuns"},
            {cidade:"Nacional",nome:"Panini Portugal (online)",morada:"panini.pt",tipo:"online",nota:"Loja oficial — álbuns, saquetas e packs especiais"},
            {cidade:"Nacional",nome:"Fnac.pt",morada:"fnac.pt",tipo:"online",nota:"Packs, álbuns e boxes disponíveis online"},
          ].map((l,idx)=>(
            <div key={idx} style={{...s.card,display:"flex",gap:".85rem",alignItems:"flex-start"}}>
              <div style={{width:40,height:40,borderRadius:10,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",
                background:l.tipo==="venda"?"#1565c020":l.tipo==="troca"?"#00c85320":"#9c27b020"}}>
                {l.tipo==="venda"?"🏪":l.tipo==="troca"?"🔄":"🌐"}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:".45rem",flexWrap:"wrap",marginBottom:".2rem"}}>
                  <span style={{fontWeight:700,fontSize:".88rem"}}>{l.nome}</span>
                  <span style={{fontSize:".68rem",fontWeight:700,
                    color:l.tipo==="venda"?"#90caf9":l.tipo==="troca"?C.green:C.legend,
                    background:l.tipo==="venda"?"#1565c025":l.tipo==="troca"?"#00c85320":"#9c27b025",
                    borderRadius:20,padding:".1rem .45rem"}}>
                    {l.tipo==="venda"?"🏪 Venda":l.tipo==="troca"?"🔄 Troca":"🌐 Online"}
                  </span>
                </div>
                <div style={{fontSize:".78rem",color:C.muted}}>📍 {l.cidade} · {l.morada}</div>
                {l.nota&&<div style={{fontSize:".75rem",color:C.muted,marginTop:".2rem",fontStyle:"italic"}}>{l.nota}</div>}
              </div>
            </div>
          ))}

          <div style={{...s.card,background:C.surf2,textAlign:"center"}}>
            <div style={{fontSize:".82rem",color:C.muted,lineHeight:1.6}}>Conheces um local que não está aqui?<br/>
              <strong style={{color:C.text}}>Fala com o admin do grupo para o adicionar!</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── ADMIN ── */}
      {tab==="admin" && isAdmin && (
        <div style={{padding:".85rem"}}>
          <div style={{fontSize:".78rem",color:C.muted,marginBottom:".85rem",lineHeight:1.5}}>
            As propostas abaixo aguardam a tua validação. Aprova para tornarem visíveis a todo o grupo, ou rejeita para as remover.
          </div>
          {pending.length===0
            ? <div style={{textAlign:"center",padding:"2rem",color:C.muted}}>
                <div style={{fontSize:"2rem",marginBottom:".5rem"}}>✅</div>
                <div>Sem propostas pendentes.</div>
              </div>
            : pending.map(ev=><EventCard key={ev.id} ev={ev}/>)
          }
        </div>
      )}
    </div>
  );
}


// ════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════
function Toast({msg}) {
  return <div style={{position:"fixed",bottom:"5rem",left:"50%",transform:"translateX(-50%)",background:C.surf2,border:`1px solid ${C.border2}`,borderRadius:30,padding:".55rem 1.2rem",fontSize:".82rem",fontWeight:600,zIndex:999,whiteSpace:"nowrap",boxShadow:"0 4px 20px #00000060",pointerEvents:"none"}}>
    {msg}
  </div>;
}
