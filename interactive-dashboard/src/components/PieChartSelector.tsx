"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Form } from "react-bootstrap";

type PieChartSelectorProps = {
    years: string[];
    selectedYear: string;
    onYearChange: (year: string) => void;
    title: string;
    selectLabel: string;
    csvPath: string;
    language: "en" | "fr";
};

const COLOURS = [
    "DeepSkyBlue",
    "Coral",
    "Gold",
    "LightGreen",
    "LightCoral",
    "MediumOrchid",
    "MediumVioletRed",
    "FireBrick",
    "DarkSlateBlue",
    "DarkOliveGreen",
    "Khaki",
    "SandyBrown",
    "Tomato"
];

const categoryTranslations: Record<string, string> = {
    "Food expenditures": "Dépenses alimentaires",
    "Food purchased from stores": "Aliments achetés en magasin",
    "Bakery products": "Produits de boulangerie",
    "Cereal grains and cereal products": "Céréales et produits céréaliers",
    "Fruit, fruit preparations and nuts": "Fruits, préparations de fruits et noix",
    "Vegetables and vegetable preparations": "Légumes et préparations de légumes",
    "Dairy products and eggs": "Produits laitiers et œufs",
    "Meat": "Viande",
    "Fish and seafood": "Poisson et fruits de mer",
    "Non-alcoholic beverages and other food products": "Boissons non alcoolisées et autres produits alimentaires",
    "Food purchased from restaurants": "Aliments achetés au restaurant",
    "Restaurant meals": "Repas au restaurant",
    "Restaurant snacks and beverages": "Collations et boissons au restaurant",
};

export default function PieChartSelector({
    years,
    selectedYear,
    onYearChange,
    title,
    selectLabel,
    csvPath,
    language,
}: PieChartSelectorProps) {
    const [data, setData] = useState<{ name: string; value: number }[]>([]);
    const [allData, setAllData] = useState<any[]>([]);

    useEffect(() => {
        fetch(csvPath)
            .then((res) => res.text())
            .then((csvText) => {
                const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
                setAllData(parsed.data);
            })
            .catch((err) => {
                console.error("Error loading CSV:", err);
            });
    }, [csvPath]);

    useEffect(() => {
        if (!selectedYear || allData.length === 0) {
            setData([]);
            return;
        }
        const filteredRows = allData.filter(
            (row) =>
                row.REF_DATE === selectedYear &&
                row.GEO === "Canada" &&
                row.Statistic === "Average expenditure per household"
        );

        const formattedData = filteredRows
            .map((row) => {
                const val = Number(row.VALUE);
                if (isNaN(val)) return null;

                const englishName = row["Food expenditures, summary-level categories"];
                const translatedName =
                    language === "fr" ? categoryTranslations[englishName] || englishName : englishName;

                return {
                    name: translatedName,
                    value: val,
                };
            })
            .filter((x): x is { name: string; value: number } => x !== null);

        setData(formattedData);
    }, [selectedYear, allData.length, language]);

    return (
        <div className="d-flex flex-column align-items-center mb-5">
            <h4 className="mb-3 text-center">{title}</h4>
            <Form.Select
                aria-label={selectLabel}
                value={selectedYear}
                onChange={(e) => onYearChange(e.target.value)}
                className="mb-4 w-auto"
                style={{ minWidth: 150 }}
            >
                {years.map((year) => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </Form.Select>

            <div style={{ width: 900, height: 450 }}>
                {data.length === 0 ? (
                    <p className="text-center">Loading data or no data available for {selectedYear}</p>
                ) : (
                    <PieChart width={900} height={450}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius={160}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLOURS[index % COLOURS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend wrapperStyle={{ marginTop: 20 }} verticalAlign="bottom" height={36} />
                    </PieChart>
                )}
            </div>
        </div>
    );
}