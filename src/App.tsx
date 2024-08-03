import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import AddMusicZone from "./screen/AddMusicZone";
import DetailMusicZone from "./screen/DetailMusicZone";
import Layout from "./screen/Layout";
import { supabase } from "./service/client";
import useSessionStore from "./store/sessionStore";
import { getAllTable } from "./service/tableService";
import FullPageLoading from "./components/overlay/FullPageLoading";
import useloadingStore from "./store/loadingStore";
import ModalContainer from "./components/overlay/modal/ModalContainer";

function Router() {
  const { session, setSession, setUserTable, clerSession } = useSessionStore();
  const { closeLoading } = useloadingStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        closeLoading();

        if (event === "SIGNED_IN") {
          getAllTable({
            eqKey: "id",
            eqValue: session!.user.id,
            tableName: "user",
          }).then((rows: any[]) => {
            setUserTable(rows[0]);
            setSession(session);
          });
          return;
        }
        if (event === "SIGNED_OUT") {
          clerSession();
          return;
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <ModalContainer />
      <FullPageLoading />
      {/* <FullPageLoading /> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="addMusicZone/:userId/:musicZoneId"
            element={<AddMusicZone />}
          />
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
