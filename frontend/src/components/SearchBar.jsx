export default function SearchBar() {
  return (
    <div className="flex justify-center">
      <div className="flex bg-white rounded-full shadow overflow-hidden w-[400px]">
        <input
          className="flex-1 p-3 outline-none"
          placeholder="어떤 직무를 찾고 계신가요?"
        />
        <button className="bg-orange-500 text-white px-6">
          검색하기
        </button>
      </div>
    </div>
  );
}