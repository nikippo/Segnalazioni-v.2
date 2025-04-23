import { ImmobiliareForm } from "@/components/immobiliare-form"

export default function ModificaPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Modifica Immobiliare</h1>
      <ImmobiliareForm id={params.id} />
    </div>
  )
}
