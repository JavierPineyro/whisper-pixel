'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'

import { ThemeProvider as StaticProvider, type ThemeProviderProps } from 'next-themes'
const DynProvider = dynamic(
	() => import('next-themes').then((e) => e.ThemeProvider),
	{
		ssr: false,
	}
)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const NextThemeProvider = process.env.NODE_ENV === 'production' ? 
        StaticProvider 
        : DynProvider
	return <NextThemeProvider {...props}>{children}</NextThemeProvider>
}