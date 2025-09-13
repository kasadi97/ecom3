import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "../../../lib/prisma";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { get } from "http";

async function getSalesData(){
    const data = await prisma.order.aggregate({
        _sum: {
            pricePaidInCents: true
        },
        _count: true
    })
    await wait(2000); // simulate slow db
    return {
        amount: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count 
    }
}

function wait(ms: number){
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getUserData(){
    const [userCount, orderData] = await Promise.all([
        prisma.user.count(),
        prisma.order.aggregate({
            _sum: {pricePaidInCents: true}})
    ])
    return {
        userCount,
        averageValuePerUser: userCount === 0 ? 0 : ((orderData._sum.pricePaidInCents || 0) / 100) / userCount
    }
}

async function getProductData(){
    const [activeCount, inactiveCount] = await Promise.all([
        prisma.product.count({where: {isAvailableForPurchase: true}}),
        prisma.product.count({where: {isAvailableForPurchase: false}})
    ])
    return {
        activeCount,
        inactiveCount
    }
}


export default async function adminDashboard() {
    const [salesData, userData, productData] = await Promise.all([
        getSalesData(),
        getUserData(),
        getProductData()
    ])
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard title="Sales" subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} body={formatCurrency(salesData.amount)}></DashboardCard>
            <DashboardCard title="Customers" subtitle={`${formatCurrency(userData.averageValuePerUser)} Average Value`} body={formatNumber(userData.userCount)}></DashboardCard>
            <DashboardCard title="Active Products" subtitle={`${formatNumber(productData.inactiveCount)} Inactive`} body={formatNumber(productData.activeCount)}></DashboardCard>

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