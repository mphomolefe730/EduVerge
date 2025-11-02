import React, { useEffect, useState, useRef } from 'react';
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import confetti from 'canvas-confetti';
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = 'eduverge_onboarding_v1';

function saveState(partial) {
  const cur = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const merged = Object.assign({}, cur, partial);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
}
function getState() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
function resetState() { localStorage.removeItem(STORAGE_KEY); window.location.reload(); }

function confettiBurst(n = 120) {
  confetti({ particleCount: n, spread: 70, origin: { y: 0.6 } });
}

/* ----------------- Presentational / Small components ----------------- */
const Logo = () => (
  <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-extrabold">E</div>
);

const Badge = ({ children }) => (
  <span className="inline-block px-3 py-1 rounded-full bg-white border border-blue-50 text-blue-600 text-xs mr-2">{children}</span>
);

const Button = ({ children, variant = 'solid', onClick, className = '' }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold focus:outline-none';
  const solid = 'bg-blue-600 text-white hover:opacity-95';
  const ghost = 'bg-transparent border border-blue-100 text-blue-600';
  return (
    <button onClick={onClick} className={`${base} ${variant === 'ghost' ? ghost : solid} ${className}`}>{children}</button>
  );
};

/* ----------------- Feature components ----------------- */
function ProgressBar({ pct }){
  return (
    <div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-sm text-slate-500 mt-2"><div>Tour completion</div><div>{pct}%</div></div>
    </div>
  );
}

