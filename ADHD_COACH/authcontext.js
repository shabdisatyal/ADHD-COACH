
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "./supabaseClient";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [session, setSession] = useState(undefined); // undefined as in "still checking"

//   useEffect(() => {
//    //this checks on load
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//     });

   
//     const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
//       setSession(newSession);
//     });
// //clean
//     return () => listener.subscription.unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ session }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);