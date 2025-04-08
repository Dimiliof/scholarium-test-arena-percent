
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SystemStatusCard from "./SystemStatusCard";
import DatabaseCard from "./DatabaseCard";
import MonitoringCard from "./MonitoringCard";

type SystemTabProps = {
  onAction: (action: string) => void;
};

const SystemTab = ({ onAction }: SystemTabProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSystemName, setNewSystemName] = useState("");
  const [newSystemStatus, setNewSystemStatus] = useState("");

  const handleAddSystem = () => {
    if (newSystemName && newSystemStatus) {
      onAction(`add_system:${newSystemName}:${newSystemStatus}`);
      setNewSystemName("");
      setNewSystemStatus("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button 
          onClick={() => setIsDialogOpen(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Προσθήκη Συστήματος
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SystemStatusCard onAction={onAction} />
        <DatabaseCard onAction={onAction} />
        <MonitoringCard onAction={onAction} />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Προσθήκη Νέου Συστήματος</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Όνομα
              </Label>
              <Input
                id="name"
                value={newSystemName}
                onChange={(e) => setNewSystemName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Κατάσταση
              </Label>
              <Input
                id="status"
                value={newSystemStatus}
                onChange={(e) => setNewSystemStatus(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddSystem}>Προσθήκη</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemTab;
