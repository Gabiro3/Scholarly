import { FC } from "react";

interface CustomDateSeparatorProps {
  date: Date;
}

const CustomDateSeparator: FC<CustomDateSeparatorProps> = ({ date }) => {
  const formatDate = (date: Date): string => {
    return `${date.toLocaleDateString('en-US', { dateStyle: 'long' })}`;
  };

  return (
    <div className="border-b-2 relative flex items-center justify-center my-6">
      <span className="absolute left-auto right-auto text-xs font-semibold text-gray-500 bg-white px-2">
        {formatDate(date)}
      </span>
    </div>
  );
};

export default CustomDateSeparator;