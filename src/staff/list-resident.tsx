import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

type Resident = {
  id: number;
  fullName: string;
  dob: string;
  age: number;
  gender: string;
  comorbidities: string[] | string;
  ec?: {
    name: string;
    relation: string;
    phone: string;
  };
};

export default function ListResident(): React.JSX.Element {
  const navigate = useNavigate();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const [data, setData] = useState<Resident[]>(() => {
    // Load residents from localStorage
    return JSON.parse(localStorage.getItem("residents") || "[]");
  });

  useEffect(() => {
    // Update data when localStorage changes
    const handleStorageChange = () => {
      setData(JSON.parse(localStorage.getItem("residents") || "[]"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const slice = data; // Simplified for demonstration

  const handleRowDoubleClick = (resident: Resident) => {
    setSelectedResident(resident);
    setShowDialog(true);
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="w-full pt-2">
      {/* Nền radial */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

      <div className="relative">
        <div className="flex gap-2 lg:gap-4 overflow-x: auto">
          <div className="flex-1 pr-4">
            <section className="w-full rounded-3xl bg-white/95 ring-1 ring-black/5 shadow-md">
              <header className="px-4 py-5 rounded-3xl border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="relative">
                  <div className="flex-col items-center gap-2 text-left">
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold" style={{ color: '#5985d8' }}>Resident List</h1>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500 text-right">
                          Note: BP (Blood Pressure), HR (Heart Rate), Temp (Temperature), RR (Respiration Rate), SpO₂ (Oxygen Saturation)
                        </div>
                        <button
                          onClick={() => navigate("/resident-information")}
                          className="w-5 h-6 flex items-center justify-center bg-white text-black p-0 rounded-md hover:bg-gray-300"
                          style={{fontSize:"24px"}}
                          aria-label="Add Resident"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{today}</p>
                  </div>
                </div>
              </header>

              <div className="px-4 py-4">
                <div className="w-full">
                  <div className="rounded-2xl bg-white/90 ring-1 ring-black/5 shadow p-4">
                    <div>
                      <table className="w-full min-w-[1150px]">
                        <thead>
                          <tr className="text-slate-600">
                            <th className="text-left px-0 py-3 black min-w-[100px]">Full name</th>
                            <th className="text-left px-0 py-3 black min-w-[150px]">Date of Birth</th>
                            <th className="text-left px-0 py-3 black min-w-[120px]">Room/Bed</th>
                            <th className="text-left px-0 py-3 black min-w-[130px]">Comorbidity</th>
                            <th className="text-left px-0 py-3 black min-w-[200px]">Last vital sign</th>
                            <th className="text-left px-0 py-3 black min-w-[100px]">Diet group</th>
                            <th className="text-left px-0 py-3 black min-w-[120px]">Last alert</th>
                            <th className="text-left px-0 py-3 black min-w-[150px]">Family's Contact</th> 
                          </tr>
                        </thead>
                        <tbody>
                          {slice.map((r) => (
                            <tr
                              key={r.id}
                              className="hover:bg-slate-50 rounded-xl cursor-pointer"
                              onDoubleClick={() => handleRowDoubleClick(r)}
                            >
                              <td className="px-0 py-4 text-gray-800 font-medium text-left">{r.fullName}</td>
                              <td className="px-0 py-4 text-gray-800 text-left">{r.dob}</td>
                              <td className="px-0 py-4 text-gray-800 text-left relative" style={{ minWidth: '120px' }}>
                                Room 101 / Bed 1
                              </td>
                              <td className="px-0 py-4 text-gray-800 text-left">
                                {Array.isArray(r.comorbidities) ? r.comorbidities.join(", ") : r.comorbidities || "None"}
                              </td>
                              <td className="px-0 py-4 text-gray-800 text-left relative" style={{ minWidth: '180px' }}>
                                BP: 120/80, HR: 72<br />
                                Temp: 36.6°C<br />
                                RR: 16, SpO₂: 97%
                              </td>
                              <td className="px-0 py-4 text-gray-800 text-left">Diabetes</td>
                              <td className="px-0 py-4 text-gray-800 text-left relative" style={{ minWidth: '120px' }}>
                                Last alert: 2 recent
                              </td>
                              <td className="px-0 py-4 text-gray-800 text-left">
                                {r.ec?.name} ({r.ec?.relation}) - {r.ec?.phone || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center w-full">Resident information</DialogTitle>
          </DialogHeader>
          {selectedResident && (
            <div className="space-y-4 text-left">
              <p><strong>Name:</strong> {selectedResident.fullName}</p>
              <p>
                <strong>Date of birth:</strong> {selectedResident.dob} <span className="ml-4"><strong>Age:</strong> {selectedResident.age}</span>
              </p>
              <p><strong>Gender:</strong> {selectedResident.gender}</p>
              <p><strong>Room/bed:</strong> Room 101 / Bed 1</p>
              <p><strong>Diet group:</strong> Diabetes</p>
              <p><strong>Last vital sign:</strong> BP: 120/80, HR: 72, Temp: 36.6°C, RR: 16, SpO₂: 97%</p>
              <p><strong>Notes:</strong> None</p>
            </div>
          )}
          <DialogFooter className="flex justify-center gap-4">
            <button
              onClick={() => setShowDialog(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowDialog(false);
                navigate("/issue-link-code", {
                  state: { residentInfo: selectedResident },
                });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Generate invite
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
