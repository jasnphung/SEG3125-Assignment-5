/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import { Container } from "react-bootstrap";

import MyNavbar from "../components/Navbar";
import LineChartSelector from "../components/LineChartSelector";
import PieChartSelector from "../components/PieChartSelector";

type CsvRow = {
  REF_DATE?: string;
  GEO?: string;
  Statistic?: string;
  "Food expenditures, summary-level categories"?: string;
  VALUE?: string;
};

type RawDataEntry = {
  REF_DATE: string;
  category: string;
  VALUE: number;
};

export default function DashboardPage() {
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [rawData, setRawData] = useState<RawDataEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    fetch("/detailed_food_spending_canada.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const data = parsed.data as CsvRow[];

        const mapped = data
          .filter(
            (row): row is Required<CsvRow> =>
              !!row.REF_DATE &&
              !!row["Food expenditures, summary-level categories"] &&
              !!row.VALUE &&
              row.GEO === "Canada" &&
              row.Statistic === "Average expenditure per household"
          )
          .map((row) => ({
            REF_DATE: row.REF_DATE,
            category: row["Food expenditures, summary-level categories"],
            VALUE: Number(row.VALUE),
          }));

        setRawData(mapped);

        const firstCategory = mapped[0]?.category || "";
        const firstYear = mapped[0]?.REF_DATE || "";

        setSelectedCategory(firstCategory);
        setSelectedYear(firstYear);
      });
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(rawData.map((d) => d.category))),
    [rawData]
  );

  const years = useMemo(
    () => Array.from(new Set(rawData.map((d) => d.REF_DATE))).sort(),
    [rawData]
  );

  const lineChartData = useMemo(() => {
    if (!selectedCategory) return [];

    return years.map((year) => {
      const entry = rawData.find(
        (d) => d.REF_DATE === year && d.category === selectedCategory
      );
      return { year, value: entry ? entry.VALUE : 0 };
    });
  }, [selectedCategory, years, rawData]);

  const texts = {
    en: {
      lineChartTitle: "Spending Over Years",
      categoryLabel: "Select category",
      pieChartTitle: "Spending Breakdown by Category",
      yearLabel: "Select year",
      siteDescription:
        "This interactive dashboard presents Canadian household food expenditure data, allowing you to explore spending trends over time and compare spending across categories. All values are in Canadian Dollars (CAD).",
    },
    fr: {
      lineChartTitle: "Dépenses au fil des années",
      categoryLabel: "Sélectionnez la catégorie",
      pieChartTitle: "Répartition des dépenses par catégorie",
      yearLabel: "Sélectionnez l'année",
      siteDescription:
        "Ce tableau de bord interactif présente les données sur les dépenses alimentaires des ménages canadiens, vous permettant d'explorer les tendances de dépenses au fil du temps et de comparer les dépenses entre catégories. Toutes les valeurs sont en dollars canadiens (CAD).",
    },
  };

  const t = texts[language];

  return (
    <>
      <MyNavbar language={language} setLanguage={setLanguage} />
      <Container
        className="d-flex flex-column align-items-center my-4"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="mb-4 px-3"
          style={{ maxWidth: 900, textAlign: "center", fontSize: "1.1rem" }}
        >
          {t.siteDescription}
        </div>

        <div className="mb-5 w-100" style={{ maxWidth: 1000, minWidth: 320 }}>
          <LineChartSelector
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            years={years}
            data={lineChartData}
            title={t.lineChartTitle}
            selectLabel={t.categoryLabel}
            language={language}
          />
        </div>

        <div className="mb-5 w-100" style={{ maxWidth: 1000, minWidth: 320 }}>
          <PieChartSelector
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            title={t.pieChartTitle}
            selectLabel={t.yearLabel}
            csvPath="/detailed_food_spending_canada.csv"
            language={language}
          />
        </div>
      </Container>
    </>
  );
}