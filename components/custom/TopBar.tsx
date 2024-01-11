import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";

function Toggle() {
  const [checked, setChecked] = useState(false);
  const handleChange = () => setChecked(!checked);
// TODO: Animate the toggle switch
  return (
<div className={`rounded-full bg-gray-900 relative min-w-16 mx-3 min-h-9 flex items-center justify-between transition-all ${checked ? 'flex-row-reverse' : 'flex-row'}`} onClick={handleChange}>
      <div className="rounded-full bg-gray-200 w-8 h-8 text-gray-950 grid place-items-center">
        {checked ? 'F' : 'C'}
      </div>
      <div className="text-white mx-3 font-bold">
        {checked ? 'C' : 'F'}
      </div>
    </div>
  )
}

function TopBar() {
  return (
    <div className="flex justify-between items-center w-[calc(100%)] mt-8">
      <div className="flex items-center gap-2 bg-gray-900 rounded-2xl p-1 focus-within:ring ring-blue-500">
        <span>
          <FaSearch className="inline text-gray-200 ml-2 mb-1" />
        </span>
        <Input
          className="max-w-52 bg-gray-900 placeholder:text-gray-200 text-white outline-none border-none rounded-xl focus-visible:ring-opacity-0"
          placeholder="Search"
        />
      </div>
      <Toggle/>
    </div>
  );
}

export default TopBar;
