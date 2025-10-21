import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as BsIcons from 'react-icons/bs';
import * as IoIcons from 'react-icons/io5';
import * as TiIcons from 'react-icons/ti';
import * as GiIcons from 'react-icons/gi';
import * as FiIcons from 'react-icons/fi';
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi2';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as CgIcons from 'react-icons/cg';

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (iconName: string) => void;
    color: string;
    className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconLibraries: Record<string, Record<string, any>> = {
    Fa: FaIcons,
    Md: MdIcons,
    Bs: BsIcons,
    Io: IoIcons,
    Ti: TiIcons,
    Gi: GiIcons,
    Fi: FiIcons,
    Ri: RiIcons,
    Hi: HiIcons,
    Ai: AiIcons,
    Bi: BiIcons,
    Cg: CgIcons,
};

const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect, color, className = "grid-cols-7" }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLib, setSelectedLib] = useState<keyof typeof iconLibraries>('Fa');

    const allIcons = useMemo(() => {
        const lib = iconLibraries[selectedLib];
        return Object.entries(lib).filter(([name]) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, selectedLib]);

    return (
        <div className="space-y-2 bg-gray-700 rounded-md p-3 ">
            <div className="flex gap-2 mb-2">
                <select
                    value={selectedLib}
                    onChange={(e) => setSelectedLib(e.target.value as keyof typeof iconLibraries)}
                    className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    {Object.keys(iconLibraries).map((lib) => (
                        <option key={lib} value={lib} className="bg-gray-800 text-gray-100">
                            {lib}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="Rechercher une icône"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-md px-2 py-1 text-sm text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <div className={`grid ${className} gap-2 max-h-96 overflow-y-auto border border-gray-600 rounded-md p-2 bg-gray-700 scrollbar-custom`}>
                {allIcons.map(([iconName, IconComp]) => (
                    <motion.button
                        key={iconName}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(iconName)}
                        className={`p-2 rounded-md flex items-center justify-center border border-gray-600 ${selectedIcon === iconName
                                ? 'bg-blue-600 border-blue-500'
                                : 'hover:bg-gray-600'
                            } `}
                        title={iconName}
                    >
                        <IconComp
                            className="w-7 h-7"
                            style={{ color: selectedIcon === iconName ? '#ffffff' : color }}
                        />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default IconPicker;