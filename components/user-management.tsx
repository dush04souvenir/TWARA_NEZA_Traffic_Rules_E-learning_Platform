"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { getUsers, deleteUser } from "@/lib/actions/admin-actions"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    const res = await deleteUser(id)
    if (res.error) {
      toast.error(res.error)
    } else {
      toast.success("User deleted")
      loadUsers()
    }
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>User Management</CardTitle>
        <Button size="sm" onClick={loadUsers} variant="outline">Refresh</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between py-3 border-b border-border last:border-0"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{user.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary uppercase">
                  {user.role}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-center text-muted-foreground">No users found.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
