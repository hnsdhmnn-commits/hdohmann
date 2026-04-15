import { useState, useEffect, useRef } from "react";

const T = {
  bg:          "#F7F5F0",
  bgWarm:      "#FDFCF9",
  surface:     "#FFFFFF",
  surfaceWarm: "#FBF9F5",
  surfaceMid:  "#F2EFE8",
  border:      "#E8E2D8",
  borderMid:   "#D4CCBC",
  shadow:      "0 1px 3px rgba(60,50,30,0.08), 0 4px 16px rgba(60,50,30,0.06)",
  shadowHover: "0 4px 12px rgba(60,50,30,0.12), 0 8px 32px rgba(60,50,30,0.08)",
  shadowCard:  "0 2px 8px rgba(60,50,30,0.07)",
  ink:         "#1A1612",
  inkMid:      "#4A4038",
  inkLight:    "#8A7E6E",
  inkFaint:    "#B8AE9E",
  gold:        "#B8922A", goldLight:"#D4A84B", goldFaint:"#F5EDD8", goldBorder:"#E8D098",
  teal:        "#2A8E86", tealBg:  "#EAF5F4",
  green:       "#2A7A4A", greenBg: "#EAF4EE",
  red:         "#B84030", redBg:   "#FBF0EE",
  purple:      "#6A48B8", purpleBg:"#F2EEF9",
  blue:        "#2858A8", blueBg:  "#EEF2FA",
  orange:      "#B86028", orangeBg:"#FBF2EE",
  fD: "'Cormorant Garamond', 'Garamond', Georgia, serif",
  fB: "'DM Mono', 'Courier New', monospace",
};

const AXIS_COLORS = {
  "Nutrição":T.gold,"Atividade":T.teal,"Sono":T.purple,
  "Estresse":T.red,"Relacionamentos":T.green,"Substâncias":T.blue,
};

const EQUIPE = [
  { id:"enfermeira",  nome:"Ana",        titulo:"Enfermeira Coordenadora", sigla:"AN", cor:T.teal,   bg:T.tealBg,   icon:"🩺", descricao:"Coordena seu plano de cuidado integral, unificando todas as informações da equipe em um único plano atualizado diariamente." },
  { id:"coach",       nome:"Coach",      titulo:"Coach de Saúde IA",       sigla:"CS", cor:T.gold,   bg:T.goldFaint,icon:"⚡", descricao:"Seu coach de saúde executiva. Conversa, motiva e adapta seu plano com base nos seus dados e objetivos." },
  { id:"farmaceutico",nome:"Rafael",     titulo:"Farmacêutico Clínico",    sigla:"RF", cor:T.green,  bg:T.greenBg,  icon:"💊", descricao:"Analisa receitas, organiza medicação e verifica interações. Alerta o Dr. Dohmann quando detecta riscos." },
  { id:"geneticista", nome:"Dra. Clara", titulo:"Geneticista Clínica",     sigla:"GC", cor:T.purple, bg:T.purpleBg, icon:"🧬", descricao:"Interpreta laudos genéticos e responde perguntas fundamentadas nos seus resultados." },
];

const MODULOS = [
  { id:"dashboard",    label:"Painel",           icon:"◈"  },
  { id:"plano",        label:"Plano de Cuidado", icon:"📋", membro:"enfermeira" },
  { id:"coach",        label:"Coach de Saúde",   icon:"⚡",  membro:"coach" },
  { id:"farmaceutico", label:"Farmácia",          icon:"💊", membro:"farmaceutico" },
  { id:"geneticista",  label:"Genômica",          icon:"🧬", membro:"geneticista" },
  { id:"documentos",   label:"Documentos",        icon:"📄" },
  { id:"integracoes",  label:"Integrações",       icon:"🔗" },
];

const PAINEL_GENETICO = [
  { cat:"Risco Cardiovascular", icon:"❤️", color:T.red,    bg:T.redBg,    genes:["APOE","PCSK9","LDLR","MTHFR","F5 (Leiden)","ACE"],    desc:"Predisposição a doenças coronárias, AVC, hipertensão e trombose." },
  { cat:"Risco de Câncer",      icon:"🔬", color:T.purple, bg:T.purpleBg, genes:["BRCA1/2","TP53","MLH1","MSH2","CHEK2","ATM"],          desc:"Predisposição hereditária a cânceres. Orientação para rastreamento preventivo." },
  { cat:"Farmacogenômica",      icon:"💊", color:T.blue,   bg:T.blueBg,   genes:["CYP2C19","CYP2D6","CYP3A4","VKORC1","SLCO1B1"],       desc:"Como seu corpo metaboliza medicamentos. Eficácia e risco de reações adversas." },
  { cat:"Perfil Metabólico",    icon:"⚗️", color:T.gold,   bg:T.goldFaint,genes:["FTO","MC4R","PPARG","ADRB3","TCF7L2","SLC2A2"],        desc:"Tendência ao ganho de peso, resistência à insulina e metabolismo de gorduras." },
  { cat:"Nutrição de Precisão", icon:"🥗", color:T.teal,   bg:T.tealBg,   genes:["MTHFR","VDR","BCMO1","LCT","HFE","FADS1"],            desc:"Absorção de vitaminas, intolerância à lactose e metabolismo de cafeína." },
  { cat:"Performance e Sono",   icon:"⚡", color:T.green,  bg:T.greenBg,  genes:["ACTN3","ACE","PPARGC1A","PER3","CLOCK","COMT"],        desc:"Potencial atlético, cronótipo, recuperação muscular e ritmo circadiano." },
];

const INTEGRACOES = [
  { id:"samsung",  nome:"Samsung Health",  icon:"📱", color:T.blue,    plat:["Android"], desc:"Hub nativo Samsung. Integra Galaxy Watch, Ring e dispositivos Samsung.", passos:["Abra o Samsung Health no Android","Emparelhe Galaxy Watch ou Ring via Bluetooth","Configurações → Parceiros → Google Fit → Conectar","HDohmann lê via Google Fit automaticamente"] },
  { id:"apple",    nome:"Apple Health",    icon:"❤️", color:T.red,     plat:["iOS"],     desc:"Hub central Apple. Agrega dados de todos os apps e dispositivos.", passos:["Abra o app Saúde no iPhone","Vá em seu nome → Apps e Dispositivos","Autorize o HDohmann na primeira abertura","Sincronização automática em segundo plano"] },
  { id:"watch",    nome:"Apple Watch",     icon:"⌚", color:T.blue,    plat:["iOS"],     desc:"FC, HRV, ECG, SpO2, sono e passos. Envio automático ao Apple Health.", passos:["Emparelhe o Watch com o iPhone","Ative monitoramento de sono em Saúde → Sono","Ative HRV em Configurações → Privacidade → Saúde","Dados chegam via Apple Health automaticamente"] },
  { id:"garmin",   nome:"Garmin",          icon:"🏔", color:T.orange,  plat:["iOS","Android"], desc:"VO2 max, Body Battery, GPS e HRV.", passos:["Instale o Garmin Connect e emparelhe","Configurações → Privacidade → ative compartilhamento","Conecte ao Apple Health ou Google Fit","HDohmann recebe Body Battery e VO2 max"] },
  { id:"oura",     nome:"Oura Ring",       icon:"💍", color:T.purple,  plat:["iOS","Android"], desc:"Foco em sono, HRV e recuperação. Alta precisão noturna.", passos:["Baixe o app Oura e emparelhe via Bluetooth","Use toda noite — coleta principalmente durante o sono","App Oura → Perfil → Integrações → Apple Health","Para Android: gere Personal Token em cloud.ouraring.com"] },
  { id:"whoop",    nome:"Whoop 4.0",       icon:"📿", color:T.green,   plat:["iOS","Android"], desc:"Recovery Score e strain diário.", passos:["Baixe o app Whoop e emparelhe via Bluetooth","Use 24h — sem tela, sempre no pulso","App Whoop → Perfil → Apple Health → Conectar","HDohmann usa Recovery Score para ajustar treino"] },
  { id:"withings", nome:"Withings Scale",  icon:"⚖️", color:T.gold,    plat:["iOS","Android"], desc:"Bio-impedância: peso, % gordura e massa muscular.", passos:["Instale o Withings Health Mate e configure via Wi-Fi","Pese-se pela manhã antes de comer","Health Mate → Perfil → Apple Health → Sincronizar","HDohmann ajusta metas nutricionais com esses dados"] },
  { id:"dexcom",   nome:"Dexcom G7 (CGM)", icon:"📡", color:T.orange,  plat:["iOS","Android"], desc:"Glicose contínua a cada 5 minutos.", passos:["Necessita prescrição — consulte o Dr. Dohmann","Aplique o sensor na parte posterior do braço","Instale o app Dexcom G7","App Dexcom → Configurações → Apple Health → Ativar"] },
  { id:"outros",   nome:"Outros",          icon:"🔌", color:T.inkLight, plat:["iOS","Android"], desc:"Fitbit, Polar, Xiaomi e outros.", passos:["Conecte ao app oficial do fabricante","Ative integração com Apple Health ou Google Fit","HDohmann lê automaticamente via esses hubs","Dúvidas? Contate o suporte HDohmann"] },
];

function calcScores(f) {
  if (!f) return { eixos:{"Nutrição":72,"Atividade":65,"Sono":80,"Estresse":60,"Relacionamentos":55,"Substâncias":88}, total:70 };
  const s = {"Nutrição":55,"Atividade":50,"Sono":55,"Estresse":55,"Relacionamentos":55,"Substâncias":80};
  s["Sono"] = Math.min(100,(Number(f.sono)>=7?82:Number(f.sono)>=6?62:42)+(Number(f.qualSono)||5)*1.5);
  s["Atividade"] = Math.min(100,35+(Number(f.freqTreino)||0)*11);
  s["Estresse"] = Math.max(20,100-(Number(f.estresse)||5)*8+(f.meditacao===1?10:0));
  s["Nutrição"] = {"Mediterrâneo":84,"Low-carb":76,"Vegetariano":78,"Vegano":80}[f.dieta]||58;
  s["Substâncias"] = {"Nunca":96,"Ocasional":82,"Semanal":64,"Diário":38}[f.alcool]||70;
  s["Relacionamentos"] = Math.max(30,65+(Number(f.horasTrab)>60?-12:8));
  return { eixos:s, total:Math.round(Object.values(s).reduce((a,b)=>a+b,0)/6) };
}

function buildPrompt(membro, form, scores) {
  const base = `Perfil: ${form?.nome||"Paciente"}, ${form?.cargo||"Executivo"}, ${form?.idade||"—"} anos. Condições: ${(form?.condicoes||[]).join(", ")||"nenhuma"}. Medicamentos: ${(form?.meds||[]).join(", ")||"nenhum"}. Sono: ${form?.sono||7}h qualidade ${form?.qualSono||5}/10. Treino: ${form?.freqTreino||0}x/sem. Estresse: ${form?.estresse||5}/10. Dieta: ${form?.dieta||"não definida"}. Score: ${scores.total}/100.`;
  if (membro==="coach") return `Você é o Coach de Saúde da equipe HDohmann do Dr. Dohmann. Tom: preciso, empático e motivador. Responda APENAS sobre os 6 eixos MEV: Nutrição, Atividade, Sono, Estresse, Relacionamentos, Substâncias. Cite dados reais do perfil. ${base}`;
  if (membro==="farmaceutico") return `Você é Rafael, farmacêutico clínico da equipe HDohmann. Analise medicamentos e interações. SEMPRE mencione que alertará o Dr. Dohmann em caso de risco. Nunca altere prescrições. ${base}`;
  if (membro==="geneticista") return `Você é a Dra. Clara, geneticista da equipe HDohmann. Interprete laudos genéticos com precisão e didatismo. Conecte achados ao plano de cuidado. Para riscos elevados, informe que o Dr. Dohmann será notificado. ${base}`;
  return base;
}

// Storage
async function saveUser(id,data){try{await window.storage.set(`user:${id}`,JSON.stringify(data));}catch(e){}}
async function loadUser(id){try{const r=await window.storage.get(`user:${id}`);return r?JSON.parse(r.value):null;}catch(e){return null;}}
async function saveProfile(id,data){try{await window.storage.set(`profile:${id}`,JSON.stringify(data));}catch(e){}}
async function loadProfile(id){try{const r=await window.storage.get(`profile:${id}`);return r?JSON.parse(r.value):null;}catch(e){return null;}}

