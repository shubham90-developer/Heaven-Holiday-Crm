"use client";
import Flatpickr from "react-flatpickr";

type FlatpickrProps = {
  className?: string;
  value?: Date | string | [Date, Date];
  options?: Record<string, unknown>;
  placeholder?: string;
  style?: React.CSSProperties;
  onChange?: (dates: Date[]) => void;
};

const CustomFlatpickr = ({
  className,
  value,
  options,
  placeholder,
  style,
  onChange,
}: FlatpickrProps) => {
  const parsedValue =
    typeof value === "string" && value ? new Date(value) : value;

  return (
    <Flatpickr
      style={style}
      className={className}
      value={parsedValue}
      options={{ dateFormat: "d/m/Y", ...options }}
      placeholder={placeholder}
      onChange={(dates: Date[]) => onChange?.(dates)}
    />
  );
};

export default CustomFlatpickr;
