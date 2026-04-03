import { flexRender, Row } from "@tanstack/react-table";
import { useDrag } from "react-dnd";
import { TableCell, TableRow } from "../../shadcn/table";
import { Task } from "@/src/types/task";

interface ListItemProps {
  row: Row<Task>;
}

export function ListItem({ row }: ListItemProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "task",
      item: { id: row.original.id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [row.original.id],
  );

  return (
    <TableRow
      ref={(node) => {
        if (node) drag(node);
      }}
      className={`group cursor-grab active:cursor-grabbing transition-colors ${
        isDragging ? "opacity-50" : "opacity-100"
      } hover:bg-muted/50`}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          style={{
            width: cell.column.getSize(),
            minWidth: cell.column.columnDef.minSize,
          }}
          className="px-4 py-2"
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
