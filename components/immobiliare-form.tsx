"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"
import type { Immobiliare } from "@/types/immobiliare"

interface ImmobiliareFormProps {
  id?: string
}

export function ImmobiliareForm({ id }: ImmobiliareFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { immobiliari, anniControllo, isDuplicate, addImmobiliare, updateImmobiliare } = useDatabase()

  const [formData, setFormData] = useState<Omit<Immobiliare, "id" | "anniControllati">>({
    codiceFiscale: "",
    denominazione: "",
    comune: "",
    controllato: false,
    segnalazione: false,
    note: "",
    annoEstinzione: "",
  })

  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false)
  const [duplicateItem, setDuplicateItem] = useState<Immobiliare | null>(null)

  useEffect(() => {
    if (id) {
      const immobiliare = immobiliari.find((item) => item.id === id)
      if (immobiliare) {
        const { id: _, anniControllati: __, ...rest } = immobiliare
        setFormData(rest)
      }
    }
  }, [id, immobiliari])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.codiceFiscale || !formData.denominazione) {
      toast({
        title: "Errore",
        description: "Codice fiscale e denominazione sono campi obbligatori",
        variant: "destructive",
      })
      return
    }

    // Verifica duplicati solo per nuovi inserimenti
    if (!id) {
      const duplicate = isDuplicate(formData.codiceFiscale)
      if (duplicate) {
        setDuplicateItem(duplicate)
        setShowDuplicateDialog(true)
        return
      }
    }

    saveData()
  }

  const saveData = () => {
    if (id) {
      // Aggiorna esistente
      updateImmobiliare(id, formData)
      toast({
        title: "Immobiliare aggiornata",
        description: "I dati dell'immobiliare sono stati aggiornati con successo",
      })
    } else {
      // Aggiungi nuovo
      addImmobiliare(formData)
      toast({
        title: "Immobiliare aggiunta",
        description: "La nuova immobiliare è stata aggiunta con successo",
      })
    }

    router.push("/")
  }

  const handleContinueAnyway = () => {
    setShowDuplicateDialog(false)
    saveData()
  }

  const activeYears = anniControllo.filter((anno) => anno.attivo)

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="codiceFiscale">Codice Fiscale / P.IVA *</Label>
          <Input
            id="codiceFiscale"
            name="codiceFiscale"
            value={formData.codiceFiscale}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="denominazione">Denominazione *</Label>
          <Input
            id="denominazione"
            name="denominazione"
            value={formData.denominazione}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comune">Comune</Label>
          <Input id="comune" name="comune" value={formData.comune} onChange={handleChange} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="controllato"
            checked={formData.controllato}
            onCheckedChange={(checked) => handleCheckboxChange("controllato", checked as boolean)}
          />
          <Label htmlFor="controllato">Controllato</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="segnalazione"
            checked={formData.segnalazione}
            onCheckedChange={(checked) => handleCheckboxChange("segnalazione", checked as boolean)}
          />
          <Label htmlFor="segnalazione">Segnalazione</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="annoEstinzione">Anno Estinzione</Label>
          <Input
            id="annoEstinzione"
            name="annoEstinzione"
            value={formData.annoEstinzione || ""}
            onChange={handleChange}
            placeholder="Es. 2022"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Note</Label>
          <Textarea id="note" name="note" value={formData.note} onChange={handleChange} rows={4} />
        </div>

        <div className="flex gap-4">
          <Button type="submit">{id ? "Aggiorna" : "Salva"}</Button>
          <Button type="button" variant="outline" onClick={() => router.push("/")}>
            Annulla
          </Button>
        </div>
      </form>

      <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Immobiliare già esistente</DialogTitle>
            <DialogDescription>
              Un'immobiliare con lo stesso codice fiscale è già presente nel database.
            </DialogDescription>
          </DialogHeader>

          {duplicateItem && (
            <div className="py-4">
              <p>
                <strong>Codice Fiscale:</strong> {duplicateItem.codiceFiscale}
              </p>
              <p>
                <strong>Denominazione:</strong> {duplicateItem.denominazione}
              </p>
              <p>
                <strong>Comune:</strong> {duplicateItem.comune}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDuplicateDialog(false)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleContinueAnyway}>
              Continua comunque
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
