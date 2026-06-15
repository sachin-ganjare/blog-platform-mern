import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`)
        const data = await res.json()
        if (res.ok) {
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenDeleteModal = (post) => {
    setPostToDelete(post);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;

    setIsDeleteModalOpen(false);
    setDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        `/api/post/deletepost/${postToDelete._id}/${currentUser._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: postToDelete._id, userId: currentUser._id }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.message || data?.msg || "Delete failed";
        setErrorMessage(msg);
        setDeleting(false);
        return;
      }

      // optimistic UI update
      setUserPosts((prev) => prev.filter((p) => p._id !== postToDelete._id));
      setSuccessMessage(typeof data === "string" ? data : "Post deleted successfully");
      setDeleting(false);
      setPostToDelete(null);
    } catch (error) {
      setErrorMessage(error.message);
      setDeleting(false);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date Updated</TableHeadCell>
                <TableHeadCell>Post Image</TableHeadCell>
                <TableHeadCell>Post Title</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
                <TableHeadCell><span>edit</span></TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className='divide-y'>
              {userPosts.map((post) => (
                <TableRow
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{new Date(post.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className='w-20 h-10 object-cover bg-gray-500'
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-white ' to={`/post/${post.slug}`}>
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link className='font-medium text-gray-900 dark:text-white ' to={`/post/${post.slug}`}>
                      {post.category}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => handleOpenDeleteModal(post)}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
                  </TableCell>

                  <TableCell>
                    <Link className='text-teal-500' to={`/update-post/${post._id}`}>
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {
            showMore && (
              <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                Show more
              </button>
            )
          }
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}

      <Modal
        show={isDeleteModalOpen}
        size="md"
        onClose={() => {
          if (deleting) return;
          setIsDeleteModalOpen(false);
        }}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg mb-5 text-gray-500 dark:text-gray-400">
              Delete this post?
            </h3>

            {errorMessage && (
              <Alert color="failure" className="mb-3" onDismiss={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert color="success" className="mb-3" onDismiss={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}

            <div className="flex justify-center gap-4">
              <Button
                color="gray"
                onClick={() => {
                  if (deleting) return;
                  setIsDeleteModalOpen(false);
                  setPostToDelete(null);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button color="failure" onClick={handleDeletePost} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

