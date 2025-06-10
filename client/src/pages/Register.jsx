import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

export default function Register() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  const schema = Yup.object({
    email: Yup.string()
      .email("Nieprawidłowy format email")
      .required("Email jest wymagany"),
    password: Yup.string()
      .min(6, "Hasło musi mieć przynajmniej 6 znaków")
      .required("Hasło jest wymagane"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={schema}
      onSubmit={async (vals, { setFieldError }) => {
        try {
          await api.post("/auth/register", vals);
          setMsg("Konto utworzone pomyślnie, logowanie...");
          const { data } = await api.post("/auth/login", vals);
          localStorage.setItem("token", data.token);
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          localStorage.setItem("role", payload.role);
          setTimeout(() => navigate("/"), 2000);
        } catch (err) {
          const status = err.response?.status;
          const m = err.response?.data?.msg;
          if (status === 409) setFieldError("email", "Taki email już istnieje");
          else setFieldError("email", m || "Rejestracja nie powiodła się");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="w-50 mx-auto">
          <h3>Rejestracja</h3>
          {msg && <div className="alert alert-success">{msg}</div>}
          <div className="mb-3">
            <Field name="email" className="form-control" placeholder="Email" />
            {touched.email && errors.email && (
              <div className="text-danger">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <Field
              name="password"
              type="password"
              className="form-control"
              placeholder="Hasło"
            />
            {touched.password && errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Zarejestruj
          </button>
          <div className="mt-3">
            <BackButton label="Anuluj" />

          </div>
        </Form>
      )}
    </Formik>
  );
}
