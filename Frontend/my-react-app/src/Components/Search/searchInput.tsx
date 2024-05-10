import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
const SearchInput = () => {
    const [active, setActive] = useState(false)
    const activateSearch = () => {
        setActive(true)
    }
    const fullSearchRef = useRef<HTMLDivElement | null>(null)
    const closeSearch = (e: MouseEvent) => {
        if (!fullSearchRef.current?.contains(e.target as Node)) {
            console.log(e.currentTarget, fullSearchRef.current)
            setActive(false)
        }
    }
    useEffect(() => {
        document.addEventListener("mousedown", closeSearch)
        return (() => document.removeEventListener("mousedown", closeSearch))
    })
    return (
        <>
            {!active ? <span className="cursor-pointer" onClick={activateSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-6 fill-zinc-600 hover:fill-zinc-950 transition ease-in-out duration-300"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            </span> :
            <form action="">
                    <motion.div className='inline-flex relative w-full max-h-max h-fit items-center gap-x-4' ref={fullSearchRef} animate={{ width: "100%" }} initial={{ width: "30%" }} transition={{ type: "spring", stiffness: 60 }}>
                        <input required placeholder='Type in your email' className='form-control-medium pe-4 px-8 ps-10 shadow bg-slate-100 m-0 rounded-full relative form-control  w-full  leading-4 border-none h-fit outline-none outline-offset-0 active:outline-none text-sm' type="searcg" name="search" id="" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="absolute cursor-default ml-3 size-5 fill-zinc-600"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                    </motion.div>

            </form>
            }
        </>
    )
}

export default SearchInput
