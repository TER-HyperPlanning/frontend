import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import PageLayout from '@/layout/PageLayout'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Table'
import { useFormationModules } from '@/hooks/formations/useFormationModules'

export const Route = createFileRoute(
  '/(app)/formations/$formationId/modules/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { formationId } = Route.useParams()
  const { modules, formationName, isLoading } = useFormationModules(formationId)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return modules
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.filiereName.toLowerCase().includes(q),
    )
  }, [modules, searchQuery])

  return (
    <PageLayout className="p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/formations"
          className="btn btn-ghost btn-sm btn-circle"
          title="Retour aux formations"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-base-content">
            Modules — {formationName || 'Chargement…'}
          </h1>
          <p className="text-sm text-base-content/60 mt-0.5">
            {filtered.length} module{filtered.length > 1 ? 's' : ''} dans cette
            formation
          </p>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200 mb-6">
        <div className="card-body py-4 px-5">
          <label className="input input-bordered flex items-center gap-2 max-w-md">
            <Search size={16} className="text-base-content/40" />
            <input
              type="text"
              placeholder="Rechercher un module…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="grow text-sm"
            />
          </label>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-200">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-16 gap-3">
              <span className="loading loading-spinner loading-md text-primary" />
              <span className="text-base-content/60 text-sm">
                Chargement des modules...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base-content/50 text-sm">
                Aucun module trouvé pour cette formation
              </p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow className="text-base-content/60 text-xs uppercase">
                  <TableHeader>Nom du module</TableHeader>
                  <TableHeader>Code</TableHeader>
                  <TableHeader>Volume horaire</TableHeader>
                  <TableHeader>Filière</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium text-base-content">
                      {m.name}
                    </TableCell>
                    <TableCell className="text-sm text-base-content/80">
                      {m.code}
                    </TableCell>
                    <TableCell className="text-sm text-base-content/80">
                      {m.hourlyVolume}h
                    </TableCell>
                    <TableCell className="text-sm text-base-content/80">
                      {m.filiereName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
