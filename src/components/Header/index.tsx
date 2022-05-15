import Link from 'next/link';
import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.postHeader}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="logo" className={styles.logo} />
        </a>
      </Link>
    </header>
  );
};

export default Header;
