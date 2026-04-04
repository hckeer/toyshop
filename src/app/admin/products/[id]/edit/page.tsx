import { getProductById } from '@/lib/actions'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return <ProductForm product={product} />
}
