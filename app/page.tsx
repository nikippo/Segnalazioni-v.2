import { ImmobiliareDataTable } from "@/components/immobiliare-data-table"

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gestionale Dati Immobiliari</h1>
      <ImmobiliareDataTable />
    </div>
  )
}
