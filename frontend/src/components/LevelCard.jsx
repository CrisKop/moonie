import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

function TaskCard({ task }) {

  return (
<div className="p-6 rounded-md foro flex-col bgcolorcard">

<header className="flex justify-between">
  <h1 className="text-4xl font-bold overflow-hidden whitespace-nowrap text-ellipsis margindown">
    {task.title}
  </h1>

  <div className="flex flex-col">
    <div className="flex gap-x-2 gap-y-2 cardbtnswidth flex-wrap">
  <Link className="flex align-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md" to={`/levels/${task.index}`}>More Details</Link>
  <a className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded-md" href={`/levelfiles/${task._id}.dat`} download={`theDasher-${task.title.replace(/ /g, "_")}-${task.index}.dat`}>Download</a>
    </div>
  </div>
  
</header>
<h2>Descripción:</h2>
<p className="text-slate-300 overflow-hidden whitespace-nowrap text-ellipsis">
  {task.description}
</p>
<br></br>
<div className="flex justify-between overflow-hidden whitespace-nowrap text-ellipsis">
<p className="text-slate-500">{dayjs(task.date).utc().format('DD/MM/YYYY')}</p>
<h1 className="levelcreator text-2xl ">By {task.user ? task.user.username : "By ???"}</h1>
</div>
</div>
  )
}

export default TaskCard