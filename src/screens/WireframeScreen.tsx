import React from "react";

interface WireframeScreenProps {
  onClose: () => void;
}

const WireframeScreen: React.FC<WireframeScreenProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-4 border-b-2 border-black">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-black font-mono">
                STARLING AI
              </h1>
              <p className="text-sm text-gray-600 font-mono mt-1">
                Low-Fidelity Wireframes — K-5 Math Homework Helper
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-sm font-mono border-2 border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            >
              ← BACK
            </button>
          </div>
        </div>

        {/* User Flow Overview */}
        <div className="mb-12 p-4 border-2 border-black bg-gray-50">
          <h2 className="text-lg font-bold font-mono mb-4 border-b border-black pb-2">
            USER FLOW
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <FlowBox>Onboard</FlowBox>
            <Arrow />
            <FlowBox>Home</FlowBox>
            <Arrow />
            <FlowBox>Camera</FlowBox>
            <Arrow />
            <FlowBox>Process</FlowBox>
            <Arrow />
            <FlowBox>Results</FlowBox>
            <Arrow />
            <FlowBox>Tutor</FlowBox>
            <Arrow />
            <FlowBox>Practice</FlowBox>
            <Arrow />
            <FlowBox>Complete</FlowBox>
          </div>
        </div>

        {/* Wireframe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Screen 1: Onboarding */}
          <WireframeFrame number={1} title="ONBOARDING">
            <PhoneFrame>
              <div className="text-center space-y-3">
                <PlaceholderCircle size="lg" label="MASCOT" />
                <div className="space-y-1">
                  <TextLine width="60%" center />
                  <TextLine width="80%" center />
                </div>
                <PlaceholderBox height="32px" label="[NAME INPUT]" />
                <PlaceholderBox height="32px" label="[GRADE SELECT]" />
                <ButtonWire primary>CONTINUE</ButtonWire>
                <p className="text-[10px] text-gray-400 underline">skip</p>
              </div>
            </PhoneFrame>
            <Annotation>Multi-step wizard: Name → Grade → Parent email (opt)</Annotation>
          </WireframeFrame>

          {/* Screen 2: Home */}
          <WireframeFrame number={2} title="HOME">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <TextLine width="70%" />
                    <TextLine width="50%" light />
                  </div>
                  <PlaceholderCircle size="sm" label="🌱" />
                </div>
                <PlaceholderBox height="56px" label="[SCAN HOMEWORK — PRIMARY CTA]" filled />
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono text-gray-500 mb-1">THIS WEEK</p>
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                    <div><div className="font-bold">3</div><div className="text-gray-400">sheets</div></div>
                    <div><div className="font-bold">85%</div><div className="text-gray-400">acc</div></div>
                    <div><div className="font-bold">5</div><div className="text-gray-400">practice</div></div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <PlaceholderBox height="48px" className="flex-1" label="📄" />
                  <PlaceholderBox height="48px" className="flex-1" label="📄" />
                  <PlaceholderBox height="48px" className="flex-1" label="📄" />
                </div>
                <PlaceholderBox height="40px" label="[PRACTICE PROBLEMS]" />
              </div>
            </PhoneFrame>
            <Annotation>Dashboard with primary scan CTA, stats, recent work</Annotation>
          </WireframeFrame>

          {/* Screen 3: Camera */}
          <WireframeFrame number={3} title="CAMERA">
            <PhoneFrame>
              <div className="space-y-3">
                <CrossHatchBox height="120px" label="CAMERA VIEWFINDER" />
                <div className="flex justify-center items-center gap-4">
                  <PlaceholderCircle size="sm" label="⚡" />
                  <PlaceholderCircle size="lg" label="◉" />
                  <PlaceholderCircle size="sm" label="↻" />
                </div>
                <p className="text-[10px] text-center text-gray-400 underline">upload from gallery</p>
              </div>
            </PhoneFrame>
            <Annotation>Native camera access w/ flash, flip. File fallback.</Annotation>
          </WireframeFrame>

          {/* Screen 4: Processing */}
          <WireframeFrame number={4} title="PROCESSING">
            <PhoneFrame>
              <div className="text-center space-y-4">
                <PlaceholderCircle size="lg" label="🌱" dashed />
                <div>
                  <TextLine width="70%" center />
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded">
                    <div className="h-2 bg-gray-500 rounded w-2/3"></div>
                  </div>
                  <p className="text-[10px] text-gray-400">analyzing...</p>
                </div>
                <PlaceholderBox height="40px" label="[FUN FACT TIP]" />
              </div>
            </PhoneFrame>
            <Annotation>Loading state with animated mascot + rotating tips</Annotation>
          </WireframeFrame>

          {/* Screen 5: Results */}
          <WireframeFrame number={5} title="RESULTS">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="text-center py-2 border-b border-black">
                  <div className="inline-block px-3 py-1 border border-black">
                    <span className="text-lg font-bold">8/10</span>
                  </div>
                  <TextLine width="60%" center className="mt-1" />
                </div>
                <div className="space-y-1">
                  <ProblemRow correct num={1} />
                  <ProblemRow correct num={2} />
                  <ProblemRow correct={false} num={3} />
                  <ProblemRow correct num={4} />
                </div>
                <ButtonWire primary>GET HELP</ButtonWire>
              </div>
            </PhoneFrame>
            <Annotation>Score summary + problem list. Tap incorrect → tutor</Annotation>
          </WireframeFrame>

          {/* Screen 6: Problem Detail */}
          <WireframeFrame number={6} title="PROBLEM DETAIL">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span>← back</span>
                  <span>2/10</span>
                  <span>next →</span>
                </div>
                <div className="text-center py-4 border-2 border-black">
                  <p className="text-[10px] text-gray-400">PROBLEM</p>
                  <p className="text-xl font-mono font-bold">56 + 47 = ?</p>
                </div>
                <div className="flex gap-2">
                  <PlaceholderBox height="32px" className="flex-1" label="YOUR: 93" />
                  <PlaceholderBox height="32px" className="flex-1" label="✓ 103" filled />
                </div>
                <ButtonWire>TRY AGAIN</ButtonWire>
                <ButtonWire primary>GET HELP</ButtonWire>
              </div>
            </PhoneFrame>
            <Annotation>Shows student vs correct answer. Navigate problems.</Annotation>
          </WireframeFrame>

          {/* Screen 7: Tutoring */}
          <WireframeFrame number={7} title="AI TUTORING">
            <PhoneFrame>
              <div className="space-y-3">
                <PlaceholderBox height="28px" label="56 + 47 = ?" filled />
                <div className="space-y-2">
                  <ChatBubble bot>What's 6 + 7?</ChatBubble>
                  <ChatBubble>13!</ChatBubble>
                  <ChatBubble bot>Great! Now we regroup...</ChatBubble>
                </div>
                <div className="flex gap-1">
                  <PlaceholderBox height="28px" className="flex-1" label="[INPUT]" />
                  <PlaceholderBox height="28px" className="w-8" label="→" />
                </div>
              </div>
            </PhoneFrame>
            <Annotation>Socratic chat. Never gives answer. Step-by-step hints.</Annotation>
          </WireframeFrame>

          {/* Screen 8: Practice */}
          <WireframeFrame number={8} title="PRACTICE">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded">
                    <div className="h-1.5 bg-gray-500 rounded w-2/5"></div>
                  </div>
                  <span className="text-[10px]">2/5</span>
                </div>
                <div className="text-center py-3 border-2 border-black">
                  <p className="text-xl font-mono font-bold">67 + 28 = ?</p>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-mono border-b-2 border-black px-4">___</span>
                </div>
                <div className="grid grid-cols-3 gap-1 max-w-[120px] mx-auto">
                  {[1,2,3,4,5,6,7,8,9,'←',0,'✓'].map(k => (
                    <div key={k} className="h-6 border border-black flex items-center justify-center text-xs">{k}</div>
                  ))}
                </div>
                <p className="text-[10px] text-center text-gray-400 underline">need a hint?</p>
              </div>
            </PhoneFrame>
            <Annotation>Child-friendly keypad. Hint button. Immediate feedback.</Annotation>
          </WireframeFrame>

          {/* Screen 9: Completion */}
          <WireframeFrame number={9} title="COMPLETION">
            <PhoneFrame>
              <div className="text-center space-y-3">
                <div className="text-3xl">🎉</div>
                <div>
                  <TextLine width="60%" center />
                  <TextLine width="40%" center light />
                </div>
                <div className="flex justify-center gap-3">
                  <PlaceholderCircle size="sm" label="🔥" />
                  <PlaceholderCircle size="sm" label="⭐" />
                  <PlaceholderCircle size="sm" label="📚" />
                </div>
                <ButtonWire primary>SCAN MORE</ButtonWire>
                <p className="text-[10px] text-gray-400 underline">go home</p>
              </div>
            </PhoneFrame>
            <Annotation>Celebration + rewards: streak, XP, badges</Annotation>
          </WireframeFrame>

          {/* Screen 10: Progress */}
          <WireframeFrame number={10} title="PROGRESS">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="text-center py-2 border border-black">
                  <span className="text-xl">🔥</span>
                  <span className="font-bold ml-1">5 Day Streak</span>
                </div>
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono mb-1">WEEKLY</p>
                  <div className="h-12 flex items-end justify-around">
                    {[40,60,30,80,50,70,55].map((h,i) => (
                      <div key={i} className="w-3 bg-gray-400" style={{height:`${h}%`}}></div>
                    ))}
                  </div>
                </div>
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono mb-1">SKILLS</p>
                  <SkillBar label="Addition" percent={85} />
                  <SkillBar label="Subtraction" percent={70} />
                  <SkillBar label="Regrouping" percent={45} />
                </div>
              </div>
            </PhoneFrame>
            <Annotation>Gamification: streaks, charts, skill mastery</Annotation>
          </WireframeFrame>

          {/* Screen 11: Settings */}
          <WireframeFrame number={11} title="SETTINGS">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono mb-1">PROFILE</p>
                  <SettingsRow label="Name" value="Alex" />
                  <SettingsRow label="Grade" value="3rd" />
                </div>
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono mb-1">PREFERENCES</p>
                  <SettingsRow label="Sounds" toggle />
                  <SettingsRow label="Notifications" toggle />
                </div>
                <PlaceholderBox height="36px" label="[PARENT DASHBOARD →]" />
              </div>
            </PhoneFrame>
            <Annotation>Profile, prefs, parent access</Annotation>
          </WireframeFrame>

          {/* Screen 12: Parent Dashboard */}
          <WireframeFrame number={12} title="PARENT DASHBOARD">
            <PhoneFrame>
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-black">
                  <PlaceholderCircle size="sm" label="👧" />
                  <div>
                    <TextLine width="60%" />
                    <TextLine width="40%" light />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatBox label="Sheets" value="12" />
                  <StatBox label="Accuracy" value="87%" />
                </div>
                <div className="border border-black p-2">
                  <p className="text-[8px] font-mono mb-1">FOCUS AREAS</p>
                  <FocusItem>Regrouping</FocusItem>
                  <FocusItem>Word problems</FocusItem>
                </div>
                <p className="text-[10px] text-center text-gray-400 underline">email weekly report</p>
              </div>
            </PhoneFrame>
            <Annotation>Parent-only: detailed analytics, focus areas</Annotation>
          </WireframeFrame>
        </div>

        {/* Navigation Bar */}
        <div className="mt-12 border-2 border-black p-4">
          <h2 className="text-sm font-bold font-mono mb-4 border-b border-black pb-2">
            BOTTOM NAVIGATION (ALL SCREENS)
          </h2>
          <div className="flex justify-around items-end">
            {[
              { icon: '🏠', label: 'Home' },
              { icon: '📊', label: 'Progress' },
              { icon: '📷', label: 'Scan', primary: true },
              { icon: '✏️', label: 'Practice' },
              { icon: '⚙️', label: 'Settings' },
            ].map(item => (
              <div key={item.label} className={`text-center ${item.primary ? '-mt-3' : ''}`}>
                <div className={`w-10 h-10 border-2 border-black flex items-center justify-center text-lg ${item.primary ? 'bg-gray-200 rounded-full' : 'rounded'}`}>
                  {item.icon}
                </div>
                <p className="text-[10px] font-mono mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Design Notes */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="border-2 border-black p-4">
            <h3 className="font-bold font-mono text-sm mb-2 border-b border-black pb-1">COLOR PALETTE</h3>
            <div className="flex gap-2 flex-wrap">
              <ColorSwatch color="#4CAF50" label="Primary" />
              <ColorSwatch color="#2196F3" label="Secondary" />
              <ColorSwatch color="#FFC107" label="Accent" />
              <ColorSwatch color="#FF9800" label="Error*" />
            </div>
            <p className="text-[10px] text-gray-500 mt-2">*Orange instead of red for child-friendly errors</p>
          </div>
          <div className="border-2 border-black p-4">
            <h3 className="font-bold font-mono text-sm mb-2 border-b border-black pb-1">TYPOGRAPHY</h3>
            <p className="text-sm">Nunito / Nunito Sans</p>
            <p className="text-[10px] text-gray-500">Rounded, friendly, highly legible for K-5</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ===== Wireframe Components =====

const FlowBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-2 border-black px-2 py-1 bg-gray-100 font-bold">{children}</div>
);

const Arrow = () => <span className="text-black font-bold">→</span>;

const WireframeFrame: React.FC<{ number: number; title: string; children: React.ReactNode }> = ({ number, title, children }) => (
  <div className="border-2 border-black bg-white">
    <div className="border-b-2 border-black px-3 py-2 bg-gray-100">
      <p className="text-xs font-mono font-bold">{number}. {title}</p>
    </div>
    <div className="p-3">{children}</div>
  </div>
);

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-2 border-black rounded-lg p-3 bg-white mx-auto max-w-[200px]">
    <div className="w-12 h-1 bg-black rounded mx-auto mb-3"></div>
    {children}
    <div className="w-8 h-8 border-2 border-black rounded-full mx-auto mt-3"></div>
  </div>
);

const PlaceholderBox: React.FC<{ 
  height: string; 
  label?: string; 
  filled?: boolean; 
  className?: string 
}> = ({ height, label, filled, className = '' }) => (
  <div 
    className={`border border-black flex items-center justify-center text-[9px] font-mono text-gray-500 ${filled ? 'bg-gray-200' : 'bg-white'} ${className}`}
    style={{ height }}
  >
    {label}
  </div>
);

const CrossHatchBox: React.FC<{ height: string; label: string }> = ({ height, label }) => (
  <div 
    className="border-2 border-black flex items-center justify-center text-[10px] font-mono text-gray-600 relative overflow-hidden"
    style={{ height, background: 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.05) 4px, rgba(0,0,0,0.05) 8px)' }}
  >
    <span className="bg-white px-2">{label}</span>
  </div>
);

const PlaceholderCircle: React.FC<{ size: 'sm' | 'lg'; label: string; dashed?: boolean }> = ({ size, label, dashed }) => (
  <div 
    className={`border-2 ${dashed ? 'border-dashed' : 'border-solid'} border-black rounded-full flex items-center justify-center mx-auto ${
      size === 'lg' ? 'w-14 h-14 text-xl' : 'w-8 h-8 text-xs'
    }`}
  >
    {label}
  </div>
);

const TextLine: React.FC<{ width: string; center?: boolean; light?: boolean; className?: string }> = ({ width, center, light, className = '' }) => (
  <div 
    className={`h-2 ${light ? 'bg-gray-200' : 'bg-gray-400'} rounded ${center ? 'mx-auto' : ''} ${className}`}
    style={{ width }}
  />
);

const ButtonWire: React.FC<{ primary?: boolean; children: React.ReactNode }> = ({ primary, children }) => (
  <div className={`border-2 border-black py-2 text-center text-xs font-mono font-bold ${primary ? 'bg-gray-200' : 'bg-white'}`}>
    {children}
  </div>
);

const Annotation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] text-gray-500 italic mt-3 border-t border-dashed border-gray-300 pt-2">
    ↳ {children}
  </p>
);

