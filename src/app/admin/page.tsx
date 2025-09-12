import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function adminDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle="test" body="body"></DashboardCard>
            <DashboardCard title="Sales" subtitle="test" body="body"></DashboardCard>
            <DashboardCard title="Sales" subtitle="test" body="body"></DashboardCard>
    </div>
    )
}

type DashboardCardProps ={
    title: string
    subtitle: string
    body: string
}

function DashboardCard({title,subtitle, body}:
DashboardCardProps){
    return (
        <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
        </CardHeader>
        
        <CardContent>{body}</CardContent>
        </Card>
    )
}