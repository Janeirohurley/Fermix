import type { ElementType } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BsIcons from 'react-icons/bs';
import * as TiIcons from 'react-icons/ti';
import * as GiIcons from 'react-icons/gi';
import * as FiIcons from 'react-icons/fi';
import * as RiIcons from 'react-icons/ri';
import * as HiIcons from 'react-icons/hi';
import * as AiIcons from 'react-icons/ai';
import * as BiIcons from 'react-icons/bi';
import * as CgIcons from 'react-icons/cg';


const iconLibraries: Record<string, Record<string, ElementType>> = {
    Fa: FaIcons,
    Md: MdIcons,
    Io: IoIcons,
    Bs: BsIcons,
    Ti: TiIcons,
    Gi: GiIcons,
    Fi: FiIcons,
    Ri: RiIcons,
    Hi: HiIcons,
    Ai: AiIcons,
    Bi: BiIcons,
    Cg: CgIcons,

};

/**
 * Renvoie dynamiquement un composant icône basé sur le nom
 * @param iconName Exemple : "FaBeer", "MdCloud", "LucidePlane"
 */
export const getDynamicIconComponent = (iconName: string): ElementType => {
    // Sinon on essaie pour react-icons
    const prefix = iconName.substring(0, 2);
    const lib = iconLibraries[prefix];

    return (lib?.[iconName] as ElementType) || (FaIcons.FaBox as ElementType); // fallback react-icons
};