// UI Components
function Lbl({children,color,size=9}){return <div style={{fontSize:size,letterSpacing:"0.18em",color:color||T.inkLight,textTransform:"uppercase",marginBottom:8,fontFamily:T.fB,fontWeight:600}}>{children}</div>;}
function Card({children,style={},onClick,hover=false}){const[hov,setHov]=useState(false);return(<div onClick={onClick} onMouseOver={()=>hover&&setHov(true)} onMouseOut={()=>hover&&setHov(false)} style={{background:T.surface,borderRadius:12,boxShadow:hov?T.shadowHover:T.shadowCard,border:`1px solid ${T.border}`,transition:"all 0.2s",cursor:onClick?"pointer":"default",...style}}>{children}</div>);}
function Btn({children,onClick,variant="primary",disabled=false,style={}}){const styles={primary:{background:T.ink,color:"#FFF",border:`1px solid ${T.ink}`},gold:{background:T.gold,color:"#FFF",border:`1px solid ${T.gold}`},outline:{background:"transparent",color:T.ink,border:`1px solid ${T.border}`},ghost:{background:"transparent",color:T.inkLight,border:"none"}};return(<button onClick={disabled?undefined:onClick} disabled={disabled} style={{padding:"11px 24px",borderRadius:8,fontFamily:T.fB,fontSize:11,letterSpacing:"0.16em",fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.4:1,transition:"all 0.2s",...styles[variant],...style}}>{children}</button>);}
function TxtInput({label,placeholder,value,onChange,type="text",unit,autoFocus,error}){const[foc,setFoc]=useState(false);return(<div>{label&&<Lbl>{label}</Lbl>}<div style={{position:"relative"}}><input autoFocus={autoFocus} type={type} placeholder={placeholder} value={value||""} onChange={e=>onChange(e.target.value)} onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)} style={{width:"100%",background:T.bgWarm,border:`1.5px solid ${error?T.red:foc?T.gold:T.border}`,borderRadius:8,padding:unit?"11px 48px 11px 14px":"11px 14px",color:T.ink,fontFamily:T.fB,fontSize:13,outline:"none",transition:"border-color 0.2s",boxSizing:"border-box"}}/>{unit&&<span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:10,color:T.inkLight}}>{unit}</span>}</div>{error&&<div style={{fontSize:11,color:T.red,marginTop:4}}>{error}</div>}</div>);}
function SldInput({label,value,onChange,min,max,unit,color=T.gold}){return(<div><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><Lbl>{label}</Lbl><span style={{fontSize:16,color,fontFamily:T.fD,fontWeight:700}}>{value}{unit}</span></div><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:color,cursor:"pointer",height:4}}/><div style={{display:"flex",justifyContent:"space-between",marginTop:4}}><span style={{fontSize:9,color:T.inkFaint}}>{min}</span><span style={{fontSize:9,color:T.inkFaint}}>{max}</span></div></div>);}
function Chip({label,active,color=T.gold,bg,onClick}){return(<button onClick={onClick} style={{padding:"8px 14px",borderRadius:6,cursor:"pointer",fontFamily:T.fB,fontSize:12,background:active?(bg||T.goldFaint):"transparent",border:`1.5px solid ${active?color:T.border}`,color:active?color:T.inkMid,transition:"all 0.18s",boxShadow:active?`0 0 0 3px ${color}15`:"none"}}>{label}</button>);}
function RadialScore({value,size=100}){const r=size/2-9,circ=2*Math.PI*r,dash=(value/100)*circ,color=value>=75?T.green:value>=50?T.gold:T.red;return(<svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceMid} strokeWidth="7"/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:"stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1)"}}/><text x={size/2} y={size/2-6} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize="20" fontFamily="Georgia,serif" fontWeight="700">{value}</text><text x={size/2} y={size/2+14} textAnchor="middle" dominantBaseline="middle" fill={T.inkFaint} fontSize="9" fontFamily="'DM Mono',monospace">/100</text></svg>);}

