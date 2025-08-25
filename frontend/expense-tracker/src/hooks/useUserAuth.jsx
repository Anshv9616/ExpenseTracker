import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance  from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";


export const useUserAuth = () => {
  // Extract values and methods from the global UserContext
  const { user, updateUser, clearUser } = useContext(UserContext);

  // React Router hook to navigate between pages
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is already set in context, do nothing
    if (user) return;

    // Flag to track whether the component is still mounted
    let isMounted = true;

    // Function to fetch the currently logged-in user's information
    const fetchUserInfo = async () => {
      try {
        // Send request to backend to get user data
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

        // If the component is still mounted and we got valid data,
        // update the global user state
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (err) {
        console.log("Failed to fetch user info", err);

        // If the component is still mounted, clear user data and redirect to login
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };

    // Call the function
    fetchUserInfo();

    // Cleanup function: set isMounted to false when component unmounts
    return () => {
      isMounted = false;
    };

    // Dependency array ensures this runs when these values change
  }, [user, updateUser, clearUser, navigate]);
};
// import { useContext, useEffect } from "react";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { axiosInstance } from "../utils/axiosinstance";
// import { API_PATHS } from "../utils/apiPaths";

// export const useUserAuth = () => {
//   const { updateUser, clearUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     let isMounted = true;

//     const fetchUserInfo = async () => {
//       try {
//         const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);

//         if (isMounted && response.data) {
//           updateUser(response.data);
//         }
//       } catch (err) {
//         console.log("Failed to fetch user info", err);

//         if (isMounted) {
//           clearUser();
//           navigate("/login");
//         }
//       }
//     };

//     // Always fetch on mount
//     fetchUserInfo();

//     // Cleanup to prevent state updates on unmounted component
//     return () => {
//       isMounted = false;
//     };
//   }, [updateUser, clearUser, navigate]);
// };
