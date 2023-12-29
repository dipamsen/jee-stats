import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const initials = (txt: string) => {
  return txt
    .split(" ")
    .map((word) => word[0])
    .filter((l, i) => i == 0 || (l == l.toUpperCase() && l != l.toLowerCase()))
    .join("")
    .slice(0, 3);
};

export default function Chart({ data }: any) {
  return (
    <BarChart
      width={1080}
      height={450}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" allowDataOverflow={true} allowReorder="yes" tickFormatter={(tick) => initials(tick)} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Bar
        dataKey={"value"}
        barSize={25}
        label={(x) => (
          <text fill="#fff" transform={`translate(${x.x + x.width / 2 + 5}, ${x.y + x.height - 5}) rotate(-90)`}>
            {x.name}
          </text>
        )}
        fill="#A87A81"
      />
    </BarChart>
  );
}
