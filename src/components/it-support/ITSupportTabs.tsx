
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemTab from "./SystemTab";
import UsersTab from "./UsersTab";
import LogsTab from "./LogsTab";
import SecurityTab from "./SecurityTab";

type ITSupportTabsProps = {
  onAction: (action: string) => void;
};

const ITSupportTabs = ({ onAction }: ITSupportTabsProps) => {
  return (
    <Tabs defaultValue="system" className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="system">Σύστημα</TabsTrigger>
        <TabsTrigger value="users">Χρήστες</TabsTrigger>
        <TabsTrigger value="logs">Καταγραφές</TabsTrigger>
        <TabsTrigger value="security">Ασφάλεια</TabsTrigger>
      </TabsList>
      
      <TabsContent value="system" className="space-y-4">
        <SystemTab onAction={onAction} />
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <UsersTab onAction={onAction} />
      </TabsContent>
      
      <TabsContent value="logs" className="space-y-4">
        <LogsTab onAction={onAction} />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <SecurityTab onAction={onAction} />
      </TabsContent>
    </Tabs>
  );
};

export default ITSupportTabs;
