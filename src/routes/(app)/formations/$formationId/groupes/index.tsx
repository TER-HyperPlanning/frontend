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
import { useFormationGroups } from '@/hooks/formations/useFormationGroups'

export const Route = createFileRoute(
  '/(app)/formations/$formationId/groupes/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { formationId } = Route.useParams()
  const { groups, formationName, isLoading } = useFormationGroups(formationId)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return groups
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.filiereName.toLowerCase().includes(q) ||
        g.academicYear.toLowerCase().includes(q),
    )
  }, [groups, searchQuery])

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
            Groupes — {formationName || 'Chargement…'}
          </h1>
          <p className="text-sm text-base-content/60 mt-0.5">
            {filtered.length} groupe{filtered.length > 1 ? 's' : ''} dans cette
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
              placeholder="Rechercher un groupe…"
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
                Chargement des groupes...
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-base-content/50 text-sm">
                Aucun groupe trouvé pour cette formation
              </p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow className="text-base-content/60 text-xs uppercase">
                  <TableHeader>Nom du groupe</TableHeader>
                  <TableHeader>Filière</TableHeader>
                  <TableHeader>Année académique</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium text-base-content">
                      {g.name}
                    </TableCell>
                    <TableCell className="text-sm text-base-content/80">
                      {g.filiereName}
                    </TableCell>
                    <TableCell className="text-sm text-base-content/80">
                      {g.academicYear}
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
