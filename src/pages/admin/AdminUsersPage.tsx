import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { User } from "@/types/auth";

const AdminUsersPage = () => {
  const { user, getAllUsers, fixAdminEmail, makeUserTeacherAndAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = getAllUsers();
        setUsers(allUsers);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  const handleFixAdminEmail = async (email: string) => {
    try {
      await fixAdminEmail(email);
      // After fixing the admin email, refresh the user list
      const updatedUsers = getAllUsers();
      setUsers(updatedUsers);
      alert(`Ο ρόλος του χρήστη ${email} ενημερώθηκε σε διαχειριστή.`);
    } catch (err: any) {
      setError(err.message || "Failed to fix admin email");
      alert(`Σφάλμα κατά την ενημέρωση του ρόλου: ${err.message}`);
    }
  };
  
  const handleMakeUserTeacherAndAdmin = async (email: string) => {
    try {
      await makeUserTeacherAndAdmin(email);
      // After making the user teacher and admin, refresh the user list
      const updatedUsers = getAllUsers();
      setUsers(updatedUsers);
      alert(`Ο χρήστης ${email} έγινε εκπαιδευτικός και διαχειριστής.`);
    } catch (err: any) {
      setError(err.message || "Failed to make user teacher and admin");
      alert(`Σφάλμα κατά την ενημέρωση του ρόλου: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Διαχείριση Χρηστών - Admin</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-4">Διαχείριση Χρηστών</h1>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Όνομα</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ρόλος</TableHead>
              <TableHead>Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.email !== "liofisdimitris@gmail.com" && (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => handleMakeUserTeacherAndAdmin(user.email)}
                    >
                      Κάνε Εκπαιδευτικό & Admin
                    </button>
                  )}
                  {user.email !== "liofisdimitris@gmail.com" && (
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleFixAdminEmail(user.email)}
                    >
                      Κάνε Admin
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
