import React, { useState, useEffect, useMemo } from "react";
import { Grid, type CellComponentProps } from "react-window";
import { motion } from "framer-motion";
import { Loader2, Search } from "lucide-react";
import type { IconType } from "react-icons";

type IconLibraries =
    | "fa"
    | "md"
    | "bs"
    | "io5"
    | "ti"
    | "gi"
    | "fi"
    | "ri"
    | "hi2"
    | "ai"
    | "bi"
    | "cg";

interface IconPickerProps {
    onSelect: (icon: { name: string; lib: IconLibraries }) => void;
    defaultLib?: IconLibraries;
    color?: string; // 🌈 couleur personnalisée pour l’icône sélectionnée
    selectedIcon?:string
}

const cache: Record<string, Record<string, IconType>> = {}; // cache global

export const IconPicker: React.FC<IconPickerProps> = ({
    onSelect,
    defaultLib = "fa",
    color = "#2563eb", // bleu par défaut
    selectedIcon = null,
}) => {
    const [selectedLib, setSelectedLib] = useState<IconLibraries>(defaultLib);
    const [iconLib, setIconLib] = useState<Record<string, IconType>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [LocalselectedIcon, setLocalselectedIcon] = useState<string | null>(selectedIcon);

    const libraries: IconLibraries[] = [
        "fa",
        "md",
        "bs",
        "io5",
        "ti",
        "gi",
        "fi",
        "ri",
        "hi2",
        "ai",
        "bi",
        "cg",
    ];

    // 🔁 Charger dynamiquement la librairie d'icônes
    useEffect(() => {
        const loadLibrary = async () => {
            if (cache[selectedLib]) {
                setIconLib(cache[selectedLib]);
                return;
            }

            setIsLoading(true);
            try {
                let mod: Record<string, unknown> = {};

                switch (selectedLib) {
                    case "fa":
                        mod = await import("react-icons/fa");
                        break;
                    case "md":
                        mod = await import("react-icons/md");
                        break;
                    case "bs":
                        mod = await import("react-icons/bs");
                        break;
                    case "io5":
                        mod = await import("react-icons/io5");
                        break;
                    case "ti":
                        mod = await import("react-icons/ti");
                        break;
                    case "gi":
                        mod = await import("react-icons/gi");
                        break;
                    case "fi":
                        mod = await import("react-icons/fi");
                        break;
                    case "ri":
                        mod = await import("react-icons/ri");
                        break;
                    case "hi2":
                        mod = await import("react-icons/hi2");
                        break;
                    case "ai":
                        mod = await import("react-icons/ai");
                        break;
                    case "bi":
                        mod = await import("react-icons/bi");
                        break;
                    case "cg":
                        mod = await import("react-icons/cg");
                        break;
                }

                const lib = Object.fromEntries(
                    Object.entries(mod).filter(([k]) => k !== "default")
                ) as Record<string, IconType>;

                cache[selectedLib] = lib;
                setIconLib(lib);
            } catch (err) {
                console.error("Erreur lors du chargement :", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadLibrary();
    }, [selectedLib]);

    // 🧮 Convertir les icônes en tableau filtré
    const iconEntries = useMemo(() => {
        const entries = Object.entries(iconLib);
        if (!search.trim()) return entries;
        const term = search.toLowerCase();
        return entries.filter(([name]) => name.toLowerCase().includes(term));
    }, [iconLib, search]);

    // 🧩 Cellule du Grid
    const Cell = ({
        columnIndex,
        rowIndex,
        style,
    }: CellComponentProps<{ icons: [string, IconType][] }>) => {
        const index = rowIndex * 6 + columnIndex; // 6 colonnes
        if (index >= iconEntries.length) return null;

        const [name, Icon] = iconEntries[index];
        const isSelected = LocalselectedIcon === name;

        return (
            <div
                style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                }}
                onClick={() => {
                    setLocalselectedIcon(name);
                    onSelect({ name, lib: selectedLib });
                }}
            >
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-lg ring  ${isSelected
                            ? "ring-1 ring-offset-1 dark:ring-offset-gray-800"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 ring-neutral-500"
                        }`}
                    style={isSelected ? { color, '--ring-color': color } as React.CSSProperties : {}}
                >
                    <Icon size={26} color={isSelected ? color : "#777"} />
                </motion.div>
            </div>
        );
    };

    return (
        <div className="w-full h-[480px] flex flex-col gap-3">
            {/* Barre de recherche */}
            <div className="relative">
                <Search
                    size={16}
                    className="absolute left-3 top-2.5 text-gray-400 pointer-events-none"
                />
                <input
                    type="text"
                    placeholder="Rechercher une icône..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
                />
            </div>

            {/* Sélecteur de librairie */}
            <div className="flex flex-wrap gap-2">
                {libraries.map((lib) => (
                    <button
                        key={lib}
                        className={`px-3 py-1 rounded-md text-sm font-medium border transition-all ${selectedLib === lib
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                            }`}
                        onClick={() => setSelectedLib(lib)}
                    >
                        {lib.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Zone d'affichage */}
            <div className="flex-1 border rounded-lg overflow-hidden relative dark:border-gray-700">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin text-gray-500" size={32} />
                    </div>
                ) : (
                    <Grid
                        cellComponent={Cell}
                        cellProps={{ icons: iconEntries }}
                        columnCount={6}
                        columnWidth={60}
                        rowCount={Math.ceil(iconEntries.length / 6)}
                        rowHeight={50}
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </div>
        </div>
    );
};

export default IconPicker;
