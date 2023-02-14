import { auth } from '@/utils/firebase';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';

export default function Dashboard() {
    const route = useRouter();
    const [user, loading] = useAuthState(auth);
    // See if user logged
    const getData = async () => {
        if (loading) return;
        if (!user) return route.push("/auth/login");
    };
    // Get users data
    useEffect(() => {
        getData();
    }, [user, loading]);
    return (
        <div>
            <h1>Your posts</h1>
            <div>posts</div>
            <button onClick={() => auth.signOut()}>Sing out</button>
        </div>
    );
}
