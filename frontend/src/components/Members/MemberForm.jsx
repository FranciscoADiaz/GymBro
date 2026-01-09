import { useEffect, useState } from 'react';

const initialState = {
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
};

const MemberForm = ({ onSubmit, onCancel, submitting, errorMessage, editingMember }) => {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        firstName: editingMember.firstName || '',
        lastName: editingMember.lastName || '',
        dni: editingMember.dni || '',
        email: editingMember.email || '',
      });
    } else {
      setFormData(initialState);
    }
  }, [editingMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, () => setFormData(initialState));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4 border border-gray-100">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {editingMember ? 'Editar Socio' : 'Nuevo Socio'}
        </h2>
        <p className="text-sm text-gray-500">
          {editingMember ? 'Actualiza los datos del socio.' : 'Completa los datos para registrar un socio.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dni">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            required
            value={formData.dni}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email (opcional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 disabled:opacity-60 transition-colors duration-200"
        >
          {submitting ? (editingMember ? 'Actualizando...' : 'Guardando...') : editingMember ? 'Actualizar' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={() => {
            setFormData(initialState);
            onCancel?.();
          }}
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MemberForm;

