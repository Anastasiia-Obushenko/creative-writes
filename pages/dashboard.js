import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';
import { doc, query, collection, where, onSnapshot, deleteDoc } from 'firebase/firestore';
import Message from '@/components/message';
import { BsTrash2Fill } from 'react-icons/bs';
import { AiFillEdit } from 'react-icons/ai';
import Link from 'next/link';

export default function Dashboard() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    const [posts, setPosts] = useState([]);
    // See if user logged
    const getData = async () => {
        if (loading) return;
        if (!user) return route.push("/auth/login");
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, where('user', '==', user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsubscribe;
    };
    // Delete Post
    const deletePost = async (id) => {
        const docRef = doc(db, 'posts', id);
        await deleteDoc(docRef);
    };
    // Get users data
    useEffect(() => {
        getData();
    }, [user, loading]);
    return (
        <div className="flex flex-col space-y-4">
            <h1>Your posts</h1>
            <div className="flex flex-col gap-4">
                {posts.map(post => (
                    <Message{...post} key={posts.id}>
                        <div className=' flex gap-4'>
                            <button
                                className=' text-pink-600 flex items-center justify-center gap-2 py-2'
                                onClick={() => deletePost(post.id)}>
                                <BsTrash2Fill className=' text-2xl' />
                                Delete
                            </button>
                            <Link
                                href={{ pathname: '/post', query: post }}
                                className=' text-teal-600 flex items-center justify-center gap-2 py-2'>
                                <AiFillEdit className=' text-2xl' />
                                Edit
                            </Link>
                        </div>
                    </Message>
                ))}
            </div>
            <button
                className=' font-medium text-white bg-gray-800 py-2 px-4 my-6'
                onClick={() => auth.signOut()}>Sing out</button>
        </div >
    );
}
