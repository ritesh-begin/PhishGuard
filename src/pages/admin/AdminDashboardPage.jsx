import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trash2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('contacts'); // contacts, scans, subs
  const [data, setData] = useState({ contacts: [], scans: [], subs: [] });
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  const fetchData = async (tab) => {
    try {
      const res = await fetch(`/api/admin/${tab}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        // token expired
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      const json = await res.json();
      setData(prev => ({ ...prev, [tab]: json }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchData('contacts');
    } catch (e) {}
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full border-r border-slate-200 bg-white p-6 md:w-64 md:min-h-screen">
        <h2 className="text-xl font-black text-leapDark">Admin Panel</h2>
        
        <nav className="mt-8 flex flex-col gap-2">
          {['contacts', 'scans', 'subscribers'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                activeTab === tab ? 'bg-leapSoft text-leapRed' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <button 
          onClick={logout}
          className="mt-auto flex items-center gap-2 pt-8 text-sm font-medium text-slate-500 hover:text-red-600 md:absolute md:bottom-8"
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10">
        <h1 className="text-2xl font-bold capitalize text-leapDark">{activeTab}</h1>
        
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto p-1">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                {activeTab === 'contacts' && (
                  <tr>
                    <th className="px-6 py-4">Name/Email</th>
                    <th className="px-6 py-4">Message</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                )}
                {activeTab === 'scans' && (
                  <tr>
                    <th className="px-6 py-4">URL</th>
                    <th className="px-6 py-4">Verdict/Score</th>
                    <th className="px-6 py-4">Requester IP</th>
                  </tr>
                )}
                {activeTab === 'subscribers' && (
                  <tr>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Subscribed At</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data[activeTab].map(item => (
                  <tr key={item._id} className="hover:bg-slate-50">
                    
                    {activeTab === 'contacts' && (
                      <>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.email}</p>
                        </td>
                        <td className="px-6 py-4 max-w-md truncate">
                          <p className="font-medium text-slate-800">{item.subject}</p>
                          <p className="truncate text-xs">{item.message}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteContact(item._id)} className="text-slate-400 hover:text-red-600">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === 'scans' && (
                      <>
                        <td className="px-6 py-4 max-w-xs truncate font-medium">{item.url}</td>
                        <td className="px-6 py-4">
                          <span className="font-bold">{item.verdict}</span> ({item.score})
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">{item.ipAddress || 'unknown'}</td>
                      </>
                    )}

                    {activeTab === 'subscribers' && (
                      <>
                        <td className="px-6 py-4 font-medium">{item.email}</td>
                        <td className="px-6 py-4 text-xs">{new Date(item.subscribedAt).toLocaleDateString()}</td>
                      </>
                    )}

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

    </div>
  );
}
