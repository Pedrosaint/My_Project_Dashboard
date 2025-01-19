import React from "react";
import {User} from 'lucide-react'
import SettingSection from "../SettingSection";
import { useEffect, useState } from 'react';
import { auth, db } from '../../Firebase';
import { getDoc, doc } from "firebase/firestore";



//-------------------------------------------------------->

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
      console.log(user);
      // setUserDetails(user);
      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      }
      else {
        console.log('User is not Logged in');   
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  //----------------------------------------------------------->
  
  // const navigate = useNavigate(); // Initialize navigate
  // const handleProfile = () => {
  //   navigate("/Profile"); // Redirect to the login page
  // };
  return (
    <div>
      {userDetails ? (
        <>
          <SettingSection icon={User} title={"Profile"}>
            <div className="flex flex-col sm:flex-row items-center mb-6">
              {userDetails?.photo ? (
                <img
                  src={userDetails.photo}
                  alt={userDetails?.firstName || "Admin"}
                  className="rounded-full w-20 h-20 object-cover mr-4"
                />
              ) : (
                <div className="rounded-full w-20 h-20 bg-gray-300 flex items-center justify-center text-white font-bold text-xl mr-4">
                  {userDetails?.firstName?.charAt(0)?.toUpperCase() || ""}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold">
                  {userDetails.firstName}
                </h3>
                <p className="">{userDetails.email}</p>
              </div>
            </div>
          </SettingSection>
          {/* <Outlet /> */}
        </>
      ) : (
        <p className="bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 mb-8">
          Loading...
        </p>
      )}
    </div>
  );
};

export default Profile;
