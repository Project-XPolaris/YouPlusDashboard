import {useState} from "react";
import {fetchTaskList} from "@/services/ant-design-pro/info";

const useTaskModel = () => {
  const [tasks, setTasks] = useState<API.Task[]>([]);
  const refresh = async () => {
    const response = await fetchTaskList()
    if (response.tasks) {
      setTasks(response.tasks)
    }
  }
  return {
    tasks,
    refresh
  }
}
export default useTaskModel
