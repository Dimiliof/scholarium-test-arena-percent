
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

type MonitoringCardProps = {
  onAction: (action: string) => void;
};

const MonitoringCard = ({ onAction }: MonitoringCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Παρακολούθηση
        </CardTitle>
        <CardDescription>Παρακολούθηση απόδοσης συστήματος</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span>CPU Load:</span>
          <span className="font-medium">22%</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span>Disk Space:</span>
          <span className="font-medium">48% used</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Network:</span>
          <span className="font-medium">3.2 Mbps</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={() => onAction("Λήψη αναλυτικής αναφοράς")}
        >
          Αναλυτική Αναφορά
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MonitoringCard;
