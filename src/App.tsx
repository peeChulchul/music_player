import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./screen/Home";
import ModifyMusicZone from "./screen/ModifyMusicZone";
import DetailMusicZone from "./screen/DetailMusicZone";
import Layout from "./screen/Layout";
import ModalContainer from "./components/portal/ModalContainer";
import FullPageLoading from "./components/portal/FullPageLoading";

import { supabase } from "./service/client";
import { getEqTable } from "./service/tableService";

import useloadingStore from "./store/loadingStore";
import { TrackProvider } from "./store/trackContext";
import useSessionStore from "./store/sessionStore";

function Router() {
  const { setSession, setUserTable, clerSession } = useSessionStore();
  const { closeLoading } = useloadingStore();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        closeLoading();
        console.log(session);
        console.log(event);
        if (session) {
          if (event === "SIGNED_OUT") {
            clerSession();
            return;
          }
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
