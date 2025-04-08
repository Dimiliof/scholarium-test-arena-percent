
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemTab from "./SystemTab";
import UsersTab from "./UsersTab";
import LogsTab from "./LogsTab";
import SecurityTab from "./SecurityTab";

type ITSupportTabsProps = {
  onAction: (action: string) => void;
};

const ITSupportTabs = ({ onAction }: ITSupportTabsProps) => {
  const [activeTab, setActiveTab] = useState("system");
  const [actionPerformed, setActionPerformed] = useState(false);

  // Wrapper για το onAction που καταγράφει όταν εκτελείται μια ενέργεια
  const handleAction = (action: string) => {
    onAction(action);
    setActionPerformed(true);
    
    // Εμφάνιση ενημερωτικού μηνύματος μετά την προσθήκη συστήματος
    if (action.startsWith("add_system")) {
      const notification = document.createElement("div");
      notification.className = "fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50";
      notification.style.animation = "fade-in 0.3s, fade-out 0.3s 2.7s";
      notification.innerHTML = `<strong>Επιτυχία!</strong> Το σύστημα προστέθηκε επιτυχώς.`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
    }
  };
  
  return (
    <Tabs defaultValue="system" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="system">Σύστημα</TabsTrigger>
        <TabsTrigger value="users">Χρήστες</TabsTrigger>
        <TabsTrigger value="logs">Καταγραφές</TabsTrigger>
        <TabsTrigger value="security">Ασφάλεια</TabsTrigger>
      </TabsList>
      
      <TabsContent value="system" className="space-y-4">
        <SystemTab onAction={handleAction} />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UsersTab onAction={handleAction} />
      </TabsContent>
      
      <TabsContent value="logs" className="space-y-4">
        <LogsTab onAction={handleAction} />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <SecurityTab onAction={handleAction} />
      </TabsContent>
    </Tabs>
  );
};

export default ITSupportTabs;
