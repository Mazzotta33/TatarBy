import {Listbox} from "@headlessui/react";

function Dropdown({label, options, value, onChange}: {
    label: string;
    options: string[];
    value: string;
    onChange: (val: string) => void
}) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-700">{label}</label>
            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button
                        className="w-full p-2 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
                        {value}
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full rounded-md bg-white shadow-lg border border-green-400 z-10">
                        {options.map((option) => (
                            <Listbox.Option
                                key={option}
                                value={option}
                                className={({ active, selected }) =>
                                    `cursor-pointer select-none p-2 ${active ? "bg-green-100 text-green-700" : selected ? "bg-green-50 text-green-600" : "text-gray-700"}`
                                }
                            >
                                {option}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}

export default Dropdown;