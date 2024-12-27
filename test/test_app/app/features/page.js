import style from './features.module.css';
import Headbar from '../nav_bar';



export default function Features() {
  return (
    <div id="main">
      <div id={style.features}>
        <Headbar />
        <h1>features</h1>
      </div>
    </div>
  );
}