import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import MemberForm from '../components/Members/MemberForm';
import MemberList from '../components/Members/MemberList';
import MemberDetails from '../components/Members/MemberDetails';
import { createMember, deleteMember, getMembers, updateMember } from '../services/memberService';
import { getMemberships } from '../services/membershipService';
import { createPayment } from '../services/paymentService';
import { useAuth } from '../hooks/useAuth';

const MembersPage = () => {
  const { token } = useAuth();

  const [members, setMembers] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
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
        if (selectedMember?._id === updated._id) {
          setSelectedMember(updated);
        }
        toast.success('Socio actualizado con éxito');
      } else {
        const created = await createMember(data, token);
        setMembers((prev) => [created, ...prev]);
        setSelectedMember(created);
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
      if (selectedMember?._id === member._id) {
        setSelectedMember(null);
      }
      toast.success('Socio eliminado');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo eliminar el socio';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
  };

  const handleRegisterPayment = async (member) => {
    setError(null);
    try {
      const memberships = await getMemberships(token);
      if (!memberships.length) {
        toast.error('Primero crea una membresía en Mis Planes');
        return;
      }

      const inputOptions = memberships.reduce((acc, plan) => {
        acc[plan._id] = `${plan.name} - $${plan.price} (${plan.durationInDays} días)`;
        return acc;
      }, {});

      const result = await Swal.fire({
        title: 'Registrar pago',
        input: 'select',
        inputOptions,
        inputPlaceholder: 'Selecciona una membresía',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4f46e5',
        inputValidator: (value) => (!value ? 'Selecciona una membresía' : undefined),
      });

      if (!result.isConfirmed) return;

      const paymentResult = await createPayment(
        { memberId: member._id, membershipId: result.value },
        token
      );
      const updatedMember = paymentResult.member || member;

      setMembers((prev) => prev.map((m) => (m._id === updatedMember._id ? updatedMember : m)));
      setSelectedMember(updatedMember);
      toast.success('Pago registrado con éxito');
    } catch (err) {
      const msg = err.response?.data?.error || 'No se pudo registrar el pago';
      setError(msg);
      toast.error(msg);
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
          <div className="lg:col-span-1 space-y-6">
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
            <MemberDetails member={selectedMember} onRegisterPayment={handleRegisterPayment} />
          </div>
          <div className="lg:col-span-2">
            <MemberList
              members={members}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onView={handleView}
              loading={loadingList}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;

