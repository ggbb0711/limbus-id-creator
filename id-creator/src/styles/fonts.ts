import { Rubik } from 'next/font/google'
import localFont from 'next/font/local'

export const rubik = Rubik({
    subsets: ['latin'],
    style: ['normal', 'italic'],
    variable: '--font-rubik',
    display: 'swap',
})

export const mikodacs = localFont({
    src: '../assets/fonts/mikodacs/mikodacs.regular.ttf',
    weight: '400',
    variable: '--font-mikodacs',
    display: 'swap',
})
