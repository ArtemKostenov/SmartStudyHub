import { useEffect, useState } from "react";
import { TaskStatus, type Task } from "../types/task"
import { tasksApi } from "../api/taskApi";

const COLUMNS = [
    { id: TaskStatus.NotStarted, title: 'Нужно сделать', color: 'bg-gray-100' },
    { id: TaskStatus.InProgress, title: 'В работе', color: 'bg-blue-50' },
    { id: TaskStatus.Completed, title: 'Готово', color: 'bg-green-50'},
]

export const KanbanBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const data = await tasksApi.getAll();
            setTasks(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const renderCard = (task: Task) => (
        <div key={task.id} className="bg-white p-3 rounded shadow-sm mb-2 border border-gray-200 cursor-pointer hover:shadow-md transition">
            <h4 className="font-medium text-gray-800">{task.title}</h4>
            {task.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
            <div className="flex justify-between items-center mt-2">
                {task.dueDate && (
                    <span className="text-xs text-red-500 bg-red-50 px-1 rounded">
                        {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                )}

                {/* Временно до drug-drop */}
                <div className="flex gap-1">
                    {task.status !== TaskStatus.Completed && (
                        <button
                            onClick={() => moveTask(task, task.status + 1)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                        >
                            →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const moveTask = async (task: Task, newStatus: TaskStatus) => {
        const oldTasks = [...tasks];
        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus} : t));

        try {
            await tasksApi.updateStatus(task.id, newStatus);
        } catch (error) {
            setTasks(oldTasks);
            alert("Ошибка обновления статуса");
        }
    };

    if (loading) return <div>Загрузка доски...</div>;

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
            {COLUMNS.map((col) => (
                <div key={col.id} className={`min-w-[300px] w-1/3 rounded-lg p-4 ${col.color} flex flex-col`}>
                    <h3 className="font-bold text-gray-700 mb-4 flex justify-between">
                        {col.title}
                        <span className="bg-white px-2 rounded-full text-sm text-gray-500">
                            {tasks.filter(t => t.status === col.id).length}
                        </span>
                    </h3>

                    <div className="flex-1 overflow-y-auto">
                        {tasks.filter(task => task.status === col.id).map(renderCard)}
                    </div>
                </div>
            ))}
        </div>
    );
};