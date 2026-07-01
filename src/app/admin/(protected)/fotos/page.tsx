import { getGallery } from "@/actions/actions";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import GalleryPhotoGrid from "@/components/admin/GalleryPhotoGrid";

export default async function AdminFotosPage() {
  const photos = await getGallery();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Gerenciar Galeria</h1>
        <p className="text-gray-500 mt-1">Adicione ou remova fotos do restaurante</p>
      </div>

      <GalleryUploadForm />
      <GalleryPhotoGrid photos={photos} />
    </div>
  );
}
