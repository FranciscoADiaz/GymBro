import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import MemberForm from '../components/Members/MemberForm';
import MemberList from '../components/Members/MemberList';
import { createMember, deleteMember, getMembers, updateMember } from '../services/memberService';
import { useAuth } from '../hooks/useAuth';

const MembersPage = () => {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadMembers = async () => {
    setLoadingList(true);
    setError(null);
    try {
      const data = await getMembers(token);
      setMembers(data);
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudieron cargar los socios';
      setError(msg);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadMembers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSave = async (data, resetForm) => {
    setCreating(true);
    setFormError(null);
    setError(null);
    try {
      if (editingMember) {
        const updated = await updateMember(editingMember._id, data, token);
        setMembers((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
        setEditingMember(null);
        toast.success('Socio actualizado con éxito');
      } else {
        const created = await createMember(data, token);
        setMembers((prev) => [created, ...prev]);
        toast.success('Socio creado con éxito');
      }
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo guardar el socio';
      if (msg.toLowerCase().includes('dni')) {
        setFormError(msg);
      } else {
        setError(msg);
        toast.error(msg);
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (member) => {
    Swal.fire({
      title: 'Editar socio',
      text: `¿Quieres editar a ${member.firstName || ''} ${member.lastName || ''}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#4f46e5',
    }).then((result) => {
      if (result.isConfirmed) {
        setFormError(null);
        setEditingMember(member);
      }
    });
  };

  const handleDelete = async (member) => {
    const result = await Swal.fire({
      title: 'Eliminar socio',
      text: `¿Eliminar a ${member.firstName || ''} ${member.lastName || ''} (DNI: ${member.dni || 'N/A'})?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#e11d48',
    });
    if (!result.isConfirmed) return;
    setError(null);
    try {
      await deleteMember(member._id, token);
      setMembers((prev) => prev.filter((m) => m._id !== member._id));
      if (editingMember?._id === member._id) {
        setEditingMember(null);
        setFormError(null);
      }
      toast.success('Socio eliminado');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo eliminar el socio';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleToggleStatus = async (member) => {
    setError(null);
    try {
      const nextStatus = member.status === 'active' ? 'inactive' : 'active';
      const updated = await updateMember(member._id, { status: nextStatus }, token);
      setMembers((prev) => prev.map((m) => (m._id === updated._id ? updated : m)));
      if (editingMember?._id === member._id) {
        setEditingMember(updated);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo actualizar el estado';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Socios</h1>
          <p className="text-gray-600">Crea y administra los socios del gimnasio.</p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MemberForm
              onSubmit={handleSave}
              onCancel={() => {
                setFormError(null);
                setEditingMember(null);
              }}
              submitting={creating}
              errorMessage={formError}
              editingMember={editingMember}
            />
          </div>
          <div className="lg:col-span-2">
            <MemberList
              members={members}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              loading={loadingList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;

