export default function Card({ title, desc, button, highlight, orange }) {

  let bg = "bg-white shadow";
  if (highlight) bg = "bg-orange-300";
  if (orange) bg = "bg-orange-200";

  return (
    <div className={`${bg} p-6 rounded-2xl`}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{desc}</p>

      {button && (
        <button className="bg-white px-4 py-2 rounded-lg">
          {button}
        </button>
      )}
    </div>
  );
}