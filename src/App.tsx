import React, { useEffect, useState } from "react";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import AddMusicZone from "./screen/AddMusicZone";
import DetailMusicZone from "./screen/DetailMusicZone";
import Layout from "./screen/Layout";
import { supabase } from "./service/client";
import useSessionStore from "./store/sessionStore";

function Router() {
  const { setSession } = useSessionStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      console.log(session);
    };

    fetchSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path=":userId/addMusicZone" element={<AddMusicZone />} />
          <Route path=":musicZoneId" element={<DetailMusicZone />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const App = () => {
  return <Router />;
};

export default App;
