import Head from 'next/head';
import Message from '@/components/message';
import { useEffect, useState } from 'react';
import { db } from '@/utils/firebase';
import { async } from '@firebase/util';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

export default function Home() {
  // Create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);
  const getPosts = async () => {
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=' my-12 text-lg font-medium'>
        <h2>
          See what other people are saying
        </h2>
        {allPosts.map(post => (
          <Message{...post} key={post.id}>

          </Message>
        ))}
      </div>
    </>
  );
}
