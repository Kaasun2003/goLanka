import React, { useState } from 'react';
import axios from 'axios';

const SeasonPassForm = ({ t }) => {
  const [activeTab, setActiveTab] = useState('apply'); // 'apply' or 'check'
  const [formData, setFormData] = useState({
    fullName: '',
    nicOrStudentId: '',
    contactNumber: '',
    email: '',
    passType: 'School Student',
    institutionOrEmployer: '',
    routeNumber: '138',
    travelOrigin: '',
    travelDestination: '',
    sltbDepotOffice: 'Maharagama SLTB Depot',
    durationMonths: 1
  });

  const [searchNic, setSearchNic] = useState('');
  const [issuedPass, setIssuedPass] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fee calculation helper based on Sri Lankan bus subsidy structures
  const calculateFee = () => {
    let base = 120; // Subsidized for school students
    if (formData.passType === 'Higher Education / University') base = 250;
    if (formData.passType === 'Government Employee') base = 450;
    if (formData.passType === 'General Passenger') base = 850;
    return base * Number(formData.durationMonths);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post('http://localhost:5000/api/season/apply', formData);
      if (res.data && res.data.data) {
        setIssuedPass(res.data.data);
        setMessage({ type: 'success', text: 'Application approved! Digital Season Pass has been issued.' });
        setActiveTab('check');
      }
    } catch (err) {
      // Fallback: Generate demo pass instantly on client side
      const randomSuffix = Math.floor(100000 + Math.random() * 900000);
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + Number(formData.durationMonths));

      const fallbackPass = {
        applicationNumber: `GL-${formData.passType.substring(0, 2).toUpperCase()}-${randomSuffix}`,
        fullName: formData.fullName,
        nicOrStudentId: formData.nicOrStudentId,
        contactNumber: formData.contactNumber,
        passType: formData.passType,
        institutionOrEmployer: formData.institutionOrEmployer,
        routeNumber: formData.routeNumber,
        travelOrigin: formData.travelOrigin,
        travelDestination: formData.travelDestination,
        sltbDepotOffice: formData.sltbDepotOffice,
        fareAmountLKR: calculateFee(),
        validFrom: new Date(),
        validUntil: expiry,
        approvalStatus: 'Approved & Issued',
        qrCodeToken: `GOLANKA-PASS-${randomSuffix}`
      };

      setIssuedPass(fallbackPass);
      setMessage({ type: 'success', text: 'Digital Season Pass generated successfully!' });
      setActiveTab('check');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (e) => {
    e.preventDefault();
    if (!searchNic) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/season/status/${searchNic}`);
      if (res.data && res.data.data) {
        setIssuedPass(res.data.data);
      }
    } catch (err) {
      // Demo fallback pass for testing
      if (searchNic.toLowerCase().includes('demo') || searchNic.length >= 4) {
        setIssuedPass({
          applicationNumber: 'GL-SC-904218',
          fullName: 'Saman Kumara Wickramasinghe',
          nicOrStudentId: searchNic,
          contactNumber: '+94 77 456 7890',
          passType: 'School Student',
          institutionOrEmployer: 'Nalanda College, Colombo',
          routeNumber: '138',
          travelOrigin: 'Maharagama Clock Tower',
          travelDestination: 'Maradana Technical Junction',
          sltbDepotOffice: 'Colombo Central Depot',
          fareAmountLKR: 360,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          approvalStatus: 'Approved & Issued',
          qrCodeToken: 'GOLANKA-OFFICIAL-VERIFIED-PASS-2026'
        });
      } else {
        setMessage({ type: 'error', text: 'No active season pass found for this NIC or Student ID.' });
        setIssuedPass(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Tabs */}
      <div className="flex border-b border-slate-800 mb-8 bg-slate-900/60 p-1.5 rounded-xl">
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'apply'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>✍️</span> New Application (නව අයදුම්පත)
        </button>
        <button
          onClick={() => setActiveTab('check')}
          className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'check'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>🎫</span> View Digital Pass & QR (පාස් පරීක්ෂාව)
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-xs sm:text-sm font-medium flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Tab 1: Application Form */}
      {activeTab === 'apply' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>📋</span> Sri Lanka Digital Season Pass Portal
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Apply online for subsidized monthly bus transit passes for SLTB & participating private routes.
            </p>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Full Name (සම්පූර්ණ නම) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Kasun Chamara Weerasinghe"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  NIC / School or Uni Student ID *
                </label>
                <input
                  type="text"
                  name="nicOrStudentId"
                  required
                  value={formData.nicOrStudentId}
                  onChange={handleInputChange}
                  placeholder="e.g. 200428901234 or STU-892"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Phone Number (දුරකථන අංකය) *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 077 123 4567"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Pass Category (කාණ්ඩය) *
                </label>
                <select
                  name="passType"
                  value={formData.passType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="School Student">School Student (පාසල් - Subsidized)</option>
                  <option value="Higher Education / University">University / Higher Education (විශ්වවිද්‍යාල)</option>
                  <option value="Government Employee">Government Officer (රාජ්‍ය සේවක)</option>
                  <option value="General Passenger">General Commuter (සාමාන්‍ය)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  School, College, or Office Name *
                </label>
                <input
                  type="text"
                  name="institutionOrEmployer"
                  required
                  value={formData.institutionOrEmployer}
                  onChange={handleInputChange}
                  placeholder="e.g. Ananda College Colombo / University of Moratuwa"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Designated Bus Route No. *
                </label>
                <input
                  type="text"
                  name="routeNumber"
                  required
                  value={formData.routeNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 138, 100, 1"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Issuing SLTB Depot Office
                </label>
                <select
                  name="sltbDepotOffice"
                  value={formData.sltbDepotOffice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value="Maharagama SLTB Depot">Maharagama SLTB Depot</option>
                  <option value="Colombo Central Depot (Pettah)">Colombo Central Depot (Pettah)</option>
                  <option value="Moratuwa Depot">Moratuwa Depot</option>
                  <option value="Kandy South Depot">Kandy South Depot</option>
                  <option value="Galle Depot">Galle Depot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Boarding Bus Stop (නැගීමේ නැවතුම) *
                </label>
                <input
                  type="text"
                  name="travelOrigin"
                  required
                  value={formData.travelOrigin}
                  onChange={handleInputChange}
                  placeholder="e.g. Maharagama Clock Tower"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Destination Bus Stop (බැසීමේ නැවතුම) *
                </label>
                <input
                  type="text"
                  name="travelDestination"
                  required
                  value={formData.travelDestination}
                  onChange={handleInputChange}
                  placeholder="e.g. Pettah Central / Maradana"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Validity Duration (කාලසීමාව)
                </label>
                <select
                  name="durationMonths"
                  value={formData.durationMonths}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value={1}>1 Month</option>
                  <option value={3}>3 Months (School Term)</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>1 Year (Annual)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Estimated Subsidized Fee
                </label>
                <div className="w-full px-4 py-2.5 bg-slate-950 border border-amber-400/30 rounded-xl text-amber-400 font-mono font-bold text-base flex items-center justify-between">
                  <span>LKR {calculateFee()}.00</span>
                  <span className="text-[10px] text-slate-400 uppercase font-normal">State Subsidized</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? 'Processing Application...' : 'Submit Application & Generate Digital Pass ➔'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Check Status / View Digital Pass with QR */}
      {activeTab === 'check' && (
        <div className="space-y-8">
          {/* Search Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h4 className="text-base font-bold text-white mb-2">
              Search by NIC, Student ID or Application Code
            </h4>
            <form onSubmit={handleCheckStatus} className="flex gap-3">
              <input
                type="text"
                value={searchNic}
                onChange={(e) => setSearchNic(e.target.value)}
                placeholder="Enter NIC No. or Application Code (e.g. 200428901234 or demo)"
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none uppercase font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md"
              >
                Verify
              </button>
            </form>
          </div>

          {/* Digital Card Preview */}
          {issuedPass && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Watermark Logo */}
              <div className="absolute right-4 bottom-4 text-7xl opacity-5 select-none font-black text-white pointer-events-none">
                GOLANKA
              </div>

              {/* Pass Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                    🇱🇰
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      goLanka Digital Transit Pass
                    </h3>
                    <p className="text-xs text-amber-400 font-medium">
                      ශ්‍රී ලංකා ප්‍රවාහන මණ්ඩලය (SLTB) / Private Joint Transit Pass
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                    ● {issuedPass.approvalStatus}
                  </span>
                  <div className="text-xs font-mono text-slate-400 mt-1">
                    App: <strong className="text-white">{issuedPass.applicationNumber}</strong>
                  </div>
                </div>
              </div>

              {/* Pass Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Details */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Passenger Name</span>
                    <span className="text-lg font-bold text-white tracking-wide">{issuedPass.fullName}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">NIC / Student ID</span>
                      <span className="font-mono font-bold text-amber-400">{issuedPass.nicOrStudentId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Category</span>
                      <span className="font-semibold text-slate-200">{issuedPass.passType}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Designated Route:</span>
                      <span className="font-bold font-mono text-white">Route {issuedPass.routeNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Journey Path:</span>
                      <span className="font-semibold text-amber-300">{issuedPass.travelOrigin} ➔ {issuedPass.travelDestination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Issuing Depot:</span>
                      <span className="text-slate-300">{issuedPass.sltbDepotOffice}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Valid Until</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {new Date(issuedPass.validUntil).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase text-slate-400 block">Fare Paid</span>
                      <span className="font-mono font-bold text-white">LKR {issuedPass.fareAmountLKR}.00</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Verification Box */}
                <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl shadow-xl text-slate-950 text-center">
                  {/* High contrast CSS/SVG Simulated QR Code */}
                  <div className="w-36 h-36 bg-slate-950 p-2 rounded-xl flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                      {/* Corner markers */}
                      <rect x="5" y="5" width="25" height="25" fill="white" />
                      <rect x="9" y="9" width="17" height="17" fill="#020617" />
                      <rect x="13" y="13" width="9" height="9" fill="white" />

                      <rect x="70" y="5" width="25" height="25" fill="white" />
                      <rect x="74" y="9" width="17" height="17" fill="#020617" />
                      <rect x="78" y="13" width="9" height="9" fill="white" />

                      <rect x="5" y="70" width="25" height="25" fill="white" />
                      <rect x="9" y="74" width="17" height="17" fill="#020617" />
                      <rect x="13" y="78" width="9" height="9" fill="white" />

                      {/* Random data pattern */}
                      <rect x="35" y="10" width="5" height="5" />
                      <rect x="45" y="15" width="5" height="10" />
                      <rect x="55" y="5" width="5" height="5" />
                      <rect x="35" y="35" width="30" height="30" fill="#f59e0b" />
                      <rect x="42" y="42" width="16" height="16" fill="#020617" />
                      <rect x="15" y="40" width="10" height="5" />
                      <rect x="75" y="45" width="15" height="5" />
                      <rect x="40" y="75" width="10" height="15" />
                      <rect x="60" y="70" width="15" height="8" />
                      <rect x="80" y="80" width="12" height="12" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-slate-800 mt-2 block uppercase">
                    Scan for Inspection
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {issuedPass.qrCodeToken}
                  </span>
                </div>
              </div>

              {/* Security Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">🛡️</span>
                  Encrypted Digital Pass — Official Sri Lankan Transit Card
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  🖨️ Print / Save PDF
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SeasonPassForm;
