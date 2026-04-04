export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
}

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const data: CloudinaryUploadResult = await response.json()
  return data.secure_url
}

export async function uploadMultipleToCloudinary(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadToCloudinary(file))
  return Promise.all(uploadPromises)
}
