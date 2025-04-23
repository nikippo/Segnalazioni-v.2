import { DataParser } from "@/components/data-parser"
import { ImportExport } from "@/components/import-export"

export default function StrumentiPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Strumenti</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <DataParser />
        <ImportExport />
      </div>
    </div>
  )
}
