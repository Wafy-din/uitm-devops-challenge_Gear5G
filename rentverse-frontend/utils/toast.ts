import toast from 'react-hot-toast'

interface ToastOptions {
  duration?: number
  position?: string
  [key: string]: unknown
}

export const showToast = {
  success: (message: string) => {
    toast.success(message)
  },
  
  error: (message: string) => {
    toast.error(message)
  },
  
  loading: (message: string) => {
    return toast.loading(message)
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string
      error: string
    }
  ) => {
    return toast.promise(promise, messages)
  },
  
  custom: (message: string, options?: ToastOptions) => {
    toast(message, options)
  },
  
  dismiss: (toastId?: string) => {
    toast.dismiss(toastId)
  },
}

export default showToast
