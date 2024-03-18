import styles from "./page.module.css";
import {FavouriteMoviesList} from '@/components/FavouriteMoviesList';

export default function Home() {
  return (
    <main className={styles.main}>
      <FavouriteMoviesList />
    </main>
  );
}
