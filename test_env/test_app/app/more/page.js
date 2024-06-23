import style from './more.module.css';
import Headbar from '../nav_bar';



export default function More() {
  return (
    <div id="main">
      <div id={style.more}>
        <Headbar />
        <h1>more</h1>
      </div>
    </div>
  );
}