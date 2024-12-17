import Notes from "./components/Notes";
import Note from "./components/Note";

export default function Home() {
  return (
    <div className="container">
      <Note />
      <Notes />
    </div>
  );
}
