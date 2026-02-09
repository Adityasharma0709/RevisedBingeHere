import { useState } from "react";
import Button from "./ui/button";
import Input from "./ui/Input";

const LoginModal = ({ isRegisterOpen, setIsRegisterOpen }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const nameIsValid = /^[A-Za-z\s]+$/.test(name);
  const phoneIsValid = /^\d{10}$/.test(phone);

  return (
    <>
      {isRegisterOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsRegisterOpen(false)}
        >
          <div
            className="modal-content slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-icon"
              onClick={() => setIsRegisterOpen(false)}
            >
              &times;
            </button>

            <h2>Register</h2>

            <form className="vertical-form space-y-3">

              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                color={name && !nameIsValid ? "danger" : "neutral"}
              />
              {name && !nameIsValid && (
                <p className="text-red-500 text-xs">
                  Name must contain only letters
                </p>
              )}

              <Input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                color={phone && !phoneIsValid ? "danger" : "primary"}
              />
              {phone && !phoneIsValid && (
                <p className="text-red-500 text-xs">
                  Phone must be exactly 10 digits
                </p>
              )}

              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Password"
              />

              <Button
                variant="solid"
                color="danger"
                className="w-full"
              >
                Create Account
              </Button>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
