"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, Check, X, Search, MoreHorizontal, Calendar, Clock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { useDatabase } from "@/hooks/use-database"
import { AnniControllatiDialog } from "@/components/anni-controllati-dialog"
import type { Immobiliare } from "@/types/immobiliare"

export function ImmobiliareDataTable() {
  const router = useRouter()
  const { toast } = useToast()
  const { immobiliari, anniControllo, deleteImmobiliare, updateImmobiliare } = useDatabase()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImmobiliare, setSelectedImmobiliare] = useState<Immobiliare | null>(null)
  const [showAnniDialog, setShowAnniDialog] = useState(false)
  const [showEstinzioneDialog, setShowEstinzioneDialog] = useState(false)
  const [annoEstinzione, setAnnoEstinzione] = useState("")

  const handleDelete = (id: string) => {
    deleteImmobiliare(id)
    toast({
      title: "Immobiliare eliminata",
      description: "L'immobiliare è stata eliminata con successo",
    })
  }

  const handleToggleControlled = (id: string, currentValue: boolean) => {
    updateImmobiliare(id, { controllato: !currentValue })
  }

  const handleToggleSignaled = (id: string, currentValue: boolean) => {
    updateImmobiliare(id, { segnalazione: !currentValue })
  }

  const openAnniDialog = (immobiliare: Immobiliare) => {
    setSelectedImmobiliare(immobiliare)
    setShowAnniDialog(true)
  }

  const openEstinzioneDialog = (immobiliare: Immobiliare) => {
    setSelectedImmobiliare(immobiliare)
    setAnnoEstinzione(immobiliare.annoEstinzione || "")
    setShowEstinzioneDialog(true)
  }

  const handleSaveEstinzione = () => {
    if (selectedImmobiliare) {
      // Verifica che l'anno sia valido (4 cifre o vuoto)
      if (annoEstinzione && !/^\d{4}$/.test(annoEstinzione)) {
        toast({
          title: "Errore",
          description: "L'anno deve essere nel formato a 4 cifre (es. 2023)",
          variant: "destructive",
        })
        return
      }

      updateImmobiliare(selectedImmobiliare.id, {
        annoEstinzione: annoEstinzione || undefined,
      })

      toast({
        title: "Anno di estinzione aggiornato",
        description: annoEstinzione ? `Anno di estinzione impostato a ${annoEstinzione}` : "Anno di estinzione rimosso",
      })

      setShowEstinzioneDialog(false)
    }
  }

  const filteredData = immobiliari.filter(
    (item) =>
      item.codiceFiscale.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.denominazione.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comune.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Ottieni gli anni attivi per la visualizzazione
  const activeYears = anniControllo.filter((anno) => anno.attivo).sort((a, b) => a.anno.localeCompare(b.anno))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Cerca per codice fiscale, denominazione o comune..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Codice Fiscale/P.IVA</TableHead>
              <TableHead className="whitespace-nowrap">Denominazione</TableHead>
              <TableHead className="whitespace-nowrap">Comune</TableHead>
              <TableHead className="whitespace-nowrap">Controllato</TableHead>
              <TableHead className="whitespace-nowrap">Segnalazione</TableHead>
              {activeYears.length > 0 && <TableHead className="whitespace-nowrap">Anni Controllati</TableHead>}
              <TableHead className="whitespace-nowrap">Anno Estinzione</TableHead>
              <TableHead className="whitespace-nowrap">Note</TableHead>
              <TableHead className="whitespace-nowrap">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nessun dato trovato
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap">{item.codiceFiscale}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.denominazione}>
                    {item.denominazione}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{item.comune}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleControlled(item.id, item.controllato)}
                    >
                      {item.controllato ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleSignaled(item.id, item.segnalazione)}
                    >
                      {item.segnalazione ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </Button>
                  </TableCell>
                  {activeYears.length > 0 && (
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => openAnniDialog(item)}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>
                          {
                            Object.entries(item.anniControllati)
                              .filter(([anno]) => activeYears.some((y) => y.anno === anno))
                              .filter(([_, controllato]) => controllato).length
                          }{" "}
                          / {activeYears.length}
                        </span>
                      </Button>
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => openEstinzioneDialog(item)}
                    >
                      <Clock className="h-4 w-4" />
                      <span>{item.annoEstinzione || "-"}</span>
                    </Button>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={item.note}>
                    {item.note || "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/modifica/${item.id}`)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAnniDialog(item)}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Anni controllati
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEstinzioneDialog(item)}>
                          <Clock className="h-4 w-4 mr-2" />
                          Anno estinzione
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedImmobiliare && (
        <>
          <AnniControllatiDialog
            immobiliare={selectedImmobiliare}
            open={showAnniDialog}
            onOpenChange={setShowAnniDialog}
          />

          <Dialog open={showEstinzioneDialog} onOpenChange={setShowEstinzioneDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Anno di Estinzione</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <p className="mb-4">
                  <strong>Immobiliare:</strong> {selectedImmobiliare.denominazione}
                </p>

                <div className="space-y-2">
                  <label htmlFor="annoEstinzione" className="text-sm font-medium">
                    Anno di estinzione (lascia vuoto se non estinta)
                  </label>
                  <Input
                    id="annoEstinzione"
                    value={annoEstinzione}
                    onChange={(e) => setAnnoEstinzione(e.target.value)}
                    placeholder="Es. 2023"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEstinzioneDialog(false)}>
                  Annulla
                </Button>
                <Button onClick={handleSaveEstinzione}>Salva</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
