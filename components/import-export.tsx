"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"
import type { Immobiliare } from "@/types/immobiliare"
import { Download, Upload } from 'lucide-react'

export function ImportExport() {
  const { toast } = useToast()
  const { immobiliari, setImmobiliari } = useDatabase()
  const [file, setFile] = useState<File | null>(null)

  const handleExport = () => {
    const dataStr = JSON.stringify(immobiliari, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `immobiliari_export_${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Esportazione completata",
      description: "I dati sono stati esportati con successo",
    })
  }

  const handleImport = () => {
    if (!file) {
      toast({
        title: "Errore",
        description: "Seleziona un file da importare",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content) as Immobiliare[]

        if (!Array.isArray(importedData)) {
          throw new Error("Formato dati non valido")
        }

        setImmobiliari(importedData)
        toast({
          title: "Importazione completata",
          description: `${importedData.length} record importati con successo`,
        })

        setFile(null)
      } catch (error) {
        toast({
          title: "Errore di importazione",
          description: "Il file selezionato non contiene dati validi",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md">
      <h2 className="text-xl font-semibold">Importa/Esporta Dati</h2>

      <div className="flex items-center gap-2">
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Esporta Dati
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input type="file" accept=".json" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Button onClick={handleImport} disabled={!file} variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Importa
        </Button>
      </div>
    </div>
  )
}
