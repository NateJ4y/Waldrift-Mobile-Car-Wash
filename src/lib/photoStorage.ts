import { supabase } from './supabase';

const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
  const response = await fetch(dataUrl);
  return response.blob();
};

export const uploadUserPhoto = async (dataUrl: string, userId: string) => {
  if (!userId) throw new Error('You must be signed in before uploading a photo.');

  const blob = await dataUrlToBlob(dataUrl);
  const extension = blob.type.split('/')[1] || 'jpg';
  const fileName = `vehicle-${Date.now()}.${extension}`;
  const storagePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('vehicle-photos')
    .upload(storagePath, blob, { contentType: blob.type || 'image/jpeg', upsert: false });

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage
    .from('vehicle-photos')
    .getPublicUrl(storagePath);

  const { data: reference, error: referenceError } = await supabase
    .from('photo_references')
    .insert({
      user_id: userId,
      bucket_id: 'vehicle-photos',
      storage_path: storagePath,
      public_url: publicData.publicUrl,
      file_name: fileName,
      mime_type: blob.type || 'image/jpeg',
      size_bytes: blob.size,
    })
    .select()
    .single();

  if (referenceError) {
    await supabase.storage.from('vehicle-photos').remove([storagePath]);
    throw referenceError;
  }

  return reference;
};
