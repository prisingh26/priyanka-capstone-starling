import React from "react";

interface WireframeScreenProps {
  onClose: () => void;
}

const WireframeScreen: React.FC<WireframeScreenProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-2 border-slate-300 pb-4">
          <h1 className="text-2xl font-bold text-slate-800">Sprout – Wireframes</h1>
          <p className="text-slate-500">Low-fidelity wireframes for layout, hierarchy, and grouping</p>
          <button 
            onClick={onClose}
            className="mt-3 text-sm text-slate-500 hover:text-slate-800 underline"
          >
            ← Back to App
          </button>
        </div>

        {/* Frame 1: Onboarding */}
        <WireframeCard frameNumber={1} title="Onboarding – Welcome">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-slate-400 text-xs">
              Mascot
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-700">Hi there! I'm Sprout! 🌱</h2>
              <p className="text-slate-500 mt-1">I'm here to help you learn and grow!</p>
            </div>
            <WireframeButton primary>Let's Get Started!</WireframeButton>
            <button className="text-sm text-slate-400 underline">Skip for now</button>
          </div>
          <WireframeNote>Multi-step onboarding: Name → Grade → Parent Email (optional)</WireframeNote>
        </WireframeCard>

        {/* Frame 2: Home Screen */}
        <WireframeCard frameNumber={2} title="Home – Dashboard">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-bold text-slate-700">Welcome back, Alex! 👋</h2>
                <p className="text-sm text-slate-500">Ready to learn something new?</p>
              </div>
              <div className="w-12 h-12 border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-xs text-slate-400">
                🌱
              </div>
            </div>

            {/* Primary CTA */}
            <div className="border-2 border-slate-400 bg-slate-100 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 border border-slate-300 rounded-lg flex items-center justify-center">📷</div>
                <div className="flex-1">
                  <p className="font-bold text-slate-700">Scan Homework</p>
                  <p className="text-xs text-slate-500">Let's check your work together!</p>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </div>

            {/* Stats */}
            <WireframeGroup label="THIS WEEK">
              <div className="grid grid-cols-3 gap-4 text-center py-2">
                <div>
                  <p className="font-bold text-slate-700">3</p>
                  <p className="text-xs text-slate-500">Worksheets</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700">85%</p>
                  <p className="text-xs text-slate-500">Accuracy</p>
                </div>
                <div>
                  <p className="font-bold text-slate-700">5</p>
                  <p className="text-xs text-slate-500">Practice</p>
                </div>
              </div>
            </WireframeGroup>

            {/* Recent */}
            <WireframeGroup label="RECENT HOMEWORK">
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-20 border border-slate-300 rounded-lg p-2 text-center">
                    <div className="w-full h-10 bg-slate-100 rounded mb-1 flex items-center justify-center text-xs">📄</div>
                    <p className="text-xs text-slate-500">Jan {20 + i}</p>
                    <p className="text-xs font-bold text-slate-600">{75 + i * 5}%</p>
                  </div>
                ))}
              </div>
            </WireframeGroup>

            {/* Practice */}
            <div className="border border-slate-300 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">✏️</div>
              <div className="flex-1">
                <p className="font-medium text-slate-700">Practice Problems</p>
                <p className="text-xs text-slate-500">Regrouping, Fractions...</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>
          </div>
          <WireframeNote>Primary action is Scan Homework. Quick access to progress and practice.</WireframeNote>
        </WireframeCard>

        {/* Frame 3: Camera Screen */}
        <WireframeCard frameNumber={3} title="Camera – Capture Homework">
          <div className="space-y-4">
            <div className="h-48 border-2 border-dashed border-slate-400 rounded-lg flex items-center justify-center bg-slate-100">
              <div className="text-center text-slate-500">
                <p className="text-3xl mb-2">📷</p>
                <p className="text-sm">Camera Viewfinder</p>
                <p className="text-xs">(Live preview from device camera)</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-6 items-center">
              <div className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center text-xs">⚡</div>
              <div className="w-16 h-16 border-2 border-slate-400 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-slate-400 rounded-full"></div>
              </div>
              <div className="w-10 h-10 border border-slate-300 rounded-full flex items-center justify-center text-xs">🔄</div>
            </div>

            <button className="w-full text-center text-sm text-slate-500 underline">
              📁 Upload from Gallery
            </button>
          </div>
          <WireframeNote>Camera requires user gesture to activate. Fallback to file upload available.</WireframeNote>
        </WireframeCard>

        {/* Frame 4: Processing Screen */}
        <WireframeCard frameNumber={4} title="Processing – AI Analysis">
          <div className="text-center space-y-6 py-4">
            <div className="w-24 h-24 mx-auto border-2 border-dashed border-slate-400 rounded-full flex items-center justify-center text-slate-400">
              🌱 thinking
            </div>
            <div>
              <p className="font-bold text-slate-700">📖 Sprout is reading your homework...</p>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-slate-400 rounded-full"></div>
              </div>
              <p className="text-sm text-slate-500 mt-2">67% complete</p>
            </div>
            <div className="border border-slate-300 rounded-lg p-3 mx-auto max-w-xs">
              <p className="text-sm text-slate-600">💡 <strong>Fun fact:</strong> Making mistakes is how we learn!</p>
            </div>
          </div>
          <WireframeNote>Animated mascot + progress bar. Shows rotating fun facts while processing.</WireframeNote>
        </WireframeCard>

        {/* Frame 5: Results Screen */}
        <WireframeCard frameNumber={5} title="Results – Worksheet Summary">
          <div className="space-y-4">
            {/* Score Header */}
            <div className="text-center border-b border-slate-200 pb-4">
              <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-4 py-2">
                <span className="text-2xl font-bold text-slate-700">8/10</span>
                <span className="text-slate-500">correct</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Great job! Let's review a few problems.</p>
            </div>

            {/* Problems List */}
            <WireframeGroup label="PROBLEMS">
              <div className="space-y-2">
                {[
                  { num: 1, problem: "24 + 38 = 62", correct: true },
                  { num: 2, problem: "45 - 27 = 18", correct: true },
                  { num: 3, problem: "56 + 47 = 93", correct: false },
                ].map((item) => (
                  <div key={item.num} className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${item.correct ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      {item.correct ? '✓' : '✗'}
                    </span>
                    <span className="flex-1 font-mono text-sm text-slate-700">{item.problem}</span>
                    <span className="text-slate-400 text-xs">→</span>
                  </div>
                ))}
              </div>
            </WireframeGroup>

            <WireframeButton primary>Get Help with Mistakes</WireframeButton>
          </div>
          <WireframeNote>Shows score + problem list. Incorrect answers highlighted for tutoring.</WireframeNote>
        </WireframeCard>

        {/* Frame 6: Tutoring Screen */}
        <WireframeCard frameNumber={6} title="Tutoring – AI Chat">
          <div className="space-y-4">
            {/* Problem Header */}
            <div className="bg-slate-100 rounded-lg p-3">
              <p className="text-xs text-slate-500 uppercase">Working on</p>
              <p className="font-mono font-bold text-slate-700">56 + 47 = ?</p>
            </div>

            {/* Chat Messages */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center text-xs">🌱</div>
                <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm text-slate-700">Let's work through this together! What do you get when you add 6 + 7?</p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="bg-slate-200 rounded-lg rounded-tr-none p-3 max-w-[80%]">
                  <p className="text-sm text-slate-700">13!</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 border border-slate-300 rounded-full flex items-center justify-center text-xs">🌱</div>
                <div className="bg-slate-100 rounded-lg rounded-tl-none p-3 max-w-[80%]">
                  <p className="text-sm text-slate-700">Great! Now we need to regroup...</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <div className="flex-1 border border-slate-300 rounded-lg p-2 text-sm text-slate-400">
                Type your answer...
              </div>
              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">→</div>
            </div>
          </div>
          <WireframeNote>Socratic-style tutoring. Mascot guides step-by-step. Never gives answer directly.</WireframeNote>
        </WireframeCard>

        {/* Frame 7: Practice Screen */}
        <WireframeCard frameNumber={7} title="Practice – Problem Solving">
          <div className="space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-slate-400 rounded-full"></div>
              </div>
              <span className="text-sm text-slate-500">2/5</span>
            </div>

            {/* Problem */}
            <div className="bg-slate-100 rounded-lg p-6 text-center">
              <p className="text-xs text-slate-500 uppercase mb-2">Solve</p>
              <p className="text-3xl font-mono font-bold text-slate-700">67 + 28 = ?</p>
            </div>

            {/* Answer Input */}
            <div className="text-center">
              <div className="inline-block border-2 border-slate-400 rounded-lg px-8 py-3">
                <span className="text-2xl font-mono text-slate-400">___</span>
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '✓'].map((key) => (
                <div key={key} className="h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-600 font-medium">
                  {key}
                </div>
              ))}
            </div>

            <button className="w-full text-center text-sm text-slate-500 underline">
              💡 I need a hint
            </button>
          </div>
          <WireframeNote>Child-friendly number pad. Hints available. Immediate feedback on submit.</WireframeNote>
        </WireframeCard>

        {/* Frame 8: Completion Screen */}
        <WireframeCard frameNumber={8} title="Completion – Celebration">
          <div className="text-center space-y-6 py-4">
            <div className="text-4xl">🎉</div>
            <div>
              <h2 className="text-xl font-bold text-slate-700">You're a Math Star!</h2>
              <p className="text-slate-500 mt-1">You got 4 out of 5 correct!</p>
            </div>
            
            <div className="flex justify-center gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-xl">
                    {i === 1 ? '🔥' : i === 2 ? '⭐' : '📚'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{i === 1 ? '3 day streak' : i === 2 ? '+50 XP' : 'New skill!'}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <WireframeButton primary>Check More Homework</WireframeButton>
              <button className="text-sm text-slate-500 underline">Go Home</button>
            </div>
          </div>
          <WireframeNote>Confetti animation. Shows streaks, XP, achievements. Encourages next action.</WireframeNote>
        </WireframeCard>

        {/* Frame 9: Progress Screen */}
        <WireframeCard frameNumber={9} title="Progress – Learning Journey">
          <div className="space-y-4">
            {/* Streak */}
            <div className="bg-slate-100 rounded-lg p-4 text-center">
              <p className="text-3xl mb-1">🔥</p>
              <p className="text-2xl font-bold text-slate-700">5 Day Streak!</p>
              <p className="text-sm text-slate-500">Keep it up!</p>
            </div>

            {/* Chart placeholder */}
            <WireframeGroup label="WEEKLY PROGRESS">
              <div className="h-32 border border-slate-200 rounded-lg flex items-end justify-around p-2">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={day} className="text-center">
                    <div 
                      className="w-6 bg-slate-300 rounded-t"
                      style={{ height: `${20 + Math.random() * 60}px` }}
                    ></div>
                    <p className="text-xs text-slate-500 mt-1">{day}</p>
                  </div>
                ))}
              </div>
            </WireframeGroup>

            {/* Skills */}
            <WireframeGroup label="SKILLS">
              <div className="space-y-2">
                {['Addition', 'Subtraction', 'Regrouping'].map((skill) => (
                  <div key={skill} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-24">{skill}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400 rounded-full" style={{ width: `${50 + Math.random() * 40}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </WireframeGroup>
          </div>
          <WireframeNote>Gamification: streaks, charts, skill progress. Motivates continued learning.</WireframeNote>
        </WireframeCard>

        {/* Frame 10: Settings */}
        <WireframeCard frameNumber={10} title="Settings – Profile & Preferences">
          <div className="space-y-4">
            <WireframeGroup label="PROFILE">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Name</span>
                  <span className="text-sm text-slate-700">Alex</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-sm text-slate-600">Grade</span>
                  <span className="text-sm text-slate-700">3rd Grade</span>
                </div>
              </div>
            </WireframeGroup>

            <WireframeGroup label="PREFERENCES">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600">Sound Effects</span>
                  <div className="w-10 h-5 bg-slate-300 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-slate-600">Notifications</span>
                  <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
              </div>
            </WireframeGroup>

            <div className="border border-slate-300 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">👨‍👩‍👧</span>
                <div className="flex-1">
                  <p className="font-medium text-slate-700">Parent Dashboard</p>
                  <p className="text-xs text-slate-500">View detailed progress</p>
                </div>
                <span className="text-slate-400">→</span>
              </div>
            </div>
          </div>
          <WireframeNote>Profile editing, preferences, and parent access link.</WireframeNote>
        </WireframeCard>

        {/* Frame 11: Parent Dashboard */}
        <WireframeCard frameNumber={11} title="Parent Dashboard – Detailed Analytics">
          <div className="space-y-4">
            <div className="bg-slate-100 rounded-lg p-3 flex items-center gap-3">
              <span className="text-2xl">👧</span>
              <div>
                <p className="font-bold text-slate-700">Alex's Progress</p>
                <p className="text-xs text-slate-500">Last 30 days</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-700">12</p>
                <p className="text-xs text-slate-500">Worksheets</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-slate-700">87%</p>
                <p className="text-xs text-slate-500">Avg. Accuracy</p>
              </div>
            </div>

            <WireframeGroup label="AREAS TO FOCUS">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-slate-600">Regrouping with carrying</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  <span className="text-slate-600">Word problems</span>
                </div>
              </div>
            </WireframeGroup>

            <button className="w-full text-center text-sm text-slate-500 underline">
              📧 Email Weekly Report
            </button>
          </div>
          <WireframeNote>Parent-only view. Detailed stats, focus areas, email reports.</WireframeNote>
        </WireframeCard>

        {/* Navigation Note */}
        <div className="mt-8 border-t-2 border-slate-300 pt-6">
          <h2 className="text-lg font-bold text-slate-700 mb-3">Navigation Structure</h2>
          <div className="border border-slate-300 rounded-lg p-4 bg-white">
            <div className="flex justify-around text-center">
              {[
                { icon: '🏠', label: 'Home' },
                { icon: '📊', label: 'Progress' },
                { icon: '📷', label: 'Scan', primary: true },
                { icon: '✏️', label: 'Practice' },
                { icon: '⚙️', label: 'Settings' },
              ].map((item) => (
                <div key={item.label} className={`${item.primary ? '-mt-4' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${item.primary ? 'border-2 border-slate-400 bg-slate-100' : ''}`}>
                    {item.icon}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3 italic">
            Bottom navigation bar visible on all main screens. "Scan" is elevated as primary action.
          </p>
        </div>

      </div>
    </div>
  );
};

// Wireframe Components
const WireframeCard: React.FC<{ frameNumber: number; title: string; children: React.ReactNode }> = ({ frameNumber, title, children }) => (
  <div className="mb-8 border border-slate-300 rounded-lg bg-white overflow-hidden">
    <div className="bg-slate-100 border-b border-slate-300 px-4 py-2">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        Frame {frameNumber}: {title}
      </p>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const WireframeGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden">
    <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const WireframeButton: React.FC<{ primary?: boolean; children: React.ReactNode }> = ({ primary, children }) => (
  <button className={`w-full py-3 rounded-lg font-medium text-sm ${primary ? 'border-2 border-slate-400 bg-slate-100 text-slate-700' : 'border border-slate-300 text-slate-600'}`}>
    {children}
  </button>
);

const WireframeNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
    <p className="text-xs text-slate-400 italic">Note: {children}</p>
  </div>
);

export default WireframeScreen;
