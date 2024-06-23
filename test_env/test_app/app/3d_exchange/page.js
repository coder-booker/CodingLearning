import style from './3d_exchange.module.css';
import Headbar from '../nav_bar';



export default function Exchange() {
  return (
    <div id="main">
      <div id={style['3d-exchange']}>
        <Headbar />
        <h1>3D exchange</h1>
      </div>
    </div>
  );
}