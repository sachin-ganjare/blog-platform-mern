import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
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
} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const hydrateLinkedData = async (commentList) => {
  const uniqueUserIds = [...new Set(commentList.map((comment) => comment.userId))];
  const uniquePostIds = [...new Set(commentList.map((comment) => comment.postId))];

  const [userResults, postResults] = await Promise.all([
    Promise.all(
      uniqueUserIds.map(async (userId) => {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) return [userId, null];
        const data = await res.json();
        return [userId, data];
      })
    ),
    Promise.all(
      uniquePostIds.map(async (postId) => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        if (!res.ok) return [postId, null];
        const data = await res.json();
        return [postId, data.posts?.[0] || null];
      })
    ),
  ]);

  return {
    usersById: Object.fromEntries(userResults),
    postsById: Object.fromEntries(postResults),
  };
};

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [usersById, setUsersById] = useState({});
  const [postsById, setPostsById] = useState({});
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/comment/getcomments?limit=9&sort=desc');
        const data = await res.json();

        if (res.ok) {
          const initialComments = data.comments || [];
          setComments(initialComments);
          setShowMore(initialComments.length === 9);
          const linkedData = await hydrateLinkedData(initialComments);
          setUsersById(linkedData.usersById);
          setPostsById(linkedData.postsById);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchComments();
    }
  }, [currentUser?.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}&limit=9&sort=desc`
      );
      const data = await res.json();

      if (res.ok) {
        const nextComments = data.comments || [];
        const updatedComments = [...comments, ...nextComments];
        setComments(updatedComments);
        setShowMore(nextComments.length === 9);
        const linkedData = await hydrateLinkedData(updatedComments);
        setUsersById(linkedData.usersById);
        setPostsById(linkedData.postsById);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenDeleteModal = (comment) => {
    setCommentToDelete(comment);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteComment = async () => {
    if (!commentToDelete) return;

    setIsDeleteModalOpen(false);
    setDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/comment/deleteComment/${commentToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.message || data?.msg || 'Delete failed';
        setErrorMessage(msg);
        setDeleting(false);
        return;
      }

      setComments((prev) => prev.filter((comment) => comment._id !== commentToDelete._id));
      setSuccessMessage(
        typeof data === 'string' ? data : 'Comment deleted successfully'
      );
      setDeleting(false);
      setCommentToDelete(null);
    } catch (error) {
      setErrorMessage(error.message);
      setDeleting(false);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser?.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date</TableHeadCell>
                <TableHeadCell>Comment</TableHeadCell>
                <TableHeadCell>User</TableHeadCell>
                <TableHeadCell>Post</TableHeadCell>
                <TableHeadCell>Likes</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody className='divide-y'>
              {comments.map((comment) => {
                const user = usersById[comment.userId];
                const post = postsById[comment.postId];

                return (
                  <TableRow
                    key={comment._id}
                    className='bg-white dark:border-gray-700 dark:bg-gray-800'
                  >
                    <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className='max-w-xs'>
                      <p className='max-h-20 overflow-hidden break-words'>
                        {comment.content}
                      </p>
                    </TableCell>
                    <TableCell>
                      {user ? (
                        <Link className='text-teal-500 hover:underline' to={`/dashboard?tab=users`}>
                          @{user.username}
                        </Link>
                      ) : (
                        comment.userId
                      )}
                    </TableCell>
                    <TableCell>
                      {post ? (
                        <Link className='font-medium text-gray-900 dark:text-white hover:underline' to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      ) : (
                        comment.postId
                      )}
                    </TableCell>
                    <TableCell>{comment.numberOfLikes || 0}</TableCell>
                    <TableCell>
                      <span
                        onClick={() => handleOpenDeleteModal(comment)}
                        className='font-medium text-red-500 hover:underline cursor-pointer'
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {showMore && (
            <button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
        </>
      ) : loading ? (
        <p>Loading comments...</p>
      ) : (
        <p>No comments found.</p>
      )}

      <Modal
        show={isDeleteModalOpen}
        size='md'
        onClose={() => {
          if (deleting) return;
          setIsDeleteModalOpen(false);
        }}
        popup
      >
        <ModalHeader />
        <ModalBody>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='text-lg mb-5 text-gray-500 dark:text-gray-400'>
              Delete this comment?
            </h3>

            {errorMessage && (
              <Alert color='failure' className='mb-3' onDismiss={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert color='success' className='mb-3' onDismiss={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}

            <div className='flex justify-center gap-4'>
              <Button
                color='gray'
                onClick={() => {
                  if (deleting) return;
                  setIsDeleteModalOpen(false);
                  setCommentToDelete(null);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button color='failure' onClick={handleDeleteComment} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
