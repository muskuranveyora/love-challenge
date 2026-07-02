import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Upload, RefreshCw } from "lucide-react";

import GlassCard from "./GlassCard";
import { HeartButton } from "./HeartButton";
import { TID } from "../constants/testIds";
import { sounds } from "../lib/sounds";
import { uploadFile } from "../lib/cloudinary";

export default function PhotoTask({ taskNum, emoji, title, hint, onComplete }) {
  const [preview, setPreview] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.pop();
    setPhotoUrl("");

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setUploading(true);

    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
    } catch (err) {
      console.error(err);
      setPhotoUrl("");
      setPreview(null);
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      alert("Photo upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const openPicker = () => {
    sounds.heart();
    inputRef.current?.click();
  };

  const reset = () => {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    setPhotoUrl("");
    setUploading(false);
    sounds.pop();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <GlassCard data-testid={TID.taskCard(taskNum)}>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-2">{emoji}</div>

          <p className="font-script text-2xl text-love-muted mb-1">
            Task {taskNum} of 5
          </p>

          <h2
            data-testid={TID.taskTitle(taskNum)}
            className="font-script text-3xl sm:text-4xl text-love-burgundy"
          >
            {title}
          </h2>

          {hint && (
            <p className="mt-2 font-body text-sm text-love-muted">
              {hint}
            </p>
          )}
        </div>

        <input
          ref={inputRef}
          data-testid={TID.photoInput(taskNum)}
          type="file"
          accept="image/*"
          capture="user"
          onChange={onPick}
          className="hidden"
        />

        {!preview ? (
          <motion.button
            type="button"
            data-testid={TID.photoDropzone(taskNum)}
            onClick={openPicker}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-dashed border-pink-300 rounded-3xl p-8 flex flex-col items-center justify-center bg-white/40 hover:bg-white/60 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center shadow-md">
              <Camera size={26} className="text-white" />
            </div>

            <p className="mt-4 font-bold text-love-burgundy">
              Tap to upload a photo
            </p>

            <p className="text-xs text-love-muted flex items-center gap-1 mt-1">
              <Upload size={12} />
              Camera or Gallery
            </p>
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <img
              src={preview}
              alt="Preview"
              data-testid={TID.photoPreview(taskNum)}
              className="w-full h-72 object-cover rounded-3xl border-4 border-white shadow-lg"
            />

            <button
              type="button"
              data-testid={TID.photoRetakeBtn(taskNum)}
              onClick={reset}
              className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition"
            >
              <RefreshCw size={18} />
            </button>
          </motion.div>
        )}

        <HeartButton
          onClick={() => onComplete({ photoUrl })}
          disabled={!photoUrl || uploading}
          testId={TID.taskNextBtn(taskNum)}
        >
          {uploading
            ? "Uploading..."
            : photoUrl
              ? "Looks adorable, continue"
              : "Upload a photo first"}
        </HeartButton>
      </div>
    </GlassCard>
  );
}
