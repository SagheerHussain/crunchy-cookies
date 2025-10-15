import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";
import { CiLock } from "react-icons/ci";

const API_BASE = "https://crunchy-cookies-server.onrender.com/api/v1";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    dob: "", // yyyy-mm-dd from <input type="date">
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    const { firstName, lastName, email, password } = form;
    if (!firstName || !lastName || !email || !password) {
      setErr("First name, last name, email and password are required.");
      return;
    }

    setLoading(true);
    try {
      // Convert dob (yyyy-mm-dd) -> ISO if provided
      const payload = {
        ...form,
        dob: form.dob ? new Date(form.dob).toISOString() : undefined,
      };

      const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Registration failed");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data?.token || "",
          user: data?.data || null,
        })
      );

      navigate("/", { replace: true });
    } catch (e) {
      setErr(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-[#F7F5F0] py-20 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-[0_6px_28px_rgba(0,0,0,0.08)] border border-gray-200 p-6 sm:p-8">
          <h1 className="text-center text-3xl sm:text-[34px] leading-tight font-serif text-[#0a4c4f]">
            Create your account
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Sign up with your details
          </p>

          {err && (
            <div className="mt-4 mb-2 rounded-md bg-red-50 text-red-700 text-sm p-3">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First / Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  value={form.firstName}
                  onChange={onChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                  value={form.lastName}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <label className="block mt-6 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-2 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail className="text-lg" />
              </span>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                value={form.email}
                onChange={onChange}
                autoComplete="email"
                required
              />
            </div>

            {/* Phone */}
            <label className="block mt-6 text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter phone (optional)"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              value={form.phone}
              onChange={onChange}
            />

            {/* DOB */}
            <label className="block mt-6 text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              name="dob"
              type="date"
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
              value={form.dob}
              onChange={onChange}
            />

            {/* Password */}
            <label className="block mt-6 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-2 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <CiLock className="text-lg" />
              </span>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-[#0b5a5e] text-white font-semibold py-3.5 tracking-wide hover:bg-[#0a4f52] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0b5a5e] transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-gray-400 text-sm">Or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-teal-700 underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
