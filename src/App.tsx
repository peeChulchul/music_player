import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screen/Home";
import ModifyMusicZone from "./screen/ModifyMusicZone";
import DetailMusicZone from "./screen/DetailMusicZone";
import Layout from "./screen/Layout";
import { supabase } from "./service/client";
import useSessionStore from "./store/sessionStore";
import { getAllTable, getEqTable } from "./service/tableService";
import FullPageLoading from "./components/overlay/FullPageLoading";
import useloadingStore from "./store/loadingStore";
import ModalContainer from "./components/overlay/ModalContainer";
import { TrackProvider } from "./store/trackContext";

function Router() {
  const { session, setSession, setUserTable, clerSession } = useSessionStore();
  const { closeLoading } = useloadingStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        closeLoading();

        if (event === "SIGNED_IN") {
          getEqTable({
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
            path="ModifyMusicZone/:userId/:musicZoneId"
            element={
              <TrackProvider>
                <ModifyMusicZone />
              </TrackProvider>
            }
          />
          <Route
            path="DetailMusicZone/:musicZoneId"
            element={<DetailMusicZone />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const App = () => {
  return <Router />;
};

export default App;
