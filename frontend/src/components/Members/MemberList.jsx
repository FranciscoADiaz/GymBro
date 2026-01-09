import { useMemo } from 'react';

const StatusBadge = ({ status }) => {
  const isActive = status === 'active';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {isActive ? 'Activo' : 'Inactivo'}
    </span>
  );
};

const MemberList = ({ members, searchTerm, onSearchChange, onDelete, onEdit, onToggleStatus, loading }) => {
  const filtered = useMemo(() => {
    if (!searchTerm) return members;
    const term = searchTerm.toLowerCase();
    return members.filter((m) => {
      const fullName = `${m.firstName || ''} ${m.lastName || ''}`.toLowerCase();
      const email = (m.email || '').toLowerCase();
      return fullName.includes(term) || (m.dni || '').toLowerCase().includes(term) || email.includes(term);
    });
  }, [members, searchTerm]);

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Socios</h2>
          <p className="text-sm text-gray-500">Busca por nombre o DNI.</p>
        </div>
        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  Cargando socios...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                  No hay socios para mostrar.
                </td>
              </tr>
            ) : (
              filtered.map((member) => (
                <tr key={member._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-800">
                    {member.firstName} {member.lastName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{member.dni}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{member.email || '—'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm space-x-3">
                    <button
                      type="button"
                      onClick={() => onEdit(member)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleStatus(member)}
                      className="text-gray-700 hover:text-gray-900 font-semibold"
                    >
                      {member.status === 'active' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(member)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberList;

