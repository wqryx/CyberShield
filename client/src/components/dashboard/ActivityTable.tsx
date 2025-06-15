import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

export interface Activity {
  id: string;
  date: string;
  module: string;
  activity: string;
  status: "completed" | "warning" | "error";
}

interface ActivityTableProps {
  activities: Activity[];
}

export function ActivityTable({ activities }: ActivityTableProps) {
  const getStatusBadgeClass = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusLabel = (status: Activity["status"]) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "warning":
        return "Atención";
      case "error":
        return "Error";
      default:
        return "Desconocido";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
              Fecha
            </TableHead>
            <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
              Módulo
            </TableHead>
            <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
              Actividad
            </TableHead>
            <TableHead className="py-2 px-4 text-left text-xs font-medium uppercase tracking-wider">
              Estado
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {activities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-muted/50">
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {formatDate(activity.date)}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {activity.module}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {activity.activity}
              </TableCell>
              <TableCell className="py-3 px-4">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                    activity.status
                  )}`}
                >
                  {getStatusLabel(activity.status)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
