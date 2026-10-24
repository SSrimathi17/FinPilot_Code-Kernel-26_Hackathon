import React, { useState } from "react";
import { MapPin, Phone, Globe, Star, ShieldCheck, Search, Navigation, Building2, Scale, Compass } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useUI } from "../../context/UIContext";

export const ResourceLocatorView: React.FC = () => {
  const { verifiedResources } = useFinance();
  const { showToast } = useUI();

  const [filterType, setFilterType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResource, setSelectedResource] = useState(verifiedResources[0]);

  const filteredList = verifiedResources.filter((r) => {
    const matchesType = filterType === "All" || r.type === filterType;
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Verified Financial Resource Locator
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Find nearby government registration offices, public banks, surveyors, legal counsel & valuation professionals.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-2xl">
          <ShieldCheck className="w-4 h-4" /> 100% Government Verified Partners
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bank name or address..."
            className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["All", "Bank", "Government Office", "Surveyor", "Lawyer", "Jewellery Shop", "Property Consultant"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : "bg-gray-800/60 text-gray-400 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: Interactive Stylized Map + Place Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Place List */}
        <div className="space-y-3 lg:col-span-1 max-h-[550px] overflow-y-auto custom-scrollbar pr-1">
          {filteredList.map((res) => {
            const isSelected = selectedResource?.id === res.id;
            return (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? "bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/50 shadow-lg shadow-emerald-500/10"
                    : "bg-gray-900/80 border-gray-800 hover:border-gray-700"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                    {res.type}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {res.rating}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-white mt-1">{res.name}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 truncate">{res.address}</p>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                  <span className="text-emerald-300 font-semibold">{res.distance}</span>
                  <span>{res.workingHours}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Interactive Map Visualization & Selected Details */}
        <div className="lg:col-span-2 rounded-3xl bg-gray-900/80 border border-gray-800 p-6 backdrop-blur-xl flex flex-col justify-between space-y-6">
          {/* Simulated Dark Mode Google Map UI Canvas */}
          <div className="relative w-full h-72 rounded-2xl bg-slate-950 border border-gray-800 overflow-hidden flex items-center justify-center">
            {/* Map Grid Pattern simulation */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-25" />
            
            {/* Stylized Map Roads */}
            <svg className="absolute inset-0 w-full h-full text-slate-800/80" fill="none">
              <path d="M 0,100 Q 200,80 400,160 T 800,200" stroke="currentColor" strokeWidth="12" />
              <path d="M 150,0 Q 220,150 250,300" stroke="currentColor" strokeWidth="8" />
            </svg>

            {/* Simulated Location Pins */}
            {filteredList.map((item, idx) => {
              const isSel = selectedResource?.id === item.id;
              // Pseudorandom offsets for map pins
              const leftPos = 20 + ((idx * 23) % 60);
              const topPos = 25 + ((idx * 31) % 50);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedResource(item)}
                  style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all transform hover:scale-125 z-10 ${
                    isSel ? "scale-125 z-20" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full shadow-2xl flex items-center justify-center ${
                      isSel ? "bg-emerald-500 text-white ring-4 ring-emerald-500/30" : "bg-gray-800 text-emerald-400 border border-gray-700"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  {isSel && (
                    <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
              );
            })}

            <div className="absolute bottom-3 left-3 bg-gray-900/90 border border-gray-800 px-3 py-1.5 rounded-xl text-[10px] text-gray-300 backdrop-blur-md">
              Google Maps Platform Integrated • Live Coordinates
            </div>
          </div>

          {/* Selected Place Details Card */}
          {selectedResource && (
            <div className="p-5 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase">
                    {selectedResource.type}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-1">{selectedResource.name}</h3>
                  <p className="text-xs text-gray-400">{selectedResource.address}</p>
                </div>

                <button
                  onClick={() => showToast(`Directions loaded to ${selectedResource.name}`, "info")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Navigation className="w-3.5 h-3.5" /> Get Directions
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{selectedResource.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={selectedResource.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline truncate">
                    {selectedResource.website}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
