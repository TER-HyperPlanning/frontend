export function slugifyNamePart(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase()
}

export function buildStudentEmail(firstName: string, lastName: string): string {
  const first = slugifyNamePart(firstName)
  const last = slugifyNamePart(lastName)

  if (!first || !last) return ''
  return `${first}.${last}@etud.fr`
}

export function isValidFrenchPhone(phone: string): boolean {
  const trimmed = phone.trim()
  if (!trimmed) return true

  const frenchPattern = /^(0?[67](?:[ .-]?\d{2}){4}|\+33[ .-]?[67](?:[ .-]?\d{2}){4})$/
  return frenchPattern.test(trimmed)
}

export function normalizeFrenchPhone(phone: string): string {
  const trimmed = phone.trim()
  if (!trimmed) return ''

  const digits = trimmed.replace(/\D/g, '')
  let national = digits

  if (digits.startsWith('33')) {
    national = `0${digits.slice(2)}`
  }

  if ((digits.startsWith('6') || digits.startsWith('7')) && digits.length === 9) {
    national = `0${digits}`
  }

  if (national.length !== 10) {
    return trimmed
  }

  return national.replace(/(\d{2})(?=\d)/g, '$1 ').trim()
}

export interface ParsedStudentCsvRow {
  line: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
}

function parseCsvLine(line: string, delimiter: ',' | ';' | '\t'): string[] {
  const cells: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === delimiter && !inQuotes) {
      cells.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  cells.push(current.trim())
  return cells
}

export function parseStudentsCsv(content: string): ParsedStudentCsvRow[] {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    throw new Error('Le fichier CSV doit contenir un en-tête et au moins une ligne')
  }

  const delimiter: ',' | ';' | '\t' = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ','
  const headers = parseCsvLine(lines[0], delimiter).map(normalizeHeader)

  const firstNameIndex = headers.findIndex((header) => ['firstname', 'prenom'].includes(header))
  const lastNameIndex = headers.findIndex((header) => ['lastname', 'lasname', 'nom'].includes(header))
  const emailIndex = headers.findIndex((header) => ['email', 'mail'].includes(header))
  const phoneIndex = headers.findIndex((header) => ['telephone', 'phone', 'tel'].includes(header))

  if (firstNameIndex === -1 || lastNameIndex === -1) {
    throw new Error('Le CSV doit contenir les colonnes prénom/firstname et nom/lastname')
  }

  return lines.slice(1).map((line, index) => {
    const cells = parseCsvLine(line, delimiter)

    return {
      line: index + 2,
      firstName: (cells[firstNameIndex] ?? '').trim(),
      lastName: (cells[lastNameIndex] ?? '').trim(),
      email: emailIndex >= 0 ? (cells[emailIndex] ?? '').trim() : '',
      phone: phoneIndex >= 0 ? (cells[phoneIndex] ?? '').trim() : '',
    }
  })
}

function escapeCsvValue(value: string): string {
  if (value.includes(',') || value.includes(';') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildStudentsCsv(
  rows: Array<{ firstName: string; lastName: string; email: string; phone?: string | null }>,
): string {
  const delimiter = ';'
  const header = ['Prenom', 'Nom', 'Email', 'Telephone'].join(delimiter)
  const body = rows.map((student) => {
    return [
      escapeCsvValue(student.firstName),
      escapeCsvValue(student.lastName),
      escapeCsvValue(student.email),
      escapeCsvValue(student.phone ?? ''),
    ].join(delimiter)
  })

  return `\uFEFF${[header, ...body].join('\n')}`
}

export function buildStudentsCsvTemplate(): string {
  return '\uFEFFPrenom;Nom;Email;Telephone\nBilal;Varet;bilal.varet@etud.fr;06 30 00 00 21\n'
}