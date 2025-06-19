import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EfficiencyChart = ({ data, currentValue, trendStatus, isRealTime }) => {
  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="shadow-xl backdrop-blur-md p-3 rounded-lg"
          style={{
            backgroundColor: "rgba(11, 23, 57, 0.8)",
            border: "0.5px solid rgba(152, 163, 199, 0.3)",
          }}
        >
          <p className="opacity-70 text-sm">{`Time: ${label}`}</p>
          <p className="font-semibold text-primary text-sm">
            {`Efficiency: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // 커스텀 도트 컴포넌트 (값 포함)
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    return (
      <g>
        {/* 점 */}
        <circle
          cx={cx}
          cy={cy}
          r={0}
          fill="#8b5cf6" // 라인 색깔과 동일
          stroke="none" // 흰색 테두리 제거
        />
        {/* 값 라벨 */}
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          fontSize="20"
          fill="url(#textGradient)" // 그라데이션 적용
          fontWeight="500"
        >
          {payload.efficiency}
        </text>
      </g>
    );
  };

  return (
    <div
      className="shadow-2xl backdrop-blur-md card"
      style={{
        backgroundColor: "rgba(11, 23, 57, 0.4)",
        border: "0.5px solid rgba(152, 163, 199, 0.3)",
      }}
    >
      <div className="card-body">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="opacity-70 text-2xl">Current Value</div>
            <div className="font-bold text-primary text-5xl">
              {currentValue}
            </div>
            {isRealTime && (
              <div className={`gap-1 badge ${trendStatus.color}`}>
                <span>{trendStatus.icon}</span> {trendStatus.direction}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="bg-primary rounded-full w-3 h-3"></div>
            <span className="opacity-70 text-sm">Fuel Efficiency Score</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 35, right: 30, left: 0, bottom: 20 }}
              animationDuration={800}
            >
              <defs>
                <linearGradient
                  id="efficiencyGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                </linearGradient>
                {/* 텍스트 그라데이션 추가 */}
                <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" /> {/* 위쪽: 라인색 */}
                  <stop offset="100%" stopColor="#c4b5fd" />{" "}
                  {/* 아래쪽: 밝은 보라색 */}
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="2 2"
                stroke="rgba(255,255,255,0.1)"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                axisLine={false}
                tickLine={false}
                tick={{ dy: 10, fill: "#AEB9E180" }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 140]}
                stroke="rgba(255,255,255,0.6)"
                fontSize={14}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#AEB9E180" }}
                width={35}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke="#8b5cf6"
                strokeWidth={3}
                fill="url(#efficiencyGradient)"
                dot={<CustomDot />}
                animationDuration={800}
                animationEasing="ease-in-out"
                activeDot={{
                  r: 0,
                  stroke: "#8b5cf6",
                  strokeWidth: 3,
                  fill: "#1e293b",
                  filter: "url(#glow)",
                }}
              />
              {/* 현재 값 표시점 (마지막 점 강조) */}
              {data.length > 0 && (
                <Line
                  type="monotone"
                  dataKey="efficiency"
                  stroke="transparent"
                  strokeWidth={0}
                  dot={(props) => {
                    if (props.index === data.length - 1) {
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill="#8b5cf6"
                          stroke="#ffffff"
                          strokeWidth={3}
                          className="animate-pulse"
                        />
                      );
                    }
                    return null;
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EfficiencyChart;
