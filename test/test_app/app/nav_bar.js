import Link from 'next/link';


export default function Headbar() {
  return (
    <>
      <h1 id="logo">Logo</h1>
      <nav id="nav-bar">
        <ul>
          <li>
            <Link href="/home">Home</Link>
          </li>
          <div className='nav_bar_sep'></div>
          <li>
            <Link href="/features">Features</Link>
          </li>
          <div className='nav_bar_sep'></div>
          <li>
            <Link href="/3d_exchange">3D Exchange</Link>
          </li>
          <div className='nav_bar_sep'></div>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          <div className='nav_bar_sep'></div>
          <li>
            <Link href="/more">More</Link>
          </li>
          <div className='nav_bar_sep'></div>
          <li>
            <Link href="/team">Team</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}