
import { useEffect, useState } from 'react'
import './App.css'

const starterTasks = [
  { id: 1, title: 'Learn Git basics', completed: true },
  { id: 2, title: 'Build a Docker image', completed: false },
  { id: 3, title: 'Create a GitHub Actions workflow', completed: false },
]

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem('devops-tasks')
    return savedTasks === null ? starterTasks : JSON.parse(savedTasks)
  } catch {
    return starterTasks
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [taskTitle, setTaskTitle] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('devops-tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(event) {
    event.preventDefault()

    const title = taskTitle.trim()
    if (!title) return

    setTasks((currentTasks) => [
      ...currentTasks,
      { id: Date.now(), title, completed: false },
    ])

    setTaskTitle('')
  }

  function toggleTask(id) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length
  const remainingCount = tasks.length - completedCount

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-mark">✓</span>
          Taskflow
        </a>
        <span className="project-label">DEVOPS PRACTICE PROJECT</span>
      </header>

      <section className="welcome" id="home">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h1>Make progress, <span>one task at a time.</span></h1>
        <p className="welcome-copy">
          Keep your goals organized and your momentum going.
        </p>
      </section>

      <section className="stats" aria-label="Task summary">
        <article className="stat-card">
          <span className="stat-icon">▤</span>
          <div>
            <p>Total tasks</p>
            <strong>{tasks.length}</strong>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">◷</span>
          <div>
            <p>Remaining</p>
            <strong>{remainingCount}</strong>
          </div>
        </article>
        <article className="stat-card">
          <span className="stat-icon">✓</span>
          <div>
            <p>Completed</p>
            <strong>{completedCount}</strong>
          </div>
        </article>
      </section>

      <section className="task-panel">
        <div className="panel-heading">
          <div>
            <h2>My tasks</h2>
            <p>Small steps lead to big results.</p>
          </div>
          <span className="task-count">{tasks.length} total</span>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="What needs to get done?"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            aria-label="New task"
          />
          <button className="add-button" type="submit">
            <span>+</span> Add task
          </button>
        </form>

        <div className="task-toolbar">
          <div className="filters" aria-label="Filter tasks">
            {['all', 'active', 'completed'].map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? 'filter active-filter' : 'filter'}
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
              >
                {option[0].toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              className="clear-button"
              type="button"
              onClick={() =>
                setTasks((currentTasks) =>
                  currentTasks.filter((task) => !task.completed)
                )
              }
            >
              Clear completed
            </button>
          )}
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">
                {tasks.length === 0 ? '✦' : '✓'}
              </span>
              <h3>
                {tasks.length === 0
                  ? 'Your list is ready'
                  : 'Nothing to show here'}
              </h3>
              <p>
                {tasks.length === 0
                  ? 'Add your first task above to get started.'
                  : 'Try another filter or add a new task.'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <article
                className={task.completed ? 'task-row completed-task' : 'task-row'}
                key={task.id}
              >
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    aria-label={`Mark ${task.title} as ${
                      task.completed ? 'active' : 'completed'
                    }`}
                  />
                  <span className="custom-check" aria-hidden="true">
                    {task.completed ? '✓' : ''}
                  </span>
                  <span className="task-title">{task.title}</span>
                </label>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete ${task.title}`}
                  title="Delete task"
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>

        <footer className="list-footer">
          <span>{remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} left</span>
          <span>Built for getting things done.</span>
        </footer>
      </section>

      <footer className="app-footer">
        <span>Taskflow <span className="footer-dot">·</span> DevOps learning lab</span>
        <span>Plan. Build. Ship.</span>
      </footer>
    </main>
  )
}

export default App
