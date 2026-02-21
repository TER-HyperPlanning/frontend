import React from 'react'

export const PatternInfoForm = () => {
  return (
            <div>
              <fieldset className='fieldset'>
                <label className='label'>
                  Sélectionner un nombre de jours pour appliqué un motif :
                </label>
                <input
                  type="number"
                  required
                  placeholder="Entrer un nombre de jours"
                  className="input validator" />
                <label className="label">
                  Sélectionner la date à laquelle arrêter le motif :
                </label>
                <input type="date" className="input" />
              </fieldset>
              <button className="btn btn-primary">Appliquer le motif</button>
            </div>
    
  )
}
