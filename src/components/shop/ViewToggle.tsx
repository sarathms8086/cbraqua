import { Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";

interface ViewToggleProps {
  columns: number;
  setColumns: (cols: number) => void;
}

const ViewToggle = ({ columns, setColumns }: ViewToggleProps) => {
  const options = [
    { cols: 2, icon: Grid2X2 },
    { cols: 3, icon: Grid3X3 },
    { cols: 4, icon: LayoutGrid },
  ];

  return (
    <div className="flex items-center gap-1">
      {options.map(({ cols, icon: Icon }) => (
        <button
          key={cols}
          onClick={() => setColumns(cols)}
          className={`p-1.5 transition-colors ${
            columns === cols ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`${cols} column view`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
