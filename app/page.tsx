import TodoApp from "./components/TodoApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-start justify-center px-4 py-16">
      <TodoApp />
    </main>
  );
}
