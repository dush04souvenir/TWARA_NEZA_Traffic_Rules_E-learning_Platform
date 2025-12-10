import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminSettings() {
    return (
        <Card className="border-border">
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Platform Name</label>
                    <Input defaultValue="TWARA NEZA" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Support Email</label>
                    <Input defaultValue="contact@tawaraneza.rw" />
                </div>
                <Button>Save Changes</Button>
            </CardContent>
        </Card>
    )
}
