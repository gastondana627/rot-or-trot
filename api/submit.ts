const handleProjectSubmit = async (rawInput: string) => {
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: rawInput })
    });
    
    if (res.ok) {
      const newProject = await res.json();
      // Update your local state/feed to instantly show the new project card!
      setProjects(prev => [newProject, ...prev]);
    }
  } catch (error) {
    console.error('Failed to submit project:', error);
  }
};