/* ----------------- Main App ----------------- */
export default function Dashboard(){
  const navigate = useNavigate();
  const [state, setState] = useState(getState);

  const [events, setEvents] = useState([
    { id:1, title:'Study Sprint: Data Structures', when:'Tomorrow • 18:00', rsvped:false },
    { id:2, title:'Live Q&A: Algorithms', when:'In 3 days • 16:00', rsvped:false },
    { id:3, title:'Peer Workshop: Project Planning', when:'Next week • 14:00', rsvped:false }
  ]);

  // ------------------- NEW: Invite Friend State -------------------
  const [inviteEmail, setInviteEmail] = useState('');
  const [sending, setSending] = useState(false);

  // ------------------- NEW: Invite Friend Handler -------------------
  const handleInviteClick = async () => {
    if (!inviteEmail) {
      alert("Please enter your friend’s email.");
      return;
    }

    setSending(true);

    try {
      const response = await fetch("http://localhost:5000/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Invite email sent! Your friend can now register using the link in their email.");
        setInviteEmail("");
      } else {
        alert("Failed to send invite: " + data.error);
      }
    } catch (err) {
      alert("Error sending invite: " + err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    // load persisted events RSVP
    const st = getState();
    if (st.events){
      setEvents(prev => prev.map(e => ({ ...e, rsvped: !!st.events[e.id] })));
    }
    // apply badges from storage
    if (st.badges && st.badges.length) {
      // no-op, badges come from state.badges
    }
    setState(st);
  }, []);

  useEffect(() => {
    // sync state to localStorage whenever state changes
    saveState(state);
  }, [state]);

  // compute progress
  const progressPct = Math.round((['quizDone','groupJoined','chatSent'].filter(k => state[k]).length / 3) * 100);

  function addBadge(name){
    const badges = Array.from(new Set([...(state.badges || []), name]));
    setState(prev => ({ ...prev, badges }));
    confettiBurst(80);
  }

  function startTour(){
    const steps = [
      { element: '#introPanel', intro: '<strong>Welcome to EduVerge</strong><div style="margin-top:8px">We believe learning is better together. This tour takes ~3 minutes.</div>' },
      { element: '#card-courses', intro: 'Courses — interactive lessons & quizzes. Open the sample course to try a mini-quiz.' },
      { element: '#card-groups', intro: 'Study groups — team up to learn faster. Join the sample group to earn a badge.' },
      { element: '#card-chat', intro: 'Chat — ask quick questions to peers & tutors. Send a message in demo chat.' },
      { element: '#card-progress', intro: 'Progress — track completion & badges here.' },
      { element: '#card-community', intro: 'Community — see leaderboards and upcoming events.' },
      { element: '#card-mission', intro: 'Mission — set a personal learning goal to stay focused.' },
      { intro: 'Mini challenge: Complete the sample quiz (open Course modal).' },
      { intro: 'Mini challenge: Join the sample group (click the group card button).' },
      { intro: 'Mini challenge: Send one message in the Demo Chat.' },
      { element:'#card-community', intro: 'Achievements & Leaderboard — friendly competition helps engagement.' },
      { element:'#card-community', intro: 'Mentorship — look for mentors or offer help to others.' },
      { element:'#card-community', intro: 'Events — join live sprints, workshops, and Q&A sessions.' },
      { element:'#card-mission', intro: 'Set a personal goal — we’ll remind you and recommend content.' },
      { intro: '<strong>Finish</strong><div style="margin-top:8px">You will receive the <em>Welcome Pioneer</em> badge and see a summary of your badges.</div>' }
    ];

    introJs().setOptions({ steps, showStepNumbers:false, exitOnOverlayClick:false, showBullets:false, nextLabel:'Next', prevLabel:'Back', doneLabel:'Finish' })
      .oncomplete(() => {
        if (!state.welcomeAwarded){ addBadge('Welcome Pioneer'); setState(prev => ({ ...prev, welcomeAwarded: true })); confettiBurst(220); }
      }).onexit(() => { setState(prev => ({ ...prev, skipped: true })); }).start();
  }

  /* ---------- Simplified handlers that just show alerts ---------- */
  function handleFeatureClick(featureName) {
    alert(`${featureName} feature would open here - this would navigate to the ${featureName} section in the full application`);
  }

  function submitQuiz(answer){
    alert('Quiz functionality would be handled in the full Courses component');
    setCourseOpen(false);
  }

  function toggleGroup(){
    alert('Study group functionality would be handled in the full Groups component');
  }

  function sendChat(){
    alert('Chat functionality would be handled in the full Chat component');
    setChatOpen(false);
  }

  function rsvpEvent(id){
    alert('Event RSVP functionality would be handled in the full Events component');
  }

  function submitMentor(role, note){
    alert('Mentorship functionality would be handled in the full Mentorship component');
    setMentorOpen(false);
  }

  function saveGoal(val){
    alert('Goal setting functionality would be handled in the full Profile component');
  }

  function exportState(){
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'eduverge_onboarding_state.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  function importState(file){
    if (!file) return;
    const reader = new FileReader(); reader.onload = (ev) => {
      try{ const data = JSON.parse(ev.target.result); localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); alert('Imported state. Page will reload to apply changes.'); setTimeout(()=> window.location.reload(), 300); }catch(err){ alert('Invalid JSON file.'); }
    };
    reader.readAsText(file);
  }

  /* ----------------- Render ----------------- */


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-7 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div>
              <div className="text-lg font-bold">EduVerge</div>
              <div className="text-sm text-slate-500">Interactive learning & peer tutoring</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div aria-live="polite" id="badgesContainer" className="flex items-center">
              {(state.badges || []).map((b,i)=> <Badge key={i}>{b}</Badge>)}
            </div>
            <Button onClick={startTour}>Start Tour</Button>
            <Button variant="ghost" onClick={() => { setState(prev=>({ ...prev, skipped: true })); alert('Tour skipped. You can start it anytime via "Start Tour".'); }}>Skip Tour</Button>
          </div>
        </header>

        <main>
          <section id="introPanel" className="bg-white rounded-xl p-6 shadow">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h2 className="text-xl font-bold">Welcome to EduVerge 👋</h2>
                <p className="text-sm text-slate-500 mt-2">We believe learning is better together. Unlock interactive lessons, join study groups, and track your progress.</p>
                <div className="mt-4">
                  <Badge>Collaboration</Badge>
                  <Badge>Curiosity</Badge>
                  <Badge>Growth</Badge>
                  <Badge>Support</Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-slate-500">New here?</div>
                <div className="mt-3"><Button onClick={startTour}>Begin your journey</Button></div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6" role="region" aria-label="Main features">
            <Button onClick={() => { navigate("/courses"); }}>
              <div id="card-courses">
                <h1>Courses</h1>
                <small  className="font-semibold">Interactive lessons, practice quizzes and code labs</small>
              </div>
            </Button>

            <Button onClick={() => { navigate("/studygroup"); }}>
              <div id="card-groups">
                <h1>Study groups</h1>
                <small className="font-semibold">Join a group, schedule sessions and share resources</small>
              </div>
            </Button>

            <Button onClick={() => { navigate("/chats");}}>
              <div id="card-chat">
                <h1>Chat</h1>
                <small className="font-semibold">Ask quick questions to peers & tutors</small>
              </div>
            </Button>

            <div id="card-progress" className="bg-white rounded-xl p-4 shadow">
              <div className="font-semibold">Progress</div>
              <div className="text-sm text-slate-500 mt-1">Complete the tasks below to fill the bar</div>
              <div className="mt-4"><ProgressBar pct={progressPct} /></div>
              <div className="text-xs text-slate-500 mt-3">Tip: Complete the sample quiz, join a group, and send a chat message to reach 100%.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
            <div id="card-community" className="lg:col-span-2 bg-white rounded-xl p-4 shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">Community & Growth</div>
                  <div className="text-sm text-slate-500 mt-2">Achievements & Leaderboard</div>
                </div>
              </div>

              <div className="mt-4 flex gap-6">
                <div className="flex-1">
                  <ul className="divide-y divide-slate-100">
                    <li className="py-2 flex justify-between"><span>Jane D.</span><strong>1200 pts</strong></li>
                    <li className="py-2 flex justify-between"><span>Ali K.</span><strong>1120 pts</strong></li>
                    <li className="py-2 flex justify-between"><span>You</span><strong>{800 + Math.round(progressPct * 2.5)} pts</strong></li>
                  </ul>
                </div>
                <div className="w-64">
                  <div className="text-sm text-slate-500">Upcoming Events</div>
                  <div className="mt-3 space-y-3">
                    {events.map(e => (
                      <div key={e.id} className="p-3 rounded-lg bg-white border border-slate-50 shadow-sm">
                        <div className="font-medium">{e.title}</div>
                        <div className="text-sm text-slate-500">{e.when}</div>
                        <div className="mt-2"><Button variant="ghost" onClick={() => { handleFeatureClick('Events'); }}>View Event</Button></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div id="card-mission" className="bg-white rounded-xl p-4 shadow">
              <div className="font-semibold">Mission & Goals</div>
              <div className="text-sm text-slate-500 mt-1">Our mission: Make learning interactive, collaborative and accessible to every student.</div>

              <div className="mt-4">
                <label className="text-sm text-slate-500">Set a personal goal (optional)</label>
                <input id="goalInput" defaultValue={state.goal || ''} className="w-full mt-2 px-3 py-2 border rounded-md" placeholder="e.g., Finish Python basics in 2 weeks" />
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" onClick={() => handleFeatureClick('Goal Setting')}>Save Goal</Button>
                </div>

                <div className="mt-4 text-sm text-slate-500">Invite friends to join EduVerge and learn together.</div>
                <div className="mt-3 flex gap-2">
                  <Button variant="ghost" onClick={() => handleFeatureClick('Invite Friends')}>Copy Invite Link</Button>
                  <Button variant="ghost" onClick={() => handleFeatureClick('Invite Friends')}>Invite by Email</Button>
                </div>
                <div className="text-sm text-slate-600 mt-3">{state.goal ? `✓ Goal saved: ${state.goal}` : ''}</div>
              </div>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}