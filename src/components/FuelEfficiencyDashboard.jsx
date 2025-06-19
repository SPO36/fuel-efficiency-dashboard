import { useCallback, useEffect, useState } from "react";
import {
  CHART_CONFIG,
  STATUS_SECTIONS_CONFIG,
  VEHICLE_DATA,
  getStaticData,
} from "../data/vehicleData";
import EfficiencyChart from "./EfficiencyChart";
import { StatusCard, TimeButtons } from "./StatusSection";

const FuelEfficiencyDashboard = () => {
  const [currentData, setCurrentData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRealTime, setIsRealTime] = useState(true);
  const [currentValue, setCurrentValue] = useState(92);
  const [previousValue, setPreviousValue] = useState(92);
  const [vehicleStatus, setVehicleStatus] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState("realtime");
  const [clickedDataIndex, setClickedDataIndex] = useState(null);

  const handleChartClick = (index) => {
    setClickedDataIndex(index);
    if (!isRealTime) {
      const targetData = getStaticData(selectedPeriod)[index];
      if (targetData && targetData.fullStatus) {
        setVehicleStatus(targetData.fullStatus);
      }
    }
  };

  const getAverageEfficiency = (data) => {
    if (!data || data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + item.efficiency, 0);
    return Math.round(sum / data.length);
  };

  // 실시간 데이터 업데이트
  const updateData = useCallback(() => {
    if (currentIndex >= VEHICLE_DATA.length) {
      setCurrentIndex(0);
      return;
    }

    const newDataPoint = VEHICLE_DATA[currentIndex];

    // 이전 값 저장 후 새 값 설정
    setPreviousValue(currentValue);
    setCurrentValue(newDataPoint.efficiency);
    setVehicleStatus(newDataPoint);

    setCurrentData((prev) => {
      const updated = [
        ...prev,
        { time: newDataPoint.timestamp, efficiency: newDataPoint.efficiency },
      ];
      return updated.length > CHART_CONFIG.maxDataPoints
        ? updated.slice(-CHART_CONFIG.maxDataPoints)
        : updated;
    });

    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex, currentValue]); // currentValue 의존성 추가

  // 실시간 업데이트 효과
  useEffect(() => {
    if (!isRealTime) return;
    const interval = setInterval(updateData, CHART_CONFIG.updateInterval);
    return () => clearInterval(interval);
  }, [isRealTime, updateData]);

  // 초기 데이터 로드
  useEffect(() => {
    const initialData = VEHICLE_DATA.slice(0, CHART_CONFIG.maxDataPoints).map(
      (item) => ({
        time: item.timestamp,
        efficiency: item.efficiency,
      })
    );
    setCurrentData(initialData);
    setVehicleStatus(VEHICLE_DATA[11] || VEHICLE_DATA[0]);
  }, []);

  // handlePeriodChange 함수를 다음과 같이 수정
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setIsRealTime(period === "realtime");

    if (period === "realtime") {
      // Real-Time으로 돌아갈 때 모든 상태 초기화
      setCurrentIndex(0);
      setCurrentData([]);

      // 첫 번째 데이터로 초기화
      const firstData = VEHICLE_DATA[0];
      if (firstData) {
        setPreviousValue(currentValue); // 현재값을 이전값으로
        setCurrentValue(firstData.efficiency);
        setVehicleStatus(firstData);
      }
    } else {
      // 다른 기간 선택 시 정적 데이터 로드
      const data = getStaticData(period);
      setCurrentData(data);
      if (data.length > 0) {
        const avg = getAverageEfficiency(data);
        setPreviousValue(currentValue);
        setCurrentValue(avg);
        setVehicleStatus(data[data.length - 1].fullStatus);
      }
    }
  };

  // UP/DOWN 상태 계산
  // getTrendStatus 함수를 다음과 같이 수정
  const getTrendStatus = () => {
    if (currentValue > previousValue) {
      return {
        direction: "UP",
        color: "rgba(34, 197, 94, 0.2)",
        textColor: "rgba(20, 202, 116, 1)",
        icon: "▲",
      };
    } else if (currentValue < previousValue) {
      return {
        direction: "DOWN",
        color: "rgba(255, 90, 101, 0.2)",
        textColor: "rgba(255, 90, 101, 1)",
        icon: "▼",
      };
    } else {
      return {
        direction: "SAME",
        color: "rgba(156, 163, 175, 0.2)",
        textColor: "rgb(156, 163, 175)",
        icon: "●",
      };
    }
  };

  const trendStatus = getTrendStatus();

  // 상태 섹션 데이터 생성
  const statusSections = STATUS_SECTIONS_CONFIG.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      status: vehicleStatus[item.key] || item.defaultValue,
    })),
  }));

  return (
    <div
      className="relative flex items-center bg-cover bg-no-repeat bg-center bg-fixed min-h-screen text-white"
      style={{
        backgroundImage: "url('/images/bg.png')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-slate-900/80 to-black/50"></div>

      <div className="z-10 relative px-4 py-8 w-full">
        <div className="space-y-5 mx-auto p-20 max-w-full">
          {/* Header */}
          <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-4">
            <h1 className="font-light text-3xl">Fuel Efficiency Index</h1>
            <TimeButtons
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
            />
          </div>

          {/* Chart */}
          <EfficiencyChart
            data={currentData}
            currentValue={currentValue}
            trendStatus={trendStatus}
            isRealTime={isRealTime}
            vehicleStatus={vehicleStatus}
            onChartClick={handleChartClick}
            clickedDataIndex={clickedDataIndex}
            selectedPeriod={selectedPeriod}
          />

          {/* Status Grid */}
          <div className="gap-6 grid grid-cols-1 lg:grid-cols-3 pt-4">
            {statusSections.map((section, index) => (
              <StatusCard
                key={index}
                title={section.title}
                items={section.items}
                isRealTime={isRealTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelEfficiencyDashboard;
