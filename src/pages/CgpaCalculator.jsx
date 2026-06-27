import { useState } from 'react';
import { Plus, Trash2, Calculator, Save, RefreshCcw, Sparkles } from 'lucide-react';
import SEO, { buildFAQSchema } from '../components/SEO';
import FAQSection from '../components/FAQSection';
import RelatedTools from '../components/RelatedTools';

const faqs = [
  {
    q: "What grading system does this calculator use?",
    a: "This calculator uses the standard 4.0 grading scale adopted by the University Grants Commission (UGC) of Bangladesh. This is the official scale used by DU, BUET, NSU, AIUB, BRACU, and almost all public and private universities in Bangladesh."
  },
  {
    q: "How is CGPA calculated?",
    a: "CGPA (Cumulative Grade Point Average) is calculated by multiplying the grade points earned in each subject by the credit hours for that subject, adding all those values together, and then dividing by the total number of credit hours attempted."
  },
  {
    q: "What is the difference between GPA and CGPA?",
    a: "GPA (Grade Point Average) usually refers to the average of your grades for a single semester. CGPA refers to the cumulative average of your grades across all semesters you have completed."
  },
  {
    q: "Are my grades saved?",
    a: "No, PdfNest is a privacy-first platform. Your grades and subjects are processed entirely in your browser and are deleted the moment you close the tab or refresh the page."
  },
  {
    q: "How many subjects can I add?",
    a: "You can add an unlimited number of subjects! Just keep clicking the 'Add Another Subject' button for as many courses as you need to calculate."
  }
];

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

export default function CgpaCalculator() {
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

  const calculateCgpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    subjects.forEach(s => {
      totalPoints += (parseFloat(s.grade) * parseFloat(s.credit));
      totalCredits += parseFloat(s.credit);
    });

    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
  };

  const cgpa = calculateCgpa();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SEO 
        title="CGPA Calculator (Bangladesh Grading System)" 
        description="Free online CGPA calculator for Bangladesh university students. Supports DU, BUET, NSU, AIUB and more. Calculate CGPA with credit weighting easily."
        canonical="/cgpa-calculator"
        keywords="CGPA calculator BD, Bangladesh CGPA calculator, calculate CGPA DU, BUET GPA calculator, university CGPA calculator"
        schemas={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PdfNest CGPA Calculator",
            "operatingSystem": "Web",
            "applicationCategory": "EducationalApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": "Bangladesh Grading System, Dynamic Subject Addition, Credit Weighting, Instant Calculation"
          },
          buildFAQSchema(faqs)
        ]}
      />

      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 rounded-xl bg-purple-400/10 text-purple-400">
          <Calculator className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">CGPA Calculator</h1>
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
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Your CGPA is</p>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
                  {cgpa}
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3 h-3" /> 
                  {parseFloat(cgpa) >= 3.5 ? 'Excellent!' : parseFloat(cgpa) >= 3.0 ? 'Great Job!' : 'Keep Going!'}
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

      {/* SEO Content Section */}
      <section className="mt-16 pt-16 border-t border-white/5">
        <div className="prose prose-invert prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-white mb-6">Online CGPA Calculator for Bangladesh Universities</h2>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Calculating your CGPA manually with a traditional calculator can be tedious and prone to errors, especially when factoring in credit weights for different subjects. 
            PdfNest's <strong>CGPA Calculator</strong> is designed specifically for university and college students in Bangladesh to instantly and accurately determine their Grade Point Average.
          </p>

          <h3 className="text-2xl font-bold text-white mb-4">The Standard 4.0 Grading System</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            The University Grants Commission (UGC) of Bangladesh mandates a standard 4.0 grading scale for higher education. Our tool comes pre-configured with this exact scale, mapping letter grades to their correct grade points:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            {[{ g: 'A+', p: '4.00' }, { g: 'A', p: '3.75' }, { g: 'A-', p: '3.50' }, { g: 'B+', p: '3.25' }].map(item => (
              <div key={item.g} className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-xl font-bold text-white mb-1">{item.g}</div>
                <div className="text-purple-400 font-mono">{item.p}</div>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">How to Use the Calculator</h3>
          <ol className="text-muted-foreground space-y-3 mb-8 list-decimal list-inside">
            <li><strong className="text-white">Enter Subject Name:</strong> (Optional) Type the name of your course, e.g., "Data Structures".</li>
            <li><strong className="text-white">Enter Credits:</strong> Input the credit hours assigned to the course (usually 3.0 or 1.5 for labs).</li>
            <li><strong className="text-white">Select Grade:</strong> Choose your expected or achieved letter grade from the dropdown menu.</li>
            <li><strong className="text-white">Add More Subjects:</strong> Click "Add Another Subject" to enter all the courses you took this semester.</li>
            <li><strong className="text-white">View Result:</strong> Your CGPA updates in real-time on the right side of the screen!</li>
          </ol>

          <h3 className="text-2xl font-bold text-white mb-4">Supported Universities</h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Because this tool utilizes the UGC standard, it is perfectly compatible with almost every major institution in Bangladesh. 
            This includes public universities like <strong>Dhaka University (DU)</strong>, <strong>BUET</strong>, and <strong>Rajshahi University</strong>, 
            as well as private institutions like <strong>North South University (NSU)</strong>, <strong>BRAC University</strong>, <strong>AIUB</strong>, and <strong>IUB</strong>.
          </p>
        </div>
      </section>

      <FAQSection faqs={faqs} title="CGPA Calculator — Frequently Asked Questions" />
      
      <div className="pt-8">
        <RelatedTools currentToolId="cgpa-calculator" category="Student Tools" />
      </div>
    </div>
  );
}
