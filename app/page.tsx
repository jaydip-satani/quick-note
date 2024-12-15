import Notes from "./components/Notes";
import Note from "./components/Note";
import FloatingActionButton from "./components/floatingActionButton";

export default function Home() {
  return (
    <div className="container">
      <FloatingActionButton />
      <Note />
      <Notes />
    </div>
  );
}
