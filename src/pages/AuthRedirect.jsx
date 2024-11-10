import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { url } from "../baseUrl";
import { AuthContext } from "../context/Auth";

export default function AuthRedirect() {
  const [err, setErr] = useState(undefined);
  const [query] = useSearchParams();
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UID:", query.get("uid"));
    console.log("Access Token:", query.get("access_token"));
    console.log("Refresh Token:", query.get("refresh_token"));

    axios
      .get(`${url}/user/get/${query.get("uid")}`)
      .then((res) => {
        console.log("Response data:", res.data); // Debug the backend response
        if (!res.data.success) {
          setErr("Something unexpected happened");
          localStorage.clear();
          return;
        }
        localStorage.setItem("access_token", query.get("access_token"));
        localStorage.setItem("refresh_token", query.get("refresh_token"));
        localStorage.setItem("user", JSON.stringify(res.data));
        context.setAuth(res.data);
        navigate("/");
      })
      .catch((err) => {
        console.error("Request failed:", err); // Log network error
        setErr("Something unexpected happened");
        localStorage.clear();
      });
  }, [context, navigate, query]);

  return (
    <div style={{ textAlign: "center", marginTop: "6vh" }}>
      {err ? err : "Redirecting ..."}
    </div>
  );
}
