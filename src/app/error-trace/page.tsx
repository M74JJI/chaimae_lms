export const dynamic = "force-dynamic";

export default async function ErrorTracePage() {
  async function getTodos() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicodesss.com/todos"
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("error: ", error);
    }
  }

  const todos = await getTodos();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Todos</h1>
        <div className="space-y-4">
          {todos.map(
            (todo: { id: number; title: string; completed: boolean }) => (
              <div
                key={todo.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    readOnly
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <p
                    className={`text-gray-700 ${
                      todo.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {todo.title}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}
