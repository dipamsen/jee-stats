import "./styles.css";
import Chart from "./Chart";
import {
  Checkbox,
  Container,
  Box,
  FormLabel as Label,
  Radio,
  RadioGroup,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  FormControl,
  FormControlLabel,
  useMediaQuery,
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
  const [yearRange, setYearRange] = useState<[number, number]>([2018, 2023]);
  const [subject, setSubject] = useState<number>(0);
  const [sort, setSort] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("total");
  useEffect(() => {
    fetch("/jee-data-parsed.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  type ParseData = {
    name: string;
    value: number;
  };

  const renderData: ParseData[] =
    data.length > 0
      ? data[subject].chapters.map((chapter: any) => {
          return {
            name: chapter.name,
            value: range(...yearRange).reduce((s: number, y: number) => s + (chapter.questData.yearWise[y]?.[filter] ?? 0), 0),
          };
        })
      : [];

  if (sort) {
    renderData.sort((a, b) => b.value - a.value);
  }
  const isMobile = useMediaQuery("(max-width: 600px)");
  return data.length > 0 ? (
    <ThemeProvider theme={createTheme({ palette: { mode: "dark" } })}>
      <CssBaseline />
      <Container>
        <Typography variant="h3" sx={{ margin: "20pt 0", fontWeight: "bold" }}>
          JEE Question Statistics
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "" : "repeat(2, auto)", gridGap: "1fr" }}>
          <FormControl>
            <Label>Years:</Label>
            <Slider style={{ width: 300, marginTop: 10 }} value={yearRange} onChange={(_e, v) => Array.isArray(v) && setYearRange([v[0], v[1]])} min={2002} max={2023} valueLabelDisplay="on" />
          </FormControl>
          <FormControl>
            <Label>Subject:</Label>
            <ToggleButtonGroup color="primary" value={subject} exclusive onChange={(_e, v) => setSubject(v!)} aria-label="Subject">
              <ToggleButton value={0}>Physics</ToggleButton>
              <ToggleButton value={1}>Chemistry</ToggleButton>
              <ToggleButton value={2}>Maths</ToggleButton>
            </ToggleButtonGroup>
          </FormControl>
          <FormControlLabel control={<Checkbox checked={sort} onChange={(e) => setSort(e.target.checked)} />} label="Sort Descending" />
          <RadioGroup row value={filter} onChange={(_e, v) => setFilter(v)} aria-label="Sort">
            <FormControlLabel value={"total"} control={<Radio />} label="All" />
            <FormControlLabel value={"singleCorrect"} control={<Radio />} label="MCQ" />
            <FormControlLabel value={"numerical"} control={<Radio />} label="Numeric" />
          </RadioGroup>
        </Box>
        <Chart data={renderData} />
      </Container>
    </ThemeProvider>
  ) : (
    <div>Loading...</div>
  );
}
