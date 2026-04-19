import Lottie from "lottie-react";
import loaderAnimation from "../../assets/Video_Cam.json";

const Loader = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-sm bg-black/40">
      <div className="w-40 h-40">
        <Lottie animationData={loaderAnimation} loop={true} />
      </div>
    </div>
  );
};

export default Loader;
