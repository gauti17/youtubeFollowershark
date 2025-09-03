import React, { createContext, useContext, useReducer, useEffect } from 'react'

export interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  selectedOptions: {
    speed?: string
    target?: string
    url?: string
    selectedQuantity?: number
  }
  timestamp: number
}

interface CartState {
  items: CartItem[]
  total: number
  isLoading: boolean
  loadingOperations: Set<string>
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Omit<CartState, 'isLoading' | 'loadingOperations'> }
  | { type: 'SET_LOADING'; payload: { operation: string; loading: boolean } }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'id' | 'timestamp'>) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  isOperationLoading: (operation: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = {
        ...action.payload,
        id: `${action.payload.productId}_${Date.now()}`,
        timestamp: Date.now()
      }
      
      const updatedItems = [...state.items, newItem]
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: updatedItems,
        total
      }
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: updatedItems,
        total
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: updatedItems,
        total
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        total: 0
      }
    
    case 'LOAD_CART':
      return {
        ...action.payload,
        isLoading: false,
        loadingOperations: new Set()
      }
    
    case 'SET_LOADING': {
      const newLoadingOperations = new Set(state.loadingOperations)
      if (action.payload.loading) {
        newLoadingOperations.add(action.payload.operation)
      } else {
        newLoadingOperations.delete(action.payload.operation)
      }
      return {
        ...state,
        loadingOperations: newLoadingOperations
      }
    }
    
    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    default:
      return state
  }
}

interface CartProviderProps {
  children: React.ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    isLoading: false,
    loadingOperations: new Set<string>()
  })
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('youshark_cart')
    console.log('Loading cart from localStorage:', savedCart)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        console.log('Parsed cart data:', parsedCart)
        dispatch({ type: 'LOAD_CART', payload: parsedCart })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving cart to localStorage:', state)
      localStorage.setItem('youshark_cart', JSON.stringify(state))
    }
  }, [state, isLoaded])

  const addItem = async (item: Omit<CartItem, 'id' | 'timestamp'>) => {
    const operationId = `add_${Date.now()}`
    try {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: true } })
      // Simulate API delay for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'ADD_ITEM', payload: item as CartItem })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: false } })
    }
  }

  const removeItem = async (id: string) => {
    const operationId = `remove_${id}`
    try {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: true } })
      await new Promise(resolve => setTimeout(resolve, 200))
      dispatch({ type: 'REMOVE_ITEM', payload: id })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: false } })
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    const operationId = `update_${id}`
    try {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: true } })
      await new Promise(resolve => setTimeout(resolve, 200))
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: false } })
    }
  }

  const clearCart = async () => {
    const operationId = 'clear_cart'
    try {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: true } })
      await new Promise(resolve => setTimeout(resolve, 300))
      dispatch({ type: 'CLEAR_CART' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { operation: operationId, loading: false } })
    }
  }

  const isOperationLoading = (operation: string) => {
    return state.loadingOperations.has(operation)
  }

  const contextValue: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isOperationLoading
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export { CartContext }