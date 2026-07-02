import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Lock, Eye, EyeOff } from "lucide-react";

const PASSWORD = "Mehak@134";

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const login = () => {
    if (password.trim() === PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      onSuccess();
    } else {
      setError("Wrong Password");
      setPassword("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") login();
  };

  return (
    <div className="min-h-screen romantic-bg flex items-center justify-center p-5">

      <motion.div
        initial={{ opacity: 0, scale: .9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .35 }}
        className="w-full max-w-md rounded-[32px] bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-8"
      >

        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-pink-500 flex items-center justify-center shadow-xl">
            <Heart fill="white" className="text-white" size={36}/>
          </div>
        </div>

        <h1 className="text-center text-4xl font-bold text-love-burgundy">
          Love Challenge
        </h1>

        <p className="text-center text-love-muted mt-2 mb-8">
          Admin Dashboard
        </p>

        <div className="relative">

          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-love-muted"
          />

          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onKeyDown={handleKeyDown}
            onChange={(e)=>{
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full rounded-2xl bg-white/70 pl-12 pr-14 py-4 outline-none border border-pink-200 text-love-burgundy"
          />

          <button
            type="button"
            onClick={()=>setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {show ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>

        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="mt-7 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 py-4 text-white font-bold text-lg shadow-xl hover:scale-[1.02] transition"
        >
          Login
        </button>

        <p className="mt-6 text-center text-xs text-love-muted">
          Protected Dashboard • Love Challenge ❤️
        </p>

      </motion.div>

    </div>
  );
}