function ChatIA({membro,systemPrompt,apiKey,placeholder,sugestoes,inicialMsg,pdfB64}){
  const eq=EQUIPE.find(e=>e.id===membro);
  const[msgs,setMsgs]=useState([{role:"assistant",content:inicialMsg}]);
  const[input,setInput]=useState(""),[loading,setLoading]=useState(false);
  const bottomRef=useRef(null),inputRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=async(text)=>{
    if(!text.trim()||loading||!apiKey)return;
    const userMsg={role:"user",content:text};
    setMsgs(prev=>[...prev,userMsg,{role:"assistant",content:"",loading:true}]);
    setInput("");setLoading(true);
    try{
      const history=[...msgs,userMsg].map((m,i)=>{
        if(i===0&&pdfB64&&m.role==="user")return{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:pdfB64}},{type:"text",text:m.content}]};
        return{role:m.role,content:m.content};
      });
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,system:systemPrompt,messages:history})});
      const data=await res.json();
      setMsgs(prev=>[...prev.slice(0,-1),{role:"assistant",content:data.content?.[0]?.text||"Erro ao processar."}]);
    }catch{setMsgs(prev=>[...prev.slice(0,-1),{role:"assistant",content:"Erro de conexão."}]);}
    finally{setLoading(false);setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);inputRef.current?.focus();}
  };
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",overflow:"hidden"}}>
      <div style={{flex:1,overflowY:"auto",padding:"24px 28px 8px"}}>
        {msgs.map((msg,i)=>{const isUser=msg.role==="user";return(
          <div key={i} style={{display:"flex",flexDirection:isUser?"row-reverse":"row",gap:12,marginBottom:20,alignItems:"flex-start",animation:i===msgs.length-1?"fadeUp 0.3s ease":"none"}}>
            {!isUser&&<div style={{width:36,height:36,borderRadius:"50%",background:eq?.bg||T.goldFaint,border:`1.5px solid ${eq?.cor||T.gold}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0,marginTop:2}}>{eq?.icon||"◈"}</div>}
            <div style={{maxWidth:"74%",padding:"14px 18px",background:isUser?T.goldFaint:T.surface,border:`1px solid ${isUser?T.goldBorder:T.border}`,borderRadius:isUser?"16px 16px 4px 16px":"4px 16px 16px 16px",fontSize:13,color:T.ink,lineHeight:1.8,whiteSpace:"pre-wrap",boxShadow:T.shadowCard}}>
              {msg.loading?<span style={{display:"inline-flex",gap:5}}>{[0,1,2].map(j=><span key={j} style={{width:6,height:6,borderRadius:"50%",background:eq?.cor||T.gold,display:"inline-block",animation:`blink 1.2s ease ${j*0.2}s infinite`}}/>)}</span>:msg.content}
            </div>
          </div>
        );})}
        <div ref={bottomRef}/>
      </div>
      {msgs.length<=1&&sugestoes?.length>0&&(
        <div style={{padding:"0 28px 14px",display:"flex",gap:8,flexWrap:"wrap",flexShrink:0}}>
          {sugestoes.map((s,i)=>(
            <button key={i} onClick={()=>send(s)} style={{padding:"8px 16px",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,fontSize:12,color:T.inkMid,cursor:"pointer",fontFamily:T.fB,transition:"all 0.18s",boxShadow:T.shadowCard}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=eq?.cor||T.gold;e.currentTarget.style.color=eq?.cor||T.gold;}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.inkMid;}}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div style={{borderTop:`1px solid ${T.border}`,padding:"14px 28px",display:"flex",gap:10,alignItems:"flex-end",flexShrink:0,background:T.bgWarm}}>
        <textarea ref={inputRef} rows={1} placeholder={apiKey?placeholder:"Configure a API Key no painel..."}
          value={input} onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send(input);}}}
          disabled={loading||!apiKey}
          style={{flex:1,background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"12px 16px",color:T.ink,fontFamily:T.fB,fontSize:13,outline:"none",lineHeight:1.6,minHeight:44,maxHeight:120,overflow:"hidden",resize:"none",opacity:apiKey?1:0.5,boxShadow:T.shadowCard}}/>
        <button onClick={()=>send(input)} disabled={loading||!input.trim()||!apiKey}
          style={{width:44,height:44,borderRadius:10,background:(!loading&&input.trim()&&apiKey)?eq?.cor||T.gold:"transparent",border:`1.5px solid ${(!loading&&input.trim()&&apiKey)?eq?.cor||T.gold:T.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:(!loading&&input.trim()&&apiKey)?"#FFF":T.inkFaint,transition:"all 0.2s",flexShrink:0,fontWeight:700}}>
          {loading?"…":"↑"}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TELA LOGIN
// ══════════════════════════════════════════════════════════════════
function ScreenLogin({onLogin}){
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState(""),[pass,setPass]=useState(""),[name,setName]=useState(""),[err,setErr]=useState(""),[loading,setLoading]=useState(false);
  const handleSubmit=async()=>{
    if(!email||!pass){setErr("Preencha todos os campos.");return;}
    if(mode==="register"&&!name){setErr("Informe seu nome.");return;}
    setLoading(true);setErr("");
    const userId=btoa(email).replace(/[^a-zA-Z0-9]/g,"");
    try{
      if(mode==="register"){
        const existing=await loadUser(userId);
        if(existing){setErr("E-mail já cadastrado. Faça login.");setLoading(false);return;}
        await saveUser(userId,{email,name,pass:btoa(pass),createdAt:new Date().toISOString()});
        onLogin({userId,email,name});
      }else{
        const userData=await loadUser(userId);
        if(!userData){setErr("E-mail não encontrado. Crie uma conta.");setLoading(false);return;}
        if(userData.pass!==btoa(pass)){setErr("Senha incorreta.");setLoading(false);return;}
        onLogin({userId,email,name:userData.name});
      }
    }catch{setErr("Erro ao acessar. Tente novamente.");}
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",fontFamily:T.fB,color:T.ink}}>
      <div style={{width:"44%",flexShrink:0,background:T.surface,borderRight:`1px solid ${T.border}`,padding:"52px 52px",display:"flex",flexDirection:"column",justifyContent:"space-between",boxShadow:"4px 0 24px rgba(60,50,30,0.06)"}}>
        <div>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:52}}><span style={{fontFamily:T.fD,fontSize:38,color:T.ink,lineHeight:1}}>H</span><span style={{fontFamily:T.fD,fontSize:38,color:T.gold,lineHeight:1}}>Dohmann</span><span style={{fontSize:8,letterSpacing:"0.3em",color:T.inkFaint,marginLeft:4,alignSelf:"flex-end",marginBottom:4}}>HEALTH</span></div>
          <div style={{width:110,height:110,borderRadius:"50%",background:`linear-gradient(135deg,${T.goldFaint},${T.surfaceMid})`,border:`2px solid ${T.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:28,boxShadow:T.shadowCard}}><span style={{fontFamily:T.fD,fontSize:44,color:T.gold}}>D</span></div>
          <div style={{fontFamily:T.fD,fontSize:28,color:T.ink,marginBottom:4,lineHeight:1.2}}>Dr. [Nome] Dohmann</div>
          <div style={{fontSize:11,color:T.gold,letterSpacing:"0.18em",marginBottom:28,fontWeight:600}}>CARDIOLOGISTA · MEDICINA DO ESTILO DE VIDA</div>
          <div style={{fontSize:13,color:T.inkMid,lineHeight:2,marginBottom:20,borderLeft:`3px solid ${T.goldBorder}`,paddingLeft:20}}>[Especialista em Medicina do Estilo de Vida com mais de X anos de experiência no cuidado de executivos de alta performance. Pesquisador reconhecido mundialmente em células-tronco e sistemas virtuais de saúde.]</div>
          <div style={{fontSize:13,color:T.inkMid,lineHeight:2}}>[Nos últimos 10 anos dedicou-se a sistemas virtuais de atendimento de saúde corporativa, desenvolvendo uma abordagem única: não tratar doenças, mas <em>desenvolver saúde e produtividade</em>.]</div>
        </div>
        <div>
          <Lbl>Sua equipe de cuidado</Lbl>
          <div style={{display:"flex",gap:16,marginTop:12}}>
            {EQUIPE.map(e=>(<div key={e.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><div style={{width:48,height:48,borderRadius:"50%",background:e.bg,border:`1.5px solid ${e.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadowCard}}>{e.icon}</div><span style={{fontSize:9,color:T.inkLight,textAlign:"center",letterSpacing:"0.08em"}}>{e.nome}</span></div>))}
          </div>
        </div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40,background:T.bg}}>
        <div style={{width:"100%",maxWidth:420}}>
          <div style={{fontFamily:T.fD,fontSize:32,color:T.ink,marginBottom:6,lineHeight:1.2}}>{mode==="login"?"Bem-vindo de volta":"Criar sua conta"}</div>
          <div style={{fontSize:13,color:T.inkMid,lineHeight:1.8,marginBottom:36}}>{mode==="login"?"Acesse seu plano de cuidado personalizado.":"Junte-se à equipe HDohmann."}</div>
          <Card style={{padding:"32px"}}>
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              {mode==="register"&&<TxtInput label="Nome completo" placeholder="Ricardo Costa" value={name} onChange={setName}/>}
              <TxtInput label="E-mail" placeholder="seu@email.com" type="email" value={email} onChange={setEmail}/>
              <TxtInput label="Senha" placeholder="••••••••" type="password" value={pass} onChange={setPass} error={err}/>
              <Btn onClick={handleSubmit} variant="gold" disabled={loading} style={{width:"100%",padding:"13px"}}>{loading?"PROCESSANDO...":(mode==="login"?"ENTRAR →":"CRIAR CONTA →")}</Btn>
            </div>
            <div style={{marginTop:20,textAlign:"center"}}><button onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{background:"none",border:"none",fontSize:12,color:T.inkLight,cursor:"pointer",fontFamily:T.fB,textDecoration:"underline",letterSpacing:"0.08em"}}>{mode==="login"?"Não tem conta? Criar agora":"Já tem conta? Fazer login"}</button></div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TELA API KEY — COM EXPLICAÇÃO CLARA
// ══════════════════════════════════════════════════════════════════
function ScreenApiKey({user,onConfirm}){
  const[key,setKey]=useState(""),[err,setErr]=useState("");
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.fB,padding:24}}>
      <div style={{width:"100%",maxWidth:520}}>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:40}}><span style={{fontFamily:T.fD,fontSize:32,color:T.ink}}>H</span><span style={{fontFamily:T.fD,fontSize:32,color:T.gold}}>Dohmann</span></div>
        <Card style={{padding:"0",overflow:"hidden"}}>
          {/* Header explicativo */}
          <div style={{background:`linear-gradient(135deg,${T.goldFaint},${T.surface})`,padding:"28px 32px",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontFamily:T.fD,fontSize:24,color:T.ink,marginBottom:8}}>Olá, {user.name.split(" ")[0]}! Um último passo.</div>
            <div style={{fontSize:13,color:T.inkMid,lineHeight:1.9}}>
              Para ativar sua equipe de saúde — Coach, Rafael, Dra. Clara e Ana — o app precisa de uma <strong style={{color:T.ink}}>chave de acesso à inteligência artificial</strong> que faz tudo funcionar.
            </div>
          </div>

          {/* O que é explicado simplesmente */}
          <div style={{padding:"20px 32px",borderBottom:`1px solid ${T.border}`,background:T.bgWarm}}>
            <Lbl>O que é essa chave?</Lbl>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {icon:"🤖",text:"É uma senha que conecta o app à IA que dá vida à sua equipe HDohmann"},
                {icon:"🔒",text:"Fica salva apenas no seu dispositivo — não é compartilhada com ninguém"},
                {icon:"💳",text:"Tem um pequeno custo de uso (menos de R$ 2 por mês para uso normal)"},
                {icon:"🎁",text:"Se seu médico forneceu uma chave, use ela diretamente abaixo"},
              ].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
                  <span style={{fontSize:12,color:T.inkMid,lineHeight:1.6}}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{padding:"24px 32px"}}>
            <TxtInput label="Chave de Acesso (API Key)" placeholder="sk-ant-api03-..." value={key} onChange={v=>{setKey(v);setErr("");}} error={err} autoFocus/>
            <div style={{marginTop:16}}>
              <Btn onClick={()=>key.startsWith("sk-")?onConfirm(key):setErr("Chave inválida. Deve começar com sk-ant-")} variant="gold" style={{width:"100%",padding:"13px"}}>ATIVAR MINHA EQUIPE →</Btn>
            </div>
            <div style={{marginTop:20,padding:"14px 16px",background:T.surfaceMid,borderRadius:8,border:`1px solid ${T.border}`}}>
              <Lbl>Não tem uma chave? Obtenha em 2 minutos:</Lbl>
              <div style={{fontSize:12,color:T.inkMid,lineHeight:1.9}}>
                1. Acesse <span style={{color:T.gold,fontWeight:600}}>console.anthropic.com</span><br/>
                2. Crie uma conta gratuita<br/>
                3. Menu lateral → <strong>API Keys</strong> → <strong>+ Create Key</strong><br/>
                4. Copie e cole aqui
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TELA BOAS-VINDAS — ANTES DO ONBOARDING
// ══════════════════════════════════════════════════════════════════
function ScreenBoasVindas({user,onStart}){
  const[slide,setSlide]=useState(0);
  const slides=[
    {
      icon:"🏥",
      titulo:"Saúde não é ausência de doença",
      texto:"O HDohmann existe para desenvolver sua saúde e produtividade — não apenas tratar problemas quando surgem. É um serviço complementar ao seu médico atual.",
      cor:T.gold,
    },
    {
      icon:"👥",
      titulo:"Sua equipe de saúde dedicada",
      texto:"Ana coordena seu plano. O Coach te motiva diariamente. Rafael cuida dos seus medicamentos. A Dra. Clara interpreta seu DNA. Todos trabalham juntos, coordenados pelo Dr. Dohmann.",
      cor:T.teal,
    },
    {
      icon:"🧬",
      titulo:"Personalizado até o DNA",
      texto:"Seu plano é único. Ele usa seus dados genéticos, biométricos, estilo de vida e histórico clínico para criar recomendações que fazem sentido para o seu corpo — não para um paciente genérico.",
      cor:T.purple,
    },
    {
      icon:"📊",
      titulo:"Seus dados sempre atualizados",
      texto:"O plano se renova de 3 formas: automaticamente pelos seus gadgets (Apple Watch, Oura, etc), quando você envia novos exames e pelo check-in diário rápido com a enfermeira Ana.",
      cor:T.green,
    },
    {
      icon:"⏱",
      titulo:"5 minutos para começar",
      texto:"Agora vamos montar seu perfil de saúde. São 6 etapas simples — quanto mais você preencher, mais personalizado será seu plano. Leva cerca de 5 minutos.",
      cor:T.red,
    },
  ];
  const s=slides[slide];
  return(
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.fB,padding:40}}>
      <div style={{width:"100%",maxWidth:560}}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:48,justifyContent:"center"}}><span style={{fontFamily:T.fD,fontSize:32,color:T.ink}}>H</span><span style={{fontFamily:T.fD,fontSize:32,color:T.gold}}>Dohmann</span></div>

        {/* Card slide */}
        <Card style={{padding:"0",overflow:"hidden",marginBottom:24}}>
          {/* Barra colorida topo */}
          <div style={{height:4,background:`linear-gradient(90deg,${s.cor},${s.cor}60)`}}/>

          <div style={{padding:"40px 40px 32px",textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:`${s.cor}15`,border:`2px solid ${s.cor}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto 24px",boxShadow:T.shadowCard}}>{s.icon}</div>
            <div style={{fontFamily:T.fD,fontSize:26,color:T.ink,marginBottom:14,lineHeight:1.3}}>{s.titulo}</div>
            <div style={{fontSize:14,color:T.inkMid,lineHeight:1.9,maxWidth:420,margin:"0 auto"}}>{s.texto}</div>
          </div>

          {/* Progresso dots */}
          <div style={{padding:"0 40px 28px",display:"flex",justifyContent:"center",gap:8}}>
            {slides.map((_,i)=>(
              <div key={i} onClick={()=>setSlide(i)} style={{width:i===slide?24:8,height:8,borderRadius:4,background:i===slide?s.cor:T.border,transition:"all 0.3s",cursor:"pointer"}}/>
            ))}
          </div>
        </Card>

        {/* Botões */}
        <div style={{display:"flex",gap:12,justifyContent:"space-between"}}>
          <Btn onClick={()=>slide>0&&setSlide(s=>s-1)} variant="outline" disabled={slide===0}>← ANTERIOR</Btn>
          {slide<slides.length-1
            ?<Btn onClick={()=>setSlide(s=>s+1)} variant="gold">PRÓXIMO →</Btn>
            :<Btn onClick={onStart} variant="gold" style={{flex:1}}>MONTAR MEU PERFIL →</Btn>
          }
        </div>

        {/* Skip */}
        {slide<slides.length-1&&(
          <div style={{textAlign:"center",marginTop:16}}>
            <button onClick={onStart} style={{background:"none",border:"none",fontSize:11,color:T.inkFaint,cursor:"pointer",fontFamily:T.fB,letterSpacing:"0.12em"}}>
              PULAR INTRODUÇÃO →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ONBOARDING APROFUNDADO
// ══════════════════════════════════════════════════════════════════
const OB_STEPS=["Identidade","Saúde Atual","Histórico Clínico","Estilo de Vida","Objetivos","Gadgets","Kit Genômico"];

function ScreenOnboarding({user,onComplete}){
  const[step,setStep]=useState(0);
  const[f,setF]=useState({
    nome:user.name,cargo:"",setor:"",idade:"",peso:"",altura:"",
    // Saúde atual
    condicoes:[],condicaoOutro:"",meds:[],medOutro:"",energia:6,qualidadeVida:6,
    ultimoCheckup:"",
    // Exames recentes
    colesterolTotal:"",colesterolLDL:"",colesterolHDL:"",triglicerides:"",
    glicoseJejum:"",hemoglobina:"",pressaoSistolica:"",pressaoDiastolica:"",
    // Histórico clínico
    histCardioFam:null,histCancerFam:null,histDiabetesFam:null,histDepressaoFam:null,
    cirurgias:"",hospitalizacoes:"",alergiaMed:"",
    sintomas:[],sintomaOutro:"",
    // Estilo de vida
    sono:7,qualSono:6,exercicios:[],exercicioOutro:"",freqTreino:3,
    alcool:"",estresse:6,meditacao:-1,dieta:"",tabaco:"",
    horasTrab:50,horasDescanso:2,
    // Objetivos
    metas:[],disponibilidade:30,acompanhamento:"",horizonte:"",
    // Gadgets
    gadgets:[],gadgetOutro:"",
    // Kit
    querKit:null,
  });
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const tog=(k,v)=>set(k,(f[k]||[]).includes(v)?(f[k]||[]).filter(x=>x!==v):[...(f[k]||[]),v]);

  const ATIVIDADES=["Musculação","Corrida","Caminhada","Ciclismo","Natação","Pilates","Yoga","Tênis","Funcional","Crossfit","Outros"];
  const CONDICOES=["Hipertensão","Diabetes T2","Dislipidemia","Apneia do sono","Ansiedade","Depressão","Enxaqueca","Síndrome metabólica","Hipotireoidismo","Refluxo / DRGE","Nenhuma","Outros"];
  const MEDS=["Antihipertensivo","Estatina","Ansiolítico","Antidepressivo","Metformina","Omeprazol","Levotiroxina","Vitaminas","Anticoagulante","Outros","Nenhum"];
  const SINTOMAS=["Cansaço frequente","Dificuldade de concentração","Dores de cabeça","Insônia","Irritabilidade","Falta de disposição","Dores musculares","Ganho de peso","Queda de cabelo","Nenhum","Outros"];
  const GADGETS_OB=["Samsung (Galaxy Watch/Ring)","Apple Watch","Oura Ring","Whoop","Garmin","Dexcom / Libre (CGM)","Withings Scale","Outros"];
  const METAS_LIST=[{id:"energia",icon:"⚡",label:"Mais energia e disposição"},{id:"foco",icon:"🎯",label:"Foco e cognição"},{id:"peso",icon:"⚖️",label:"Composição corporal"},{id:"longevidade",icon:"∞",label:"Longevidade e prevenção"},{id:"estresse",icon:"🌿",label:"Gestão do estresse"},{id:"sono",icon:"◑",label:"Qualidade do sono"},{id:"performance",icon:"▲",label:"Performance atlética"},{id:"libido",icon:"♦",label:"Saúde hormonal"}];

  const SectionTitle=({icon,title,subtitle})=>(
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
        <span style={{fontSize:20}}>{icon}</span>
        <span style={{fontFamily:T.fD,fontSize:18,color:T.ink}}>{title}</span>
      </div>
      {subtitle&&<div style={{fontSize:12,color:T.inkLight,lineHeight:1.7,paddingLeft:30}}>{subtitle}</div>}
    </div>
  );

  const ExamField=({label,value,onChange,unit,placeholder})=>(
    <div>
      <div style={{fontSize:10,color:T.inkLight,letterSpacing:"0.1em",marginBottom:5}}>{label}</div>
      <TxtInput placeholder={placeholder||"—"} type="number" value={value} onChange={onChange} unit={unit}/>
    </div>
  );

  const panels=[
    // 0 Identidade
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle icon="👤" title="Sobre você" subtitle="Essas informações ajudam a personalizar seu plano de saúde executiva."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><TxtInput label="Nome completo" placeholder="Ricardo Costa" value={f.nome} onChange={v=>set("nome",v)}/><TxtInput label="Idade" placeholder="47" type="number" value={f.idade} onChange={v=>set("idade",v)} unit="anos"/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><TxtInput label="Cargo" placeholder="CEO" value={f.cargo} onChange={v=>set("cargo",v)}/><TxtInput label="Setor" placeholder="Financeiro" value={f.setor} onChange={v=>set("setor",v)}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><TxtInput label="Peso" placeholder="82" type="number" value={f.peso} onChange={v=>set("peso",v)} unit="kg"/><TxtInput label="Altura" placeholder="178" type="number" value={f.altura} onChange={v=>set("altura",v)} unit="cm"/></div>
      <SldInput label="Horas de trabalho por semana" value={f.horasTrab} onChange={v=>set("horasTrab",v)} min={20} max={90} unit="h/sem"/>
      <SldInput label="Horas de lazer/descanso por dia" value={f.horasDescanso} onChange={v=>set("horasDescanso",v)} min={0} max={8} unit="h/dia" color={T.teal}/>
    </div>,

    // 1 Saúde atual
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionTitle icon="🏥" title="Saúde atual" subtitle="Condições existentes e medicamentos em uso. Essas informações são essenciais para personalizar seu plano."/>
      <div><Lbl>Condições diagnosticadas</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{CONDICOES.map(c=><Chip key={c} label={c} color={T.teal} bg={T.tealBg} active={(f.condicoes||[]).includes(c)} onClick={()=>tog("condicoes",c)}/>)}</div>{(f.condicoes||[]).includes("Outros")&&<div style={{marginTop:12}}><TxtInput placeholder="Descreva outras condições..." value={f.condicaoOutro} onChange={v=>set("condicaoOutro",v)}/></div>}</div>
      <div><Lbl>Sintomas frequentes (últimos 3 meses)</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{SINTOMAS.map(s=><Chip key={s} label={s} color={T.orange} bg={T.orangeBg} active={(f.sintomas||[]).includes(s)} onClick={()=>tog("sintomas",s)}/>)}</div>{(f.sintomas||[]).includes("Outros")&&<div style={{marginTop:12}}><TxtInput placeholder="Descreva outros sintomas..." value={f.sintomaOutro} onChange={v=>set("sintomaOutro",v)}/></div>}</div>
      <div><Lbl>Medicamentos em uso</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{MEDS.map(m=><Chip key={m} label={m} color={T.teal} bg={T.tealBg} active={(f.meds||[]).includes(m)} onClick={()=>tog("meds",m)}/>)}</div>{(f.meds||[]).includes("Outros")&&<div style={{marginTop:12}}><TxtInput placeholder="Descreva outros medicamentos..." value={f.medOutro} onChange={v=>set("medOutro",v)}/></div>}</div>
      <div><Lbl>Alergia a medicamentos?</Lbl><TxtInput placeholder="Descreva alergias ou deixe em branco" value={f.alergiaMed} onChange={v=>set("alergiaMed",v)}/></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <SldInput label="Nível de energia percebida" value={f.energia} onChange={v=>set("energia",v)} min={1} max={10} unit="/10" color={T.teal}/>
        <SldInput label="Qualidade de vida geral" value={f.qualidadeVida} onChange={v=>set("qualidadeVida",v)} min={1} max={10} unit="/10" color={T.teal}/>
      </div>
    </div>,

    // 2 Histórico clínico + exames
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionTitle icon="🧬" title="Histórico clínico" subtitle="Informações sobre sua família e exames recentes ajudam a identificar riscos e personalizar as recomendações."/>

      <div>
        <Lbl>Histórico familiar (parentes de 1º grau)</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{label:"Doenças cardiovasculares",key:"histCardioFam",cor:T.red},{label:"Câncer",key:"histCancerFam",cor:T.purple},{label:"Diabetes",key:"histDiabetesFam",cor:T.orange},{label:"Depressão / ansiedade",key:"histDepressaoFam",cor:T.blue}].map(item=>(
            <div key={item.key} style={{padding:"14px 16px",background:T.bgWarm,border:`1px solid ${T.border}`,borderRadius:8,boxShadow:T.shadowCard}}>
              <div style={{fontSize:12,color:T.inkMid,marginBottom:10}}>{item.label}</div>
              <div style={{display:"flex",gap:8}}>
                {["Sim","Não","Não sei"].map(opt=><Chip key={opt} label={opt} active={f[item.key]===opt} color={item.cor} onClick={()=>set(item.key,opt)}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Lbl>Cirurgias anteriores</Lbl><TxtInput placeholder="Descreva ou 'Nenhuma'" value={f.cirurgias} onChange={v=>set("cirurgias",v)}/></div>
        <div><Lbl>Internações anteriores</Lbl><TxtInput placeholder="Descreva ou 'Nenhuma'" value={f.hospitalizacoes} onChange={v=>set("hospitalizacoes",v)}/></div>
      </div>

      <div>
        <Lbl>Resultados de exames recentes (se disponível)</Lbl>
        <Card style={{padding:"18px 20px",background:T.bgWarm}}>
          <div style={{fontSize:12,color:T.inkMid,marginBottom:16,lineHeight:1.7}}>Preencha os valores que você lembrar — não é obrigatório. Você também pode enviar o PDF completo na seção Documentos.</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <ExamField label="Colesterol Total" value={f.colesterolTotal} onChange={v=>set("colesterolTotal",v)} unit="mg/dL"/>
            <ExamField label="LDL" value={f.colesterolLDL} onChange={v=>set("colesterolLDL",v)} unit="mg/dL"/>
            <ExamField label="HDL" value={f.colesterolHDL} onChange={v=>set("colesterolHDL",v)} unit="mg/dL"/>
            <ExamField label="Triglicerídeos" value={f.triglicerides} onChange={v=>set("triglicerides",v)} unit="mg/dL"/>
            <ExamField label="Glicose em jejum" value={f.glicoseJejum} onChange={v=>set("glicoseJejum",v)} unit="mg/dL"/>
            <ExamField label="Hemoglobina glicada" value={f.hemoglobina} onChange={v=>set("hemoglobina",v)} unit="%"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
            <ExamField label="Pressão Sistólica" value={f.pressaoSistolica} onChange={v=>set("pressaoSistolica",v)} unit="mmHg" placeholder="ex: 120"/>
            <ExamField label="Pressão Diastólica" value={f.pressaoDiastolica} onChange={v=>set("pressaoDiastolica",v)} unit="mmHg" placeholder="ex: 80"/>
          </div>
        </Card>
      </div>
    </div>,

    // 3 Estilo de vida
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionTitle icon="🏃" title="Estilo de vida" subtitle="Sua rotina diária é a base do plano de cuidado. Seja honesto — não há respostas certas ou erradas."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><SldInput label="Sono por noite" value={f.sono} onChange={v=>set("sono",v)} min={4} max={10} unit="h" color={T.purple}/><SldInput label="Qualidade do sono" value={f.qualSono} onChange={v=>set("qualSono",v)} min={1} max={10} unit="/10" color={T.purple}/></div>
      <div><Lbl>Atividades físicas praticadas</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{ATIVIDADES.map(e=><Chip key={e} label={e} color={T.teal} bg={T.tealBg} active={(f.exercicios||[]).includes(e)} onClick={()=>tog("exercicios",e)}/>)}</div>{(f.exercicios||[]).includes("Outros")&&<div style={{marginTop:12}}><TxtInput placeholder="Descreva outras atividades..." value={f.exercicioOutro} onChange={v=>set("exercicioOutro",v)}/></div>}</div>
      <SldInput label="Frequência de treino" value={f.freqTreino} onChange={v=>set("freqTreino",v)} min={0} max={7} unit="x/sem" color={T.teal}/>
      <SldInput label="Nível de estresse percebido" value={f.estresse} onChange={v=>set("estresse",v)} min={1} max={10} unit="/10" color={T.red}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Lbl>Consumo de álcool</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["Nunca","Ocasional","Semanal","Diário"].map(a=><Chip key={a} label={a} active={f.alcool===a} onClick={()=>set("alcool",a)}/>)}</div></div>
        <div><Lbl>Tabaco / cigarro</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["Nunca fumei","Ex-fumante","Fumante ocasional","Fumante regular"].map(t=><Chip key={t} label={t} active={f.tabaco===t} onClick={()=>set("tabaco",t)}/>)}</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Lbl>Padrão alimentar</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["Onívoro","Mediterrâneo","Low-carb","Cetogênico","Vegetariano","Vegano","Sem padrão"].map(d=><Chip key={d} label={d} active={f.dieta===d} onClick={()=>set("dieta",d)}/>)}</div></div>
        <div><Lbl>Meditação / mindfulness</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["Não pratico","Às vezes","Regularmente"].map((o,i)=><Chip key={o} label={o} active={f.meditacao===i} onClick={()=>set("meditacao",i)}/>)}</div></div>
      </div>
    </div>,

    // 4 Objetivos
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <SectionTitle icon="🎯" title="Seus objetivos" subtitle="O que você quer conquistar com o HDohmann? Isso define as prioridades do seu plano."/>
      <div><Lbl>Objetivos principais (até 3)</Lbl>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:4}}>
          {METAS_LIST.map(m=>{const active=(f.metas||[]).includes(m.id),limit=(f.metas||[]).length>=3&&!active;return(
            <button key={m.id} onClick={()=>!limit&&tog("metas",m.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:active?T.goldFaint:T.bgWarm,border:`1.5px solid ${active?T.gold:T.border}`,borderRadius:10,cursor:limit?"not-allowed":"pointer",opacity:limit?0.4:1,transition:"all 0.18s",fontFamily:T.fB,textAlign:"left",boxShadow:active?`0 0 0 3px ${T.gold}15`:T.shadowCard}}>
              <span style={{fontSize:20}}>{m.icon}</span><span style={{fontSize:12,color:active?T.gold:T.inkMid,lineHeight:1.3}}>{m.label}</span>{active&&<span style={{marginLeft:"auto",color:T.gold,fontSize:14}}>✓</span>}
            </button>
          );})}
        </div>
      </div>
      <SldInput label="Disponibilidade diária para saúde" value={f.disponibilidade} onChange={v=>set("disponibilidade",v)} min={10} max={120} unit=" min/dia"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div><Lbl>Como prefere ser acompanhado?</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["Check-ins diários","Relatórios semanais","Alertas sob demanda","Coaching ativo"].map(c=><Chip key={c} label={c} color={T.teal} bg={T.tealBg} active={f.acompanhamento===c} onClick={()=>set("acompanhamento",c)}/>)}</div></div>
        <div><Lbl>Horizonte de resultado esperado</Lbl><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{["1 mês","3 meses","6 meses","1 ano","Longo prazo"].map(h=><Chip key={h} label={h} active={f.horizonte===h} onClick={()=>set("horizonte",h)}/>)}</div></div>
      </div>
    </div>,

    // 5 Gadgets
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <SectionTitle icon="⌚" title="Gadgets e dispositivos" subtitle="Seus dispositivos alimentam o plano com dados reais do dia a dia — sono, frequência cardíaca, passos, glicose e muito mais. Selecione os que você já tem ou pretende usar."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {GADGETS_OB.map(g=>{const active=(f.gadgets||[]).includes(g);return(
          <button key={g} onClick={()=>tog("gadgets",g)} style={{display:"flex",alignItems:"center",gap:10,padding:"13px 16px",background:active?T.tealBg:T.bgWarm,border:`1.5px solid ${active?T.teal:T.border}`,borderRadius:10,cursor:"pointer",transition:"all 0.18s",fontFamily:T.fB,boxShadow:active?`0 0 0 3px ${T.teal}15`:T.shadowCard}}>
            <span style={{fontSize:13,color:active?T.teal:T.ink,fontWeight:500}}>{g}</span>{active&&<span style={{marginLeft:"auto",color:T.teal,fontSize:14}}>✓</span>}
          </button>
        );})}
      </div>
      {(f.gadgets||[]).includes("Outros")&&<TxtInput placeholder="Descreva outros dispositivos..." value={f.gadgetOutro} onChange={v=>set("gadgetOutro",v)}/>}

      {/* Como os dados são atualizados */}
      <Card style={{padding:"20px 22px",background:T.goldFaint,border:`1px solid ${T.goldBorder}`}}>
        <Lbl color={T.gold}>Como seu plano será atualizado automaticamente</Lbl>
        <div style={{display:"flex",flexDirection:"column",gap:12,marginTop:4}}>
          {[
            {icon:"⌚",titulo:"Gadgets conectados",desc:"Apple Watch, Oura, Garmin e outros enviam dados em tempo real — sono, FC, HRV, passos e muito mais. O plano se renova diariamente."},
            {icon:"📄",titulo:"Upload de documentos",desc:"Quando você enviar novos exames ou laudos, a equipe HDohmann lê e incorpora as informações ao seu plano automaticamente."},
            {icon:"✅",titulo:"Check-in diário com Ana",desc:"Todo dia, a enfermeira Ana faz um check-in rápido de 2 minutos — como você dormiu, seu nível de estresse, energia. Isso refina o plano continuamente."},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
              <div><div style={{fontSize:13,color:T.ink,fontWeight:600,marginBottom:3}}>{item.titulo}</div><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7}}>{item.desc}</div></div>
            </div>
          ))}
        </div>
      </Card>
    </div>,

    // 6 Kit Genômico
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <SectionTitle icon="🧬" title="Análise Genômica HDohmann" subtitle="Conheça seu DNA e transforme as informações em ações concretas de saúde. Opcional, mas altamente recomendado."/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
        {[{icon:"📦",title:"Kit em casa",desc:"Receba o material de coleta pelos Correios em 3–5 dias úteis"},{icon:"🧪",title:"Coleta simples",desc:"Swab oral — 2 minutos, sem dor, no conforto da sua casa"},{icon:"📊",title:"Laudo em 30 dias",desc:"Resultado em PDF com análise automática pela Dra. Clara"}].map((fi,i)=>(
          <Card key={i} style={{padding:"18px",textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:10}}>{fi.icon}</div>
            <div style={{fontSize:13,color:T.ink,fontWeight:600,marginBottom:6}}>{fi.title}</div>
            <div style={{fontSize:11,color:T.inkLight,lineHeight:1.6}}>{fi.desc}</div>
          </Card>
        ))}
      </div>
      <Card style={{padding:"22px",background:T.goldFaint,border:`1px solid ${T.goldBorder}`}}>
        <div style={{fontFamily:T.fD,fontSize:18,color:T.gold,marginBottom:14}}>Como realizar a coleta</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[{n:"01",t:"Receba o kit",d:"Caixa com swab estéril, tubo de transporte e envelope pré-pago"},{n:"02",t:"Prepare-se",d:"Não coma nem beba 30 min antes. Lave as mãos."},{n:"03",t:"Colete",d:"Esfregue firmemente em cada bochecha por 30 segundos"},{n:"04",t:"Embale",d:"Insira no tubo, feche e agite 5 segundos"},{n:"05",t:"Envie",d:"Qualquer agência dos Correios — frete pago"},{n:"06",t:"Receba o laudo",d:"Em 21–30 dias, faça upload no app para a Dra. Clara analisar"}].map((s,i)=>(
            <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <span style={{fontSize:9,color:T.gold,fontWeight:700,width:20,flexShrink:0,marginTop:2}}>{s.n}</span>
              <div><span style={{fontSize:12,color:T.ink,fontWeight:600}}>{s.t} — </span><span style={{fontSize:12,color:T.inkMid}}>{s.d}</span></div>
            </div>
          ))}
        </div>
      </Card>
      <div>
        <Lbl>Deseja solicitar o Kit Genômico?</Lbl>
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>set("querKit",true)} style={{flex:1,padding:"16px",background:f.querKit===true?T.goldFaint:"transparent",border:`1.5px solid ${f.querKit===true?T.gold:T.border}`,borderRadius:10,cursor:"pointer",fontFamily:T.fB,fontSize:12,color:f.querKit===true?T.gold:T.inkMid,transition:"all 0.18s",boxShadow:f.querKit===true?`0 0 0 3px ${T.gold}15`:T.shadowCard}}>✓ Sim, quero solicitar o kit</button>
          <button onClick={()=>set("querKit",false)} style={{flex:1,padding:"16px",background:f.querKit===false?T.surfaceMid:"transparent",border:`1.5px solid ${f.querKit===false?T.borderMid:T.border}`,borderRadius:10,cursor:"pointer",fontFamily:T.fB,fontSize:12,color:T.inkMid,transition:"all 0.18s",boxShadow:T.shadowCard}}>Não por enquanto</button>
        </div>
        {f.querKit===true&&<div style={{marginTop:12,padding:"12px 16px",background:T.tealBg,borderRadius:8,border:`1px solid ${T.teal}30`}}><div style={{fontSize:12,color:T.teal,lineHeight:1.7}}>✓ Ótimo! Após concluir o cadastro, a equipe HDohmann entrará em contato para confirmar o endereço de entrega.</div></div>}
      </div>
    </div>,
  ];

  const pct=Math.round((step/(OB_STEPS.length-1))*100);
  return(
    <div style={{minHeight:"100vh",display:"flex",background:T.bg,fontFamily:T.fB,color:T.ink}}>
      <div style={{width:220,flexShrink:0,borderRight:`1px solid ${T.border}`,padding:"32px 24px",display:"flex",flexDirection:"column",background:T.surface,boxShadow:"2px 0 12px rgba(60,50,30,0.04)"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:44}}><span style={{fontFamily:T.fD,fontSize:24,color:T.ink}}>H</span><span style={{fontFamily:T.fD,fontSize:24,color:T.gold}}>Dohmann</span></div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
          {OB_STEPS.map((s,i)=>{const done=i<step,active=i===step;return(
            <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"9px 0",cursor:done?"pointer":"default"}} onClick={()=>done&&setStep(i)}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{width:24,height:24,borderRadius:"50%",border:`2px solid ${done?T.green:active?T.gold:T.border}`,background:done?T.green:active?T.goldFaint:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:done?"#FFF":active?T.gold:T.inkFaint,fontWeight:700,transition:"all 0.3s",boxShadow:active?`0 0 0 3px ${T.gold}20`:"none"}}>{done?"✓":i+1}</div>
                {i<OB_STEPS.length-1&&<div style={{width:1.5,height:28,background:done?T.green:T.border,marginTop:3}}/>}
              </div>
              <span style={{fontSize:11,color:active?T.gold:done?T.ink:T.inkFaint,paddingTop:3,fontWeight:active?600:400}}>{s}</span>
            </div>
          );})}
        </div>
        <div style={{paddingTop:20,borderTop:`1px solid ${T.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:10,color:T.inkFaint}}>PROGRESSO</span><span style={{fontSize:12,color:T.inkMid,fontWeight:600}}>{pct}%</span></div>
          <div style={{height:3,background:T.surfaceMid,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${T.gold},${T.teal})`,transition:"width 0.5s ease"}}/></div>
        </div>
      </div>
      <div style={{flex:1,padding:"48px 52px",overflowY:"auto"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <div style={{marginBottom:28}}><div style={{display:"flex",gap:10,marginBottom:10,alignItems:"center"}}><span style={{fontSize:12,letterSpacing:"0.2em",color:T.gold,fontWeight:700}}>{`0${step+1}`}</span><span style={{fontSize:11,color:T.inkLight,letterSpacing:"0.15em"}}>— {OB_STEPS[step].toUpperCase()}</span></div><div style={{height:1,background:T.border}}/></div>
          <div key={step} style={{animation:"fadeUp 0.3s ease"}}>{panels[step]}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:40,paddingTop:24,borderTop:`1px solid ${T.border}`}}>
            <Btn onClick={()=>step>0&&setStep(s=>s-1)} variant="outline" disabled={step===0}>← VOLTAR</Btn>
            <Btn onClick={()=>step<OB_STEPS.length-1?setStep(s=>s+1):onComplete(f)} variant={step===OB_STEPS.length-1?"gold":"outline"}>{step===OB_STEPS.length-1?"ENTRAR NA EQUIPE →":"PRÓXIMO →"}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════════
function AppPrincipal({user,form,apiKey,onLogout}){
  const[modulo,setModulo]=useState("dashboard");
  const scores=calcScores(form);
  const nome=form?.nome||user.name||"Executivo";
  const initials=nome.split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase();
  const lowAxis=Object.entries(scores.eixos).sort((a,b)=>a[1]-b[1])[0];
  const[todoCheck,setTodoCheck]=useState({});
  const toggleTodo=(key)=>setTodoCheck(prev=>({...prev,[key]:!prev[key]}));

  const todos=[
    ...((form?.meds||[]).filter(m=>m!=="Nenhum").map((m,i)=>({id:`med-${i}`,tipo:"medicamento",icon:"💊",text:`Tomar ${m}`,hora:"Conforme prescrição",cor:T.green,corBg:T.greenBg}))),
    scores.eixos["Sono"]<75&&{id:"sono-1",tipo:"hábito",icon:"🌙",text:"Desligar telas até 22h",hora:"22:00",cor:T.purple,corBg:T.purpleBg},
    scores.eixos["Atividade"]<75&&{id:"atv-1",tipo:"hábito",icon:"🏃",text:`Treino — ${(form?.exercicios||["atividade física"])[0]||"atividade física"}`,hora:"Manhã",cor:T.teal,corBg:T.tealBg},
    scores.eixos["Estresse"]<75&&{id:"est-1",tipo:"hábito",icon:"🌿",text:"Respiração 4-7-8 pós-reunião",hora:"Após reuniões",cor:T.red,corBg:T.redBg},
    scores.eixos["Nutrição"]<75&&{id:"nut-1",tipo:"hábito",icon:"🥗",text:"Café da manhã proteico",hora:"Manhã",cor:T.gold,corBg:T.goldFaint},
    {id:"agua-1",tipo:"hábito",icon:"💧",text:"2L de água ao longo do dia",hora:"Durante o dia",cor:T.blue,corBg:T.blueBg},
    {id:"pass-1",tipo:"hábito",icon:"👣",text:"10.000 passos",hora:"Durante o dia",cor:T.teal,corBg:T.tealBg},
  ].filter(Boolean);
  const todosDone=todos.filter(t=>todoCheck[t.id]).length;

  const Sidebar=()=>(
    <div style={{width:220,flexShrink:0,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",background:T.surface,height:"100vh",position:"sticky",top:0,overflow:"hidden",boxShadow:"2px 0 12px rgba(60,50,30,0.04)"}}>
      <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${T.border}`}}><div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontFamily:T.fD,fontSize:24,color:T.ink}}>H</span><span style={{fontFamily:T.fD,fontSize:24,color:T.gold}}>Dohmann</span></div><div style={{fontSize:8,letterSpacing:"0.22em",color:T.inkFaint,marginTop:2}}>SAÚDE EXECUTIVA</div></div>
      <div style={{padding:"12px 16px 10px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:T.goldFaint,border:`1.5px solid ${T.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:T.gold,fontWeight:700,flexShrink:0,boxShadow:T.shadowCard}}>{initials}</div>
        <div style={{minWidth:0}}><div style={{fontSize:12,color:T.ink,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:500}}>{nome.split(" ")[0]}</div><div style={{fontSize:9,color:T.inkFaint}}>{form?.cargo||"Executivo"}</div></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"10px 10px"}}>
        <div style={{fontSize:8,letterSpacing:"0.2em",color:T.inkFaint,padding:"6px 10px 8px"}}>NAVEGAÇÃO</div>
        {MODULOS.map(m=>{const eq=m.membro?EQUIPE.find(e=>e.id===m.membro):null;const active=modulo===m.id;return(
          <button key={m.id} onClick={()=>setModulo(m.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:active?T.goldFaint:"transparent",border:`1px solid ${active?T.goldBorder:"transparent"}`,cursor:"pointer",transition:"all 0.18s",fontFamily:T.fB,textAlign:"left",marginBottom:2,boxShadow:active?T.shadowCard:"none"}}
            onMouseOver={e=>{if(!active)e.currentTarget.style.background=T.surfaceMid;}} onMouseOut={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
            <span style={{fontSize:15,flexShrink:0}}>{m.icon}</span>
            <span style={{fontSize:12,color:active?T.gold:T.inkMid,fontWeight:active?600:400}}>{m.label}</span>
            {eq&&<div style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:eq.cor,boxShadow:`0 0 6px ${eq.cor}60`}}/>}
          </button>
        );})}
        <div style={{fontSize:8,letterSpacing:"0.2em",color:T.inkFaint,padding:"14px 10px 8px"}}>SUA EQUIPE</div>
        {EQUIPE.map(e=>(<div key={e.id} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",borderRadius:8}}><div style={{width:30,height:30,borderRadius:"50%",background:e.bg,border:`1.5px solid ${e.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,boxShadow:T.shadowCard}}>{e.icon}</div><div style={{minWidth:0}}><div style={{fontSize:11,color:T.inkMid,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.nome}</div><div style={{fontSize:8,color:T.inkFaint,letterSpacing:"0.08em"}}>{e.titulo}</div></div><div style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 6px ${T.green}60`,flexShrink:0}}/></div>))}
      </div>
      <div style={{padding:"14px 16px",borderTop:`1px solid ${T.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:10,color:T.inkFaint}}>VITALIDADE</span><span style={{fontSize:13,color:T.gold,fontFamily:T.fD,fontWeight:700}}>{scores.total}/100</span></div>
        <div style={{height:3,background:T.surfaceMid,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${scores.total}%`,background:`linear-gradient(90deg,${T.gold},${T.teal})`}}/></div>
        <button onClick={onLogout} style={{marginTop:12,width:"100%",padding:"7px",background:"transparent",border:`1px solid ${T.border}`,borderRadius:6,color:T.inkFaint,fontFamily:T.fB,fontSize:9,letterSpacing:"0.12em",cursor:"pointer"}}>SAIR</button>
      </div>
    </div>
  );

  const Content=()=>{
    if(modulo==="dashboard") return(
      <div style={{flex:1,overflowY:"auto",padding:"32px 32px"}}>
        <div style={{maxWidth:980,margin:"0 auto",display:"flex",flexDirection:"column",gap:20,animation:"fadeUp 0.4s ease"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><div style={{fontFamily:T.fD,fontSize:32,color:T.ink,marginBottom:4,lineHeight:1.2}}>Bom dia, {nome.split(" ")[0]}.</div><div style={{fontSize:13,color:T.inkMid}}>Sua equipe HDohmann está ativa e acompanhando seu plano.</div></div>
            <div style={{fontSize:10,color:T.inkFaint,letterSpacing:"0.12em"}}>{new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"}).toUpperCase()}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"200px 1fr",gap:16}}>
            <Card style={{padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"center",gap:12}}>
              <Lbl>Score de Vitalidade</Lbl>
              <RadialScore value={scores.total} size={100}/>
              <div style={{textAlign:"center"}}><div style={{fontSize:11,color:scores.total>=75?T.green:scores.total>=50?T.gold:T.red,letterSpacing:"0.12em",fontWeight:700}}>{scores.total>=75?"ALTO DESEMPENHO":scores.total>=50?"EM PROGRESSO":"ATENÇÃO"}</div></div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
              {Object.entries(scores.eixos).map(([n,sc],i)=>(
                <Card key={i} style={{padding:"16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:11,color:T.inkMid}}>{n}</span><span style={{fontSize:20,color:AXIS_COLORS[n],fontFamily:T.fD,fontWeight:700}}>{sc}</span></div>
                  <div style={{height:4,background:T.surfaceMid,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${sc}%`,background:AXIS_COLORS[n],transition:"width 1.2s ease"}}/></div>
                  <div style={{marginTop:6,fontSize:10,color:T.inkFaint}}>{sc>=80?"Excelente":sc>=65?"Bom":sc>=50?"Regular":"Atenção"}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Como os dados são atualizados */}
          <Card style={{padding:"20px 24px",background:T.blueBg,border:`1px solid ${T.blue}30`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div style={{fontFamily:T.fD,fontSize:18,color:T.ink}}>Como seu plano é atualizado</div>
              <span style={{fontSize:9,color:T.blue,background:T.surface,padding:"3px 10px",borderRadius:20,border:`1px solid ${T.blue}30`,letterSpacing:"0.12em",fontWeight:700}}>AUTOMÁTICO</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {[{icon:"⌚",titulo:"Gadgets",desc:"Apple Watch, Oura, Garmin e outros enviam dados em tempo real. Atualização diária automática.",cor:T.teal},{icon:"📄",titulo:"Documentos",desc:"Envie novos exames ou laudos — a equipe lê e incorpora ao plano imediatamente.",cor:T.purple},{icon:"✅",titulo:"Check-in diário",desc:"A enfermeira Ana faz um check-in rápido todo dia para refinar seu plano continuamente.",cor:T.green}].map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:8,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,boxShadow:T.shadowCard}}>{item.icon}</div>
                  <div><div style={{fontSize:12,color:T.ink,fontWeight:600,marginBottom:4}}>{item.titulo}</div><div style={{fontSize:11,color:T.inkMid,lineHeight:1.6}}>{item.desc}</div></div>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <Lbl>Sua equipe de cuidado</Lbl>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {EQUIPE.map(e=>(<Card key={e.id} hover onClick={()=>setModulo(e.id==="coach"?"coach":e.id==="farmaceutico"?"farmaceutico":e.id==="geneticista"?"geneticista":"plano")} style={{padding:"18px"}}><div style={{width:44,height:44,borderRadius:"50%",background:e.bg,border:`1.5px solid ${e.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:12,boxShadow:T.shadowCard}}>{e.icon}</div><div style={{fontSize:13,color:e.cor,marginBottom:3,fontWeight:600}}>{e.nome}</div><div style={{fontSize:9,color:T.inkFaint,letterSpacing:"0.1em",marginBottom:8}}>{e.titulo}</div><div style={{fontSize:11,color:T.inkMid,lineHeight:1.6}}>{e.descricao}</div><div style={{display:"flex",alignItems:"center",gap:5,marginTop:12}}><div style={{width:7,height:7,borderRadius:"50%",background:T.green,boxShadow:`0 0 6px ${T.green}60`}}/><span style={{fontSize:9,color:T.green,letterSpacing:"0.12em"}}>ONLINE</span></div></Card>))}
            </div>
          </div>
          <Card style={{padding:"20px 24px",background:T.goldFaint,border:`1px solid ${T.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><Lbl color={T.gold}>Prioridade da semana</Lbl><div style={{fontFamily:T.fD,fontSize:20,color:T.ink}}>Foco em <span style={{color:AXIS_COLORS[lowAxis[0]]}}>{lowAxis[0]}</span> — score atual: {lowAxis[1]}/100</div></div>
            <Btn onClick={()=>setModulo("coach")} variant="gold">FALAR COM O COACH →</Btn>
          </Card>
        </div>
      </div>
    );

    if(modulo==="plano"){
      const eq=EQUIPE.find(e=>e.id==="enfermeira");
      const plano=[
        scores.eixos["Sono"]<70&&{tag:"Sono",color:T.purple,bg:T.purpleBg,action:`Sono de ${form?.sono||7}h — alvo 7–9h. Rotina noturna às 22h.`},
        scores.eixos["Atividade"]<70&&{tag:"Atividade",color:T.teal,bg:T.tealBg,action:`${form?.freqTreino||0}x/sem — alvo 4x. Adicionar zona 2 cardio.`},
        scores.eixos["Estresse"]<70&&{tag:"Estresse",color:T.red,bg:T.redBg,action:`Estresse ${form?.estresse||5}/10 — respiração 4-7-8 pós-reuniões.`},
        scores.eixos["Nutrição"]<70&&{tag:"Nutrição",color:T.gold,bg:T.goldFaint,action:`Dieta ${form?.dieta||"não definida"} — proteína no café da manhã.`},
        scores.eixos["Relacionamentos"]<70&&{tag:"Relacionamentos",color:T.green,bg:T.greenBg,action:`${form?.horasTrab||50}h/sem — 2 noites para desconectar.`},
      ].filter(Boolean);
      if(!plano.length)plano.push({tag:"Geral",color:T.gold,bg:T.goldFaint,action:"Excelente! Mantenha a consistência e evolua gradualmente."});
      return(
        <div style={{flex:1,overflowY:"auto",padding:"32px 32px"}}>
          <div style={{maxWidth:1000,margin:"0 auto",animation:"fadeUp 0.4s ease"}}>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:eq.bg,border:`1.5px solid ${eq.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:T.shadowCard}}>{eq.icon}</div>
              <div><div style={{fontFamily:T.fD,fontSize:26,color:T.ink}}>{eq.nome} · Plano de Cuidado Integral</div><div style={{fontSize:11,color:T.inkFaint}}>Coordenado pela enfermeira Ana · {new Date().toLocaleDateString("pt-BR")}</div></div>
              <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:9,color:T.inkFaint,letterSpacing:"0.12em"}}>SCORE GERAL</div><div style={{fontFamily:T.fD,fontSize:30,color:scores.total>=75?T.green:scores.total>=50?T.gold:T.red,fontWeight:700}}>{scores.total}<span style={{fontSize:14,color:T.inkFaint}}>/100</span></div></div>
            </div>
            <Card style={{padding:"24px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div style={{fontFamily:T.fD,fontSize:20,color:T.ink}}>To-Do de Hoje</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:12,color:T.inkMid}}>{todosDone}/{todos.length} concluídos</div>
                  <div style={{height:6,width:120,background:T.surfaceMid,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${todos.length?(todosDone/todos.length)*100:0}%`,background:`linear-gradient(90deg,${T.gold},${T.green})`,transition:"width 0.4s ease"}}/></div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {todos.map(todo=>{const done=todoCheck[todo.id];return(
                  <div key={todo.id} onClick={()=>toggleTodo(todo.id)} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 16px",background:done?T.surfaceMid:T.bgWarm,border:`1px solid ${done?T.border:todo.corBg}`,borderRadius:8,cursor:"pointer",transition:"all 0.2s",opacity:done?0.6:1}}>
                    <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${done?T.green:todo.cor}`,background:done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>{done&&<span style={{fontSize:11,color:"#FFF",fontWeight:700}}>✓</span>}</div>
                    <span style={{fontSize:16,flexShrink:0}}>{todo.icon}</span>
                    <div style={{flex:1}}><div style={{fontSize:13,color:done?T.inkFaint:T.ink,fontWeight:500,textDecoration:done?"line-through":"none"}}>{todo.text}</div><div style={{fontSize:10,color:T.inkFaint,marginTop:2}}>{todo.hora}</div></div>
                    <span style={{fontSize:9,padding:"3px 8px",borderRadius:4,background:todo.corBg,color:todo.cor,fontWeight:700,letterSpacing:"0.1em"}}>{todo.tipo.toUpperCase()}</span>
                  </div>
                );})}
              </div>
            </Card>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
              <Card style={{padding:"20px"}}>
                <Lbl>6 Eixos MEV</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>
                  {Object.entries(scores.eixos).map(([n,sc],i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:11,color:T.inkMid,width:120,flexShrink:0}}>{n}</span><div style={{flex:1,height:5,background:T.surfaceMid,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${sc}%`,background:AXIS_COLORS[n],borderRadius:3}}/></div><span style={{fontSize:13,color:AXIS_COLORS[n],fontFamily:T.fD,fontWeight:700,width:28,textAlign:"right"}}>{sc}</span></div>))}
                </div>
              </Card>
              <Card style={{padding:"20px"}}>
                <Lbl color={T.teal}>Prioridades da Semana</Lbl>
                <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:12}}>
                  {plano.map((p,i)=>(<div key={i} style={{padding:"11px 14px",background:p.bg,borderRadius:8,borderLeft:`3px solid ${p.color}`,display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:"rgba(255,255,255,0.6)",color:p.color,fontWeight:700,letterSpacing:"0.1em",flexShrink:0,marginTop:1}}>{p.tag.toUpperCase()}</span><span style={{fontSize:12,color:T.inkMid,lineHeight:1.6}}>{p.action}</span></div>))}
                </div>
              </Card>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
              <Card style={{padding:"20px"}}>
                <Lbl>Perfil</Lbl>
                {[{l:"Nome",v:form?.nome||"—"},{l:"Cargo",v:`${form?.cargo||"—"} · ${form?.setor||"—"}`},{l:"Sono",v:`${form?.sono||7}h · qualidade ${form?.qualSono||5}/10`},{l:"Treino",v:`${form?.freqTreino||0}x/sem`},{l:"Estresse",v:`${form?.estresse||5}/10`}].map((it,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",paddingBottom:9,marginBottom:9,borderBottom:i<4?`1px solid ${T.border}`:"none"}}><span style={{fontSize:10,color:T.inkFaint}}>{it.l}</span><span style={{fontSize:12,color:T.ink,fontWeight:500}}>{it.v}</span></div>))}
              </Card>
              <Card style={{padding:"20px"}}>
                <Lbl color={T.green}>💊 Medicamentos</Lbl>
                {(form?.meds||[]).filter(m=>m!=="Nenhum").length===0?<div style={{fontSize:12,color:T.inkFaint,marginTop:10}}>Nenhum registrado.</div>:(form?.meds||[]).filter(m=>m!=="Nenhum").map((m,i)=>(<div key={i} style={{padding:"9px 12px",background:T.greenBg,borderRadius:6,marginBottom:8,borderLeft:`3px solid ${T.green}`}}><div style={{fontSize:12,color:T.ink,fontWeight:500}}>{m}</div></div>))}
                {(form?.meds||[]).filter(m=>m!=="Nenhum").length>0&&<div style={{marginTop:10,padding:"10px 12px",background:T.redBg,borderRadius:6,border:`1px solid ${T.red}30`}}><div style={{fontSize:11,color:T.red,lineHeight:1.6}}>⚠️ Rafael verificará interações.</div></div>}
              </Card>
              <Card style={{padding:"20px"}}>
                <Lbl color={T.purple}>Condições & Exames</Lbl>
                <div style={{marginBottom:14}}><div style={{fontSize:10,color:T.inkFaint,marginBottom:8,letterSpacing:"0.1em"}}>CONDIÇÕES</div>{(form?.condicoes||[]).filter(c=>c!=="Nenhuma").length===0?<div style={{fontSize:12,color:T.inkFaint}}>Nenhuma.</div>:(form?.condicoes||[]).filter(c=>c!=="Nenhuma").map((c,i)=><div key={i} style={{fontSize:12,color:T.inkMid,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}>◆ {c}</div>)}</div>
                {form?.glicoseJejum&&<div style={{fontSize:11,color:T.inkMid}}>Glicose jejum: <strong>{form.glicoseJejum} mg/dL</strong></div>}
                {form?.colesterolTotal&&<div style={{fontSize:11,color:T.inkMid}}>Colesterol total: <strong>{form.colesterolTotal} mg/dL</strong></div>}
                {form?.pressaoSistolica&&<div style={{fontSize:11,color:T.inkMid}}>Pressão: <strong>{form.pressaoSistolica}/{form.pressaoDiastolica} mmHg</strong></div>}
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if(modulo==="coach"){const eq=EQUIPE.find(e=>e.id==="coach");return(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 28px",display:"flex",alignItems:"center",gap:14,background:T.surface,flexShrink:0,boxShadow:T.shadowCard}}><div style={{width:42,height:42,borderRadius:"50%",background:eq.bg,border:`1.5px solid ${eq.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadowCard}}>{eq.icon}</div><div><div style={{fontFamily:T.fD,fontSize:20,color:T.ink}}>Coach de Saúde</div><div style={{fontSize:9,color:T.green,letterSpacing:"0.15em"}}>● ONLINE · IA BASEADA NO SEU PERFIL</div></div><div style={{marginLeft:"auto",display:"flex",gap:20}}>{[{l:"VITALIDADE",v:`${scores.total}/100`,c:T.gold},{l:"FOCO",v:lowAxis[0],c:T.red}].map((it,i)=>(<div key={i} style={{textAlign:"right"}}><div style={{fontSize:8,color:T.inkFaint,letterSpacing:"0.12em"}}>{it.l}</div><div style={{fontSize:14,color:it.c,fontFamily:T.fD,fontWeight:700}}>{it.v}</div></div>))}</div></div><ChatIA membro="coach" apiKey={apiKey} placeholder="Fale com seu coach sobre saúde e bem-estar..." inicialMsg={`Olá, ${nome.split(" ")[0]}! Sou o seu Coach de Saúde da equipe HDohmann.\n\nAnalisei seu perfil: Score de Vitalidade ${scores.total}/100. Ponto prioritário: ${lowAxis[0]} (${lowAxis[1]}/100).\n\nComo posso ajudar hoje?`} sugestoes={[`Como melhorar meu ${lowAxis[0].toLowerCase()}?`,"Qual minha prioridade esta semana?","Como o estresse afeta meu sono?","O que comer antes de reuniões longas?"]} systemPrompt={buildPrompt("coach",form,scores)}/></div>);}

    if(modulo==="farmaceutico"){const eq=EQUIPE.find(e=>e.id==="farmaceutico");return(<div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 28px",display:"flex",alignItems:"center",gap:14,background:T.surface,flexShrink:0,boxShadow:T.shadowCard}}><div style={{width:42,height:42,borderRadius:"50%",background:eq.bg,border:`1.5px solid ${eq.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadowCard}}>{eq.icon}</div><div><div style={{fontFamily:T.fD,fontSize:20,color:T.ink}}>{eq.nome} · Farmacêutico Clínico</div><div style={{fontSize:9,color:T.green,letterSpacing:"0.15em"}}>● ONLINE · ANÁLISE DE RECEITAS E INTERAÇÕES</div></div></div><div style={{padding:"12px 28px",background:T.redBg,borderBottom:`1px solid ${T.red}20`,flexShrink:0}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:16,flexShrink:0}}>⚠️</span><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7}}><strong style={{color:T.ink}}>Aviso:</strong> Rafael identificará interações e <strong style={{color:T.red}}>alertará o Dr. Dohmann</strong> em casos de risco. Em urgências, busque atendimento imediato.</div></div></div><ChatIA membro="farmaceutico" apiKey={apiKey} placeholder="Pergunte sobre medicamentos, doses ou interações..." inicialMsg={`Olá! Sou Rafael, farmacêutico clínico da equipe do Dr. Dohmann.\n\nMedicamentos no seu perfil: ${(form?.meds||[]).filter(m=>m!=="Nenhum").join(", ")||"nenhum registrado"}.\n\nEm que posso ajudar?`} sugestoes={["Verificar interações entre meus medicamentos","Como tomar corretamente minha medicação?","Posso tomar vitaminas junto com estatina?","Quais efeitos devo monitorar?"]} systemPrompt={buildPrompt("farmaceutico",form,scores)}/></div>);}

    if(modulo==="geneticista"){
      const eq=EQUIPE.find(e=>e.id==="geneticista");
      const fileRef=useRef(null);
      const[pdfB64,setPdfB64]=useState(null);
      const[pdfNome,setPdfNome]=useState(null);
      const[analise,setAnalise]=useState(null);
      const[analisando,setAnalisando]=useState(false);
      const[abaGen,setAbaGen]=useState("risco");
      const[chatKey,setChatKey]=useState(0);
      const handlePdf=async(file)=>{
        if(!file)return;setPdfNome(file.name);setAnalisando(true);setAbaGen("risco");
        const toB64=(f)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
        try{const b64=await toB64(file);setPdfB64(b64);const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:`Analise o laudo genético e retorne APENAS JSON sem markdown: {"resumo":"resumo em 2-3 frases","nivel_risco_geral":"alto|moderado|baixo","achados":[{"categoria":"nome","gene":"gene","variante":"descrição","impacto":"alto|moderado|baixo","orientacao":"orientação clínica"}],"nutricao":"recomendação nutricional","atividade":"recomendação de atividade","sono":"orientação de sono","medicamentos":"variantes farmacogenômicas","rastreamento":"exames preventivos","alertas":[{"nivel":"critico|atencao|informativo","msg":"mensagem"}]}`,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Analise este laudo genético."}]}]}));const data=await res.json();setAnalise(JSON.parse((data.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim()));setChatKey(k=>k+1);}catch(e){setAnalise({erro:"Erro ao analisar. Verifique sua API Key."});}finally{setAnalisando(false);}
      };
      const impColor=(i)=>({alto:T.red,moderado:T.gold,baixo:T.green})[i]||T.inkMid;
      const impBg=(i)=>({alto:T.redBg,moderado:T.goldFaint,baixo:T.greenBg})[i]||T.surfaceMid;
      return(
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          <div style={{borderBottom:`1px solid ${T.border}`,padding:"16px 28px",display:"flex",alignItems:"center",gap:14,background:T.surface,flexShrink:0,boxShadow:T.shadowCard}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:eq.bg,border:`1.5px solid ${eq.cor}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadowCard}}>{eq.icon}</div>
            <div><div style={{fontFamily:T.fD,fontSize:20,color:T.ink}}>{eq.nome} · Geneticista Clínica</div><div style={{fontSize:9,color:T.green,letterSpacing:"0.15em"}}>● ONLINE · ANÁLISE DE LAUDOS GENÉTICOS</div></div>
            <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
              {pdfNome&&<span style={{fontSize:10,color:T.purple,background:T.purpleBg,padding:"4px 12px",borderRadius:20,border:`1px solid ${T.purple}30`}}>📄 {pdfNome.slice(0,24)}{pdfNome.length>24?"...":""}</span>}
              <Btn onClick={()=>fileRef.current?.click()} variant="outline" style={{borderColor:T.purple,color:T.purple}}>{pdfB64?"TROCAR LAUDO":"CARREGAR LAUDO →"}</Btn>
              <input ref={fileRef} type="file" accept=".pdf" onChange={e=>handlePdf(e.target.files[0])} style={{display:"none"}}/>
            </div>
          </div>
          <div style={{borderBottom:`1px solid ${T.border}`,padding:"0 28px",display:"flex",gap:0,background:T.bgWarm,flexShrink:0}}>
            {[{id:"risco",label:"Análise de Risco"},{id:"chat",label:"Falar com Dra. Clara"}].map(t=>(<button key={t.id} onClick={()=>setAbaGen(t.id)} style={{background:"none",border:"none",borderBottom:`2px solid ${abaGen===t.id?T.purple:"transparent"}`,padding:"13px 22px",fontSize:10,letterSpacing:"0.15em",textTransform:"uppercase",color:abaGen===t.id?T.purple:T.inkFaint,cursor:"pointer",fontFamily:T.fB,transition:"all 0.2s"}}>{t.label}</button>))}
          </div>
          {abaGen==="risco"&&(
            <div style={{flex:1,overflowY:"auto",padding:"28px 28px"}}>
              {!pdfB64&&!analisando&&(
                <div style={{maxWidth:900,margin:"0 auto"}}>
                  <div onClick={()=>fileRef.current?.click()} style={{cursor:"pointer",marginBottom:28}}>
                    <Card hover style={{padding:"40px",textAlign:"center",border:`2px dashed ${T.purple}40`,background:T.purpleBg}}>
                      <div style={{fontSize:48,marginBottom:16}}>🧬</div>
                      <div style={{fontFamily:T.fD,fontSize:22,color:T.ink,marginBottom:8}}>Carregue seu laudo genético</div>
                      <div style={{fontSize:13,color:T.inkMid,marginBottom:20,lineHeight:1.8}}>A Dra. Clara irá analisar e extrair todos os achados relevantes para seu plano.</div>
                      <Btn variant="outline" style={{borderColor:T.purple,color:T.purple}}>SELECIONAR PDF →</Btn>
                    </Card>
                  </div>
                  <div style={{fontFamily:T.fD,fontSize:20,color:T.ink,marginBottom:4}}>O que sua análise cobre</div>
                  <div style={{fontSize:13,color:T.inkMid,lineHeight:1.8,marginBottom:20}}>Mais de 30 variantes em 6 categorias clínicas.</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {PAINEL_GENETICO.map((cat,i)=>(<Card key={i} style={{overflow:"hidden"}}><div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`,background:cat.bg,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:22}}>{cat.icon}</span><div><div style={{fontSize:13,color:cat.color,fontWeight:600}}>{cat.cat}</div><div style={{fontSize:9,color:T.inkFaint,marginTop:2}}>{cat.genes.length} GENES</div></div></div><div style={{padding:"12px 18px"}}><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7,marginBottom:10}}>{cat.desc}</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{cat.genes.map((g,j)=><span key={j} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:cat.bg,color:cat.color,border:`1px solid ${cat.color}30`,fontFamily:T.fB}}>{g}</span>)}</div></div></Card>))}
                  </div>
                </div>
              )}
              {analisando&&(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60%",gap:20,textAlign:"center"}}><div style={{fontSize:48,animation:"spin 2s linear infinite",display:"inline-block"}}>🧬</div><div style={{fontFamily:T.fD,fontSize:24,color:T.ink}}>Dra. Clara analisando seu laudo</div><div style={{fontSize:13,color:T.inkMid}}>Identificando variantes e cruzando com seu plano...</div></div>)}
              {analise&&!analisando&&(
                <div style={{maxWidth:900,margin:"0 auto",display:"flex",flexDirection:"column",gap:16,animation:"fadeUp 0.4s ease"}}>
                  {analise.erro?<Card style={{padding:"20px",background:T.redBg,border:`1px solid ${T.red}30`}}><div style={{fontSize:13,color:T.red}}>{analise.erro}</div></Card>:(
                    <>
                      <Card style={{overflow:"hidden"}}><div style={{padding:"20px 24px",borderBottom:`1px solid ${T.border}`,background:T.purpleBg,display:"flex",gap:14,alignItems:"flex-start"}}><div style={{width:36,height:36,borderRadius:"50%",background:T.surface,border:`1.5px solid ${T.purple}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🧬</div><div><Lbl color={T.purple}>Dra. Clara · Análise Genômica</Lbl><div style={{fontSize:14,color:T.ink,lineHeight:1.8}}>{analise.resumo}</div></div>{analise.nivel_risco_geral&&<div style={{marginLeft:"auto",padding:"6px 14px",borderRadius:20,background:impBg(analise.nivel_risco_geral),border:`1px solid ${impColor(analise.nivel_risco_geral)}40`,fontSize:10,color:impColor(analise.nivel_risco_geral),fontWeight:700,letterSpacing:"0.12em",flexShrink:0}}>{analise.nivel_risco_geral.toUpperCase()}</div>}</div><div style={{padding:"14px 24px",background:T.bgWarm}}><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7}}>💡 Faça suas perguntas na aba <strong>"Falar com Dra. Clara"</strong>.</div></div></Card>
                      {(analise.alertas||[]).map((a,i)=>{const lv={critico:{c:T.red,bg:T.redBg,icon:"🚨"},atencao:{c:T.gold,bg:T.goldFaint,icon:"⚠️"},informativo:{c:T.blue,bg:T.blueBg,icon:"ℹ️"}}[a.nivel]||{c:T.blue,bg:T.blueBg,icon:"ℹ️"};return(<Card key={i} style={{padding:"14px 18px",background:lv.bg,border:`1px solid ${lv.c}30`}}><div style={{display:"flex",gap:10}}><span style={{fontSize:18,flexShrink:0}}>{lv.icon}</span><span style={{fontSize:13,color:T.ink,lineHeight:1.7}}>{a.msg}</span></div></Card>);})}
                      {(analise.achados||[]).length>0&&<Card style={{padding:"20px 24px"}}><Lbl>Achados por Variante</Lbl><div style={{display:"flex",flexDirection:"column",gap:10,marginTop:12}}>{analise.achados.map((a,i)=>(<div key={i} style={{padding:"14px 16px",background:impBg(a.impacto),border:`1px solid ${impColor(a.impacto)}30`,borderRadius:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:12,color:T.ink,fontWeight:600}}>{a.gene}</span><span style={{fontSize:10,color:T.inkFaint}}>· {a.categoria}</span></div><span style={{fontSize:9,padding:"3px 9px",borderRadius:4,background:"rgba(255,255,255,0.7)",color:impColor(a.impacto),fontWeight:700,letterSpacing:"0.12em"}}>IMPACTO {(a.impacto||"").toUpperCase()}</span></div><div style={{fontSize:11,color:T.inkMid,marginBottom:8}}>{a.variante}</div><div style={{fontSize:12,color:T.ink,lineHeight:1.6,borderTop:`1px solid rgba(0,0,0,0.06)`,paddingTop:8}}><span style={{color:impColor(a.impacto)}}>→ </span>{a.orientacao}</div></div>))}</div></Card>}
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{[{label:"Nutrição de Precisão",key:"nutricao",color:T.gold,bg:T.goldFaint,icon:"🥗"},{label:"Atividade Física",key:"atividade",color:T.teal,bg:T.tealBg,icon:"⚡"},{label:"Sono e Cronótipo",key:"sono",color:T.purple,bg:T.purpleBg,icon:"◑"},{label:"Farmacogenômica",key:"medicamentos",color:T.blue,bg:T.blueBg,icon:"💊"}].map((item,i)=>analise[item.key]&&(<Card key={i} style={{padding:"18px 20px",background:item.bg,border:`1px solid ${item.color}30`}}><div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}><span style={{fontSize:18}}>{item.icon}</span><Lbl color={item.color}>{item.label}</Lbl></div><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7}}>{analise[item.key]}</div></Card>))}</div>
                      {analise.rastreamento&&<Card style={{padding:"18px 22px",background:T.redBg,border:`1px solid ${T.red}30`}}><div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}><span style={{fontSize:18}}>⚠️</span><Lbl color={T.red}>Rastreamentos Prioritários</Lbl></div><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7}}>{analise.rastreamento}</div></Card>}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {abaGen==="chat"&&(!pdfB64?(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,padding:40,textAlign:"center"}} onClick={()=>fileRef.current?.click()}><div style={{width:80,height:80,borderRadius:"50%",background:T.purpleBg,border:`2px dashed ${T.purple}60`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,cursor:"pointer"}}>🧬</div><div style={{fontFamily:T.fD,fontSize:22,color:T.inkMid}}>Carregue seu laudo primeiro</div><div style={{fontSize:13,color:T.inkFaint,maxWidth:400,lineHeight:1.8}}>A Dra. Clara responderá perguntas baseadas nos seus resultados reais.</div><Btn variant="outline" style={{borderColor:T.purple,color:T.purple}}>SELECIONAR PDF →</Btn></div>):(<ChatIA key={chatKey} membro="geneticista" apiKey={apiKey} placeholder="Pergunte sobre seus resultados genéticos..." pdfB64={pdfB64} inicialMsg={`Olá! Sou a Dra. Clara, geneticista da equipe do Dr. Dohmann.\n\nLi seu laudo "${pdfNome}". Estou pronta para responder suas perguntas.\n\nO que gostaria de saber?`} sugestoes={["O que significam minhas variantes de risco?","Como isso afeta minha nutrição?","Tenho risco cardiovascular elevado?","Quais exames preventivos são prioritários?"]} systemPrompt={buildPrompt("geneticista",form,scores)}/>))}
        </div>
      );
    }

    if(modulo==="documentos"){
      const fileRef2=useRef(null);
      const[docs,setDocs]=useState([]);
      const[selDoc,setSelDoc]=useState(null);
      const TIPO_META={"genetico":{icon:"🧬",color:T.purple,bg:T.purpleBg},"imagem":{icon:"🩻",color:T.blue,bg:T.blueBg},"clinico":{icon:"🔬",color:T.teal,bg:T.tealBg},"receita":{icon:"💊",color:T.green,bg:T.greenBg},"atestado":{icon:"📋",color:T.gold,bg:T.goldFaint},"relatorio":{icon:"📄",color:T.orange,bg:T.orangeBg},"consulta":{icon:"🩺",color:T.red,bg:T.redBg},"outro":{icon:"📎",color:T.inkFaint,bg:T.surfaceMid}};
      const handleDocUpload=async(files)=>{
        if(!apiKey)return;
        for(const file of Array.from(files)){
          if(!file.type.includes("pdf"))continue;
          const id=Date.now()+Math.random();
          setDocs(prev=>[{id,titulo:file.name.replace(".pdf",""),tipo:"outro",status:"analisando",data:new Date().toLocaleDateString("pt-BR"),analise:null},...prev]);
          setSelDoc(id);
          const toB64=(f)=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(f);});
          try{const b64=await toB64(file);const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,system:`Analise o documento de saúde e retorne APENAS JSON sem markdown: {"tipo":"genetico|imagem|clinico|receita|atestado|relatorio|consulta|outro","titulo":"título","profissional":"nome se disponível","resumo":"resumo em 2-3 frases","diagnosticos":["lista"],"medicamentos":[{"nome":"","dose":"","frequencia":""}],"agenda_exames":[{"exame":"","prazo":"","urgencia":"alta|media|baixa","motivo":""}],"checklist":[{"item":"","urgencia":"alta|media|baixa"}],"alertas":[{"nivel":"critico|atencao|informativo","mensagem":""}]}`,messages:[{role:"user",content:[{type:"document",source:{type:"base64",media_type:"application/pdf",data:b64}},{type:"text",text:"Analise este documento."}]}]}));const data=await res.json();const parsed=JSON.parse((data.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());setDocs(prev=>prev.map(d=>d.id===id?{...d,titulo:parsed.titulo||d.titulo,tipo:parsed.tipo||"outro",status:"pronto",analise:parsed}:d));}catch{setDocs(prev=>prev.map(d=>d.id===id?{...d,status:"erro"}:d));}
        }
      };
      const docAtual=docs.find(d=>d.id===selDoc);
      return(
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div style={{width:280,flexShrink:0,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",background:T.bgWarm}}>
            <div style={{padding:"16px"}}>
              <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();handleDocUpload(e.dataTransfer.files);}} onClick={()=>fileRef2.current?.click()} style={{border:`2px dashed ${T.borderMid}`,borderRadius:10,padding:"20px",textAlign:"center",cursor:"pointer",background:T.surface,transition:"all 0.2s",boxShadow:T.shadowCard}} onMouseOver={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.background=T.goldFaint;}} onMouseOut={e=>{e.currentTarget.style.borderColor=T.borderMid;e.currentTarget.style.background=T.surface;}}>
                <div style={{fontSize:28,marginBottom:6}}>📄</div>
                <div style={{fontSize:12,color:T.inkMid,marginBottom:3,fontWeight:500}}>Arraste PDFs aqui</div>
                <div style={{fontSize:10,color:T.inkFaint}}>ou clique para selecionar</div>
              </div>
              <input ref={fileRef2} type="file" accept=".pdf" multiple onChange={e=>handleDocUpload(e.target.files)} style={{display:"none"}}/>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"0 12px 12px",display:"flex",flexDirection:"column",gap:8}}>
              {docs.length===0&&<div style={{textAlign:"center",padding:"32px 16px"}}><div style={{fontSize:28,marginBottom:10}}>📂</div><div style={{fontSize:12,color:T.inkFaint,lineHeight:1.6}}>Nenhum documento ainda.</div></div>}
              {docs.map(doc=>{const tm=TIPO_META[doc.tipo]||TIPO_META.outro;return(<div key={doc.id} onClick={()=>setSelDoc(doc.id)} style={{padding:"12px 14px",background:selDoc===doc.id?T.goldFaint:T.surface,border:`1.5px solid ${selDoc===doc.id?T.gold:T.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.18s",boxShadow:T.shadowCard}}><div style={{display:"flex",gap:10,alignItems:"flex-start"}}><div style={{width:32,height:32,borderRadius:6,background:tm.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{tm.icon}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:12,color:T.ink,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{doc.titulo}</div><div style={{display:"flex",gap:5,alignItems:"center"}}><span style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:tm.bg,color:tm.color,fontWeight:700}}>{doc.tipo.toUpperCase()}</span><span style={{fontSize:9,color:T.inkFaint}}>{doc.data}</span></div></div>{doc.status==="analisando"&&<div style={{width:7,height:7,borderRadius:"50%",background:T.gold,animation:"pulse 1.2s ease infinite",flexShrink:0,marginTop:3}}/>}{doc.status==="pronto"&&<div style={{width:7,height:7,borderRadius:"50%",background:T.green,flexShrink:0,marginTop:3}}/>}</div></div>);})}
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"28px 32px"}}>
            {!docAtual?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,textAlign:"center"}}><div style={{fontSize:48}}>🩺</div><div style={{fontFamily:T.fD,fontSize:22,color:T.inkMid}}>Selecione ou envie um documento</div><div style={{fontSize:13,color:T.inkFaint,maxWidth:360,lineHeight:1.8}}>A equipe HDohmann extrai diagnósticos, medicamentos, exames e ações de cada documento.</div></div>
            ):docAtual.status==="analisando"?(<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"80%",gap:16,textAlign:"center"}}><div style={{fontSize:40,animation:"spin 2s linear infinite",display:"inline-block"}}>🔬</div><div style={{fontFamily:T.fD,fontSize:22,color:T.ink}}>Equipe analisando...</div></div>
            ):docAtual.analise?(<div style={{display:"flex",flexDirection:"column",gap:16,maxWidth:800,animation:"fadeUp 0.4s ease"}}>
              <Card style={{overflow:"hidden"}}><div style={{padding:"18px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",gap:14,alignItems:"flex-start"}}><div style={{width:44,height:44,borderRadius:8,background:(TIPO_META[docAtual.tipo]||TIPO_META.outro).bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{(TIPO_META[docAtual.tipo]||TIPO_META.outro).icon}</div><div><div style={{fontFamily:T.fD,fontSize:20,color:T.ink,marginBottom:4}}>{docAtual.analise.titulo}</div>{docAtual.analise.profissional&&<span style={{fontSize:11,color:T.inkFaint}}>Dr(a). {docAtual.analise.profissional}</span>}</div></div><div style={{padding:"16px 22px",background:T.goldFaint,display:"flex",gap:12,alignItems:"flex-start"}}><div style={{width:30,height:30,borderRadius:"50%",background:T.surface,border:`1.5px solid ${T.goldBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>H</div><div><Lbl color={T.gold}>Equipe HDohmann · Análise</Lbl><div style={{fontSize:13,color:T.ink,lineHeight:1.75}}>{docAtual.analise.resumo}</div></div></div></Card>
              {(docAtual.analise.alertas||[]).map((a,i)=>{const lv={critico:{c:T.red,bg:T.redBg,icon:"🚨"},atencao:{c:T.gold,bg:T.goldFaint,icon:"⚠️"},informativo:{c:T.blue,bg:T.blueBg,icon:"ℹ️"}}[a.nivel]||{c:T.blue,bg:T.blueBg,icon:"ℹ️"};return(<Card key={i} style={{padding:"14px 18px",background:lv.bg,border:`1px solid ${lv.c}30`}}><div style={{display:"flex",gap:10}}><span style={{fontSize:16}}>{lv.icon}</span><span style={{fontSize:13,color:T.ink,lineHeight:1.6}}>{a.mensagem}</span></div></Card>);})}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {(docAtual.analise.diagnosticos||[]).length>0&&<Card style={{padding:"18px 20px"}}><Lbl color={T.purple}>Diagnósticos</Lbl>{docAtual.analise.diagnosticos.map((d,i)=><div key={i} style={{fontSize:12,color:T.inkMid,padding:"6px 0",borderBottom:`1px solid ${T.border}`,lineHeight:1.5}}>◆ {d}</div>)}</Card>}
                {(docAtual.analise.medicamentos||[]).length>0&&<Card style={{padding:"18px 20px"}}><Lbl color={T.green}>💊 Medicamentos</Lbl>{docAtual.analise.medicamentos.map((m,i)=><div key={i} style={{padding:"9px 12px",background:T.greenBg,borderRadius:6,marginBottom:8,borderLeft:`3px solid ${T.green}`}}><div style={{fontSize:12,color:T.ink,fontWeight:500}}>{m.nome}</div><div style={{fontSize:11,color:T.inkFaint}}>{m.dose} {m.frequencia}</div></div>)}</Card>}
              </div>
              {(docAtual.analise.checklist||[]).length>0&&<Card style={{padding:"18px 20px"}}><Lbl color={T.green}>✓ Ações a Executar</Lbl><div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>{docAtual.analise.checklist.map((item,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 14px",background:T.bgWarm,borderRadius:8,border:`1px solid ${T.border}`}}><div style={{width:18,height:18,borderRadius:5,border:`2px solid ${T.border}`,flexShrink:0,marginTop:1}}/><span style={{fontSize:12,color:T.inkMid,lineHeight:1.5}}>{item.item}</span></div>)}</div></Card>}
            </div>):null}
          </div>
        </div>
      );
    }

    if(modulo==="integracoes"){
      const[selInt,setSelInt]=useState(null);
      const[connected,setConnected]=useState({});
      const[stepsDone,setStepsDone]=useState({});
      const item=INTEGRACOES.find(i=>i.id===selInt);
      const isStepDone=(id,idx)=>!!stepsDone[`${id}-${idx}`];
      const toggleStep=(id,idx)=>{const k=`${id}-${idx}`;setStepsDone(prev=>({...prev,[k]:!prev[k]}));};
      const allDone=(id)=>{const it=INTEGRACOES.find(i=>i.id===id);return it?.passos.every((_,idx)=>isStepDone(id,idx));};
      return(
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div style={{flex:1,overflowY:"auto",padding:"24px 28px",background:T.bg}}>
            <div style={{fontSize:10,color:T.inkFaint,letterSpacing:"0.15em",marginBottom:16}}>DISPOSITIVOS — {Object.values(connected).filter(Boolean).length} CONECTADO(S)</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
              {INTEGRACOES.map(it=>{const conn=!!connected[it.id];return(<Card key={it.id} hover onClick={()=>setSelInt(it.id===selInt?null:it.id)} style={{padding:"18px",border:`1.5px solid ${selInt===it.id?T.gold:conn?T.green+"60":T.border}`,background:selInt===it.id?T.goldFaint:T.surface}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{width:40,height:40,borderRadius:10,background:conn?T.greenBg:`${it.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:T.shadowCard}}>{it.icon}</div><div style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:7,height:7,borderRadius:"50%",background:conn?T.green:T.surfaceMid,boxShadow:conn?`0 0 7px ${T.green}60`:"none"}}/><span style={{fontSize:9,color:conn?T.green:T.inkFaint,letterSpacing:"0.1em"}}>{conn?"CONECTADO":"OFFLINE"}</span></div></div><div style={{fontSize:13,color:T.ink,fontWeight:600,marginBottom:6}}>{it.nome}</div><div style={{display:"flex",gap:4,marginBottom:8}}>{it.plat.map(p=><span key={p} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:p==="iOS"?T.blueBg:T.greenBg,color:p==="iOS"?T.blue:T.green,fontFamily:T.fB}}>{p}</span>)}</div><div style={{fontSize:11,color:T.inkMid,lineHeight:1.5}}>{it.desc}</div></Card>);})}
            </div>
          </div>
          {item&&(<div style={{width:360,flexShrink:0,borderLeft:`1px solid ${T.border}`,display:"flex",flexDirection:"column",overflow:"hidden",background:T.surface,boxShadow:"-2px 0 12px rgba(60,50,30,0.04)"}}><div style={{padding:"20px 22px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:12}}><div style={{width:42,height:42,borderRadius:10,background:`${item.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:T.shadowCard}}>{item.icon}</div><div style={{flex:1}}><div style={{fontSize:15,color:T.ink,fontWeight:600}}>{item.nome}</div><div style={{display:"flex",gap:4,marginTop:4}}>{item.plat.map(p=><span key={p} style={{fontSize:9,padding:"2px 7px",borderRadius:4,background:p==="iOS"?T.blueBg:T.greenBg,color:p==="iOS"?T.blue:T.green,fontFamily:T.fB}}>{p}</span>)}</div></div><button onClick={()=>setSelInt(null)} style={{background:"none",border:"none",color:T.inkFaint,cursor:"pointer",fontSize:18,padding:4}}>✕</button></div>
          <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}><div style={{fontSize:12,color:T.inkMid,lineHeight:1.7,marginBottom:18}}>{item.desc}</div><Lbl color={T.gold}>Passos de Configuração</Lbl><div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>{item.passos.map((p,i)=>{const done=isStepDone(item.id,i);return(<div key={i} onClick={()=>toggleStep(item.id,i)} style={{display:"flex",gap:10,padding:"12px 14px",background:done?T.greenBg:T.bgWarm,border:`1.5px solid ${done?T.green+"50":T.border}`,borderRadius:8,cursor:"pointer",transition:"all 0.2s",boxShadow:T.shadowCard}}><div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${done?T.green:T.borderMid}`,background:done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all 0.2s"}}>{done?<span style={{fontSize:10,color:"#FFF",fontWeight:700}}>✓</span>:<span style={{fontSize:9,color:T.inkFaint}}>{i+1}</span>}</div><span style={{fontSize:12,color:done?T.inkFaint:T.ink,lineHeight:1.6,textDecoration:done?"line-through":"none"}}>{p}</span></div>);})}</div>
          <div style={{marginTop:20}}>{allDone(item.id)&&!connected[item.id]?(<Btn onClick={()=>setConnected(prev=>({...prev,[item.id]:true}))} variant="gold" style={{width:"100%",padding:13}}>✓ MARCAR COMO CONECTADO</Btn>):connected[item.id]?(<div style={{display:"flex",gap:8}}><div style={{flex:1,padding:11,background:T.greenBg,border:`1.5px solid ${T.green}40`,borderRadius:8,textAlign:"center",fontSize:11,color:T.green,letterSpacing:"0.15em",fontWeight:700}}>✓ CONECTADO</div><Btn onClick={()=>setConnected(prev=>({...prev,[item.id]:false}))} variant="outline">Desconectar</Btn></div>):(<Card style={{padding:"14px 16px",background:T.goldFaint,border:`1px solid ${T.goldBorder}`}}><div style={{fontSize:12,color:T.inkMid,lineHeight:1.6,marginBottom:10}}>Complete todos os passos acima.</div><div style={{display:"flex",gap:6,alignItems:"center"}}><div style={{height:3,flex:1,background:T.surfaceMid,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(item.passos.filter((_,idx)=>isStepDone(item.id,idx)).length/item.passos.length)*100}%`,background:T.gold,transition:"width 0.3s ease"}}/></div><span style={{fontSize:9,color:T.inkFaint}}>{item.passos.filter((_,idx)=>isStepDone(item.id,idx)).length}/{item.passos.length}</span></div></Card>)}</div></div></div>)}
        </div>
      );
    }
    return null;
  };

  return(
    <div style={{display:"flex",height:"100vh",background:T.bg,fontFamily:T.fB,color:T.ink,overflow:"hidden"}}>
      <Sidebar/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{borderBottom:`1px solid ${T.border}`,padding:"0 28px",height:48,display:"flex",alignItems:"center",justifyContent:"space-between",background:T.surface,flexShrink:0,boxShadow:T.shadowCard}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:T.inkFaint,letterSpacing:"0.15em"}}>HDohmann Health</span><span style={{color:T.border}}>›</span><span style={{fontSize:11,color:T.inkMid,letterSpacing:"0.12em",fontWeight:500}}>{MODULOS.find(m=>m.id===modulo)?.label}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:T.green,boxShadow:`0 0 8px ${T.green}60`,animation:"pulse 2s ease infinite"}}/><span style={{fontSize:9,color:T.inkFaint,letterSpacing:"0.12em"}}>EQUIPE ONLINE</span></div>
        </div>
        <Content/>
      </div>
    </div>
  );
}

