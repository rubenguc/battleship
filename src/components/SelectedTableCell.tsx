import { useState } from "react";

interface SelectedTableCellProps {
  isSelected: boolean;
  onSelected: () => void
}

export default function SelectedTableCell({ isSelected, onSelected }: SelectedTableCellProps) {
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
          <div className="absolute top-0 left-0 w-full h-full bg-yellow-300 z-50 rounded-full"></div>
        )
      }
    </div>
  )
}
