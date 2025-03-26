'use client'

import { ChildProps, IError } from '@/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC } from 'react'
import { toast } from 'sonner'

const handleQueryError = (error: Error | IError) => {
	if ('response' in error && error.response?.data?.message) {
		return toast(error.response.data.message)
	}
	return toast('Something went wrong')
}

const queryClient = new QueryClient({
	defaultOptions: {
		mutations: { onError: handleQueryError },
	},
})

const QueryProvider: FC<ChildProps> = ({ children }) => {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default QueryProvider