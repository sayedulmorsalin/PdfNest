import { useState } from 'react';
import { Plus, Trash2, Calculator, Save, RefreshCcw, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const GRADES = [
  { label: 'A+ (4.0)', value: 4.0 },
  { label: 'A (3.75)', value: 3.75 },
  { label: 'A- (3.5)', value: 3.5 },
  { label: 'B+ (3.25)', value: 3.25 },
  { label: 'B (3.0)', value: 3.0 },
  { label: 'B- (2.75)', value: 2.75 },
  { label: 'C+ (2.5)', value: 2.5 },
  { label: 'C (2.25)', value: 2.25 },
  { label: 'D (2.0)', value: 2.0 },
  { label: 'F (0.0)', value: 0.0 },
];

export default function GpaCalculator() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: '', credit: 3, grade: 4.0 }
  ]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', credit: 3, grade: 4.0 }]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(subjects.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    subjects.forEach(s => {
      totalPoints += (parseFloat(s.grade) * parseFloat(s.credit));
      totalCredits += parseFloat(s.credit);
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const gpa = calculateGpa();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO 
        title="GPA Calculator (Bangladesh)" 
        description="Calculate your CGPA/GPA based on the Bangladesh (BD) grading system. Supports dynamic subject addition and credit weighting."
        canonical="/gpa-calculator"
      />

      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
          <Calculator className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">GPA Calculator</h1>
          <p className="text-muted-foreground text-sm">Bangladesh (BD) University/College Grading System.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex justify-between items-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Subject Details</span>
              <span>{subjects.length} Subjects</span>
            </div>
            <div className="p-6 space-y-4">
              {subjects.map((s, idx) => (
                <div key={s.id} className="grid grid-cols-12 gap-3 items-end animate-in slide-in-from-right-2 duration-300">
                  <div className="col-span-5 md:col-span-6 space-y-2">
                    {idx === 0 && <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Subject Name</label>}
                    <input
                      type="text"
                      placeholder="e.g. Mathematics"
                      value={s.name}
                      onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-purple-400/50 outline-none transition-all placeholder:text-muted-foreground/30 text-sm"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 space-y-2">
                    {idx === 0 && <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Credits</label>}
                    <input
                      type="number"
                      step="0.5"
                      value={s.credit}
                      onChange={(e) => updateSubject(s.id, 'credit', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-purple-400/50 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-3 space-y-2">
                    {idx === 0 && <label className="text-[10px] uppercase font-bold text-muted-foreground px-1">Grade</label>}
                    <select
                      value={s.grade}
                      onChange={(e) => updateSubject(s.id, 'grade', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-purple-400/50 outline-none transition-all text-sm appearance-none"
                    >
                      {GRADES.map(g => (
                        <option key={g.label} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 space-y-2 flex justify-center">
                    <button 
                      onClick={() => removeSubject(s.id)}
                      className="p-2.5 rounded-xl hover:bg-red-400/10 text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-white/5 border-t border-white/5">
              <button
                onClick={addSubject}
                className="flex items-center gap-2 text-sm font-bold text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Another Subject
              </button>
            </div>
          </div>
        </div>

        {/* Right: Result Summary */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="glass rounded-3xl p-8 text-center space-y-6 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-transparent pointer-none" />
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Your GPA is</p>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                  {gpa}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3 h-3" /> 
                  {parseFloat(gpa) >= 3.5 ? 'Excellent!' : parseFloat(gpa) >= 3.0 ? 'Great Job!' : 'Keep Going!'}
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Subjects</span>
                <span className="font-bold">{subjects.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Credits</span>
                <span className="font-bold">{subjects.reduce((acc, s) => acc + parseFloat(s.credit || 0), 0)}</span>
              </div>
              <button 
                onClick={() => setSubjects([{ id: 1, name: '', credit: 3, grade: 4.0 }])}
                className="w-full py-3 rounded-xl glass border-white/10 text-xs font-bold hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-3 h-3" /> Reset Calculator
              </button>
            </div>

            <div className="p-4 rounded-3xl bg-white/5 border border-white/5 text-[10px] text-muted-foreground/60 leading-relaxed italic">
              * Note: This calculator follows the standard 4.0 scale used by most Public and Private universities in Bangladesh including DU, BUET, NSU, and AIUB.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
