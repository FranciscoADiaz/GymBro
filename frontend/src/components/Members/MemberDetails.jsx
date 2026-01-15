const formatDate = (value) => {
  if (!value) return 'Sin vencimiento';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin vencimiento';
  return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(date);
};

const MemberDetails = ({ member, onRegisterPayment }) => {
  if (!member) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100 text-sm text-gray-500">
        Selecciona un socio para ver su detalle.
      </div>
    );
  }

  const activeUntil = member.activeUntil ? new Date(member.activeUntil) : null;
  const isActive = activeUntil && activeUntil > new Date();
  const statusLabel = isActive ? 'Activo' : 'Inactivo';
  const statusClasses = isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Detalle del socio</h2>
          <p className="text-sm text-gray-500">Información y estado de pago.</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses}`}>
          {statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold text-gray-500">Nombre</p>
          <p>
            {member.firstName} {member.lastName}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">DNI</p>
          <p>{member.dni}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Email</p>
          <p>{member.email || '—'}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Vence</p>
          <p>{formatDate(member.activeUntil)}</p>
        </div>
      </div>

      {!isActive && (
        <button
          type="button"
          onClick={() => onRegisterPayment(member)}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 transition-colors duration-200"
        >
          Registrar pago
        </button>
      )}
    </div>
  );
};

export default MemberDetails;

