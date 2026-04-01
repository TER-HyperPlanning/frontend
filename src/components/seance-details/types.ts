/**
 * Détails d'une séance, alignés sur la forme des événements du planning
 * (FullCalendar : title, start, end, extendedProps).
 */
export interface DetailsSeance {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  module?: string
  groupe?: string
  salle?: string
  batiment?: string
  enseignant?: string
  typeSeance?: string
}

/** Construit les détails à partir d’un objet compatible avec les événements du planning. */
export function detailsSeanceFromPlanningLike(event: {
  id: string
  title: string
  start: Date
  end: Date
  extendedProps?: { description?: string; [key: string]: unknown }
}): DetailsSeance {
  const xp = event.extendedProps ?? {}
  return {
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    description: typeof xp.description === 'string' ? xp.description : undefined,
    module: typeof xp.module === 'string' ? xp.module : undefined,
    groupe: typeof xp.groupe === 'string' ? xp.groupe : undefined,
    salle: typeof xp.salle === 'string' ? xp.salle : undefined,
    batiment: typeof xp.batiment === 'string' ? xp.batiment : undefined,
    enseignant: typeof xp.enseignant === 'string' ? xp.enseignant : undefined,
    typeSeance: typeof xp.typeSeance === 'string' ? xp.typeSeance : undefined,
  }
}
