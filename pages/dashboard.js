import { auth, db } from '@/utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import Message from '@/components/message';

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
    // Get users data
    useEffect(() => {
        getData();
    }, [user, loading]);
    return (
        <div>
            <h1>Your posts</h1>
            <div>
                {posts.map(post => (
                    <Message{...post} key={posts.id}>
                    </Message>
                ))}
            </div>
            <button onClick={() => auth.signOut()}>Sing out</button>
        </div>
    );
}
