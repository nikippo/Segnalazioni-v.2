"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDatabase } from "@/hooks/use-database"
import type { Immobiliare } from "@/types/immobiliare"

interface AnniControllatiDialogProps {
  immobiliare: Immobiliare
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnniControllatiDialog({ immobiliare, open, onOpenChange }: AnniControllatiDialogProps) {
  const { anniControllo, updateAnnoControllo } = useDatabase()

  // Filtra solo gli anni attivi e ordinali
  const activeYears = anniControllo.filter((anno) => anno.attivo).sort((a, b) => a.anno.localeCompare(b.anno))

  const handleToggleAnno = (anno: string, checked: boolean) => {
    updateAnnoControllo(immobiliare.id, anno, checked)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anni Controllati</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-4">
            <strong>Immobiliare:</strong> {immobiliare.denominazione}
          </p>

          <div className="space-y-3">
            {activeYears.map((anno) => (
              <div key={anno.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`anno-${anno.anno}`}
                  checked={immobiliare.anniControllati[anno.anno] || false}
                  onCheckedChange={(checked) => handleToggleAnno(anno.anno, checked as boolean)}
                />
                <Label htmlFor={`anno-${anno.anno}`}>Anno {anno.anno}</Label>
              </div>
            ))}

            {activeYears.length === 0 && (
              <p className="text-muted-foreground">
                Nessun anno di controllo configurato. Vai alla sezione Impostazioni per aggiungere anni.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
