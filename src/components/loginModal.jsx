import { useState } from "react";

const LoginModal = ({
  isModalOpen,
  setIsModalOpen,
  isRegisterOpen,
  setIsRegisterOpen,
}) => {

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

            <form className="vertical-form">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {name && !nameIsValid && (
                <p style={{ color: "red" }}>
                  Name must contain only letters
                </p>
              )}

              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                required
              />
              {phone && !phoneIsValid && (
                <p style={{ color: "red" }}>
                  Phone must be exactly 10 digits
                </p>
              )}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input type="password" placeholder="Password" required />

              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;
