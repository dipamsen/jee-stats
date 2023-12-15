// @ts-nocheck
import "./styles.css";
import Chart from "./Chart";
import {
  Checkbox,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useState } from "react";

const range = (a: number, b: number) => {
  const res = [];
  for (let i = a; i <= b; i++) {
    res.push(i);
  }
  return res;
};
export default function App() {
  const [data, setData] = useState<any[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([]);
  const [subject, setSubject] = useState<string>("1");
  const [sort, setSort] = useState<boolean>(false);
  useEffect(() => {
    fetch("/jee-data-parsed.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        const years = Object.keys(data[0].chapters[0].questData.yearWise);
        setYearRange([+years[0], +years.at(-1)!]);
      });
  }, []);

  const renderData =
    data.length > 0
      ? data[subject].chapters.map((chapter: any) => {
          return {
            name: chapter.name,
            value: range(...yearRange).reduce(
              (s: number, y: number) =>
                s + (chapter.questData.yearWise[y]?.total ?? 0),
              0
            ),
          };
        })
      : [];
  
  if (sort) {
    renderData.sort((a, b) => b.value - a.value);
  }
  return data.length > 0 ? (
    <div>
      <h1>JEE Question Statistics</h1>
      <div
        style={{
          display: "flex",
          gap: "2em",
          alignItems: "center",
          margin: 10,
        }}
      >
        <div>Years:</div>
        <Slider
          style={{ width: 300, marginTop: 0 }}
          value={yearRange}
          onChange={(e, v) => setYearRange(v)}
          min={2002}
          max={2023}
          valueLabelDisplay="on"
        />
        <div style={{ marginLeft: 20 }}>Subject:</div>
        <ToggleButtonGroup
          color="primary"
          value={subject}
          exclusive
          onChange={(e, v) => v && setSubject(v!)}
          aria-label="Subject"
        >
          <ToggleButton value="0">Physics</ToggleButton>
          <ToggleButton value="1">Chemistry</ToggleButton>
          <ToggleButton value="2">Maths</ToggleButton>
        </ToggleButtonGroup>
        <div style={{ marginLeft: 20 }}></div>
        <Checkbox checked={sort} onChange={(e) => setSort(e.target.checked)} />
        Sort Descending
      </div>

      <Chart data={renderData}  />
    </div>
  ) : (
    <div>Loading...</div>
  );
}
