import {
    Users,
    FileText,
    TrendingUp,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
    const [stats] = useState([
        {
            title: "Utilisateurs",
            value: "1,240",
            icon: <Users className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />,
        },
        {
            title: "Formulaires soumis",
            value: "532",
            icon: <FileText className="w-6 h-6 text-green-500 dark:text-green-400" />,
        },
        {
            title: "Taux de réussite",
            value: "87%",
            icon: (
                <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
            ),
        },
        {
            title: "Alertes",
            value: "12",
            icon: <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />,
        },
    ]);

    const chartData = [
        { name: "Jan", value: 120 },
        { name: "Fév", value: 180 },
        { name: "Mar", value: 90 },
        { name: "Avr", value: 220 },
        { name: "Mai", value: 160 },
        { name: "Juin", value: 250 },
    ];

    return (
        <div className="space-y-8">
            {/* Title */}
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                    Tableau de bord
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Aperçu général des activités du système.
                </p>
            </header>

            {/* Stat cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item) => (
                    <div
                        key={item.title}
                        className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.title}
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                                    {item.value}
                                </p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-xl">
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* Chart */}
            <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    Activité mensuelle
                </h2>

                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#888" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1f2937",
                                    borderRadius: "8px",
                                    color: "white",
                                    border: "none",
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#6366f1"
                                className="transition-colors duration-300"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
}
