import React, { useContext, useState } from "react"
import { getDoc,doc,setDoc,getDocs, collection, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebaseConfig";
import { useHistory } from "react-router-dom";
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const history = useHistory();
  const [loginStatus, setLoginStatus] = useState(false)

  function login() {
    setLoginStatus(true)
  }
  const fetch_User_Doc_Data = async(type) =>{
    const querySnapshot = await getDoc(doc(db, "user",type));
    return querySnapshot.data();
  }
  const update_User_Doc_Data = async(type,data) =>{
    await setDoc(doc(db, "user", type), data);
    alert('儲存成功')
    history.goBack()
  }
  const fetch_Collection_Data = async(collection_name,collection_list) =>{
    const querySnapshot = await getDocs(collection(db, "user", collection_name,collection_list));
    let array = []
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    return array;
  }
  const update_User_Collection_Data = async(collection_name,collection_list,update_name,data) =>{
    await setDoc(doc(db, "user", collection_name,collection_list,update_name), data);
    alert('儲存成功')
    history.goBack()
  }
  const delete_User_Collection_Data = async(collection_name,collection_list,delete_name)=>{
    const yes = window.confirm('確定刪除嗎？')
    if (!yes) return;
    await deleteDoc(doc(db, "user", collection_name,collection_list,delete_name))
    alert('刪除成功')
  }

  
  // function logout() {
  //   return auth.signOut()
  // }

  // function resetPassword(email) {
  //   return auth.sendPasswordResetEmail(email)
  // }

  const value = {
    loginStatus,
    login,
    fetch_User_Doc_Data,
    update_User_Doc_Data,
    fetch_Collection_Data,
    update_User_Collection_Data,
    delete_User_Collection_Data,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}