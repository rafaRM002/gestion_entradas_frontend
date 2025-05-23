"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utilities/apirest";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  function realizarRegistro(event) {
    event.preventDefault();

    // Validación de contraseña
    if (password !== password_confirmation) {
      setErrorMessage("Las contraseñas no coinciden. Inténtalo de nuevo.");
      return;
    }

    // Validar longitud mínima
    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    // Validar seguridad de la contraseña
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      setErrorMessage(
        "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales."
      );
      return;
    }

    const url = API_URL + "api/register";
    axios
      .post(url, {
        Nombre: nombre,
        Apellidos: apellidos,
        Fecha_nacimiento: fecha_nacimiento,
        Email: email,
        Password: password,
        Password_confirmation: password_confirmation,
      })
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          // Si el registro es exitoso, podemos guardar el token si la API lo devuelve
          if (response.data.token) {
            const token = response.data.token.split("|")[1];
            localStorage.setItem("authToken", token);
          }
          setErrorMessage(null);
          navigate("/home"); // Redirigir al login después del registro exitoso
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response) {
          if (error.response.status === 422) {
            setErrorMessage(
              "El email ya está registrado o los datos son inválidos."
            );
          } else {
            setErrorMessage("Error al registrar. Inténtalo de nuevo.");
          }
        } else {
          setErrorMessage("Error de conexión. Por favor, intenta más tarde.");
        }
      });
  }

  function getPasswordStrength(password) {
    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 1;

    if (strength <= 2) return { text: "Débil", color: "bg-red-500" };
    if (strength <= 4) return { text: "Media", color: "bg-yellow-500" };
    return { text: "Fuerte", color: "bg-green-500" };
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-10 my-3 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-24 h-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">REGISTRO</h1>
        </div>

        {errorMessage && (
          <div className="text-sm text-center text-red-700 bg-red-50 rounded py-2 mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={realizarRegistro} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
              placeholder="username"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {password && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="text-xs">Seguridad:</div>
                  <div
                    className={`h-2 w-full rounded ${
                      getPasswordStrength(password).color
                    }`}
                  ></div>
                  <div className="text-xs">
                    {getPasswordStrength(password).text}
                  </div>
                </div>
                <ul className="text-xs text-gray-600 mt-1 space-y-1">
                  <li
                    className={
                      password.length >= 6 ? "text-green-600" : "text-gray-600"
                    }
                  >
                    ✓ Mínimo 6 caracteres
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(password)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ Al menos una mayúscula
                  </li>
                  <li
                    className={
                      /[a-z]/.test(password)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ Al menos una minúscula
                  </li>
                  <li
                    className={
                      /\d/.test(password) ? "text-green-600" : "text-gray-600"
                    }
                  >
                    ✓ Al menos un número
                  </li>
                  <li
                    className={
                      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  >
                    ✓ Al menos un carácter especial
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white text-gray-800"
              placeholder="********"
              value={password_confirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Registrarse
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <span className="underline cursor-pointer hover:text-gray-800">
            <a href="/">Iniciar Sesión</a>
          </span>
        </p>
      </div>
    </div>
  );
}
