import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // This endpoint helps clear localStorage cart for debugging
  // Since we can't directly access localStorage from the server,
  // we'll return instructions for manual clearing
  
  return res.status(200).json({
    success: true,
    message: 'To clear cart, run: localStorage.removeItem("youshark_cart") in browser console',
    localStorage_key: 'youshark_cart'
  })
}