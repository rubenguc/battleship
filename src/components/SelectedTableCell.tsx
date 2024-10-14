import { useState } from "react";

interface SelectedTableCellProps {
  isSelected: boolean;
  isHitted: boolean;
  onSelected: () => void
}

export default function SelectedTableCell({ isSelected, isHitted, onSelected }: SelectedTableCellProps) {
  const [showHover, setShowHover] = useState(false);


  const onSelectCell = () => {
    if (!isSelected) onSelected();
  }

  return (
    <div
      onMouseEnter={() => setShowHover(true)}
      onMouseLeave={() => setShowHover(false)}
      onClick={onSelectCell}
      className="flex items-center justify-center absolute w-full h-full z-30"
    >
      {
        (showHover || isSelected) && (
          <div className={`absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full h-full ${isHitted ? "bg-red-500" : "bg-yellow-300"} z-50 scale-75 rounded-full`}></div>
        )
      }
    </div>
  )
}
