import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const initialState = {
  firstName: '',
  lastName: '',
  dni: '',
  email: '',
};

const memberSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Debe tener al menos 2 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/, 'Solo letras permitidas'),
  lastName: z
    .string()
    .min(2, 'Debe tener al menos 2 caracteres')
    .regex(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/, 'Solo letras permitidas'),
  dni: z.string().regex(/^\d{7,8}$/, 'Debe tener entre 7 y 8 dígitos'),
  email: z.string().email('Email inválido').or(z.literal('')),
});

const MemberForm = ({ onSubmit, onCancel, submitting, errorMessage, editingMember }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: initialState,
  });

  useEffect(() => {
    if (editingMember) {
      reset({
        firstName: editingMember.firstName || '',
        lastName: editingMember.lastName || '',
        dni: editingMember.dni || '',
        email: editingMember.email || '',
      });
    } else {
      reset(initialState);
    }
  }, [editingMember, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, () => reset(initialState)))}
      className="bg-white p-6 rounded-lg shadow space-y-4 border border-gray-100"
    >
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
            {...register('firstName')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            {...register('lastName')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dni">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            type="text"
            {...register('dni')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email (opcional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            {...register('email')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
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
            reset(initialState);
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