const ProblemRow: React.FC<{ correct: boolean; num: number }> = ({ correct, num }) => (
  <div className="flex items-center gap-2 text-[10px] border border-gray-300 px-2 py-1">
    <span className={`w-4 h-4 border border-black rounded-full flex items-center justify-center text-[8px] ${correct ? 'bg-white' : 'bg-gray-300'}`}>
      {correct ? '✓' : '✗'}
    </span>
    <span className="font-mono flex-1">#{num} 24 + 38 = 62</span>
    <span>→</span>
  </div>
);

const ChatBubble: React.FC<{ bot?: boolean; children: React.ReactNode }> = ({ bot, children }) => (
  <div className={`text-[10px] p-2 border border-black max-w-[85%] ${bot ? 'bg-gray-100 rounded-tl-none' : 'bg-white ml-auto rounded-tr-none'}`}>
    {bot && <span className="text-[8px] text-gray-400">⭐ Starling:</span>}
    <p>{children}</p>
  </div>
);

const SkillBar: React.FC<{ label: string; percent: number }> = ({ label, percent }) => (
  <div className="flex items-center gap-2 text-[9px] mt-1">
    <span className="w-16 truncate">{label}</span>
    <div className="flex-1 h-1.5 bg-gray-200">
      <div className="h-full bg-gray-500" style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

const SettingsRow: React.FC<{ label: string; value?: string; toggle?: boolean }> = ({ label, value, toggle }) => (
  <div className="flex justify-between items-center text-[10px] py-1 border-b border-gray-200 last:border-0">
    <span>{label}</span>
    {toggle ? (
      <div className="w-6 h-3 border border-black rounded-full relative">
        <div className="absolute right-0.5 top-0.5 w-2 h-2 bg-black rounded-full"></div>
      </div>
    ) : (
      <span className="text-gray-500">{value}</span>
    )}
  </div>
);

const StatBox: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="border border-black p-2 text-center">
    <p className="text-lg font-bold">{value}</p>
    <p className="text-[9px] text-gray-500">{label}</p>
  </div>
);

const FocusItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-1 text-[10px] py-0.5">
    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
    {children}
  </div>
);

const ColorSwatch: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="text-center">
    <div className="w-8 h-8 border-2 border-black" style={{ backgroundColor: color }}></div>
    <p className="text-[8px] mt-1">{label}</p>
  </div>
);

export default WireframeScreen;
