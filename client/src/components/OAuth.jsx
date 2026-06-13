import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { app } from '../firebase.js'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultsFromGoogle.user.displayName,
                    email: resultsFromGoogle.user.email,
                    googlePhotoUrl: resultsFromGoogle.user.photoURL,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                dispatch(signInSuccess(data));
                navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Button
            type="button"
            className="w-full  text-white"
            onClick={handleGoogleClick}
            outline
        >
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            OAuth
        </Button>
    )
}
