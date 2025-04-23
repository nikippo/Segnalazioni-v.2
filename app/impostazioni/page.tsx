"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"

export default function ImpostazioniPage() {
  const { toast } = useToast()
  const { anniControllo, addAnnoControllo, removeAnnoControllo, toggleAnnoControllo } = useDatabase()
  const [newAnno, setNewAnno] = useState("")

  const handleAddAnno = () => {
    if (!newAnno.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un anno valido",
        variant: "destructive",
      })
      return
    }

    // Verifica che sia un anno valido (4 cifre)
    if (!/^\d{4}$/.test(newAnno)) {
      toast({
        title: "Errore",
        description: "L'anno deve essere nel formato a 4 cifre (es. 2023)",
        variant: "destructive",
      })
      return
    }

    const success = addAnnoControllo(newAnno)
    if (success) {
      toast({
        title: "Anno aggiunto",
        description: `L'anno ${newAnno} è stato aggiunto con successo`,
      })
      setNewAnno("")
    } else {
      toast({
        title: "Errore",
        description: `L'anno ${newAnno} è già presente`,
        variant: "destructive",
      })
    }
  }

  const handleRemoveAnno = (id: string, anno: string) => {
    const success = removeAnnoControllo(id)
    if (success) {
      toast({
        title: "Anno rimosso",
        description: `L'anno ${anno} è stato rimosso con successo`,
      })
    }
  }

  const handleToggleAnno = (id: string, anno: string, currentStatus: boolean) => {
    toggleAnnoControllo(id)
    toast({
      title: currentStatus ? "Anno disattivato" : "Anno attivato",
      description: `L'anno ${anno} è stato ${currentStatus ? "disattivato" : "attivato"} con successo`,
    })
  }

  // Ordina gli anni
  const sortedAnni = [...anniControllo].sort((a, b) => a.anno.localeCompare(b.anno))

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Impostazioni</h1>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Gestione Anni di Controllo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4 mb-6">
              <div className="space-y-2 flex-1">
                <Label htmlFor="newAnno">Aggiungi nuovo anno</Label>
                <Input
                  id="newAnno"
                  value={newAnno}
                  onChange={(e) => setNewAnno(e.target.value)}
                  placeholder="Es. 2023"
                />
              </div>
              <Button onClick={handleAddAnno}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Aggiungi
              </Button>
            </div>

            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Anno</th>
                    <th className="px-4 py-2 text-left">Stato</th>
                    <th className="px-4 py-2 text-right">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnni.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                        Nessun anno configurato
                      </td>
                    </tr>
                  ) : (
                    sortedAnni.map((anno) => (
                      <tr key={anno.id} className="border-b">
                        <td className="px-4 py-2">{anno.anno}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`anno-${anno.id}`}
                              checked={anno.attivo}
                              onCheckedChange={() => handleToggleAnno(anno.id, anno.anno, anno.attivo)}
                            />
                            <Label htmlFor={`anno-${anno.id}`}>{anno.attivo ? "Attivo" : "Disattivato"}</Label>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveAnno(anno.id, anno.anno)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
