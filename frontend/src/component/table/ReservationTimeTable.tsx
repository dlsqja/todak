import React from "react";

interface ReservationData {
  time: string;
  records: {
    doctor: string;
    pet: string;
    owner: string;
  }[];
}

interface ReservationTimeTableProps {
  data: ReservationData[];
  onRowClick?: (record: {
    time: string;
    doctor: string;
    pet: string;
    owner: string;
  }) => void;
}

const ReservationTimeTable: React.FC<ReservationTimeTableProps> = ({
  data,
  onRowClick,
}) => {
  return (
    <div className="space-y-3">
      {data.map((group, idx) => (
        <div
          key={idx}
          className="bg-white rounded-[12px] shadow-[0px_5px_15px_rgba(0,0,0,0.08)] px-4 py-4 w-full min-w-[320px]"
        >
          <div>
            {group.records.map((record, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-4 gap-4 items-center text-center px-2 py-1 cursor-pointer hover:bg-gray-100 rounded-[8px] transition-colors"
                onClick={() =>
                  onRowClick?.({
                    time: group.time,
                    doctor: record.doctor,
                    pet: record.pet,
                    owner: record.owner,
                  })
                }
              >
                <h4 className="h4 text-left">{rIdx === 0 ? group.time : ""}</h4>
                <p className="p">{record.doctor}</p>
                <p className="p">{record.pet}</p>
                <p className="p">{record.owner}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationTimeTable;
