import React, { Dispatch, MouseEventHandler, SetStateAction, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
const NavbarMenu = ({ state, setState }: { state: Boolean, setState: Dispatch<SetStateAction<boolean>> }) => {
    const ref = useRef<HTMLDivElement>(null)
    const handleClose = () => {
        setState(false)
    }
    const handleMouseDownClose = (e: MouseEvent) => {
        if (!ref.current?.contains(e.target as Node)) {
            setState(false)
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", handleMouseDownClose)
        return () => { document.removeEventListener("mousedown", handleMouseDownClose) }
    }, [])
    const conntainerVariants = {
        hidden: {
            "opcaity": 0.5,
            "scale": 0,
            boxShadow: "none"
        },
        visible: {
            "opacity": 1,
            "scale": 1,
            "box-shadow": "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
            transition: { type: 'spring', bounce: 0, delay: 0, when: "beforeChildren", staggerChildren: 0.09 }
        }
    }
    const childrenVariants = {
        hidden: {
            "opacity": 0.6,
            "x": -100
        },
        visible: {
            "opacity": 1,
            "x": 0,
            transition: { type: "spring", stiffness: 130 }
        }
    }
    return (
        <div ref={ref} id="menudropdown" className={`absolute md:w-80 lg:w-80 sm:w-60 xs:w-52 min-w-full right-0  translate-x-[3px] translate-y-[32px] top-0 left-0 ${!state && "hidden"}`}>
            <motion.div variants={conntainerVariants} animate="visible" initial="hidden" className={`list-none bg-white py-1Z rounded-sm  h-fit flex flex-col before:content-[""] before:absolute before:-top-[0.30rem] before:z-[-1] 
        before:left-5 before:size-3 before:rounded-sm w-full divide-y-2 divide-neutral-100 overflow-hidden before:transform before:rotate-45 before:bg-white before:border-l-[1px]
         before:border-t-[1px] divide-transparent shadow-md  border-black/10 `}>
                <motion.a variants={childrenVariants} href='#' onClick={handleClose} className='h-fit hover:bg-neutral-200/50 hover:transition-all ease-in-out cursor-pointer  pl-2 py-2 w-full'>
                    <div className='flex flex-col'>
                        <span className='font-medium'>More A</span>
                        <span className='text-sm font-light'>Little</span>
                    </div>
                </motion.a>
                <motion.a variants={childrenVariants} href='#' onClick={handleClose} className=' hover:bg-neutral-200/50 hover:transition-all ease-in-out cursor-pointer  pl-2 py-2 w-full'>
                    <div className='flex flex-col'>
                        <span className='font-medium'>More A</span>
                        <span className='text-sm font-light'>Little</span>
                    </div>
                </motion.a>
                <motion.a variants={childrenVariants} href='#' onClick={handleClose} className=' hover:bg-neutral-200/50 hover:transition-all ease-in-out cursor-pointer  pl-2 py-2 w-full'>
                    <div className='flex flex-col'>
                        <span className='font-medium'>More A</span>
                        <span className='text-sm font-light'>Little</span>
                    </div>
                </motion.a>
            </motion.div>
        </div>
    )
}
export default NavbarMenu
