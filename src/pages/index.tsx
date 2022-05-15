import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: React.FC<HomeProps> = ({ postsPagination }: HomeProps) => {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  return (
    <>
      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>

      <Header />

      <main className={styles.container}>
        <section>
          {posts.results.map(post => (
            <article className={styles.postContent} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div>
                    <time>
                      <FiCalendar />
                      {post.first_publication_date}
                    </time>
                    <span>
                      <FiUser />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            </article>
          ))}
          {/* {posts.next_page && (
            <button type="button" onClick={loadMorePosts}>
              Carregar mais posts
            </button>
          )} */}
          {/* {preview && (
            <aside className={commonStyles.exitPreviewButton}>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
          )} */}
        </section>
      </main>
    </>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const data = await prismic.getByType('posts');

  const results: Post[] = (data.results as unknown as Post[]).map(v => ({
    ...v,
    first_publication_date: format(
      new Date(v.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
  }));

  const postsPagination: PostPagination = {
    next_page: data.next_page,
    results,
  };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 5,
  };
};