// Processing
function ScreenProcessing(){return(<div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.fB}}><div style={{textAlign:"center",maxWidth:420,padding:32}}><div style={{fontFamily:T.fD,fontSize:52,color:T.gold,marginBottom:8,animation:"pulse 2s ease infinite",lineHeight:1}}>H</div><div style={{fontFamily:T.fD,fontSize:28,color:T.ink,marginBottom:4}}>Sua equipe está se preparando</div><div style={{fontSize:11,color:T.inkFaint,marginBottom:32,letterSpacing:"0.12em"}}>EQUIPE HDOHMANN · CONFIGURANDO SEU PLANO</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{["Ana está montando seu plano de cuidado integral...","Coach analisando seus objetivos e dados...","Rafael verificando sua lista de medicamentos...","Dra. Clara aguardando seu laudo genético...","Configurando alertas personalizados..."].map((msg,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.surface,borderRadius:8,border:`1px solid ${T.border}`,boxShadow:T.shadowCard,animation:`fadeUp 0.4s ease ${i*0.45}s both`}}><div style={{width:7,height:7,borderRadius:"50%",background:T.green,animation:`pulse 1.5s ease ${i*0.3}s infinite`,flexShrink:0}}/><span style={{fontSize:12,color:T.inkMid}}>{msg}</span></div>))}</div></div></div>);}

