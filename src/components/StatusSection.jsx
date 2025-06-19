import { TIME_PERIODS } from "../data/vehicleData";

export const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    if (status === "Good") return "badge-success";
    if (status === "Bad") return "badge-error";
    if (status === "ON") return "badge-info";
    if (status === "OFF") return "badge-warning";
    return "badge-ghost";
  };

  return (
    <div
      className={`badge ${getStatusClass()} badge-lg rounded-full font-medium`}
    >
      {status}
    </div>
  );
};

export const StatusItem = ({ icon, label, status, isUpdating = false }) => (
  <div
    className={`flex justify-between items-center py-2 rounded-lg transition-all duration-300 ${
      isUpdating ? "animate-pulse" : ""
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10">
        <img
          src={`/images/${icon}.png`} // icons 폴더 제거
          alt={label}
          className="w-full h-full object-contain"
        />
      </div>
      <span style={{ color: "#AEB9E1" }} className="text-xl">
        {label}
      </span>
    </div>
    <StatusBadge status={status} />
  </div>
);

export const StatusCard = ({ title, items, isRealTime }) => (
  <div
    className="shadow-2xl backdrop-blur-md card"
    style={{
      backgroundColor: "rgba(11, 23, 57, 0.4)",
      border: "0.5px solid rgba(152, 163, 199, 0.3)",
    }}
  >
    <div className="card-body">
      <h3 className="opacity-70 mb-4 text-xl">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => {
          // key를 별도로 분리하고 나머지 props만 전달
          const { key, ...itemProps } = item;
          return <StatusItem key={index} {...itemProps} isUpdating={false} />;
        })}
      </div>
    </div>
  </div>
);

export const TimeButtons = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {TIME_PERIODS.map((period) => (
        <button
          key={period.id}
          onClick={() => onPeriodChange(period.id)}
          className={`btn btn-md transition-all duration-200 ${
            selectedPeriod === period.id
              ? "btn-primary rounded-full" // 선택된 버튼
              : "btn-ghost rounded-full hover:btn-outline" // 선택되지 않은 버튼
          }`}
        >
          {period.icon && period.id === "realtime" && (
            <span className="bg-red-500 mr-2 rounded-full w-2 h-2 animate-pulse"></span>
          )}
          {period.label}
        </button>
      ))}
    </div>
  );
};
