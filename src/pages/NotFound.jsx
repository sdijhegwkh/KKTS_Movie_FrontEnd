import { Link } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const NotFound = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-6">
          Trang không tồn tại
        </h2>
        <p className="text-gray-300 mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/home"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-all inline-block"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </MainLayout>
  );
};

export default NotFound;
