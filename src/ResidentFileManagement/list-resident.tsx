import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";

type Resident = {
  id: number;
  fullName: string;
  dob: string;
  age: number;
  gender: string;
};

export default function ListResident(): React.JSX.Element {
  const navigate = useNavigate();
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Mock data
  const [data] = useState<Resident[]>([
    { id: 1, fullName: "John Doe", dob: "1965-08-12", age: 60, gender: "Male" },
    { id: 2, fullName: "Jane Smith", dob: "1958-03-22", age: 67, gender: "Female" },
    { id: 3, fullName: "Nguyen Van A", dob: "1951-12-04", age: 73, gender: "Male" },
    { id: 4, fullName: "Tran Thi B", dob: "1956-07-19", age: 69, gender: "Female" },
  ]);

  const slice = data; // Simplified for demonstration

  const handleRowDoubleClick = (resident: Resident) => {
    setSelectedResident(resident);
    setShowDialog(true);
  };

  return (
    <div className="w-full pt-2">
      {/* Nền radial */}
      <div className="fixed inset-0 -z-10 pointer-events-none bg-[radial-gradient(120%_120%_at_0%_100%,#dfe9ff_0%,#ffffff_45%,#efd8d3_100%)]" />

      <div className="relative">
        <div className="flex gap-2 lg:gap-4">
          

          <div className="flex-1 pr-4">
            <section className="w-full rounded-3xl bg-white/95 ring-1 ring-black/5 shadow-md">
              <header className="px-4 py-5 border-b border-gray-200">
                <div className="relative">
                  <div className="flex-col  items-center gap-2 text-left">
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold" style={{ color: '#5985d8' }}>Resident List</h1>
                      <div className="text-sm text-gray-500 text-right">
                        Note: BP (Blood Pressure), HR (Heart Rate)
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="px-4 py-4">
                <div className="w-full">
                  <div className="rounded-2xl bg-white/90 ring-1 ring-black/5 shadow p-4">
                    <div>
                      <table className="w-full min-w-[1100px]">
                        <thead>
                          <tr className="text-slate-600">
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[100px]">Full name</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[100px]">Date of Birth</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[50px]">Age</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[120px]">Room/Bed</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[180px]">Last vital sign</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[100px]">Diet group</th>
                            <th className="text-left px-6 py-3 whitespace-nowrap min-w-[120px]">Last alert</th>
                          </tr>
                        </thead>
                        <tbody>
                          {slice.map((r) => (
                            <tr
                              key={r.id}
                              className="hover:bg-slate-50 rounded-xl cursor-pointer"
                              onDoubleClick={() => handleRowDoubleClick(r)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-left">{r.fullName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">{r.dob}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">{r.age}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left relative" style={{ minWidth: '120px' }}>
                                Room 101 / Bed 1
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left relative" style={{ minWidth: '180px' }}>
                                BP: 120/80, HR: 72
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-left">Diabetes</td>
                              <td className="px-6 py-4 whitespace-nowrap text-left relative" style={{ minWidth: '120px' }}>
                                Last alert: 2 recent
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
              <p><strong>Last vital sign:</strong> BP: 120/80, HR: 72</p>
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
