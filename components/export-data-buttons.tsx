"use client"

import { Button } from "@/components/ui/button"
import * as XLSX from "xlsx"

export function ExportDataButtons() {

    // Mock data for export - In a real app, this would be passed as props or fetched
    const getExportData = () => {
        return [
            { id: "ST-001", name: "Alice M", email: "alice@gmail.com", module: "Theory", score: 85, status: "Passed", date: "2024-05-15" },
            { id: "ST-002", name: "Bob D", email: "bob@gmail.com", module: "Hazard Perception", score: 62, status: "Failed", date: "2024-05-16" },
            { id: "ST-003", name: "Charlie K", email: "charlie@gmail.com", module: "Road Signs", score: 92, status: "Passed", date: "2024-05-16" },
            { id: "ST-004", name: "Dana W", email: "dana@gmail.com", module: "Theory", score: 78, status: "Passed", date: "2024-05-17" },
            { id: "ST-005", name: "Eve P", email: "eve@gmail.com", module: "Parking", score: 45, status: "Failed", date: "2024-05-18" },
            { id: "ST-006", name: "Frank R", email: "frank@gmail.com", module: "Road Signs", score: 88, status: "Passed", date: "2024-05-18" },
            { id: "ST-007", name: "Grace L", email: "grace@gmail.com", module: "Theory", score: 95, status: "Passed", date: "2024-05-19" },
            { id: "ST-008", name: "Henry T", email: "henry@gmail.com", module: "Hazard Perception", score: 71, status: "Passed", date: "2024-05-19" },
            { id: "ST-009", name: "Ivy C", email: "ivy@gmail.com", module: "Parking", score: 82, status: "Passed", date: "2024-05-20" },
            { id: "ST-010", name: "Jack N", email: "jack@gmail.com", module: "Theory", score: 68, status: "Failed", date: "2024-05-20" },
        ]
    }

    const exportCSV = () => {
        const data = getExportData()
        const headers = Object.keys(data[0])
        const csvContent = [
            headers.join(","), // Header row
            ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName as keyof typeof row])).join(",")) // Data rows
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `manager_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const exportExcel = () => {
        const data = getExportData()
        const worksheet = XLSX.utils.json_to_sheet(data)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Data")
        XLSX.writeFile(workbook, `manager_report_${new Date().toISOString().split('T')[0]}.xlsx`)
    }

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={exportCSV}
                className="text-primary text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            >
                Export CSV
            </button>
            <span className="text-muted-foreground">•</span>
            <button
                onClick={exportExcel}
                className="text-primary text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            >
                Export Excel
            </button>
        </div>
    )
}
