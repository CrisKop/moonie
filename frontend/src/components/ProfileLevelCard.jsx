import { useTasks } from "../context/ChatContext"
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function TaskCard({ task }) {

    const {deleteTask} = useTasks();

  return (
<div className="p-6 rounded-md foro flex-col bgcolorcard">

<header className="flex justify-between">
  <h1 className="text-4xl font-bold overflow-hidden whitespace-nowrap text-ellipsis margindown">
    {task.title}
  </h1>

  <div className="flex gap-x-2 gap-y-2 cardbtnswidthprofile flex-wrap">
  <Link className="flex align-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" to={`/levels/${task.index}`}>View</Link>
    <Link className="flex align-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md" to={`/levels/edit/${task.index}`}>Edit</Link>
    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md" onClick={() => {deleteTask(task._id)}}>Delete</button>
  </div>
</header>
<h2>Descripción:</h2>
<p className="text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis">
  {task.description}
</p>
<br></br>
<p className="text-slate-500">{dayjs(task.date).utc().format('DD/MM/YYYY')}</p>
</div>
  )
}

export default TaskCard