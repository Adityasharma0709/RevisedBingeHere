import { useState } from "react";
import { ChevronDown } from 'lucide-react';
const cities=[
    {id:1,name:"mumbai"},
    {id:2,name:"banglore"},
    {id:3,name:"delhi"},
    {id:4,name:"Goa"},
    {id:5,name:"Chennai"}
]
const Dropdown=()=>
{
    const [isOpen,setisOpen]=useState(false);
    const [selectCity,setselectCity]=useState(cities[0].name)

return (
    <div className="relative w-64 font-sans">
      {/* Trigger Button */}
      <button
        onClick={() => setisOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-left"
      >
        <span className="text-gray-700 font-medium">{selectCity}</span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in duration-100">
          {cities.map((city) => (
            <li
              key={city.id}
              onClick={() => {
                setselectCity(city.name);
                setisOpen(false);
              }}
              className="px-4 py-2.5 text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors border-b last:border-b-0 border-gray-50"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default Dropdown;