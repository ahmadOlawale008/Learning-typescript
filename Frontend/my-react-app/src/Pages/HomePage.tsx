import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import Card, { PostType } from '../Components/Card/card'
import { AxiosInstance, AxiosResponse } from 'axios'
import useAxios from '../Utils/useAxios'
import ButtonLoadingIcon from '../Utils/loadingIcon'
const HomePage = () => {
  const [postsRes, SetPostsRes] = useState<AxiosResponse | null>(null)
  const [postLoading, setPostLoadState] = useState(false)
  let api = useAxios()
  const postApi = async () => {
    setPostLoadState(true)
    try {
      const response = await api.get("")
      if (response.status === 200) {
        console.log(response, "successfull")
        setPostLoadState(false)
        SetPostsRes(response)
      }
    } catch (error) {
      setPostLoadState(false)
      console.log(error, "Homepage")
    }
  }
  useEffect(() => {
    postApi()
  }, [])
  console.log(postsRes?.data)
  return (
    <>
      {!postsRes?.data ? <div className='flex m-auto items-center justify-center'><ButtonLoadingIcon size={"h-16 w-16"} color='red' /></div> :
        <div className='px-2 py-3'>
          {postsRes.data.map((e: PostType) =>
            <div className='grid grid-cols-3  gap-x-2 gap-y-1'>
              <Card {...e} />
            </div>
          )}
        </div>
      }
    </>
  )
}

export default HomePage
