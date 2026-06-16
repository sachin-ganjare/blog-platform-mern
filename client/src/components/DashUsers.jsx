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
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa"


export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);



  useEffect(() => {
    const fetchUsers = async () => {

      try {
        const res = await fetch(`/api/user/getusers`)
        const data = await res.json()
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }

      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;


    setIsDeleteModalOpen(false);
    setDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(
        `/api/user/deleteuser/${userToDelete._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userToDelete._id }),
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
      setUsers((prev) => prev.filter((p) => p._id !== userToDelete._id));
      setSuccessMessage(
        typeof data === "string" ? data : "User deleted successfully"
      );
      setDeleting(false);
      setUserToDelete(null);

    } catch (error) {
      setErrorMessage(error.message);
      setDeleting(false);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <TableHead>
              <TableRow>
                <TableHeadCell>Date created</TableHeadCell>
                <TableHeadCell>User image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
                <TableHeadCell>Email</TableHeadCell>
                <TableHeadCell>Admin</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>

              </TableRow>
            </TableHead>
            <TableBody className='divide-y' >
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className='w-15 h-15 object-cover bg-gray-500 rounded-full'
                    />

                  </TableCell>
                  <TableCell>
                    {user.username}
                  </TableCell>
                  <TableCell>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (<FaCheck className='text-green-500'></FaCheck> ): (<FaTimes className='text-red-500'></FaTimes>)}
                  </TableCell>


                  <TableCell>
                    <span
                      onClick={() => handleOpenDeleteModal(user)}
                      className='font-medium text-red-500 hover:underline cursor-pointer'
                    >
                      Delete
                    </span>
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
        <p>You have no users yet!</p>
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
              Delete this user?
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
                  setUserToDelete(null);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button color="failure" onClick={handleDeleteUser} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}

