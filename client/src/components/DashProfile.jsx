import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, ModalBody, Modal, ModalHeader, TextInput } from 'flowbite-react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

export default function DashProfile() {
    const { currentUser, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const [formData, setFormData] = useState(() => ({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        password: ''
    }));


    const filePickerRef = useRef();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                setErrorMessage('Image size must be less than 1 MB');
                e.target.value = '';
                return;
            }

            setErrorMessage(null);
            setSuccessMessage(null);
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
            setUploadedImageUrl(null);
            e.target.value = '';
        }
    };

    useEffect(() => {
        const uploadImage = async () => {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
            const folder = import.meta.env.VITE_CLOUDINARY_FOLDER || 'profile-pictures';

            if (!cloudName || !uploadPreset) {
                setErrorMessage('Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
                return;
            }

            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folder);
            const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
            const randomString = Math.random().toString(36).slice(2, 7);
            formData.append('public_id', `${timestamp}-${randomString}`);

            setUploading(true);
            setUploadProgress(0);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    setUploadProgress(Math.round((event.loaded / event.total) * 100));
                }
            };

            xhr.onload = () => {
                setUploading(false);

                if (xhr.status >= 200 && xhr.status < 300) {
                    const data = JSON.parse(xhr.responseText);
                    setImageFileUrl(data.secure_url);
                    setUploadedImageUrl(data.secure_url);
                    setImageFile(null);
                    setUploadProgress(100);
                    return;
                }

                const data = JSON.parse(xhr.responseText || '{}');
                setErrorMessage(data?.error?.message || 'Image upload failed');
            };

            xhr.onerror = () => {
                setUploading(false);
                setErrorMessage('Failed to upload image.');
            };

            xhr.send(formData);
        };

        if (imageFile) {
            uploadImage();
        }
    }, [imageFile]);

    useEffect(() => {
        return () => {
            if (imageFileUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(imageFileUrl);
            }
        };
    }, [imageFileUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploading) {
            setErrorMessage('Please wait for the image upload to finish.');
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        dispatch(updateStart());

        try {
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser._id,
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    profilePicture: uploadedImageUrl || currentUser.profilePicture,
                }),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(updateFailure(data.message));
                setErrorMessage(data.message);
                return;
            }

            if (res.ok) {
                dispatch(updateSuccess(data));
                setSuccessMessage('Profile updated successfully.');
                setFormData((prev) => ({ ...prev, password: '' }));
                return;
            }

            dispatch(updateFailure(data.message || 'Update failed'));
            setErrorMessage(data.message || 'Update failed');
        } catch (error) {
            dispatch(updateFailure(error.message));
            setErrorMessage(error.message);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleteModalOpen(false);
        dispatch(deleteUserStart());
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser._id }),
            });

            const data = await res.json();

            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                setErrorMessage(data.message);
                return;
            }

            if (res.ok) {
                dispatch(deleteUserSuccess());
                navigate('/sign-in');
            } else {
                const msg = data.message || 'Delete failed';
                dispatch(deleteUserFailure(msg));
                setErrorMessage(msg);
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
            setErrorMessage(error.message);
        }
    };


    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/auth/signout', {
                method: 'POST',
            });

            if (res.ok) {
                dispatch(signOutSuccess());
                navigate('/sign-in');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            {errorMessage && (
                <Alert color="failure" onDismiss={() => setErrorMessage(null)} className="mb-4">
                    {errorMessage}
                </Alert>
            )}
            {successMessage && (
                <Alert color="success" onDismiss={() => setSuccessMessage(null)} className="mb-4">
                    {successMessage}
                </Alert>
            )}
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
                <div onClick={() => filePickerRef.current.click()} className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
                    <img src={imageFileUrl || currentUser.profilePicture} alt="user" className='rounded-full w-full h-full object-cover border-8 bordder-[lightgray] overflow-hidden rounded-full'></img>
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-[1px]">
                            <div className="w-20 h-20">
                                <CircularProgressbar
                                    value={uploadProgress}
                                    text={`${uploadProgress}%`}
                                    styles={buildStyles({
                                        textSize: '18px',
                                        textColor: 'rgba(255, 255, 255, 0.92)',
                                        pathColor: 'rgba(255, 255, 255, 0.85)',
                                        trailColor: 'rgba(255, 255, 255, 0.18)',
                                        backgroundColor: 'transparent',
                                    })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <TextInput
                    type='text'
                    id='username'
                    placeholder='username'
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                />
                <TextInput
                    type='text'
                    id='email'
                    placeholder='email'
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
                <TextInput
                    type='text'
                    id='password'
                    placeholder='password'
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                />

                <Button outline type='submit' disabled={uploading || loading}>
                    {loading ? 'Updating...' : 'Update'}
                </Button>
            </form>
            <div className="text-red-500 flex justify-between mt-5">
                <span onClick={() => setIsDeleteModalOpen(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
            </div>

            <Modal show={isDeleteModalOpen} size="md" onClose={() => setIsDeleteModalOpen(false)} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                        <h3 className="text-lg mb-5 text-gray-500 dark:text-gray-400">Delete your account?</h3>
                        {errorMessage && (
                            <Alert color="red" className="mt-4" onDismiss={() => setErrorMessage(null)}>
                                {errorMessage}
                            </Alert>
                        )}
                        <div className="flex justify-center gap-4">
                            <Button color="gray" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button color="failure" onClick={handleDeleteAccount} disabled={loading}>
                                {loading ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

