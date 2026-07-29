import React, { useState, useEffect } from 'react';
import { Trash2, Users, ShieldCheck, User } from 'lucide-react';
import { authService } from '../../services/api';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authService.getAllUsers();
      setUsers(res.data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (id === currentUser?._id) { toast.error("You cannot delete your own account."); return; }
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await authService.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fade-in">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
        <p className="admin-page-subtitle">Manage registered users and roles</p>
      </div>

      {loading ? <Spinner text="Loading users..." /> : users.length === 0 ? (
        <div className="empty-state">
          <Users size={56} className="empty-state-icon" />
          <h3 className="empty-state-title">No users found</h3>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: u.role === 'admin' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {u.role === 'admin' ? <ShieldCheck size={14} color="var(--color-accent)" /> : <User size={14} color="#3b82f6" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                        {u._id === currentUser?._id && <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 600 }}>You</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-green' : 'badge-blue'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm btn-icon"
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={deleting === u._id || u._id === currentUser?._id}
                      title={u._id === currentUser?._id ? 'Cannot delete yourself' : 'Delete user'}
                      style={{ opacity: u._id === currentUser?._id ? 0.4 : 1 }}
                    >
                      {deleting === u._id ? <span className="spinner spinner-sm" /> : <Trash2 size={13} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
