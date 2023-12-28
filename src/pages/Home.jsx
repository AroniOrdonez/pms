import Link from 'next/link';

function Home() {
  return (
    <div>
      Desde Home<br /><br />
      <Link href="/Contact">
        Contact
      </Link>
      <br /><br />
      <Link href="/">
        Home
      </Link>
      <br /><br />
      <Link href="/Blog">
        Blog
      </Link>
    </div>
  );
}

export default Home;