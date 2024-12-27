import style from './team.module.css';
import Headbar from '../nav_bar';



export default function Team() {
  return (
    <div id="main">
      <div id={style.team}>
        <Headbar />
        <h1>team</h1>
      </div>
    </div>
  );
}