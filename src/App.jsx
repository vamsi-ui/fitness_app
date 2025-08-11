
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Level Up Fitness - Deployment-ready prototype (single-file App)
// Tailwind assumed. This app includes the 7-day plan and an editable JSON settings panel.
// Videos use /embed/ YouTube links so they work when hosted.

export default function App() {
  const starterUser = {
    name: "Hero",
    height: "5'10\"",
    weightKg: 81,
    rank: "Beginner",
    level: 1,
    xp: 120,
    xpToNext: 500,
    stats: { strength: 20, agility: 18, endurance: 22 },
  };

  const [user, setUser] = useState(starterUser);
  const [screen, setScreen] = useState("home"); // home | mission | challenge | profile | settings
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const defaultPlan = [
  {
    day: "Monday",
    title: "Upper Body - Push",
    type: "Mission",
    challenges: [
      { name: "Barbell Bench Press (4 sets)", video: "https://www.youtube.com/embed/hWbUlkb5Ms4", reward: "+STR +END" },
      { name: "Dumbbell Incline Press (3 sets)", video: "https://www.youtube.com/embed/IP4oeKh1Sd4", reward: "+STR" },
      { name: "Dumbbell Seated Shoulder Press (3 sets)", video: "https://www.youtube.com/embed/rO_iEImwHyo", reward: "+STR" },
      { name: "Dumbbell Lateral Raises", video: "https://www.youtube.com/embed/PzsMitRdI_8", reward: "+AGI" },
      { name: "Dumbbell Overhead Tricep Extension", video: "https://www.youtube.com/embed/nRiJVZDpdL0", reward: "+STR" },
    ],
  },
  {
    day: "Tuesday",
    title: "Lower Body & Core",
    type: "Mission",
    challenges: [
      { name: "Dumbbell Goblet Squats (4 sets)", video: "https://www.youtube.com/embed/Xjo_fY9Hl9w", reward: "+STR +END" },
      { name: "Dumbbell Romanian Deadlifts (3 sets)", video: "https://www.youtube.com/embed/hQgFixeXdZo", reward: "+STR +AGI" },
      { name: "Dumbbell Walking Lunges (3x per leg)", video: "https://www.youtube.com/embed/Pbmj6xPo-Hw", reward: "+AGI" },
      { name: "Calf Raises", video: "https://www.youtube.com/embed/baEXLy09Ncc", reward: "+END" },
      { name: "Plank", video: "https://www.youtube.com/embed/pvIjsG5Svck", reward: "+END" },
      { name: "Lying Leg Raises", video: "https://www.youtube.com/embed/Zr-PtqcpeWM", reward: "+END" },
    ],
  },
  {
    day: "Wednesday",
    title: "Active Recovery",
    type: "Recovery",
    challenges: [
      { name: "Rowing - 30 min", video: "https://www.youtube.com/embed/zQ82RYIFLN8", reward: "+END" },
      { name: "Full Body Stretch - 15 min", video: "https://www.youtube.com/embed/efG6BqYy_Qo", reward: "+END" },
    ],
  },
  {
    day: "Thursday",
    title: "Upper Body - Pull",
    type: "Mission",
    challenges: [
      { name: "Bent-Over Dumbbell Rows (4 sets)", video: "https://www.youtube.com/embed/IOOLhrkN_NI", reward: "+STR +END" },
      { name: "Single-Arm Dumbbell Rows (3 sets)", video: "https://www.youtube.com/embed/dFzUjzfih7k", reward: "+STR" },
      { name: "Dumbbell Bicep Curls (3 sets)", video: "https://www.youtube.com/embed/ykJmrZ5v0Oo", reward: "+STR" },
      { name: "Dumbbell Hammer Curls", video: "https://www.youtube.com/embed/BRVDS6HVR9Q", reward: "+STR" },
      { name: "Renegade Rows", video: "https://www.youtube.com/embed/qmZJhocQVlM", reward: "+STR +END" },
    ],
  },
  {
    day: "Friday",
    title: "Full Body Strength & Conditioning",
    type: "Boss",
    challenges: [
      { name: "Dumbbell Thrusters (3 sets)", video: "https://www.youtube.com/embed/-rHJkjHUbmo", reward: "+STR +AGI" },
      { name: "Push-ups (3 sets to failure)", video: "https://www.youtube.com/embed/I9fsqKE5XHo", reward: "+STR" },
      { name: "HIIT Rower Workout (3 rounds)", video: "https://www.youtube.com/embed/uqs9A0B6s9U", reward: "+AGI +END" },
    ],
  },
  {
    day: "Saturday",
    title: "Active Recovery / Mobility",
    type: "Recovery",
    challenges: [
      { name: "Rowing or Light Cardio - 30 min", video: "https://www.youtube.com/embed/z-v_iJ6U9hM", reward: "+END" },
      { name: "Mobility & Stretching", video: "https://www.youtube.com/embed/efG6BqYy_Qo", reward: "+END" },
    ],
  },
  {
    day: "Sunday",
    title: "Rest Day",
    type: "Rest",
    challenges: [
      { name: "Full Rest - Recovery", video: "", reward: "+25 XP (next day)" },
    ],
  },
];


  // editable plan stored in state so users can customize
  const [plan, setPlan] = useState(() => {
    // try to load from localStorage first
    try {
      const raw = localStorage.getItem("levelup_plan_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return defaultPlan;
  });

  function savePlan(updated) {
    setPlan(updated);
    try { localStorage.setItem("levelup_plan_v1", JSON.stringify(updated)); } catch (e) {}
  }

  function giveXP(amount) {
    setUser(u => {
      let newXP = u.xp + amount;
      let level = u.level;
      let xpToNext = u.xpToNext;
      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        level += 1;
        xpToNext = Math.round(xpToNext * 1.12);
      }
      return { ...u, xp: newXP, level, xpToNext };
    });
  }

  function logChallenge(ch) {
    // grant small xp and stats based on reward tags
    giveXP(20);
    const add = { strength:0, agility:0, endurance:0 };
    if (ch.reward.includes("STR")) add.strength += 1;
    if (ch.reward.includes("AGI")) add.agility += 1;
    if (ch.reward.includes("END")) add.endurance += 1;
    setUser(u => ({ ...u, stats: { strength: u.stats.strength+add.strength, agility: u.stats.agility+add.agility, endurance: u.stats.endurance+add.endurance } }));
  }

  function simulateLevelUp() {
    setShowLevelUp(true);
    giveXP(50);
    setTimeout(()=>setShowLevelUp(false), 1600);
  }

  // small particle bg (subtle)
  function ParticleBG(){ return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-900/20 to-black opacity-60" />
    </div>
  )}

  function Home(){
    return (
      <div className="min-h-screen p-6 text-slate-100 bg-gradient-to-b from-black via-slate-900 to-black relative">
        <ParticleBG />
        <header className="flex justify-between items-start">
          <div>
            <div className="text-sm text-sky-300">Level</div>
            <div className="text-2xl font-extrabold">{user.rank} • Lv {user.level}</div>
            <div className="text-xs text-slate-400">{user.name} • {user.height} • {user.weightKg} kg</div>
          </div>
          <div className="w-64">
            <div className="bg-slate-800/40 p-3 rounded-lg">
              <div className="text-xs text-slate-400">XP</div>
              <div className="w-full h-3 bg-slate-700 rounded-full mt-2 overflow-hidden"><div className="h-3 bg-sky-400 rounded-full" style={{width:`${(user.xp/user.xpToNext)*100}%`}}></div></div>
              <div className="text-xs text-slate-400 mt-1">{user.xp}/{user.xpToNext}</div>
            </div>
          </div>
        </header>

        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold text-sky-300">[!] Today's Mission: {plan[0].title}</div>
                <div className="text-xs text-slate-400 mt-1">Complete the mission to earn XP and level up.</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>{setSelectedDayIndex(0); setScreen('mission')}} className="px-4 py-2 bg-sky-500 rounded">Start Mission</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/30 p-4 rounded-lg"><div className="text-sm text-slate-300">Push-ups</div><div className="text-lg font-bold mt-2">0 / 100</div><div className="text-xs text-slate-400 mt-1">Incomplete</div></div>
              <div className="bg-slate-800/30 p-4 rounded-lg"><div className="text-sm text-slate-300">Squats</div><div className="text-lg font-bold mt-2">0 / 100</div><div className="text-xs text-slate-400 mt-1">Incomplete</div></div>
              <div className="bg-slate-800/30 p-4 rounded-lg"><div className="text-sm text-slate-300">Cardio</div><div className="text-lg font-bold mt-2">0 / 60 min</div><div className="text-xs text-slate-400 mt-1">Incomplete</div></div>
            </div>

            <div className="mt-6">
              <div className="text-slate-400 text-sm">Weekly Plan</div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                {plan.map((p,i)=>(
                  <div key={p.day} className="bg-slate-800/20 p-3 rounded-lg border border-slate-700">
                    <div className="text-sm text-sky-300 font-semibold">{p.day}</div>
                    <div className="text-xs text-slate-300">{p.title}</div>
                    <div className="mt-2 text-xs text-slate-400">{p.challenges.length} challenges</div>
                    <div className="mt-3 flex gap-2">
                      <button onClick={()=>{setSelectedDayIndex(i); setScreen('mission')}} className="text-xs px-3 py-1 bg-sky-600/80 rounded-md">Start</button>
                      <button onClick={()=>{setSelectedDayIndex(i); setScreen('profile')}} className="text-xs px-3 py-1 bg-slate-700/60 rounded-md">Preview</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          <aside className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="text-sky-300 font-bold">Stats</div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Strength</span><span>{user.stats.strength}</span></div>
              <div className="flex justify-between"><span>Agility</span><span>{user.stats.agility}</span></div>
              <div className="flex justify-between"><span>Endurance</span><span>{user.stats.endurance}</span></div>
            </div>

            <div className="mt-6">
              <div className="text-slate-400 text-xs">Achievements</div>
              <div className="mt-2 flex gap-2 flex-wrap"><div className="bg-slate-800/30 px-2 py-1 rounded">First Mission</div><div className="bg-slate-800/30 px-2 py-1 rounded">7-Day Streak</div></div>
            </div>

            <div className="mt-6"><button onClick={()=>setScreen('profile')} className="w-full px-4 py-2 bg-sky-500 rounded">Open Profile</button></div>
          </aside>
        </main>

        <footer className="mt-8 text-center text-xs text-slate-500">Level Up Fitness · Prototype</footer>

        <AnimatePresence>{showLevelUp && <LevelUp />}</AnimatePresence>
      </div>
    )
  }

  function Mission(){
    const day = plan[selectedDayIndex];
    return (
      <div className="min-h-screen p-6 text-slate-100 bg-gradient-to-b from-black via-slate-900 to-black relative">
        <ParticleBG />
        <div className="relative z-10">
          <button onClick={()=>setScreen('home')} className="text-slate-400 text-sm">← Back</button>
          <div className="mt-4">
            <div className="text-2xl font-bold text-sky-300">{day.title}</div>
            <div className="text-xs text-slate-400">{day.type} • {day.challenges.length} challenges</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
              {day.challenges.map(ch => (
                <motion.div key={ch.name} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-md mb-3">
                  <div>
                    <div className="font-semibold">{ch.name}</div>
                    <div className="text-xs text-slate-400">{ch.reward}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>{ setSelectedChallenge(ch); setScreen('challenge'); setIsVideoOpen(true); }} className="px-3 py-1 bg-sky-500 rounded text-xs">▶ Guide</button>
                    <button onClick={()=>{ logChallenge(ch); }} className="px-3 py-1 bg-emerald-500 rounded text-xs">Log</button>
                  </div>
                </motion.div>
              ))}
            </div>

            <aside className="bg-slate-800/20 p-4 rounded-lg border border-slate-700">
              <div className="text-sm text-sky-300 font-semibold">Mission Rewards</div>
              <div className="mt-3 text-xs text-slate-400">Complete all challenges: +100 XP +Achievement</div>
              <div className="mt-4"><button onClick={()=>{ giveXP(10); }} className="px-3 py-2 bg-sky-500 rounded">Claim Mini Reward</button></div>
            </aside>
          </div>
        </div>

        <AnimatePresence>{showLevelUp && <LevelUp />}</AnimatePresence>
      </div>
    )
  }

  function Challenge(){
    const ch = selectedChallenge;
    if(!ch) return null;
    return (
      <div className="min-h-screen p-6 text-slate-100 bg-gradient-to-b from-black via-slate-900 to-black relative">
        <ParticleBG />
        <div className="relative z-10">
          <button onClick={()=>setScreen('mission')} className="text-slate-400 text-sm">← Back</button>
          <div className="mt-4">
            <div className="text-2xl font-bold text-sky-300">{ch.name}</div>
            <div className="text-xs text-slate-400">{ch.reward}</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <div className="text-slate-300 text-sm">Guide</div>
              {isVideoOpen ? (
                ch.video ? (
                  <div className="mt-3 aspect-video bg-black rounded overflow-hidden border border-slate-800">
                    <iframe className="w-full h-full" src={ch.video} title={ch.name} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
                  </div>
                ) : <div className="mt-3 p-8 rounded bg-slate-800/30 text-slate-400">No video available</div>
              ) : <div className="mt-3 p-8 rounded bg-slate-800/30 text-slate-400">Tap Play to view guide</div>}

              <div className="mt-4 flex gap-3">
                <button onClick={()=>{ logChallenge(ch); }} className="px-4 py-2 bg-emerald-500 rounded">Log</button>
                <button onClick={()=>{ simulateLevelUp(); }} className="px-4 py-2 bg-rose-500 rounded">Simulate Level Up</button>
              </div>
            </div>

            <aside className="bg-slate-800/20 p-4 rounded-lg border border-slate-700">
              <div className="text-sky-300 font-semibold">Live</div>
              <div className="mt-3 text-sm text-slate-300">XP: {user.xp} • Lv {user.level}</div>
              <div className="mt-3 text-sm text-slate-300">STR: {user.stats.strength} • AGI: {user.stats.agility} • END: {user.stats.endurance}</div>
            </aside>
          </div>
        </div>

        <AnimatePresence>{showLevelUp && <LevelUp />}</AnimatePresence>
      </div>
    )
  }

  function Profile(){
    return (
      <div className="min-h-screen p-6 text-slate-100 bg-gradient-to-b from-black via-slate-900 to-black relative">
        <ParticleBG />
        <div className="relative z-10">
          <button onClick={()=>setScreen('home')} className="text-slate-400 text-sm">← Back</button>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900/30 p-6 rounded-2xl border border-slate-800">
              <div className="text-2xl font-bold text-sky-300">{user.name}</div>
              <div className="text-sm text-slate-400">Lv {user.level} • XP {user.xp}/{user.xpToNext}</div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-slate-800/20 p-4 rounded"><div className="text-xs text-slate-400">Strength</div><div className="text-xl font-semibold">{user.stats.strength}</div></div>
                <div className="bg-slate-800/20 p-4 rounded"><div className="text-xs text-slate-400">Agility</div><div className="text-xl font-semibold">{user.stats.agility}</div></div>
                <div className="bg-slate-800/20 p-4 rounded"><div className="text-xs text-slate-400">Endurance</div><div className="text-xl font-semibold">{user.stats.endurance}</div></div>
              </div>

              <div className="mt-6">
                <div className="text-sm text-slate-300">Mission History</div>
                <div className="mt-3 h-36 rounded bg-slate-800/20 flex items-center justify-center text-slate-400">(History placeholder)</div>
              </div>
            </div>

            <aside className="bg-slate-800/20 p-6 rounded-2xl border border-slate-700">
              <div className="text-sm text-sky-300 font-semibold">Achievements</div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <div className="bg-slate-900/40 p-2 rounded">First Mission</div>
                <div className="bg-slate-900/40 p-2 rounded">7-Day Streak</div>
                <div className="bg-slate-900/40 p-2 rounded">Consistency</div>
              </div>
            </aside>
          </div>
        </div>
        <AnimatePresence>{showLevelUp && <LevelUp />}</AnimatePresence>
      </div>
    )
  }

  function Settings(){
    const [editPlan, setEditPlan] = useState(JSON.stringify(plan, null, 2));
    return (
      <div className="min-h-screen p-6 text-slate-100 bg-gradient-to-b from-black via-slate-900 to-black relative">
        <ParticleBG />
        <div className="relative z-10">
          <button onClick={()=>setScreen('home')} className="text-slate-400 text-sm">← Back</button>
          <div className="mt-4">
            <div className="text-2xl font-bold text-sky-300">Settings</div>
            <div className="text-xs text-slate-400 mt-1">Customize your weekly plan (JSON). Save to persist locally.</div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea value={editPlan} onChange={(e)=>setEditPlan(e.target.value)} className="w-full h-96 p-3 bg-slate-800 rounded text-slate-100"></textarea>
            <div>
              <div className="mb-2 text-slate-300">Preview</div>
              <div className="bg-slate-900/30 p-4 rounded h-96 overflow-auto border border-slate-700">
                <pre className="text-xs text-slate-300">{editPlan}</pre>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>{ try{ const parsed=JSON.parse(editPlan); savePlan(parsed); alert('Saved'); }catch(e){ alert('Invalid JSON'); } }} className="px-3 py-2 bg-sky-500 rounded">Save Plan</button>
                <button onClick={()=>{ setEditPlan(JSON.stringify(defaultPlan, null, 2)); }} className="px-3 py-2 bg-slate-700 rounded">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function LevelUp(){
    return (
      <motion.div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <motion.div initial={{scale:0.6, opacity:0}} animate={{scale:1, opacity:1}} exit={{opacity:0}} className="bg-black/60 rounded-lg p-8 text-center border border-slate-700">
          <div className="text-5xl font-extrabold text-white">LEVEL UP!</div>
          <div className="text-slate-300 mt-2">You grew stronger — well done.</div>
        </motion.div>
      </motion.div>
    )
  }

  // Router
  return (
    <div className="font-sans">
      {screen==='home' && <Home/>}
      {screen==='mission' && <Mission/>}
      {screen==='challenge' && <Challenge/>}
      {screen==='profile' && <Profile/>}
      {screen==='settings' && <Settings/>}
    </div>
  )
}
