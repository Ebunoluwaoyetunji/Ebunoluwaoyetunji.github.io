import Todo from './Todo.jsx';

// The CV link, or a visible TODO until Ebun adds the file (home.js `cv`).
export default function CvLink({ cv }) {
  return cv.href ? <a href={cv.href}>CV</a> : <span>CV <Todo>{cv.todo}</Todo></span>;
}
