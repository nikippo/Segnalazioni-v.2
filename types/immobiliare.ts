export interface Immobiliare {
  id: string
  codiceFiscale: string
  denominazione: string
  comune: string
  controllato: boolean
  segnalazione: boolean
  note: string
  anniControllati: {
    [key: string]: boolean // es: "2019": true, "2020": true, "2021": false
  }
  annoEstinzione?: string
}

export interface AnnoControllo {
  id: string
  anno: string
  attivo: boolean
}
