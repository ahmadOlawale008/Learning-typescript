import React, { ButtonHTMLAttributes, MouseEventHandler } from 'react'

export interface PostType {
    id: number,
    title: string,
    author: string,
    category: number,
    status: "published" | "draft"
}
export interface PostTypeB  extends PostType{
    action?: MouseEventHandler<HTMLButtonElement>
}
const Card = ({id, title, author, category, status, action}: PostTypeB) => {
    return (
        <div>
            <div className='flex space-y-4 py-3 px-2 rounded-lg flex-col w-full bg-white shadow'>
                <img src={"https://images.unsplash.com/photo-1629752187687-3d3c7ea3a21b?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} className='h-96 bg-cover bg w-full' />
                <div className='flex flex-col space-y-6 tracking-tight  text-black'>
                    <h5 className='text-3xl font-semibold'>{title}</h5>
                    <p className='font-normal text-sm'>@{author}</p>
                    <span className="flex flex-row">
                        <p className='font-normal'>{category}</p>
                        <p className="font-normal">{status}</p>
                    </span>
                </div>
                <button onClick={action} className='btn btn-primary-filled w-full'>Click</button>
            </div>
        </div>
    )
}

export default Card
