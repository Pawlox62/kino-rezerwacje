import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import api from "../api/axios";

export default function Login() {
  const navigate = useNavigate();

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
          const { data } = await api.post("/auth/login", vals);
          localStorage.setItem("token", data.token);
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          localStorage.setItem("role", payload.role);
          navigate("/");
        } catch {
          setFieldError("email", "Nieprawidłowy email lub hasło");
        }
      }}
    >
      {({ errors, touched }) => (
        <Form className="w-50 mx-auto">
          <h3>Logowanie</h3>
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
          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-primary">
              Zaloguj
            </button>
            <Link to="/register" className="btn btn-link">
              Załóż konto
            </Link>
          </div>
        </Form>
      )}
    </Formik>
  );
}