// ROOT
export default function HDohmann(){
  const[screen,setScreen]=useState("login");
  const[user,setUser]=useState(null);
  const[apiKey,setApiKey]=useState("");
  const[form,setForm]=useState(null);

  const handleLogin=async(userData)=>{
    setUser(userData);
    const savedProfile=await loadProfile(userData.userId);
    if(savedProfile){setForm(savedProfile);setScreen("apikey");}
    else setScreen("apikey");
  };

  const handleApiKey=(key)=>{setApiKey(key);setScreen(form?"app":"boasvindas");};
  const handleOnboarding=async(f)=>{setForm(f);await saveProfile(user.userId,f);setScreen("processing");setTimeout(()=>setScreen("app"),2800);};

  return(
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} textarea{resize:none} ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#D4CCBC;border-radius:2px} @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:0.4;transform:scale(0.9)}50%{opacity:1;transform:scale(1.05)}} @keyframes blink{0%,100%{opacity:0.2}50%{opacity:1}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      {screen==="login"       && <ScreenLogin onLogin={handleLogin}/>}
      {screen==="apikey"      && <ScreenApiKey user={user} onConfirm={handleApiKey}/>}
      {screen==="boasvindas"  && <ScreenBoasVindas user={user} onStart={()=>setScreen("onboarding")}/>}
      {screen==="onboarding"  && <ScreenOnboarding user={user} onComplete={handleOnboarding}/>}
      {screen==="processing"  && <ScreenProcessing/>}
      {screen==="app"         && <AppPrincipal user={user} form={form} apiKey={apiKey} onLogout={()=>{setScreen("login");setUser(null);setApiKey("");}}/>}
    </>
  );
}
