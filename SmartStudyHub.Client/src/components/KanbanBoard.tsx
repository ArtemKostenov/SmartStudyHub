import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { TaskStatus, type Task } from "../types/task"
import { tasksApi } from "../api/taskApi";

const COLUMNS = [
    { id: String(TaskStatus.NotStarted), title: 'Нужно сделать', color: 'bg-gray-100', headerColor: 'text-gray-700' },
    { id: String(TaskStatus.InProgress), title: 'В работе', color: 'bg-blue-50', headerColor: 'text-blue-700' },
    { id: String(TaskStatus.Completed), title: 'Готово', color: 'bg-green-50', headerColor: 'text-green-700'},
]

export const KanbanBoard = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const data = await tasksApi.getAll();
            setTasks(data.filter(t => t.status !== TaskStatus.Cancelled));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        let newStatus: number;

        if (destination.droppableId === 'trash') {
            newStatus = TaskStatus.Cancelled;
        } else {
            newStatus = parseInt(destination.droppableId);
        }

        const taskId = parseInt(draggableId);

        const oldTasks = [...tasks];

        if (newStatus === TaskStatus.Cancelled) {
            setTasks(tasks.filter(t => t.id !== taskId));
        } else {
            setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus} : t));
        }

        try {
            await tasksApi.updateStatus(taskId, newStatus);
        } catch (error) {
            setTasks(oldTasks);
            alert('Не удалось переместить задачу');
        }
    };

    if (loading) return <div className="text-center p-10">Загрузка доски...</div>;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col h-full gap-6">
                <div className="flex gap-4 overflow-x-auto p-2 flex-grow">
                    {COLUMNS.map((col) => (
                        <Droppable key={col.id} droppableId={col.id}>
                            {(provided, snapshot) => (
                                <div 
                                    ref={provided.innerRef} 
                                    {...provided.droppableProps}
                                    className={`min-w-[300px] w-1/3 rounded-xl p-4 flex flex-col transition-colors ${snapshot.isDraggingOver ? 'ring-2 ring-indigo-400 bg-opacity-80' : ''} ${col.color}`}
                                >
                                    <h3 className={`font-bold mb-4 flex justify-between ${col.headerColor}`}>
                                        {col.title}
                                        <span className="bg-white bg-opacity-60 px-2 rounded-full text-sm">
                                            {tasks.filter(t => t.status.toString() === col.id).length}
                                        </span>
                                    </h3>

                                    <div className="flex-1 overflow-y-auto space-y-3 min-h-[100px]">
                                        {tasks.filter((task) => task.status.toString() === col.id).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style }}
                                                        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 group relative ${snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500 rotate-2 z-50' : 'hover:shadow-md'}`}
                                                    >
                                                       <h4 className="font-medium text-gray-800">{task.title}</h4>
                                                       {task.description && (
                                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                       )}

                                                       <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-50">
                                                        {task.dueDate ? (
                                                            <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${new Date(task.dueDate) < new Date() ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </span>
                                                        ) : <span></span>} 

                                                       </div> 
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                      {provided.placeholder} 
                                    </div> 
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

               <Droppable droppableId="trash">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`h-24 border-2 border-dashed rounded-xl flex items-center justify.center transition-colors ${snapshot.isDraggingOver ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 text-gray-400 hover:border-red-300 hover:text-red-400'}`}
                        >
                            <div className="flex flex-col items-center gap-1 font-medium">
                                <span className="flex text-2xl px-2">Перетащи сюда, чтобы отменить задачу</span>
                            </div>
                            <div className="hidden">{provided.placeholder}</div>
                        </div>
                    )}
               </Droppable> 

            </div>
        </DragDropContext>
    );
};