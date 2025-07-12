
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  action: string;
  description: string;
  user: string;
  timestamp: string;
  status?: "success" | "warning" | "error" | "default";
}

interface RecentActivityTableProps {
  activities: Activity[];
  className?: string;
}

export const RecentActivityTable = ({
  activities,
  className,
}: RecentActivityTableProps) => {
  return (
    <div className={cn("enap-card", className)}>
      <h3 className="text-lg font-semibold mb-4">Activités récentes</h3>
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs uppercase text-muted-foreground border-b">
              <th className="text-left p-2 pl-0 font-medium">Action</th>
              <th className="text-left p-2 font-medium">Description</th>
              <th className="text-left p-2 font-medium">Utilisateur</th>
              <th className="text-left p-2 font-medium">Horodatage</th>
              <th className="text-right p-2 pr-0 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {activities.map((activity) => (
              <tr key={activity.id} className="text-sm">
                <td className="p-2 pl-0">{activity.action}</td>
                <td className="p-2">{activity.description}</td>
                <td className="p-2">{activity.user}</td>
                <td className="p-2">{activity.timestamp}</td>
                <td className="p-2 pr-0 text-right">
                  {activity.status && (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        activity.status === "success" &&
                          "bg-green-50 text-green-600",
                        activity.status === "warning" &&
                          "bg-orange-50 text-orange-600",
                        activity.status === "error" &&
                          "bg-red-50 text-red-600",
                        activity.status === "default" &&
                          "bg-blue-50 text-blue-600"
                      )}
                    >
                      {activity.status === "success" && "Complété"}
                      {activity.status === "warning" && "En attente"}
                      {activity.status === "error" && "Échoué"}
                      {activity.status === "default" && "Information"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
