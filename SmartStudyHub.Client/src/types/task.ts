export enum TaskStatus {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
    OnHold = 3,
    Cancelled = 4
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    createdAt: string;
    dueDate?: string;
}

export interface CreateTaskDto {
    title: string;
    description?: string;
    dueDate?: string;
}