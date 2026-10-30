/* Shoaib portfolio agent: tiny in-browser RAG.
   Retrieval = BM25 over the knowledge base below (every fact comes from this portfolio).
   Generation = grounded answer built only from the retrieved passages.
   Nothing retrieved / not covered  ->  "not confirmed yet, I will learn it immediately". No guessing, no server. */
(function(root){
'use strict';

/* ======================= 1. KNOWLEDGE BASE (edit here to teach the agent) ======================= */
var KB=[
{id:'intro',t:'About me',s:'#about',
 a:"I'm M. Shoaib, an AI Engineer based in Lahore, Punjab, Pakistan. I build voice calling agents, chatbots and workflow automation that qualify leads and cut repetitive work, backed by hands-on Meta, TikTok and Shopify delivery.",
 kw:'who name about yourself introduce intro shoaib muhammad engineer profile bio kaun naam apna taruf aap',
 next:['What do you build?','Show me your projects','What results have you delivered?']},
{id:'availability',t:'Contact',s:'#contact',
 a:"I'm available for AI projects: voice agents, chatbots, automation, web systems or growth work. Tell me what you want to automate or launch and we can take it from there.",
 kw:'hire hiring available availability freelance collaborate together opportunity open start talk discuss',
 act:'contact',next:['How can I contact you?','What do you build?']},
{id:'education',t:'About me',s:'#top',
 a:"I hold a BS in Computer Science from Minhaj University, Lahore, and I have 3+ years of experience in growth and automation.",
 kw:'education degree study studied university college qualification qualified bs cs computer science minhaj years taleem parhai degree',
 next:['What is your experience?','What do you build?']},
{id:'location',t:'Contact',s:'#contact',
 a:"I'm based in Lahore, Punjab, Pakistan. Time Digital, my agency project under Time Marketing in Lahore, works with clients worldwide.",
 kw:'where location based live city country pakistan lahore punjab worldwide remote kahan shehar rehte',
 next:['How can I contact you?','Tell me about the agency']},
{id:'contact',t:'Contact',s:'#contact',
 a:"You can reach me here:\nEmail: muhammadshoaibhakim@gmail.com\nPhone: +92 312 6445451\nLocation: Lahore, Punjab, Pakistan",
 kw:'contact email mail phone call number reach message talk touch address rabta number whatsapp',
 act:'contact',next:['Are you available for projects?','Where are you based?']},

{id:'services',t:'What I build',s:'#build',
 a:"I work across five areas:\n• AI calling agents\n• AI chatbots\n• Workflow automation\n• Websites, apps and ERP\n• Growth and e-commerce (Meta and TikTok ads, SEO, Shopify)",
 kw:'services offer build make do skills skill expertise capabilities speciality specialty provide help kaam kam kya',
 next:['Tell me about AI calling agents','What is your tech stack?','Show me your projects']},
{id:'svc-calling',t:'What I build',s:'#build',
 a:"AI calling agents: voice agents that place and handle calls for lead qualification, bookings and follow-ups, with scripting, prompt design and conversation-flow testing.",
 kw:'voice calling call agents agent phone receptionist lead qualification booking followup follow-up prompt script conversation',
 next:['Show me Visecore','What is JARVIS?']},
{id:'svc-chatbot',t:'What I build',s:'#build',
 a:"AI chatbots: support, lead-capture and FAQ bots for websites and messaging, tuned for accurate, on-brand answers.",
 kw:'chatbot chatbots bot bots chat support faq lead capture messaging website',
 next:['What else do you build?']},
{id:'svc-automation',t:'What I build',s:'#build',
 a:"Workflow automation: automations linking AI tools to lead handling, content operations and repetitive processes.",
 kw:'automation automate workflow workflows automations process repetitive lead handling content operations',
 next:['What else do you build?']},
{id:'svc-web',t:'What I build',s:'#build',
 a:"Websites, apps and ERP: business and e-commerce sites, UI/UX direction, and systems for inventory, finance, HR, sales and CRM.",
 kw:'website websites web app apps erp ui ux design inventory finance hr sales crm software system systems ecommerce e-commerce',
 next:['Show me your projects']},
{id:'svc-growth',t:'What I build',s:'#build',
 a:"Growth and e-commerce: Meta and TikTok ads, SEO, and Shopify stores built end to end, with reporting that drives decisions.",
 kw:'growth marketing ads advertising meta facebook instagram tiktok seo shopify store stores ecommerce e-commerce paid reporting digital',
 next:['What results have you delivered?','What is your experience?']},
{id:'stack',t:'AI stack',s:'#stack',
 a:"My core speciality is AI agents and automation: voice AI, LLM workflows and QA systems. I think of every agent as a chain of context, memory, reasoning, action and a QA gate that verifies the output, and I build and test each layer. Alongside that I build web apps, business systems and dashboards.",
 kw:'stack tech technology technologies tools tool skills skill llm ai agents memory reasoning context qa quality testing architecture layers',
 next:['Tell me about AI calling agents','What is JARVIS?']},
{id:'approach',t:'About me',s:'#about',
 a:"How I work:\n• Built for real work: useful voice agents, chatbots, business tools and automations that reduce repetitive tasks.\n• AI plus business thinking: engineering combined with marketing and e-commerce experience.\n• Clear, careful delivery: readable systems, testing, honest communication and improving the product after launch.\n• One partner, multiple skills: AI workflows, web systems and digital growth connected into one solution.",
 kw:'why approach work style process values quality reliable reliability delivery honest communication testing partner choose',
 next:['Are you available for projects?','Show me your projects']},

{id:'projects',t:'Projects',s:'#work',
 a:"My selected projects:\n• JARVIS: a personal AI operating system\n• Time Marketing: a property management workspace\n• Visecore: a receptionist service for local businesses\nPlus concept work in my agency portfolio, Time Digital.",
 kw:'projects project portfolio work works built made showcase examples samples case studies kaam projects',
 next:['What is JARVIS?','Show me Visecore','Tell me about the agency']},
{id:'jarvis',t:'Projects: JARVIS',s:'#work',
 a:"JARVIS is a voice-driven personal AI operating system with a live HUD, a 3D neural globe and nine specialist agents. It plans tasks, runs them, tracks progress and passes the work through a QA gate. It understands Roman Urdu commands and offers Normal, Advanced and Premium modes.",
 kw:'jarvis personal assistant operating system os hud globe neural nine 9 agents specialist plans qa gate roman urdu voice modes normal advanced premium',
 next:['Show me Visecore','Show me the property workspace']},
{id:'timeworkspace',t:'Projects: Time Marketing workspace',s:'#work',
 a:"Time Marketing is a rent and utility workspace for a real-estate business. It tracks units, tenants, payments and accounts, flags bills that have not been entered, and gives monthly reports with fast search by unit, tenant or CNIC.",
 kw:'time marketing property management workspace rent utility real estate units tenants payments accounts bills alerts reports cnic search',
 next:['Show me Visecore','What is JARVIS?']},
{id:'visecore',t:'Projects: Visecore',s:'#work',
 a:"Visecore is a website for a call-answering service that answers calls, handles enquiries and books customers in when a team is busy. Visitors can play full example calls for trades, dental, restaurant and driving businesses and watch each call go from answered to confirmed. It also has a missed-call revenue calculator and a booking link (visecore.com).",
 kw:'visecore receptionist local business call answering demo calculator missed bookings trades dental restaurant driving website visecore.com',
 next:['Tell me about AI calling agents','Show me the property workspace']},
{id:'agency',t:'Agency portfolio',s:'#agency',
 a:"Time Digital is my agency portfolio, a project by Time Marketing in Lahore, working worldwide. It includes concept work that is labelled as concept: Cafe Hunter (brand identity, campaign creative, digital ordering), Nexora Systems (B2B ERP campaign), Luxury Real Estate (premium property brand), NexMart (electronics storefront), Time Marketing CRM (leads, listings, site visits, deals) and an Al-Kabir Developers certificate of appreciation.",
 kw:'agency time digital concept concepts cafe hunter nexora luxury nexmart crm alkabir al-kabir developers certificate brand branding creative design',
 next:['What results have you delivered?','Show me your projects']},

{id:'results',t:'Results',s:'#results',
 a:"Figures as supplied on my dashboards:\n• Cafe Hunter: 2,754 purchases (1–31 Oct 2026) and a 4.37x average ROAS on Rs 186k spend.\n• Time Marketing real estate: 728 leads at Rs 137 per lead, with 1.80m reach.",
 kw:'roas roas average results result numbers metrics performance roas leads purchases reach spend cost proof dashboard ads campaign campaigns achievements impact kitne',
 next:['What was your experience at Vairt?','What are your growth skills?']},
{id:'exp',t:'Journey',s:'#path',
 a:"My experience so far:\n• Digital Marketing Executive, Vairt (1 year)\n• E-Commerce / Shopify Specialist, Freelance (1+ years)\n• Graphic Designer, Pixel2Graphic, Lahore (internship and freelance)\n• SEO Intern, DigitalMax (2021)\nI also have 3+ years in growth and automation overall.",
 kw:'experience career journey history jobs job worked work company companies resume cv roles role years tajurba',
 next:['What did you do at Vairt?','What results have you delivered?']},
{id:'exp-vairt',t:'Journey',s:'#path',
 a:"At Vairt I worked for 1 year as a Digital Marketing Executive. I led Meta Ads for real-estate lead generation and improved ROAS and lead quality with A/B tests and retargeting.",
 kw:'vairt digital marketing executive meta ads real estate lead generation roas ab test a/b retargeting',
 next:['What results have you delivered?','Tell me about your Shopify work']},
{id:'exp-shopify',t:'Journey',s:'#path',
 a:"As a freelance E-Commerce / Shopify Specialist (1+ years) I built and ran Shopify stores end to end, with ads, order workflows and customer service.",
 kw:'ecommerce e-commerce shopify specialist freelance store stores orders order workflows customer service',
 next:['What did you do at Vairt?','What are your growth skills?']},
{id:'exp-design',t:'Journey',s:'#path',
 a:"As a Graphic Designer at Pixel2Graphic in Lahore (internship and freelance) I created social creatives, banners and Meta-ready visuals.",
 kw:'graphic designer design pixel2graphic pixel social creatives banners visuals meta ready internship',
 next:['What is your experience?']},
{id:'exp-seo',t:'Journey',s:'#path',
 a:"In 2021 I was an SEO Intern at DigitalMax for two months, doing keyword research and on-page SEO.",
 kw:'seo intern internship digitalmax keyword research on-page onpage 2021',
 next:['What is your experience?']},
{id:'agent',t:'About this agent',s:'#top',
 a:"I'm Shoaib's portfolio agent. I answer only from the content of this portfolio (projects, skills, experience, results and contact). If something isn't covered I'll tell you honestly instead of guessing.",
 kw:'agent bot assistant you are what how work rag ai chatbot yourself ye kya',
 next:['What do you build?','Show me your projects']}
];

/* ======================= 2. TEXT PIPELINE ======================= */
var STOP=('a an the and or but of to in on at for with by from as is are was were be been being am do does did doing done have has had having can could will would shall should may might must i me my mine we us our you your yours he she it its they them their this that these those there here what which who whom whose when where why how ' +
 'tell show give explain describe please pls about more some any all also just very really much many get got want need like know knows hi hello hey ok okay yes no not so if then than too into out up down over again further once only own same such both each few most other' +
 ' something anything everything thing things interesting good best great nice cool detail details info information regarding related use used using' +
 ' whats ur u r hows thats whos bana banana banao banate bana dete deta dete kya hai hain ho hu hoon tha thi the ka ki ke ko se mein me main aap ap apka apki apke aapka aapki aapke tum tumhara tumhari mujhe mujhy batao bataiye btao bta bataye karte karta karti kar kro karo sakte sakta sakti kaise kese kyun kyon kis kon kaun koi aur ya bhi hi to par pe ne wo woh ye yeh iska uska unka mera meri mere hum').split(' ');
var STOPSET={};STOP.forEach(function(w){if(w)STOPSET[w]=1});
var URDU=('kya hai hain ka ki ke ko se mein aap ap apka apki apke aapka aapki aapke tum mujhe mujhy batao bataiye btao bta bataye karte karta karti kro karo sakte sakta kaise kese kyun kaun kon koi aur bhi wo ye mera meri mere hum kahan kitna kitne kitni kaam kam tajurba taleem rabta shehar naam').split(' ');
var URDUSET={};URDU.forEach(function(w){URDUSET[w]=1});

function stem(w){
  if(w.length>5&&/ies$/.test(w))return w.slice(0,-3)+'y';
  if(w.length>5&&/ing$/.test(w))return w.slice(0,-3);
  if(w.length>4&&/ed$/.test(w))return w.slice(0,-2);
  if(w.length>4&&/es$/.test(w)&&!/(ses|ces)$/.test(w))return w.slice(0,-2);
  if(w.length>3&&/s$/.test(w)&&!/(ss|us|is)$/.test(w))return w.slice(0,-1);
  return w;
}
function words(text){return (text.toLowerCase().replace(/[’']/g,'').match(/[a-z0-9]+(?:[.\-][a-z0-9]+)*/g)||[])}
function norm(text,keepStop){
  var out=[];
  words(text).forEach(function(w){
    var parts=w.split(/[.\-]/);
    parts.forEach(function(p){if(!p)return;if(!keepStop&&STOPSET[p])return;out.push(stem(p))});
    if(parts.length>1)out.push(stem(w.replace(/[.\-]/g,'')));
  });
  return out;
}

/* ======================= 3. INDEX (BM25) ======================= */
var docs=[],df={},avg=0,VOCAB={};
KB.forEach(function(k){
  var toks=norm(k.t+' '+k.a,true).filter(function(w){return !STOPSET[w]}).concat(norm(k.kw).concat(norm(k.kw)));  /* keywords count double */
  var tf={};toks.forEach(function(w){tf[w]=(tf[w]||0)+1;VOCAB[w]=1});
  Object.keys(tf).forEach(function(w){df[w]=(df[w]||0)+1});
  docs.push({k:k,tf:tf,len:toks.length});avg+=toks.length;
});
avg/=docs.length;
var N=docs.length,K1=1.4,B=.7;
function idf(w){var n=df[w]||0;return Math.log(1+(N-n+.5)/(n+.5))}
function bm25(q,d){
  var s=0;
  q.forEach(function(w){var f=d.tf[w];if(!f)return;s+=idf(w)*(f*(K1+1))/(f+K1*(1-B+B*d.len/avg))});
  return s;
}
function lev(a,b){
  if(Math.abs(a.length-b.length)>2)return 9;
  var p=[],i,j;for(j=0;j<=b.length;j++)p[j]=j;
  for(i=1;i<=a.length;i++){var c=[i];for(j=1;j<=b.length;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c}
  return p[b.length];
}
function fix(w){                                    /* typo tolerance against the knowledge-base vocabulary */
  if(VOCAB[w]||w.length<5)return w;
  var best=w,bd=w.length>=8?2:1,i,v,vs=Object.keys(VOCAB);
  for(i=0;i<vs.length;i++){v=vs[i];if(v.length<4)continue;var d=lev(w,v);if(d<=bd){bd=d-(d===bd?0:0);best=v;if(d===0)break}}
  return best;
}

/* ======================= 4. ASK ======================= */
var MIN_SCORE=1.6;
function nearStop(w){if(w.length<4)return false;for(var i=0;i<STOP.length;i++){var x=STOP[i];if(x.length>=4&&lev(w,x)<=(w.length>=5?2:1))return true}return false}
function isUrdu(q){var n=0;words(q).forEach(function(w){if(URDUSET[w])n++});return n>0}
function core(raw){
  var q=String(raw||'').trim().slice(0,300),urdu=isUrdu(q),low=q.toLowerCase();
  if(!q)return null;
  var direct=null;
  if(/^(who|what)\s*(are|r)\s*(you|u)\b|\b(introduce|tell me about|about)\s+(yourself|urself|you)\b|^who\s+is\s+(shoaib|this)|\b(aap|ap|tum)\s+kaun\b|\bapna\s+taruf\b/.test(low))direct='intro';
  else if(/(are you|r u|is this)\s+(an?\s+)?(ai|bot|robot|real|human)\b|\bhow do you work\b/.test(low))direct='agent';
  if(direct){var dk=KB.filter(function(k){return k.id===direct})[0];return {type:'answer',parts:[dk.a],sources:[{t:dk.t,s:dk.s}],act:false,next:dk.next.slice(0,3),score:9}}
  var toks=norm(q).map(fix),uniq=[],seen={};
  toks.forEach(function(w){if(!seen[w]){seen[w]=1;uniq.push(w)}});
  var matched=uniq.filter(function(w){return VOCAB[w]}),unmatched=uniq.filter(function(w){return !VOCAB[w]&&!nearStop(w)});
  uniq=uniq.filter(function(w){return VOCAB[w]||unmatched.indexOf(w)>-1});
  var skillIntent=/\b(know|knows|familiar|expert|expertise|proficient|experience (in|with)|work(ed)? with|use|using|can you|do you|have you|are you|aata|aati|ata|ati|aap\s+\w+\s+kar)\b/.test(low);
  var cov=uniq.length?matched.length/uniq.length:0;
  var ranked=docs.map(function(d){return {k:d.k,s:bm25(matched,d)}}).sort(function(a,b){return b.s-a.s});
  var top=ranked[0];

  /* grounded only: no matched topic, a named thing we have no record of, or too weak a match => honest fallback */
  if(!matched.length||top.s<MIN_SCORE||(unmatched.length&&(skillIntent||cov<.67)))
    return {type:'unknown',text:urdu
      ?"Ye meri skill ke baare mein abhi confirm nahi hai. Main ise foran seekh lunga."
      :"That isn't confirmed about my skill yet. I will learn it immediately.",
      hint:urdu?"Aap mujh se projects, services, experience, results ya contact ke baare mein pooch sakte hain.":"Meanwhile, ask me about my projects, services, experience, results or contact details.",
      question:q,next:['What do you build?','Show me your projects']};

  var picks=[top];
  if(ranked[1]&&ranked[1].s>=top.s*.85&&ranked[1].k.t!==top.k.t&&top.k.a.length+ranked[1].k.a.length<620)picks.push(ranked[1]);
  var next=[];picks.forEach(function(p){(p.k.next||[]).forEach(function(n){if(next.indexOf(n)<0&&next.length<3)next.push(n)})});
  return {type:'answer',parts:picks.map(function(p){return p.k.a}),
    sources:picks.map(function(p){return {t:p.k.t,s:p.k.s}}).filter(function(x,i,a){return a.findIndex(function(y){return y.t===x.t})===i}),
    act:picks.some(function(p){return p.k.act==='contact'}),next:next,score:top.s};
}


/* ======================= 3b. HUMAN TOUCH: salam, adab, shukria, nice to meet you, name memory ======================= */
var GREET_TOK=/^(assal\w*|asal\w*|salam\w*|salaam\w*|slam\w*|aoa|asa|alaikum\w*|alikum\w*|alaykum\w*|walaikum\w*|walekum\w*|wa|w|\w*rahmat\w*|\w*barak\w*|\w*barkat\w*|o|u|e|a|hi+|hey+|hello+|hy|helo|dear|sir|bhai|ji|good|morning|afternoon|evening|subah|bakhair|bakhayr|and|you|there)$/;
var NAME_BAD={hai:1,hain:1,hoon:1,hun:1,hu:1,mera:1,naam:1,nam:1,is:1,my:1,name:1,the:1,and:1};
function cap(w){return w.charAt(0).toUpperCase()+w.slice(1)}
function part(h){return h<12?'morning':h<17?'afternoon':h<21?'evening':'night'}
var NEXT3=['What do you build?','Show me your projects','What results have you delivered?'];
function social(q,low,urdu,ctx){
  var c=low.replace(/[^a-z\s]/g,' ').replace(/\s+/g,' ').trim(),tk=c?c.split(' '):[],n=tk.length;
  var nm=ctx.name?', '+ctx.name:'',hr=typeof ctx.hour==='number'?ctx.hour:12,ask1=ctx.name?'':' Aap ka naam kya hai?';
  var m;
  /* a) greeting at the start: answer it politely, then carry on with whatever else was asked */
  if(tk.length&&(/^(assal\w*|asal\w*|salam\w*|salaam\w*|slam\w*|aoa|asa|hi+|hey+|hello+|hy|helo|good|subah|walaikum\w*|walekum\w*)$/.test(tk[0])||(tk[0]==='wa'&&/^(a?l+a?i+k+u?m|alaikum|alikum)/.test(tk[1]||'')))&&!(tk[0]==='good'&&!/^(morning|afternoon|evening)$/.test(tk[1]||''))){
    var k=0;while(k<tk.length&&GREET_TOK.test(tk[k]))k++;
    var rest=q.replace(/^[\s\S]*?/,'');rest=tk.slice(k).join(' ');
    var isSalam=/^(assal|asal|salam|salaam|slam|aoa|asa|walaikum|walekum|wa)/.test(tk[0]);
    var barakat=/barak|barkat/.test(c),gtime=/good (morning|afternoon|evening)/.test(c)&&c.match(/good (morning|afternoon|evening)/)[1];
    var lead=isSalam?(barakat?"Wa alaikum assalam wa rahmatullahi wa barakatuhu"+nm+"!":"Wa alaikum assalam"+nm+"!"):gtime?("Good "+gtime+nm+"!"):("Hello"+nm+"!");
    if(!rest){
      var body=isSalam?" Khush aamdeed! Main Shoaib ka portfolio agent hoon. Aap mujh se unke projects, skills, experience, results ya contact ke baare mein pooch sakte hain."+ask1
        :" I'm Shoaib's portfolio agent. Ask me about my projects, skills, experience, results or how to contact me."+(ctx.name?'':" May I know your name?");
      return {done:{type:'chat',text:lead+body,mood:'wave',next:NEXT3,askName:!ctx.name}};
    }
    return {rest:rest,lead:lead};
  }
  /* b) setting the visitor's name */
  m=c.match(/(?:my name is|call me|i am called|mera naam|mera nam|meri naam|name is)\s+([a-z]{2,20})(?:\s+([a-z]{2,20}))?/)||c.match(/^([a-z]{2,20})\s+(?:mera naam|mera nam|naam hai)\b/);
  if(m&&!NAME_BAD[m[1]]&&n<=7){var nmv=cap(m[1])+(m[2]&&!NAME_BAD[m[2]]&&!STOPSET[m[2]]?' '+cap(m[2]):'');return {done:nameReply(nmv)}}
  if(ctx.awaitingName&&n>=1&&n<=3&&tk.every(function(w){return w.length>=2&&w.length<=20&&!STOPSET[w]&&!NAME_BAD[w]&&!VOCAB[stem(w)]&&!VOCAB[w]})&&!/\b(thanks|bye|ok|okay|help|menu)\b/.test(c)){
    return {done:nameReply(tk.map(cap).join(' '))};
  }
  function nameReply(v){return {type:'chat',setName:v,mood:'happy',text:"Nice to meet you, "+v+"! Aap se mil kar bohat khushi hui. Main aap ki kya madad kar sakta hoon?",next:NEXT3}}
  if(n>9)return {};
  /* c) nice to meet you */
  if(/(nice|pleasure|glad|pleased|great|good)\s+to\s+(meet|see|know)\s+(you|u)|mil\s+kar\s+(khushi|acha|achha|accha|bohat|bahut)|aap\s+se\s+mil|khushi\s+hui/.test(c))
    return {done:{type:'chat',mood:'happy',text:"Nice to meet you too"+nm+"! Mujhe bhi aap se mil kar bohat khushi hui. Poochiye, main kya bata sakta hoon?",next:NEXT3}};
  /* h) goodbye */
  if(/^(bye|goodbye|good\s*bye|see\s+you|see\s+ya|take\s+care|allah\s*hafiz|khuda\s*hafiz|fi\s+amanillah|good\s+night|shab\s+bakhair|chalo\s+bye|ok\s+bye|bye\s+bye)\b/.test(c))
    return {done:{type:'chat',mood:'wave',act:'contact',text:"Allah Hafiz"+nm+"! Aane ka shukriya. Jab bhi zaroorat ho, main yahin hoon.",next:[]}};
  /* d) how are you */
  if(/how\s+are\s+(you|u)|how\s+r\s+(you|u)|how\s+is\s+it\s+going|hows\s+it\s+going|kaise\s+(ho|hain|hein|hen)|kese\s+(ho|hain)|aap\s+kaise|kya\s+hal|kia\s+hal|haal\s+chal|hal\s+chal|whats\s+up|wassup|sup$/.test(c))
    return {done:{type:'chat',mood:'happy',text:"Alhamdulillah, main bilkul theek hoon, shukriya! Aap kaise hain"+nm+"?",next:NEXT3}};
  if(n<=7&&/^(i\s*a?m\s+|im\s+|main\s+|mein\s+)?(fine|good|great|well|alright|theek|thik|bilkul theek|bilkul thik)\b|\balhamdulillah\b|\btheek\s+(hoon|hun|hu|hai)\b|\bthik\s+(hoon|hun|hu|hai)\b/.test(c)&&!VOCAB[stem(tk[tk.length-1])])
    return {done:{type:'chat',mood:'happy',text:"Ye sun kar bohat acha laga"+nm+"! Alhamdulillah. Bataiye, aaj main kya madad kar sakta hoon?",next:NEXT3}};
  /* e) thanks (shukria / jazakallah) */
  if(/\b(thanks?|thank\s+you|thx|ty|shukr\w*|shukar\w*|jazak\w*|meherbani|meharbani|mehrbani|appreciate)\b/.test(c)&&n<=8){
    var jz=/jazak/.test(c);
    return {done:{type:'chat',mood:'happy',text:jz?"Wa iyyaka! Jazakallahu khairan"+nm+". Aap ki khidmat mein hazir hoon.":"Aap ka bohat shukriya"+nm+"! Aap ki khidmat mein hazir hoon. Aur kuch poochna ho to zaroor bataiye.",next:['How can I contact you?'].concat(NEXT3.slice(0,2))}};
  }
  /* f) sorry */
  if(/\b(sorry|apologi[sz]e|maaf\w*|mazrat|my\s+bad)\b/.test(c)&&n<=7)
    return {done:{type:'chat',mood:'happy',text:"Koi baat nahi"+nm+", bilkul fikar na karein! Aap befikar hokar poochiye.",next:NEXT3}};
  /* g) compliments */
  if(n<=7&&/(mashallah|masha\s*allah|machallah|maashaallah|well\s+done|great\s+(work|job)|good\s+(work|job)|nice\s+(work|job|portfolio|site|website)|awesome|amazing|impressive|zabardast|kamaal|kamal|bahut\s+khoob|bohat\s+khoob|bohat\s+(acha|achha|accha)|bahut\s+(acha|achha|accha)|love\s+(it|this)|excellent|brilliant|superb|beautiful|wow)/.test(c))
    return {done:{type:'chat',mood:'happy',act:'contact',text:"Shukriya"+nm+"! Ye sun kar bohat khushi hui. Agar aap Shoaib ke saath kaam karna chahte hain to neeche se seedha rabta kar sakte hain.",next:['Show me your projects','What results have you delivered?']}};
  /* i) who are you / my name */
  if(/(what\s+is|whats|what\s+s)?\s*(your|ur)\s+name|tumhara\s+naam|tera\s+naam|(aap\s*ka|apka|aapka)\s+(naam|nam)|naam\s+kya\s+hai|what\s+should\s+i\s+call\s+you/.test(c)&&n<=7)
    return {done:{type:'chat',mood:'happy',text:"Mera naam Sho-Bot hai, main Shoaib ka portfolio agent hoon."+(ctx.name?" Aap ka naam "+ctx.name+" hai, nice to meet you!":ask1),next:NEXT3,askName:!ctx.name}};
  /* j) help / menu */
  if(/^(help|menu|options|help me|madad|what can you do|what do you know|kya kar sakte ho|kya kar sakte hain|aap kya kar sakte hain)$/.test(c))
    return {done:{type:'chat',mood:'wave',text:"Main Shoaib ke portfolio ke baare mein bata sakta hoon:\n• Services aur skills\n• Projects (JARVIS, Time Marketing, Visecore)\n• Experience aur education\n• Results aur ads ke numbers\n• Contact aur availability\nJo cheez portfolio mein confirm nahi, main saaf bata deta hoon.",next:NEXT3}};
  /* k) small acknowledgements */
  if(/^(ok|okay|k|kk|acha|achha|accha|theek hai|thik hai|hmm+|hm+|alright|sure|got it|samajh gaya|i see|yes|yeah|haan|han|ji|ji haan|ji han|cool|nice|great|good)$/.test(c))
    return {done:{type:'chat',mood:'happy',text:"Ji"+nm+"! Aap aur kya jaanna chahenge?",next:NEXT3}};
  return {};
}
function ask(raw,ctx){
  ctx=ctx||{};
  var q=String(raw||'').trim().slice(0,300);if(!q)return null;
  var low=q.toLowerCase(),sc=social(q,low,isUrdu(q),ctx);
  if(sc.done)return sc.done;
  var r;
  if(sc.rest){r=core(sc.rest);if(r){r.lead=sc.lead;if(!r.mood)r.mood=r.type==='unknown'?'confused':'happy';}return r}
  r=core(q);if(r&&!r.mood)r.mood=r.type==='unknown'?'confused':r.type==='answer'?'happy':'wave';
  return r;
}

var API={ask:ask,kb:KB,version:2};
if(typeof module!=='undefined'&&module.exports){module.exports=API}
root.ShoaibAgent=API;
if(typeof document==='undefined')return;

/* ======================= 5. WIDGET UI: robot launcher, moods, polite welcome ======================= */
var EMAIL='muhammadshoaibhakim@gmail.com',PHONE='+923126445451';
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function el(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}
function sget(k){try{return sessionStorage.getItem(k)}catch(e){return null}}
function sset(k,v){try{sessionStorage.setItem(k,v)}catch(e){}}

/* the robot: head + face screen + eyes + antenna + waving arm. Mood is set by [data-mood] on .sa (CSS does the rest) */
var ROBOT='<svg class="rb" viewBox="0 0 64 64" aria-hidden="true" focusable="false">'+
 '<g class="rb-ant"><path d="M32 15V8" stroke="#9fb0e6" stroke-width="2.4" stroke-linecap="round"/><circle class="rb-tip" cx="32" cy="6" r="3.6" fill="#E5A94D"/></g>'+
 '<g class="rb-arm"><rect x="50.5" y="45" width="6.5" height="14" rx="3.2" fill="#9fb0e6"/><circle cx="53.8" cy="59" r="3.2" fill="#c9d4f5"/></g>'+
 '<path d="M15 60c0-6 4-9.5 10-9.5h14c6 0 10 3.5 10 9.5z" fill="#9fb0e6"/>'+
 '<rect x="6.5" y="27" width="5" height="12" rx="2.5" fill="#9fb0e6"/><rect x="52.5" y="27" width="5" height="12" rx="2.5" fill="#9fb0e6"/>'+
 '<rect x="11" y="14" width="42" height="38" rx="15" fill="#fff" stroke="#c9d4f5" stroke-width="1.5"/>'+
 '<rect x="16.5" y="20" width="31" height="26" rx="10.5" fill="#172554"/>'+
 '<g class="rb-eyes"><ellipse class="e" cx="25.5" cy="31" rx="3.5" ry="4.4" fill="#5ee0ff"/><ellipse class="e er" cx="38.5" cy="31" rx="3.5" ry="4.4" fill="#5ee0ff"/>'+
 '<path class="he" d="M21.5 32.5q4-6 8 0M34.5 32.5q4-6 8 0" fill="none" stroke="#5ee0ff" stroke-width="2.4" stroke-linecap="round"/></g>'+
 '<circle class="ch" cx="21" cy="38.5" r="2.6" fill="#ff8fb1"/><circle class="ch" cx="43" cy="38.5" r="2.6" fill="#ff8fb1"/>'+
 '<path class="m m-smile" d="M27 39q5 4.2 10 0" fill="none" stroke="#5ee0ff" stroke-width="2.2" stroke-linecap="round"/>'+
 '<path class="m m-big" d="M26 38.2q6 9 12 0z" fill="#5ee0ff" stroke="#5ee0ff" stroke-width="1.4" stroke-linejoin="round"/>'+
 '<path class="m m-flat" d="M27.5 41h9" fill="none" stroke="#5ee0ff" stroke-width="2.2" stroke-linecap="round"/>'+
 '<ellipse class="m m-o" cx="32" cy="40.5" rx="2.3" ry="2.7" fill="none" stroke="#5ee0ff" stroke-width="2"/>'+
 '<text class="rb-q" x="45" y="14" font-family="Sora,Arial,sans-serif" font-size="13" font-weight="800" fill="#E5A94D">?</text>'+
 '<g class="rb-dots" fill="#E5A94D"><circle cx="43" cy="9" r="1.7"/><circle cx="48" cy="9" r="1.7"/><circle cx="53" cy="9" r="1.7"/></g></svg>';
function robotNode(cls){var d=el('span',cls||'rb-wrap');d.innerHTML=ROBOT;return d}

function timePart(){return part(new Date().getHours())}
function mount(){
  if(document.getElementById('sa'))return;
  var wrap=el('div','sa');wrap.id='sa';wrap.setAttribute('data-mood','idle');
  var fab=el('button','sa-fab');fab.type='button';fab.setAttribute('aria-expanded','false');fab.setAttribute('aria-controls','sa-panel');fab.setAttribute('aria-label',"Open chat with Shoaib's portfolio robot agent");
  fab.appendChild(robotNode('rb-wrap'));fab.appendChild(el('i','sa-fab-dot'));
  var hi=el('button','sa-hi');hi.type='button';hi.setAttribute('aria-hidden','true');hi.tabIndex=-1;
  hi.innerHTML='<b>Assalam-o-Alaikum! 👋</b><span>Kuch poochna hai? Main Shoaib ka agent hoon.</span>';
  var panel=el('section','sa-panel');panel.id='sa-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label',"Shoaib's portfolio agent");panel.setAttribute('aria-hidden','true');
  var head=el('header','sa-head');
  var av=robotNode('sa-av');
  var ti=el('div','sa-ti');ti.appendChild(el('b',null,'Sho-Bot · Portfolio agent'));ti.appendChild(el('small',null,'Online · answers only from this portfolio'));
  var x=el('button','sa-x','×');x.type='button';x.setAttribute('aria-label','Close chat');
  head.appendChild(av);head.appendChild(ti);head.appendChild(x);
  var msgs=el('div','sa-msgs');msgs.setAttribute('aria-live','polite');msgs.setAttribute('role','log');
  var chips=el('div','sa-chips');
  var form=el('form','sa-form');var inp=el('input');inp.type='text';inp.maxLength=300;inp.autocomplete='off';inp.setAttribute('aria-label','Type your message');inp.placeholder='Type your name or a question…';inp.enterKeyHint='send';
  var send=el('button','sa-send');send.type='submit';send.setAttribute('aria-label','Send');send.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  form.appendChild(inp);form.appendChild(send);
  var foot=el('p','sa-foot','Grounded in my portfolio notes. If it is not covered, I will say so.');
  panel.appendChild(head);panel.appendChild(msgs);panel.appendChild(chips);panel.appendChild(form);panel.appendChild(foot);
  wrap.appendChild(hi);wrap.appendChild(panel);wrap.appendChild(fab);document.body.appendChild(wrap);

  var openState=false,busy=false,started=false,typingTimer=0,moodT=0;
  var ctx={name:sget('sa_name')||'',awaitingName:false};
  function mood(m,ms){clearTimeout(moodT);wrap.setAttribute('data-mood',m);if(ms)moodT=setTimeout(function(){wrap.setAttribute('data-mood','idle')},ms)}
  function bottom(){msgs.scrollTo({top:msgs.scrollHeight,behavior:reduce?'auto':'smooth'})}
  function setChips(list){
    chips.textContent='';
    (list||[]).forEach(function(t){var b=el('button','sa-chip',t);b.type='button';b.addEventListener('click',function(){submit(t)});chips.appendChild(b)});
    chips.classList.toggle('on',!!(list&&list.length));
  }
  function bubble(who){var m=el('div','sa-m '+who);msgs.appendChild(m);return m}
  function lines(m,text,cls){text.split('\n').forEach(function(l){if(l)m.appendChild(el('p',cls||null,l))})}
  function go(sel){
    var t=document.querySelector(sel);if(!t)return;
    if(innerWidth<=640)toggle(false);
    setTimeout(function(){t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'})},innerWidth<=640?260:0);
  }
  function addActions(m,r){
    var box=el('div','sa-acts');
    if(r.type==='answer')r.sources.forEach(function(s){var b=el('button','sa-src','↗ '+s.t);b.type='button';b.addEventListener('click',function(){go(s.s)});box.appendChild(b)});
    if(r.act){
      var a=el('a','sa-src sa-hl','✉ Email me');a.href='mailto:'+EMAIL;box.appendChild(a);
      var p=el('a','sa-src','☎ Call');p.href='tel:'+PHONE;box.appendChild(p);
    }
    if(r.type==='unknown'){
      var a2=el('a','sa-src sa-hl','✉ Ask Shoaib directly');
      a2.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Question from your portfolio agent')+'&body='+encodeURIComponent('Hi Shoaib,\n\nYour portfolio agent could not answer this:\n"'+r.question+'"\n');
      box.appendChild(a2);
    }
    if(box.childNodes.length)m.appendChild(box);
  }
  function reveal(m,r){
    var spans=[];
    [].slice.call(m.querySelectorAll('p')).forEach(function(p){
      var t=p.textContent;p.textContent='';
      t.split(/(\s+)/).forEach(function(w){if(!w)return;var s=el('span','sa-w',w);p.appendChild(s);if(/\S/.test(w))spans.push(s)});
    });
    function finish(){addActions(m,r);setChips(r.next);busy=false;form.classList.remove('busy');bottom()}
    if(reduce||!spans.length){finish();return}
    var i=0,step=Math.max(14,Math.min(34,1100/spans.length));
    (function tick(){
      if(!openState){spans.forEach(function(s){s.className+=' on'});finish();return}
      var n=Math.min(spans.length,i+2);
      for(;i<n;i++)spans[i].className+=' on';
      bottom();
      if(i<spans.length)typingTimer=setTimeout(tick,step);else finish();
    })();
  }
  function reply(r){
    mood('think');
    var dots=el('div','sa-m a sa-typing');dots.innerHTML='<i></i><i></i><i></i>';msgs.appendChild(dots);bottom();
    setTimeout(function(){
      dots.remove();
      if(r.setName){ctx.name=r.setName;sset('sa_name',r.setName)}
      ctx.awaitingName=false;
      var m=bubble('a');
      if(r.lead)lines(m,r.lead,'sa-lead');
      if(r.type==='answer'){r.parts.forEach(function(p,i){lines(m,p);if(i<r.parts.length-1)m.appendChild(el('hr'))})}
      else{lines(m,r.text);if(r.hint)m.appendChild(el('p','sa-hint',r.hint))}
      if(r.type==='unknown'){try{var L=JSON.parse(localStorage.getItem('sa_unanswered')||'[]');L.push(r.question);localStorage.setItem('sa_unanswered',JSON.stringify(L.slice(-30)))}catch(e){}}
      if(r.askName)ctx.awaitingName=true;
      mood(r.mood||'happy',r.mood==='confused'?2800:2400);
      requestAnimationFrame(function(){m.classList.add('in')});
      reveal(m,r);
    },reduce?0:560);
  }
  function submit(text){
    text=String(text||'').trim();if(!text||busy)return;
    ctx.hour=new Date().getHours();
    var r=ask(text,ctx);if(!r)return;
    busy=true;form.classList.add('busy');setChips([]);
    var u=bubble('u');u.textContent=text;requestAnimationFrame(function(){u.classList.add('in')});
    inp.value='';bottom();reply(r);
  }
  function welcome(){
    var tp=timePart(),n=ctx.name;
    var m=bubble('a');
    lines(m,"Assalam-o-Alaikum"+(n?' '+n:'')+"! Good "+tp+".");
    lines(m,n?"Welcome back! Main Shoaib ka portfolio agent hoon. Aaj main kya madad kar sakta hoon?":"Nice to meet you! I'm Sho-Bot, Shoaib's portfolio agent. Aap ka naam kya hai?");
    requestAnimationFrame(function(){m.classList.add('in')});
    ctx.awaitingName=!n;
    setChips(NEXT3.concat(['How can I contact you?']));
    mood('wave',2600);
  }
  function toggle(on){
    openState=on==null?!openState:on;
    wrap.classList.toggle('open',openState);wrap.classList.remove('hi-on');
    fab.setAttribute('aria-expanded',String(openState));panel.setAttribute('aria-hidden',String(!openState));
    if(openState){
      if(!started){started=true;welcome()}else mood('wave',1600);
      if(innerWidth>640)setTimeout(function(){inp.focus({preventScroll:true})},380);
      document.documentElement.classList.add('sa-lock');
    }else{clearTimeout(typingTimer);mood('idle');document.documentElement.classList.remove('sa-lock');fab.focus({preventScroll:true})}
  }
  fab.addEventListener('click',function(){toggle()});
  hi.addEventListener('click',function(){toggle(true)});
  x.addEventListener('click',function(){toggle(false)});
  form.addEventListener('submit',function(e){e.preventDefault();submit(inp.value)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&openState)toggle(false)});
  if(window.visualViewport){
    var vv=visualViewport;
    var fit=function(){panel.style.setProperty('--sa-h',Math.round(vv.height)+'px');panel.style.setProperty('--sa-off',Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop))+'px')};
    vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit);fit();
  }
  /* eyes follow the pointer (mouse only) */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduce){
    var raf=0,px=0,py=0;
    document.addEventListener('pointermove',function(e){px=e.clientX;py=e.clientY;if(!raf)raf=requestAnimationFrame(function(){
      raf=0;var t=openState?head.querySelector('.sa-av'):fab,r=t.getBoundingClientRect(),dx=px-(r.left+r.width/2),dy=py-(r.top+r.height/2),d=Math.hypot(dx,dy)||1,k=Math.min(1,d/260);
      wrap.style.setProperty('--ex',(dx/d*2.6*k).toFixed(2));wrap.style.setProperty('--ey',(dy/d*2*k).toFixed(2));
    })},{passive:true});
  }
  /* polite hello: after a few seconds the robot waves and greets once per visit; it never opens the chat by itself */
  if(!sget('sa_hi')){setTimeout(function(){
    if(openState)return;sset('sa_hi','1');wrap.classList.add('hi-on');mood('wave',2600);
    setTimeout(function(){wrap.classList.remove('hi-on')},9000);
  },3500)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})(typeof window!=='undefined'?window:globalThis);
