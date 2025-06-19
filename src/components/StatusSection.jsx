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
      className={`badge ${getStatusClass()} badge-xl rounded-full font-medium`}
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
    <div className="flex items-center gap-5">
      <div className="w-14 h-14">
        <img
          src={`/images/${icon}.png`} // icons 폴더 제거
          alt={label}
          className="w-full h-full object-contain"
        />
      </div>
      <span style={{ color: "#AEB9E1" }} className="text-2xl">
        {label}
      </span>
    </div>
    <StatusBadge status={status} />
  </div>
);

export const StatusCard = ({ title, items, isRealTime }) => (
  <div>
    <h3 className="mb-4 font-light text-3xl">{title}</h3>
    <div
      className="backdrop-blur-md card"
      style={{
        backgroundColor: "rgba(11, 23, 57, 0.4)",
        border: "0.5px solid rgba(152, 163, 199, 0.3)",
      }}
    >
      <div className="card-body">
        <div className="space-y-3">
          {items.map((item, index) => {
            // key를 별도로 분리하고 나머지 props만 전달
            const { key, ...itemProps } = item;
            return <StatusItem key={index} {...itemProps} isUpdating={false} />;
          })}
        </div>
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
          className={`btn btn-xl transition-all duration-200 rounded-full ${
            selectedPeriod === period.id
              ? "btn-primary"
              : "btn-ghost hover:btn-outline"
          }`}
          style={{
            height: "44px",
            padding: "0px 24px", // 상하 6px, 좌우 16px
          }}
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
