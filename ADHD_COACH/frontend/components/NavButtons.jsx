import { Link } from 'react-router-dom';

export function NavButtons() {
  return (
    <div className="buttons flex gap-5 justify-center mb-13 mt-10">
      <Link to="/progress">
        <button className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm">Progress</button>
      </Link>
      <Link to="/subjects">
        <button className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm">Subjects</button>
      </Link>
      <Link to="/recall">
        <button className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm">Recall</button>
      </Link>
      <Link to="/study">
        <button className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm">Study</button>
      </Link>
      <Link to="/manage">
        <button className="bg-[#4A5D45] text-white px-4 py-2 rounded-sm">Manage</button>
      </Link>
    </div>
  );
}