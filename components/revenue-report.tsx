"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
    id: string
    learnerName: string
    learnerEmail: string
    item: string
    amount: number
    date: Date
    status: string
}

interface RevenueReportProps {
    transactions: Transaction[]
}

export function RevenueReport({ transactions }: RevenueReportProps) {
    // Calculate totals
    const total = transactions.reduce((acc, curr) => acc + curr.amount, 0)

    const downloadCSV = () => {
        const headers = ["Date", "Learner Name", "Email", "Item", "Amount (RWF)", "Status"]
        const rows = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.learnerName,
            t.learnerEmail,
            t.item,
            t.amount,
            t.status
        ])

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "revenue_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Revenue & Transactions</CardTitle>
                    <CardDescription>Detailed log of all payments received</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold text-primary">{total.toLocaleString()} RWF</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={downloadCSV}>
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Learner</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Payment & Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No transactions found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell className="font-mono text-xs">
                                        {new Date(t.date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{t.learnerName}</span>
                                            <span className="text-xs text-muted-foreground">{t.learnerEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{t.item}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                            {t.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {t.amount.toLocaleString()} RWF
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
