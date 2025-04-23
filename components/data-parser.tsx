"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"

export function DataParser() {
  const { toast } = useToast()
  const { isDuplicate, addImmobiliare } = useDatabase()
  const [inputData, setInputData] = useState("")
  const [duplicates, setDuplicates] = useState<string[]>([])

  const handleParse = () => {
    if (!inputData.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci i dati da analizzare",
        variant: "destructive",
      })
      return
    }

    try {
      // Esempio di parsing per il formato fornito dall'utente
      const lines = inputData.trim().split("\n")

      // Rimuovi l'intestazione se presente
      if (lines[0].includes("CODICE FISCALE") && lines[0].includes("DENOMINAZIONE")) {
        lines.shift()
      }

      const foundDuplicates: string[] = []
      let newItemsCount = 0

      for (const line of lines) {
        if (!line.trim()) continue

        // Cerca di estrarre il codice fiscale e la denominazione
        const parts = line.split("\t")

        if (parts.length >= 4) {
          const codiceFiscale = parts[0].trim()
          let denominazione = ""
          let comune = ""

          // Cerca la denominazione e il comune
          for (let i = 3; i < parts.length; i++) {
            if (parts[i].trim() && !denominazione) {
              denominazione = parts[i].trim()
            } else if (parts[i].trim() && denominazione && !comune && parts[i].includes("-")) {
              // Assumiamo che il comune sia nel formato "CODICE-COMUNE"
              const comuneParts = parts[i].split("-")
              if (comuneParts.length > 1) {
                comune = comuneParts[1].trim()
              }
            }
          }

          if (codiceFiscale && denominazione) {
            // Verifica se è un duplicato
            const duplicate = isDuplicate(codiceFiscale)

            if (duplicate) {
              foundDuplicates.push(`${codiceFiscale} (${denominazione})`)
            } else {
              // Aggiungi nuovo record
              addImmobiliare({
                codiceFiscale,
                denominazione,
                comune,
                controllato: false,
                segnalazione: false,
                note: "",
              })
              newItemsCount++
            }
          }
        }
      }

      setDuplicates(foundDuplicates)
      setInputData("")

      if (newItemsCount === 0 && foundDuplicates.length === 0) {
        toast({
          title: "Nessun dato trovato",
          description: "Non è stato possibile estrarre dati validi dal testo inserito",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Dati importati",
        description: `${newItemsCount} record importati con successo${
          foundDuplicates.length > 0 ? `, ${foundDuplicates.length} duplicati ignorati` : ""
        }`,
      })
    } catch (error) {
      toast({
        title: "Errore di parsing",
        description: "Si è verificato un errore durante l'analisi dei dati",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md">
      <h2 className="text-xl font-semibold">Importa da Excel</h2>
      <p className="text-sm text-muted-foreground">
        Incolla qui i dati copiati da Excel. Il sistema cercherà di estrarre automaticamente il codice fiscale, la
        denominazione e il comune.
      </p>

      <Textarea
        value={inputData}
        onChange={(e) => setInputData(e.target.value)}
        placeholder="Incolla qui i dati copiati da Excel..."
        rows={8}
      />

      <Button onClick={handleParse}>Analizza e Importa</Button>

      {duplicates.length > 0 && (
        <div className="mt-4 p-4 border rounded-md bg-amber-50">
          <h3 className="font-semibold text-amber-800 mb-2">
            Attenzione: {duplicates.length} record duplicati ignorati
          </h3>
          <ul className="list-disc pl-5 text-sm text-amber-700 max-h-40 overflow-y-auto">
            {duplicates.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
