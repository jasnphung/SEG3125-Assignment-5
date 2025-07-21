"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Form } from "react-bootstrap";

type LineChartSelectorProps = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  years: string[];
  data: { year: string; value: number }[];
  title: string;
  selectLabel: string;
  language: "en" | "fr";
};

const categoryTranslations: Record<string, string> = {
  "Food expenditures": "Dépenses alimentaires",
  "Food purchased from stores": "Aliments achetés en magasin",
  "Bakery products": "Produits de boulangerie",
  "Cereal grains and cereal products": "Céréales et produits céréaliers",
  "Fruit, fruit preparations and nuts": "Fruits, préparations de fruits et noix",
  "Vegetables and vegetable preparations": "Légumes et préparations de légumes",
  "Dairy products and eggs": "Produits laitiers et œufs",
  Meat: "Viande",
  "Fish and seafood": "Poisson et fruits de mer",
  "Non-alcoholic beverages and other food products":
    "Boissons non alcoolisées et autres produits alimentaires",
  "Food purchased from restaurants": "Aliments achetés au restaurant",
  "Restaurant meals": "Repas au restaurant",
  "Restaurant snacks and beverages": "Collations et boissons au restaurant",
};

export default function LineChartSelector({
  categories,
  selectedCategory,
  onCategoryChange,
  years,
  data,
  title,
  selectLabel,
  language,
}: LineChartSelectorProps) {
  return (
    <div className="d-flex flex-column align-items-center mb-5">
      <h4 className="mb-3 text-center">{title}</h4>
      <Form.Select
        aria-label={selectLabel}
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="mb-4 w-auto"
        style={{ minWidth: 300 }}
      >
        {categories.map((cat) => {
          const displayName =
            language === "fr" ? categoryTranslations[cat] || cat : cat;
          return (
            <option key={cat} value={cat}>
              {displayName}
            </option>
          );
        })}
      </Form.Select>

      <div style={{ width: 900, height: 450 }}>
        <LineChart
          width={900}
          height={450}
          data={data}
          margin={{ top: 10, right: 30, bottom: 10, left: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="DarkSlateBlue" />
        </LineChart>
      </div>
    </div>
  );
}