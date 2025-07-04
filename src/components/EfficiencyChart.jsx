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
import { getCurrentSummary } from "../data/vehicleData"; // import 추가

const EfficiencyChart = ({
  data,
  currentValue,
  trendStatus,
  isRealTime,
  vehicleStatus,
  onChartClick,
  clickedDataIndex,
  selectedPeriod,
}) => {
  // 현재 상태 요약 생성
  const currentSummary = getCurrentSummary(vehicleStatus || {});

  // 차트 클릭 핸들러
  const handleAreaClick = (event) => {
    if (!isRealTime && onChartClick && event.activeTooltipIndex !== undefined) {
      onChartClick(event.activeTooltipIndex);
    }
  };

  const getValueLabel = () => {
    if (isRealTime) return "Current Efficiency";
    if (selectedPeriod === "today") return "Today’s Avg Efficiency";
    if (selectedPeriod === "week") return "Weekly Avg Efficiency";
    if (selectedPeriod === "month") return "Monthly Avg Efficiency";
    if (selectedPeriod === "year") return "Yearly Avg Efficiency";
    return "Efficiency";
  };

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="backdrop-blur-md p-3 rounded-lg"
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
        {isRealTime ? (
          ""
        ) : (
          <text
            x={cx}
            y={cy - 15}
            textAnchor="middle"
            fontSize="26"
            fill="url(#textGradient)" // 그라데이션 적용
            fontWeight="500"
          >
            {payload.efficiency}
          </text>
        )}
      </g>
    );
  };

  return (
    <div
      className="backdrop-blur-md px-4 card"
      style={{
        backgroundColor: "rgba(11, 23, 57, 0.4)",
        border: "0.5px solid rgba(152, 163, 199, 0.3)",
      }}
    >
      <div className="card-body">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center mb-4">
          <div className="flex items-center gap-4">
            <div className="opacity-70 text-2xl">{getValueLabel()}</div>
            <div className="font-bold text-primary text-5xl">
              {currentValue}
            </div>
            {isRealTime && (
              <div
                className="gap-1 rounded-full badge-xl"
                style={{
                  backgroundColor: trendStatus.color,
                  color: trendStatus.textColor,
                  border: `1px solid ${trendStatus.textColor}30`,
                }}
              >
                <span>{trendStatus.icon}</span> {trendStatus.direction}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <div className="bg-primary rounded-full w-3 h-3"></div>
            <span
              style={{ color: "rgba(171, 185, 255, 1)" }}
              className="opacity-70 text-2xl"
            >
              Fuel Efficiency Score
            </span>
          </div>
        </div>

        {/* 요약 메시지 - 항상 높이 유지하되 실시간 모드에서만 내용 표시 */}
        <div className="flex justify-center items-center mb-6 h-7 text-center">
          {isRealTime && (
            <p
              className={`text-2xl font-medium ${
                currentSummary.color || "text-white"
              }`}
            >
              {currentSummary.message || "현재 주행 상태를 분석 중입니다."}
            </p>
          )}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 30, right: 40, left: 40, bottom: 40 }}
              animationDuration={800}
              onClick={handleAreaClick}
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
                fontSize={20}
                axisLine={false}
                tickLine={false}
                tick={{ dy: 20, fill: "#AEB9E180" }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                stroke="rgba(255,255,255,0.6)"
                fontSize={20}
                axisLine={false}
                tickLine={false}
                tick={{ dx: -20, fill: "#AEB9E180" }}
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
