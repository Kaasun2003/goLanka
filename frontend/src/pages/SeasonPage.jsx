import React from 'react';
import SeasonPassForm from '../components/SeasonPassForm.jsx';

const SeasonPage = ({ t }) => {
  const faqs = [
    {
      q: 'Who is eligible for student subsidized bus season tickets in Sri Lanka?',
      a: 'All government school students (Grades 1 to 13), registered pirivena students, and full-time state university undergraduates are entitled to subsidized transit passes issued under the SLTB and Ministry of Transport subsidy framework.'
    },
    {
      q: 'Can the goLanka Digital QR Pass be used on private buses?',
      a: 'The digital pass is fully valid on all SLTB (CTB) depot buses and on private route buses operating under the NTC Joint Service Timetable framework across recognized routes.'
    },
    {
      q: 'How does the conductor inspect and verify my digital season pass?',
      a: 'Conductors can either scan the secure QR code using the goLanka conductor mobile verification tool or visually inspect the active digital seal with your NIC/Student ID.'
    },
    {
      q: 'Can I change my designated travel route after issuance?',
      a: 'Route changes require submission of an amendment request at your issuing SLTB depot office (e.g., Maharagama, Bastian Mawatha, or Kandy South).'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/30">
          <span>🎫</span>
          <span>Sri Lanka Digital Season Pass Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Apply & Manage Transit Season Passes
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Say goodbye to long monthly queues at bus depot counters. Apply online, receive state student subsidies, and carry your official digital pass with an encrypted QR code directly on your smartphone.
        </p>
      </div>

      {/* Embedded Season Pass Form and QR Viewer */}
      <SeasonPassForm t={t} />

      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-900">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-2xl">🎓</span>
          <h4 className="text-base font-bold text-white">Up to 75% Student Subsidy</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            School children and university undergraduates travel at heavily subsidized government rates backed by the Treasury.
          </p>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-2xl">⚡</span>
          <h4 className="text-base font-bold text-white">Instant QR Issuance</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Immediate digital card generation with tamper-proof validation keys readable by any transit conductor smartphone.
          </p>
        </div>
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-2xl">🏛️</span>
          <h4 className="text-base font-bold text-white">Depot Network Backing</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Supported by 107+ SLTB bus depots island-wide including Pettah, Maharagama, Moratuwa, Kandy, and Galle.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-3xl mx-auto space-y-4 pt-6">
        <h3 className="text-xl font-bold text-white text-center mb-6">
          Frequently Asked Questions (නිතර අසන ප්‍රශ්න)
        </h3>
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2"
          >
            <h4 className="text-sm font-bold text-amber-300">
              Q: {faq.q}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeasonPage;
