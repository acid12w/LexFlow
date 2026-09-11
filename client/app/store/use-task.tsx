// import { create } from "zustand";
// // Import your service functions
// import { taskService } from "../services/taskService";

// interface TaskStore {
//   tasks: ITaskInterface[];
//   isLoading: boolean;
//   loadTasks: (caseId: string) => Promise<void>;
//   addTask: (taskData: Partial<ITaskInterface>) => Promise<void>;
//   updateTask: (
//     taskId: string,
//     updateData: Partial<ITaskInterface>
//   ) => Promise<void>;
//   bulkUpdateTasks: (updateData: Partial<ITaskInterface>) => Promise<void>;
//   deleteTask: (taskId: string) => Promise<void>;
// }

// export const useTaskStore = create<TaskStore>((set, get) => ({
//   tasks: [],
//   isLoading: false,

//   // READ: Load all tasks for the current case
//   loadTasks: async (caseId) => {
//     set({ isLoading: true });
//     try {
//       const response = await taskService.getTasksByCaseId(caseId);

//       set({ tasks: response.data, isLoading: false });
//     } catch (error) {
//       set({ isLoading: false });
//     }
//   },

//   // CREATE: Add new task to the list
//   addTask: async (taskData) => {
//     try {
//       const newTask = await taskService.createTask(taskData);

//       set((state) => ({
//         tasks: [...state.tasks, newTask],
//       }));
//     } catch (error) {
//       console.error("Create failed", error);
//     }
//   },

//   // UPDATE: Modify an existing task
//   updateTask: async (taskId, updateData) => {
//     try {
//       const updatedTask = await taskService.updateTasks(updateData, taskId);
//       // Map through tasks and replace the one that matches the ID
//       set((state) => ({
//         tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
//       }));
//     } catch (error) {
//       console.error("Update failed", error);
//     }
//   },

//   // UPDATE: Modify an existing task
//   bulkUpdateTasks: async (updateData) => {
//     try {
//       const updatedTask = await taskService.bulkUpdateTasks(updateData);
//       // Map through tasks and replace the one that matches the ID

//       set((state) => ({
//         tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
//       }));
//     } catch (error) {
//       console.error("Update failed", error);
//     }
//   },

//   // DELETE: Remove a task from the list
//   deleteTask: async (taskId) => {
//     try {
//       await deleteTaskService(taskId);
//       // Filter out the deleted task from the local state
//       set((state) => ({
//         tasks: state.tasks.filter((t) => t._id !== taskId),
//       }));
//     } catch (error) {
//       console.error("Delete failed", error);
//     }
//   },
// }));
