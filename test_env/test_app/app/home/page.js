import style from './home.module.css';
import Headbar from '../nav_bar';
import Link from 'next/link';


// function TempNews() {
//   return (

//   );
// }

function Section1() {
  return (
    <div id={style.sec1} className={style['home-sec']}>
      <Headbar />

      <div id={style['temp-news']}>
        <div></div>
        <div>Black Turing is Back</div>
      </div>

      <div id={style.slogan}>Slogan Slogan Slogan</div>
      <div id={style['demo-blks']} className='single-row-flex-container'>
        <div className={style.blk}>
          <div><b>Text to 3D</b></div>
          <video src="temp.mp4" alt="err"></video>
        </div>
        <div className={style.blk}>
          <div><b>Image to 3D</b></div>
          <div className='single-row-flex-container'>
            <image alt="err"></image>
            <image alt="err"></image>
            <image alt="err"></image>
          </div>
        </div>
        <div className={style.blk}>
          <div><b>Pestyle 3D</b></div>
          <div className='single-row-flex-container'>
            <div className='single-col-flex-container'>
              <image alt="err"></image>
              <image alt="err"></image>
            </div>
            <div className='single-col-flex-container'>
              <image alt="err"></image>
              <image alt="err"></image>
              <image alt="err"></image>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function Section2() {
  return (
    <div id={style.sec2} className={style['home-sec']}>
      <div>Section 2</div>
      <div id={style.slogan2}>Slogan Slogan Slogan</div>
      <div id={style.rolling}>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        <image alt="err"></image>
        {/* <image alt="err"></image> */}
      </div>
    </div>
  );
}

function Section3() {
  return (
    <div id={style.sec3} className={style['home-sec']}>
      <div>Section 3</div>
      <div id={style.slogan3}>Slogan Slogan Slogan</div>
      <div id={style['sec3-demo-blks']} className='single-col-flex-container'>
        <div id={style['sec3-3d']} className='single-row-flex-container'>
          <div>3D</div>
          <div></div>
          <div>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
        <div id={style['sec3-style']} className='single-row-flex-container'>
          <div>Style</div>
          <div>
            <ul>
              <li>Carton</li>
              <li>Realistic</li>
              <li>Pixel</li>
              <li>Anything</li>
              <div className={style['gap-hor-50']}></div>
              <div className={style['gap-ver-50']}></div>
            </ul>
          </div>
          <div>
            <ul>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <div className={style['gap-hor-50']}></div>
              <div className={style['gap-ver-33']}></div>
              <div className={style['gap-ver-66']}></div>
            </ul>
          </div>
        </div>
        <div id={style['sec3-vtuber']} className='single-row-flex-container'>
          <div>Vtuber</div>
          <div>
            <ul className='single-col-flex-container'>
              <li>Cartoonization</li>
              <li>Clothes</li>
              <li>More</li>
            </ul>
          </div>
          <div>
            <ul className='single-col-flex-container'>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section4() {
  
  return (
    <div id={style.sec4} className={style['home-sec']}>
      {/* <div>Section 4</div> */}
      <div>Growth with 100k users</div>
      <div className='single-col-flex-container'>
        <div id={style.slogan4}>
          Slogan Slogan Slogan
        </div>
        <div className='single-row-flex-container'>
          <Link href='./'>App</Link>
          <Link href='./'>Discord</Link>
          <Link href='./'>Youtube</Link>
        </div>
      </div>
      <div>Logo</div>
      <div>
        <ul>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
          <li>temp</li>
        </ul>
      </div>
    </div>
  );
}


export default function Home() {
  return (
    <div id="main">
      <div id={style.home}>
        <Section1 />
        <Section2 />
        <Section3 />
        <Section4 />
      </div>
    </div>
  );
}
