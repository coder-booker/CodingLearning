import style from './pricing.module.css';
import Headbar from '../nav_bar';



export default function Pricing() {
  return (
    <div id="main">
      <div id={style.pricing}>
        <Headbar />
        <h1>pricing</h1>
      </div>
    </div>
  );
}