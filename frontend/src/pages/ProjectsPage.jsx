import { useEffect, useState } from 'react';
import { getAllProjects, createProject, updateProject, deleteProject } from '../services/projectService';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editing) {
        await updateProject(editing.id, { project_name: name, description });
        setEditing(null);
      } else {
        await createProject({ project_name: name, description });
      }
      setName('');
      setDescription('');
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to save project');
    }
  };

  const handleEdit = (project) => {
    setEditing(project);
    setName(project.project_name);
    setDescription(project.description || '');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to delete project');
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-slate-100">
      <h1 className="text-2xl font-semibold">Project management</h1>
      <p className="mt-2 text-slate-400">Create, edit, and remove projects used in weekly reports.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <div className="text-sm text-rose-400">{error}</div>}
            <div>
              <label className="block text-sm text-slate-400">Project name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400">Description</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">
                {editing ? 'Save changes' : 'Add project'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setName('');
                    setDescription('');
                  }}
                  className="rounded-2xl border border-slate-700 px-4 py-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="text-sm font-semibold text-slate-200">Existing projects</h3>
          {loading ? (
            <p className="mt-4 text-slate-400">Loading...</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {projects.map((project) => (
                <li key={project.id} className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2">
                  <div>
                    <div className="font-medium">{project.project_name}</div>
                    <div className="text-sm text-slate-400">{project.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(project)} className="rounded-xl border border-slate-700 px-3 py-2 text-sm">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="rounded-xl bg-rose-500 px-3 py-2 text-sm text-white">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}